import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_THUMBNAIL_BYTES = 20 * 1024 * 1024;
const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm']);
const THUMBNAIL_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ATTACHMENT_TYPES = new Set([
  'application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

type JsonRecord = Record<string, any>;

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '')
    .split(',').map((value) => value.trim()).filter(Boolean);
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
  if (!corsOrigin) return json({ error: '허용되지 않은 사이트입니다. ALLOWED_ORIGINS를 확인해 주세요.' }, 403);

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
      return json({ error: 'Supabase Secrets에 APPS_SCRIPT_WEB_APP_URL과 APPS_SCRIPT_SHARED_SECRET을 설정해 주세요.' }, 500);
    }

    const isBinaryUpload = new URL(req.url).searchParams.get('action') === 'upload';
    const body: JsonRecord = isBinaryUpload
      ? Object.fromEntries(new URL(req.url).searchParams.entries())
      : await req.json();
    if (isBinaryUpload) body.action = 'upload';
    if (!['start', 'share', 'delete', 'upload'].includes(body.action)) {
      return json({ error: '지원하지 않는 작업입니다.' }, 400);
    }

    const kind = ['video', 'thumbnail', 'attachment'].includes(String(body.kind)) ? String(body.kind) : '';
    const mimeType = String(body.mimeType || '');
    const size = Number(body.size);
    if (['start', 'upload'].includes(body.action)) {
      const types = kind === 'attachment' ? ATTACHMENT_TYPES : kind === 'thumbnail' ? THUMBNAIL_TYPES : VIDEO_TYPES;
      const maxBytes = kind === 'attachment' ? MAX_ATTACHMENT_BYTES : kind === 'thumbnail' ? MAX_THUMBNAIL_BYTES : MAX_VIDEO_BYTES;
      if (!kind || !types.has(mimeType) || !Number.isSafeInteger(size) || size < 1 || size > maxBytes) {
        const message = kind === 'attachment'
          ? 'PDF·이미지·텍스트·Office 문서는 파일당 최대 20MB까지 첨부할 수 있습니다.'
          : kind === 'thumbnail'
            ? 'JPG/PNG/WebP 썸네일은 최대 20MB까지 업로드할 수 있습니다.'
            : 'MP4/WebM 동영상은 최대 100MB까지 업로드할 수 있습니다.';
        return json({ error: message }, 400);
      }
    }
    if (['share', 'delete'].includes(body.action) && !/^[A-Za-z0-9_-]{10,}$/.test(String(body.fileId || ''))) {
      return json({ error: '잘못된 Google Drive 파일 ID입니다.' }, 400);
    }

    let bytes: ArrayBuffer | null = null;
    if (isBinaryUpload) {
      const contentLength = req.headers.get('content-length');
      if (contentLength && Number(contentLength) !== size) return json({ error: '전송 파일 크기가 올바르지 않습니다.' }, 400);
      bytes = await req.arrayBuffer();
      if (bytes.byteLength !== size) return json({ error: '전송된 파일 크기가 예상과 다릅니다.' }, 400);
    }

    const bridgeRequest = async (payload: JsonRecord): Promise<JsonRecord> => {
      const response = await fetch(appScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, sharedSecret: appScriptSecret }),
        signal: AbortSignal.timeout(30000),
      });
      const text = await response.text();
      let result: JsonRecord;
      try { result = JSON.parse(text); } catch {
        console.error('Apps Script returned a non-JSON response', response.status);
        throw new Error('Apps Script 응답을 읽지 못했습니다. 웹 앱 URL과 배포 권한을 확인해 주세요.');
      }
      if (!response.ok || result.error) throw new Error(String(result.error || 'Apps Script에서 Google Drive 요청을 처리하지 못했습니다.'));
      return result;
    };

    if (body.action === 'upload') {
      const start = await bridgeRequest({
        action: 'start',
        kind,
        name: String(body.name || 'upload').slice(0, 180),
        mimeType,
        size,
      });
      if (typeof start.uploadUrl !== 'string' || !start.uploadUrl.startsWith('https://www.googleapis.com/')) {
        return json({ error: 'Google Drive 업로드 주소가 올바르지 않습니다.' }, 502);
      }

      const uploadResponse = await fetch(start.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': mimeType },
        body: bytes!,
        signal: AbortSignal.timeout(140000),
      });
      const uploadText = await uploadResponse.text();
      let uploaded: JsonRecord;
      try { uploaded = JSON.parse(uploadText); } catch {
        console.error('Google Drive returned a non-JSON upload response', uploadResponse.status);
        return json({ error: 'Google Drive 파일 업로드 응답을 읽지 못했습니다.' }, 502);
      }
      if (!uploadResponse.ok || !uploaded.id) {
        console.error('Google Drive upload failed', uploadResponse.status, uploaded);
        return json({ error: String(uploaded.error?.message || `Google Drive 업로드 실패 (${uploadResponse.status}).`) }, 502);
      }
      return json(await bridgeRequest({ action: 'share', fileId: String(uploaded.id) }));
    }

    return json(await bridgeRequest(body));
  } catch (error) {
    console.error('Drive upload function error', error);
    return json({ error: error instanceof Error ? error.message : 'Google Drive 요청을 처리하지 못했습니다.' }, 500);
  }
});
