/* JWB STUDIO - Supabase portfolio records */
let portfolioData = [];
let activePortfolioCategory = 'all';
let activePortfolioKeyword = '';
const categoryLabels = {
  '2d': '모션그래픽', motion: '모션그래픽', '3d': '3D 비주얼',
  typography: '타이포그래픽', advertising: '광고영상', 'web-variety': '웹예능',
  'youtube-promo': '유튜브 홍보영상', other: '기타', web: '웹사이트', bot: '자동화·봇'
};
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function getYouTubeId(url) {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : '';
}

function youtubeThumb(url) {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
}

function youtubeEmbed(url) {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1` : '';
}

function publicMediaUrl(path) {
  const config = window.JWB_SUPABASE_CONFIG;
  return path && config?.url ? `${config.url.replace(/\/$/, '')}/storage/v1/object/public/portfolio-assets/${encodeURIComponent(path)}` : '';
}

function driveThumbnailUrl(fileId) {
  return fileId ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1200` : '';
}

function applyPortfolioFilters() {
  const cards = [...document.querySelectorAll('.work-card')];
  let visibleCount = 0;
  cards.forEach(card => {
    const matchesCategory = activePortfolioCategory === 'all' || card.dataset.category === activePortfolioCategory;
    const matchesKeyword = !activePortfolioKeyword || card.dataset.search.includes(activePortfolioKeyword);
    const visible = matchesCategory && matchesKeyword;
    card.style.display = visible ? '' : 'none';
    if (visible) visibleCount++;
  });
  const empty = document.getElementById('portfolio-empty');
  if (empty) empty.hidden = visibleCount > 0 || cards.length === 0;
}

