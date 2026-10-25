/* JWB STUDIO - Supabase portfolio records */
let portfolioData = [];
let activePortfolioCategory = 'all';
let activePortfolioKeyword = '';
let activePortfolioSort = 'newest';
const categoryLabels = {
  '2d': '모션그래픽', motion: '모션그래픽', '3d': '3D 비주얼',
  typography: '타이포그래픽', advertising: '광고영상', 'web-variety': '웹예능',
  'youtube-promo': '유튜브 홍보영상', other: '기타', web: '웹사이트', bot: '자동화·봇'
};
const englishCategoryLabels = {
  '모션그래픽':'Motion Graphics', '3D 비주얼':'3D Visual', '타이포그래픽':'Typography',
  '광고영상':'Advertising', '웹예능':'Web Variety', '유튜브 홍보영상':'YouTube Promo',
  '기타':'Other', '웹사이트':'Web', '자동화·봇':'Automation'
};
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const normalizeSearch = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
function categoryTone(label) {
  const value = String(label || '').toLocaleLowerCase();
  if (value.includes('3d')) return 'three-d';
  if (value.includes('광고') || value.includes('ad') || value.includes('promo')) return 'campaign';
  if (value.includes('모션') || value.includes('motion') || value.includes('video') || value.includes('영상')) return 'motion';
  if (value.includes('타이포') || value.includes('type')) return 'type';
  if (value.includes('web') || value.includes('웹') || value.includes('자동화') || value.includes('bot')) return 'digital';
  if (value.includes('예능')) return 'digital';
  return 'other';
}

