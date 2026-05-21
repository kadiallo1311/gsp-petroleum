/* ============================================================
   GSP — General Service Petroleum | Main JavaScript
   ============================================================ */

// ---- Header scroll shadow ----
const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-md');
    } else {
      header.classList.remove('shadow-md');
    }
  });
}

// ---- Active nav link ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href && (href === currentPage || href.split('#')[0] === currentPage ||
      (currentPage === '' && href === 'index.html'))) {
    link.classList.add('active');
    link.style.color = '#FF6B00';
  }
});

// ---- Hamburger / mobile menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const menuOverlay = document.getElementById('menu-overlay');

function openMenu() {
  mobileMenu && mobileMenu.classList.add('open');
  menuOverlay && menuOverlay.classList.add('open');
  hamburger && hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu && mobileMenu.classList.remove('open');
  menuOverlay && menuOverlay.classList.remove('open');
  hamburger && hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openMenu);
if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  const closeBtn = document.getElementById('menu-close');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
}

// ---- Scroll Reveal ----
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ---- Counter animation ----
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();
  const isFloat = !Number.isInteger(target);

  (function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = prefix + (isFloat ? value.toFixed(0) : Math.round(value).toLocaleString('fr-FR')) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  })(start);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ---- Sticky activity nav ----
const activitySections = document.querySelectorAll('.activity-section');
const activityNavLinks = document.querySelectorAll('.activity-nav-link');

if (activitySections.length && activityNavLinks.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        activityNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  activitySections.forEach(s => sectionObserver.observe(s));
}

// ---- Contact form ----
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type=submit]');
    const origHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>&nbsp; Envoi…';

    await new Promise(r => setTimeout(r, 1500));

    contactForm.style.display = 'none';
    if (formSuccess) formSuccess.style.display = 'flex';
    btn.disabled = false;
    btn.innerHTML = origHTML;
  });
}

const resetBtn = document.getElementById('reset-form');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (contactForm) { contactForm.reset(); contactForm.style.display = ''; }
    if (formSuccess) formSuccess.style.display = 'none';
  });
}

// ---- Footer year ----
document.querySelectorAll('.footer-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ── HERO SLIDESHOW ─────────────────────────────────────────────
(function () {
  const slides   = document.querySelectorAll('.hero-slide');
  const dots     = document.querySelectorAll('.hero-dot');
  const progBar  = document.getElementById('hero-progress');
  const flash    = document.getElementById('hero-flash');
  const slideLabel = document.getElementById('hero-slide-label');
  const badgeText  = document.getElementById('hero-badge-text');
  const badgeLoc   = document.getElementById('hero-badge-loc');
  const slideNum   = document.getElementById('hero-slide-num');
  const slideName  = document.getElementById('hero-slide-name');
  if (!slides.length) return;

  const DURATION = 10000;
  let current = 0, timer;

  const slideData = [
    { badge: 'Industries Extractives & Minières', loc: 'Kédougou — Sénégal',      num: '01 / 02', name: 'Industries Extractives' },
    { badge: 'Distribution d\'Hydrocarbures',     loc: 'Axe Dakar-Thiès — Sénégal', num: '02 / 02', name: 'Hydrocarbures' }
  ];

  function updateBadge(idx) {
    const d = slideData[idx];
    if (badgeText) badgeText.textContent = d.badge;
    if (badgeLoc)  badgeLoc.textContent  = d.loc;
    if (slideNum)  slideNum.textContent  = d.num;
    if (slideName) slideName.textContent = d.name;
    // i18n override when translations loaded
    if (window.gspLang && window.GSP_TRANSLATIONS) {
      const t = window.GSP_TRANSLATIONS[window.gspLang];
      if (t) {
        if (badgeText) badgeText.textContent = t['hero.slide' + idx + '.badge'] || d.badge;
        if (badgeLoc)  badgeLoc.textContent  = t['hero.slide' + idx + '.loc']   || d.loc;
      }
    }
  }

  function resetProgress() {
    if (!progBar) return;
    progBar.classList.remove('running');
    void progBar.offsetWidth;
    progBar.classList.add('running');
  }

  function triggerFlash() {
    if (!flash) return;
    flash.classList.add('flash-in');
    setTimeout(() => {
      flash.classList.remove('flash-in');
      flash.classList.add('flash-out');
      setTimeout(() => flash.classList.remove('flash-out'), 900);
    }, 250);
  }

  function goToSlide(idx) {
    if (idx === current) return;
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    dots[current] && dots[current].setAttribute('aria-selected', 'false');

    current = idx;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
    dots[current] && dots[current].setAttribute('aria-selected', 'true');

    triggerFlash();
    updateBadge(current);

    if (slideLabel) {
      slideLabel.classList.remove('visible');
      setTimeout(() => slideLabel.classList.add('visible'), 800);
    }

    resetProgress();
  }

  function next() { goToSlide((current + 1) % slides.length); }

  function startTimer() { clearInterval(timer); timer = setInterval(next, DURATION); }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); startTimer(); });
  });

  // Init
  if (slideLabel) setTimeout(() => slideLabel.classList.add('visible'), 1000);
  updateBadge(0);
  resetProgress();
  startTimer();
})();

// ---- Hydrocarbures section — animations à l'entrée viewport ----
const hydroEls = document.querySelectorAll('.reveal-hydro, .reveal-hydro-delay, .reveal-hydro-delay2');
if (hydroEls.length) {
  const hydroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        hydroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  hydroEls.forEach(el => hydroObserver.observe(el));
}
