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
});