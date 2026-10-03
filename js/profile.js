const PROFILE_ENTRY_GROUPS = [
  { type: 'education', title: 'EDUCATION' },
  { type: 'training', title: '교육·훈련' },
  { type: 'career', title: 'EXPERIENCE' }
];

function renderProfileEntries(container, entries) {
  const groups = PROFILE_ENTRY_GROUPS.map(group => ({
    ...group,
    entries: entries.filter(entry => entry.entry_type === group.type)
  })).filter(group => group.entries.length);

  if (!groups.length) {
    const empty = document.createElement('p'); empty.className = 'body-text';
    empty.textContent = '등록된 경력·학력·교육 이력이 없습니다.';
    container.replaceChildren(empty);
    return;
  }

  container.replaceChildren(...groups.map((group, groupIndex) => {
    const section = document.createElement('div');
    section.className = `history-item${groupIndex ? ' mt-30' : ''}`;
    const heading = document.createElement('h4'); heading.textContent = group.title;
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
