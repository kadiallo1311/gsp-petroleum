/**
 * Color & i18n injection script
 * - Replaces navy → black palette
 * - Replaces gold → orange palette
 * - Updates Tailwind config colors
 * - Adds lang-switcher to header in all pages
 * - Adds data-i18n to nav links
 * - Adds <script src="js/i18n.js"> to all pages
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES = ['index.html','activites.html','partenariats.html','equipe.html','contact.html'];

// ── Color replacements ──────────────────────────────────────────
const COLOR_MAP = [
  // Exact hex values
  [/#1A3E5C/gi,          '#111111'],
  [/#0F2A3F/gi,          '#0A0A0A'],
  [/#B8935F/gi,          '#FF6B00'],
  [/#E8D9B8/gi,          '#FFD4A8'],
  [/#a07848/gi,          '#e05500'],
  [/#b8935f/gi,          '#FF6B00'],
  // Tailwind named colors in config
  [/navy:\s*['"]#1A3E5C['"]/gi,       "navy: '#111111'"],
  [/'dark-navy':\s*['"]#0F2A3F['"]/gi,"'dark-navy': '#0A0A0A'"],
  [/gold:\s*['"]#B8935F['"]/gi,       "gold: '#FF6B00'"],
  [/'light-gold':\s*['"]#E8D9B8['"]/gi,"'light-gold': '#FFD4A8'"],
  // rgba equivalents
  [/rgba\(184,147,95,/gi,   'rgba(255,107,0,'],
  [/rgba\(184, 147, 95,/gi, 'rgba(255, 107, 0,'],
  [/rgba\(15,42,63,/gi,     'rgba(10,10,10,'],
  [/rgba\(15, 42, 63,/gi,   'rgba(10, 10, 10,'],
  [/rgba\(26,62,92,/gi,     'rgba(17,17,17,'],
  [/rgba\(26, 62, 92,/gi,   'rgba(17, 17, 17,'],
  // theme-color meta
  [/content="#0F2A3F"/g,    'content="#0A0A0A"'],
  [/content="#1A3E5C"/g,    'content="#111111"'],
  // text-navy / bg-navy inline Tailwind
  [/text-navy/g,  'text-[#111111]'],
  [/bg-navy/g,    'bg-[#111111]'],
  [/text-gold/g,  'text-[#FF6B00]'],
  [/bg-gold/g,    'bg-[#FF6B00]'],
  [/hover:text-gold/g, 'hover:text-[#FF6B00]'],
  [/hover:border-gold/g, 'hover:border-[#FF6B00]'],
  // inline style colors
  [/color:#1A3E5C/gi, 'color:#111111'],
  [/color:#0F2A3F/gi, 'color:#0A0A0A'],
  [/color:#B8935F/gi, 'color:#FF6B00'],
  [/color:#E8D9B8/gi, 'color:#FFD4A8'],
  [/background:#B8935F/gi, 'background:#FF6B00'],
  [/background:#1A3E5C/gi, 'background:#111111'],
  [/stroke="#B8935F"/gi, 'stroke="#FF6B00"'],
  [/stroke="#1A3E5C"/gi, 'stroke="#111111"'],
];

// ── Language switcher HTML block ────────────────────────────────
const LANG_SWITCHER = `
      <!-- Lang switcher -->
      <div class="lang-switcher" style="margin-right:0.5rem">
        <button class="lang-btn" data-lang="fr" aria-label="Français">FR</button>
        <button class="lang-btn" data-lang="en" aria-label="English">EN</button>
      </div>`;

// ── data-i18n nav injection ─────────────────────────────────────
// Desktop nav links per page
const NAV_I18N = {
  'index.html':       { home:'active', act:'', part:'', team:'', contact:'' },
  'activites.html':   { home:'', act:'active', part:'', team:'', contact:'' },
  'partenariats.html':{ home:'', act:'', part:'active', team:'', contact:'' },
  'equipe.html':      { home:'', act:'', part:'', team:'active', contact:'' },
  'contact.html':     { home:'', act:'', part:'', team:'', contact:'active' },
};

function buildDesktopNav(page) {
  const s = NAV_I18N[page] || NAV_I18N['index.html'];
  return `
    <!-- Desktop Nav -->
    <nav class="desktop-nav flex items-center gap-1">
      <a href="index.html" class="nav-link px-4 py-2 text-sm font-medium text-[#3A3A3A] rounded transition-colors${s.home ? ' active' : ''}" data-i18n="nav.home">Accueil</a>
      <a href="activites.html" class="nav-link px-4 py-2 text-sm font-medium text-[#3A3A3A] rounded transition-colors${s.act ? ' active' : ''}" data-i18n="nav.activities">Activités</a>
      <a href="partenariats.html" class="nav-link px-4 py-2 text-sm font-medium text-[#3A3A3A] rounded transition-colors${s.part ? ' active' : ''}" data-i18n="nav.partners">Partenariats</a>
      <a href="equipe.html" class="nav-link px-4 py-2 text-sm font-medium text-[#3A3A3A] rounded transition-colors${s.team ? ' active' : ''}" data-i18n="nav.team">Équipe</a>
      <a href="contact.html" class="nav-link px-4 py-2 text-sm font-medium text-[#3A3A3A] rounded transition-colors${s.contact ? ' active' : ''}" data-i18n="nav.contact">Contact</a>
    </nav>`;
}

function buildMobileNav() {
  return `<nav id="mobile-menu" class="mobile-menu">
  <div class="flex justify-between items-center mb-8">
    <span class="text-white font-bold text-sm tracking-widest uppercase">Menu</span>
    <button id="menu-close" class="text-white p-1" aria-label="Fermer">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
  </div>
  <a href="index.html" class="nav-link" data-i18n="nav.home">Accueil</a>
  <a href="activites.html" class="nav-link" data-i18n="nav.activities">Activités</a>
  <a href="partenariats.html" class="nav-link" data-i18n="nav.partners">Partenariats</a>
  <a href="equipe.html" class="nav-link" data-i18n="nav.team">Équipe</a>
  <a href="contact.html" class="nav-link" data-i18n="nav.contact">Contact</a>
  <a href="contact.html" class="mt-6 block text-center font-semibold text-sm px-5 py-2.5 rounded" style="color:white;background:#FF6B00" data-i18n="nav.cta">Nous contacter</a>
</nav>`;
}

// ── Process each page ───────────────────────────────────────────
PAGES.forEach(page => {
  const filePath = path.join(ROOT, page);
  if (!fs.existsSync(filePath)) { console.log(`⚠  Skipped (not found): ${page}`); return; }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Color replacements
  COLOR_MAP.forEach(([from, to]) => { html = html.replace(from, () => to); });

  // 2. Replace mobile menu block (keep active class per page)
  const mobileActive = NAV_I18N[page] || {};
  let mobileNav = buildMobileNav();
  // Re-add active on current page
  if (page === 'index.html')       mobileNav = mobileNav.replace('href="index.html" class="nav-link"', 'href="index.html" class="nav-link active"');
  if (page === 'activites.html')   mobileNav = mobileNav.replace('href="activites.html" class="nav-link"', 'href="activites.html" class="nav-link active"');
  if (page === 'partenariats.html')mobileNav = mobileNav.replace('href="partenariats.html" class="nav-link"', 'href="partenariats.html" class="nav-link active"');
  if (page === 'equipe.html')      mobileNav = mobileNav.replace('href="equipe.html" class="nav-link"', 'href="equipe.html" class="nav-link active"');
  if (page === 'contact.html')     mobileNav = mobileNav.replace('href="contact.html" class="nav-link"', 'href="contact.html" class="nav-link active"');

  html = html.replace(/<nav id="mobile-menu"[\s\S]*?<\/nav>/, mobileNav);

  // 3. Replace desktop nav
  const desktopNav = buildDesktopNav(page);
  html = html.replace(
    /<!-- Desktop Nav -->[\s\S]*?<\/nav>/,
    desktopNav.trim()
  );

  // 4. Add lang-switcher before hamburger button (CTA+hamburger div)
  if (!html.includes('lang-switcher')) {
    html = html.replace(
      /(<div class="flex items-center gap-3">)/,
      `<div class="flex items-center gap-3">${LANG_SWITCHER}`
    );
  }

  // 5. Add i18n.js script before main.js
  if (!html.includes('js/i18n.js')) {
    html = html.replace(
      '<script src="js/main.js"></script>',
      '<script src="js/i18n.js"></script>\n<script src="js/main.js"></script>'
    );
  }

  // 6. Update CTA button color
  html = html.replace(
    /onmouseover="this\.style\.background='#a07848'" onmouseout="this\.style\.background='#B8935F'"/gi,
    "onmouseover=\"this.style.background='#e05500'\" onmouseout=\"this.style.background='#FF6B00'\""
  );
  html = html.replace(
    /onmouseover="this\.style\.background='#e05500'" onmouseout="this\.style\.background='#B8935F'"/gi,
    "onmouseover=\"this.style.background='#e05500'\" onmouseout=\"this.style.background='#FF6B00'\""
  );

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅  ${page}`);
});

console.log('\nDone — colors updated + lang-switcher + i18n.js injected.');
