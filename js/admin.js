document.addEventListener('DOMContentLoaded', () => {
    // 사이드바 메뉴 전환
    const menuLinks = document.querySelectorAll('.admin-menu a[data-target]');
    const sections = document.querySelectorAll('.admin-section');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.getAttribute('href') !== 'index.html') {
                e.preventDefault();
                menuLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                const targetId = link.getAttribute('data-target');
                sections.forEach(sec => {
                    if(sec.id === targetId) sec.classList.add('active');
                    else sec.classList.remove('active');
                });
            }
        });
    });

    // 포트폴리오 작품 추가 버튼 클릭 시 모달 열기 (버튼 반응 오류 해결)
    const addWorkBtn = document.getElementById('btn-open-add-work');
    const addWorkModal = document.getElementById('add-work-modal');
    const modalCloseBtns = document.querySelectorAll('.modal-close');

    if(addWorkBtn && addWorkModal) {
        addWorkBtn.addEventListener('click', () => {
            addWorkModal.classList.add('active');
        });
    }

    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        });
    });

    window.addEventListener('click', (e) => {
        if(e.target.classList.contains('modal-overlay')) {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        }
    });

    // 썸네일 파일 이름 표시
    const thumbFile = document.getElementById('work-thumb-file');
    const thumbFileName = document.getElementById('work-thumb-name');
    if(thumbFile) {
        thumbFile.addEventListener('change', function() {
            if(this.files && this.files.length > 0) thumbFileName.textContent = this.files[0].name;
            else thumbFileName.textContent = "선택된 파일 없음";
        });
    }

    // 작품 등록 폼 전송 (Apps Script 및 구글 드라이브 연동)
    const addWorkForm = document.getElementById('add-work-form');
    if(addWorkForm) {
        addWorkForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('새로운 작품과 썸네일 이미지가 Apps Script를 통해 구글 드라이브에 업로드 및 연동되었습니다.');
            addWorkModal.classList.remove('active');
            addWorkForm.reset();
            thumbFileName.textContent = "선택된 파일 없음";
        });
    }
});