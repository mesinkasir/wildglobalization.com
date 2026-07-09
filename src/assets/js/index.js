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
		document.body.style.overflow = '';
	}

	function openMenu() {
		mobileNav.classList.add('is-open');
		if (mobileOverlay) mobileOverlay.classList.add('is-open');
		menuToggle.setAttribute('aria-expanded', 'true');
		document.body.style.overflow = 'hidden';
	}

	menuToggle.addEventListener('click', (e) => {
		e.stopPropagation();
		const isOpen = mobileNav.classList.contains('is-open');
		if (isOpen) {
			closeMenu();
		} else {
			openMenu();
		}
	});

	mobileNav.addEventListener('click', (event) => {
		if (event.target.closest('a')) {
			closeMenu();
		}
	});

	document.addEventListener('click', (event) => {
		const isOpen = mobileNav.classList.contains('is-open');
		if (!isOpen) return;

		const isClickInside = mobileNav.contains(event.target) || menuToggle.contains(event.target);
		if (!isClickInside) {
			closeMenu();
		}
	});

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