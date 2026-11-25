import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function sha256(value: string) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
    .then(bytes => Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join(''));
}

Deno.serve(async req => {
  const origin = req.headers.get('origin') || '';
  const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(value => value.trim()).filter(Boolean);
  const corsOrigin = allowedOrigins.includes(origin) ? origin : '';
  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'POST 요청만 지원합니다.' }, 405);
  if (!corsOrigin) return json({ error: '허용되지 않은 사이트입니다.' }, 403);

  try {
    const { code = '', issue_number: issueNumber = '' } = await req.json();
    const normalizedCode = String(code).trim().toUpperCase();
    const normalizedIssueNumber = String(issueNumber).replace(/\D/g, '');
    if (!/^JWB(?:-[A-F0-9]{8}){4}$/.test(normalizedCode) || !/^\d{12}$/.test(normalizedIssueNumber)) {
      return json({ error: '발급 정보가 올바르지 않거나 아직 등록되지 않았습니다.' }, 404);
    }
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !serviceKey) return json({ error: '상태 조회를 준비 중입니다.' }, 500);
    const client = createClient(url, serviceKey, { auth: { persistSession: false } });
    const codeHash = await sha256(normalizedCode);
    const issueNumberHash = await sha256(normalizedIssueNumber);
    const { data, error } = await client.from('inquiry_progress')
      .select('project_label,status,progress_note,updated_at')
      .eq('tracking_code_hash', codeHash)
      .eq('issue_number_hash', issueNumberHash)
      .maybeSingle();
    if (error) throw error;
    if (!data) return json({ error: '조회 코드가 올바르지 않거나 아직 등록되지 않았습니다.' }, 404);
    return json({ progress: data });
  } catch (error) {
    console.error('check-inquiry-progress error', error);
    return json({ error: '상태를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.' }, 500);
  }
});
