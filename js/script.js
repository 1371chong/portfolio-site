document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. 인트로 글씨 타이핑 효과 엔진
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
    // 4. 스크롤 반응형 애니메이션 통합 모듈
    // ==========================================================================
    const observerOptions = {
        threshold: 0.1
    };

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

    portfolioItems.forEach(item => {
        generalObserver.observe(item);
    });

    const skillCards = document.querySelectorAll('.skill-card-v');
    skillCards.forEach(card => {
        generalObserver.observe(card);
    });

    // ==========================================================================
    // 5. FAQ 아코디언 토글 제어 엔진
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ==========================================================================
    // 6. 프로젝트 상세보기 모달(Modal Popup) 제어 엔진
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
        const triggerBtn = e.target.closest('.open-modal') || e.target.closest('.portfolio-thumb');
        if (triggerBtn) {
            const item = triggerBtn.closest('.portfolio-item');
            if (!item) return;

            const data = item.dataset;
            modalTitle.textContent = data.title || item.querySelector('h3').textContent;
            modalCategory.textContent = data.tag || '#포트폴리오';
            modalDesc.textContent = data.desc || '작품 상세 설명이 없습니다.';
            modalDate.textContent = data.date || '-';
            modalTools.textContent = data.tools || '-';
            modalContribution.textContent = data.contribution || '-';
            modalLink.href = data.link || '#';

            if (data.video) {
                modalIframe.src = data.video.includes('autoplay') ? data.video : `${data.video}?autoplay=1`;
                modalIframe.style.display = 'block';
                modalImg.style.display = 'none';
            } else if (data.img) {
                modalImg.src = data.img;
                modalImg.style.display = 'block';
                modalIframe.style.display = 'none';
                modalIframe.src = '';
            } else {
                modalIframe.style.display = 'none';
                modalImg.style.display = 'none';
                modalIframe.src = '';
            }

            modalOverlay.classList.add('active');
            modalOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    });

    const closeModal = () => {
        if (!modalOverlay.classList.contains('active')) return;
        
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            modalIframe.src = '';
        }, 300);
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ==========================================================================
    // 7. 네비게이션 액티브 메뉴 (스크롤 스파이) 제어 엔진
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a');

    const scrollSpyOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');
                    if (href === activeId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });

    // ==========================================================================
    // 8. 화살표 커스텀 마우스 포인터 모듈
    // ==========================================================================
    const cursorArrow = document.querySelector('.custom-cursor-arrow');

    if (cursorArrow && window.innerWidth > 991) {
        let mouseX = 0;
        let mouseY = 0;
        let arrowX = 0;
        let arrowY = 0;

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
                target.addEventListener('mouseenter', () => {
                    document.body.classList.add('hovered');
                });
                target.addEventListener('mouseleave', () => {
                    document.body.classList.remove('hovered');
                });
            });
        };
        attachHoverEvent();
    }

    // ==========================================================================
    // 9. 공지사항 작성/수정/삭제 및 카테고리 분할 통합 모듈
    // ==========================================================================
    const ADMIN_PASSWORD = "1234"; // 🔑 관리자 비밀번호
    
    const adminAuthBtn = document.getElementById('admin-auth-btn');
    const noticeForm = document.getElementById('notice-form');
    const noticeListContainer = document.getElementById('notice-list');
    const noticeTabBtns = document.querySelectorAll('.notice-tab-btn');

    let currentNoticeTab = 'all';

    // 관리자 로그인 상태 확인 함수
    function checkAdminStatus() {
        const isAdmin = sessionStorage.getItem('portfolio_admin_logged_in') === 'true';
        if (isAdmin) {
            document.body.classList.add('admin-mode');
            if (adminAuthBtn) {
                adminAuthBtn.classList.add('logged-in');
                adminAuthBtn.innerHTML = '<i class="fas fa-unlock"></i> 관리자 로그아웃';
            }
        } else {
            document.body.classList.remove('admin-mode');
            if (adminAuthBtn) {
                adminAuthBtn.classList.remove('logged-in');
                adminAuthBtn.innerHTML = '<i class="fas fa-lock"></i> 관리자 로그인';
            }
        }
        renderNotices();
    }

    // 관리자 로그인 토글
    if (adminAuthBtn) {
        adminAuthBtn.addEventListener('click', () => {
            const isAdmin = sessionStorage.getItem('portfolio_admin_logged_in') === 'true';

            if (isAdmin) {
                sessionStorage.removeItem('portfolio_admin_logged_in');
                alert('관리자 모드에서 로그아웃 되었습니다.');
                checkAdminStatus();
            } else {
                const inputPw = prompt('관리자 비밀번호를 입력하세요:');
                if (inputPw === ADMIN_PASSWORD) {
                    sessionStorage.setItem('portfolio_admin_logged_in', 'true');
                    alert('관리자로 인증되었습니다.');
                    checkAdminStatus();
                } else if (inputPw !== null) {
                    alert('비밀번호가 올바르지 않습니다.');
                }
            }
        });
    }

    // 초기 기본 데이터
    const defaultNotices = [
        {
            id: 1,
            type: 'update',
            typeName: '업데이트',
            author: '정원복',
            title: '포트폴리오 사이트 리뉴얼 및 신규 작품 업데이트 안내',
            desc: '시네마틱 디자인 및 인터랙션 커스텀 포인터 기능이 새롭게 업데이트되었습니다. 최신 모션그래픽 비디오 및 상세 작업 내역을 포트폴리오 메뉴에서 확인해 보세요.',
            date: '2026.04.15'
        },
        {
            id: 2,
            type: 'secondary',
            typeName: '일정',
            author: '정원복',
            title: '외주 및 프로젝트 제작 예약 일정 관련 안내',
            desc: '신규 프로젝트 진행 시 100% 예약제로 진행되고 있습니다. 희망하시는 납품 일정보다 최소 2~3주 전 미리 문의해 주시면 신속한 기획 협의가 가능합니다.',
            date: '2026.03.01'
        },
        {
            id: 3,
            type: 'info',
            typeName: '안내',
            author: '정원복',
            title: '상업용 라이선스 에셋 및 저작권 준수 정책',
            desc: '제작에 활용되는 모든 BGM, 폰트, SFX 효과음 및 3D 그래픽 소스는 상업적 사용 라이선스가 완전 확보된 에셋만을 사용하여 안전한 커머셜 영상을 보장해 드립니다.',
            date: '2026.01.20'
        }
    ];

    let storedNotices = JSON.parse(localStorage.getItem('portfolio_notices'));
    if (!storedNotices || storedNotices.length === 0) {
        storedNotices = defaultNotices;
        localStorage.setItem('portfolio_notices', JSON.stringify(storedNotices));
    }

    // 공지사항 렌더링 함수 (수정 폼 기능 지원)
    function renderNotices() {
        if (!noticeListContainer) return;
        noticeListContainer.innerHTML = '';

        const isAdmin = sessionStorage.getItem('portfolio_admin_logged_in') === 'true';

        const filteredNotices = storedNotices.filter(item => {
            return currentNoticeTab === 'all' || item.type === currentNoticeTab;
        });

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

            const authorName = notice.author || '정원복';

            card.innerHTML = `
                <div class="notice-header">
                    <div class="notice-header-left">
                        <span class="notice-badge ${badgeClass}">${notice.typeName}</span>
                        <span class="notice-author"><i class="fas fa-user-circle"></i> ${authorName}</span>
                        <span class="notice-date">${notice.date}</span>
                    </div>
                    ${adminActionsHtml}
                </div>
                <h3 class="notice-title">${notice.title}</h3>
                <p class="notice-desc">${notice.desc}</p>
            `;

            noticeListContainer.appendChild(card);
        });

        if (isAdmin) {
            // 삭제 기능
            document.querySelectorAll('.notice-delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetId = parseInt(e.currentTarget.dataset.id);
                    if (confirm('이 공지사항을 삭제하시겠습니까?')) {
                        storedNotices = storedNotices.filter(item => item.id !== targetId);
                        localStorage.setItem('portfolio_notices', JSON.stringify(storedNotices));
                        renderNotices();
                    }
                });
            });

            // 수정(인라인 편집) 기능
            document.querySelectorAll('.notice-edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetId = parseInt(e.currentTarget.dataset.id);
                    const noticeObj = storedNotices.find(item => item.id === targetId);
                    if (!noticeObj) return;

                    const cardElement = document.querySelector(`.notice-card[data-id="${targetId}"]`);
                    if (!cardElement) return;

                    // 해당 카드를 인라인 수정 폼으로 변경
                    cardElement.innerHTML = `
                        <div class="notice-edit-box">
                            <div class="notice-input-row" style="margin-bottom:0;">
                                <select class="edit-type">
                                    <option value="primary" ${noticeObj.type === 'primary' ? 'selected' : ''}>공지</option>
                                    <option value="secondary" ${noticeObj.type === 'secondary' ? 'selected' : ''}>일정</option>
                                    <option value="info" ${noticeObj.type === 'info' ? 'selected' : ''}>안내</option>
                                    <option value="update" ${noticeObj.type === 'update' ? 'selected' : ''}>업데이트</option>
                                </select>
                                <input type="text" class="edit-author" value="${noticeObj.author || '정원복'}" placeholder="작성자" style="max-width:140px;">
                                <input type="text" class="edit-title" value="${noticeObj.title}" placeholder="제목">
                            </div>
                            <textarea class="edit-desc" rows="3" placeholder="내용">${noticeObj.desc}</textarea>
                            <div class="notice-edit-actions">
                                <button class="btn-success save-edit-btn" data-id="${targetId}"><i class="fas fa-check"></i> 저장</button>
                                <button class="btn-cancel cancel-edit-btn"><i class="fas fa-times"></i> 취소</button>
                            </div>
                        </div>
                    `;

                    // 저장 처리
                    cardElement.querySelector('.save-edit-btn').addEventListener('click', () => {
                        const newType = cardElement.querySelector('.edit-type').value;
                        const newTypeName = cardElement.querySelector('.edit-type').options[cardElement.querySelector('.edit-type').selectedIndex].text;
                        const newAuthor = cardElement.querySelector('.edit-author').value.trim() || '정원복';
                        const newTitle = cardElement.querySelector('.edit-title').value.trim();
                        const newDesc = cardElement.querySelector('.edit-desc').value.trim();

                        if (!newTitle || !newDesc) {
                            alert('제목과 내용을 모두 입력해주세요.');
                            return;
                        }

                        noticeObj.type = newType;
                        noticeObj.typeName = newTypeName;
                        noticeObj.author = newAuthor;
                        noticeObj.title = newTitle;
                        noticeObj.desc = newDesc;

                        localStorage.setItem('portfolio_notices', JSON.stringify(storedNotices));
                        renderNotices();
                        alert('공지사항이 수정되었습니다.');
                    });

                    // 취소 처리
                    cardElement.querySelector('.cancel-edit-btn').addEventListener('click', () => {
                        renderNotices();
                    });
                });
            });
        }
    }

    // 카테고리 탭 클릭
    noticeTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            noticeTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentNoticeTab = btn.dataset.category;
            renderNotices();
        });
    });

    // 새 글 등록
    if (noticeForm) {
        noticeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isAdmin = sessionStorage.getItem('portfolio_admin_logged_in') === 'true';
            if (!isAdmin) {
                alert('공지사항 작성은 관리자 권한이 필요합니다.');
                return;
            }

            const typeSelect = document.getElementById('notice-type');
            const authorInput = document.getElementById('notice-author-input');
            const titleInput = document.getElementById('notice-title-input');
            const descInput = document.getElementById('notice-desc-input');

            const selectedOption = typeSelect.options[typeSelect.selectedIndex];
            
            const today = new Date();
            const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

            const newNotice = {
                id: Date.now(),
                type: typeSelect.value,
                typeName: selectedOption.text,
                author: authorInput.value.trim() || '정원복',
                title: titleInput.value.trim(),
                desc: descInput.value.trim(),
                date: dateStr
            };

            storedNotices.unshift(newNotice);
            localStorage.setItem('portfolio_notices', JSON.stringify(storedNotices));
            
            titleInput.value = '';
            descInput.value = '';

            renderNotices();
            alert('새 공지사항이 정상적으로 등록되었습니다!');
        });
    }

    checkAdminStatus();
});