document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 포트폴리오 카테고리 필터
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 버튼 활성화 상태 변경
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            // 포트폴리오 아이템 필터링
            portfolioCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    // 2. 게시판 탭 전환 (공지사항 / 자유게시판)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const boardBoxes = document.querySelectorAll('.board-box');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target') + '-board';

            boardBoxes.forEach(box => {
                if (box.id === targetId) {
                    box.classList.remove('hidden');
                } else {
                    box.classList.add('hidden');
                }
            });
        });
    });

    // 3. FAQ 아코디언
    const accTitles = document.querySelectorAll('.acc-title');

    accTitles.forEach(title => {
        title.addEventListener('click', function() {
            const content = this.nextElementSibling;
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                // 다른 열려있는 아코디언 닫기 (선택 사항)
                document.querySelectorAll('.acc-content').forEach(c => c.style.maxHeight = null);
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // 4. 스무스 스크롤 (네비게이션 이동)
    document.querySelectorAll('.nav-menu a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // 헤더 높이만큼 빼줌
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. 문의 폼 제출 이벤트
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('문의가 성공적으로 접수되었습니다. (현재 프론트엔드 UI 상태입니다.)');
            contactForm.reset();
        });
    }
});