const NOTICE_CATEGORIES = ['공지사항', '업데이트', '작업 소식', '기타'];

function noticeLabel(category) {
  return NOTICE_CATEGORIES.includes(category) ? category : '기타';
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

function renderNoticeFilters(filterRoot, board) {
  const categories = ['전체', ...NOTICE_CATEGORIES];
  filterRoot.replaceChildren(...categories.map((category, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = `notice-tab${index === 0 ? ' active' : ''}`;
    button.setAttribute('role', 'tab'); button.setAttribute('aria-selected', String(index === 0));
    button.textContent = category;
    button.addEventListener('click', () => {
      filterRoot.querySelectorAll('.notice-tab').forEach(tab => {
        const active = tab === button;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      board.querySelectorAll('.notice-board-row').forEach(row => {
        const matches = category === '전체' || row.dataset.category === category;
        row.style.display = matches ? '' : 'none';
        const content = row.nextElementSibling;
        if (content) content.hidden = !matches;
        if (!matches) { row.classList.remove('active'); row.setAttribute('aria-expanded', 'false'); }
      });
    });
    return button;
  }));
}

async function loadNotices() {
  const list = document.getElementById('notice-list');
  const filters = document.getElementById('notice-filters');
  if (!list || !filters) return;
  const client = window.getJwbSupabase?.();
  if (!client) { list.textContent = '공지사항을 불러올 수 없습니다.'; return; }

  const { data, error } = await client.from('notices')
    .select('id,title,content,category,attachments,created_at,published_at')
    .lte('published_at', new Date().toISOString())
    .order('created_at', { ascending: false });
  if (error) { list.textContent = '공지사항을 불러오지 못했습니다. 잠시 후 다시 방문해 주세요.'; return; }
  if (!data?.length) {
    const emptyBoard = document.createElement('div'); emptyBoard.className = 'notice-board-wrap';
    const empty = document.createElement('p'); empty.className = 'notice-empty'; empty.textContent = '등록된 공지사항이 없습니다.';
    emptyBoard.append(empty); list.replaceChildren(emptyBoard);
    const filtersOnly = document.createElement('div'); renderNoticeFilters(filters, filtersOnly);
    return;
  }

  const board = document.createElement('div'); board.className = 'notice-board-wrap';
  data.forEach(notice => {
    const category = noticeLabel(notice.category);
    const row = document.createElement('button'); row.type = 'button'; row.className = 'notice-board-row';
    row.dataset.category = category;
    row.setAttribute('aria-expanded', 'false');
    const contentId = `notice-content-${String(notice.id).replace(/[^a-zA-Z0-9_-]/g, '')}`;
    row.setAttribute('aria-controls', contentId);

    const title = document.createElement('div'); title.className = 'notice-col-title';
    const categoryBadge = document.createElement('span'); categoryBadge.className = 'notice-category-badge';
    categoryBadge.textContent = category === '공지사항' ? '[공지]' : `[${category.replace(/\s/g, '')}]`;
    const titleText = document.createElement('span');
    titleText.textContent = String(notice.title || '').replace(/^\[(공지|공지사항|업데이트|작업\s*소식|기타)\]\s*/, '');
    const folder = document.createElement('span'); folder.className = 'notice-folder'; folder.textContent = '📁'; folder.setAttribute('aria-hidden', 'true');
    title.append(categoryBadge, titleText, folder);

    const date = document.createElement('time'); date.className = 'notice-col-date';
    const createdAt = new Date(notice.published_at || notice.created_at);
    if (!Number.isNaN(createdAt.getTime())) {
      date.dateTime = createdAt.toISOString();
      date.textContent = `${createdAt.getFullYear()}.${String(createdAt.getMonth() + 1).padStart(2, '0')}.${String(createdAt.getDate()).padStart(2, '0')} ${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')}`;
    }
    row.append(title, date);

    const content = document.createElement('div'); content.className = 'notice-content-row'; content.id = contentId;
    const paragraph = document.createElement('p'); paragraph.textContent = notice.content; content.append(paragraph);
    const attachmentList = renderNoticeAttachments(client, notice.attachments);
    if (attachmentList) content.append(attachmentList);
    row.addEventListener('click', () => {
      const opening = !row.classList.contains('active');
      board.querySelectorAll('.notice-board-row').forEach(other => {
        other.classList.remove('active'); other.setAttribute('aria-expanded', 'false');
        if (other.nextElementSibling) other.nextElementSibling.hidden = true;
      });
      if (opening) {
        row.classList.add('active'); row.setAttribute('aria-expanded', 'true'); content.hidden = false;
      }
    });
    board.append(row, content);
  });

  renderNoticeFilters(filters, board);
  list.replaceChildren(board);
}

loadNotices();