function renderPortfolio() {
  const grid = document.getElementById('work-grid');
  const filters = document.getElementById('work-filters');
  if (!grid || !filters) return;
  if (!portfolioData.length) {
    filters.replaceChildren();
    grid.innerHTML = '<p class="body-text">등록된 작품이 없습니다. 관리자 페이지에서 작품을 등록해 주세요.</p>';
    window.dispatchEvent(new Event('portfolio:ready'));
    return;
  }

  const categories = [
    { key: 'all', label: '전체' },
    ...Array.from(new Set(portfolioData.map(p => p.categoryLabel))).map(label => ({ key: label, label }))
  ];

  filters.innerHTML = categories.map((c,i) =>
    `<button class="filter-btn ${c.key === activePortfolioCategory?'active':''}" data-filter="${escapeHtml(c.key)}">${escapeHtml(c.label)}</button>`
  ).join('');

  grid.innerHTML = portfolioData.map(p => {
    const tags = Array.isArray(p.tags) ? p.tags.filter(tag => typeof tag === 'string' && tag.trim()) : [];
    const tagMarkup = tags.map(tag => `<span class="portfolio-tag">${escapeHtml(tag)}</span>`).join('');
    const imageUrl = driveThumbnailUrl(p.thumb_drive_file_id)
      || (p.media_type === 'image' && p.media_path ? publicMediaUrl(p.media_path) : '')
      || youtubeThumb(p.youtube)
      || (p.drive_file_id ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(p.drive_file_id)}&sz=w640` : '');
    const hasVideo = Boolean(p.drive_file_id || (p.media_type === 'video' && p.media_path) || getYouTubeId(p.youtube));
    return `
      <a href="?work=${encodeURIComponent(p.id)}#works" class="work-card fade-up" data-category="${escapeHtml(p.categoryLabel)}" data-search="${escapeHtml(`${p.title} ${p.categoryLabel} ${tags.join(' ')} ${p.description || ''} ${p.period || ''} ${p.role || ''} ${p.tools || ''} ${p.objective || ''} ${p.process || ''} ${p.outcome || ''}`.toLowerCase())}" data-id="${Number(p.id)}" aria-label="${escapeHtml(p.title)} 상세 보기">
        <div class="thumb youtube-thumb ${hasVideo ? 'video-card-thumb' : ''}">
          ${imageUrl ? `<img class="portfolio-image-thumb" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(p.title)} ${hasVideo ? '영상' : '작업'} 썸네일" loading="lazy" decoding="async">` : '<span class="portfolio-thumb-fallback" aria-hidden="true">JWB<br>STUDIO</span>'}
          <span class="youtube-play" aria-hidden="true">${hasVideo ? '▶' : '↗'}</span>
        </div>
        <div class="info">
          <span class="category">${escapeHtml(p.categoryLabel)}</span>
          <h3>${escapeHtml(p.title)}</h3>
          ${tagMarkup ? `<span class="portfolio-tags">${tagMarkup}</span>` : ''}
          <span class="portfolio-view-count">조회수 ${Number(p.view_count || 0).toLocaleString('ko-KR')}</span>
          <span class="portfolio-view-link">프로젝트 상세 보기 <span aria-hidden="true">→</span></span>
        </div>
      </a>`;
  }).join('');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePortfolioCategory = btn.dataset.filter;
      applyPortfolioFilters();
    });
  });
  applyPortfolioFilters();

  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', event => { event.preventDefault(); openProject(Number(card.dataset.id)); });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
  }, {threshold:.1, rootMargin:'0px 0px -80px 0px'});
  document.querySelectorAll('#work-grid .fade-up').forEach(el => observer.observe(el));
  window.dispatchEvent(new Event('portfolio:ready'));
}

function openProject(id) {
  const p = portfolioData.find(item => item.id === id);
  if (!p) return;
  const counter = window.getJwbSupabase?.();
  if (counter) counter.rpc('increment_portfolio_view', { p_portfolio_id: Number(p.id) }).then(({ data, error }) => {
    if (error || data == null) return;
    p.view_count = Number(data);
    const cardCount = document.querySelector(`.work-card[data-id="${Number(p.id)}"] .portfolio-view-count`);
    if (cardCount) cardCount.textContent = `조회수 ${p.view_count.toLocaleString('ko-KR')}`;
  }).catch(() => {});
  const modal = document.getElementById('project-modal');
  const embed = youtubeEmbed(p.youtube);
  const videoWrap = document.getElementById('project-video-wrap');
  videoWrap.replaceChildren();
  const assetUrl = publicMediaUrl(p.media_path);
  if (p.drive_file_id) {
    const iframe = document.createElement('iframe'); iframe.src = `https://drive.google.com/file/d/${encodeURIComponent(p.drive_file_id)}/preview?autoplay=1`; iframe.title = `${p.title} 동영상`;
    iframe.allow = 'autoplay; fullscreen'; iframe.allowFullscreen = true; iframe.referrerPolicy = 'strict-origin-when-cross-origin'; videoWrap.append(iframe);
  } else if (assetUrl && p.media_type === 'video') {
    const video = document.createElement('video'); video.src = assetUrl; video.controls = true; video.playsInline = true; video.preload = 'none'; videoWrap.append(video); video.play().catch(() => {});
  } else if (embed) {
    const iframe = document.createElement('iframe'); iframe.src = embed; iframe.title = p.title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true; videoWrap.append(iframe);
  } else if (p.thumb_drive_file_id || (assetUrl && p.media_type === 'image')) {
    const image = document.createElement('img'); image.src = driveThumbnailUrl(p.thumb_drive_file_id) || assetUrl; image.alt = `${p.title} 작업 이미지`; videoWrap.append(image);
  } else {
    const placeholder = document.createElement('div'); placeholder.className = 'video-placeholder';
    placeholder.textContent = '등록된 영상이 없습니다.'; videoWrap.append(placeholder);
  }
  document.getElementById('project-category').textContent = p.categoryLabel;
  document.getElementById('project-title').textContent = p.title;
  document.getElementById('project-meta').textContent = p.period || '';
  document.getElementById('project-description').textContent = p.description || '';
  const projectTags = document.getElementById('project-tags');
  projectTags.replaceChildren(...(Array.isArray(p.tags) ? p.tags : []).filter(tag => typeof tag === 'string' && tag.trim()).map(tag => {
    const chip = document.createElement('span'); chip.className = 'portfolio-tag'; chip.textContent = tag; return chip;
  }));
  projectTags.hidden = !projectTags.childElementCount;
  const extra = document.getElementById('project-extra');
  extra.replaceChildren(...[['담당 역할', p.role], ['사용 툴', p.tools], ['목표', p.objective], ['제작 과정', p.process], ['결과', p.outcome]].map(([label, value]) => {
    const item = document.createElement('div'); const strong = document.createElement('strong'); strong.textContent = label;
    const span = document.createElement('span'); span.textContent = value || '-'; item.append(strong, span); return item;
  }));
  const link = document.getElementById('project-youtube');
  link.href = p.drive_file_id ? (p.drive_url || `https://drive.google.com/file/d/${encodeURIComponent(p.drive_file_id)}/view`) : (getYouTubeId(p.youtube) ? p.youtube : '#');
  link.textContent = p.drive_file_id ? 'Google Drive에서 보기' : 'YouTube에서 보기';
  link.hidden = !p.drive_file_id && !getYouTubeId(p.youtube);
  const visibleIds = [...document.querySelectorAll('.work-card')]
    .filter(card => card.style.display !== 'none')
    .map(card => Number(card.dataset.id));
  const navigationIds = visibleIds.includes(Number(p.id)) ? visibleIds : portfolioData.map(item => Number(item.id));
  const projectIndex = navigationIds.indexOf(Number(p.id));
  const previousButton = document.getElementById('project-prev');
  const nextButton = document.getElementById('project-next');
  previousButton.disabled = projectIndex <= 0;
  nextButton.disabled = projectIndex < 0 || projectIndex >= navigationIds.length - 1;
  previousButton.onclick = () => { if (projectIndex > 0) openProject(navigationIds[projectIndex - 1]); };
  nextButton.onclick = () => { if (projectIndex >= 0 && projectIndex < navigationIds.length - 1) openProject(navigationIds[projectIndex + 1]); };
  const shareButton = document.getElementById('project-share');
  if (shareButton) shareButton.onclick = async () => {
    const url = new URL(window.location.href); url.searchParams.set('work', String(p.id)); url.hash = 'works';
    try { await navigator.clipboard.writeText(url.toString()); shareButton.textContent = '링크 복사 완료'; }
    catch { window.prompt('프로젝트 공유 링크', url.toString()); }
  };
  const currentUrl = new URL(window.location.href); currentUrl.searchParams.set('work', String(p.id)); currentUrl.hash = 'works';
  const oldUrl = new URL(window.location.href);
  if (oldUrl.searchParams.get('work') === String(p.id)) window.history.replaceState({}, '', currentUrl);
  else window.history.pushState({ work: p.id }, '', currentUrl);
  document.title = `${p.title} | JWB STUDIO`;
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', p.description || 'JWB STUDIO 포트폴리오 프로젝트');
  const shareImage = driveThumbnailUrl(p.thumb_drive_file_id)
    || (p.media_type === 'image' ? assetUrl : youtubeThumb(p.youtube))
    || driveThumbnailUrl(p.drive_file_id);
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', shareImage || 'https://www.wonbok.kr/img/logo/logo.png');
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', currentUrl.toString());
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', p.description || 'JWB STUDIO 포트폴리오 프로젝트');
  document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', shareImage || 'https://www.wonbok.kr/img/logo/logo.png');
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', currentUrl.toString());
  modal.classList.add('active');
}

document.addEventListener('DOMContentLoaded', renderPortfolio);

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('work-search-input');
  if (!searchInput) return;
  searchInput.addEventListener('input', () => {
    activePortfolioKeyword = searchInput.value.toLocaleLowerCase().trim();
    applyPortfolioFilters();
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.getJwbSupabase) return;
  const client = window.getJwbSupabase();
  if (!client) { renderPortfolio(); return; }
  const { data, error } = await client.from('portfolios').select('*').eq('is_published', true).order('id', { ascending: false });
  if (error) { renderPortfolio(); return; }
  portfolioData = (data || []).map(item => ({
    ...item,
    categoryLabel: categoryLabels[String(item.category || '').toLowerCase()] || item.category_label || String(item.category || '').toUpperCase()
  }));
  renderPortfolio();
  const sharedId = new URLSearchParams(window.location.search).get('work');
  if (sharedId) openProject(Number(sharedId));
});

window.addEventListener('popstate', () => {
  const sharedId = new URLSearchParams(window.location.search).get('work');
  if (sharedId) openProject(Number(sharedId));
  else {
    document.getElementById('project-modal')?.classList.remove('active');
    document.getElementById('project-video-wrap')?.replaceChildren();
    document.title = 'JWB STUDIO | Motion & Interactive';
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'JWB STUDIO | Motion & Interactive');
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', '모션그래픽, 3D 비주얼, 영상 제작과 인터랙티브 웹 포트폴리오');
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', 'https://www.wonbok.kr/img/logo/logo.png');
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', 'https://www.wonbok.kr/');
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', 'JWB STUDIO | Motion & Interactive');
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', '모션그래픽, 3D 비주얼, 영상 제작과 인터랙티브 웹 포트폴리오');
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', 'https://www.wonbok.kr/img/logo/logo.png');
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', 'https://www.wonbok.kr/');
  }
});