function sortedPortfolioItems() {
  const items = [...portfolioData];
  if (activePortfolioSort === 'views') return items.sort((a, b) => Number(b.view_count || 0) - Number(a.view_count || 0) || String(b.id).localeCompare(String(a.id)));
  if (activePortfolioSort === 'title') return items.sort((a, b) => localizedPortfolioValue(a, 'title').localeCompare(localizedPortfolioValue(b, 'title'), window.JWB_I18N?.language || 'ko'));
  return items.sort((a, b) => {
    const aDate = new Date(a.created_at || a.published_at || 0).getTime() || Number(a.id) || 0;
    const bDate = new Date(b.created_at || b.published_at || 0).getTime() || Number(b.id) || 0;
    return bDate - aDate;
  });
}
const localizedPortfolioValue = (item, field) => {
  const language = window.JWB_I18N?.language || 'ko';
  return item?.[`${field}_${language}`] || (language === 'ja' ? item?.[`${field}_en`] : '') || item?.[field] || '';
};

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
    const matchesKeyword = !activePortfolioKeyword || normalizeSearch(card.dataset.search).includes(normalizeSearch(activePortfolioKeyword));
    const visible = matchesCategory && matchesKeyword;
    card.style.display = visible ? '' : 'none';
    if (visible) visibleCount++;
  });
  const empty = document.getElementById('portfolio-empty');
  if (empty) empty.hidden = visibleCount > 0 || cards.length === 0;
  const summary = document.getElementById('portfolio-result-summary');
  if (summary) {
    const language = window.JWB_I18N?.language || 'ko';
    summary.textContent = language === 'en'
      ? `${visibleCount} of ${cards.length} projects`
      : language === 'ja' ? `${cards.length}件中 ${visibleCount}件を表示`
      : `전체 ${cards.length}개 중 ${visibleCount}개 작품`;
  }
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
    { key: 'all', label: '전체', count: portfolioData.length },
    ...Array.from(new Set(portfolioData.map(p => p.categoryLabel))).map(label => ({
      key: label, label, count: portfolioData.filter(item => item.categoryLabel === label).length
    }))
  ];

  filters.innerHTML = categories.map((c,i) =>
    `<button type="button" class="filter-btn" data-category-tone="${categoryTone(c.label)}" data-filter="${escapeHtml(c.key)}" aria-pressed="${c.key === activePortfolioCategory}"><span class="filter-label">${escapeHtml(window.JWB_I18N?.category(c.label) || c.label)}</span><span class="filter-count">${c.count}</span></button>`
  ).join('');

  grid.innerHTML = sortedPortfolioItems().map(p => {
    const tags = Array.isArray(localizedPortfolioValue(p, 'tags')) ? localizedPortfolioValue(p, 'tags').filter(tag => typeof tag === 'string' && tag.trim()) : [];
    const title = localizedPortfolioValue(p, 'title');
    const description = localizedPortfolioValue(p, 'description');
    const tagMarkup = tags.map(tag => `<span class="portfolio-tag">${escapeHtml(tag)}</span>`).join('');
    const imageUrl = driveThumbnailUrl(p.thumb_drive_file_id)
      || (p.media_type === 'image' && p.media_path ? publicMediaUrl(p.media_path) : '')
      || youtubeThumb(p.youtube)
      || (p.drive_file_id ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(p.drive_file_id)}&sz=w640` : '');
    const hasVideo = Boolean(p.drive_file_id || (p.media_type === 'video' && p.media_path) || getYouTubeId(p.youtube));
    return `
      <a href="?work=${encodeURIComponent(p.id)}#works" class="work-card fade-up" data-category="${escapeHtml(p.categoryLabel)}" data-search="${escapeHtml(`${p.title} ${p.title_en || ''} ${p.title_ja || ''} ${p.categoryLabel} ${englishCategoryLabels[p.categoryLabel] || ''} ${tags.join(' ')} ${(p.tags_en || []).join?.(' ') || ''} ${(p.tags_ja || []).join?.(' ') || ''} ${p.description || ''} ${p.description_en || ''} ${p.description_ja || ''} ${p.period || ''} ${localizedPortfolioValue(p, 'role')} ${p.role_en || ''} ${p.role_ja || ''} ${p.tools || ''} ${p.tools_en || ''} ${p.tools_ja || ''} ${p.objective || ''} ${p.objective_en || ''} ${p.objective_ja || ''} ${p.process || ''} ${p.process_en || ''} ${p.process_ja || ''} ${p.outcome || ''} ${p.outcome_en || ''} ${p.outcome_ja || ''}`)}" data-id="${Number(p.id)}" aria-label="${escapeHtml(title)} ${window.JWB_I18N?.t('projectLink') || '상세 보기'}">
        <div class="thumb youtube-thumb ${hasVideo ? 'video-card-thumb' : ''}">
          ${imageUrl ? `<img class="portfolio-image-thumb" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)} ${hasVideo ? 'video' : 'work'} thumbnail" loading="lazy" decoding="async">` : '<span class="portfolio-thumb-fallback" aria-hidden="true">JWB<br>STUDIO</span>'}
          <span class="youtube-play" aria-hidden="true">${hasVideo ? '▶' : '↗'}</span>
        </div>
        <div class="info">
          <span class="category" data-category-tone="${categoryTone(p.categoryLabel)}">${escapeHtml(window.JWB_I18N?.category(p.categoryLabel) || p.categoryLabel)}</span>
          <h3>${escapeHtml(title)}</h3>
          ${tagMarkup ? `<span class="portfolio-tags">${tagMarkup}</span>` : ''}
          <span class="portfolio-view-count">${window.JWB_I18N?.t('views') || '조회수'} ${Number(p.view_count || 0).toLocaleString('ko-KR')}</span>
          <span class="portfolio-view-link">${window.JWB_I18N?.t('projectLink') || '프로젝트 상세 보기'} <span aria-hidden="true">→</span></span>
        </div>
      </a>`;
  }).join('');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.filter-btn').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
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

function renderProjectDetailSections(project) {
  const labels = window.JWB_I18N?.t('labels') || ['담당 역할', '사용 툴', '목표', '제작 과정', '결과'];
  const briefRoot = document.getElementById('project-brief');
  const storyRoot = document.getElementById('project-story');
  const infoPanel = document.getElementById('project-info-panel');
  const briefHeading = document.getElementById('project-overview-heading');
  const storyHeading = document.getElementById('project-story-heading');
  if (!briefRoot || !storyRoot) return;

  const createDetail = (label, value, className) => {
    const item = document.createElement('article'); item.className = className;
    const heading = document.createElement('strong'); heading.textContent = label;
    const body = document.createElement('p'); body.textContent = value;
    item.append(heading, body);
    return item;
  };
  const brief = [
    [labels[0], localizedPortfolioValue(project, 'role'), 'project-brief-item project-brief-role'],
    [labels[1], localizedPortfolioValue(project, 'tools'), 'project-brief-item project-brief-tools'],
    [labels[2], localizedPortfolioValue(project, 'objective'), 'project-brief-item project-brief-objective']
  ].filter(([, value]) => String(value || '').trim());
  const story = [
    [labels[3], localizedPortfolioValue(project, 'process'), 'project-story-card project-story-process'],
    [labels[4], localizedPortfolioValue(project, 'outcome'), 'project-story-card project-story-outcome']
  ].filter(([, value]) => String(value || '').trim());
  briefRoot.replaceChildren(...brief.map(([label, value, className]) => createDetail(label, value, className)));
  storyRoot.replaceChildren(...story.map(([label, value, className]) => createDetail(label, value, className)));
  briefRoot.hidden = brief.length === 0;
  if (infoPanel) infoPanel.hidden = brief.length === 0;
  storyRoot.hidden = story.length === 0;
  if (briefHeading) briefHeading.hidden = brief.length === 0;
  if (storyHeading) storyHeading.hidden = story.length === 0;
}

function openProject(id) {
  const p = portfolioData.find(item => item.id === id);
  if (!p) return;
  const projectTitle = localizedPortfolioValue(p, 'title');
  const projectDescription = localizedPortfolioValue(p, 'description');
  const counter = window.getJwbSupabase?.();
  if (counter) counter.rpc('increment_portfolio_view', { p_portfolio_id: Number(p.id) }).then(({ data, error }) => {
    if (error || data == null) return;
    p.view_count = Number(data);
    const cardCount = document.querySelector(`.work-card[data-id="${Number(p.id)}"] .portfolio-view-count`);
    if (cardCount) cardCount.textContent = `${window.JWB_I18N?.t('views') || '조회수'} ${p.view_count.toLocaleString('ko-KR')}`;
  }).catch(() => {});
  const modal = document.getElementById('project-modal');
  if (!modal.classList.contains('active')) window.jwbLastProjectTrigger = document.activeElement;
  const embed = youtubeEmbed(p.youtube);
  const videoWrap = document.getElementById('project-video-wrap');
  videoWrap.replaceChildren();
  const assetUrl = publicMediaUrl(p.media_path);
  if (p.drive_file_id) {
    const iframe = document.createElement('iframe'); iframe.src = `https://drive.google.com/file/d/${encodeURIComponent(p.drive_file_id)}/preview?autoplay=1`; iframe.title = `${projectTitle} video`;
    iframe.allow = 'autoplay; fullscreen'; iframe.allowFullscreen = true; iframe.loading = 'lazy'; iframe.referrerPolicy = 'strict-origin-when-cross-origin'; videoWrap.append(iframe);
  } else if (assetUrl && p.media_type === 'video') {
    const video = document.createElement('video'); video.src = assetUrl; video.controls = true; video.playsInline = true; video.preload = 'none'; videoWrap.append(video); video.play().catch(() => {});
  } else if (embed) {
    const iframe = document.createElement('iframe'); iframe.src = embed; iframe.title = projectTitle;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true; iframe.loading = 'lazy'; videoWrap.append(iframe);
  } else if (p.thumb_drive_file_id || (assetUrl && p.media_type === 'image')) {
    const image = document.createElement('img'); image.src = driveThumbnailUrl(p.thumb_drive_file_id) || assetUrl; image.alt = `${projectTitle} project image`; image.decoding = 'async'; videoWrap.append(image);
  } else {
    const placeholder = document.createElement('div'); placeholder.className = 'video-placeholder';
    placeholder.textContent = window.JWB_I18N?.t('noMedia') || '등록된 영상이 없습니다.'; videoWrap.append(placeholder);
  }
  document.getElementById('project-category').textContent = window.JWB_I18N?.category(p.categoryLabel) || p.categoryLabel;
  document.getElementById('project-category').dataset.categoryTone = categoryTone(p.categoryLabel);
  document.getElementById('project-title').textContent = projectTitle;
  document.getElementById('project-meta').textContent = p.period || '';
  document.getElementById('project-description').textContent = projectDescription;
  const projectTags = document.getElementById('project-tags');
  const projectTagsData = localizedPortfolioValue(p, 'tags');
  projectTags.replaceChildren(...(Array.isArray(projectTagsData) ? projectTagsData : []).filter(tag => typeof tag === 'string' && tag.trim()).map(tag => {
    const chip = document.createElement('span'); chip.className = 'portfolio-tag'; chip.textContent = tag; return chip;
  }));
  projectTags.hidden = !projectTags.childElementCount;
  renderProjectDetailSections(p);
  const link = document.getElementById('project-youtube');
  link.href = p.drive_file_id ? (p.drive_url || `https://drive.google.com/file/d/${encodeURIComponent(p.drive_file_id)}/view`) : (getYouTubeId(p.youtube) ? p.youtube : '#');
  link.textContent = p.drive_file_id ? (window.JWB_I18N?.t('external') || 'Google Drive에서 보기') : (window.JWB_I18N?.t('youtube') || 'YouTube에서 보기');
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
    try { await navigator.clipboard.writeText(url.toString()); shareButton.textContent = window.JWB_I18N?.t('copied') || '링크 복사 완료'; shareButton.dataset.copied = 'true'; }
    catch { window.prompt('프로젝트 공유 링크', url.toString()); }
  };
  const currentUrl = new URL(window.location.href); currentUrl.searchParams.set('work', String(p.id)); currentUrl.hash = 'works';
  const oldUrl = new URL(window.location.href);
  if (oldUrl.searchParams.get('work') === String(p.id)) window.history.replaceState({}, '', currentUrl);
  else window.history.pushState({ work: p.id }, '', currentUrl);
  document.title = `${projectTitle} | JWB STUDIO`;
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', projectDescription || 'JWB STUDIO portfolio project');
  const shareImage = driveThumbnailUrl(p.thumb_drive_file_id)
    || (p.media_type === 'image' ? assetUrl : youtubeThumb(p.youtube))
    || driveThumbnailUrl(p.drive_file_id);
  document.querySelector('meta[property="og:image"]')?.setAttribute('content', shareImage || 'https://www.wonbok.kr/img/logo/logo.png');
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', currentUrl.toString());
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', projectDescription || 'JWB STUDIO portfolio project');
  document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', shareImage || 'https://www.wonbok.kr/img/logo/logo.png');
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', currentUrl.toString());
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.getElementById('project-modal-close')?.focus();
}

