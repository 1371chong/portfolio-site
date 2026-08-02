document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. 인트로 글씨 타이핑 효과 엔진 (Typing Effect)
    // ==========================================================================
    const typingTarget = document.querySelector('.typing-text');
    if (typingTarget) {
        const textArray = ["이야기를 담아내는 정원복입니다.", "가치를 편집하는 정원복입니다.", "트렌드를 연출하는 정원복입니다."];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 120;

        function typeEffect() {
            const currentFullText = textArray[textIndex];
            
            if (isDeleting) {
                typingTarget.innerHTML = currentFullText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingTarget.innerHTML = currentFullText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 120;
            }

            if (!isDeleting && charIndex === currentFullText.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % textArray.length;
                typingSpeed = 500;
            }

            setTimeout(typeEffect, typingSpeed);
        }
        setTimeout(typeEffect, 600);
    }

    // ==========================================================================
    // 2. 풀스크린 햄버거 메뉴 토글 기능 (접근성 보완)
    // ==========================================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('open');
            navList.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuToggle.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // ==========================================================================
    // 3. 포트폴리오 필터링 및 라이브 검색 기능
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.portfolio-filter button');
    const searchInput = document.getElementById('portfolio-search');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const noResultsMessage = document.getElementById('no-results');

    if (portfolioItems.length > 0) {
        let currentFilter = 'all';

        const updatePortfolio = () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            let visibleCount = 0;

            portfolioItems.forEach(item => {
                const category = item.dataset.category;
                const keywords = item.dataset.keywords ? item.dataset.keywords.toLowerCase() : '';
                const h3Element = item.querySelector('h3');
                const title = h3Element ? h3Element.textContent.toLowerCase() : '';

                const isCategoryMatch = (currentFilter === 'all' || category === currentFilter);
                const isSearchMatch = (searchTerm === '' || title.includes(searchTerm) || keywords.includes(searchTerm));

                if (isCategoryMatch && isSearchMatch) {
                    item.style.display = 'block';
                    // 애니메이션 관측용 show 클래스 재반응 보정
                    setTimeout(() => item.classList.add('show'), 50);
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                    item.classList.remove('show');
                }
            });

            if (noResultsMessage) {
                noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        };

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentFilter = button.dataset.filter;
                updatePortfolio();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', updatePortfolio);
        }

        updatePortfolio();
    }

    // ==========================================================================
    // 4. 스크롤 반응형 애니메이션 통합 모듈 (포트폴리오 & 리디자인 스킬 게이지)
    // ==========================================================================
    const observerOptions = {
        threshold: 0.1
    };

    const generalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 포트폴리오 카드 페이드인 처리
                if (entry.target.classList.contains('portfolio-item')) {
                    entry.target.classList.add('show');
                    generalObserver.unobserve(entry.target);
                }
                // 리디자인 스킬카드 도달 시 네온 게이지 바 실시간 빌딩 연출
                if (entry.target.classList.contains('skill-card-v')) {
                    const progressBar = entry.target.querySelector('.skill-progress-bar');
                    const progressValue = entry.target.dataset.progress;
                    if (progressBar && progressValue) {
                        progressBar.style.width = progressValue;
                    }
                    generalObserver.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // 포트폴리오 아이템 관찰자 등록
    portfolioItems.forEach(item => {
        generalObserver.observe(item);
    });

    // 신규 리디자인 스킬 카드 요소들 동적 관찰자 등록
    const skillCards = document.querySelectorAll('.skill-card-v');
    skillCards.forEach(card => {
        generalObserver.observe(card);
    });
});