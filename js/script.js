document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 0. 전역 유틸리티 함수 정의
    // ==========================================================================
    window.convertYoutubeToEmbed = function(url) {
        if (!url) return '';
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else if (url.includes('embed/')) {
            return url;
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    // ==========================================================================
    // 1. 인트로 글씨 타이핑 효과
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
    // 2. 풀스크린 햄버거 메뉴 토글 기능
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
    // 3. 포트폴리오 필터링 및 검색
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.portfolio-filter button');
    const searchInput = document.getElementById('portfolio-search');
    const noResultsMessage = document.getElementById('no-results');

    let currentFilter = 'all';

    function updatePortfolio() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
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
    }

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

    // ==========================================================================
    // 4. 스크롤 반응형 애니메이션
    // ==========================================================================
    const observerOptions = { threshold: 0.1 };

    const generalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('portfolio-item')) {
                    entry.target.classList.add('show');
                    generalObserver.unobserve(entry.target);
                }
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

    document.querySelectorAll('.skill-card-v').forEach(card => {
        generalObserver.observe(card);
    });

    // ==========================================================================
    // 5. FAQ 아코디언 토글
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        }
    });

    // ==========================================================================
    // 6. 프로젝트 상세보기 모달
    // ==========================================================================
    const modalOverlay = document.getElementById('project-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalIframe = document.getElementById('modal-video');
    const modalImg = document.getElementById('modal-img');
    
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalDesc = document.getElementById('modal-description');
    const modalDate = document.getElementById('modal-date');
    const modalTools = document.getElementById('modal-tools');
    const modalContribution = document.getElementById('modal-contribution');
    const modalLink = document.getElementById('modal-link');

    document.addEventListener('click', (e) => {
        if (e.target.closest('.pf-admin-controls')) return;

        const triggerBtn = e.target.closest('.open-modal') || e.target.closest('.portfolio-thumb');
        if (triggerBtn) {
            const item = triggerBtn.closest('.portfolio-item');
            if (!item) return;

            const data = item.dataset;
            if (modalTitle) modalTitle.textContent = data.title || (item.querySelector('h3') ? item.querySelector('h3').textContent : '');
            if (modalCategory) modalCategory.textContent = data.tag || '#포트폴리오';
            if (modalDesc) modalDesc.textContent = data.desc || '작품 상세 설명이 없습니다.';
            if (modalDate) modalDate.textContent = data.date || '-';
            if (modalTools) modalTools.textContent = data.tools || '-';
            if (modalContribution) modalContribution.textContent = data.contribution || '-';
            if (modalLink) modalLink.href = data.link || '#';

            if (data.video && modalIframe) {
                modalIframe.src = data.video.includes('autoplay') ? data.video : `${data.video}?autoplay=1`;
                modalIframe.style.display = 'block';
                if (modalImg) modalImg.style.display = 'none';
            } else if (data.img && modalImg) {
                modalImg.src = data.img;
                modalImg.style.display = 'block';
                if (modalIframe) {
                    modalIframe.style.display = 'none';
                    modalIframe.src = '';
                }
            } else {
                if (modalIframe) {
                    modalIframe.style.display = 'none';
                    modalIframe.src = '';
                }
                if (modalImg) modalImg.style.display = 'none';
            }

            if (modalOverlay) {
                modalOverlay.classList.add('active');
                modalOverlay.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        }
    });

    const closeModal = () => {
        if (!modalOverlay || !modalOverlay.classList.contains('active')) return;
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        setTimeout(() => { if (modalIframe) modalIframe.src = ''; }, 300);
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // ==========================================================================
    // 6-B. 공지사항 상세보기 모달
    // ==========================================================================
    const noticeModalOverlay = document.getElementById('notice-detail-modal');
    const noticeModalCloseBtn = document.querySelector('.notice-modal-close');
    const noticeModalBadge = document.getElementById('notice-modal-badge');
    const noticeModalAuthor = document.getElementById('notice-modal-author');
    const noticeModalDate = document.getElementById('notice-modal-date');
    const noticeModalTitle = document.getElementById('notice-modal-title');
    const noticeModalDesc = document.getElementById('notice-modal-desc');

    function openNoticeModal(noticeObj) {
        if (!noticeModalOverlay) return;

        let badgeClass = 'badge-primary';
        if (noticeObj.type === 'secondary') badgeClass = 'badge-secondary';
        else if (noticeObj.type === 'info') badgeClass = 'badge-info';
        else if (noticeObj.type === 'update') badgeClass = 'badge-update';

        if (noticeModalBadge) {
            noticeModalBadge.className = `notice-badge ${badgeClass}`;
            noticeModalBadge.textContent = noticeObj.typeName || '공지';
        }
        if (noticeModalAuthor) noticeModalAuthor.innerHTML = `<i class="fas fa-user-circle"></i> ${noticeObj.author || '정원복'}`;
        if (noticeModalDate) noticeModalDate.textContent = noticeObj.date || '';
        if (noticeModalTitle) noticeModalTitle.textContent = noticeObj.title || '';
        if (noticeModalDesc) noticeModalDesc.textContent = noticeObj.desc || '';

        noticeModalOverlay.classList.add('active');
        noticeModalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeNoticeModal() {
        if (!noticeModalOverlay || !noticeModalOverlay.classList.contains('active')) return;
        noticeModalOverlay.classList.remove('active');
        noticeModalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    if (noticeModalCloseBtn) noticeModalCloseBtn.addEventListener('click', closeNoticeModal);
    if (noticeModalOverlay) {
        noticeModalOverlay.addEventListener('click', (e) => {
            if (e.target === noticeModalOverlay) closeNoticeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeNoticeModal();
            closeAdminModal();
        }
    });

    // ==========================================================================
    // 7. 네비게이션 스크롤 스파이
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a');

    const scrollSpyOptions = { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 };
    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');
                    if (href === activeId) link.classList.add('active');
                    else link.classList.remove('active');
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => scrollSpyObserver.observe(section));

    // ==========================================================================
    // 8. 커스텀 마우스 포인터
    // ==========================================================================
    const cursorArrow = document.querySelector('.custom-cursor-arrow');
    if (cursorArrow && window.innerWidth > 991) {
        let mouseX = 0, mouseY = 0, arrowX = 0, arrowY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateArrow() {
            arrowX += (mouseX - arrowX) * 0.25;
            arrowY += (mouseY - arrowY) * 0.25;
            cursorArrow.style.left = `${arrowX}px`;
            cursorArrow.style.top = `${arrowY}px`;
            requestAnimationFrame(animateArrow);
        }
        animateArrow();

        const attachHoverEvent = () => {
            const hoverTargets = document.querySelectorAll('a, button, input, textarea, select, .portfolio-thumb, .faq-question, .partner-card, .notice-card');
            hoverTargets.forEach(target => {
                target.removeEventListener('mouseenter', hoverEnterHandler);
                target.removeEventListener('mouseleave', hoverLeaveHandler);
                target.addEventListener('mouseenter', hoverEnterHandler);
                target.addEventListener('mouseleave', hoverLeaveHandler);
            });
        };

        function hoverEnterHandler() { document.body.classList.add('hovered'); }
        function hoverLeaveHandler() { document.body.classList.remove('hovered'); }

        attachHoverEvent();
        window.attachHoverEvent = attachHoverEvent;
    }

    // ==========================================================================
    // 9. Supabase DB 설정 및 전역 데이터 정의
    // ==========================================================================
    const SUPABASE_URL = "https://zwjggedeichljaesgiqk.supabase.co"; 
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3amdnZWRlaWNobGphZXNnaXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NjU2NTIsImV4cCI6MjEwMTM0MTY1Mn0.DQ5mcKQf5tmWI2B7ESM3OMoebwLBgNwfpIxCUXNuc1A"; 
    const ADMIN_PASSWORD = "051700";

    let _supabase = null;
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }

    const adminLoginTriggerBtn = document.getElementById('admin-login-trigger-btn');
    const adminModeDropdownWrapper = document.getElementById('admin-mode-dropdown-wrapper');
    const adminModeBtn = document.getElementById('admin-mode-btn');
    const adminMenuDropdown = document.getElementById('admin-menu-dropdown');
    
    const adminMenuAddPf = document.getElementById('admin-menu-add-pf');
    const adminMenuAddNotice = document.getElementById('admin-menu-add-notice');
    const adminMenuAddHistory = document.getElementById('admin-menu-add-history');

    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const adminAuthModal = document.getElementById('admin-auth-modal');
    const adminModalCloseBtn = document.querySelector('.admin-modal-close');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminPwInput = document.getElementById('admin-pw-input');
    const adminAuthError = document.getElementById('admin-auth-error');

    const noticeForm = document.getElementById('notice-form');
    const noticeListContainer = document.getElementById('notice-list');
    const noticeTabBtns = document.querySelectorAll('.notice-tab-btn');

    const historyForm = document.getElementById('history-form');
    const historyEduList = document.getElementById('history-edu-list');
    const historyExpList = document.getElementById('history-exp-list');

    let currentNoticeTab = 'all';
    let storedNotices = [];
    let storedPortfolios = [];
    let storedHistories = [];

    function openAdminModal() {
        if (!adminAuthModal) return;
        if (adminPwInput) adminPwInput.value = '';
        if (adminAuthError) adminAuthError.style.display = 'none';
        adminAuthModal.classList.add('active');
        adminAuthModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (adminPwInput) setTimeout(() => adminPwInput.focus(), 100);
    }

    function closeAdminModal() {
        if (!adminAuthModal || !adminAuthModal.classList.contains('active')) return;
        adminAuthModal.classList.remove('active');
        adminAuthModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    if (adminModalCloseBtn) adminModalCloseBtn.addEventListener('click', closeAdminModal);
    if (adminAuthModal) {
        adminAuthModal.addEventListener('click', (e) => {
            if (e.target === adminAuthModal) closeAdminModal();
        });
    }

    // 관리자 상태 동적 갱신
    function checkAdminStatus() {
        const isAdmin = sessionStorage.getItem('portfolio_admin_logged_in') === 'true';
        const portfolioForm = document.getElementById('portfolio-form');

        if (isAdmin) {
            document.body.classList.add('admin-mode');
            if (adminLoginTriggerBtn) adminLoginTriggerBtn.style.display = 'none';
            if (adminModeDropdownWrapper) adminModeDropdownWrapper.style.display = 'inline-block';
            if (adminLogoutBtn) adminLogoutBtn.style.display = 'inline-flex';
        } else {
            document.body.classList.remove('admin-mode');
            if (adminLoginTriggerBtn) adminLoginTriggerBtn.style.display = 'inline-flex';
            if (adminModeDropdownWrapper) adminModeDropdownWrapper.style.display = 'none';
            if (adminLogoutBtn) adminLogoutBtn.style.display = 'none';
        }

        if (portfolioForm) portfolioForm.style.setProperty('display', 'none', 'important');
        if (noticeForm) noticeForm.style.setProperty('display', 'none', 'important');
        if (historyForm) historyForm.style.setProperty('display', 'none', 'important');

        fetchPortfoliosFromDB();
        fetchNoticesFromDB();
        fetchHistoriesFromDB();
    }

    // 관리자 모드 드롭다운 메뉴 제어
    if (adminModeBtn && adminMenuDropdown) {
        adminModeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = adminMenuDropdown.style.display === 'none';
            adminMenuDropdown.style.display = isHidden ? 'block' : 'none';
        });

        document.addEventListener('click', (e) => {
            if (!adminModeDropdownWrapper.contains(e.target)) {
                adminMenuDropdown.style.display = 'none';
            }
        });
    }

    // 1. 관리자 모드 메뉴 -> 포트폴리오 추가
    if (adminMenuAddPf) {
        adminMenuAddPf.addEventListener('click', () => {
            adminMenuDropdown.style.display = 'none';
            const pfForm = document.getElementById('portfolio-form');
            if (pfForm) {
                const isHidden = window.getComputedStyle(pfForm).display === 'none';
                pfForm.style.setProperty('display', isHidden ? 'block' : 'none', 'important');
                const pfSection = document.getElementById('portfolio');
                if (pfSection) pfSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 2. 관리자 모드 메뉴 -> 공지사항 추가
    if (adminMenuAddNotice) {
        adminMenuAddNotice.addEventListener('click', () => {
            adminMenuDropdown.style.display = 'none';
            if (noticeForm) {
                const isHidden = window.getComputedStyle(noticeForm).display === 'none';
                noticeForm.style.setProperty('display', isHidden ? 'block' : 'none', 'important');
                const noticeSection = document.getElementById('notice');
                if (noticeSection) noticeSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 3. 관리자 모드 메뉴 -> 연혁 추가
    if (adminMenuAddHistory) {
        adminMenuAddHistory.addEventListener('click', () => {
            adminMenuDropdown.style.display = 'none';
            if (historyForm) {
                const isHidden = window.getComputedStyle(historyForm).display === 'none';
                historyForm.style.setProperty('display', isHidden ? 'block' : 'none', 'important');
                const aboutSection = document.getElementById('about');
                if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (adminLoginTriggerBtn) adminLoginTriggerBtn.addEventListener('click', openAdminModal);

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('portfolio_admin_logged_in');
            alert('관리자 모드에서 로그아웃 되었습니다.');
            checkAdminStatus();
        });
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputPw = adminPwInput ? adminPwInput.value.trim() : '';
            if (inputPw === ADMIN_PASSWORD) {
                sessionStorage.setItem('portfolio_admin_logged_in', 'true');
                closeAdminModal();
                checkAdminStatus();
                alert('관리자로 로그인되었습니다.');
            } else {
                if (adminAuthError) {
                    adminAuthError.textContent = '비밀번호가 올바르지 않습니다.';
                    adminAuthError.style.display = 'block';
                }
                if (adminPwInput) adminPwInput.select();
            }
        });
    }

    // ==========================================================================
    // 10. 포트폴리오 DB 연동 CRUD
    // ==========================================================================
    const portfolioForm = document.getElementById('portfolio-form');
    const portfolioGrid = document.querySelector('.portfolio-grid');

    async function fetchPortfoliosFromDB() {
        if (!portfolioGrid || !_supabase) return;
        const { data, error } = await _supabase.from('portfolios').select('*').order('id', { ascending: false });
        if (error) { console.error('Portfolios Fetch Error:', error); return; }

        storedPortfolios = data || [];
        renderPortfolios();
    }

    function renderPortfolios() {
        if (!portfolioGrid) return;
        portfolioGrid.innerHTML = '';

        const isAdmin = sessionStorage.getItem('portfolio_admin_logged_in') === 'true';

        storedPortfolios.forEach(item => {
            const article = document.createElement('article');
            article.className = 'portfolio-item show';
            article.dataset.id = item.id;
            article.dataset.category = item.category || 'video';
            article.dataset.keywords = item.keywords || '';
            article.dataset.title = item.title || '';
            article.dataset.tag = item.tag || '#포트폴리오';
            article.dataset.desc = item.desc || '';
            article.dataset.date = item.date || '-';
            article.dataset.tools = item.tools || '-';
            article.dataset.contribution = item.contribution || '-';
            if (item.video) article.dataset.video = item.video;
            if (item.img) article.dataset.img = item.img;
            if (item.link) article.dataset.link = item.link;

            const thumbSrc = item.thumb || item.img || 'img/icon/icon_default.jpg';
            const adminControlsHtml = isAdmin ? `
                <div class="pf-admin-controls" style="position: absolute; top: 10px; right: 10px; z-index: 20; display: flex; gap: 5px;">
                    <button type="button" class="pf-edit-btn" data-id="${item.id}" style="background: rgba(52,152,219,0.9); color:#fff; border:none; padding:4px 10px; border-radius:12px; font-size:0.75rem; cursor:pointer;"><i class="fas fa-edit"></i> 수정</button>
                    <button type="button" class="pf-del-btn" data-id="${item.id}" style="background: rgba(231,76,60,0.9); color:#fff; border:none; padding:4px 10px; border-radius:12px; font-size:0.75rem; cursor:pointer;"><i class="fas fa-trash-alt"></i> 삭제</button>
                </div>
            ` : '';

            article.style.position = 'relative';
            article.innerHTML = `
                ${adminControlsHtml}
                <div class="portfolio-thumb">
                    <img src="${thumbSrc}" alt="${item.title} 썸네일">
                    <div class="item-overlay">
                        <span class="zoom-icon"><i class="fas fa-search-plus"></i></span>
                    </div>
                </div>
                <div class="portfolio-info">
                    <h3>${item.title}</h3>
                    <div class="info-footer">
                        <span class="tag">${item.tag}</span>
                        <button type="button" class="portfolio-btn open-modal">상세보기 <i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
            `;
            portfolioGrid.appendChild(article);
            generalObserver.observe(article);
        });

        if (isAdmin) {
            document.querySelectorAll('.pf-del-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const targetId = parseInt(e.currentTarget.dataset.id);
                    if (confirm('이 포트폴리오를 DB에서 삭제하시겠습니까?')) {
                        const { error } = await _supabase.from('portfolios').delete().eq('id', targetId);
                        if (!error) { alert('포트폴리오가 삭제되었습니다.'); fetchPortfoliosFromDB(); }
                    }
                });
            });

            document.querySelectorAll('.pf-edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const targetId = parseInt(e.currentTarget.dataset.id);
                    const pfObj = storedPortfolios.find(item => item.id === targetId);
                    if (!pfObj) return;

                    const articleElement = document.querySelector(`.portfolio-item[data-id="${targetId}"]`);
                    const infoBox = articleElement ? articleElement.querySelector('.portfolio-info') : null;
                    if (!infoBox) return;

                    infoBox.innerHTML = `
                        <div class="pf-edit-form" style="display:flex; flex-direction:column; gap:8px;">
                            <input type="text" class="edit-pf-title" value="${pfObj.title}" placeholder="작품 제목" style="background:#1e2026; color:#fff; border:1px solid #2d3748; padding:6px 10px; border-radius:6px; font-size:0.85rem;">
                            <input type="text" class="edit-pf-tag" value="${pfObj.tag}" placeholder="태그" style="background:#1e2026; color:#fff; border:1px solid #2d3748; padding:6px 10px; border-radius:6px; font-size:0.85rem;">
                            <textarea class="edit-pf-desc" placeholder="상세설명" style="background:#1e2026; color:#fff; border:1px solid #2d3748; padding:6px 10px; border-radius:6px; font-size:0.85rem;" rows="2">${pfObj.desc || ''}</textarea>
                            <input type="text" class="edit-pf-video" value="${pfObj.link || pfObj.video || ''}" placeholder="유튜브 링크" style="background:#1e2026; color:#fff; border:1px solid #2d3748; padding:6px 10px; border-radius:6px; font-size:0.85rem;">
                            <div style="display:flex; gap:6px; justify-content:flex-end; margin-top:4px;">
                                <button type="button" class="save-pf-edit-btn" style="background:#2ecc71; color:#fff; border:none; padding:5px 12px; border-radius:6px; font-size:0.8rem; cursor:pointer;">저장</button>
                                <button type="button" class="cancel-pf-edit-btn" style="background:#7f8c8d; color:#fff; border:none; padding:5px 12px; border-radius:6px; font-size:0.8rem; cursor:pointer;">취소</button>
                            </div>
                        </div>
                    `;

                    infoBox.querySelector('.save-pf-edit-btn').addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const newTitle = infoBox.querySelector('.edit-pf-title').value.trim();
                        const newTag = infoBox.querySelector('.edit-pf-tag').value.trim();
                        const newDesc = infoBox.querySelector('.edit-pf-desc').value.trim();
                        const newRawVideo = infoBox.querySelector('.edit-pf-video').value.trim();
                        const newEmbed = window.convertYoutubeToEmbed(newRawVideo);

                        if (!newTitle) { alert('제목을 입력해주세요.'); return; }

                        const updatePayload = { title: newTitle, tag: newTag, desc: newDesc, video: newEmbed, link: newRawVideo };
                        const { error } = await _supabase.from('portfolios').update(updatePayload).eq('id', targetId);
                        if (!error) { alert('수정되었습니다.'); fetchPortfoliosFromDB(); }
                    });

                    infoBox.querySelector('.cancel-pf-edit-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        renderPortfolios();
                    });
                });
            });
        }

        if (typeof window.attachHoverEvent === 'function') window.attachHoverEvent();
        updatePortfolio();
    }

    if (portfolioForm) {
        portfolioForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const category = document.getElementById('pf-category').value;
            const title = document.getElementById('pf-title').value.trim();
            const tag = document.getElementById('pf-tag').value.trim();
            const thumb = document.getElementById('pf-thumb').value.trim() || 'img/icon/icon_default.jpg';
            const rawYoutube = document.getElementById('pf-youtube').value.trim();
            const embedVideo = window.convertYoutubeToEmbed(rawYoutube);
            const date = document.getElementById('pf-date').value.trim() || '-';
            const tools = document.getElementById('pf-tools').value.trim() || '-';
            const contribution = document.getElementById('pf-contribution').value.trim() || '-';
            const keywords = document.getElementById('pf-keywords').value.trim();
            const desc = document.getElementById('pf-desc').value.trim();

            const newPfObj = { category, title, tag, thumb, video: embedVideo, link: rawYoutube, date, tools, contribution, keywords, desc };
            const { error } = await _supabase.from('portfolios').insert([newPfObj]);

            if (!error) {
                portfolioForm.reset();
                portfolioForm.style.setProperty('display', 'none', 'important');
                alert('DB에 포트폴리오가 성공적으로 등록되었습니다!');
                fetchPortfoliosFromDB();
            } else { alert('등록 실패: ' + error.message); }
        });
    }

    // ==========================================================================
    // 11. 연혁 (History) Supabase DB 연동 CRUD 모듈
    // ==========================================================================
    async function fetchHistoriesFromDB() {
        if (!historyEduList || !historyExpList || !_supabase) return;

        const { data, error } = await _supabase.from('histories').select('*').order('id', { ascending: true });
        if (error) { console.error('Histories Fetch Error:', error); return; }

        storedHistories = data || [];
        renderHistories();
    }

    function renderHistories() {
        if (!historyEduList || !historyExpList) return;
        historyEduList.innerHTML = '';
        historyExpList.innerHTML = '';

        const isAdmin = sessionStorage.getItem('portfolio_admin_logged_in') === 'true';

        storedHistories.forEach(item => {
            const li = document.createElement('li');
            li.dataset.id = item.id;
            li.style.position = 'relative';

            const adminActionsHtml = isAdmin ? `
                <div class="history-actions" style="position: absolute; top: 5px; right: 5px; display: flex; gap: 4px;">
                    <button class="history-edit-btn" data-id="${item.id}" style="background: rgba(52,152,219,0.9); color:#fff; border:none; padding:2px 8px; border-radius:8px; font-size:0.7rem; cursor:pointer;"><i class="fas fa-edit"></i> 수정</button>
                    <button class="history-delete-btn" data-id="${item.id}" style="background: rgba(231,76,60,0.9); color:#fff; border:none; padding:2px 8px; border-radius:8px; font-size:0.7rem; cursor:pointer;"><i class="fas fa-trash-alt"></i> 삭제</button>
                </div>
            ` : '';

            li.innerHTML = `
                ${adminActionsHtml}
                <span class="date">${item.date || ''}</span>
                <h4>${item.title || ''}</h4>
                <p>${item.desc || ''}</p>
            `;

            if (item.group_type === 'exp' || item.group_type === '경력') {
                historyExpList.appendChild(li);
            } else {
                historyEduList.appendChild(li);
            }
        });

        if (isAdmin) {
            // 연혁 삭제 처리
            document.querySelectorAll('.history-delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const targetId = parseInt(e.currentTarget.dataset.id);
                    if (confirm('해당 연혁 항목을 삭제하시겠습니까?')) {
                        const { error } = await _supabase.from('histories').delete().eq('id', targetId);
                        if (!error) { alert('연혁이 정상 삭제되었습니다.'); fetchHistoriesFromDB(); }
                    }
                });
            });

            // 연혁 수정 처리
            document.querySelectorAll('.history-edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const targetId = parseInt(e.currentTarget.dataset.id);
                    const historyObj = storedHistories.find(h => h.id === targetId);
                    if (!historyObj) return;

                    const liElement = document.querySelector(`li[data-id="${targetId}"]`);
                    if (!liElement) return;

                    liElement.innerHTML = `
                        <div class="history-edit-box" style="display:flex; flex-direction:column; gap:6px; background:#1e2026; padding:10px; border-radius:8px; margin-top:5px;">
                            <input type="text" class="edit-history-date" value="${historyObj.date}" placeholder="기간" style="background:#111; color:#fff; border:1px solid #333; padding:5px 8px; border-radius:4px; font-size:0.8rem;">
                            <input type="text" class="edit-history-title" value="${historyObj.title}" placeholder="기관명/타이틀" style="background:#111; color:#fff; border:1px solid #333; padding:5px 8px; border-radius:4px; font-size:0.8rem;">
                            <input type="text" class="edit-history-desc" value="${historyObj.desc}" placeholder="상세 내용" style="background:#111; color:#fff; border:1px solid #333; padding:5px 8px; border-radius:4px; font-size:0.8rem;">
                            <div style="display:flex; gap:6px; justify-content:flex-end;">
                                <button type="button" class="save-history-edit-btn" style="background:#2ecc71; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer;">저장</button>
                                <button type="button" class="cancel-history-edit-btn" style="background:#7f8c8d; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer;">취소</button>
                            </div>
                        </div>
                    `;

                    liElement.querySelector('.save-history-edit-btn').addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const newDate = liElement.querySelector('.edit-history-date').value.trim();
                        const newTitle = liElement.querySelector('.edit-history-title').value.trim();
                        const newDesc = liElement.querySelector('.edit-history-desc').value.trim();

                        if (!newTitle) { alert('타이틀을 입력해주세요.'); return; }

                        const updatePayload = { date: newDate, title: newTitle, desc: newDesc };
                        const { error } = await _supabase.from('histories').update(updatePayload).eq('id', targetId);
                        if (!error) { alert('연혁 정보가 수정되었습니다.'); fetchHistoriesFromDB(); }
                    });

                    liElement.querySelector('.cancel-history-edit-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        renderHistories();
                    });
                });
            });
        }
    }

    if (historyForm) {
        historyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const group_type = document.getElementById('history-group-type').value;
            const date = document.getElementById('history-date').value.trim();
            const title = document.getElementById('history-title').value.trim();
            const desc = document.getElementById('history-desc').value.trim();

            const newHistoryObj = { group_type, date, title, desc };
            const { error } = await _supabase.from('histories').insert([newHistoryObj]);

            if (!error) {
                historyForm.reset();
                historyForm.style.setProperty('display', 'none', 'important');
                alert('성공적으로 새로운 연혁이 등록되었습니다!');
                fetchHistoriesFromDB();
            } else { alert('등록 실패: ' + error.message); }
        });
    }

    // ==========================================================================
    // 12. 공지사항 DB 연동 CRUD
    // ==========================================================================
    async function fetchNoticesFromDB() {
        if (!noticeListContainer || !_supabase) return;
        const { data, error } = await _supabase.from('notices').select('*').order('id', { ascending: false });
        if (error) { console.error('Database Fetch Error:', error); return; }

        storedNotices = data.map(item => ({ ...item, typeName: item.typeName || item.type_name || '공지' }));
        renderNotices();
    }

    function renderNotices() {
        if (!noticeListContainer) return;
        noticeListContainer.innerHTML = '';

        const isAdmin = sessionStorage.getItem('portfolio_admin_logged_in') === 'true';
        const filteredNotices = storedNotices.filter(item => currentNoticeTab === 'all' || item.type === currentNoticeTab);

        if (filteredNotices.length === 0) {
            noticeListContainer.innerHTML = '<p class="no-results-message" style="display:block;">해당 카테고리의 공지사항이 없습니다.</p>';
            return;
        }

        filteredNotices.forEach(notice => {
            const card = document.createElement('article');
            card.className = 'notice-card';
            card.dataset.id = notice.id;

            let badgeClass = 'badge-primary';
            if (notice.type === 'secondary') badgeClass = 'badge-secondary';
            else if (notice.type === 'info') badgeClass = 'badge-info';
            else if (notice.type === 'update') badgeClass = 'badge-update';

            const adminActionsHtml = isAdmin ? `
                <div class="notice-actions">
                    <button class="notice-edit-btn" data-id="${notice.id}"><i class="fas fa-edit"></i> 수정</button>
                    <button class="notice-delete-btn" data-id="${notice.id}"><i class="fas fa-trash-alt"></i> 삭제</button>
                </div>
            ` : '';

            card.innerHTML = `
                <div class="notice-header">
                    <div class="notice-header-left">
                        <span class="notice-badge ${badgeClass}">${notice.typeName}</span>
                        <span class="notice-author"><i class="fas fa-user-circle"></i> ${notice.author || '정원복'}</span>
                        <span class="notice-date">${notice.date || ''}</span>
                    </div>
                    ${adminActionsHtml}
                </div>
                <h3 class="notice-title">${notice.title || ''}</h3>
                <p class="notice-desc">${notice.desc || ''}</p>
                <div class="notice-footer-action">
                    <button type="button" class="notice-detail-btn"><i class="fas fa-expand-alt"></i> 자세히 보기</button>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.notice-actions') || e.target.closest('.notice-edit-box')) return;
                openNoticeModal(notice);
            });

            noticeListContainer.appendChild(card);
        });

        if (isAdmin) {
            document.querySelectorAll('.notice-delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const targetId = parseInt(e.currentTarget.dataset.id);
                    if (confirm('이 공지사항을 DB에서 영구 삭제하시겠습니까?')) {
                        const { error } = await _supabase.from('notices').delete().eq('id', targetId);
                        if (!error) { alert('공지사항이 삭제되었습니다.'); fetchNoticesFromDB(); }
                    }
                });
            });

            document.querySelectorAll('.notice-edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const targetId = parseInt(e.currentTarget.dataset.id);
                    const noticeObj = storedNotices.find(item => item.id === targetId);
                    if (!noticeObj) return;

                    const cardElement = document.querySelector(`.notice-card[data-id="${targetId}"]`);
                    if (!cardElement) return;

                    cardElement.innerHTML = `
                        <div class="notice-edit-box">
                            <div class="notice-input-row" style="margin-bottom:0;">
                                <select class="edit-type">
                                    <option value="primary" ${noticeObj.type === 'primary' ? 'selected' : ''}>공지</option>
                                    <option value="secondary" ${noticeObj.type === 'secondary' ? 'selected' : ''}>일정</option>
                                    <option value="info" ${noticeObj.type === 'info' ? 'selected' : ''}>안내</option>
                                    <option value="update" ${noticeObj.type === 'update' ? 'selected' : ''}>업데이트</option>
                                </select>
                                <input type="text" class="edit-author" value="${noticeObj.author || '정원복'}" style="max-width:140px;">
                                <input type="text" class="edit-title" value="${noticeObj.title}">
                            </div>
                            <textarea class="edit-desc" rows="3">${noticeObj.desc}</textarea>
                            <div class="notice-edit-actions">
                                <button class="btn-success save-edit-btn"><i class="fas fa-check"></i> 저장</button>
                                <button class="btn-cancel cancel-edit-btn"><i class="fas fa-times"></i> 취소</button>
                            </div>
                        </div>
                    `;

                    cardElement.querySelector('.save-edit-btn').addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const newType = cardElement.querySelector('.edit-type').value;
                        const newTypeName = cardElement.querySelector('.edit-type').options[cardElement.querySelector('.edit-type').selectedIndex].text;
                        const newAuthor = cardElement.querySelector('.edit-author').value.trim() || '정원복';
                        const newTitle = cardElement.querySelector('.edit-title').value.trim();
                        const newDesc = cardElement.querySelector('.edit-desc').value.trim();

                        if (!newTitle || !newDesc) { alert('제목과 내용을 입력해주세요.'); return; }

                        const updatePayload = { type: newType, typeName: newTypeName, author: newAuthor, title: newTitle, desc: newDesc };
                        const { error } = await _supabase.from('notices').update(updatePayload).eq('id', targetId);
                        if (!error) { alert('공지사항이 수정되었습니다.'); fetchNoticesFromDB(); }
                    });

                    cardElement.querySelector('.cancel-edit-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        renderNotices();
                    });
                });
            });
        }
    }

    noticeTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            noticeTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentNoticeTab = btn.dataset.category;
            renderNotices();
        });
    });

    if (noticeForm) {
        noticeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const typeSelect = document.getElementById('notice-type');
            const authorInput = document.getElementById('notice-author-input');
            const titleInput = document.getElementById('notice-title-input');
            const descInput = document.getElementById('notice-desc-input');

            const today = new Date();
            const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

            const newNotice = {
                type: typeSelect ? typeSelect.value : 'primary',
                typeName: typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : '공지',
                author: authorInput ? (authorInput.value.trim() || '정원복') : '정원복',
                title: titleInput ? titleInput.value.trim() : '',
                desc: descInput ? descInput.value.trim() : '',
                date: dateStr
            };

            const { error } = await _supabase.from('notices').insert([newNotice]);
            if (!error) {
                if (titleInput) titleInput.value = '';
                if (descInput) descInput.value = '';
                noticeForm.style.setProperty('display', 'none', 'important');
                alert('DB에 공지사항이 등록되었습니다!');
                fetchNoticesFromDB();
            } else { alert('등록 실패: ' + error.message); }
        });
    }

    checkAdminStatus();
});