document.addEventListener('DOMContentLoaded', () => {

  const SUPABASE_URL = 'https://rktwmdtjboyihmrrajrc.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdHdtZHRqYm95aWhtcnJhanJjIiwicm9sZSI6InJub24iLCJpYXQiOjE3ODk5MDQ0NTksImV4cCI6MjEwNTQ4MDQ1OX0.LdeCCKnAm5HJu8BlE40HEXuQ5rfJb067PfaA84kY1N0';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzcD0H9nJ7_Xg5QrJrjoMQaQOS8E0Nj82tYXzq5EK_-_n1rwbkMyACe0NfCb22-uP5p/exec";

  // 테마 토글
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });
  }

  // 헤더 스크롤 감지
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // 비밀번호 해시 암호화 함수 (SHA-256)
  async function hashPassword(password) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ==========================================
  // 사용자 인증 및 모달 제어 영역
  // ==========================================
  let currentUser = localStorage.getItem('jwb_user') || null;
  const authModal = document.getElementById('auth-modal');
  const btnLoginModal = document.getElementById('btn-login-modal');
  const btnLogout = document.getElementById('btn-logout');
  const btnWithdraw = document.getElementById('btn-withdraw');
  const userGreeting = document.getElementById('user-greeting');

  const loginViewArea = document.getElementById('login-view-area');
  const signupViewArea = document.getElementById('signup-view-area');
  const findIdViewArea = document.getElementById('find-id-view-area');
  const findPwViewArea = document.getElementById('find-pw-view-area');

  function hideAllAuthViews() {
    if (loginViewArea) loginViewArea.style.display = 'none';
    if (signupViewArea) signupViewArea.style.display = 'none';
    if (findIdViewArea) findIdViewArea.style.display = 'none';
    if (findPwViewArea) findPwViewArea.style.display = 'none';
  }

  function updateAuthUI() {
    const freeForm = document.getElementById('free-board-form');
    const freeLoginMsg = document.getElementById('free-login-required-msg');
    const freeAuthorInput = document.getElementById('free-author');

    if (currentUser) {
      if (btnLoginModal) btnLoginModal.style.display = 'none';
      if (btnLogout) btnLogout.style.display = 'inline-block';
      if (btnWithdraw) btnWithdraw.style.display = 'inline-block';
      if (userGreeting) { 
        userGreeting.style.display = 'inline-block'; 
        userGreeting.textContent = `${currentUser}님 환영합니다`; 
      }
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

  if (btnLoginModal) {
    btnLoginModal.addEventListener('click', () => {
      hideAllAuthViews();
      if (loginViewArea) loginViewArea.style.display = 'block';
      if (authModal) authModal.classList.add('active');
    });
  }

  const authCloseBtn = document.querySelector('.auth-modal-close');
  if (authCloseBtn) authCloseBtn.addEventListener('click', () => authModal.classList.remove('active'));
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) authModal.classList.remove('active');
    });
  }

  // 회원가입 / ID 찾기 / PW 찾기 뷰 전환 버튼 이벤트
  document.getElementById('go-to-signup')?.addEventListener('click', () => { hideAllAuthViews(); if(signupViewArea) signupViewArea.style.display = 'block'; });
  document.getElementById('go-to-find-id')?.addEventListener('click', () => { hideAllAuthViews(); if(findIdViewArea) findIdViewArea.style.display = 'block'; });
  document.getElementById('go-to-find-pw')?.addEventListener('click', () => { hideAllAuthViews(); if(findPwViewArea) findPwViewArea.style.display = 'block'; });

  document.querySelectorAll('.go-to-login-btn').forEach(btn => {
    btn.addEventListener('click', () => { hideAllAuthViews(); if(loginViewArea) loginViewArea.style.display = 'block'; });
  });

  // 회원가입 제출
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('signup-id').value.trim();
      const pw = document.getElementById('signup-pw').value;
      const name = document.getElementById('signup-name').value.trim();

      const term1 = document.getElementById('term-1')?.checked;
      const term2 = document.getElementById('term-2')?.checked;
      const term3 = document.getElementById('term-3')?.checked;
      const term4 = document.getElementById('term-4')?.checked || false;

      if (!term1 || !term2 || !term3) {
        alert('필수 약관에 모두 동의하셔야 합니다.');
        return;
      }

      // 아이디 중복 확인
      const { data: existingUser } = await supabase.from('users').select('*').eq('userid', id).single();
      if (existingUser) {
        alert('이미 존재하는 아이디입니다.');
        return;
      }

      const hashedPassword = await hashPassword(pw);
      const dateStr = new Date().toLocaleString();

      const { error } = await supabase.from('users').insert([{
        userid: id,
        password: hashedPassword,
        username: name,
        marketing: term4,
        created_at: dateStr
      }]);

      if (!error) {
        alert('회원가입이 완료되었습니다! 로그인해 주세요.');
        signupForm.reset();
        hideAllAuthViews();
        if(loginViewArea) loginViewArea.style.display = 'block';
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
        console.error(error);
      }
    });
  }

  // 로그인 제출
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('login-id').value.trim();
      const pw = document.getElementById('login-pw').value;

      const hashedPassword = await hashPassword(pw);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('userid', id)
        .eq('password', hashedPassword)
        .single();

      if (!error && data) {
        currentUser = data.username;
        localStorage.setItem('jwb_user', currentUser);
        if(authModal) authModal.classList.remove('active');
        loginForm.reset();
        updateAuthUI();
        alert(`${currentUser}님 환영합니다!`);
      } else {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    });
  }

  // 아이디 찾기 제출
  const findIdForm = document.getElementById('find-id-form');
  if (findIdForm) {
    findIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('find-id-name').value.trim();

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', name)
        .single();

      if (!error && data) {
        alert(`회원님의 아이디는 [ ${data.userid} ] 입니다.`);
        hideAllAuthViews();
        if(loginViewArea) loginViewArea.style.display = 'block';
      } else {
        alert('입력하신 이름과 일치하는 회원 정보가 없습니다.');
      }
    });
  }

  // 비밀번호 찾기 제출
  const findPwForm = document.getElementById('find-pw-form');
  if (findPwForm) {
    findPwForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('find-pw-id').value.trim();
      const name = document.getElementById('find-pw-name').value.trim();

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('userid', id)
        .eq('username', name)
        .single();

      if (!error && data) {
        const tempPw = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedTempPw = await hashPassword(tempPw);

        const { error: updateError } = await supabase
          .from('users')
          .update({ password: hashedTempPw })
          .eq('userid', id);

        if (!updateError) {
          alert(`임시 비밀번호가 발급되었습니다: [ ${tempPw} ]\n\n로그인 후 반드시 비밀번호를 변경해 주세요.`);
          hideAllAuthViews();
          if(loginViewArea) loginViewArea.style.display = 'block';
        } else {
          alert('임시 비밀번호 발급 중 오류가 발생했습니다.');
        }
      } else {
        alert('입력하신 정보와 일치하는 계정이 없습니다.');
      }
    });
  }

  // 로그아웃
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('jwb_user');
      currentUser = null;
      updateAuthUI();
      alert('로그아웃 되었습니다.');
    });
  }

  // 회원탈퇴
  if (btnWithdraw) {
    btnWithdraw.addEventListener('click', async () => {
      if (!currentUser) return;
      if (!confirm(`정말 ${currentUser} 계정을 탈퇴하시겠습니까? 탈퇴 시 정보가 삭제됩니다.`)) return;

      const { error } = await supabase.from('users').delete().eq('username', currentUser);
      if (!error) {
        alert('회원탈퇴가 완료되었습니다.');
        localStorage.removeItem('jwb_user');
        currentUser = null;
        updateAuthUI();
      } else {
        alert('회원탈퇴 처리에 실패했습니다.');
      }
    });
  }

  // 약관 전체 동의 체크박스 연동
  const termAll = document.getElementById('term-all');
  const termItems = document.querySelectorAll('.term-item');
  if (termAll) {
    termAll.addEventListener('change', (e) => {
      termItems.forEach(term => term.checked = e.target.checked);
    });
    termItems.forEach(term => {
      term.addEventListener('change', () => {
        termAll.checked = Array.from(termItems).every(t => t.checked);
      });
    });
  }


  // ==========================================
  // 첨부파일 행 생성 헬퍼 함수
  // ==========================================
  function createAttachmentHTML(fileName, fileSize, fileUrl, downloadCount = 0, dateStr = '') {
    if (!fileUrl) return '';
    return `
      <div class="jwb-attachment-row">
        <div class="jwb-attachment-left">
          <i class="fa-solid fa-download" style="color: var(--accent);"></i>
          <a href="${fileUrl}" download target="_blank" class="jwb-attachment-link">
            ${fileName} (${fileSize || '0.0K'})
          </a>
          <span class="jwb-attachment-count">+${downloadCount}</span>
        </div>
        <div class="jwb-attachment-date">
          <i class="fa-regular fa-clock"></i> ${dateStr}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 공지사항 및 자유게시판 로드
  // ==========================================
  let allNotices = [];
  async function loadNotices() {
    const list = document.getElementById('notice-list');
    if(!list) return;
    const { data } = await supabase.from('notices').select('*');
    allNotices = data ? data.sort((a, b) => b.id - a.id) : [];
    renderNotices();
  }

  window.renderNotices = function() {
    const list = document.getElementById('notice-list');
    if(!list) return;
    list.innerHTML = '';
    if(allNotices.length === 0) { list.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">공지사항이 없습니다.</td></tr>'; return; }

    allNotices.forEach((item, idx) => {
      const hasFile = item.file_url ? '<i class="fa-solid fa-paperclip"></i>' : '';
      list.innerHTML += `
        <tr class="hover-target" onclick="openNoticeModal('${(item.title||'').replace(/'/g, "\\'")}', '${item.date}', '${(item.content||'').replace(/'/g, "\\'").replace(/\n/g, '\\n')}', '${item.file_name||''}', '${item.file_size||''}', '${item.file_url||''}', ${item.download_count||0})">
          <td class="board-num">${allNotices.length - idx}</td>
          <td class="board-title-cell">${hasFile} <span>[${item.category || '공지'}] ${item.title}</span></td>
          <td class="board-author">최고관리자</td>
          <td class="board-date">${item.date}</td>
          <td class="board-views">${item.download_count || 53}</td>
        </tr>
      `;
    });
  }

  const noticeModal = document.getElementById('notice-modal');
  document.querySelector('.notice-modal-close')?.addEventListener('click', () => noticeModal.classList.remove('active'));

  window.openNoticeModal = function(title, date, content, fileName, fileSize, fileUrl, downloadCount) {
    document.getElementById('notice-modal-title').textContent = title;
    document.getElementById('notice-modal-date').textContent = date;
    document.getElementById('notice-modal-content').textContent = content;
    document.getElementById('notice-modal-attachment').innerHTML = createAttachmentHTML(fileName, fileSize, fileUrl, downloadCount, date);
    noticeModal.classList.add('active');
  };

  let allFreePosts = [];
  async function loadFreeBoard() {
    const list = document.getElementById('public-free-list');
    if(!list) return;
    const { data } = await supabase.from('free_board').select('*');
    allFreePosts = data ? data.sort((a, b) => b.id - a.id) : [];
    renderFreeBoard();
  }

  window.renderFreeBoard = function() {
    const list = document.getElementById('public-free-list');
    if(!list) return;
    list.innerHTML = '';
    if(allFreePosts.length === 0) { list.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">게시글이 없습니다.</td></tr>'; return; }

    allFreePosts.forEach((f, idx) => {
      const hasFile = f.file_url ? '<i class="fa-solid fa-paperclip"></i>' : '';
      list.innerHTML += `
        <tr class="hover-target" onclick="openFreeModal('${(f.title||'').replace(/'/g, "\\'")}', '${f.author}', '${f.date}', '${(f.content||'').replace(/'/g, "\\'").replace(/\n/g, '\\n')}', '${f.file_name||''}', '${f.file_size||''}', '${f.file_url||''}', ${f.download_count||0})">
          <td class="board-num">${allFreePosts.length - idx}</td>
          <td class="board-title-cell">${hasFile} <span>${f.title}</span></td>
          <td class="board-author">${f.author}</td>
          <td class="board-date">${f.date}</td>
          <td class="board-views">12</td>
        </tr>
      `;
    });
  }

  const freeModal = document.getElementById('free-modal');
  document.querySelector('.free-modal-close')?.addEventListener('click', () => freeModal.classList.remove('active'));

  window.openFreeModal = function(title, author, date, content, fileName, fileSize, fileUrl, downloadCount) {
    document.getElementById('free-modal-title').textContent = title;
    document.getElementById('free-modal-author').textContent = author;
    document.getElementById('free-modal-date').textContent = date;
    document.getElementById('free-modal-content').textContent = content;
    document.getElementById('free-modal-attachment').innerHTML = createAttachmentHTML(fileName, fileSize, fileUrl, downloadCount, date);
    freeModal.classList.add('active');
  };

  // 자유게시판 파일 업로드 및 글 작성
  document.getElementById('free-file-input')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const res = await fetch(GAS_WEB_APP_URL, { method: 'POST', body: JSON.stringify({ fileName: file.name, mimeType: file.type, fileData: reader.result.split(',')[1] }) });
      const r = await res.json();
      if(r.status === 'success') {
        document.getElementById('free-file-name').value = file.name;
        document.getElementById('free-file-url').value = r.url;
        document.getElementById('free-file-size').value = (file.size / 1024).toFixed(1) + 'KB';
        alert('첨부파일 업로드 완료!');
      }
    };
  });

  document.getElementById('free-board-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!currentUser) { alert('로그인이 필요합니다.'); return; }
    const payload = {
      title: document.getElementById('free-title').value,
      author: currentUser,
      content: document.getElementById('free-content').value,
      file_name: document.getElementById('free-file-name').value || null,
      file_url: document.getElementById('free-file-url').value || null,
      file_size: document.getElementById('free-file-size').value || null,
      date: new Date().toLocaleDateString()
    };
    const { error } = await supabase.from('free_board').insert([payload]);
    if(!error) { 
      alert('등록되었습니다!'); 
      e.target.reset(); 
      document.getElementById('free-file-name').value = '';
      document.getElementById('free-file-url').value = '';
      document.getElementById('free-file-size').value = '';
      document.getElementById('free-author').value = currentUser;
      loadFreeBoard(); 
    }
  });

  // 포트폴리오 로드
  const pfContainer = document.getElementById('portfolio-list-container');
  async function loadPortfolios() {
    if(!pfContainer) return;
    const { data } = await supabase.from('portfolios').select('*');
    if(!data) return;
    data.sort((a, b) => b.id - a.id);

    data.forEach(item => {
      const videoId = item.link ? item.link.split('v=')[1]?.substring(0, 11) : '';
      const thumb = item.thumb || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'img/default_thumb.jpg');
      
      pfContainer.insertAdjacentHTML('beforeend', `
        <div class="portfolio-card dynamic-portfolio-card hover-target zoom-card" data-category="${item.category}">
          <div class="card-thumb-box img-zoom-wrapper" onclick="openPortfolioModal('${videoId}', '${(item.title||'').replace(/'/g, "\\'")}', '${item.tools}', '${(item.desc||'').replace(/'/g, "\\'").replace(/\n/g, '\\n')}')">
            <img src="${thumb}" alt="썸네일">
            <div class="play-overlay"><span>VIEW DETAIL</span></div>
          </div>
          <div class="card-info">
            <span class="card-tag">${item.category_name}</span>
            <h3 class="card-title">${item.title}</h3>
            <p class="card-desc">${(item.desc||'').substring(0, 40)}...</p>
            <div class="card-meta">
              <span><i class="fa-solid fa-wrench"></i> ${item.tools}</span>
            </div>
          </div>
        </div>
      `);
    });
  }

  window.openPortfolioModal = function(videoId, title, tools, desc) {
    const videoModal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    if(videoId) { iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`; iframe.style.display = 'block'; }
    else { iframe.src = ''; iframe.style.display = 'none'; }

    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-desc').textContent = desc;
    
    const toolsContainer = document.getElementById('modal-tools');
    if(toolsContainer) {
      toolsContainer.innerHTML = '';
      tools.split(',').forEach(tool => {
        if(tool.trim()) toolsContainer.innerHTML += `<span class="tool-badge">${tool.trim()}</span>`;
      });
    }
    videoModal.classList.add('active');
  };

  loadNotices();
  loadFreeBoard();
  loadPortfolios();

});
