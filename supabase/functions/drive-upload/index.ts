import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;
const MAX_THUMBNAIL_BYTES = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['video/mp4', 'video/webm']);
const ALLOWED_THUMBNAIL_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_ATTACHMENT_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']);

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map((value) => value.trim()).filter(Boolean);
  const corsOrigin = allowedOrigins.includes(origin) ? origin : '';
  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'POST 요청만 지원합니다.' }, 405);
  if (!corsOrigin) return json({ error: '허용되지 않은 사이트입니다.' }, 403);

  try {
    const authorization = req.headers.get('authorization') || '';
    const jwt = authorization.replace(/^Bearer\s+/i, '');
    if (!jwt) return json({ error: '관리자 로그인이 필요합니다.' }, 401);
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || user?.app_metadata?.role !== 'admin') return json({ error: '관리자 권한이 필요합니다.' }, 403);

    const appScriptUrl = Deno.env.get('APPS_SCRIPT_WEB_APP_URL');
    const appScriptSecret = Deno.env.get('APPS_SCRIPT_SHARED_SECRET');
    if (!appScriptUrl || !appScriptSecret) {
      return json({ error: 'Supabase Edge Function에 Apps Script 연결 설정이 필요합니다.' }, 500);
    }
    const body = await req.json();
    if (!['start', 'share', 'delete'].includes(body.action)) return json({ error: '지원하지 않는 작업입니다.' }, 400);
    if (body.action === 'start') {
      const kind = ['attachment', 'thumbnail'].includes(body.kind) ? body.kind : 'video';
      const mimeType = String(body.mimeType || '');
      const size = Number(body.size);
      const allowedTypes = kind === 'attachment' ? ALLOWED_ATTACHMENT_TYPES : kind === 'thumbnail' ? ALLOWED_THUMBNAIL_TYPES : ALLOWED_TYPES;
      const maxBytes = kind === 'attachment' ? MAX_ATTACHMENT_BYTES : kind === 'thumbnail' ? MAX_THUMBNAIL_BYTES : MAX_VIDEO_BYTES;
      if (!allowedTypes.has(mimeType) || !Number.isSafeInteger(size) || size < 1 || size > maxBytes) {
        const message = kind === 'attachment'
          ? 'PDF·이미지·텍스트·Office 문서, 파일당 최대 20MB까지 첨부할 수 있습니다.'
          : kind === 'thumbnail'
            ? 'JPG/PNG/WebP 썸네일, 최대 20MB 파일만 업로드할 수 있습니다.'
            : 'MP4/WebM 동영상, 최대 100MB 파일만 업로드할 수 있습니다.';
        return json({ error: message }, 400);
      }
    }
    if (['share', 'delete'].includes(body.action) && !/^[A-Za-z0-9_-]{10,}$/.test(String(body.fileId || ''))) {
      return json({ error: '잘못된 Google Drive 파일 ID입니다.' }, 400);
    }

    // Apps Script creates the resumable session; the browser then streams the file
    // directly to Google Drive, so large videos do not pass through Supabase.
    const bridgeResponse = await fetch(appScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, sharedSecret: appScriptSecret }),
      signal: AbortSignal.timeout(30000),
    });
    const bridgeText = await bridgeResponse.text();
    let result: Record<string, unknown>;
    try { result = JSON.parse(bridgeText); } catch {
      console.error('Apps Script returned a non-JSON response', bridgeResponse.status);
      return json({ error: 'Apps Script 응답을 읽지 못했습니다. 배포 URL과 접근 권한을 확인해 주세요.' }, 502);
    }
    if (!bridgeResponse.ok || result.error) {
      return json({ error: String(result.error || 'Apps Script에서 Google Drive 요청을 처리하지 못했습니다.') }, bridgeResponse.ok ? 502 : bridgeResponse.status);
    }
    if (body.action === 'start' && (typeof result.uploadUrl !== 'string' || !result.uploadUrl.startsWith('https://www.googleapis.com/'))) {
      return json({ error: 'Google Drive 업로드 주소가 올바르지 않습니다.' }, 502);
    }
    return json(result);
  } catch (error) {
    console.error('Drive upload function error', error);
    return json({ error: 'Google Drive 요청을 처리하지 못했습니다.' }, 500);
  }
});
