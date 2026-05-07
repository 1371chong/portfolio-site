document.addEventListener('DOMContentLoaded', () => {


    // 1. 햄버거 메뉴 토글 기능
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const hamburgerIcon = document.querySelector('.hamburger-icon');

    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        hamburgerIcon.classList.toggle('open');
    });

    // 메뉴 링크 클릭 시 모바일 메뉴 닫기
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                hamburgerIcon.classList.remove('open');
            }
        });
    });

    // 2. 포트폴리오 필터링 및 검색 기능
    const filterButtons = document.querySelectorAll('.portfolio-filter button');
    const searchInput = document.getElementById('portfolio-search');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const noResultsMessage = document.getElementById('no-results');

    let currentFilter = 'all';

    const updatePortfolio = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        portfolioItems.forEach(item => {
            const category = item.dataset.category;
            const keywords = item.dataset.keywords.toLowerCase();
            const title = item.querySelector('h3').textContent.toLowerCase();

            const isCategoryMatch = (currentFilter === 'all' || category === currentFilter);
            const isSearchMatch = (searchTerm === '' || title.includes(searchTerm) || keywords.includes(searchTerm));

            if (isCategoryMatch && isSearchMatch) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            updatePortfolio();
        });
    });

    searchInput.addEventListener('input', updatePortfolio);

    updatePortfolio();
// 3. 반응형 스크롤 애니메이션 추가
    const observerOptions = {
        threshold: 0.1 // 아이템이 10% 정도 보일 때 애니메이션 시작
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show'); // 화면에 들어오면 show 클래스 추가
                observer.unobserve(entry.target); // 한 번 나타난 후에는 관찰 중지
            }
        });
    }, observerOptions);

    // 관찰 대상 지정
    portfolioItems.forEach(item => {
        item.classList.add('fade-in'); // 초기 상태 설정을 위한 클래스
        observer.observe(item);
    });

    // 4. Editing Skills & Programs 반응형 스크롤 애니메이션 추가
    const skillsSection = document.getElementById('editing-skills'); // "Editing Skills & Programs" 섹션 ID를 가정
    const skillBars = document.querySelectorAll('.skill-bar'); // 스킬 바 요소들을 가정

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    bar.style.width = bar.dataset.progress; // dataset에 저장된 비율만큼 바 채우기 애니메이션
                });
                skillsObserver.unobserve(entry.target); // 한 번 애니메이션 후 관찰 중지
            }
        });
    }, observerOptions);

    if (skillsSection) {
        skillsObserver.observe(skillsSection); // 섹션 전체를 관찰
    }

    // 필터링 후 애니메이션 재적용을 위해 updatePortfolio 함수 수정 제안
    // (기존 updatePortfolio 함수 마지막에 아래 한 줄을 추가하면 좋습니다)
    // portfolioItems.forEach(item => item.classList.remove('show')); 
    // setTimeout(() => updatePortfolio(), 100); // 필터링 시 다시 스르륵 나타나게 하고 싶을 때
});