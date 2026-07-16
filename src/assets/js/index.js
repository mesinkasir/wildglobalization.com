const header = document.querySelector('[data-site-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const mobileOverlay = document.querySelector('[data-mobile-overlay]');

function syncHeader() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 48);
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

if (menuToggle && mobileNav) {
  function closeMenu() {
    mobileNav.classList.remove('is-open');
    if (mobileOverlay) mobileOverlay.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('is-active');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
  }

  function openMenu() {
    mobileNav.classList.add('is-open');
    if (mobileOverlay) mobileOverlay.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.classList.add('is-active');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mobileNav.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  const navItems = mobileNav.querySelectorAll('[data-nav-item]');
  navItems.forEach(item => {
    const toggle = item.querySelector('[data-nav-toggle]');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(other => {
          if (other !== item && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
          }
        });
        item.classList.toggle('is-open');
      });
    }
  });

  mobileNav.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (link && !link.closest('[data-nav-toggle]')) {
      closeMenu();
    }
  });

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMenu();
      menuToggle.focus();
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 820 && mobileNav.classList.contains('is-open')) {
        closeMenu();
      }
    }, 250);
  });
}

const timeline = document.querySelector('[data-timeline]');
if (timeline) {
  const buttons = [...timeline.querySelectorAll('[data-timeline-filter]')];
  const items = [...timeline.querySelectorAll('[data-timeline-item]')];
  const empty = timeline.querySelector('[data-timeline-empty]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.timelineFilter;
      let visibleCount = 0;

      buttons.forEach((candidate) => {
        candidate.classList.toggle('is-active', candidate === button);
      });

      items.forEach((item) => {
        const isVisible = filter === 'all' || item.dataset.category === filter;
        item.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      if (empty) {
        empty.hidden = visibleCount > 0;
      }
    });
  });
}