window.addEventListener('jwb:languagechange', () => {
  document.querySelectorAll('.filter-btn').forEach(button => {
    const key = button.dataset.filter;
    const original = key === 'all' ? '전체' : key;
    const label = button.querySelector('.filter-label');
    if (label) label.textContent = window.JWB_I18N?.category(original) || original;
  });
  document.querySelectorAll('.work-card').forEach(card => {
    const item = portfolioData.find(p => Number(p.id) === Number(card.dataset.id));
    if (!item) return;
    const localizedTitle = localizedPortfolioValue(item, 'title');
    const title = card.querySelector('h3');
    if (title) title.textContent = localizedTitle;
    const category = card.querySelector('.category');
    if (category) {
      category.textContent = window.JWB_I18N?.category(item.categoryLabel) || item.categoryLabel;
      category.dataset.categoryTone = categoryTone(item.categoryLabel);
    }
    const thumb = card.querySelector('.portfolio-image-thumb');
    if (thumb) thumb.alt = `${localizedTitle} project thumbnail`;
    const tagList = card.querySelector('.portfolio-tags');
    const localizedTags = localizedPortfolioValue(item, 'tags');
    if (tagList && Array.isArray(localizedTags)) tagList.replaceChildren(...localizedTags.map(tag => { const chip = document.createElement('span'); chip.className = 'portfolio-tag'; chip.textContent = tag; return chip; }));
    const count = card.querySelector('.portfolio-view-count');
    if (count) count.textContent = `${window.JWB_I18N?.t('views') || '조회수'} ${Number(portfolioData.find(p => Number(p.id) === Number(card.dataset.id))?.view_count || 0).toLocaleString('ko-KR')}`;
    const link = card.querySelector('.portfolio-view-link');
    if (link) link.firstChild.nodeValue = `${window.JWB_I18N?.t('projectLink') || '프로젝트 상세 보기'} `;
  });
  const resultSummary = document.getElementById('portfolio-result-summary');
  if (resultSummary) {
    const cards = [...document.querySelectorAll('.work-card')];
    const visible = cards.filter(card => card.style.display !== 'none').length;
    const language = window.JWB_I18N?.language || 'ko';
    resultSummary.textContent = language === 'en'
      ? `${visible} of ${cards.length} projects`
      : language === 'ja' ? `${cards.length}件中 ${visible}件を表示`
      : `전체 ${cards.length}개 중 ${visible}개 작품`;
  }
  const share = document.getElementById('project-share');
  if (share) { share.dataset.copied = ''; share.textContent = window.JWB_I18N?.t('share') || '프로젝트 공유 링크 복사'; }
  const projectId = Number(new URLSearchParams(location.search).get('work'));
  if (projectId && document.getElementById('project-modal')?.classList.contains('active')) {
    const item = portfolioData.find(p => Number(p.id) === projectId);
    if (item) {
      document.getElementById('project-category').textContent = window.JWB_I18N.category(item.categoryLabel);
      document.getElementById('project-category').dataset.categoryTone = categoryTone(item.categoryLabel);
      document.getElementById('project-title').textContent = localizedPortfolioValue(item, 'title');
      document.getElementById('project-description').textContent = localizedPortfolioValue(item, 'description');
      renderProjectDetailSections(item);
      document.getElementById('project-youtube').textContent = item.drive_file_id ? window.JWB_I18N.t('external') : window.JWB_I18N.t('youtube');
    }
  }
});

document.addEventListener('DOMContentLoaded', renderPortfolio);

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('work-search-input');
  if (!searchInput) return;
  searchInput.addEventListener('input', () => {
    activePortfolioKeyword = searchInput.value.toLocaleLowerCase().trim();
    applyPortfolioFilters();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const sortSelect = document.getElementById('portfolio-sort');
  if (!sortSelect) return;
  sortSelect.addEventListener('change', () => {
    activePortfolioSort = sortSelect.value;
    renderPortfolio();
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
    document.getElementById('project-modal')?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
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
    window.jwbLastProjectTrigger?.focus?.();
  }
});
