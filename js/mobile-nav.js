document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const siteNavMenu = document.getElementById('site-nav-menu');
  if (!navbar || !menuToggle || !siteNavMenu) return;
  const dropdowns = [...siteNavMenu.querySelectorAll('.nav-dropdown')];

  const setDropdownOpen = (item, open) => {
    const button = item?.querySelector('.nav-dropdown-toggle');
    const submenu = item?.querySelector('.nav-submenu');
    if (!button || !submenu) return;
    if (open) dropdowns.filter(other => other !== item).forEach(other => setDropdownOpen(other, false));
    item.classList.toggle('is-open', open);
    submenu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
  };
  const closeDropdowns = () => dropdowns.forEach(item => setDropdownOpen(item, false));
  const setMenuOpen = open => {
    if (!open) closeDropdowns();
    siteNavMenu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    menuToggle.classList.toggle('is-open', open);
  };

  menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
  dropdowns.forEach(item => item.querySelector('.nav-dropdown-toggle')?.addEventListener('click', event => {
    const button = event.currentTarget;
    setDropdownOpen(item, button.getAttribute('aria-expanded') !== 'true');
  }));
  siteNavMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('click', event => {
    if (!navbar.contains(event.target)) {
      closeDropdowns();
      if (menuToggle.getAttribute('aria-expanded') === 'true') setMenuOpen(false);
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const openItem = dropdowns.find(item => item.classList.contains('is-open'));
    if (openItem) {
      setDropdownOpen(openItem, false);
      openItem.querySelector('.nav-dropdown-toggle')?.focus();
      return;
    }
    if (menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 940) setMenuOpen(false); });
});
