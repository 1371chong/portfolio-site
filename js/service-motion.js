document.addEventListener('DOMContentLoaded', () => {
  const targets = [
    ...document.querySelectorAll('.outsourcing-hero-copy > *, .outsourcing-hero-art'),
    ...document.querySelectorAll('#service-packages .section-head > *, .service-package-card'),
    ...document.querySelectorAll('#inquiry-preparation .inquiry-prep-wrap > *, .inquiry-prep-list label'),
    ...document.querySelectorAll('#kmong-section .section-head, #kmong-section .kmong-card, #kmong-section .kmong-review-card')
  ];
  if (!targets.length || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('has-service-motion');
  targets.forEach(element => {
    element.classList.add('service-reveal');
    const siblings = element.parentElement ? [...element.parentElement.children].filter(child => targets.includes(child)) : [];
    const position = siblings.length > 1 ? siblings.indexOf(element) : 0;
    element.style.setProperty('--service-reveal-delay', `${Math.min(position * 60, 240)}ms`);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });
  targets.forEach(element => observer.observe(element));
});
