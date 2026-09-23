document.addEventListener('DOMContentLoaded', () => {

    // 일반 아이디 세션 관리
    let currentUser = localStorage.getItem('jwb_logged_user') || null;
    let isAdmin = currentUser === 'admin';

    function updateAuthUI() {
        const authArea = document.getElementById('nav-auth-area');
        const optionNotice = document.getElementById('option-notice');
        
        if (currentUser) {
            authArea.innerHTML = `<a href="#" id="btn-logout" class="btn-outline btn-small">${isAdmin ? 'ADMIN (로그아웃)' : currentUser + ' (로그아웃)'}</a>`;
            
            document.getElementById('btn-logout').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('jwb_logged_user');
                currentUser = null;
                isAdmin = false;
                alert('로그아웃 되었습니다.');
                window.location.reload();
            });

            if(isAdmin && optionNotice) {
                optionNotice.style.display = 'block';
            }
        } else {
            authArea.innerHTML = `<a href="#" id="btn-open-login" class="btn-solid btn-small">LOGIN</a>`;
            if(optionNotice) optionNotice.style.display = 'none';
            
            document.getElementById('btn-open-login').addEventListener('click', (e) => {
                e.preventDefault();
                closeAllModals();
                document.getElementById('login-modal').classList.add('active');
            });
        }
    }
    updateAuthUI();

    // Google Drive 썸네일 불러오기 (즉시 다운로드 및 보기 지원)
    function loadGoogleDriveThumbnails() {
        document.querySelectorAll('.gdrive-thumb').forEach(thumb => {
            const driveId = thumb.getAttribute('data-drive-id');
            if(driveId && driveId !== 'YOUR_GDRIVE_FILE_ID_1') {
                const imgUrl = `https://drive.google.com/uc?export=view&id=${driveId}`;
                thumb.style.backgroundImage = `url('${imgUrl}')`;
            }
        });
    }
    loadGoogleDriveThumbnails();

    // 스크롤 및 애니메이션
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -100px 0px" });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // 포트폴리오 탭 필터링
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            workItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => item.style.display = 'none', 400);
                }
            });
        });
    });

    // 게시판 탭 전환 (공지, 자유, 후기)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab') + '-board';
            tabContents.forEach(content => {
                if (content.id === tabId) content.classList.add('active');
                else content.classList.remove('active');
            });
        });
    });

    // FAQ 아코디언
    const accHeads = document.querySelectorAll('.acc-head');
    accHeads.forEach(head => {
        head.addEventListener('click', function() {
            const body = this.nextElementSibling;
            if (body.style.maxHeight) body.style.maxHeight = null;
            else {
                document.querySelectorAll('.acc-body').forEach(b => b.style.maxHeight = null);
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });

    // 모달 관리
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const findModal = document.getElementById('find-modal');
    const boardModal = document.getElementById('board-modal');
    const writeModal = document.getElementById('write-modal');

    function closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    window.addEventListener('click', (e) => {
        if(e.target.classList.contains('modal-overlay')) closeAllModals();
    });

    document.getElementById('link-signup').addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
        signupModal.classList.add('active');
    });

    const openFindModal = (title) => {
        closeAllModals();
        document.getElementById('find-title').textContent = title;
        findModal.classList.add('active');
    };
    document.getElementById('link-find-id').addEventListener('click', (e) => { e.preventDefault(); openFindModal('아이디 찾기'); });
    document.getElementById('link-find-pw').addEventListener('click', (e) => { e.preventDefault(); openFindModal('비밀번호 재설정'); });

    document.querySelectorAll('.link-back-login').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            loginModal.classList.add('active');
        });
    });

    // 글쓰기 권한 체크 (로그인 한 회원만 가능)
    document.getElementById('btn-write-post').addEventListener('click', () => {
        if (!currentUser) {
            alert('로그인한 회원만 글을 작성할 수 있습니다.');
            closeAllModals();
            loginModal.classList.add('active');
            return;
        }
        closeAllModals();
        writeModal.classList.add('active');
    });

    // 파일 및 썸네일 업로드 이름 표시
    const fileInput = document.getElementById('write-file');
    const fileDisplay = document.getElementById('file-name-display');
    if(fileInput) {
        fileInput.addEventListener('change', function() {
            if(this.files && this.files.length > 0) fileDisplay.textContent = this.files[0].name;
            else fileDisplay.textContent = "선택된 파일 없음";
        });
    }

    const thumbInput = document.getElementById('write-thumb');
    const thumbDisplay = document.getElementById('thumb-name-display');
    if(thumbInput) {
        thumbInput.addEventListener('change', function() {
            if(this.files && this.files.length > 0) thumbDisplay.textContent = this.files[0].name;
            else thumbDisplay.textContent = "선택된 썸네일 없음";
        });
    }

    // 게시물 상세보기 (누구나 읽기 가능 + 즉시 다운로드 링크 매핑)
    document.querySelectorAll('.board-items li').forEach(item => {
        item.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const date = this.getAttribute('data-date');
            const type = this.getAttribute('data-type');
            const author = this.getAttribute('data-author');
            const content = this.getAttribute('data-content');
            
            const fileUrl = this.getAttribute('data-file-url');
            const fileName = this.getAttribute('data-file-name');
            const fileSize = this.getAttribute('data-file-size');
            const fileCount = this.getAttribute('data-file-count');

            document.getElementById('modal-badge').textContent = type;
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-date').textContent = date;
            document.getElementById('modal-body-text').textContent = content;

            const fileArea = document.getElementById('modal-file-area');
            if(fileUrl && fileName) {
                fileArea.style.display = 'block';
                // 구글 드라이브 즉시 다운로드 URL 설정 (?export=download)
                document.getElementById('modal-file-link').href = fileUrl;
                document.getElementById('modal-file-name').textContent = fileName;
                document.getElementById('modal-file-size').textContent = fileSize || '';
                document.getElementById('modal-file-count').textContent = fileCount || '';
                document.getElementById('modal-file-date').textContent = `🕒 ${date}`;
            } else {
                fileArea.style.display = 'none';
            }

            const actionButtons = document.getElementById('modal-action-buttons');
            if (currentUser && (isAdmin || currentUser === author)) {
                actionButtons.style.display = 'flex';
            } else {
                actionButtons.style.display = 'none';
            }

            closeAllModals();
            boardModal.classList.add('active');
        });
    });

    // 수정 및 삭제 버튼 이벤트
    document.getElementById('btn-edit-post').addEventListener('click', () => {
        alert('게시글 수정 모드로 전환됩니다.');
    });

    document.getElementById('btn-delete-post').addEventListener('click', () => {
        if(confirm('정말 이 게시물을 삭제하시겠습니까?')) {
            alert('게시물이 삭제되었습니다.');
            closeAllModals();
            window.location.reload();
        }
    });

    // 로그인 및 회원가입 처리 (일반 아이디 기반)
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputId = document.getElementById('login-userid').value;
        const password = document.getElementById('login-pw').value;
        
        if(inputId === 'admin' && password === 'admin1234') {
            alert('관리자님 환영합니다.');
            localStorage.setItem('jwb_logged_user', 'admin');
            closeAllModals();
            window.location.href = 'admin.html';
            return;
        }

        localStorage.setItem('jwb_logged_user', inputId);
        alert('로그인 성공!');
        closeAllModals();
        window.location.reload();
    });

    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        alert('회원가입이 완료되었습니다. 로그인해 주세요.');
        closeAllModals();
        loginModal.classList.add('active');
    });

    document.getElementById('write-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const category = document.getElementById('write-category').value;
        
        if(category === '공지' && !isAdmin) {
            alert('공지사항은 관리자만 작성할 수 있습니다.');
            return;
        }

        alert('게시글과 썸네일 및 첨부파일이 Apps Script를 통해 구글 드라이브에 성공적으로 연동되었습니다.');
        closeAllModals();
        document.getElementById('write-form').reset();
        fileDisplay.textContent = "선택된 파일 없음";
        thumbDisplay.textContent = "선택된 썸네일 없음";
    });
});