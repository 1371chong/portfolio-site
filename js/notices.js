const NOTICE_CATEGORIES = ['공지사항', '업데이트', '작업 소식', '이벤트', '점검 안내', '기타'];

function noticeLabel(category) {
  return NOTICE_CATEGORIES.includes(category) ? category : '기타';
}

function noticeTone(category) {
  return ({ '공지사항':'notice', '업데이트':'update', '작업 소식':'work', '이벤트':'event', '점검 안내':'maintenance', '기타':'other' })[category] || 'other';
}

function getNoticeAttachmentUrl(client, attachment) {
  if (attachment?.url) return attachment.url;
  const driveId = attachment?.file_id || (attachment?.storage === 'google-drive' ? attachment?.path : '');
  if (driveId && /^[A-Za-z0-9_-]{10,}$/.test(driveId)) return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(driveId)}`;
  const path = attachment?.path;
  const name = attachment?.name;
  if (!path || !name) return '';
  const { data } = client.storage.from('notice-files').getPublicUrl(path, { download: name });
  return data?.publicUrl || '';
}

function renderNoticeAttachments(client, attachments) {
  const files = Array.isArray(attachments) ? attachments : [];
  if (!files.length) return null;
  const section = document.createElement('div'); section.className = 'notice-attachments';
  const heading = document.createElement('strong'); heading.textContent = '첨부파일';
  const list = document.createElement('ul');
  files.forEach(file => {
    if (!file?.path || !file?.name) return;
    const url = getNoticeAttachmentUrl(client, file);
    if (!url) return;
    const item = document.createElement('li');
    const link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.textContent = `📎 ${file.name}`;
    item.append(link); list.append(item);
  });
  if (!list.childElementCount) return null;
  section.append(heading, list);
  return section;
}

function renderNoticeFilters(filterRoot, applyCategory) {
  const categories = ['전체', ...NOTICE_CATEGORIES];
  filterRoot.replaceChildren(...categories.map((category, index) => {
    const button = document.createElement('button');
    const initialCategory = document.body.dataset.noticeCategory || '전체';
    button.type = 'button'; button.className = `notice-tab${category === initialCategory ? ' active' : ''}`;
    button.dataset.category = category;
    button.dataset.categoryTone = noticeTone(category);
    button.setAttribute('role', 'tab'); button.setAttribute('aria-selected', String(category === initialCategory));
    button.textContent = localizedNoticeCategory(category);
    button.addEventListener('click', () => {
      filterRoot.querySelectorAll('.notice-tab').forEach(tab => {
        const active = tab === button;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      applyCategory(category);
    });
    return button;
  }));
}

function localizedNoticeCategory(category) {
  const key = category === '전체' ? 'all' : ({ '공지사항':'notice', '업데이트':'update', '작업 소식':'work', '이벤트':'event', '점검 안내':'maintenance', '기타':'other' })[category] || 'other';
  const labels = window.JWB_I18N?.t('noticeCategories');
  return labels?.[key] || category;
}

function refreshNoticeCategoryLabels() {
  document.querySelectorAll('.notice-tab').forEach(tab => { tab.textContent = localizedNoticeCategory(tab.dataset.category); });
  document.querySelectorAll('.notice-category-badge').forEach(badge => {
    const category = badge.closest('.notice-board-row')?.dataset.category || '';
    badge.textContent = category === '공지사항' ? `[${localizedNoticeCategory(category)}]` : `[${localizedNoticeCategory(category).replace(/\s/g, '')}]`;
  });
}

async function loadNotices() {
  const list = document.getElementById('notice-list');
  const filters = document.getElementById('notice-filters');
  const client = window.getJwbSupabase?.();
  if (!client) { if (list) list.textContent = '공지사항을 불러올 수 없습니다.'; return; }

  const { data, error } = await client.from('notices')
    .select('id,title,content,category,attachments,created_at,published_at')
    .lte('published_at', new Date().toISOString())
    .order('created_at', { ascending: false });
  if (error) { if (list) list.textContent = '공지사항을 불러오지 못했습니다. 잠시 후 다시 방문해 주세요.'; return; }
  const latestNotice = data?.[0];
  if (latestNotice) {
    window.JWB_LATEST_NOTICE = {
      id: String(latestNotice.id),
      title: String(latestNotice.title || '').replace(/^\[(공지|공지사항|업데이트|작업\s*소식|이벤트|점검\s*안내|기타)\]\s*/, '')
    };
    window.dispatchEvent(new CustomEvent('jwb:noticesready', { detail: window.JWB_LATEST_NOTICE }));
  }
  if (!list || !filters) return;
  if (!data?.length) {
    const emptyBoard = document.createElement('div'); emptyBoard.className = 'notice-board-wrap';
    const empty = document.createElement('p'); empty.className = 'notice-empty'; empty.textContent = '등록된 공지사항이 없습니다.';
    emptyBoard.append(empty); list.replaceChildren(emptyBoard);
    renderNoticeFilters(filters, () => {});
    return;
  }

  const board = document.createElement('div'); board.className = 'notice-board-wrap';
  const rows = new Map();
  let openId = null;
  let activeCategory = document.body.dataset.noticeCategory || '전체';
  let searchTerm = '';
  const updateUrl = (id, push = false) => {
    const url = new URL(window.location.href);
    if (id) { url.searchParams.set('notice', String(id)); url.hash = ''; }
    else url.searchParams.delete('notice');
    if (push) window.history.pushState({ notice: id }, '', url);
    else window.history.replaceState(window.history.state, '', url);
  };
  const closeNotice = (row, updateHistory = true) => {
    if (!row) return;
    row.classList.remove('active'); row.setAttribute('aria-expanded', 'false');
    if (row.nextElementSibling) row.nextElementSibling.hidden = true;
    if (openId === row.dataset.noticeId) {
      openId = null;
      if (updateHistory) updateUrl(null);
    }
  };
  const openNotice = (row, pushHistory = false, scrollToNotice = false) => {
    if (!row) return;
    board.querySelectorAll('.notice-board-row.active').forEach(activeRow => closeNotice(activeRow, false));
    row.classList.add('active'); row.setAttribute('aria-expanded', 'true');
    row.nextElementSibling.hidden = false;
    openId = row.dataset.noticeId;
    if (pushHistory) updateUrl(openId, true);
    if (scrollToNotice) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  data.forEach(notice => {
    const id = String(notice.id);
    const category = noticeLabel(notice.category);
    const row = document.createElement('button'); row.type = 'button'; row.className = 'notice-board-row';
    row.dataset.category = category; row.dataset.noticeId = id;
    row.dataset.categoryTone = noticeTone(category);
    row.setAttribute('aria-expanded', 'false');
    const contentId = `notice-content-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    row.setAttribute('aria-controls', contentId);

    const title = document.createElement('div'); title.className = 'notice-col-title';
    const categoryBadge = document.createElement('span'); categoryBadge.className = 'notice-category-badge';
    categoryBadge.textContent = category === '공지사항' ? '[공지]' : `[${category.replace(/\s/g, '')}]`;
    const titleText = document.createElement('span');
    titleText.textContent = String(notice.title || '').replace(/^\[(공지|공지사항|업데이트|작업\s*소식|이벤트|점검\s*안내|기타)\]\s*/, '');
    const folder = document.createElement('span'); folder.className = 'notice-folder'; folder.textContent = '＋'; folder.setAttribute('aria-hidden', 'true');
    title.append(categoryBadge, titleText, folder);

    const createdAt = new Date(notice.published_at || notice.created_at);
    const date = document.createElement('time'); date.className = 'notice-col-date';
    if (!Number.isNaN(createdAt.getTime())) {
      date.dateTime = createdAt.toISOString();
      date.textContent = `${createdAt.getFullYear()}.${String(createdAt.getMonth() + 1).padStart(2, '0')}.${String(createdAt.getDate()).padStart(2, '0')} ${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')}`;
    }
    row.append(title, date);

    const content = document.createElement('div'); content.className = 'notice-content-row'; content.id = contentId; content.hidden = true;
    content.setAttribute('role', 'region'); content.setAttribute('aria-labelledby', `notice-title-${contentId}`);
    const detailHeader = document.createElement('div'); detailHeader.className = 'notice-detail-header';
    const detailTitle = document.createElement('strong'); detailTitle.className = 'notice-detail-title'; detailTitle.id = `notice-title-${contentId}`; detailTitle.textContent = titleText.textContent;
    const detailDate = document.createElement('time'); detailDate.className = 'notice-detail-date';
    if (date.dateTime) { detailDate.dateTime = date.dateTime; detailDate.textContent = `게시일 ${date.textContent}`; }
    const actions = document.createElement('div'); actions.className = 'notice-detail-actions';
    const shareButton = document.createElement('button'); shareButton.type = 'button'; shareButton.className = 'notice-action notice-action-copy'; shareButton.textContent = '링크 복사';
    shareButton.setAttribute('aria-label', `${titleText.textContent} 공지 링크 복사`);
    shareButton.addEventListener('click', async event => {
      event.stopPropagation();
      const url = new URL(window.location.href); url.searchParams.set('notice', id); url.hash = '';
      try { await navigator.clipboard.writeText(url.toString()); shareButton.textContent = '복사 완료'; shareButton.classList.add('is-copied'); shareButton.setAttribute('aria-label', '공지 링크 복사 완료'); }
      catch { window.prompt('공지사항 공유 링크', url.toString()); }
    });
    const closeButton = document.createElement('button'); closeButton.type = 'button'; closeButton.className = 'notice-action notice-action-close'; closeButton.textContent = '접기'; closeButton.setAttribute('aria-label', '공지 상세 접기');
    closeButton.addEventListener('click', event => { event.stopPropagation(); closeNotice(row); row.focus(); });
    actions.append(shareButton, closeButton); detailHeader.append(detailTitle, detailDate, actions);
    const paragraph = document.createElement('p'); paragraph.className = 'notice-detail-copy'; paragraph.textContent = notice.content || '';
    content.append(detailHeader, paragraph);
    const attachmentList = renderNoticeAttachments(client, notice.attachments);
    if (attachmentList) content.append(attachmentList);

    row.addEventListener('click', () => {
      if (row.classList.contains('active')) closeNotice(row);
      else openNotice(row, true);
    });
    rows.set(id, row);
    board.append(row, content);
  });

  const searchInput = document.getElementById('notice-search');
  const searchCount = document.getElementById('notice-search-count');
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
  const applyNoticeFilters = () => {
    let visibleCount = 0;
    board.querySelectorAll('.notice-board-row').forEach(row => {
      const categoryMatches = activeCategory === '전체' || row.dataset.category === activeCategory;
      const searchMatches = !searchTerm || normalize(row.dataset.search).includes(searchTerm);
      const visible = categoryMatches && searchMatches;
      row.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
      else if (row.classList.contains('active')) closeNotice(row);
    });
    const language = window.JWB_I18N?.language || 'ko';
    if (searchCount) searchCount.textContent = language === 'en'
      ? `${visibleCount} notices`
      : language === 'ja' ? `${visibleCount}件のお知らせ`
      : `${visibleCount}개 공지`;
  };
  renderNoticeFilters(filters, category => { activeCategory = category; applyNoticeFilters(); });
  board.querySelectorAll('.notice-board-row').forEach(row => {
    const detail = row.nextElementSibling?.querySelector('.notice-detail-copy')?.textContent || '';
    const title = row.querySelector('.notice-col-title > span:nth-child(2)')?.textContent || '';
    row.dataset.search = normalize(`${title} ${detail} ${row.dataset.category}`);
  });
  searchInput?.addEventListener('input', () => {
    searchTerm = normalize(searchInput.value);
    applyNoticeFilters();
  });
  window.addEventListener('jwb:languagechange', () => { refreshNoticeCategoryLabels(); applyNoticeFilters(); });
  list.replaceChildren(board);
  refreshNoticeCategoryLabels();
  applyNoticeFilters();
  window.addEventListener('popstate', () => {
    const requestedId = new URLSearchParams(window.location.search).get('notice');
    board.querySelectorAll('.notice-board-row.active').forEach(row => closeNotice(row, false));
    if (requestedId && rows.has(requestedId)) openNotice(rows.get(requestedId));
  });
  window.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !openId) return;
    const row = rows.get(openId);
    closeNotice(row);
    row?.focus();
  });
  const sharedId = new URLSearchParams(window.location.search).get('notice');
  if (sharedId && rows.has(sharedId)) {
    const sharedRow = rows.get(sharedId);
    activeCategory = '전체'; searchTerm = '';
    if (searchInput) searchInput.value = '';
    filters.querySelector('.notice-tab')?.click();
    openNotice(sharedRow, false, true);
  }
}

loadNotices();
