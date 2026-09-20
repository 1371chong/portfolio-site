document.addEventListener('DOMContentLoaded', () => {

  const SUPABASE_URL = 'https://gocigyxzbqfphdrnejuh.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvY2lneXh6YnFmcGhkcm5lanVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTg1NzgsImV4cCI6MjEwNTQ3NDU3OH0.-nKW0gGsDMDVUOo9N2CXDFF7y8br5IsnQjaqQakwYak';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 테마, 헤더, 슬라이더, 커서, 메뉴, FAQ 등 기존 코드 유지...
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });
  }

  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, { passive: true });

  // 1. 공지사항 데이터 불러오기 및 상세보기 모달 연동
  async function loadNotices() {
    const list = document.getElementById('notice-list');
    if(!list) return;
    try {
      const { data: notices, error } = await supabase.from('notices').select('*').order('id', { ascending: false });
      list.innerHTML = '';
      if (error || !notices || notices.length === 0) {
        return list.innerHTML = '<li style="text-align:center; padding:15px; color:var(--text-sub);">등록된 공지사항이 없습니다.</li>';
      }
      
      notices.forEach(item => {
        list.innerHTML += `
          <li class="jwb-post-item hover-target" style="cursor: pointer;" onclick="openNoticeModal('${item.title.replace(/'/g, "\\'")}', '${item.date}', '${item.content.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')">
            <div class="jwb-post-header">
              <span class="jwb-post-title">${item.title}</span>
              <span class="jwb-post-meta">관리자 | ${item.date}</span>
            </div>
            <div class="jwb-post-content" style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${item.content}</div>
          </li>
        `;
      });
    } catch (e) { list.innerHTML = '<li style="text-align:center;">서버와 연결할 수 없습니다.</li>'; }
  }

  // 공지사항 상세 모달 제어
  const noticeModal = document.getElementById('notice-modal');
  const noticeModalClose = document.querySelector('.notice-modal-close');
  if (noticeModalClose) noticeModalClose.addEventListener('click', () => noticeModal.classList.remove('active'));
  if (noticeModal) noticeModal.addEventListener('click', (e) => { if(e.target === noticeModal) noticeModal.classList.remove('active'); });

  window.openNoticeModal = function(title, date, content) {
    document.getElementById('notice-modal-title').textContent = title;
    document.getElementById('notice-modal-date').textContent = date;
    document.getElementById('notice-modal-content').textContent = content;
    noticeModal.classList.add('active');
  };

  // 2. 포트폴리오 데이터 불러오기 (작업시간, 카테고리명 추가 및 모션 효과)
  function getYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  const pfContainer = document.getElementById('portfolio-list-container');
  
  async function loadPortfolios() {
    if(!pfContainer) return;
    document.querySelectorAll('.dynamic-portfolio-card').forEach(el => el.remove());

    try {
      const { data: portfolios, error } = await supabase.from('portfolios').select('*').order('id', { ascending: false });
      if (error || !portfolios) return;

      portfolios.forEach(item => {
        const videoId = getYoutubeId(item.link || '');
        let thumbUrl = item.thumb && item.thumb.trim() !== '' ? item.thumb : (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'img/default_thumb.jpg');
        const categoryName = item.category_name || item.category;
        const workTime = item.work_time ? `<span class="meta-item"><i class="fa-solid fa-clock"></i> ${item.work_time}</span>` : '';

        const cardHTML = `
          <div class="portfolio-card dynamic-portfolio-card trigger-item hover-target zoom-card" 
               data-category="${item.category}" data-video-id="${videoId}"
               style="opacity: 0; transform: scale(0.9) translateY(30px);">
            <div class="card-thumb-box img-zoom-wrapper" onclick="openPortfolioModal('${videoId}', '${item.title.replace(/'/g, "\\'")}', '${item.tools}', '${item.desc.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')">
              <img src="${thumbUrl}" alt="포트폴리오 썸네일">
              <div class="play-overlay"><span>VIEW DETAIL</span></div>
            </div>
            <div class="card-info">
              <span class="card-tag">${categoryName}</span>
              <h3 class="card-title">${item.title}</h3>
              <p class="card-desc">${item.desc.substring(0, 40)}...</p>
              <div class="card-meta">
                <span class="meta-item"><i class="fa-solid fa-wrench"></i> ${item.tools}</span>
                ${workTime}
              </div>
            </div>
          </div>
        `;
        pfContainer.insertAdjacentHTML('beforeend', cardHTML);
      });
      filterPortfolio(); 
    } catch(e) { console.error('포트폴리오 로드 실패'); }
  }

  // 카테고리 전환 시 화려한 모션 애니메이션 효과 적용 필터
  const segmentBtns = document.querySelectorAll('.segment-btn');
  const searchInput = document.getElementById('portfolio-search');
  let currentFilter = 'all';

  function filterPortfolio() {
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visibleIndex = 0;

    document.querySelectorAll('.portfolio-card').forEach(card => {
      const categories = card.getAttribute('data-category') || '';
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
      const matchesFilter = (currentFilter === 'all') || categories.includes(currentFilter);
      const matchesSearch = !searchText || title.includes(searchText) || desc.includes(searchText);

      if (matchesFilter && matchesSearch) {
        card.style.display = document.getElementById('portfolio-wrapper').classList.contains('list-view') ? 'flex' : 'block';
        // 카테고리 전환 시 다이내믹 팝업 모션 효과
        card.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1) translateY(0) rotate(0deg)';
        }, 60 + (visibleIndex * 70)); 
        visibleIndex++;
      } else {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.85) translateY(30px) rotate(-2deg)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  }

  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segmentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      
      // 카테고리 버튼 클릭 시 컨테이너 살짝 바운스 모션 효과
      const wrapper = document.getElementById('portfolio-wrapper');
      wrapper.style.transform = 'scale(0.99)';
      setTimeout(() => wrapper.style.transform = 'scale(1)', 200);

      filterPortfolio();
    });
  });
  if (searchInput) searchInput.addEventListener('input', filterPortfolio);

  window.openPortfolioModal = function(videoId, title, tools, desc) {
    const videoModal = document.getElementById('video-modal');
    const modalIframe = document.getElementById('modal-iframe');
    
    if(videoId) {
      modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      modalIframe.style.display = 'block';
    } else {
      modalIframe.src = '';
      modalIframe.style.display = 'none';
    }
    
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-desc').textContent = desc;
    
    const toolsContainer = document.getElementById('modal-tools');
    toolsContainer.innerHTML = '';
    tools.split(',').forEach(tool => {
      if(tool.trim()) toolsContainer.innerHTML += `<span class="tool-badge">${tool.trim()}</span>`;
    });
    
    videoModal.classList.add('active');
  };

  const videoModal = document.getElementById('video-modal');
  const modalClose = document.querySelector('#video-modal .modal-close');
  if (modalClose) modalClose.addEventListener('click', () => { videoModal.classList.remove('active'); document.getElementById('modal-iframe').src = ''; });
  if (videoModal) videoModal.addEventListener('click', (e) => { if (e.target === videoModal) { videoModal.classList.remove('active'); document.getElementById('modal-iframe').src = ''; } });

  loadNotices();
  loadPortfolios();

});
