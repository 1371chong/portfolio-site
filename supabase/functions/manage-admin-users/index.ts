import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type Payload = {
  action?: 'list' | 'create' | 'delete';
  email?: string;
  password?: string;
  role?: 'admin' | 'sub_admin';
  displayName?: string;
  userId?: string;
};

Deno.serve(async (req) => {
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
  if (!corsOrigin) return json({ error: '허용되지 않은 사이트입니다. ALLOWED_ORIGINS를 확인해 주세요.' }, 403);

  try {
    const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!jwt) return json({ error: '관리자 로그인이 필요합니다.' }, 401);
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !serviceKey) return json({ error: 'Supabase Edge Function Secrets 설정이 필요합니다.' }, 500);

    const adminClient = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { data: { user: caller }, error: authError } = await adminClient.auth.getUser(jwt);
    if (authError || !caller) return json({ error: '로그인 정보를 확인할 수 없습니다.' }, 401);
    if (caller.app_metadata?.role !== 'admin') return json({ error: '메인 관리자만 계정을 관리할 수 있습니다.' }, 403);

    const body = await req.json() as Payload;
    if (body.action === 'list') {
      const users = [];
      for (let page = 1; page <= 50; page++) {
        const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 100 });
        if (error) throw error;
        users.push(...data.users);
        if (data.users.length < 100) break;
      }
      const accounts = users
        .filter(user => ['admin', 'sub_admin'].includes(String(user.app_metadata?.role || '')))
        .map(user => ({
          id: user.id,
          email: user.email || '',
          role: user.app_metadata.role,
          displayName: String(user.user_metadata?.display_name || ''),
          createdAt: user.created_at,
        }))
        .sort((a, b) => a.role === b.role ? a.email.localeCompare(b.email) : a.role === 'admin' ? -1 : 1);
      return json({ accounts });
    }

    if (body.action === 'create') {
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const displayName = String(body.displayName || '').trim().slice(0, 80);
      const role = body.role;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: '올바른 이메일 아이디를 입력해 주세요.' }, 400);
      if (password.length < 12) return json({ error: '초기 비밀번호는 12자 이상이어야 합니다.' }, 400);
      if (role !== 'admin' && role !== 'sub_admin') return json({ error: '관리자 유형을 선택해 주세요.' }, 400);

      const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role },
        user_metadata: { display_name: displayName },
      });
      if (error || !data.user) return json({ error: error?.message || '계정을 만들지 못했습니다.' }, 400);

      const { error: registryError } = await adminClient.from('admin_accounts').insert({
        user_id: data.user.id, email, display_name: displayName, role, created_by: caller.id,
      });
      if (registryError) {
        await adminClient.auth.admin.deleteUser(data.user.id);
        return json({ error: '계정 기록을 저장하지 못했습니다. supabase-setup.sql 적용 여부를 확인해 주세요.' }, 500);
      }
      return json({ account: { id: data.user.id, email, role, displayName, createdAt: data.user.created_at } }, 201);
    }

    if (body.action === 'delete') {
      const userId = String(body.userId || '');
      if (!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(userId)) return json({ error: '계정 정보를 확인해 주세요.' }, 400);
      if (userId === caller.id) return json({ error: '현재 로그인한 메인 관리자 계정은 삭제할 수 없습니다.' }, 400);
      const { data: targetResult, error: targetError } = await adminClient.auth.admin.getUserById(userId);
      if (targetError || !targetResult.user || !['admin', 'sub_admin'].includes(String(targetResult.user.app_metadata?.role || ''))) {
        return json({ error: '관리자 계정을 찾을 수 없습니다.' }, 404);
      }
      if (targetResult.user.app_metadata?.role === 'admin') {
        const { data, error } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
        if (error) throw error;
        const mainAdminCount = data.users.filter(user => user.app_metadata?.role === 'admin').length;
        if (mainAdminCount <= 1) return json({ error: '마지막 메인 관리자 계정은 삭제할 수 없습니다.' }, 400);
      }
      const { error } = await adminClient.auth.admin.deleteUser(userId);
      if (error) return json({ error: error.message }, 400);
      return json({ success: true });
    }

    return json({ error: '지원하지 않는 요청입니다.' }, 400);
  } catch (error) {
    console.error('manage-admin-users error', error);
    return json({ error: error instanceof Error ? error.message : '계정 관리 요청을 처리하지 못했습니다.' }, 500);
  }
});
