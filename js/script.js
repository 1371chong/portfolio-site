document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  const projectModal = document.getElementById('project-modal');
  const closeProject = () => {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    const video = document.getElementById('project-video-wrap');
    if (video) video.innerHTML = '';
    const url = new URL(window.location.href);
    if (url.searchParams.has('work')) { url.searchParams.delete('work'); window.history.replaceState({}, '', url); }
    document.title = 'JWB STUDIO | Motion & Interactive';
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'JWB STUDIO | Motion & Interactive');
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', '모션그래픽, 3D 비주얼, 영상 제작과 인터랙티브 웹 포트폴리오');
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', 'https://www.wonbok.kr/img/logo/logo.png');
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', 'https://www.wonbok.kr/');
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', 'JWB STUDIO | Motion & Interactive');
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', '모션그래픽, 3D 비주얼, 영상 제작과 인터랙티브 웹 포트폴리오');
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', 'https://www.wonbok.kr/img/logo/logo.png');
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', 'https://www.wonbok.kr/');
  };
  document.getElementById('project-modal-close')?.addEventListener('click', closeProject);
  window.addEventListener('click', e => {
    if (e.target === projectModal) closeProject();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProject();
  });
});
document.addEventListener('DOMContentLoaded', () => {
    // 1. 스크롤 진행 바 생성 및 동작
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });

    // 2. 커스텀 마우스 커서 동작
    if (window.innerWidth >= 1024) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        window.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        // 링크나 버튼 호버 시 커서 확대 효과
        document.querySelectorAll('a, button, .work-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    // 3. 숫자 카운팅 애니메이션 (대상 요소에 클래스 및 data-target 속성 활용 시)
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const runCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const updateCount = () => {
            const inc = target / speed;
            if (count < target) {
                count += inc;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    // IntersectionObserver로 화면에 보일 때 카운팅 시작
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
});
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const currentItem = button.parentElement;
            const isActive = currentItem.classList.contains('active');

            // 다른 열려있는 FAQ들을 모두 닫고 싶다면 아래 주석을 해제하세요
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            });

            // 클릭한 항목이 열려있지 않았다면 열기
            if (!isActive) {
                currentItem.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // 데스크톱 환경에서만 마그네틱 효과 적용
    if (window.innerWidth >= 1024) {
        const magneticButtons = document.querySelectorAll('.btn-solid, .btn-outline, .inquiry-btn');

        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // 마우스 방향으로 살짝 끌려오는 거리 조절 (계수가 클수록 적게 움직임)
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                // 마우스가 벗어나면 제자리로 부드럽게 복귀
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    let itemsPerPage = 6; // 한 번에 보여줄 프로젝트 개수
    let visibleCount = itemsPerPage;

    // Supabase에서 포트폴리오를 받은 뒤 렌더 완료 이벤트로 초기화
    window.addEventListener('portfolio:ready', initLoadMore);

    function initLoadMore() {
        const workCards = document.querySelectorAll('.work-card');
        const loadMoreWrap = document.getElementById('load-more-wrap');
        const btnLoadMore = document.getElementById('btn-load-more');

        if (workCards.length <= itemsPerPage) {
            if (loadMoreWrap) loadMoreWrap.style.display = 'none';
            return;
        }

        // 초기 상태: 지정된 개수만 보여주고 나머지는 숨김
        workCards.forEach((card, index) => {
            if (index >= itemsPerPage) {
                card.classList.add('hidden');
            } else {
                card.classList.remove('hidden');
            }
        });

        if (loadMoreWrap) loadMoreWrap.style.display = 'block';

        // 더보기 버튼 클릭 이벤트
        if (btnLoadMore) {
            btnLoadMore.onclick = () => {
                visibleCount += itemsPerPage;
                let shown = 0;

                workCards.forEach((card, index) => {
                    // 검색어나 필터에 의해 숨겨진 카드가 아닐 경우에만 순차적으로 해제
                    if (index < visibleCount) {
                        card.classList.remove('hidden');
                    }
                });

                // 모든 카드를 다 보여줬다면 더보기 버튼 숨기기
                if (visibleCount >= workCards.length) {
                    loadMoreWrap.style.display = 'none';
                }
            };
        }
    }
});
