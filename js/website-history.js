(() => {
  const client = window.getJwbSupabase?.();
  let updates = [];
  const categoryKeys = { '기능 추가':'historyFeature', '디자인 변경':'historyDesign', '수정':'historyFix', '운영':'historyOperations' };
  const categoryLabel = category => window.JWB_I18N?.t(categoryKeys[category]) || category;
  const dateLabel = value => new Date(value).toLocaleDateString(document.documentElement.lang || 'ko', { year: 'numeric', month: 'long', day: 'numeric' });

  function render() {
    const root = document.getElementById('website-history-list');
    if (!root) return;
    if (!updates.length) {
      const empty = document.createElement('p'); empty.className = 'history-empty';
      empty.textContent = window.JWB_I18N?.t('historyEmpty') || '공개된 업데이트 내역이 없습니다.';
      root.replaceChildren(empty); return;
    }
    const groups = new Map();
    updates.forEach(update => {
      const date = new Date(update.published_at);
      const year = Number.isNaN(date.getTime()) ? '—' : String(date.getFullYear());
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year).push(update);
    });
    root.replaceChildren(...[...groups.entries()].map(([year, items]) => {
      const group = document.createElement('section'); group.className = 'website-history-year';
      const heading = document.createElement('h3'); heading.className = 'website-history-year-label'; heading.textContent = year;
      const list = document.createElement('div'); list.className = 'website-history-year-list';
      items.forEach(update => {
        const article = document.createElement('article'); article.className = 'website-history-entry';
        const meta = document.createElement('div'); meta.className = 'website-history-entry-meta';
        const date = document.createElement('time'); date.dateTime = update.published_at; date.textContent = dateLabel(update.published_at);
        const category = document.createElement('span'); category.className = 'website-history-category'; category.dataset.updateCategory = update.category; category.textContent = categoryLabel(update.category);
        meta.append(date, category);
        const title = document.createElement('h4'); title.textContent = update.title;
        const version = update.version ? document.createElement('span') : null;
        if (version) { version.className = 'website-history-version'; version.textContent = update.version; }
        const summary = update.summary ? document.createElement('p') : null;
        if (summary) { summary.className = 'website-history-summary'; summary.textContent = update.summary; }
        article.append(meta);
        if (version) article.append(version);
        article.append(title);
        if (summary) article.append(summary);
        if (update.content && update.content !== update.summary) {
          const details = document.createElement('details'); details.className = 'website-history-details';
          const summaryLabel = document.createElement('summary'); summaryLabel.textContent = window.JWB_I18N?.t('historyDetails') || '업데이트 상세 보기';
          const content = document.createElement('p'); content.textContent = update.content;
          details.append(summaryLabel, content); article.append(details);
        }
        list.append(article);
      });
      group.append(heading, list); return group;
    }));
  }

  async function load() {
    const root = document.getElementById('website-history-list');
    if (!root) return;
    if (!client) {
      const message = document.createElement('p'); message.className = 'history-empty';
      message.textContent = window.JWB_I18N?.t('historyError') || '업데이트 내역을 불러오지 못했습니다.';
      root.replaceChildren(message); return;
    }
    const { data, error } = await client.from('website_updates')
      .select('id,title,category,summary,content,version,published_at')
      .eq('is_published', true)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });
    if (error) {
      const message = document.createElement('p'); message.className = 'history-empty';
      message.textContent = window.JWB_I18N?.t('historyError') || '업데이트 내역을 불러오지 못했습니다.';
      root.replaceChildren(message); return;
    }
    updates = data || [];
    render();
    window.addEventListener('jwb:languagechange', render);
  }
  document.addEventListener('DOMContentLoaded', load);
})();
