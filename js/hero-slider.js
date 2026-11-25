document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const slides = [...hero.querySelectorAll('.hero-slide')];
    const pagination = hero.querySelector('.hero-pagination');
    let dots = [];
    if (pagination) {
        const label = window.JWB_I18N?.t('slideLabel') || '{number}번 슬라이드';
        dots = slides.map((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'hero-dot';
            dot.setAttribute('aria-label', label.replace('{number}', String(index + 1)));
            dot.setAttribute('aria-current', 'false');
            return dot;
        });
        pagination.replaceChildren(...dots);
    }
    const currentLabel = hero.querySelector('#hero-current');
    const totalLabel = hero.querySelector('#hero-total');
    const autoplayButton = hero.querySelector('.hero-autoplay');
    const progressFill = hero.querySelector('#hero-progress-fill');
    const latestNoticeLink = document.getElementById('hero-latest-notice');
    const latestNoticeTitle = document.getElementById('hero-latest-notice-title');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;
    let timer = null;
    let paused = reducedMotion.matches;
    let swipeStart = null;

    const resetProgress = () => {
        if (!progressFill) return;
        progressFill.style.animation = 'none';
        void progressFill.offsetWidth;
        progressFill.style.animation = '';
    };

    const renderLatestNotice = (notice) => {
        if (!notice?.id || !notice?.title || !latestNoticeLink || !latestNoticeTitle) return;
        latestNoticeTitle.textContent = notice.title;
        const url = new URL('notices.html', window.location.href);
        url.searchParams.set('notice', String(notice.id));
        latestNoticeLink.href = url.toString();
        latestNoticeLink.setAttribute('aria-label', `${window.JWB_I18N?.t('latestNotice') || '최신 공지'}: ${notice.title}`);
        latestNoticeLink.hidden = false;
    };
    window.addEventListener('jwb:noticesready', event => renderLatestNotice(event.detail));
    window.addEventListener('jwb:languagechange', () => renderLatestNotice(window.JWB_LATEST_NOTICE));
    renderLatestNotice(window.JWB_LATEST_NOTICE);

    const showSlide = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            const active = i === current;
            slide.classList.toggle('is-active', active);
            slide.setAttribute('aria-hidden', String(!active));
            slide.inert = !active;
        });
        dots.forEach((dot, i) => {
            const active = i === current;
            dot.classList.toggle('is-active', active);
            dot.setAttribute('aria-current', String(active));
        });
        if (currentLabel) currentLabel.textContent = String(current + 1).padStart(2, '0');
        if (totalLabel) totalLabel.textContent = String(slides.length).padStart(2, '0');
        resetProgress();
        if (timer !== null) syncAutoplay();
    };

    const stopTimer = () => {
        window.clearInterval(timer);
        timer = null;
        hero.classList.remove('is-autoplay-playing');
        hero.classList.add('is-autoplay-paused');
    };
    const syncAutoplay = () => {
        stopTimer();
        const autoPlay = !paused && !document.hidden;
        hero.classList.toggle('is-autoplay-playing', autoPlay);
        hero.classList.toggle('is-autoplay-paused', !autoPlay);
        resetProgress();
        autoplayButton?.setAttribute('aria-pressed', String(paused));
        autoplayButton?.setAttribute('aria-label', window.JWB_I18N?.t(paused ? 'play' : 'pause') || (paused ? '자동 재생 시작' : '자동 재생 일시 정지'));
        if (autoplayButton) autoplayButton.textContent = paused ? '▶' : 'Ⅱ';
        if (autoPlay) timer = window.setInterval(() => showSlide(current + 1), 6000);
    };

    hero.querySelector('[data-hero-direction="prev"]')?.addEventListener('click', () => showSlide(current - 1));
    hero.querySelector('[data-hero-direction="next"]')?.addEventListener('click', () => showSlide(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
    autoplayButton?.addEventListener('click', () => {
        paused = !paused;
        syncAutoplay();
    });
    hero.addEventListener('pointerdown', (event) => {
        if (!['touch', 'pen'].includes(event.pointerType) || event.target.closest('button, a')) return;
        swipeStart = { x: event.clientX, y: event.clientY };
    }, { passive: true });
    hero.addEventListener('pointerup', (event) => {
        if (!swipeStart) return;
        const dx = event.clientX - swipeStart.x;
        const dy = event.clientY - swipeStart.y;
        swipeStart = null;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
        showSlide(current + (dx < 0 ? 1 : -1));
        if (!paused && !hero.matches(':hover') && !hero.contains(document.activeElement)) syncAutoplay();
    }, { passive: true });
    hero.addEventListener('pointercancel', () => { swipeStart = null; }, { passive: true });
    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', syncAutoplay);
    hero.addEventListener('focusin', stopTimer);
    hero.addEventListener('focusout', (event) => {
        if (!hero.contains(event.relatedTarget)) syncAutoplay();
    });
    document.addEventListener('visibilitychange', syncAutoplay);
    reducedMotion.addEventListener?.('change', (event) => {
        if (event.matches) paused = true;
        syncAutoplay();
    });

    showSlide(0);
    syncAutoplay();
});
