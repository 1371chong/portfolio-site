document.addEventListener('DOMContentLoaded', () => {

  // 0. 다크 / 라이트 테마 전환 토글 (Theme Switcher)
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

  // 2. 히어로 자동 캐러셀 슬라이더 로직
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

  function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoSlide();
    });
  }

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

  // 3. 커스텀 마우스 커서 & 호버 인터랙션 (Cursor Interaction)
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorBlur = document.querySelector('.custom-cursor-blur');

  if (window.innerWidth > 768 && cursorDot && cursorBlur) {
    window.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      cursorDot.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
      cursorBlur.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
    });

    document.querySelectorAll('.hover-target').forEach(target => {
      target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // 4. 모바일 햄버거 메뉴
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

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

  // 5. ScrollSpy (헤더 & TOC 하이라이팅)
  const sections = document.querySelectorAll('section');
  const tocLinks = document.querySelectorAll('.toc-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // 6. 일반 섹션 페이드인 Observer
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

  // 7. 포트폴리오 스태거 모션
  const triggerItems = document.querySelectorAll('.trigger-item');
  const portfolioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerItems.forEach((item, index) => {
          setTimeout(() => { item.classList.add('triggered'); }, index * 150);
        });
      }
    });
  }, { threshold: 0.2 });

  const portfolioSection = document.querySelector('.scroll-trigger-portfolio');
  if (portfolioSection) portfolioObserver.observe(portfolioSection);

  // 8. 카드 그리드 / 리스트 뷰 스위치
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

  // 9. 세그먼트 필터 & 검색
  const segmentBtns = document.querySelectorAll('.segment-btn');
  const searchInput = document.getElementById('portfolio-search');
  let currentFilter = 'all';

  function filterPortfolio() {
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';

    triggerItems.forEach(card => {
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
        }, 10);
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

  if (searchInput) {
    searchInput.addEventListener('input', filterPortfolio);
  }

  // 10. 가로 스크롤 마우스 휠 지원
  if (portfolioWrapper) {
    portfolioWrapper.addEventListener('wheel', (e) => {
      if (portfolioWrapper.classList.contains('grid-view') && e.deltaY !== 0) {
        e.preventDefault();
        portfolioWrapper.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  // 11. FAQ 아코디언 토글
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      q.parentElement.classList.toggle('active');
    });
  });

  // 12. 인터랙티브 이력서 다운로드 / 미리보기 모달
  const btnPreviewResume = document.getElementById('btn-preview-resume');
  const resumeModal = document.getElementById('resume-modal');
  const resumeModalClose = document.querySelector('.resume-modal-close');
  const btnCopyResumeLink = document.getElementById('btn-copy-resume-link');

  if (btnPreviewResume && resumeModal) {
    btnPreviewResume.addEventListener('click', () => {
      resumeModal.classList.add('active');
    });
  }

  if (resumeModalClose) {
    resumeModalClose.addEventListener('click', () => {
      resumeModal.classList.remove('active');
    });
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) resumeModal.classList.remove('active');
    });
  }

  if (btnCopyResumeLink) {
    btnCopyResumeLink.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.origin + '#resume');
      alert('이력서 주소가 클립보드에 복사되었습니다.');
    });
  }

  // 13. 비디오 라이트박스 및 상세 모달
  const videoModal = document.getElementById('video-modal');
  const modalIframe = document.getElementById('modal-iframe');
  const modalClose = document.querySelector('#video-modal .modal-close');
  
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalDuration = document.getElementById('modal-duration');
  const modalTools = document.getElementById('modal-tools');
  const modalDesc = document.getElementById('modal-desc');

  triggerItems.forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.getAttribute('data-video-id');
      const duration = card.getAttribute('data-duration') || '미정';
      const tools = card.getAttribute('data-tools') || '';
      const tag = card.querySelector('.card-tag')?.textContent || '';
      const title = card.querySelector('.card-title')?.textContent || '';
      const desc = card.querySelector('.card-desc')?.textContent || '';

      if (videoId) {
        modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        
        if (modalTag) modalTag.textContent = tag;
        if (modalTitle) modalTitle.textContent = title;
        if (modalDuration) modalDuration.textContent = duration;
        if (modalDesc) modalDesc.textContent = desc;

        if (modalTools) {
          modalTools.innerHTML = '';
          const toolList = tools.split(',').map(t => t.trim());
          toolList.forEach(tool => {
            if (tool) {
              const badge = document.createElement('span');
              badge.className = 'tool-badge';
              badge.textContent = tool;
              modalTools.appendChild(badge);
            }
          });
        }

        videoModal.classList.add('active');
      }
    });
  });

  const closeModal = () => {
    if (videoModal) videoModal.classList.remove('active');
    if (modalIframe) modalIframe.src = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeModal();
    });
  }

});
