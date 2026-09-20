document.addEventListener('DOMContentLoaded', () => {

  // 0. 다크 / 라이트 테마 전환 토글
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  // 1. 헤더 스크롤 감지 모션
  const header = document.getElementById('header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 2. 히어로 자동 캐러셀 슬라이더
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
    });
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() { showSlide(currentSlide + 1); }
  function prevSlide() { showSlide(currentSlide - 1); }
  function startAutoSlide() { stopAutoSlide(); slideInterval = setInterval(nextSlide, 5000); }
  function stopAutoSlide() { if (slideInterval) clearInterval(slideInterval); }

  if (nextBtn) { nextBtn.addEventListener('click', () => { nextSlide(); startAutoSlide(); }); }
  if (prevBtn) { prevBtn.addEventListener('click', () => { prevSlide(); startAutoSlide(); }); }
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      showSlide(index);
      startAutoSlide();
    });
  });

  const sliderContainer = document.querySelector('.hero-slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }
  startAutoSlide();

  // 3. 커스텀 마우스 커서
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorBlur = document.querySelector('.custom-cursor-blur');

  if (window.innerWidth > 768 && cursorDot && cursorBlur) {
    window.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      cursorDot.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
      cursorBlur.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
    });
    document.querySelectorAll('.hover-target').forEach(target => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 4. 햄버거 메뉴 및 ScrollSpy
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const tocLinks = document.querySelectorAll('.toc-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('open');
      navMenu.classList.toggle('active');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (hamburgerBtn) hamburgerBtn.classList.remove('open');
      if (navMenu) navMenu.classList.remove('active');
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.pageYOffset >= sectionTop) { current = section.getAttribute('id'); }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }, { passive: true });

  // 5. 일반 섹션 페이드인 Observer
  const scrollReveals = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.id === 'skills') {
          document.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-progress');
          });
        }
      }
    });
  }, { threshold: 0.15 });
  scrollReveals.forEach(el => revealObserver.observe(el));

  // 6. 뷰 모드 전환 (그리드/리스트)
  const viewBtns = document.querySelectorAll('.view-btn');
  const portfolioWrapper = document.getElementById('portfolio-wrapper');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const viewMode = btn.getAttribute('data-view');
      if (viewMode === 'list') {
        portfolioWrapper.classList.remove('grid-view');
        portfolioWrapper.classList.add('list-view');
      } else {
        portfolioWrapper.classList.remove('list-view');
        portfolioWrapper.classList.add('grid-view');
      }
    });
  });

  // 7. 세그먼트 필터 & 검색
  const segmentBtns = document.querySelectorAll('.segment-btn');
  const searchInput = document.getElementById('portfolio-search');
  let currentFilter = 'all';

  function filterPortfolio() {
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visibleIndex = 0;

    document.querySelectorAll('.portfolio-card').forEach(card => {
      const categories = card.getAttribute('data-category') || '';
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
      const matchesFilter = (currentFilter === 'all') || categories.includes(currentFilter);
      const matchesSearch = !searchText || title.includes(searchText) || desc.includes(searchText);

      if (matchesFilter && matchesSearch) {
        card.style.display = portfolioWrapper.classList.contains('list-view') ? 'flex' : 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1) translateY(0)';
        }, 50 + (visibleIndex * 80)); 
        visibleIndex++;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9) translateY(20px)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  }

  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segmentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      filterPortfolio();
    });
  });
  if (searchInput) searchInput.addEventListener('input', filterPortfolio);

  // 8. 가로 스크롤 마우스 휠 지원
  if (portfolioWrapper) {
    portfolioWrapper.addEventListener('wheel', (e) => {
      if (portfolioWrapper.classList.contains('grid-view') && e.deltaY !== 0) {
        e.preventDefault();
        portfolioWrapper.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  // 9. FAQ 토글
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => { q.parentElement.classList.toggle('active'); });
  });

  // 10. 비디오 라이트박스 제어
  const videoModal = document.getElementById('video-modal');
  const modalIframe = document.getElementById('modal-iframe');
  const modalClose = document.querySelector('#video-modal .modal-close');

  const closeModal = () => {
    if (videoModal) videoModal.classList.remove('active');
    if (modalIframe) modalIframe.src = '';
  };
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (videoModal) videoModal.addEventListener('click', (e) => { if (e.target === videoModal) closeModal(); });


  /* =========================================================
     ★ 인증 (회원가입/로그인/아이디·비번찾기/회원탈퇴) 및 DB 연동 영역
     ========================================================= */
  
  // ★ 여기에 앱스 스크립트 웹 앱 URL을 붙여넣으세요!
  const GOOGLE_APP_URL = 'https://script.google.com/macros/s/AKfycbwE8fnh5dbrxjCPtamj1rSVHqTFh3-oJfHfxTxOWyGSi2tpyR88ByF33zWCAE2z4R4/exec';

  // 비밀번호 해시화
  async function hashPassword(password) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

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
  
  const btnGoSignup = document.getElementById('go-to-signup');
  const btnGoFindId = document.getElementById('go-to-find-id');
  const btnGoFindPw = document.getElementById('go-to-find-pw');
  const btnsGoLogin = document.querySelectorAll('.go-to-login-btn');

  // UI 상태 갱신
  function updateAuthUI() {
    if (currentUser) {
      if (btnLoginModal) btnLoginModal.style.display = 'none';
      if (btnLogout) btnLogout.style.display = 'inline-block';
      if (btnWithdraw) btnWithdraw.style.display = 'inline-block';
      if (userGreeting) {
        userGreeting.style.display = 'inline-block';
        userGreeting.textContent = `${currentUser}님 환영합니다`;
      }
    } else {
      if (btnLoginModal) btnLoginModal.style.display = 'inline-block';
      if (btnLogout) btnLogout.style.display = 'none';
      if (btnWithdraw) btnWithdraw.style.display = 'none';
      if (userGreeting) userGreeting.style.display = 'none';
    }
  }
  updateAuthUI();

  // 모든 뷰 숨기기 유틸 함수
  function hideAllAuthViews() {
    if (loginViewArea) loginViewArea.style.display = 'none';
    if (signupViewArea) signupViewArea.style.display = 'none';
    if (findIdViewArea) findIdViewArea.style.display = 'none';
    if (findPwViewArea) findPwViewArea.style.display = 'none';
  }

  // 모달 열기/닫기 및 뷰 전환
  if(btnLoginModal) btnLoginModal.addEventListener('click', () => {
    hideAllAuthViews();
    if (loginViewArea) loginViewArea.style.display = 'block';
    if (authModal) authModal.classList.add('active');
  });
  
  const authCloseBtn = document.querySelector('.auth-modal-close');
  if (authCloseBtn) authCloseBtn.addEventListener('click', () => authModal.classList.remove('active'));
  if (authModal) authModal.addEventListener('click', (e) => { if(e.target === authModal) authModal.classList.remove('active'); });

  if(btnGoSignup) btnGoSignup.addEventListener('click', () => { hideAllAuthViews(); signupViewArea.style.display = 'block'; });
  if(btnGoFindId) btnGoFindId.addEventListener('click', () => { hideAllAuthViews(); findIdViewArea.style.display = 'block'; });
  if(btnGoFindPw) btnGoFindPw.addEventListener('click', () => { hideAllAuthViews(); findPwViewArea.style.display = 'block'; });
  
  btnsGoLogin.forEach(btn => {
    btn.addEventListener('click', () => { hideAllAuthViews(); loginViewArea.style.display = 'block'; });
  });

  // 로그아웃
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('jwb_user');
      currentUser = null;
      updateAuthUI();
      alert('성공적으로 로그아웃 되었습니다.');
    });
  }

  // 회원탈퇴
  if (btnWithdraw) {
    btnWithdraw.addEventListener('click', async () => {
      if (!currentUser) return;
      if (!confirm(`정말 ${currentUser} 계정을 탈퇴하시겠습니까?\n탈퇴 시 회원 정보가 영구적으로 삭제됩니다.`)) return;

      const formData = new URLSearchParams();
      formData.append('action', 'withdraw');
      formData.append('username', currentUser);

      try {
        const res = await fetch(GOOGLE_APP_URL, { method: 'POST', body: formData }).then(r => r.json());
        if (res.result === 'success') {
          alert('회원탈퇴가 정상적으로 처리되었습니다.');
          localStorage.removeItem('jwb_user');
          currentUser = null;
          updateAuthUI();
        } else {
          alert('회원탈퇴 처리에 실패했습니다.');
        }
      } catch (err) {
        console.error(err);
        alert('서버와 통신 중 오류가 발생했습니다.');
      }
    });
  }

  // 전체 약관 동의 체크 로직
  const termAll = document.getElementById('term-all');
  const termItems = document.querySelectorAll('.term-item');

  if (termAll) {
    termAll.addEventListener('change', (e) => { termItems.forEach(term => term.checked = e.target.checked); });
    termItems.forEach(term => {
      term.addEventListener('change', () => { termAll.checked = Array.from(termItems).every(t => t.checked); });
    });
  }

  // 회원가입 처리 로직
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('signup-id').value;
      const pw = document.getElementById('signup-pw').value;
      const name = document.getElementById('signup-name').value;
      
      const term1 = document.getElementById('term-1').checked;
      const term2 = document.getElementById('term-2').checked;
      const term3 = document.getElementById('term-3').checked;
      const term4 = document.getElementById('term-4').checked;

      if (!term1 || !term2 || !term3) return alert('필수 약관에 모두 동의하셔야 합니다.');

      const hashedPassword = await hashPassword(pw);
      const formData = new URLSearchParams();
      formData.append('action', 'signup');
      formData.append('userid', id);
      formData.append('password', hashedPassword);
      formData.append('username', name);
      formData.append('marketing', term4);

      try {
        await fetch(GOOGLE_APP_URL, { method: 'POST', body: formData });
        alert('회원가입 완료! 이제 로그인 해주세요.');
        signupForm.reset();
        hideAllAuthViews();
        loginViewArea.style.display = 'block';
      } catch (err) { alert('오류가 발생했습니다.'); }
    });
  }

  // 로그인 처리 로직
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('login-id').value;
      const pw = document.getElementById('login-pw').value;

      const hashedPassword = await hashPassword(pw);
      const formData = new URLSearchParams();
      formData.append('action', 'login');
      formData.append('userid', id);
      formData.append('password', hashedPassword);

      try {
        const res = await fetch(GOOGLE_APP_URL, { method: 'POST', body: formData }).then(r => r.json());
        if (res.result === 'success') {
          currentUser = res.username;
          localStorage.setItem('jwb_user', currentUser);
          authModal.classList.remove('active');
          loginForm.reset();
          updateAuthUI();
        } else {
          alert('아이디나 비밀번호가 일치하지 않습니다.');
        }
      } catch(e) { console.error(e); alert('오류가 발생했습니다.'); }
    });
  }

  // 아이디 찾기 처리 로직
  const findIdForm = document.getElementById('find-id-form');
  if (findIdForm) {
    findIdForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('find-id-name').value;
      const formData = new URLSearchParams();
      formData.append('action', 'findId');
      formData.append('username', name);

      try {
        const res = await fetch(GOOGLE_APP_URL, { method: 'POST', body: formData }).then(r => r.json());
        if (res.result === 'success') {
          alert(`회원님의 아이디는 [ ${res.userid} ] 입니다.`);
          hideAllAuthViews();
          loginViewArea.style.display = 'block';
        } else {
          alert('일치하는 회원 정보가 없습니다.');
        }
      } catch(err) { alert('서버와 통신 중 오류가 발생했습니다.'); }
    });
  }

  // 비밀번호 찾기 처리 로직
  const findPwForm = document.getElementById('find-pw-form');
  if (findPwForm) {
    findPwForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('find-pw-id').value;
      const name = document.getElementById('find-pw-name').value;
      const formData = new URLSearchParams();
      formData.append('action', 'findPw');
      formData.append('userid', id);
      formData.append('username', name);

      try {
        const res = await fetch(GOOGLE_APP_URL, { method: 'POST', body: formData }).then(r => r.json());
        if (res.result === 'success') {
          alert(`임시 비밀번호가 발급되었습니다: [ ${res.tempPw} ]\n\n로그인 후 반드시 비밀번호를 변경해 주세요.`);
          hideAllAuthViews();
          loginViewArea.style.display = 'block';
        } else {
          alert('입력하신 정보와 일치하는 계정이 없습니다.');
        }
      } catch(err) { alert('서버와 통신 중 오류가 발생했습니다.'); }
    });
  }

  // 공지사항 데이터 불러오기
  async function loadNotices() {
    const list = document.getElementById('notice-list');
    if(!list) return;
    try {
      const res = await fetch(`${GOOGLE_APP_URL}?type=notice`).then(r => r.json());
      list.innerHTML = '';
      if (res.length === 0) return list.innerHTML = '<li style="text-align:center;">등록된 공지사항이 없습니다.</li>';
      
      res.reverse().forEach(item => {
        if(!item['ID']) return;
        list.innerHTML += `
          <li class="jwb-post-item">
            <div class="jwb-post-header">
              <span class="jwb-post-title">${item['제목']}</span>
              <span class="jwb-post-meta">관리자 | ${item['날짜']}</span>
            </div>
            <div class="jwb-post-content">${item['내용']}</div>
          </li>
        `;
      });
    } catch (e) { list.innerHTML = '<li style="text-align:center;">서버와 연결할 수 없습니다.</li>'; }
  }

  // 포트폴리오 데이터 불러오기
  function getYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  const pfContainer = document.getElementById('portfolio-list-container');
  
  async function loadPortfolios() {
    if(!pfContainer) return;
    document.querySelectorAll('.dynamic-portfolio-card').forEach(el => el.remove());

    try {
      const res = await fetch(`${GOOGLE_APP_URL}?type=portfolio`).then(r => r.json());
      res.reverse().forEach(item => {
        if(!item['ID']) return;
        
        const videoId = getYoutubeId(item['링크'] || '');
        let thumbUrl = 'img/default_thumb.jpg';
        if (item['썸네일'] && item['썸네일'].trim() !== '') {
          thumbUrl = item['썸네일'];
        } else if (videoId) {
          thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }

        const cardHTML = `
          <div class="portfolio-card dynamic-portfolio-card trigger-item hover-target zoom-card" 
               data-category="${item['카테고리']}" data-video-id="${videoId}"
               style="opacity: 0; transform: scale(0.9) translateY(30px);">
            <div class="card-thumb-box img-zoom-wrapper" onclick="openPortfolioModal('${videoId}', '${item['제목']}', '${item['툴']}', '${item['설명'].replace(/\n/g, '\\n')}')">
              <img src="${thumbUrl}" alt="포트폴리오 썸네일">
              <div class="play-overlay"><span>VIEW DETAIL</span></div>
            </div>
            <div class="card-info">
              <span class="card-tag">NEW</span>
              <h3 class="card-title">${item['제목']}</h3>
              <p class="card-desc">${item['설명'].substring(0, 40)}...</p>
              <div class="card-meta">
                <span class="meta-item"><i class="fa-solid fa-wrench"></i> ${item['툴']}</span>
              </div>
            </div>
          </div>
        `;
        pfContainer.insertAdjacentHTML('beforeend', cardHTML);
      });
      if(typeof filterPortfolio === 'function') filterPortfolio(); 
    } catch(e) { console.error('포트폴리오 로드 실패'); }
  }

  window.openPortfolioModal = function(videoId, title, tools, desc) {
    const videoModal = document.getElementById('video-modal');
    const modalIframe = document.getElementById('modal-iframe');
    
    if(videoId) {
      modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      modalIframe.style.display = 'block';
    } else {
      modalIframe.src = '';
      modalIframe.style.display = 'none';
    }
    
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-desc').textContent = desc;
    
    const toolsContainer = document.getElementById('modal-tools');
    toolsContainer.innerHTML = '';
    tools.split(',').forEach(tool => {
      if(tool.trim()) toolsContainer.innerHTML += `<span class="tool-badge">${tool.trim()}</span>`;
    });
    
    videoModal.classList.add('active');
  };

  loadNotices();
  loadPortfolios();

});
