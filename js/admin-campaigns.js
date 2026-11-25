(() => {
  const client = window.getJwbSupabase?.();
  const byId = id => document.getElementById(id);
  const maxImageBytes = 20 * 1024 * 1024;
  const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
  const localDateTime = value => {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return '';
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };
  const displayDate = value => value ? new Date(value).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }) : '종료일 없음';
  let previewObjectUrl = '';

  function showImagePreview(path = '', file = null) {
    const preview = byId('c-image-preview');
    if (!preview) return;
    if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
    previewObjectUrl = file ? URL.createObjectURL(file) : '';
    const imageUrl = previewObjectUrl || (path ? client.storage.from('campaign-assets').getPublicUrl(path).data.publicUrl : '');
    if (!imageUrl) { preview.textContent = '이미지 미리보기'; return; }
    const image = document.createElement('img');
    image.src = imageUrl; image.alt = byId('c-image-alt').value.trim() || '팝업·배너 이미지 미리보기';
    preview.replaceChildren(image);
  }

  async function uploadCampaignImage(file, userId) {
    if (!allowedImageTypes.has(file.type) || file.size < 1 || file.size > maxImageBytes) {
      throw new Error('JPG, PNG, WebP 이미지 파일만 업로드할 수 있으며 최대 용량은 20MB입니다.');
    }
    const extension = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' })[file.type];
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from('campaign-assets').upload(path, file, { contentType: file.type, cacheControl: '3600', upsert: false });
    if (error) throw error;
    return path;
  }

  async function removeCampaignImage(path) {
    if (!path) return;
    const { error } = await client.storage.from('campaign-assets').remove([path]);
    if (error) console.warn('campaign image cleanup failed', error);
  }

  function resetForm() {
    byId('site-campaign-form').reset();
    byId('c-id').value = '';
    byId('c-image-path').value = '';
    byId('c-start-at').value = localDateTime();
    byId('c-sort-order').value = '0';
    byId('c-published').checked = true;
    byId('c-dismissible').checked = true;
    byId('c-image-remove').checked = false;
    byId('c-submit').textContent = '팝업·배너 등록';
    byId('c-cancel').hidden = true;
    byId('c-status').textContent = '';
    byId('c-image-file').value = '';
    showImagePreview();
  }

  function fillForm(item) {
    byId('c-id').value = item.id;
    byId('c-image-path').value = item.image_path || '';
    byId('c-type').value = item.display_type;
    byId('c-title').value = item.title || '';
    byId('c-description').value = item.description || '';
    byId('c-image-alt').value = item.image_alt || '';
    byId('c-button-label').value = item.button_label || '';
    byId('c-button-url').value = item.button_url || '';
    byId('c-start-at').value = localDateTime(item.start_at);
    byId('c-end-at').value = item.end_at ? localDateTime(item.end_at) : '';
    byId('c-sort-order').value = String(item.sort_order || 0);
    byId('c-published').checked = item.is_published;
    byId('c-dismissible').checked = item.is_dismissible;
    byId('c-image-remove').checked = false;
    byId('c-image-file').value = '';
    byId('c-submit').textContent = '수정 저장';
    byId('c-cancel').hidden = false;
    byId('c-status').textContent = '수정 중입니다. 이미지 파일을 선택하면 기존 이미지가 교체됩니다.';
    showImagePreview(item.image_path, null);
    byId('campaign-admin-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function loadCampaigns() {
    const table = byId('site-campaign-table');
    const { data, error } = await client.from('site_campaigns').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
    if (error) {
      table.innerHTML = '<tr><td colspan="6" style="text-align:center;">팝업·배너를 불러오지 못했습니다. supabase-setup.sql 적용 여부를 확인해 주세요.</td></tr>';
      return;
    }
    if (!data?.length) { table.innerHTML = '<tr><td colspan="6" style="text-align:center;">등록된 팝업·배너가 없습니다.</td></tr>'; return; }
    table.replaceChildren(...data.map(item => {
      const row = document.createElement('tr');
      const imageCell = document.createElement('td');
      if (item.image_path) {
        const image = document.createElement('img'); image.className = 'campaign-table-thumb'; image.alt = item.image_alt || '';
        image.src = client.storage.from('campaign-assets').getPublicUrl(item.image_path).data.publicUrl; imageCell.append(image);
      } else imageCell.textContent = '이미지 없음';
      const type = document.createElement('td'); type.textContent = ({ hero: '메인 히어로', modal: '팝업 모달', banner: '이벤트 배너' })[item.display_type] || item.display_type;
      const title = document.createElement('td'); title.textContent = item.title;
      const period = document.createElement('td'); period.textContent = `${displayDate(item.start_at)} ~ ${displayDate(item.end_at)}`;
      const status = document.createElement('td'); status.textContent = item.is_published ? '게시' : '비공개';
      const actionsCell = document.createElement('td'); const actions = document.createElement('div'); actions.className = 'admin-action-btns';
      const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'btn-edit'; edit.textContent = '수정'; edit.addEventListener('click', () => fillForm(item));
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn-delete'; remove.textContent = '삭제';
      remove.addEventListener('click', async () => {
        if (!window.confirm(`“${item.title}” 팝업·배너를 삭제할까요?`)) return;
        const { error: deleteError } = await client.from('site_campaigns').delete().eq('id', item.id);
        if (deleteError) { window.alert('삭제하지 못했습니다. 관리자 권한과 Supabase 설정을 확인해 주세요.'); return; }
        await removeCampaignImage(item.image_path);
        await loadCampaigns();
      });
      actions.append(edit, remove); actionsCell.append(actions); row.append(imageCell, type, title, period, status, actionsCell); return row;
    }));
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const form = byId('site-campaign-form');
    if (!form || !client) return;
    const { data: { session } } = await client.auth.getSession();
    if (!session || !['admin', 'sub_admin'].includes(session.user.app_metadata?.role)) return;
    byId('c-start-at').value = localDateTime();
    byId('c-image-file').addEventListener('change', () => {
      const file = byId('c-image-file').files[0];
      if (file) { byId('c-image-remove').checked = false; showImagePreview('', file); }
      else showImagePreview(byId('c-image-path').value);
    });
    byId('c-image-alt').addEventListener('input', () => {
      const image = byId('c-image-preview').querySelector('img');
      if (image) image.alt = byId('c-image-alt').value.trim() || '팝업·배너 이미지 미리보기';
    });
    byId('c-image-remove').addEventListener('change', event => {
      if (event.currentTarget.checked) showImagePreview();
      else showImagePreview(byId('c-image-path').value);
    });
    byId('c-cancel').addEventListener('click', resetForm);
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const submit = byId('c-submit'); const status = byId('c-status');
      if (submit.disabled) return;
      submit.disabled = true; status.textContent = '저장 중…';
      const id = byId('c-id').value;
      const oldImagePath = byId('c-image-path').value;
      const selectedFile = byId('c-image-file').files[0];
      const startAt = new Date(byId('c-start-at').value);
      const endAt = byId('c-end-at').value ? new Date(byId('c-end-at').value) : null;
      let uploadedPath = '';
      try {
        if (endAt && endAt <= startAt) throw new Error('게시 종료 시각은 시작 시각보다 뒤여야 합니다.');
        if (byId('c-button-label').value.trim() && !byId('c-button-url').value.trim()) throw new Error('버튼 링크를 입력해 주세요.');
        if (selectedFile) uploadedPath = await uploadCampaignImage(selectedFile, session.user.id);
        const imagePath = uploadedPath || (byId('c-image-remove').checked ? '' : oldImagePath);
        if (imagePath && !byId('c-image-alt').value.trim()) throw new Error('이미지를 사용하는 경우 대체 텍스트를 입력해 주세요.');
        const values = {
          display_type: byId('c-type').value,
          title: byId('c-title').value.trim(),
          description: byId('c-description').value.trim(),
          image_path: imagePath,
          image_alt: byId('c-image-alt').value.trim(),
          button_label: byId('c-button-label').value.trim(),
          button_url: byId('c-button-url').value.trim(),
          is_published: byId('c-published').checked,
          is_dismissible: byId('c-dismissible').checked,
          start_at: startAt.toISOString(),
          end_at: endAt ? endAt.toISOString() : null,
          sort_order: Number(byId('c-sort-order').value) || 0,
          updated_at: new Date().toISOString(),
        };
        if (!id) values.created_by = session.user.id;
        const result = id
          ? await client.from('site_campaigns').update(values).eq('id', id)
          : await client.from('site_campaigns').insert(values);
        if (result.error) throw result.error;
        if (oldImagePath && oldImagePath !== imagePath) await removeCampaignImage(oldImagePath);
        const successMessage = id ? '팝업·배너를 수정했습니다.' : '팝업·배너를 등록했습니다.';
        resetForm();
        status.textContent = successMessage;
        await loadCampaigns();
      } catch (error) {
        if (uploadedPath) await removeCampaignImage(uploadedPath);
        status.textContent = `저장하지 못했습니다: ${error.message || 'Supabase 설정과 관리자 권한을 확인해 주세요.'}`;
      } finally { submit.disabled = false; }
    });
    await loadCampaigns();
  });
})();
