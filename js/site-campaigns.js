(() => {
  const client = window.getJwbSupabase?.();
  const heroRoot = document.getElementById('campaign-hero-root');
  const bannerRoot = document.getElementById('campaign-banner-root');
  const modalRoot = document.getElementById('campaign-modal-root');
  if (!client || !heroRoot || !bannerRoot || !modalRoot) return;

  const dismissedKey = id => `jwb-campaign-dismissed-${id}`;
  const sessionKey = id => `jwb-campaign-session-${id}`;
  const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  const campaignImage = path => path ? client.storage.from('campaign-assets').getPublicUrl(path).data.publicUrl : '';
  const ui = () => ({
    ko: { heroLabel: '메인 배너', event: '이벤트', notice: '안내', bannerClose: '이벤트 배너 닫기', popupClose: '팝업 닫기', hideToday: '오늘 하루 보지 않기', previous: '이전 슬라이드', next: '다음 슬라이드', pause: '자동 재생 일시 정지', play: '자동 재생 시작', slide: '{number} / {total}' },
    en: { heroLabel: 'Main hero', event: 'EVENT', notice: 'NOTICE', bannerClose: 'Close event banner', popupClose: 'Close popup', hideToday: 'Do not show again today', previous: 'Previous slide', next: 'Next slide', pause: 'Pause autoplay', play: 'Start autoplay', slide: '{number} / {total}' },
    ja: { heroLabel: 'メインビジュアル', event: 'イベント', notice: 'お知らせ', bannerClose: 'イベントバナーを閉じる', popupClose: 'ポップアップを閉じる', hideToday: '今日は表示しない', previous: '前のスライド', next: '次のスライド', pause: '自動再生を一時停止', play: '自動再生を開始', slide: '{number} / {total}' },
  }[window.JWB_I18N?.language || document.documentElement.lang] || { heroLabel: '메인 배너', event: '이벤트', notice: '안내', bannerClose: '이벤트 배너 닫기', popupClose: '팝업 닫기', hideToday: '오늘 하루 보지 않기', previous: '이전 슬라이드', next: '다음 슬라이드', pause: '자동 재생 일시 정지', play: '자동 재생 시작', slide: '{number} / {total}' });

  function safeHref(value) {
    if (!value) return '';
    try {
      const url = new URL(value, window.location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  }

  function makeBanner(campaign) {
    const banner = document.createElement('aside'); banner.className = 'site-campaign-banner';
    banner.setAttribute('aria-label', campaign.title);
    if (campaign.image_path) {
      const image = document.createElement('img'); image.src = campaignImage(campaign.image_path); image.alt = campaign.image_alt || '';
      image.loading = 'lazy'; image.decoding = 'async'; banner.append(image);
    }
    const copy = document.createElement('div'); copy.className = 'site-campaign-banner-copy';
    const labels = ui();
    const kicker = document.createElement('span'); kicker.className = 'site-campaign-kicker'; kicker.textContent = `JWB STUDIO · ${labels.event}`;
    const title = document.createElement('h2'); title.textContent = campaign.title;
    copy.append(kicker, title);
    if (campaign.description) { const description = document.createElement('p'); description.textContent = campaign.description; copy.append(description); }
    const href = safeHref(campaign.button_url);
    if (campaign.button_label && href) { const link = document.createElement('a'); link.className = 'site-campaign-cta'; link.href = href; link.textContent = campaign.button_label; copy.append(link); }
    banner.append(copy);
    if (campaign.is_dismissible) {
      const close = document.createElement('button'); close.type = 'button'; close.className = 'site-campaign-close'; close.setAttribute('aria-label', labels.bannerClose); close.textContent = '×';
      close.addEventListener('click', () => { try { sessionStorage.setItem(sessionKey(campaign.id), '1'); } catch {} banner.remove(); });
      banner.append(close);
    }
    return banner;
  }

  function makeHero(campaigns) {
    if (!campaigns.length) return;
    const labels = ui();
    const section = document.createElement('section'); section.className = 'campaign-hero';
    section.setAttribute('aria-label', `JWB STUDIO · ${labels.heroLabel}`); section.setAttribute('aria-roledescription', 'carousel');
    const track = document.createElement('div'); track.className = 'campaign-hero-track';
    const slides = campaigns.map((campaign, index) => {
      const slide = document.createElement('article'); slide.className = 'campaign-hero-slide';
      slide.setAttribute('aria-roledescription', 'slide'); slide.setAttribute('aria-hidden', String(index !== 0));
      if (campaign.image_path) {
        const image = document.createElement('img'); image.src = campaignImage(campaign.image_path); image.alt = campaign.image_alt || '';
        image.loading = index === 0 ? 'eager' : 'lazy'; image.decoding = 'async'; slide.append(image);
      }
      const shade = document.createElement('div'); shade.className = 'campaign-hero-shade';
      const copy = document.createElement('div'); copy.className = 'campaign-hero-copy';
      const kicker = document.createElement('p'); kicker.className = 'campaign-hero-kicker'; kicker.textContent = `JWB STUDIO · ${labels.event}`;
      const title = document.createElement(index === 0 ? 'h1' : 'h2'); title.textContent = campaign.title;
      copy.append(kicker, title);
      if (campaign.description) { const description = document.createElement('p'); description.className = 'campaign-hero-description'; description.textContent = campaign.description; copy.append(description); }
      const href = safeHref(campaign.button_url);
      if (campaign.button_label && href) { const link = document.createElement('a'); link.className = 'campaign-hero-cta'; link.href = href; link.textContent = campaign.button_label; copy.append(link); }
      slide.append(shade, copy); track.append(slide); return slide;
    });
    section.append(track);
    const staticHero = document.getElementById('home');
    if (staticHero) staticHero.hidden = true;
    if (slides.length > 1) {
      const controls = document.createElement('div'); controls.className = 'campaign-hero-controls';
      const previous = document.createElement('button'); previous.type = 'button'; previous.className = 'campaign-hero-arrow'; previous.textContent = '←'; previous.setAttribute('aria-label', labels.previous);
      const indicators = document.createElement('div'); indicators.className = 'campaign-hero-indicators';
      const dots = slides.map((_, index) => {
        const dot = document.createElement('button'); dot.type = 'button'; dot.className = 'campaign-hero-dot';
        dot.setAttribute('aria-label', labels.slide.replace('{number}', String(index + 1)).replace('{total}', String(slides.length)));
        dot.setAttribute('aria-pressed', String(index === 0)); dot.addEventListener('click', () => select(index));
        indicators.append(dot); return dot;
      });
      const next = document.createElement('button'); next.type = 'button'; next.className = 'campaign-hero-arrow'; next.textContent = '→'; next.setAttribute('aria-label', labels.next);
      const autoplay = document.createElement('button'); autoplay.type = 'button'; autoplay.className = 'campaign-hero-autoplay';
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      let activeIndex = 0, paused = Boolean(reducedMotion), timer = 0;
      const setAutoplayLabel = () => { autoplay.textContent = paused ? '▶' : 'Ⅱ'; autoplay.setAttribute('aria-label', paused ? labels.play : labels.pause); autoplay.setAttribute('aria-pressed', String(paused)); };
      const select = index => {
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => { slide.classList.toggle('is-active', slideIndex === activeIndex); slide.setAttribute('aria-hidden', String(slideIndex !== activeIndex)); });
        dots.forEach((dot, dotIndex) => { dot.classList.toggle('is-active', dotIndex === activeIndex); dot.setAttribute('aria-pressed', String(dotIndex === activeIndex)); });
      };
      const stopTimer = () => { window.clearInterval(timer); timer = 0; };
      const startTimer = () => { stopTimer(); if (!paused) timer = window.setInterval(() => select(activeIndex + 1), 6500); };
      previous.addEventListener('click', () => { select(activeIndex - 1); startTimer(); });
      next.addEventListener('click', () => { select(activeIndex + 1); startTimer(); });
      autoplay.addEventListener('click', () => { paused = !paused; setAutoplayLabel(); startTimer(); });
      section.addEventListener('mouseenter', stopTimer); section.addEventListener('mouseleave', startTimer);
      section.addEventListener('focusin', stopTimer); section.addEventListener('focusout', event => { if (!section.contains(event.relatedTarget)) startTimer(); });
      controls.append(previous, indicators, next, autoplay); section.append(controls);
      select(0); setAutoplayLabel(); startTimer();
    } else if (slides[0]) slides[0].classList.add('is-active');
    heroRoot.replaceChildren(section);
  }

  function showModal(campaign) {
    const imageUrl = campaignImage(campaign.image_path);
    const labels = ui();
    const overlay = document.createElement('div'); overlay.className = 'site-campaign-overlay';
    const dialog = document.createElement('section'); dialog.className = 'site-campaign-modal';
    dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true'); dialog.setAttribute('aria-labelledby', `campaign-title-${campaign.id}`);
    const close = document.createElement('button'); close.type = 'button'; close.className = 'site-campaign-modal-close'; close.setAttribute('aria-label', labels.popupClose); close.textContent = '×';
    if (imageUrl) { const image = document.createElement('img'); image.src = imageUrl; image.alt = campaign.image_alt || ''; image.loading = 'eager'; image.decoding = 'async'; dialog.append(image); }
    const content = document.createElement('div'); content.className = 'site-campaign-modal-copy';
    const kicker = document.createElement('span'); kicker.className = 'site-campaign-kicker'; kicker.textContent = `JWB STUDIO · ${labels.notice}`;
    const title = document.createElement('h2'); title.id = `campaign-title-${campaign.id}`; title.textContent = campaign.title;
    content.append(kicker, title);
    if (campaign.description) { const description = document.createElement('p'); description.textContent = campaign.description; content.append(description); }
    const href = safeHref(campaign.button_url);
    if (campaign.button_label && href) { const link = document.createElement('a'); link.className = 'site-campaign-cta'; link.href = href; link.textContent = campaign.button_label; content.append(link); }
    if (campaign.is_dismissible) {
      const hideToday = document.createElement('button'); hideToday.type = 'button'; hideToday.className = 'site-campaign-hide-today';
      hideToday.textContent = labels.hideToday; content.append(hideToday);
    }
    dialog.append(close, content); overlay.append(dialog); modalRoot.replaceChildren(overlay);
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeModal = hideForToday => {
      if (hideForToday) { try { localStorage.setItem(dismissedKey(campaign.id), today()); } catch {} }
      else { try { sessionStorage.setItem(sessionKey(campaign.id), '1'); } catch {} }
      overlay.remove(); document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
      document.removeEventListener('keydown', onKeyDown);
    };
    const onKeyDown = event => {
      if (event.key === 'Escape') { closeModal(false); return; }
      if (event.key !== 'Tab') return;
      const focusables = [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled])')];
      if (!focusables.length) { event.preventDefault(); dialog.focus(); return; }
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    close.addEventListener('click', () => closeModal(false));
    content.querySelector('.site-campaign-hide-today')?.addEventListener('click', () => closeModal(true));
    overlay.addEventListener('click', event => { if (event.target === overlay) closeModal(false); });
    document.addEventListener('keydown', onKeyDown);
    window.setTimeout(() => close.focus(), 0);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const { data, error } = await client.from('site_campaigns').select('*')
      .eq('is_published', true).lte('start_at', new Date().toISOString())
      .order('sort_order', { ascending: true }).order('created_at', { ascending: false });
    if (error) { console.warn('Could not load homepage campaigns', error); return; }
    const now = Date.now();
    const active = (data || []).filter(item => !item.end_at || new Date(item.end_at).getTime() > now);
    makeHero(active.filter(item => item.display_type === 'hero'));
    active.filter(item => item.display_type === 'banner').forEach(item => {
      try { if (!sessionStorage.getItem(sessionKey(item.id))) bannerRoot.append(makeBanner(item)); } catch { bannerRoot.append(makeBanner(item)); }
    });
    const popup = active.find(item => item.display_type === 'modal');
    if (!popup) return;
    try {
      if (localStorage.getItem(dismissedKey(popup.id)) === today() || sessionStorage.getItem(sessionKey(popup.id))) return;
    } catch {}
    window.setTimeout(() => showModal(popup), 650);
  });
})();
