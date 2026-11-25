const PROFILE_ENTRY_GROUPS = [
  { type: 'education', title: { ko: '학력', en: 'EDUCATION', ja: '学歴' } },
  { type: 'certification', title: { ko: '자격증', en: 'CERTIFICATIONS', ja: '資格' } },
  { type: 'training', title: { ko: '교육·훈련', en: 'TRAINING', ja: '教育・研修' } },
  { type: 'career', title: { ko: '경력', en: 'EXPERIENCE', ja: '職歴' } }
];

let profileEntries = [];

function renderProfileEntries(container, entries) {
  profileEntries = entries;
  const language = window.JWB_I18N?.language || 'ko';
  const groups = PROFILE_ENTRY_GROUPS.map(group => ({
    ...group,
    entries: entries.filter(entry => entry.entry_type === group.type)
  })).filter(group => group.entries.length);

  if (!groups.length) {
    const empty = document.createElement('p'); empty.className = 'body-text';
    empty.textContent = language === 'en' ? 'No profile history has been added.' : language === 'ja' ? '登録されたプロフィール情報はありません。' : '등록된 경력·학력·교육·자격증 이력이 없습니다.';
    container.replaceChildren(empty);
    return;
  }

  container.replaceChildren(...groups.map((group, groupIndex) => {
    const section = document.createElement('div');
    section.className = `history-item${groupIndex ? ' mt-30' : ''}`;
    const heading = document.createElement('h4'); heading.textContent = group.title[language] || group.title.ko;
    const list = document.createElement('ul');
    group.entries.forEach(entry => {
      const item = document.createElement('li');
      item.textContent = [entry.organization, entry.title, entry.period, entry.description]
        .filter(value => String(value || '').trim())
        .join(' · ');
      list.append(item);
    });
    section.append(heading, list);
    return section;
  }));
}

async function loadProfileEntries() {
  const container = document.getElementById('profile-history');
  const client = window.getJwbSupabase?.();
  if (!container || !client) return;
  const { data, error } = await client.from('profile_entries')
    .select('id,entry_type,title,organization,period,description,sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });
  if (error) {
    console.warn('프로필 이력을 불러오지 못했습니다.', error.message);
    return;
  }
  renderProfileEntries(container, data || []);
}

document.addEventListener('DOMContentLoaded', loadProfileEntries);
window.addEventListener('jwb:languagechange', () => {
  const container = document.getElementById('profile-history');
  if (container && profileEntries.length) renderProfileEntries(container, profileEntries);
});
