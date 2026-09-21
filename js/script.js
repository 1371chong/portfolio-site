document.addEventListener('DOMContentLoaded', () => {

  const SUPABASE_URL = 'https://rktwmdtjboyihmrrajrc.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdHdtZHRqYm95aWhtcnJhanJjIiwicm9sZSI6InJub24iLCJpYXQiOjE3ODk5MDQ0NTksImV4cCI6MjEwNTQ4MDQ1OX0.LdeCCKnAm5HJu8BlE40HEXuQ5rfJb067PfaA84kY1N0';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzcD0H9nJ7_Xg5QrJrjoMQaQOS8E0Nj82tYXzq5EK_-_n1rwbkMyACe0NfCb22-uP5p/exec";

  // 테마 전환
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });
  }

  // 헤더 스크롤
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, { passive: true });

  // 커서
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorBlur = document.querySelector('.custom-cursor-blur');
  if (window.innerWidth > 768 && cursorDot && cursorBlur) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      cursorBlur.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    });
    document.querySelectorAll('.hover-target').forEach(t => {
      t.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      t.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ScrollSpy
  const sections = document.querySelectorAll('section');
  const tocLinks = document.querySelectorAll('.toc-link');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    const pos = window.pageYOffset + 250;
    sections.forEach(s => {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) current = s.getAttribute('id');
    });
    navLinks.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
    });
    tocLinks.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
    });
  }, { passive: true });

  // 인증 시스템
  let currentUser = localStorage.getItem('jwb_user') || null;
  const authModal = document.getElementById('auth-modal');
  const btnLoginModal = document.getElementById('btn-login-modal');
  const btnLogout = document.getElementById('btn-logout');
  const btnWithdraw = document.getElementById('btn-withdraw');
  const userGreeting = document.getElementById('user-greeting');

  function updateAuthUI() {
    const freeForm = document.getElementById('free-board-form');
    const freeLoginMsg = document.getElementById('free-login-required-msg');
    const freeAuthorInput = document.getElementById('free-author');

    if (currentUser) {
      if (btnLoginModal) btnLoginModal.style.display = 'none';
      if (btnLogout) btnLogout.style.display = 'inline-block';
      if (btnWithdraw) btnWithdraw.style.display = 'inline-block';
      if (userGreeting) { userGreeting.style.display = 'inline-block'; userGreeting.textContent = `${currentUser}님 환영합니다`; }
      if (freeForm) freeForm.style.display = 'block';
      if (freeLoginMsg) freeLoginMsg.style.display = 'none';
      if (freeAuthorInput) freeAuthorInput.value = currentUser;
    } else {
      if (btnLoginModal) btnLoginModal.style.display = 'inline-block';
      if (btnLogout) btnLogout.style.display = 'none';
      if (btnWithdraw) btnWithdraw.style.display = 'none';
      if (userGreeting) userGreeting.style.display = 'none';
      if (freeForm) freeForm.style.display = 'none';
      if (freeLoginMsg) freeLoginMsg.style.display = 'block';
    }
  }
  updateAuthUI();

  if (btnLoginModal) btnLoginModal.addEventListener('click', () => authModal.classList.add('active'));
  document.querySelector('.auth-modal-close')?.addEventListener('click', () => authModal.classList.remove('active'));

  if (btnLogout) btnLogout.addEventListener('click', () => { localStorage.removeItem('jwb_user'); currentUser = null; updateAuthUI(); alert('로그아웃 되었습니다.'); });

  // 첨부파일 HTML 헬퍼 함수
  function createAttachmentHTML(fileName, fileSize, fileUrl, downloadCount = 0, dateStr = '') {
    if (!fileUrl) return '';
    return `
      <div class="jwb-attachment-row">
        <div class="jwb-attachment-left">
          <i class="fa-solid fa-download" style="color: var(--text-sub);"></i>
          <a href="${fileUrl}" download target="_blank" class="jwb-attachment-link">${fileName} (${fileSize || '0KB'})</a>
          <span class="jwb-attachment-count">+${downloadCount}</span>
        </div>
        <div class="jwb-attachment-date"><i class="fa-regular fa-clock"></i> ${dateStr}</div>
      </div>
    `;
  }

  // 1. 공지사항 데이터 로드 및 렌더링 (첨부파일 아이콘 및 상세보기 모달)
  let allNotices = [];
  let currentNoticePage = 1;

  async function loadNotices() {
    const list = document.getElementById('notice-list');
    if (!list) return;
    try {
      const { data: notices } = await supabase.from('notices').select('*');
      allNotices = notices ? notices.sort((a, b) => b.id - a.id) : [];
      renderNotices();
    } catch (e) { list.innerHTML = '<li style="text-align:center;">공지 로드 실패</li>'; }
  }

  window.filterNotices = () => { currentNoticePage = 1; renderNotices(); };
  window.changeNoticePage = (p) => { currentNoticePage = p; renderNotices(); };

  function renderNotices() {
    const list = document.getElementById('notice-list');
    if (!list) return;
    const cat = document.getElementById('notice-category-filter')?.value || '';
    const kw = document.getElementById('notice-search-input')?.value.toLowerCase().trim() || '';

    const filtered = allNotices.filter(n => (cat === '' || (n.category || '공지') === cat) && ((n.title || '').toLowerCase().includes(kw) || (n.content || '').toLowerCase().includes(kw)));
    const totalPages = Math.ceil(filtered.length / 5) || 1;
    if (currentNoticePage > totalPages) currentNoticePage = totalPages;
    const currentItems = filtered.slice((currentNoticePage - 1) * 5, currentNoticePage * 5);

    list.innerHTML = '';
    if (currentItems.length === 0) {
      list.innerHTML = '<li style="text-align:center; padding:20px; color:var(--text-sub);">등록된 공지사항이 없습니다.</li>';
      document.getElementById('notice-pagination').innerHTML = '';
      return;
    }

    currentItems.forEach(item => {
      const safeTitle = (item.title || '').replace(/'/g, "\\'");
      const safeContent = (item.content || '').replace(/'/g, "\\'").replace(/\n/g, '\\n');
      const hasFile = item.file_url && item.file_url.trim() !== '';
      const fileIcon = hasFile ? `<i class="fa-solid fa-file-arrow-down" style="color: #38bdf8; margin-right: 6px;" title="첨부파일 있음"></i>` : '';

      list.innerHTML += `
        <li class="jwb-post-item hover-target" style="cursor: pointer; padding: 15px; border-bottom: 1px solid var(--border);" onclick="openNoticeModal('${safeTitle}', '${item.date || ''}', '${safeContent}', '${item.file_name || ''}', '${item.file_size || ''}', '${item.file_url || ''}')">
          <div class="jwb-post-header">
            <div>
              <span style="color:var(--accent); font-weight:700; margin-right:8px; font-size:0.85rem; padding:2px 6px; background:var(--pill-bg); border-radius:4px;">[${item.category || '공지'}]</span>
              ${fileIcon}
              <span class="jwb-post-title" style="font-weight:600; color:var(--text-main);">${item.title}</span>
            </div>
            <span class="jwb-post-meta" style="font-size:0.8rem; color:var(--text-sub);">${item.date}</span>
          </div>
          <div class="jwb-post-content" style="margin-top:6px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-size:0.9rem; color:var(--text-sub);">${item.content}</div>
        </li>
      `;
    });

    let btns = '';
    for (let i = 1; i <= totalPages; i++) {
      btns += `<button onclick="changeNoticePage(${i})" style="padding:6px 12px; border-radius:6px; border:1px solid var(--border); background:${i === currentNoticePage ? 'var(--accent)' : 'var(--pill-bg)'}; color:#fff; cursor:pointer; font-weight:600; margin:0 2px;">${i}</button>`;
    }
    document.getElementById('notice-pagination').innerHTML = btns;
  }

  const noticeModal = document.getElementById('notice-modal');
  document.querySelector('.notice-modal-close')?.addEventListener('click', () => noticeModal.classList.remove('active'));
  window.openNoticeModal = (title, date, content, fileName, fileSize, fileUrl) => {
    document.getElementById('notice-modal-title').textContent = title;
    document.getElementById('notice-modal-date').textContent = date;
    document.getElementById('notice-modal-content').textContent = content;
    document.getElementById('notice-modal-attachment').innerHTML = createAttachmentHTML(fileName, fileSize, fileUrl, 0, date);
    noticeModal.classList.add('active');
  };

  // 2. 자유게시판 데이터 로드 및 렌더링 (제목 클릭 시 상세보기 및 첨부파일 아이콘)
  let allFreePosts = [];
  let currentFreePage = 1;

  async function loadFreeBoard() {
    const list = document.getElementById('public-free-list');
    if (!list) return;
    try {
      const { data: posts } = await supabase.from('free_board').select('*');
      allFreePosts = posts ? posts.sort((a, b) => b.id - a.id) : [];
      renderFreeBoard();
    } catch (e) { list.innerHTML = '<li style="text-align:center;">자유게시판 로드 실패</li>'; }
  }

  window.filterFreeBoard = () => { currentFreePage = 1; renderFreeBoard(); };
  window.changeFreePage = (p) => { currentFreePage = p; renderFreeBoard(); };

  function renderFreeBoard() {
    const list = document.getElementById('public-free-list');
    if (!list) return;
    const kw = document.getElementById('free-search-input')?.value.toLowerCase().trim() || '';

    const filtered = allFreePosts.filter(p => (p.title || '').toLowerCase().includes(kw) || (p.content || '').toLowerCase().includes(kw) || (p.author || '').toLowerCase().includes(kw));
    const totalPages = Math.ceil(filtered.length / 5) || 1;
    if (currentFreePage > totalPages) currentFreePage = totalPages;
    const currentItems = filtered.slice((currentFreePage - 1) * 5, currentFreePage * 5);

    list.innerHTML = '';
    if (currentItems.length === 0) {
      list.innerHTML = '<li style="text-align:center; padding:20px; color:var(--text-sub);">검색된 게시글이 없습니다.</li>';
      document.getElementById('free-pagination').innerHTML = '';
      return;
    }

    currentItems.forEach(f => {
      const safeTitle = (f.title || '').replace(/'/g, "\\'");
      const safeAuthor = (f.author || '').replace(/'/g, "\\'");
      const safeContent = (f.content || '').replace(/'/g, "\\'").replace(/\n/g, '\\n');
      const hasFile = f.file_url && f.file_url.trim() !== '';
      const fileIcon = hasFile ? `<i class="fa-solid fa-file-arrow-down" style="color: #38bdf8; margin-right: 6px;" title="첨부파일 있음"></i>` : '';

      list.innerHTML += `
        <li class="jwb-post-item" style="padding: 15px; border-bottom: 1px solid var(--border); cursor: pointer;" onclick="openFreeModal('${safeTitle}', '${safeAuthor}', '${f.date || ''}', '${safeContent}', '${f.file_name || ''}', '${f.file_size || ''}', '${f.file_url || ''}')">
          <div class="jwb-post-header">
            <div>
              ${fileIcon}
              <span class="jwb-post-title" style="font-weight:600; color:var(--text-main);">${f.title}</span>
            </div>
            <span class="jwb-post-meta" style="font-size:0.8rem; color:var(--text-sub);">by ${f.author}</span>
          </div>
          <div class="jwb-post-content" style="margin-top:6px; font-size:0.9rem; color:var(--text-sub);">${f.content}</div>
        </li>
      `;
    });

    let btns = '';
    for (let i = 1; i <= totalPages; i++) {
      btns += `<button onclick="changeFreePage(${i})" style="padding:6px 12px; border-radius:6px; border:1px solid var(--border); background:${i === currentFreePage ? 'var(--accent)' : 'var(--pill-bg)'}; color:#fff; cursor:pointer; font-weight:600; margin:0 2px;">${i}</button>`;
    }
    document.getElementById('free-pagination').innerHTML = btns;
  }

  const freeModal = document.getElementById('free-modal');
  document.querySelector('.free-modal-close')?.addEventListener('click', () => freeModal.classList.remove('active'));
  window.openFreeModal = (title, author, date, content, fileName, fileSize, fileUrl) => {
    document.getElementById('free-modal-title').textContent = title;
    document.getElementById('free-modal-author').textContent = author;
    document.getElementById('free-modal-date').textContent = date;
    document.getElementById('free-modal-content').textContent = content;
    document.getElementById('free-modal-attachment').innerHTML = createAttachmentHTML(fileName, fileSize, fileUrl, 0, date);
    freeModal.classList.add('active');
  };

  // 자유게시판 글 등록
  document.getElementById('free-board-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return alert('로그인 후 이용해주세요.');
    const payload = {
      title: document.getElementById('free-title').value,
      author: currentUser,
      content: document.getElementById('free-content').value,
      file_name: document.getElementById('free-file-name').value || null,
      file_url: document.getElementById('free-file-url').value || null,
      file_size: document.getElementById('free-file-size').value || null,
      date: new Date().toLocaleString()
    };
    const { error } = await supabase.from('free_board').insert([payload]);
    if (!error) {
      alert('등록되었습니다!');
      e.target.reset();
      loadFreeBoard();
    } else {
      alert('등록 실패: ' + error.message);
    }
  });

  loadNotices();
  loadFreeBoard();
});
