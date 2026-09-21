document.addEventListener('DOMContentLoaded', () => {

  const SUPABASE_URL = 'https://rktwmdtjboyihmrrajrc.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdHdtZHRqYm95aWhtcnJhanJjIiwicm9sZSI6InJub24iLCJpYXQiOjE3ODk5MDQ0NTksImV4cCI6MjEwNTQ4MDQ1OX0.LdeCCKnAm5HJu8BlE40HEXuQ5rfJb067PfaA84kY1N0';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 테마 전환
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });
  }

  // 헤더 스크롤 효과
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  }, { passive: true });

  // 인증 시스템 상태 관리
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

  if (btnLoginModal) btnLoginModal.addEventListener('click', () => authModal?.classList.add('active'));
  document.querySelector('.auth-modal-close')?.addEventListener('click', () => authModal?.classList.remove('active'));
  if (btnLogout) btnLogout.addEventListener('click', () => { localStorage.removeItem('jwb_user'); currentUser = null; updateAuthUI(); alert('로그아웃 되었습니다.'); });

  // 첨부파일 HTML 생성 헬퍼 함수
  function createAttachmentHTML(fileName, fileSize, fileUrl, downloadCount = 0, dateStr = '') {
    if (!fileUrl || fileUrl.trim() === '') return '';
    return `
      <div class="jwb-attachment-row" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--pill-bg); border: 1px solid var(--border); border-radius: 6px; margin-top: 10px; font-size: 0.85rem;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-download" style="color: var(--text-sub);"></i>
          <a href="${fileUrl}" download target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: 500;">
            ${fileName || '첨부파일'} (${fileSize || '0KB'})
          </a>
          <span style="color: #ef4444; font-weight: 600; margin-left: 4px;">+${downloadCount}</span>
        </div>
        <div style="color: var(--text-sub); font-size: 0.8rem;"><i class="fa-regular fa-clock"></i> ${dateStr}</div>
      </div>
    `;
  }

  // 1. 공지사항 데이터 로드 및 렌더링
  let allNotices = [];
  let currentNoticePage = 1;

  async function loadNotices() {
    const list = document.getElementById('notice-list');
    if (!list) return;
    try {
      const { data: notices, error } = await supabase.from('notices').select('*');
      if (error) {
        list.innerHTML = '<li style="text-align:center; padding:20px; color:var(--text-sub);">공지사항을 불러오지 못했습니다.</li>';
        return;
      }
      allNotices = notices ? notices.sort((a, b) => b.id - a.id) : [];
      renderNotices();
    } catch (e) {
      list.innerHTML = '<li style="text-align:center; padding:20px; color:var(--text-sub);">서버 연결 오류</li>';
    }
  }

  window.filterNotices = () => { currentNoticePage = 1; renderNotices(); };
  window.changeNoticePage = (p) => { currentNoticePage = p; renderNotices(); };

  function renderNotices() {
    const list = document.getElementById('notice-list');
    if (!list) return;

    const cat = document.getElementById('notice-category-filter')?.value || '';
    const kw = document.getElementById('notice-search-input')?.value.toLowerCase().trim() || '';

    const filtered = allNotices.filter(n => {
      const matchCat = cat === '' || (n.category || '공지') === cat;
      const matchKw = (n.title || '').toLowerCase().includes(kw) || (n.content || '').toLowerCase().includes(kw);
      return matchCat && matchKw;
    });

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
      const safeTitle = (item.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const safeContent = (item.content || '').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/"/g, '&quot;');
      
      const hasFile = item.file_url && item.file_url.trim() !== '';
      const fileIcon = hasFile ? `<i class="fa-solid fa-file-arrow-down" style="color: #38bdf8; margin-right: 6px;" title="첨부파일 있음"></i>` : '';

      list.innerHTML += `
        <li class="jwb-post-item hover-target" style="cursor: pointer; padding: 15px; border-bottom: 1px solid var(--border);" onclick="openNoticeModal('${safeTitle}', '${item.date || ''}', '${safeContent}', '${item.file_name || ''}', '${item.file_size || ''}', '${item.file_url || ''}')">
          <div class="jwb-post-header" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
            <div>
              <span style="color:var(--accent); font-weight:700; margin-right:8px; font-size:0.85rem; padding:2px 6px; background:var(--pill-bg); border-radius:4px;">[${item.category || '공지'}]</span>
              ${fileIcon}
              <span class="jwb-post-title" style="font-weight:600; color:var(--text-main);">${item.title}</span>
            </div>
            <span class="jwb-post-meta" style="font-size:0.8rem; color:var(--text-sub);">${item.date || ''}</span>
          </div>
          <div class="jwb-post-content" style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-size:0.9rem; color:var(--text-sub);">${item.content}</div>
        </li>
      `;
    });

    let btns = '';
    for (let i = 1; i <= totalPages; i++) {
      btns += `<button onclick="changeNoticePage(${i})" style="padding:6px 12px; border-radius:6px; border:1px solid var(--border); background:${i === currentNoticePage ? 'var(--accent)' : 'var(--pill-bg)'}; color:#fff; cursor:pointer; font-weight:600; margin:0 2px;">${i}</button>`;
    }
    const pageContainer = document.getElementById('notice-pagination');
    if (pageContainer) pageContainer.innerHTML = btns;
  }

  // 공지사항 모달 제어
  const noticeModal = document.getElementById('notice-modal');
  document.querySelector('.notice-modal-close')?.addEventListener('click', () => noticeModal?.classList.remove('active'));
  if (noticeModal) {
    noticeModal.addEventListener('click', (e) => { if (e.target === noticeModal) noticeModal.classList.remove('active'); });
  }

  window.openNoticeModal = function(title, date, content, fileName, fileSize, fileUrl) {
    document.getElementById('notice-modal-title').textContent = title;
    document.getElementById('notice-modal-date').textContent = date;
    document.getElementById('notice-modal-content').textContent = content.replace(/\\n/g, '\n');
    document.getElementById('notice-modal-attachment').innerHTML = createAttachmentHTML(fileName, fileSize, fileUrl, 0, date);
    noticeModal?.classList.add('active');
  };

  // 2. 자유게시판 데이터 로드 및 렌더링
  let allFreePosts = [];
  let currentFreePage = 1;

  async function loadFreeBoard() {
    const list = document.getElementById('public-free-list');
    if (!list) return;
    try {
      const { data: posts, error } = await supabase.from('free_board').select('*');
      if (error) {
        list.innerHTML = '<li style="text-align:center; padding:20px; color:var(--text-sub);">게시글을 불러오지 못했습니다.</li>';
        return;
      }
      allFreePosts = posts ? posts.sort((a, b) => b.id - a.id) : [];
      renderFreeBoard();
    } catch (e) {
      list.innerHTML = '<li style="text-align:center; padding:20px; color:var(--text-sub);">서버 연결 오류</li>';
    }
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
      const safeTitle = (f.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const safeAuthor = (f.author || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const safeContent = (f.content || '').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/"/g, '&quot;');

      const hasFile = f.file_url && f.file_url.trim() !== '';
      const fileIcon = hasFile ? `<i class="fa-solid fa-file-arrow-down" style="color: #38bdf8; margin-right: 6px;" title="첨부파일 있음"></i>` : '';

      list.innerHTML += `
        <li class="jwb-post-item" style="padding: 15px; border-bottom: 1px solid var(--border); cursor: pointer;" onclick="openFreeModal('${safeTitle}', '${safeAuthor}', '${f.date || ''}', '${safeContent}', '${f.file_name || ''}', '${f.file_size || ''}', '${f.file_url || ''}')">
          <div class="jwb-post-header" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
            <div>
              ${fileIcon}
              <span class="jwb-post-title" style="font-weight:600; color:var(--text-main);">${f.title}</span>
            </div>
            <span class="jwb-post-meta" style="font-size:0.8rem; color:var(--text-sub);">by ${f.author}</span>
          </div>
          <div class="jwb-post-content" style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; font-size:0.9rem; color:var(--text-sub);">${f.content}</div>
        </li>
      `;
    });

    let btns = '';
    for (let i = 1; i <= totalPages; i++) {
      btns += `<button onclick="changeFreePage(${i})" style="padding:6px 12px; border-radius:6px; border:1px solid var(--border); background:${i === currentFreePage ? 'var(--accent)' : 'var(--pill-bg)'}; color:#fff; cursor:pointer; font-weight:600; margin:0 2px;">${i}</button>`;
    }
    const pageContainer = document.getElementById('free-pagination');
    if (pageContainer) pageContainer.innerHTML = btns;
  }

  // 자유게시판 모달 제어
  const freeModal = document.getElementById('free-modal');
  document.querySelector('.free-modal-close')?.addEventListener('click', () => freeModal?.classList.remove('active'));
  if (freeModal) {
    freeModal.addEventListener('click', (e) => { if (e.target === freeModal) freeModal.classList.remove('active'); });
  }

  window.openFreeModal = function(title, author, date, content, fileName, fileSize, fileUrl) {
    document.getElementById('free-modal-title').textContent = title;
    document.getElementById('free-modal-author').textContent = author;
    document.getElementById('free-modal-date').textContent = date;
    document.getElementById('free-modal-content').textContent = content.replace(/\\n/g, '\n');
    document.getElementById('free-modal-attachment').innerHTML = createAttachmentHTML(fileName, fileSize, fileUrl, 0, date);
    freeModal?.classList.add('active');
  };

  // 3. 자유게시판 글 작성(등록) 처리
  const freeForm = document.getElementById('free-board-form');
  if (freeForm) {
    freeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentUser) {
        alert('로그인 후 이용해 주세요.');
        return;
      }

      const title = document.getElementById('free-title').value.trim();
      const content = document.getElementById('free-content').value.trim();
      const fileName = document.getElementById('free-file-name')?.value || null;
      const fileUrl = document.getElementById('free-file-url')?.value || null;
      const fileSize = document.getElementById('free-file-size')?.value || null;

      if (!title || !content) {
        alert('제목과 내용을 모두 입력해 주세요.');
        return;
      }

      const payload = {
        title: title,
        author: currentUser,
        content: content,
        file_name: fileName,
        file_url: fileUrl,
        file_size: fileSize,
        date: new Date().toLocaleString()
      };

      try {
        const { error } = await supabase.from('free_board').insert([payload]);
        if (error) {
          alert('등록 실패: ' + error.message);
        } else {
          alert('자유게시판 글이 성공적으로 등록되었습니다!');
          freeForm.reset();
          if (document.getElementById('free-author')) {
            document.getElementById('free-author').value = currentUser;
          }
          loadFreeBoard();
        }
      } catch (err) {
        alert('서버 통신 중 오류가 발생했습니다.');
      }
    });
  }

  // 초기 실행
  loadNotices();
  loadFreeBoard();

});
