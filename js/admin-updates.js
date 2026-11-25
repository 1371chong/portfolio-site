(() => {
  const client = window.getJwbSupabase?.();
  const byId = id => document.getElementById(id);
  const localDateTime = value => {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return '';
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };
  const isoDateTime = value => new Date(value).toISOString();
  const formatDate = value => new Date(value).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });

  async function invokeAdminUsers(body) {
    const { data, error } = await client.functions.invoke('manage-admin-users', { body });
    if (error) {
      let detail = error.message || '관리자 계정 요청을 처리하지 못했습니다.';
      try { detail = (await error.context.json()).error || detail; } catch {}
      throw new Error(detail);
    }
    if (data?.error) throw new Error(data.error);
    return data;
  }

  async function loadWebsiteUpdates() {
    const table = byId('website-update-table');
    if (!table || !client) return;
    const { data, error } = await client.from('website_updates').select('*').order('published_at', { ascending: false });
    if (error) {
      table.innerHTML = '<tr><td colspan="5" style="text-align:center;">업데이트 내역을 불러오지 못했습니다. supabase-setup.sql 적용 여부를 확인해 주세요.</td></tr>';
      return;
    }
    if (!data?.length) {
      table.innerHTML = '<tr><td colspan="5" style="text-align:center;">등록된 업데이트가 없습니다.</td></tr>';
      return;
    }
    table.replaceChildren(...data.map(item => {
      const row = document.createElement('tr');
      const date = document.createElement('td'); date.textContent = formatDate(item.published_at);
      const category = document.createElement('td'); category.textContent = item.category;
      const title = document.createElement('td'); title.textContent = item.title;
      const published = document.createElement('td'); published.textContent = item.is_published ? '공개' : '비공개';
      const actionsCell = document.createElement('td'); const actions = document.createElement('div'); actions.className = 'admin-action-btns';
      const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'btn-edit'; edit.textContent = '수정';
      edit.addEventListener('click', () => {
        byId('u-id').value = item.id;
        byId('u-title').value = item.title || '';
        byId('u-category').value = item.category || '기능 추가';
        byId('u-version').value = item.version || '';
        byId('u-published-at').value = localDateTime(item.published_at);
        byId('u-summary').value = item.summary || '';
        byId('u-content').value = item.content || '';
        byId('u-published').checked = item.is_published !== false;
        byId('u-submit').textContent = '수정 저장'; byId('u-cancel').style.display = 'inline-block';
        byId('updates-admin-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn-delete'; remove.textContent = '삭제';
      remove.addEventListener('click', async () => {
        if (!window.confirm(`“${item.title}” 업데이트 내역을 삭제할까요?`)) return;
        const { error: deleteError } = await client.from('website_updates').delete().eq('id', item.id);
        if (deleteError) { window.alert('삭제하지 못했습니다. 관리자 권한을 확인해 주세요.'); return; }
        await loadWebsiteUpdates();
      });
      actions.append(edit, remove); actionsCell.append(actions); row.append(date, category, title, published, actionsCell);
      return row;
    }));
  }

  function resetUpdateForm() {
    byId('website-update-form')?.reset();
    byId('u-id').value = '';
    byId('u-published-at').value = localDateTime();
    byId('u-published').checked = true;
    byId('u-submit').textContent = '업데이트 등록';
    byId('u-cancel').style.display = 'none';
  }

  async function loadAdminAccounts() {
    const table = byId('admin-account-table');
    if (!table) return;
    table.innerHTML = '<tr><td colspan="5" style="text-align:center;">계정 목록을 불러오는 중...</td></tr>';
    try {
      const result = await invokeAdminUsers({ action: 'list' });
      if (!result.accounts?.length) { table.innerHTML = '<tr><td colspan="5" style="text-align:center;">관리자 계정이 없습니다.</td></tr>'; return; }
      table.replaceChildren(...result.accounts.map(account => {
        const row = document.createElement('tr');
        const name = document.createElement('td'); name.textContent = account.displayName || '—';
        const email = document.createElement('td'); email.textContent = account.email;
        const role = document.createElement('td'); role.textContent = account.role === 'admin' ? '메인 관리자' : '부관리자';
        const date = document.createElement('td'); date.textContent = formatDate(account.createdAt);
        const actionsCell = document.createElement('td');
        if (account.id === currentUserId) actionsCell.textContent = '현재 계정';
        else {
          const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn-delete'; remove.textContent = '계정 삭제';
          remove.addEventListener('click', async () => {
            if (!window.confirm(`${account.email} 관리자 계정을 삭제할까요? 이 계정은 사이트 관리자 화면에 로그인할 수 없게 됩니다.`)) return;
            const status = byId('admin-account-status'); status.textContent = '계정을 삭제하고 있습니다…';
            try { await invokeAdminUsers({ action: 'delete', userId: account.id }); status.textContent = '관리자 계정을 삭제했습니다.'; await loadAdminAccounts(); }
            catch (error) { status.textContent = error.message; }
          });
          actionsCell.append(remove);
        }
        row.append(name, email, role, date, actionsCell);
        return row;
      }));
    } catch (error) {
      table.innerHTML = `<tr><td colspan="5" style="text-align:center;">${error.message}</td></tr>`;
    }
  }

  const inquiryStatuses = {
    received: '문의 접수', consulting: '상담 중', in_progress: '작업 중',
    review: '검토·피드백', completed: '완료', on_hold: '보류',
  };
  function createTrackingCode() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    return `JWB-${hex.slice(0, 8)}-${hex.slice(8, 16)}-${hex.slice(16, 24)}-${hex.slice(24, 32)}`;
  }
  function createIssueNumber() {
    const bytes = crypto.getRandomValues(new Uint8Array(12));
    const digits = [...bytes].map(byte => String(byte % 10)).join('');
    return digits.match(/.{1,4}/g).join('-');
  }
  async function trackingCodeHash(code) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code.trim().toUpperCase()));
    return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
  async function issueNumberHash(number) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(number.replace(/\D/g, '')));
    return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
  function revealTrackingCode(code, issueNumber) {
    byId('ip-code-display').textContent = code;
    byId('ip-issue-display').textContent = issueNumber;
    byId('ip-code-result').hidden = false;
    byId('ip-code-copy').textContent = '모두 복사';
    byId('ip-code-result').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  async function loadInquiryProgress() {
    const table = byId('inquiry-progress-table');
    if (!table || !client) return;
    const { data, error } = await client.from('inquiry_progress').select('*').order('updated_at', { ascending: false });
    if (error) { table.innerHTML = '<tr><td colspan="4" style="text-align:center;">진행 상태를 불러오지 못했습니다. supabase-setup.sql 적용 여부를 확인해 주세요.</td></tr>'; return; }
    if (!data?.length) { table.innerHTML = '<tr><td colspan="4" style="text-align:center;">등록된 진행 건이 없습니다.</td></tr>'; return; }
    table.replaceChildren(...data.map(item => {
      const row = document.createElement('tr');
      const label = document.createElement('td'); label.textContent = item.project_label || '프로젝트';
      const status = document.createElement('td'); status.textContent = inquiryStatuses[item.status] || item.status;
      const date = document.createElement('td'); date.textContent = formatDate(item.updated_at);
      const actionsCell = document.createElement('td'); const actions = document.createElement('div'); actions.className = 'admin-action-btns';
      const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'btn-edit'; edit.textContent = '수정';
      edit.addEventListener('click', () => {
        byId('ip-id').value = item.id; byId('ip-code-hash').value = item.tracking_code_hash; byId('ip-issue-hash').value = item.issue_number_hash || '';
        byId('ip-label').value = item.project_label || ''; byId('ip-status').value = item.status;
        byId('ip-note').value = item.progress_note || ''; byId('ip-submit').textContent = '진행 상태 저장';
        byId('ip-cancel').style.display = 'inline-block'; byId('ip-code-result').hidden = true;
        byId('inquiry-progress-admin-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      const reissue = document.createElement('button'); reissue.type = 'button'; reissue.className = 'btn-edit'; reissue.textContent = '코드 재발급';
      reissue.setAttribute('aria-label', `${item.project_label || '프로젝트'} 조회 코드 재발급`);
      reissue.addEventListener('click', async () => {
        if (!window.confirm('새 조회 코드를 발급할까요? 기존 코드는 즉시 사용할 수 없게 됩니다. 새 코드는 발급 직후 한 번만 표시됩니다.')) return;
        reissue.disabled = true;
        try {
          const code = createTrackingCode();
          const issueNumber = createIssueNumber();
          const { error: rotateError } = await client.from('inquiry_progress').update({
            tracking_code_hash: await trackingCodeHash(code),
            issue_number_hash: await issueNumberHash(issueNumber),
            updated_at: new Date().toISOString(),
            updated_by: currentUserId,
          }).eq('id', item.id);
          if (rotateError) throw rotateError;
          revealTrackingCode(code, issueNumber);
          await loadInquiryProgress();
        } catch (error) {
          window.alert(`코드를 재발급하지 못했습니다. 관리자 권한과 데이터베이스 설정을 확인해 주세요. ${error.message || ''}`);
        } finally { reissue.disabled = false; }
      });
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn-delete'; remove.textContent = '삭제';
      remove.addEventListener('click', async () => {
        if (!window.confirm('이 프로젝트 진행 상태와 조회 코드를 삭제할까요?')) return;
        const { error: deleteError } = await client.from('inquiry_progress').delete().eq('id', item.id);
        if (deleteError) { window.alert('삭제하지 못했습니다. 관리자 권한을 확인해 주세요.'); return; }
        await loadInquiryProgress();
      });
      actions.append(edit, reissue, remove); actionsCell.append(actions); row.append(label, status, date, actionsCell); return row;
    }));
  }
  function resetInquiryProgressForm() {
    byId('inquiry-progress-form')?.reset();
    byId('ip-id').value = ''; byId('ip-code-hash').value = ''; byId('ip-issue-hash').value = '';
    byId('ip-submit').textContent = '조회 코드 생성 및 등록'; byId('ip-cancel').style.display = 'none';
  }

  let currentUserId = '';
  document.addEventListener('DOMContentLoaded', async () => {
    if (!client) return;
    const { data: { session } } = await client.auth.getSession();
    const role = session?.user?.app_metadata?.role;
    if (!session || !['admin', 'sub_admin'].includes(role)) return;
    currentUserId = session.user.id;
    if (byId('website-update-form')) {
      byId('u-published-at').value = localDateTime();
      byId('website-update-form').addEventListener('submit', async event => {
        event.preventDefault();
        const id = byId('u-id').value;
        const values = {
          title: byId('u-title').value.trim(),
          category: byId('u-category').value,
          version: byId('u-version').value.trim(),
          published_at: isoDateTime(byId('u-published-at').value),
          summary: byId('u-summary').value.trim(),
          content: byId('u-content').value.trim(),
          is_published: byId('u-published').checked,
          updated_at: new Date().toISOString(),
        };
        if (!id) values.author_id = session.user.id;
        const result = id
          ? await client.from('website_updates').update(values).eq('id', id)
          : await client.from('website_updates').insert(values);
        if (result.error) { window.alert('저장하지 못했습니다. supabase-setup.sql 적용 여부와 관리자 권한을 확인해 주세요.'); return; }
        resetUpdateForm(); await loadWebsiteUpdates();
      });
      byId('u-cancel').addEventListener('click', resetUpdateForm);
      await loadWebsiteUpdates();
    }
    if (byId('inquiry-progress-form')) {
      byId('inquiry-progress-form').addEventListener('submit', async event => {
        event.preventDefault();
        const submit = byId('ip-submit');
        if (submit.disabled) return;
        submit.disabled = true;
        const id = byId('ip-id').value;
        try {
          const values = {
            project_label: byId('ip-label').value.trim(),
            status: byId('ip-status').value,
            progress_note: byId('ip-note').value.trim(),
            updated_at: new Date().toISOString(),
            updated_by: session.user.id,
          };
          let code = '';
          let issueNumber = '';
          if (!id) {
            code = createTrackingCode();
            issueNumber = createIssueNumber();
            values.tracking_code_hash = await trackingCodeHash(code);
            values.issue_number_hash = await issueNumberHash(issueNumber);
          }
          const result = id
            ? await client.from('inquiry_progress').update(values).eq('id', id)
            : await client.from('inquiry_progress').insert(values);
          if (result.error) throw result.error;
          if (!id) revealTrackingCode(code, issueNumber);
          resetInquiryProgressForm();
          await loadInquiryProgress();
        } catch (error) {
          window.alert(`저장하지 못했습니다. supabase-setup.sql 적용 여부와 관리자 권한을 확인해 주세요. ${error.message || ''}`);
        } finally {
          submit.disabled = false;
        }
      });
      byId('ip-cancel').addEventListener('click', resetInquiryProgressForm);
      byId('ip-code-copy').addEventListener('click', async () => {
        const credentials = `조회 코드: ${byId('ip-code-display').textContent}\n발급번호: ${byId('ip-issue-display').textContent}`;
        try { await navigator.clipboard.writeText(credentials); byId('ip-code-copy').textContent = '복사 완료'; }
        catch { window.prompt('조회 코드와 발급번호를 함께 전달해 주세요.', credentials); }
      });
      await loadInquiryProgress();
    }
    if (role === 'admin' && byId('admin-accounts-section')) {
      byId('admin-accounts-section').hidden = false;
      byId('admin-account-form').addEventListener('submit', async event => {
        event.preventDefault();
        const status = byId('admin-account-status');
        const submit = byId('a-submit'); submit.disabled = true; status.textContent = '계정을 생성하고 있습니다…';
        try {
          await invokeAdminUsers({
            action: 'create', email: byId('a-email').value.trim(), displayName: byId('a-name').value.trim(),
            role: byId('a-role').value, password: byId('a-password').value,
          });
          byId('admin-account-form').reset(); status.textContent = '관리자 계정을 생성했습니다. 이메일 아이디와 초기 비밀번호를 안전하게 전달해 주세요.';
          await loadAdminAccounts();
        } catch (error) { status.textContent = error.message; }
        finally { submit.disabled = false; }
      });
      await loadAdminAccounts();
    }
  });
})();
