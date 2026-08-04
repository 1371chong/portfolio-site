(function() {
    'use strict';

    // 크로스 브라우저 크로스도메인 안전 세션 스토리지 유틸리티
    var SafeStorage = {
        getItem: function(key) {
            try { return sessionStorage.getItem(key); } catch(e) { return null; }
        },
        setItem: function(key, value) {
            try { sessionStorage.setItem(key, value); } catch(e) {}
        },
        removeItem: function(key) {
            try { sessionStorage.removeItem(key); } catch(e) {}
        }
    };

    // 토스트 알림 UI 헬퍼 함수 추가
    function showToast(message, type) {
        type = type || 'success';
        var toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        var toast = document.createElement('div');
        toast.className = 'toast-message ' + type;
        
        var iconClass = type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
        toast.innerHTML = '<i class="' + iconClass + '"></i> <span>' + message + '</span>';
        
        toastContainer.appendChild(toast);

        setTimeout(function() {
            toast.classList.add('show');
        }, 50);

        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() {
                toast.remove();
            }, 400);
        }, 3000);
    }

    document.addEventListener('DOMContentLoaded', function() {

        // ==========================================================================
        // 0. 전역 유틸리티 함수
        // ==========================================================================
        window.convertYoutubeToEmbed = function(url) {
            if (!url) return '';
            var videoId = '';
            if (url.indexOf('youtu.be/') !== -1) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.indexOf('watch?v=') !== -1) {
                videoId = url.split('watch?v=')[1].split('&')[0];
            } else if (url.indexOf('embed/') !== -1) {
                return url;
            }
            return videoId ? 'https://www.youtube.com/embed/' + videoId : url;
        };

        // ==========================================================================
        // 1. 인트로 글씨 타이핑 효과
        // ==========================================================================
        var typingTarget = document.querySelector('.typing-text');
        if (typingTarget) {
            var textArray = ["이야기를 담아내는 정원복입니다.", "가치를 편집하는 정원복입니다.", "트렌드를 연출하는 정원복입니다."];
            var textIndex = 0;
            var charIndex = 0;
            var isDeleting = false;
            var typingSpeed = 120;

            function typeEffect() {
                var currentFullText = textArray[textIndex];
                
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
        var menuToggle = document.querySelector('.menu-toggle');
        var navList = document.querySelector('.nav-list');

        if (menuToggle && navList) {
            menuToggle.addEventListener('click', function() {
                var isOpen = menuToggle.classList.toggle('open');
                navList.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', isOpen);
            });

            var navLinks = document.querySelectorAll('.nav-list a');
            Array.prototype.forEach.call(navLinks, function(link) {
                link.addEventListener('click', function() {
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
        var filterButtons = document.querySelectorAll('.portfolio-filter button');
        var searchInput = document.getElementById('portfolio-search');
        var noResultsMessage = document.getElementById('no-results');

        var currentFilter = 'all';

        function updatePortfolio() {
            var portfolioItems = document.querySelectorAll('.portfolio-item');
            var searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            var visibleCount = 0;

            Array.prototype.forEach.call(portfolioItems, function(item) {
                var category = item.getAttribute('data-category');
                var keywords = item.getAttribute('data-keywords') ? item.getAttribute('data-keywords').toLowerCase() : '';
                var h3Element = item.querySelector('h3');
                var title = h3Element ? h3Element.textContent.toLowerCase() : '';

                var isCategoryMatch = (currentFilter === 'all' || category === currentFilter);
                var isSearchMatch = (searchTerm === '' || title.indexOf(searchTerm) !== -1 || keywords.indexOf(searchTerm) !== -1);

                if (isCategoryMatch && isSearchMatch) {
                    item.style.display = 'block';
                    setTimeout(function() { item.classList.add('show'); }, 50);
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

        Array.prototype.forEach.call(filterButtons, function(button) {
            button.addEventListener('click', function() {
                Array.prototype.forEach.call(filterButtons, function(btn) { btn.classList.remove('active'); });
                button.classList.add('active');
                currentFilter = button.getAttribute('data-filter');
                updatePortfolio();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', updatePortfolio);
        }

        // ==========================================================================
        // 4. 스크롤 반응형 애니메이션 (IntersectionObserver 및 폴백)
        // ==========================================================================
        if ('IntersectionObserver' in window) {
            var observerOptions = { threshold: 0.1 };
            var generalObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        if (entry.target.classList.contains('portfolio-item')) {
                            entry.target.classList.add('show');
                            generalObserver.unobserve(entry.target);
                        }
                        if (entry.target.classList.contains('skill-card-v')) {
                            var progressBar = entry.target.querySelector('.skill-progress-bar');
                            var progressValue = entry.target.getAttribute('data-progress');
                            if (progressBar && progressValue) {
                                progressBar.style.width = progressValue;
                            }
                            generalObserver.unobserve(entry.target);
                        }
                    }
                });
            }, observerOptions);

            Array.prototype.forEach.call(document.querySelectorAll('.skill-card-v'), function(card) {
                generalObserver.observe(card);
            });
            window.generalObserver = generalObserver;
        } else {
            Array.prototype.forEach.call(document.querySelectorAll('.skill-card-v'), function(card) {
                var progressBar = card.querySelector('.skill-progress-bar');
                var progressValue = card.getAttribute('data-progress');
                if (progressBar && progressValue) progressBar.style.width = progressValue;
            });
        }

        // ==========================================================================
        // 5. FAQ 아코디언 토글
        // ==========================================================================
        var faqItems = document.querySelectorAll('.faq-item');
        Array.prototype.forEach.call(faqItems, function(item) {
            var questionBtn = item.querySelector('.faq-question');
            if (questionBtn) {
                questionBtn.addEventListener('click', function() {
                    var isActive = item.classList.contains('active');
                    Array.prototype.forEach.call(faqItems, function(otherItem) { otherItem.classList.remove('active'); });
                    if (!isActive) item.classList.add('active');
                });
            }
        });

        // ==========================================================================
        // 6. 프로젝트 상세보기 모달
        // ==========================================================================
        var modalOverlay = document.getElementById('project-modal');
        var modalCloseBtn = document.querySelector('.modal-close-btn');
        var modalIframe = document.getElementById('modal-video');
        var modalImg = document.getElementById('modal-img');
        
        var modalTitle = document.getElementById('modal-title');
        var modalCategory = document.getElementById('modal-category');
        var modalDesc = document.getElementById('modal-description');
        var modalDate = document.getElementById('modal-date');
        var modalTools = document.getElementById('modal-tools');
        var modalContribution = document.getElementById('modal-contribution');
        var modalLink = document.getElementById('modal-link');

        document.addEventListener('click', function(e) {
            if (e.target.closest && e.target.closest('.pf-admin-controls')) return;

            var triggerBtn = (e.target.closest && (e.target.closest('.open-modal') || e.target.closest('.portfolio-thumb')));
            if (triggerBtn) {
                var item = triggerBtn.closest('.portfolio-item');
                if (!item) return;

                var data = item.dataset;
                if (modalTitle) modalTitle.textContent = data.title || (item.querySelector('h3') ? item.querySelector('h3').textContent : '');
                if (modalCategory) modalCategory.textContent = data.tag || '#포트폴리오';
                if (modalDesc) modalDesc.textContent = data.desc || '작품 상세 설명이 없습니다.';
                if (modalDate) modalDate.textContent = data.date || '-';
                if (modalTools) modalTools.textContent = data.tools || '-';
                if (modalContribution) modalContribution.textContent = data.contribution || '-';
                if (modalLink) modalLink.href = data.link || '#';

                if (data.video && modalIframe) {
                    modalIframe.src = data.video.indexOf('autoplay') !== -1 ? data.video : data.video + '?autoplay=1';
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

        var closeModal = function() {
            if (!modalOverlay || !modalOverlay.classList.contains('active')) return;
            modalOverlay.classList.remove('active');
            modalOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
            setTimeout(function() { if (modalIframe) modalIframe.src = ''; }, 300);
        };

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function(e) {
                if (e.target === modalOverlay) closeModal();
            });
        }

        // ==========================================================================
        // 6-B. 공지사항 상세보기 모달
        // ==========================================================================
        var noticeModalOverlay = document.getElementById('notice-detail-modal');
        var noticeModalCloseBtn = document.querySelector('.notice-modal-close');
        var noticeModalBadge = document.getElementById('notice-modal-badge');
        var noticeModalAuthor = document.getElementById('notice-modal-author');
        var noticeModalDate = document.getElementById('notice-modal-date');
        var noticeModalTitle = document.getElementById('notice-modal-title');
        var noticeModalDesc = document.getElementById('notice-modal-desc');

        function openNoticeModal(noticeObj) {
            if (!noticeModalOverlay) return;

            var badgeClass = 'badge-primary';
            if (noticeObj.type === 'secondary') badgeClass = 'badge-secondary';
            else if (noticeObj.type === 'info') badgeClass = 'badge-info';
            else if (noticeObj.type === 'update') badgeClass = 'badge-update';

            if (noticeModalBadge) {
                noticeModalBadge.className = 'notice-badge ' + badgeClass;
                noticeModalBadge.textContent = noticeObj.typeName || '공지';
            }
            if (noticeModalAuthor) noticeModalAuthor.innerHTML = '<i class="fas fa-user-circle"></i> ' + (noticeObj.author || '정원복');
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
            noticeModalOverlay.addEventListener('click', function(e) {
                if (e.target === noticeModalOverlay) closeNoticeModal();
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                closeModal();
                closeNoticeModal();
                closeAdminModal();
            }
        });

        // ==========================================================================
        // 7. 네비게이션 스크롤 스파이
        // ==========================================================================
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-list a');

        if ('IntersectionObserver' in window) {
            var scrollSpyOptions = { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 };
            var scrollSpyObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var activeId = entry.target.getAttribute('id');
                        Array.prototype.forEach.call(navLinks, function(link) {
                            var href = link.getAttribute('href').replace('#', '');
                            if (href === activeId) link.classList.add('active');
                            else link.classList.remove('active');
                        });
                    }
                });
            }, scrollSpyOptions);

            Array.prototype.forEach.call(sections, function(section) { scrollSpyObserver.observe(section); });
        }

        // ==========================================================================
        // 8. 커스텀 마우스 포인터 (PC 전용)
        // ==========================================================================
        var cursorArrow = document.querySelector('.custom-cursor-arrow');
        if (cursorArrow && window.innerWidth > 991) {
            var mouseX = 0, mouseY = 0, arrowX = 0, arrowY = 0;
            window.addEventListener('mousemove', function(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            function animateArrow() {
                arrowX += (mouseX - arrowX) * 0.25;
                arrowY += (mouseY - arrowY) * 0.25;
                cursorArrow.style.left = arrowX + 'px';
                cursorArrow.style.top = arrowY + 'px';
                requestAnimationFrame(animateArrow);
            }
            animateArrow();

            var hoverEnterHandler = function() { document.body.classList.add('hovered'); };
            var hoverLeaveHandler = function() { document.body.classList.remove('hovered'); };

            window.attachHoverEvent = function() {
                var hoverTargets = document.querySelectorAll('a, button, input, textarea, select, .portfolio-thumb, .faq-question, .notice-card');
                Array.prototype.forEach.call(hoverTargets, function(target) {
                    target.removeEventListener('mouseenter', hoverEnterHandler);
                    target.removeEventListener('mouseleave', hoverLeaveHandler);
                    target.addEventListener('mouseenter', hoverEnterHandler);
                    target.addEventListener('mouseleave', hoverLeaveHandler);
                });
            };
            window.attachHoverEvent();
        }

        // ==========================================================================
        // 9. Supabase DB 크로스 브라우저 로딩 및 크리덴셜 초기화
        // ==========================================================================
        var SUPABASE_URL = "https://zwjggedeichljaesgiqk.supabase.co"; 
        var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3amdnZWRlaWNobGphZXNnaXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NjU2NTIsImV4cCI6MjEwMTM0MTY1Mn0.DQ5mcKQf5tmWI2B7ESM3OMoebwLBgNwfpIxCUXNuc1A"; 
        var ADMIN_PASSWORD = "051700";

        var _supabase = null;
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }

        var adminLoginTriggerBtn = document.getElementById('admin-login-trigger-btn');
        var adminModeDropdownWrapper = document.getElementById('admin-mode-dropdown-wrapper');
        var adminModeBtn = document.getElementById('admin-mode-btn');
        var adminMenuDropdown = document.getElementById('admin-menu-dropdown');
        
        var adminMenuAddPf = document.getElementById('admin-menu-add-pf');
        var adminMenuAddNotice = document.getElementById('admin-menu-add-notice');
        var adminMenuAddHistory = document.getElementById('admin-menu-add-history');
        var adminMenuPopupConfig = document.getElementById('admin-menu-popup-config');
        var adminMenuMaintenanceConfig = document.getElementById('admin-menu-maintenance-config');

        var adminLogoutBtn = document.getElementById('admin-logout-btn');
        var adminAuthModal = document.getElementById('admin-auth-modal');
        var adminModalCloseBtn = document.querySelector('.admin-modal-close');
        var adminLoginForm = document.getElementById('admin-login-form');
        var adminPwInput = document.getElementById('admin-pw-input');
        var adminAuthError = document.getElementById('admin-auth-error');

        var noticeForm = document.getElementById('notice-form');
        var noticeListContainer = document.getElementById('notice-list');
        var noticeTabBtns = document.querySelectorAll('.notice-tab-btn');

        var historyForm = document.getElementById('history-form');
        var historyEduList = document.getElementById('history-edu-list');
        var historyExpList = document.getElementById('history-exp-list');

        var popupConfigForm = document.getElementById('popup-config-form');
        var maintenanceConfigForm = document.getElementById('maintenance-config-form');

        var currentNoticeTab = 'all';
        var storedNotices = [];
        var storedPortfolios = [];
        var storedHistories = [];

        function openAdminModal() {
            if (!adminAuthModal) return;
            if (adminPwInput) adminPwInput.value = '';
            if (adminAuthError) adminAuthError.style.display = 'none';
            adminAuthModal.classList.add('active');
            adminAuthModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (adminPwInput) setTimeout(function() { adminPwInput.focus(); }, 100);
        }

        function closeAdminModal() {
            if (!adminAuthModal || !adminAuthModal.classList.contains('active')) return;
            adminAuthModal.classList.remove('active');
            adminAuthModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }

        if (adminModalCloseBtn) adminModalCloseBtn.addEventListener('click', closeAdminModal);
        if (adminAuthModal) {
            adminAuthModal.addEventListener('click', function(e) {
                if (e.target === adminAuthModal) closeAdminModal();
            });
        }

        // 관리자 로그인 상태 동적 처리
        function checkAdminStatus() {
            var isAdmin = SafeStorage.getItem('portfolio_admin_logged_in') === 'true';
            var portfolioForm = document.getElementById('portfolio-form');

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
            if (popupConfigForm) popupConfigForm.style.setProperty('display', 'none', 'important');
            if (maintenanceConfigForm) maintenanceConfigForm.style.setProperty('display', 'none', 'important');

            fetchPortfoliosFromDB();
            fetchNoticesFromDB();
            fetchHistoriesFromDB();
            applyPopupConfig();
            applyMaintenanceConfig();
        }

        // 관리자 모드 드롭다운 제어
        if (adminModeBtn && adminMenuDropdown) {
            adminModeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                var isHidden = adminMenuDropdown.style.display === 'none' || adminMenuDropdown.style.display === '';
                adminMenuDropdown.style.display = isHidden ? 'block' : 'none';
            });

            document.addEventListener('click', function(e) {
                if (adminModeDropdownWrapper && !adminModeDropdownWrapper.contains(e.target)) {
                    adminMenuDropdown.style.display = 'none';
                }
            });
        }

        if (adminMenuAddPf) {
            adminMenuAddPf.addEventListener('click', function() {
                adminMenuDropdown.style.display = 'none';
                var pfForm = document.getElementById('portfolio-form');
                if (pfForm) {
                    var isHidden = window.getComputedStyle(pfForm).display === 'none';
                    pfForm.style.setProperty('display', isHidden ? 'block' : 'none', 'important');
                    var pfSection = document.getElementById('portfolio');
                    if (pfSection) pfSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (adminMenuAddNotice) {
            adminMenuAddNotice.addEventListener('click', function() {
                adminMenuDropdown.style.display = 'none';
                if (noticeForm) {
                    var isHidden = window.getComputedStyle(noticeForm).display === 'none';
                    noticeForm.style.setProperty('display', isHidden ? 'block' : 'none', 'important');
                    var noticeSection = document.getElementById('notice');
                    if (noticeSection) noticeSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (adminMenuAddHistory) {
            adminMenuAddHistory.addEventListener('click', function() {
                adminMenuDropdown.style.display = 'none';
                if (historyForm) {
                    var isHidden = window.getComputedStyle(historyForm).display === 'none';
                    historyForm.style.setProperty('display', isHidden ? 'block' : 'none', 'important');
                    var aboutSection = document.getElementById('about');
                    if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (adminMenuPopupConfig && popupConfigForm) {
            adminMenuPopupConfig.addEventListener('click', function() {
                adminMenuDropdown.style.display = 'none';
                var isHidden = window.getComputedStyle(popupConfigForm).display === 'none';
                popupConfigForm.style.setProperty('display', isHidden ? 'block' : 'none', 'important');
                
                var saved = SafeStorage.getItem('site_popup_config');
                if (saved) {
                    try {
                        var cfg = JSON.parse(saved);
                        document.getElementById('popup-is-active').checked = !!cfg.active;
                        document.getElementById('popup-title-input').value = cfg.title || '';
                        document.getElementById('popup-img-input').value = cfg.img || '';
                        document.getElementById('popup-link-input').value = cfg.link || '';
                        document.getElementById('popup-desc-input').value = cfg.desc || '';
                    } catch(e) {}
                }

                var noticeSection = document.getElementById('notice');
                if (noticeSection) noticeSection.scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (adminMenuMaintenanceConfig && maintenanceConfigForm) {
            adminMenuMaintenanceConfig.addEventListener('click', function() {
                adminMenuDropdown.style.display = 'none';
                var isHidden = window.getComputedStyle(maintenanceConfigForm).display === 'none';
                maintenanceConfigForm.style.setProperty('display', isHidden ? 'block' : 'none', 'important');

                var saved = SafeStorage.getItem('site_maint_config');
                if (saved) {
                    try {
                        var cfg = JSON.parse(saved);
                        document.getElementById('maint-is-active').checked = !!cfg.active;
                        document.getElementById('maint-title-input').value = cfg.title || '';
                        document.getElementById('maint-period-input').value = cfg.period || '';
                        document.getElementById('maint-desc-input').value = cfg.desc || '';
                    } catch(e) {}
                }

                var noticeSection = document.getElementById('notice');
                if (noticeSection) noticeSection.scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (adminLoginTriggerBtn) adminLoginTriggerBtn.addEventListener('click', openAdminModal);

        if (adminLogoutBtn) {
            adminLogoutBtn.addEventListener('click', function() {
                SafeStorage.removeItem('portfolio_admin_logged_in');
                showToast('관리자 모드에서 로그아웃 되었습니다.', 'info');
                checkAdminStatus();
            });
        }

        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var inputPw = adminPwInput ? adminPwInput.value.trim() : '';
                if (inputPw === ADMIN_PASSWORD) {
                    SafeStorage.setItem('portfolio_admin_logged_in', 'true');
                    closeAdminModal();
                    checkAdminStatus();
                    showToast('관리자로 로그인되었습니다.', 'success');
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
        // 10. 포트폴리오 DB CRUD
        // ==========================================================================
        var portfolioForm = document.getElementById('portfolio-form');
        var portfolioGrid = document.querySelector('.portfolio-grid');

        function fetchPortfoliosFromDB() {
            if (!portfolioGrid || !_supabase) return;
            _supabase.from('portfolios').select('*').order('id', { ascending: false }).then(function(res) {
                if (res.error) { console.error('Portfolios Fetch Error:', res.error); return; }
                storedPortfolios = res.data || [];
                renderPortfolios();
            });
        }

        function renderPortfolios() {
            if (!portfolioGrid) return;
            portfolioGrid.innerHTML = '';

            var isAdmin = SafeStorage.getItem('portfolio_admin_logged_in') === 'true';

            storedPortfolios.forEach(function(item) {
                var article = document.createElement('article');
                article.className = 'portfolio-item show';
                article.setAttribute('data-id', item.id);
                article.setAttribute('data-category', item.category || 'video');
                article.setAttribute('data-keywords', item.keywords || '');
                article.setAttribute('data-title', item.title || '');
                article.setAttribute('data-tag', item.tag || '#포트폴리오');
                article.setAttribute('data-desc', item.desc || '');
                article.setAttribute('data-date', item.date || '-');
                article.setAttribute('data-tools', item.tools || '-');
                article.setAttribute('data-contribution', item.contribution || '-');
                if (item.video) article.setAttribute('data-video', item.video);
                if (item.img) article.setAttribute('data-img', item.img);
                if (item.link) article.setAttribute('data-link', item.link);

                var thumbSrc = item.thumb || item.img || 'img/icon/icon_default.jpg';
                var adminControlsHtml = isAdmin ? '\
                    <div class="pf-admin-controls" style="position: absolute; top: 10px; right: 10px; z-index: 20; display: flex; gap: 5px;">\
                        <button type="button" class="pf-edit-btn" data-id="' + item.id + '" style="background: rgba(52,152,219,0.9); color:#fff; border:none; padding:4px 10px; border-radius:12px; font-size:0.75rem; cursor:pointer;"><i class="fas fa-edit"></i> 수정</button>\
                        <button type="button" class="pf-del-btn" data-id="' + item.id + '" style="background: rgba(231,76,60,0.9); color:#fff; border:none; padding:4px 10px; border-radius:12px; font-size:0.75rem; cursor:pointer;"><i class="fas fa-trash-alt"></i> 삭제</button>\
                    </div>\
                ' : '';

                article.style.position = 'relative';
                article.innerHTML = adminControlsHtml + '\
                    <div class="portfolio-thumb">\
                        <img src="' + thumbSrc + '" alt="' + item.title + ' 썸네일">\
                        <div class="item-overlay">\
                            <span class="zoom-icon"><i class="fas fa-search-plus"></i></span>\
                        </div>\
                    </div>\
                    <div class="portfolio-info">\
                        <h3>' + item.title + '</h3>\
                        <div class="info-footer">\
                            <span class="tag">' + item.tag + '</span>\
                            <button type="button" class="portfolio-btn open-modal">상세보기 <i class="fas fa-chevron-right"></i></button>\
                        </div>\
                    </div>\
                ';
                portfolioGrid.appendChild(article);
                if (window.generalObserver) window.generalObserver.observe(article);
            });

            if (isAdmin) {
                Array.prototype.forEach.call(document.querySelectorAll('.pf-del-btn'), function(btn) {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        var targetId = parseInt(e.currentTarget.getAttribute('data-id'));
                        if (confirm('이 포트폴리오를 DB에서 삭제하시겠습니까?')) {
                            _supabase.from('portfolios').delete().eq('id', targetId).then(function(res) {
                                if (!res.error) { showToast('포트폴리오가 삭제되었습니다.', 'success'); fetchPortfoliosFromDB(); }
                            });
                        }
                    });
                });

                Array.prototype.forEach.call(document.querySelectorAll('.pf-edit-btn'), function(btn) {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        var targetId = parseInt(e.currentTarget.getAttribute('data-id'));
                        var pfObj = storedPortfolios.filter(function(item) { return item.id === targetId; })[0];
                        if (!pfObj) return;

                        var articleElement = document.querySelector('.portfolio-item[data-id="' + targetId + '"]');
                        var infoBox = articleElement ? articleElement.querySelector('.portfolio-info') : null;
                        if (!infoBox) return;

                        infoBox.innerHTML = '\
                            <div class="pf-edit-form" style="display:flex; flex-direction:column; gap:8px;">\
                                <input type="text" class="edit-pf-title" value="' + pfObj.title + '" placeholder="작품 제목" style="background:#1e2026; color:#fff; border:1px solid #2d3748; padding:6px 10px; border-radius:6px; font-size:0.85rem;">\
                                <input type="text" class="edit-pf-tag" value="' + pfObj.tag + '" placeholder="태그" style="background:#1e2026; color:#fff; border:1px solid #2d3748; padding:6px 10px; border-radius:6px; font-size:0.85rem;">\
                                <textarea class="edit-pf-desc" placeholder="상세설명" style="background:#1e2026; color:#fff; border:1px solid #2d3748; padding:6px 10px; border-radius:6px; font-size:0.85rem;" rows="2">' + (pfObj.desc || '') + '</textarea>\
                                <input type="text" class="edit-pf-video" value="' + (pfObj.link || pfObj.video || '') + '" placeholder="유튜브 링크" style="background:#1e2026; color:#fff; border:1px solid #2d3748; padding:6px 10px; border-radius:6px; font-size:0.85rem;">\
                                <div style="display:flex; gap:6px; justify-content:flex-end; margin-top:4px;">\
                                    <button type="button" class="save-pf-edit-btn" style="background:#2ecc71; color:#fff; border:none; padding:5px 12px; border-radius:6px; font-size:0.8rem; cursor:pointer;">저장</button>\
                                    <button type="button" class="cancel-pf-edit-btn" style="background:#7f8c8d; color:#fff; border:none; padding:5px 12px; border-radius:6px; font-size:0.8rem; cursor:pointer;">취소</button>\
                                </div>\
                            </div>\
                        ';

                        infoBox.querySelector('.save-pf-edit-btn').addEventListener('click', function(e) {
                            e.stopPropagation();
                            var newTitle = infoBox.querySelector('.edit-pf-title').value.trim();
                            var newTag = infoBox.querySelector('.edit-pf-tag').value.trim();
                            var newDesc = infoBox.querySelector('.edit-pf-desc').value.trim();
                            var newRawVideo = infoBox.querySelector('.edit-pf-video').value.trim();
                            var newEmbed = window.convertYoutubeToEmbed(newRawVideo);

                            if (!newTitle) { alert('제목을 입력해주세요.'); return; }

                            var updatePayload = { title: newTitle, tag: newTag, desc: newDesc, video: newEmbed, link: newRawVideo };
                            _supabase.from('portfolios').update(updatePayload).eq('id', targetId).then(function(res) {
                                if (!res.error) { showToast('포트폴리오가 수정되었습니다.', 'success'); fetchPortfoliosFromDB(); }
                            });
                        });

                        infoBox.querySelector('.cancel-pf-edit-btn').addEventListener('click', function(e) {
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
            portfolioForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var category = document.getElementById('pf-category').value;
                var title = document.getElementById('pf-title').value.trim();
                var tag = document.getElementById('pf-tag').value.trim();
                var thumb = document.getElementById('pf-thumb').value.trim() || 'img/icon/icon_default.jpg';
                var rawYoutube = document.getElementById('pf-youtube').value.trim();
                var embedVideo = window.convertYoutubeToEmbed(rawYoutube);
                var date = document.getElementById('pf-date').value.trim() || '-';
                var tools = document.getElementById('pf-tools').value.trim() || '-';
                var contribution = document.getElementById('pf-contribution').value.trim() || '-';
                var keywords = document.getElementById('pf-keywords').value.trim();
                var desc = document.getElementById('pf-desc').value.trim();

                var newPfObj = { category: category, title: title, tag: tag, thumb: thumb, video: embedVideo, link: rawYoutube, date: date, tools: tools, contribution: contribution, keywords: keywords, desc: desc };
                _supabase.from('portfolios').insert([newPfObj]).then(function(res) {
                    if (!res.error) {
                        portfolioForm.reset();
                        portfolioForm.style.setProperty('display', 'none', 'important');
                        showToast('DB에 포트폴리오가 성공적으로 등록되었습니다!', 'success');
                        fetchPortfoliosFromDB();
                    } else { alert('등록 실패: ' + res.error.message); }
                });
            });
        }

        // ==========================================================================
        // 11. 연혁 (History) Supabase DB CRUD
        // ==========================================================================
        function fetchHistoriesFromDB() {
            if (!historyEduList || !historyExpList || !_supabase) return;
            _supabase.from('histories').select('*').order('id', { ascending: true }).then(function(res) {
                if (res.error) { console.error('Histories Fetch Error:', res.error); return; }
                storedHistories = res.data || [];
                renderHistories();
            });
        }

        function renderHistories() {
            if (!historyEduList || !historyExpList) return;
            historyEduList.innerHTML = '';
            historyExpList.innerHTML = '';

            var isAdmin = SafeStorage.getItem('portfolio_admin_logged_in') === 'true';

            storedHistories.forEach(function(item) {
                var li = document.createElement('li');
                li.setAttribute('data-id', item.id);
                li.style.position = 'relative';

                var adminActionsHtml = isAdmin ? '\
                    <div class="history-actions" style="position: absolute; top: 5px; right: 5px; display: flex; gap: 4px;">\
                        <button class="history-edit-btn" data-id="' + item.id + '" style="background: rgba(52,152,219,0.9); color:#fff; border:none; padding:2px 8px; border-radius:8px; font-size:0.7rem; cursor:pointer;"><i class="fas fa-edit"></i> 수정</button>\
                        <button class="history-delete-btn" data-id="' + item.id + '" style="background: rgba(231,76,60,0.9); color:#fff; border:none; padding:2px 8px; border-radius:8px; font-size:0.7rem; cursor:pointer;"><i class="fas fa-trash-alt"></i> 삭제</button>\
                    </div>\
                ' : '';

                li.innerHTML = adminActionsHtml + '\
                    <span class="date">' + (item.date || '') + '</span>\
                    <h4>' + (item.title || '') + '</h4>\
                    <p>' + (item.desc || '') + '</p>\
                ';

                if (item.group_type === 'exp' || item.group_type === '경력') {
                    historyExpList.appendChild(li);
                } else {
                    historyEduList.appendChild(li);
                }
            });

            if (isAdmin) {
                Array.prototype.forEach.call(document.querySelectorAll('.history-delete-btn'), function(btn) {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        var targetId = parseInt(e.currentTarget.getAttribute('data-id'));
                        if (confirm('해당 연혁 항목을 삭제하시겠습니까?')) {
                            _supabase.from('histories').delete().eq('id', targetId).then(function(res) {
                                if (!res.error) { showToast('연혁이 정상 삭제되었습니다.', 'success'); fetchHistoriesFromDB(); }
                            });
                        }
                    });
                });

                Array.prototype.forEach.call(document.querySelectorAll('.history-edit-btn'), function(btn) {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        var targetId = parseInt(e.currentTarget.getAttribute('data-id'));
                        var historyObj = storedHistories.filter(function(h) { return h.id === targetId; })[0];
                        if (!historyObj) return;

                        var liElement = document.querySelector('li[data-id="' + targetId + '"]');
                        if (!liElement) return;

                        liElement.innerHTML = '\
                            <div class="history-edit-box" style="display:flex; flex-direction:column; gap:6px; background:#1e2026; padding:10px; border-radius:8px; margin-top:5px;">\
                                <input type="text" class="edit-history-date" value="' + historyObj.date + '" placeholder="기간" style="background:#111; color:#fff; border:1px solid #333; padding:5px 8px; border-radius:4px; font-size:0.8rem;">\
                                <input type="text" class="edit-history-title" value="' + historyObj.title + '" placeholder="기관명/타이틀" style="background:#111; color:#fff; border:1px solid #333; padding:5px 8px; border-radius:4px; font-size:0.8rem;">\
                                <input type="text" class="edit-history-desc" value="' + historyObj.desc + '" placeholder="상세 내용" style="background:#111; color:#fff; border:1px solid #333; padding:5px 8px; border-radius:4px; font-size:0.8rem;">\
                                <div style="display:flex; gap:6px; justify-content:flex-end;">\
                                    <button type="button" class="save-history-edit-btn" style="background:#2ecc71; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer;">저장</button>\
                                    <button type="button" class="cancel-history-edit-btn" style="background:#7f8c8d; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer;">취소</button>\
                                </div>\
                            </div>\
                        ';

                        liElement.querySelector('.save-history-edit-btn').addEventListener('click', function(e) {
                            e.stopPropagation();
                            var newDate = liElement.querySelector('.edit-history-date').value.trim();
                            var newTitle = liElement.querySelector('.edit-history-title').value.trim();
                            var newDesc = liElement.querySelector('.edit-history-desc').value.trim();

                            if (!newTitle) { alert('타이틀을 입력해주세요.'); return; }

                            var updatePayload = { date: newDate, title: newTitle, desc: newDesc };
                            _supabase.from('histories').update(updatePayload).eq('id', targetId).then(function(res) {
                                if (!res.error) { showToast('연혁 정보가 수정되었습니다.', 'success'); fetchHistoriesFromDB(); }
                            });
                        });

                        liElement.querySelector('.cancel-history-edit-btn').addEventListener('click', function(e) {
                            e.stopPropagation();
                            renderHistories();
                        });
                    });
                });
            }
        }

        if (historyForm) {
            historyForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var group_type = document.getElementById('history-group-type').value;
                var date = document.getElementById('history-date').value.trim();
                var title = document.getElementById('history-title').value.trim();
                var desc = document.getElementById('history-desc').value.trim();

                var newHistoryObj = { group_type: group_type, date: date, title: title, desc: desc };
                _supabase.from('histories').insert([newHistoryObj]).then(function(res) {
                    if (!res.error) {
                        historyForm.reset();
                        historyForm.style.setProperty('display', 'none', 'important');
                        showToast('성공적으로 새로운 연혁이 등록되었습니다!', 'success');
                        fetchHistoriesFromDB();
                    } else { alert('등록 실패: ' + res.error.message); }
                });
            });
        }

        // ==========================================================================
        // 12. 공지사항 DB CRUD
        // ==========================================================================
        function fetchNoticesFromDB() {
            if (!noticeListContainer || !_supabase) return;
            _supabase.from('notices').select('*').order('id', { ascending: false }).then(function(res) {
                if (res.error) { console.error('Database Fetch Error:', res.error); return; }
                storedNotices = (res.data || []).map(function(item) {
                    return Object.assign({}, item, { typeName: item.typeName || item.type_name || '공지' });
                });
                renderNotices();
            });
        }

        function renderNotices() {
            if (!noticeListContainer) return;
            noticeListContainer.innerHTML = '';

            var isAdmin = SafeStorage.getItem('portfolio_admin_logged_in') === 'true';
            var filteredNotices = storedNotices.filter(function(item) {
                return currentNoticeTab === 'all' || item.type === currentNoticeTab;
            });

            if (filteredNotices.length === 0) {
                noticeListContainer.innerHTML = '<p class="no-results-message" style="display:block;">해당 카테고리의 공지사항이 없습니다.</p>';
                return;
            }

            filteredNotices.forEach(function(notice) {
                var card = document.createElement('article');
                card.className = 'notice-card';
                card.setAttribute('data-id', notice.id);

                var badgeClass = 'badge-primary';
                if (notice.type === 'secondary') badgeClass = 'badge-secondary';
                else if (notice.type === 'info') badgeClass = 'badge-info';
                else if (notice.type === 'update') badgeClass = 'badge-update';

                var adminActionsHtml = isAdmin ? '\
                    <div class="notice-admin-actions">\
                        <button class="notice-edit-btn" data-id="' + notice.id + '"><i class="fas fa-edit"></i> 수정</button>\
                        <button class="notice-delete-btn" data-id="' + notice.id + '"><i class="fas fa-trash-alt"></i> 삭제</button>\
                    </div>\
                ' : '';

                card.innerHTML = '\
                    <div class="notice-header">\
                        <div class="notice-header-left">\
                            <span class="notice-badge ' + badgeClass + '">' + notice.typeName + '</span>\
                            <span class="notice-author"><i class="fas fa-user-circle"></i> ' + (notice.author || '정원복') + '</span>\
                            <span class="notice-date">' + (notice.date || '') + '</span>\
                        </div>\
                        ' + adminActionsHtml + '\
                    </div>\
                    <h3 class="notice-title">' + (notice.title || '') + '</h3>\
                    <p class="notice-desc">' + (notice.desc || '') + '</p>\
                    <div class="notice-footer-action">\
                        <button type="button" class="notice-detail-btn"><i class="fas fa-expand-alt"></i> 자세히 보기</button>\
                    </div>\
                ';

                card.addEventListener('click', function(e) {
                    if (e.target.closest && (e.target.closest('.notice-admin-actions') || e.target.closest('.notice-edit-box'))) return;
                    openNoticeModal(notice);
                });

                noticeListContainer.appendChild(card);
            });

            if (isAdmin) {
                Array.prototype.forEach.call(document.querySelectorAll('.notice-delete-btn'), function(btn) {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        var targetId = parseInt(e.currentTarget.getAttribute('data-id'));
                        if (confirm('이 공지사항을 DB에서 영구 삭제하시겠습니까?')) {
                            _supabase.from('notices').delete().eq('id', targetId).then(function(res) {
                                if (!res.error) { showToast('공지사항이 삭제되었습니다.', 'success'); fetchNoticesFromDB(); }
                            });
                        }
                    });
                });

                Array.prototype.forEach.call(document.querySelectorAll('.notice-edit-btn'), function(btn) {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        var targetId = parseInt(e.currentTarget.getAttribute('data-id'));
                        var noticeObj = storedNotices.filter(function(item) { return item.id === targetId; })[0];
                        if (!noticeObj) return;

                        var cardElement = document.querySelector('.notice-card[data-id="' + targetId + '"]');
                        if (!cardElement) return;

                        cardElement.innerHTML = '\
                            <div class="notice-edit-box">\
                                <div class="notice-input-row" style="margin-bottom:0;">\
                                    <select class="edit-type">\
                                        <option value="primary" ' + (noticeObj.type === 'primary' ? 'selected' : '') + '>공지</option>\
                                        <option value="secondary" ' + (noticeObj.type === 'secondary' ? 'selected' : '') + '>일정</option>\
                                        <option value="info" ' + (noticeObj.type === 'info' ? 'selected' : '') + '>안내</option>\
                                        <option value="update" ' + (noticeObj.type === 'update' ? 'selected' : '') + '>업데이트</option>\
                                    </select>\
                                    <input type="text" class="edit-author" value="' + (noticeObj.author || '정원복') + '" style="max-width:140px;">\
                                    <input type="text" class="edit-title" value="' + noticeObj.title + '">\
                                </div>\
                                <textarea class="edit-desc" rows="3">' + noticeObj.desc + '</textarea>\
                                <div class="notice-edit-actions" style="display:flex; gap:6px; justify-content:flex-end; margin-top:8px;">\
                                    <button type="button" class="btn-success save-edit-btn" style="background:#2ecc71; color:#fff; border:none; padding:5px 12px; border-radius:6px; font-size:0.8rem; cursor:pointer;"><i class="fas fa-check"></i> 저장</button>\
                                    <button type="button" class="btn-cancel cancel-edit-btn" style="background:#7f8c8d; color:#fff; border:none; padding:5px 12px; border-radius:6px; font-size:0.8rem; cursor:pointer;"><i class="fas fa-times"></i> 취소</button>\
                                </div>\
                            </div>\
                        ';

                        cardElement.querySelector('.save-edit-btn').addEventListener('click', function(e) {
                            e.stopPropagation();
                            var newType = cardElement.querySelector('.edit-type').value;
                            var typeSelect = cardElement.querySelector('.edit-type');
                            var newTypeName = typeSelect.options[typeSelect.selectedIndex].text;
                            var newAuthor = cardElement.querySelector('.edit-author').value.trim() || '정원복';
                            var newTitle = cardElement.querySelector('.edit-title').value.trim();
                            var newDesc = cardElement.querySelector('.edit-desc').value.trim();

                            if (!newTitle || !newDesc) { alert('제목과 내용을 입력해주세요.'); return; }

                            var updatePayload = { type: newType, typeName: newTypeName, author: newAuthor, title: newTitle, desc: newDesc };
                            _supabase.from('notices').update(updatePayload).eq('id', targetId).then(function(res) {
                                if (!res.error) { showToast('공지사항이 수정되었습니다.', 'success'); fetchNoticesFromDB(); }
                            });
                        });

                        cardElement.querySelector('.cancel-edit-btn').addEventListener('click', function(e) {
                            e.stopPropagation();
                            renderNotices();
                        });
                    });
                });
            }
        }

        Array.prototype.forEach.call(noticeTabBtns, function(btn) {
            btn.addEventListener('click', function() {
                Array.prototype.forEach.call(noticeTabBtns, function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentNoticeTab = btn.getAttribute('data-category');
                renderNotices();
            });
        });

        if (noticeForm) {
            noticeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var typeSelect = document.getElementById('notice-type');
                var authorInput = document.getElementById('notice-author-input');
                var titleInput = document.getElementById('notice-title-input');
                var descInput = document.getElementById('notice-desc-input');

                var today = new Date();
                var dateStr = today.getFullYear() + '.' + String(today.getMonth() + 1).padStart(2, '0') + '.' + String(today.getDate()).padStart(2, '0');

                var newNotice = {
                    type: typeSelect ? typeSelect.value : 'primary',
                    typeName: typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : '공지',
                    author: authorInput ? (authorInput.value.trim() || '정원복') : '정원복',
                    title: titleInput ? titleInput.value.trim() : '',
                    desc: descInput ? descInput.value.trim() : '',
                    date: dateStr
                };

                _supabase.from('notices').insert([newNotice]).then(function(res) {
                    if (!res.error) {
                        if (titleInput) titleInput.value = '';
                        if (descInput) descInput.value = '';
                        noticeForm.style.setProperty('display', 'none', 'important');
                        showToast('DB에 공지사항이 등록되었습니다!', 'success');
                        fetchNoticesFromDB();
                    } else { alert('등록 실패: ' + res.error.message); }
                });
            });
        }

        // ==========================================================================
        // 13. 팝업 공지 및 점검 모드 제어 로직
        // ==========================================================================

        if (popupConfigForm) {
            popupConfigForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var popupData = {
                    active: document.getElementById('popup-is-active').checked,
                    title: document.getElementById('popup-title-input').value.trim(),
                    img: document.getElementById('popup-img-input').value.trim(),
                    link: document.getElementById('popup-link-input').value.trim(),
                    desc: document.getElementById('popup-desc-input').value.trim()
                };
                
                SafeStorage.setItem('site_popup_config', JSON.stringify(popupData));
                showToast('팝업 공지 설정이 저장되었습니다.', 'success');
                popupConfigForm.style.setProperty('display', 'none', 'important');
                applyPopupConfig();
            });
        }

        if (maintenanceConfigForm) {
            maintenanceConfigForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var maintData = {
                    active: document.getElementById('maint-is-active').checked,
                    title: document.getElementById('maint-title-input').value.trim(),
                    period: document.getElementById('maint-period-input').value.trim(),
                    desc: document.getElementById('maint-desc-input').value.trim()
                };
                
                SafeStorage.setItem('site_maint_config', JSON.stringify(maintData));
                showToast('점검 모드 설정이 저장되었습니다.', 'success');
                maintenanceConfigForm.style.setProperty('display', 'none', 'important');
                applyMaintenanceConfig();
            });
        }

        function applyPopupConfig() {
            var raw = SafeStorage.getItem('site_popup_config');
            if (!raw) return;
            try {
                var config = JSON.parse(raw);
                var popupModal = document.getElementById('main-popup-modal');
                var hideToday = localStorage.getItem('popup_hide_until');
                var now = new Date().getTime();

                if (config.active && popupModal && (!hideToday || now > parseInt(hideToday))) {
                    var titleEl = document.getElementById('main-popup-title');
                    var imgEl = document.getElementById('main-popup-img');
                    var linkEl = document.getElementById('main-popup-link');
                    var descEl = document.getElementById('main-popup-desc');

                    if (titleEl) titleEl.textContent = config.title || '';
                    if (imgEl) imgEl.src = config.img || '';
                    if (linkEl) linkEl.href = config.link || '#';
                    if (descEl) descEl.textContent = config.desc || '';
                    popupModal.classList.add('active');
                }
            } catch(e) {}
        }

        function applyMaintenanceConfig() {
            var raw = SafeStorage.getItem('site_maint_config');
            if (!raw) return;
            try {
                var config = JSON.parse(raw);
                var maintScreen = document.getElementById('maintenance-screen');
                var isAdmin = SafeStorage.getItem('portfolio_admin_logged_in') === 'true';

                if (config.active && !isAdmin && maintScreen) {
                    var titleEl = document.getElementById('maint-view-title');
                    var periodEl = document.getElementById('maint-view-period');
                    var descEl = document.getElementById('maint-view-desc');

                    if (titleEl) titleEl.textContent = config.title || '서비스 점검 중입니다';
                    if (periodEl) periodEl.textContent = '점검 시간: ' + (config.period || '시간 미정');
                    if (descEl) descEl.textContent = config.desc || '';
                    maintScreen.style.display = 'flex';
                } else if (maintScreen) {
                    maintScreen.style.display = 'none';
                }
            } catch(e) {}
        }

        var mainPopupCloseBtn = document.getElementById('main-popup-close-btn');
        if (mainPopupCloseBtn) {
            mainPopupCloseBtn.addEventListener('click', function() {
                var popupModal = document.getElementById('main-popup-modal');
                var hideTodayChk = document.getElementById('popup-hide-today');
                
                if (hideTodayChk && hideTodayChk.checked) {
                    var tomorrow = new Date().getTime() + (24 * 60 * 60 * 1000);
                    localStorage.setItem('popup_hide_until', tomorrow);
                }
                if (popupModal) popupModal.classList.remove('active');
            });
        }

        var maintAdminBtn = document.getElementById('maint-admin-login-btn');
        if (maintAdminBtn) {
            maintAdminBtn.addEventListener('click', openAdminModal);
        }

        checkAdminStatus();
    });
})();