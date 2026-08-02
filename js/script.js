document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. 언어 전환 (i18n) 시스템 및 타이핑 효과 엔진
    // ==========================================================================
    const translations = {
        ko: {
            nav: {
                home: "Home",
                portfolio: "포트폴리오",
                skills: "Skills",
                about: "소개",
                testimonials: "추천사",
                contact: "Contact Me",
                faq: "FAQ",
                login: "로그인",
                signup: "회원가입",
                logout: "로그아웃",
                userSuffix: "님"
            },
            testimonials: {
                title: "💬 Client Testimonials",
                subtitle: "함께 진행했던 파트너 및 클라이언트분들의 소중한 협업 후기입니다."
            },
            portfolio: {
                sectionTitle: "🎥 Portfolio",
                sectionSubtitle: "기획부터 편집, 모션 그래픽까지 완성도 높은 시각 예술 컬렉션입니다.",
                filterAll: "전체",
                filterVideo: "영상",
                filterAd: "광고",
                filter3d: "3D",
                filterPoster: "포스터",
                filterContest: "타이틀시퀀스",
                searchPlaceholder: "작품명 또는 키워드 검색..."
            },
            auth: {
                loginTab: "로그인",
                signupTab: "회원가입",
                emailLabel: "이메일 주소",
                passwordLabel: "비밀번호",
                confirmPasswordLabel: "비밀번호 확인",
                nameLabel: "이름 (닉네임)",
                rememberMe: "로그인 상태 유지",
                forgotPassword: "비밀번호 찾기?",
                loginSubmit: "로그인",
                signupSubmit: "회원가입 완료",
                agreeTerms: "이용약관 및 개인정보 처리방침 동의",
                socialDivider: "소셜 계정 간편 로그인",
                welcomeMsg: "환영합니다! 성공적으로 로그인되었습니다.",
                signupSuccessMsg: "회원가입이 완료되었습니다! 환영합니다.",
                logoutMsg: "성공적으로 로그아웃되었습니다."
            }
        },
        en: {
            nav: {
                home: "Home",
                portfolio: "Portfolio",
                skills: "Skills",
                about: "About",
                testimonials: "Testimonials",
                contact: "Contact Me",
                faq: "FAQ",
                login: "Log In",
                signup: "Sign Up",
                logout: "Log Out",
                userSuffix: ""
            },
            testimonials: {
                title: "💬 Client Testimonials",
                subtitle: "Heartfelt collaboration feedback from clients and partners."
            },
            portfolio: {
                sectionTitle: "🎥 Portfolio",
                sectionSubtitle: "High-quality visual arts collection from planning to editing and motion graphics.",
                filterAll: "All",
                filterVideo: "Video",
                filterAd: "Commercial",
                filter3d: "3D",
                filterPoster: "Poster",
                filterContest: "Title Sequence",
                searchPlaceholder: "Search project title or tag..."
            },
            auth: {
                loginTab: "Log In",
                signupTab: "Sign Up",
                emailLabel: "Email Address",
                passwordLabel: "Password",
                confirmPasswordLabel: "Confirm Password",
                nameLabel: "Full Name",
                rememberMe: "Remember Me",
                forgotPassword: "Forgot Password?",
                loginSubmit: "Log In",
                signupSubmit: "Complete Sign Up",
                agreeTerms: "Agree to Terms & Privacy Policy",
                socialDivider: "Easy Social Login",
                welcomeMsg: "Welcome back! You have successfully logged in.",
                signupSuccessMsg: "Sign up complete! Welcome aboard.",
                logoutMsg: "You have been logged out."
            }
        }
    };

    let currentLang = localStorage.getItem('preferred_lang') || 'ko';

    const typingTarget = document.querySelector('.typing-text');
    let textArray = currentLang === 'en' 
        ? ["Weonbog Jeong, crafting stories.", "Weonbog Jeong, editing value.", "Weonbog Jeong, directing trends."]
        : ["이야기를 담아내는 정원복입니다.", "가치를 편집하는 정원복입니다.", "트렌드를 연출하는 정원복입니다."];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 120;
    let typingTimer = null;

    function typeEffect() {
        if (!typingTarget) return;
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

        typingTimer = setTimeout(typeEffect, typingSpeed);
    }
    if (typingTarget) {
        typingTimer = setTimeout(typeEffect, 600);
    }

    const applyLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('preferred_lang', lang);
        document.documentElement.lang = lang;

        const langLabel = document.getElementById('lang-label');
        if (langLabel) {
            langLabel.textContent = lang === 'ko' ? 'EN' : 'KO';
        }

        // data-i18n 요소 텍스트 갱신
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const keys = key.split('.');
            let value = translations[lang];
            keys.forEach(k => {
                if (value) value = value[k];
            });
            if (value !== undefined) {
                el.textContent = value;
            }
        });

        // data-i18n-placeholder 요소 플레이스홀더 갱신
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const keys = key.split('.');
            let value = translations[lang];
            keys.forEach(k => {
                if (value) value = value[k];
            });
            if (value !== undefined) {
                el.placeholder = value;
            }
        });

        // 타이핑 텍스트 갱신
        textArray = lang === 'en' 
            ? ["Weonbog Jeong, crafting stories.", "Weonbog Jeong, editing value.", "Weonbog Jeong, directing trends."]
            : ["이야기를 담아내는 정원복입니다.", "가치를 편집하는 정원복입니다.", "트렌드를 연출하는 정원복입니다."];
        textIndex = 0;
        charIndex = 0;
        isDeleting = false;
        if (typingTarget) typingTarget.innerHTML = '';
    };

    const langToggleBtn = document.getElementById('lang-toggle-btn');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const newLang = currentLang === 'ko' ? 'en' : 'ko';
            applyLanguage(newLang);
            showToast(newLang === 'en' ? 'Switched to English' : '한국어로 전환되었습니다.', 'info');
        });
    }

    // 초기 언어 설정 적용
    applyLanguage(currentLang);

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
    // 3. 포트폴리오 필터링 및 라이브 검색 기능 (리디자인 버전)
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.portfolio-filter-bar .filter-btn');
    const searchInput = document.getElementById('portfolio-search');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const noResultsMessage = document.getElementById('no-results');
    const visibleItemCountEl = document.getElementById('visible-item-count');

    if (portfolioItems.length > 0) {
        let currentFilter = 'all';

        // 카테고리별 수량 배지 동적 업데이트
        const updateCategoryCounts = () => {
            const counts = { all: portfolioItems.length };
            portfolioItems.forEach(item => {
                const cat = item.dataset.category;
                if (cat) {
                    counts[cat] = (counts[cat] || 0) + 1;
                }
            });

            filterButtons.forEach(btn => {
                const f = btn.dataset.filter;
                const badge = btn.querySelector('.filter-badge');
                if (badge) {
                    badge.textContent = counts[f] !== undefined ? counts[f] : 0;
                }
            });
        };

        const updatePortfolio = () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            let visibleCount = 0;
            let matchIndex = 0;

            // 검색어 지우기 버튼 노출 처리
            if (searchClearBtn) {
                if (searchTerm.length > 0) {
                    searchClearBtn.classList.add('visible');
                } else {
                    searchClearBtn.classList.remove('visible');
                }
            }

            portfolioItems.forEach(item => {
                const category = item.dataset.category;
                const keywords = item.dataset.keywords ? item.dataset.keywords.toLowerCase() : '';
                const h3Element = item.querySelector('h3');
                const title = h3Element ? h3Element.textContent.toLowerCase() : '';

                const isCategoryMatch = (currentFilter === 'all' || category === currentFilter);
                const isSearchMatch = (searchTerm === '' || title.includes(searchTerm) || keywords.includes(searchTerm));

                if (isCategoryMatch && isSearchMatch) {
                    item.style.display = 'block';
                    item.style.transitionDelay = `${(matchIndex % 3) * 0.1}s`;
                    matchIndex++;
                    setTimeout(() => item.classList.add('show'), 30);
                    visibleCount++;
                } else {
                    item.classList.remove('show');
                    item.style.display = 'none';
                }
            });

            // 결과 건수 텍스트 갱신
            if (visibleItemCountEl) {
                visibleItemCountEl.textContent = visibleCount;
            }

            if (noResultsMessage) {
                noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        };

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                currentFilter = button.dataset.filter;
                updatePortfolio();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', updatePortfolio);
        }

        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
                updatePortfolio();
            });
        }

        updateCategoryCounts();
        updatePortfolio();
    }

    // ==========================================================================
    // 4. 스크롤 반응형 애니메이션 통합 모듈 (포트폴리오 & 스킬 카드)
    // ==========================================================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const generalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 포트폴리오 카드 페이드인 & 슬라이드 진입 처리
                if (entry.target.classList.contains('portfolio-item')) {
                    entry.target.classList.add('show');
                    generalObserver.unobserve(entry.target);
                }
                // 스킬 카드 등장 모션 & 네온 게이지 바 동적 인디케이팅
                if (entry.target.classList.contains('skill-card-v')) {
                    entry.target.classList.add('show');
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

    // 포트폴리오 아이템 관찰자 및 순차 지연 등록
    portfolioItems.forEach((item, index) => {
        item.style.transitionDelay = `${(index % 3) * 0.1}s`;
        generalObserver.observe(item);
    });

    // 스킬 카드 요소들 관찰자 및 순차 지연 등록
    const skillCards = document.querySelectorAll('.skill-card-v');
    skillCards.forEach((card, index) => {
        card.style.transitionDelay = `${(index % 3) * 0.1}s`;
        generalObserver.observe(card);
    });

    // ==========================================================================
    // 5. 회사소개서 온라인 미리보기 모달 및 인쇄 제어
    // ==========================================================================
    const profileModal = document.getElementById('profile-modal');
    const openModalBtn = document.getElementById('btn-open-profile-modal');
    const closeModalBtn = document.getElementById('btn-close-profile-modal');
    const printDocBtn = document.getElementById('btn-print-doc');

    if (profileModal && openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            profileModal.classList.add('active');
            profileModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            profileModal.classList.remove('active');
            profileModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && profileModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    if (printDocBtn) {
        printDocBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // ==========================================================================
    // 6. FAQ 아코디언 토글 인터랙션
    // ==========================================================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');

            // 필요시 다른 아코디언 항목을 닫으려면 활성화 (Accordion behavior)
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    const btn = item.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                }
            });

            // 현재 아코디언 항목 토글
            if (isActive) {
                faqItem.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            } else {
                faqItem.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ==========================================================================
    // 7. 토스트 알림 메시지 유틸리티
    // ==========================================================================
    function showToast(message, type = 'success') {
        const container = document.getElementById('auth-toast');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `auth-toast-item ${type}`;
        const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
        toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;

        container.appendChild(toast);

        // 애니메이션 트리거
        setTimeout(() => toast.classList.add('show'), 10);

        // 3초 후 자동 소멸
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // ==========================================================================
    // 8. 로그인 & 회원가입 팝업 모달 및 세션 관리
    // ==========================================================================
    const authModal = document.getElementById('auth-modal');
    const btnOpenLogin = document.getElementById('btn-open-login');
    const btnOpenSignup = document.getElementById('btn-open-signup');
    const btnCloseAuthModal = document.getElementById('btn-close-auth-modal');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const formLogin = document.getElementById('form-login');
    const formSignup = document.getElementById('form-signup');
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const userNameDisplay = document.getElementById('user-name-display');
    const btnLogout = document.getElementById('btn-logout');

    const switchAuthTab = (targetTab) => {
        if (targetTab === 'login') {
            tabLogin.classList.add('active');
            tabSignup.classList.remove('active');
            formLogin.classList.add('active');
            formSignup.classList.remove('active');
        } else {
            tabSignup.classList.add('active');
            tabLogin.classList.remove('active');
            formSignup.classList.add('active');
            formLogin.classList.remove('active');
        }
    };

    const openAuthModal = (defaultTab = 'login') => {
        if (!authModal) return;
        switchAuthTab(defaultTab);
        authModal.classList.add('active');
        authModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeAuthModal = () => {
        if (!authModal) return;
        authModal.classList.remove('active');
        authModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (btnOpenLogin) btnOpenLogin.addEventListener('click', () => openAuthModal('login'));
    if (btnOpenSignup) btnOpenSignup.addEventListener('click', () => openAuthModal('signup'));
    if (btnCloseAuthModal) btnCloseAuthModal.addEventListener('click', closeAuthModal);

    if (tabLogin) tabLogin.addEventListener('click', () => switchAuthTab('login'));
    if (tabSignup) tabSignup.addEventListener('click', () => switchAuthTab('signup'));

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) closeAuthModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && authModal.classList.contains('active')) closeAuthModal();
        });
    }

    // 사용자 로그인 상태 갱신 함수
    const updateAuthState = (user) => {
        if (user) {
            if (loggedOutView) loggedOutView.style.display = 'none';
            if (loggedInView) loggedInView.style.display = 'flex';
            if (userNameDisplay) userNameDisplay.textContent = user.name || '사용자';
        } else {
            if (loggedOutView) loggedOutView.style.display = 'flex';
            if (loggedInView) loggedInView.style.display = 'none';
        }
    };

    // 초기 사용자 세션 확인
    const savedUser = JSON.parse(localStorage.getItem('auth_user') || 'null');
    updateAuthState(savedUser);

    // 로그인 폼 제출 처리
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('login-email');
            const email = emailInput ? emailInput.value.trim() : '';
            const defaultName = email ? email.split('@')[0] : '회원';
            
            const userObj = { name: defaultName, email: email };
            localStorage.setItem('auth_user', JSON.stringify(userObj));
            updateAuthState(userObj);
            closeAuthModal();

            const msg = currentLang === 'en' ? translations.en.auth.welcomeMsg : translations.ko.auth.welcomeMsg;
            showToast(msg, 'success');
        });
    }

    // 회원가입 폼 제출 처리
    if (formSignup) {
        formSignup.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('signup-name');
            const emailInput = document.getElementById('signup-email');
            const passInput = document.getElementById('signup-password');
            const confirmInput = document.getElementById('signup-confirm');

            const name = nameInput ? nameInput.value.trim() : '회원';
            const email = emailInput ? emailInput.value.trim() : '';
            const password = passInput ? passInput.value : '';
            const confirm = confirmInput ? confirmInput.value : '';

            if (password !== confirm) {
                alert(currentLang === 'en' ? 'Passwords do not match.' : '비밀번호가 일치하지 않습니다.');
                return;
            }

            const userObj = { name: name, email: email };
            localStorage.setItem('auth_user', JSON.stringify(userObj));
            updateAuthState(userObj);
            closeAuthModal();

            const msg = currentLang === 'en' ? translations.en.auth.signupSuccessMsg : translations.ko.auth.signupSuccessMsg;
            showToast(msg, 'success');
        });
    }

    // 소셜 로그인 간편 시뮬레이션
    const btnSocialGoogle = document.getElementById('btn-social-google');
    const btnSocialKakao = document.getElementById('btn-social-kakao');

    const handleSocialLogin = (provider) => {
        const userObj = { name: `${provider} User`, email: `user@${provider.toLowerCase()}.com` };
        localStorage.setItem('auth_user', JSON.stringify(userObj));
        updateAuthState(userObj);
        closeAuthModal();
        showToast(`${provider} ${currentLang === 'en' ? 'login successful!' : '계정으로 로그인되었습니다.'}`, 'success');
    };

    if (btnSocialGoogle) btnSocialGoogle.addEventListener('click', () => handleSocialLogin('Google'));
    if (btnSocialKakao) btnSocialKakao.addEventListener('click', () => handleSocialLogin('Kakao'));

    // 로그아웃 처리
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('auth_user');
            updateAuthState(null);
            const msg = currentLang === 'en' ? translations.en.auth.logoutMsg : translations.ko.auth.logoutMsg;
            showToast(msg, 'info');
        });
    }

    // ==========================================================================
    // 9. 클라이언트 추천사 (Testimonials) 캐러셀 슬라이더 엔진
    // ==========================================================================
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const btnTestimonialPrev = document.getElementById('testimonial-prev');
    const btnTestimonialNext = document.getElementById('testimonial-next');
    const testimonialDotsContainer = document.getElementById('testimonial-dots');
    const sliderContainer = document.getElementById('testimonial-slider-container');

    if (testimonialTrack && testimonialCards.length > 0) {
        let currentSlideIndex = 0;
        let autoPlayTimer = null;
        let touchStartX = 0;
        let touchEndX = 0;

        const getCardsPerView = () => window.innerWidth >= 850 ? 2 : 1;

        const getMaxIndex = () => {
            const perView = getCardsPerView();
            return Math.max(0, testimonialCards.length - perView);
        };

        const renderDots = () => {
            if (!testimonialDotsContainer) return;
            testimonialDotsContainer.innerHTML = '';
            const totalDots = getMaxIndex() + 1;

            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = `dot ${i === currentSlideIndex ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentSlideIndex = i;
                    updateCarousel();
                    resetAutoPlay();
                });
                testimonialDotsContainer.appendChild(dot);
            }
        };

        const updateCarousel = () => {
            const maxIdx = getMaxIndex();
            if (currentSlideIndex > maxIdx) currentSlideIndex = maxIdx;
            if (currentSlideIndex < 0) currentSlideIndex = 0;

            const firstCard = testimonialCards[0];
            if (!firstCard) return;

            const cardWidth = firstCard.offsetWidth;
            const gap = 24; // CSS track gap
            const translateX = currentSlideIndex * (cardWidth + gap);

            testimonialTrack.style.transform = `translateX(-${translateX}px)`;

            // 인디케이터 활성화 갱신
            if (testimonialDotsContainer) {
                const dots = testimonialDotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, idx) => {
                    if (idx === currentSlideIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        };

        const nextSlide = () => {
            const maxIdx = getMaxIndex();
            if (currentSlideIndex < maxIdx) {
                currentSlideIndex++;
            } else {
                currentSlideIndex = 0;
            }
            updateCarousel();
        };

        const prevSlide = () => {
            const maxIdx = getMaxIndex();
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
            } else {
                currentSlideIndex = maxIdx;
            }
            updateCarousel();
        };

        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayTimer = setInterval(nextSlide, 4500);
        };

        const stopAutoPlay = () => {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
        };

        const resetAutoPlay = () => {
            stopAutoPlay();
            startAutoPlay();
        };

        if (btnTestimonialPrev) {
            btnTestimonialPrev.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }

        if (btnTestimonialNext) {
            btnTestimonialNext.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
        }

        // 마우스 호버 시 자동 재생 일시정지 / 탈출 시 재개
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoPlay);
            sliderContainer.addEventListener('mouseleave', startAutoPlay);

            // 터치 스와이프 제스처 핸들링
            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoPlay();
            }, { passive: true });

            sliderContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoPlay();
            }, { passive: true });
        }

        const handleSwipe = () => {
            const swipeThreshold = 35;
            if (touchStartX - touchEndX > swipeThreshold) {
                nextSlide();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                prevSlide();
            }
        };

        // 초기화 실행
        renderDots();
        updateCarousel();
        startAutoPlay();

        // 창 크기 변경 시 레이아웃 재계산
        window.addEventListener('resize', () => {
            renderDots();
            updateCarousel();
        });
    }

    // ==========================================================================
    // 10. 라이트/다크 테마 토글 (Theme Switcher System)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');

    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun';
            }
            if (themeToggleBtn) {
                themeToggleBtn.setAttribute('title', '다크 모드로 전환 / Switch to Dark Mode');
                themeToggleBtn.setAttribute('aria-label', '다크 모드로 전환');
            }
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) {
                themeIcon.className = 'fas fa-moon';
            }
            if (themeToggleBtn) {
                themeToggleBtn.setAttribute('title', '라이트 모드로 전환 / Switch to Light Mode');
                themeToggleBtn.setAttribute('aria-label', '라이트 모드로 전환');
            }
        }
    };

    // 저장된 테마 또는 시스템 기본 설정 확인
    const savedTheme = localStorage.getItem('portfolio_theme');
    const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');

    applyTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('portfolio_theme', newTheme);
            applyTheme(newTheme);
            if (typeof showToast === 'function') {
                showToast(newTheme === 'light' ? '☀️ 라이트 모드로 전환되었습니다.' : '🌙 다크 모드로 전환되었습니다.', 'info');
            }
        });
    }
});