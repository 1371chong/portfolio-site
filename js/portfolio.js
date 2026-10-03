/* JWB STUDIO - Supabase portfolio records */
let portfolioData = [];
const categoryLabels = { '2d': '2D MOTION', '3d': '3D ARTS', web: 'WEB & DEV', motion: 'MOTION', bot: 'BOT & DEV' };
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
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : '';
}

function publicMediaUrl(path) {
  const config = window.JWB_SUPABASE_CONFIG;
  return path && config?.url ? `${config.url.replace(/\/$/, '')}/storage/v1/object/public/portfolio-assets/${encodeURIComponent(path)}` : '';
}

function driveThumbnailUrl(fileId) {
  return fileId ? `https://drive.google.com/uc?export=view&id=${encodeURIComponent(fileId)}` : '';
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
    ...Array.from(new Map(portfolioData.map(p => [p.category, p.categoryLabel])).entries())
      .map(([key,label]) => ({key,label}))
  ];

  filters.innerHTML = categories.map((c,i) =>
    `<button class="filter-btn ${i===0?'active':''}" data-filter="${escapeHtml(c.key)}">${escapeHtml(c.label)}</button>`
  ).join('');

  grid.innerHTML = portfolioData.map(p => {
    const thumb = youtubeThumb(p.youtube);
    const uploadedImage = p.thumb_drive_file_id || (p.media_type === 'image' && p.media_path);
    const imageUrl = p.thumb_drive_file_id ? driveThumbnailUrl(p.thumb_drive_file_id) : p.media_type === 'image' ? publicMediaUrl(p.media_path) : thumb;
    const style = imageUrl && !uploadedImage ? `style="background-image:url('${escapeHtml(imageUrl)}')"` : '';
    return `
      <a href="?work=${encodeURIComponent(p.id)}#works" class="work-card fade-up" data-category="${escapeHtml(p.category)}" data-id="${Number(p.id)}" aria-label="${escapeHtml(p.title)} 상세 보기">
        <div class="thumb youtube-thumb ${p.drive_file_id || (p.media_type === 'video' && p.media_path) ? 'video-card-thumb' : ''}" ${style}>
          ${uploadedImage ? `<img class="portfolio-image-thumb" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(p.title)} 작업 이미지" loading="lazy" decoding="async">` : ''}
          ${p.media_type === 'video' && p.media_path ? `<video muted playsinline preload="metadata" src="${escapeHtml(publicMediaUrl(p.media_path))}"></video>` : ''}
          <span class="youtube-play">▶</span>
        </div>
        <div class="info">
          <span class="category">${escapeHtml(p.categoryLabel)}</span>
          <h3>${escapeHtml(p.title)}</h3>
        </div>
      </a>`;
  }).join('');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.work-card').forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? 'block' : 'none';
      });
    });
  });

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
  const modal = document.getElementById('project-modal');
  const embed = youtubeEmbed(p.youtube);
  const videoWrap = document.getElementById('project-video-wrap');
  videoWrap.replaceChildren();
  const assetUrl = publicMediaUrl(p.media_path);
  const thumbnailUrl = p.thumb_drive_file_id ? driveThumbnailUrl(p.thumb_drive_file_id) : '';
  if (p.drive_file_id) {
    const iframe = document.createElement('iframe'); iframe.src = `https://drive.google.com/file/d/${encodeURIComponent(p.drive_file_id)}/preview`; iframe.title = `${p.title} 동영상`;
    iframe.allow = 'autoplay; fullscreen'; iframe.allowFullscreen = true; iframe.referrerPolicy = 'strict-origin-when-cross-origin'; videoWrap.append(iframe);
  } else if (assetUrl && p.media_type === 'video') {
    const video = document.createElement('video'); video.src = assetUrl; video.controls = true; video.playsInline = true; video.preload = 'metadata'; videoWrap.append(video);
  } else if (assetUrl && p.media_type === 'image') {
    const image = document.createElement('img'); image.src = assetUrl; image.alt = `${p.title} 작업 이미지`; videoWrap.append(image);
  } else if (embed) {
    const iframe = document.createElement('iframe'); iframe.src = embed; iframe.title = p.title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true; videoWrap.append(iframe);
  } else if (thumbnailUrl) {
    const image = document.createElement('img'); image.src = thumbnailUrl; image.alt = `${p.title} 작업 썸네일`; videoWrap.append(image);
  } else {
    const placeholder = document.createElement('div'); placeholder.className = 'video-placeholder';
    placeholder.textContent = '등록된 영상이 없습니다.'; videoWrap.append(placeholder);
  }
  document.getElementById('project-category').textContent = p.categoryLabel;
  document.getElementById('project-title').textContent = p.title;
  document.getElementById('project-meta').textContent = p.period || '';
  document.getElementById('project-description').textContent = p.description || '';
  const extra = document.getElementById('project-extra');
  extra.replaceChildren(...[['담당 역할', p.role], ['사용 툴', p.tools], ['목표', p.objective], ['제작 과정', p.process], ['결과', p.outcome]].map(([label, value]) => {
    const item = document.createElement('div'); const strong = document.createElement('strong'); strong.textContent = label;
    const span = document.createElement('span'); span.textContent = value || '-'; item.append(strong, span); return item;
  }));
  const link = document.getElementById('project-youtube');
  link.href = p.drive_file_id ? (p.drive_url || `https://drive.google.com/file/d/${encodeURIComponent(p.drive_file_id)}/view`) : (getYouTubeId(p.youtube) ? p.youtube : '#');
  link.textContent = p.drive_file_id ? 'Google Drive에서 보기' : 'YouTube에서 보기';
  link.hidden = !p.drive_file_id && !getYouTubeId(p.youtube);
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
  const shareImage = thumbnailUrl || (p.media_type === 'image' ? assetUrl : youtubeThumb(p.youtube));
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', shareImage || 'https://www.wonbok.kr/img/logo/logo.png');
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', currentUrl.toString());
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', p.description || 'JWB STUDIO 포트폴리오 프로젝트');
  document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', shareImage || 'https://www.wonbok.kr/img/logo/logo.png');
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', currentUrl.toString());
  modal.classList.add('active');
}

document.addEventListener('DOMContentLoaded', renderPortfolio);

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.getJwbSupabase) return;
  const client = window.getJwbSupabase();
  if (!client) { renderPortfolio(); return; }
  const { data, error } = await client.from('portfolios').select('*').order('id', { ascending: false });
  if (error) { renderPortfolio(); return; }
  portfolioData = (data || []).map(item => ({
    ...item,
    categoryLabel: item.category_label || categoryLabels[String(item.category || '').toLowerCase()] || String(item.category || '').toUpperCase()
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
