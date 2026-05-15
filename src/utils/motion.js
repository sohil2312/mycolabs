export function initHeaderState() {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

export function initAnimationPause() {
  const panels = document.querySelectorAll('.hero-command-panel, .product-detail-card');
  if (!panels.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
    });
  }, { threshold: 0 });

  panels.forEach((panel) => observer.observe(panel));
}

export function initReveals() {
  const elements = Array.from(document.querySelectorAll('.reveal'));
  if (!elements.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  document.documentElement.classList.add('js-reveals');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px'
  });

  elements.forEach((element) => observer.observe(element));
}
