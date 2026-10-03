document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const siteNavMenu = document.getElementById('site-nav-menu');
  if (!navbar || !menuToggle || !siteNavMenu) return;

  const setMenuOpen = open => {
    siteNavMenu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    menuToggle.classList.toggle('is-open', open);
  };

  menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
  siteNavMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('click', event => {
    if (menuToggle.getAttribute('aria-expanded') === 'true' && !event.target.closest('#navbar')) setMenuOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) setMenuOpen(false); });
});
