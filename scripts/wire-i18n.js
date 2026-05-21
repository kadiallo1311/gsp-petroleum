/**
 * wire-i18n.js
 * ─────────────────────────────────────────────────────────────────
 * 1. Expands js/i18n.js with missing EN/FR translation keys
 * 2. Adds data-i18n attributes to all un-wired elements in all 5 pages
 * ─────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

/* ─── 1. UPDATE i18n.js ────────────────────────────────────────── */
let i18n = fs.readFileSync(path.join(ROOT,'js','i18n.js'), 'utf8');

// Fix KWM translations (CI-free)
i18n = i18n.replace(
  /'act\.kwm\.p':\s*'Véhicule d\'expansion du Groupe GSP dans la sous-région ouest-africaine, dédié aux activités minières et à l\'industrie céramique\.'/,
  "'act.kwm.p':   'Véhicule d\\'expansion du Groupe GSP dans la sous-région ouest-africaine, dédié aux activités minières et à l\\'industrie céramique.'"
);
i18n = i18n.replace(
  /'act\.kwm\.p':\s*'GSP Group\'s expansion vehicle in Côte d\'Ivoire[^']*'/,
  "'act.kwm.p':   'GSP Group\\'s expansion vehicle in West Africa\\'s sub-region, dedicated to mining activities and the industrial ceramics industry.'"
);

// Add new page-level keys just before the closing en: { ... } brace
const NEW_EN_KEYS = `
    /* ── Page banners ── */
    'act.page.title':  'Our Activities',
    'act.page.sub':    'Five complementary business branches serving West African industrialisation.',
    'act.page.h1':     'Our Activities',
    'part.page.title': 'Our Partnerships',
    'part.page.sub':   'Six structured international partnerships across four continents.',
    'equipe.page.h1':  'Our Team',
    'contact.page.h1': 'Contact Us',
    /* ── CTA shared ── */
    'cta.contact.btn': 'Contact us',
    'cta.team.btn':    'Meet our team',`;

const NEW_FR_KEYS = `
    /* ── Page banners ── */
    'act.page.title':  'Nos Activités',
    'act.page.sub':    'Cinq branches d\'activités complémentaires au service de l\'industrialisation ouest-africaine.',
    'act.page.h1':     'Nos Activités',
    'part.page.title': 'Nos Partenariats',
    'part.page.sub':   'Six partenariats internationaux structurés sur quatre continents.',
    'equipe.page.h1':  'Notre Équipe',
    'contact.page.h1': 'Nous Contacter',
    /* ── CTA shared ── */
    'cta.contact.btn': 'Nous contacter',
    'cta.team.btn':    'Découvrir notre équipe',`;

// Insert new FR keys before `  },` that closes the fr section
i18n = i18n.replace(
  /(\/\* ── Equipe page ── \*\/[\s\S]*?'team\.intro':[^\n]+\n\s*),\n(\s*\}\s*\n\s*en:)/,
  (m, last, endFr) => last + ',\n' + NEW_FR_KEYS + '\n  ' + endFr.trim().replace(/^,/, '')
);
// Insert new EN keys before the final }; of the object
i18n = i18n.replace(
  /(\/\* ── Equipe page ── \*\/[\s\S]*?'team\.intro':[^\n]+\n\s*)(}\s*\})/m,
  (m, last, closing) => last + NEW_EN_KEYS + '\n  ' + closing
);

fs.writeFileSync(path.join(ROOT,'js','i18n.js'), i18n, 'utf8');
console.log('✅  js/i18n.js expanded');

/* ─── Helper: replace all in string ───────────────────────────── */
function rr(html, patterns) {
  patterns.forEach(([from, to]) => {
    if (from instanceof RegExp) {
      html = html.replace(from, to);
    } else {
      // string replace — must be exact
      if (html.includes(from)) {
        html = html.split(from).join(to);
      }
    }
  });
  return html;
}

/* ─── 2. INDEX.HTML ─────────────────────────────────────────────── */
let index = fs.readFileSync(path.join(ROOT,'index.html'),'utf8');

index = rr(index, [
  // Group section ──────────────────────────────────────────────
  ['<div class="badge-gsp"><span class="badge-dot"></span>Notre Groupe</div>',
   '<div class="badge-gsp"><span class="badge-dot"></span><span data-i18n="group.badge">Notre Groupe</span></div>'],

  ['<h2 class="font-serif font-bold text-[#111111] text-3xl md:text-4xl mb-6" style="color:#111111">\n        Une plateforme industrielle articulée<br/>autour de cinq branches\n      </h2>',
   '<h2 class="font-serif font-bold text-[#111111] text-3xl md:text-4xl mb-6" style="color:#111111" data-i18n="group.title">Une plateforme industrielle articulée<br/>autour de cinq branches</h2>'],

  ['<p class="reveal text-[#4b5563] leading-relaxed" style="font-size:1.025rem" data-delay="0.08">\n        General Service Petroleum (GSP)',
   '<p class="reveal text-[#4b5563] leading-relaxed" style="font-size:1.025rem" data-delay="0.08" data-i18n="group.p1">\n        General Service Petroleum (GSP)'],

  ['<p class="reveal text-[#4b5563] leading-relaxed" style="font-size:1.025rem" data-delay="0.16">\n        Nos partenariats internationaux',
   '<p class="reveal text-[#4b5563] leading-relaxed" style="font-size:1.025rem" data-delay="0.16" data-i18n="group.p2">\n        Nos partenariats internationaux'],

  // Activities section ─────────────────────────────────────────
  ['<div class="badge-gsp"><span class="badge-dot"></span>Nos Activités</div>',
   '<div class="badge-gsp"><span class="badge-dot"></span><span data-i18n="act.badge">Nos Activités</span></div>'],

  ['<h2 class="font-serif font-bold text-3xl md:text-4xl mt-1" style="color:#111111">Cinq branches d\'activités complémentaires</h2>',
   '<h2 class="font-serif font-bold text-3xl md:text-4xl mt-1" style="color:#111111" data-i18n="act.title">Cinq branches d\'activités complémentaires</h2>'],

  // Activity cards h3/p/link ───────────────────────────────────
  ['<h3 class="font-serif font-bold text-lg mb-2" style="color:#111111">Industries Extractives</h3>',
   '<h3 class="font-serif font-bold text-lg mb-2" style="color:#111111" data-i18n="act.a1.h">Industries Extractives</h3>'],

  ['<p class="text-sm text-[#6B6B6B] leading-relaxed mb-4">Exploitation de matériaux extractifs',
   '<p class="text-sm text-[#6B6B6B] leading-relaxed mb-4" data-i18n="act.a1.p">Exploitation de matériaux extractifs'],

  ['<h3 class="font-serif font-bold text-lg mb-2" style="color:#111111">Distribution d\'Hydrocarbures</h3>',
   '<h3 class="font-serif font-bold text-lg mb-2" style="color:#111111" data-i18n="act.a2.h">Distribution d\'Hydrocarbures</h3>'],

  ['<p class="text-sm text-[#6B6B6B] leading-relaxed mb-4">Distribution de produits pétroliers',
   '<p class="text-sm text-[#6B6B6B] leading-relaxed mb-4" data-i18n="act.a2.p">Distribution de produits pétroliers'],

  ['<h3 class="font-serif font-bold text-lg mb-2" style="color:#111111">Santé Numérique</h3>',
   '<h3 class="font-serif font-bold text-lg mb-2" style="color:#111111" data-i18n="act.a3.h">Santé Numérique</h3>'],

  ['<p class="text-sm text-[#6B6B6B] leading-relaxed mb-4">Déploiement du premier réseau',
   '<p class="text-sm text-[#6B6B6B] leading-relaxed mb-4" data-i18n="act.a3.p">Déploiement du premier réseau'],

  ['<h3 class="font-serif font-bold text-lg mb-2" style="color:#111111">Économie Circulaire</h3>',
   '<h3 class="font-serif font-bold text-lg mb-2" style="color:#111111" data-i18n="act.a4.h">Économie Circulaire</h3>'],

  ['<p class="text-sm text-[#6B6B6B] leading-relaxed mb-4">Production de bio-méthanol',
   '<p class="text-sm text-[#6B6B6B] leading-relaxed mb-4" data-i18n="act.a4.p">Production de bio-méthanol'],

  ['<h3 class="font-serif font-bold text-lg mb-2" style="color:#111111">Logistique Industrielle</h3>',
   '<h3 class="font-serif font-bold text-lg mb-2" style="color:#111111" data-i18n="act.a5.h">Logistique Industrielle</h3>'],

  ['<p class="text-sm text-[#6B6B6B] leading-relaxed mb-4">Structuration d\'une flotte logistique',
   '<p class="text-sm text-[#6B6B6B] leading-relaxed mb-4" data-i18n="act.a5.p">Structuration d\'une flotte logistique'],

  // KWM card ───────────────────────────────────────────────────
  ['<div class="text-xs font-bold tracking-[0.14em] uppercase mb-3" style="color:#FF6B00">Expansion régionale</div>',
   '<div class="text-xs font-bold tracking-[0.14em] uppercase mb-3" style="color:#FF6B00" data-i18n="act.kwm.tag">Expansion régionale</div>'],

  ['<p class="text-sm text-white/55 leading-relaxed mb-5">Véhicule d\'expansion du Groupe GSP dans la sous-région',
   '<p class="text-sm text-white/55 leading-relaxed mb-5" data-i18n="act.kwm.p">Véhicule d\'expansion du Groupe GSP dans la sous-région'],

  // "En savoir plus" links — wrap text in span ─────────────────
  [/<a href="activites\.html#extractive"([^>]*)>\s*En savoir plus(\s*<svg)/g,
   '<a href="activites.html#extractive"$1><span data-i18n="act.more">En savoir plus</span>$2'],
  [/<a href="activites\.html#hydrocarbures"([^>]*)>\s*En savoir plus(\s*<svg)/g,
   '<a href="activites.html#hydrocarbures"$1><span data-i18n="act.more">En savoir plus</span>$2'],
  [/<a href="activites\.html#sante"([^>]*)>\s*En savoir plus(\s*<svg)/g,
   '<a href="activites.html#sante"$1><span data-i18n="act.more">En savoir plus</span>$2'],
  [/<a href="activites\.html#circulaire"([^>]*)>\s*En savoir plus(\s*<svg)/g,
   '<a href="activites.html#circulaire"$1><span data-i18n="act.more">En savoir plus</span>$2'],
  [/<a href="activites\.html#logistique"([^>]*)>\s*En savoir plus(\s*<svg)/g,
   '<a href="activites.html#logistique"$1><span data-i18n="act.more">En savoir plus</span>$2'],
  [/<a href="activites\.html#kwm"([^>]*)>\s*En savoir plus(\s*<svg)/g,
   '<a href="activites.html#kwm"$1><span data-i18n="act.more">En savoir plus</span>$2'],

  // Partners section ───────────────────────────────────────────
  ['<div class="badge-gsp"><span class="badge-dot"></span>Notre Réseau</div>',
   '<div class="badge-gsp"><span class="badge-dot"></span><span data-i18n="part.badge">Notre Réseau</span></div>'],

  ['<h2 class="font-serif font-bold text-3xl md:text-4xl mt-1 mb-4" style="color:#111111">Des partenariats structurés sur quatre continents</h2>',
   '<h2 class="font-serif font-bold text-3xl md:text-4xl mt-1 mb-4" style="color:#111111" data-i18n="part.title">Des partenariats structurés sur quatre continents</h2>'],

  ['<p class="text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed">\n        Notre développement s\'appuie sur',
   '<p class="text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed" data-i18n="part.sub">\n        Notre développement s\'appuie sur'],

  ['>Découvrir nos partenariats →\n      </a>',
   '><span data-i18n="part.more">Découvrir nos partenariats →</span>\n      </a>'],

  // Compliance section ─────────────────────────────────────────
  ['<span style="background:#FFD4A8" class="badge-dot"></span>Réglementation & Gouvernance</div>',
   '<span style="background:#FFD4A8" class="badge-dot"></span><span data-i18n="comp.badge">Réglementation & Gouvernance</span></div>'],

  ['<h2 class="font-serif font-bold text-white text-3xl md:text-4xl mt-2">Un opérateur structuré et conforme</h2>',
   '<h2 class="font-serif font-bold text-white text-3xl md:text-4xl mt-2" data-i18n="comp.title">Un opérateur structuré et conforme</h2>'],

  ['<h3 class="font-semibold text-white text-sm">Licence hydrocarbures</h3>',
   '<h3 class="font-semibold text-white text-sm" data-i18n="comp.c1.h">Licence hydrocarbures</h3>'],
  ['<p class="text-sm text-white/50 leading-relaxed">Arrêté ministériel n° 001481',
   '<p class="text-sm text-white/50 leading-relaxed" data-i18n="comp.c1.p">Arrêté ministériel n° 001481'],

  ['<h3 class="font-semibold text-white text-sm">Conformité OHADA</h3>',
   '<h3 class="font-semibold text-white text-sm" data-i18n="comp.c2.h">Conformité OHADA</h3>'],
  ['<p class="text-sm text-white/50 leading-relaxed">Société constituée et opérée',
   '<p class="text-sm text-white/50 leading-relaxed" data-i18n="comp.c2.p">Société constituée et opérée'],

  ['<h3 class="font-semibold text-white text-sm">Standards SYSCOHADA</h3>',
   '<h3 class="font-semibold text-white text-sm" data-i18n="comp.c3.h">Standards SYSCOHADA</h3>'],
  ['<p class="text-sm text-white/50 leading-relaxed">États financiers annuels',
   '<p class="text-sm text-white/50 leading-relaxed" data-i18n="comp.c3.p">États financiers annuels'],

  ['<h3 class="font-semibold text-white text-sm">Visée ISCC EU</h3>',
   '<h3 class="font-semibold text-white text-sm" data-i18n="comp.c4.h">Visée ISCC EU</h3>'],
  ['<p class="text-sm text-white/50 leading-relaxed">Alignement de notre projet bio-méthanol',
   '<p class="text-sm text-white/50 leading-relaxed" data-i18n="comp.c4.p">Alignement de notre projet bio-méthanol'],

  // Stats section ──────────────────────────────────────────────
  ['<div class="badge-gsp"><span class="badge-dot"></span>Perspectives</div>',
   '<div class="badge-gsp"><span class="badge-dot"></span><span data-i18n="stats.badge">Perspectives</span></div>'],
  ['<h2 class="font-serif font-bold text-3xl md:text-4xl mt-1" style="color:#111111">Une dynamique en construction</h2>',
   '<h2 class="font-serif font-bold text-3xl md:text-4xl mt-1" style="color:#111111" data-i18n="stats.title">Une dynamique en construction</h2>'],

  // CTA section ────────────────────────────────────────────────
  ['<h2 class="font-serif font-bold text-3xl md:text-4xl mb-4" style="color:#111111">Construisons ensemble</h2>',
   '<h2 class="font-serif font-bold text-3xl md:text-4xl mb-4" style="color:#111111" data-i18n="cta.title">Construisons ensemble</h2>'],
  ['<p class="mb-10 leading-relaxed" style="color:#111111;opacity:0.8">\n      Partenaires industriels',
   '<p class="mb-10 leading-relaxed" style="color:#111111;opacity:0.8" data-i18n="cta.sub">\n      Partenaires industriels'],
  ['onmouseout="this.style.background=\'#111111\'">\n        Nous contacter\n      </a>',
   'onmouseout="this.style.background=\'#111111\'"><span data-i18n="cta.btn1">Nous contacter</span></a>'],
  ['onmouseout="this.style.background=\'transparent\'">\n        Découvrir notre équipe\n      </a>',
   'onmouseout="this.style.background=\'transparent\'"><span data-i18n="cta.btn2">Découvrir notre équipe</span></a>'],

  // Footer labels ──────────────────────────────────────────────
  [/<h4 class="text-xs font-bold tracking-\[0\.14em\] uppercase mb-5" style="color:#FF6B00">Navigation<\/h4>/,
   '<h4 class="text-xs font-bold tracking-[0.14em] uppercase mb-5" style="color:#FF6B00" data-i18n="footer.nav">Navigation</h4>'],
  [/<h4 class="text-xs font-bold tracking-\[0\.14em\] uppercase mb-5" style="color:#FF6B00">Contact<\/h4>/,
   '<h4 class="text-xs font-bold tracking-[0.14em] uppercase mb-5" style="color:#FF6B00" data-i18n="footer.contact">Contact</h4>'],
  ['© <span class="footer-year"></span> General Service Petroleum. Tous droits réservés.',
   '© <span class="footer-year"></span> General Service Petroleum. <span data-i18n="footer.rights">Tous droits réservés.</span>'],
]);

fs.writeFileSync(path.join(ROOT,'index.html'), index, 'utf8');
console.log('✅  index.html wired');

/* ─── 3. CONTACT.HTML ───────────────────────────────────────────── */
let contact = fs.readFileSync(path.join(ROOT,'contact.html'),'utf8');

contact = rr(contact, [
  // Page banner h1 ─────────────────────────────────────────────
  [/<h1 ([^>]*)>Nous Contacter<\/h1>/,
   '<h1 $1 data-i18n="contact.page.h1">Nous Contacter</h1>'],
  [/<h1 ([^>]*)>Contact Us<\/h1>/,
   '<h1 $1 data-i18n="contact.page.h1">Contact Us</h1>'],

  // Form placeholders already handled by applyTranslations for INPUT/TEXTAREA
  // Add data-i18n to form labels ───────────────────────────────
  [/placeholder="Nom complet"/g, 'placeholder="Nom complet" data-i18n="contact.form.name"'],
  [/placeholder="Adresse e-mail"/g, 'placeholder="Adresse e-mail" data-i18n="contact.form.email"'],
  [/placeholder="Téléphone \(optionnel\)"/g, 'placeholder="Téléphone (optionnel)" data-i18n="contact.form.phone"'],
  [/placeholder="Objet de votre message"/g, 'placeholder="Objet de votre message" data-i18n="contact.form.subject"'],
  [/placeholder="Votre message\.\.\."/, 'placeholder="Votre message..." data-i18n="contact.form.message"'],

  // Footer labels ──────────────────────────────────────────────
  [/<h4 ([^>]*)>Navigation<\/h4>/, '<h4 $1 data-i18n="footer.nav">Navigation</h4>'],
  [/<h4 ([^>]*)>Contact<\/h4>/, '<h4 $1 data-i18n="footer.contact">Contact</h4>'],
  ['Tous droits réservés.', '<span data-i18n="footer.rights">Tous droits réservés.</span>'],
]);

fs.writeFileSync(path.join(ROOT,'contact.html'), contact, 'utf8');
console.log('✅  contact.html wired');

/* ─── 4. EQUIPE.HTML ────────────────────────────────────────────── */
let equipe = fs.readFileSync(path.join(ROOT,'equipe.html'),'utf8');

equipe = rr(equipe, [
  // Page banner h1 ─────────────────────────────────────────────
  ['<h1 class="font-serif font-bold text-white mb-2" style="font-size:clamp(1.8rem,4vw,3rem)">Notre Équipe</h1>',
   '<h1 class="font-serif font-bold text-white mb-2" style="font-size:clamp(1.8rem,4vw,3rem)" data-i18n="equipe.page.h1">Notre Équipe</h1>'],
  // Footer labels ──────────────────────────────────────────────
  [/<h4 ([^>]*)>Navigation<\/h4>/, '<h4 $1 data-i18n="footer.nav">Navigation</h4>'],
  [/<h4 ([^>]*)>Contact<\/h4>/, '<h4 $1 data-i18n="footer.contact">Contact</h4>'],
  ['Tous droits réservés.', '<span data-i18n="footer.rights">Tous droits réservés.</span>'],
]);

fs.writeFileSync(path.join(ROOT,'equipe.html'), equipe, 'utf8');
console.log('✅  equipe.html wired');

/* ─── 5. ACTIVITES.HTML ─────────────────────────────────────────── */
let activites = fs.readFileSync(path.join(ROOT,'activites.html'),'utf8');

activites = rr(activites, [
  // Page banner ─────────────────────────────────────────────────
  ['<h1 class="font-serif font-bold text-white mb-2" style="font-size:clamp(1.8rem,4vw,3rem)">Nos Activités</h1>',
   '<h1 class="font-serif font-bold text-white mb-2" style="font-size:clamp(1.8rem,4vw,3rem)" data-i18n="act.page.h1">Nos Activités</h1>'],
  ['<p class="text-sm" style="color:#FF6B00">Cinq branches d\'activités complémentaires au service de l\'industrialisation ouest-africaine</p>',
   '<p class="text-sm" style="color:#FF6B00" data-i18n="act.page.sub">Cinq branches d\'activités complémentaires au service de l\'industrialisation ouest-africaine</p>'],
  // Footer labels ──────────────────────────────────────────────
  [/<h4 ([^>]*)>Navigation<\/h4>/, '<h4 $1 data-i18n="footer.nav">Navigation</h4>'],
  [/<h4 ([^>]*)>Contact<\/h4>/, '<h4 $1 data-i18n="footer.contact">Contact</h4>'],
  ['Tous droits réservés.', '<span data-i18n="footer.rights">Tous droits réservés.</span>'],
]);

fs.writeFileSync(path.join(ROOT,'activites.html'), activites, 'utf8');
console.log('✅  activites.html wired');

/* ─── 6. PARTENARIATS.HTML ──────────────────────────────────────── */
let partners = fs.readFileSync(path.join(ROOT,'partenariats.html'),'utf8');

partners = rr(partners, [
  // Page banner ─────────────────────────────────────────────────
  ['<h1 class="font-serif font-bold text-white mb-2" style="font-size:clamp(1.8rem,4vw,3rem)">Nos Partenariats</h1>',
   '<h1 class="font-serif font-bold text-white mb-2" style="font-size:clamp(1.8rem,4vw,3rem)" data-i18n="part.page.title">Nos Partenariats</h1>'],
  ['<p class="text-sm" style="color:#FF6B00">Six partenariats internationaux structurés sur quatre continents</p>',
   '<p class="text-sm" style="color:#FF6B00" data-i18n="part.page.sub">Six partenariats internationaux structurés sur quatre continents</p>'],
  // Footer labels ──────────────────────────────────────────────
  [/<h4 ([^>]*)>Navigation<\/h4>/, '<h4 $1 data-i18n="footer.nav">Navigation</h4>'],
  [/<h4 ([^>]*)>Contact<\/h4>/, '<h4 $1 data-i18n="footer.contact">Contact</h4>'],
  ['Tous droits réservés.', '<span data-i18n="footer.rights">Tous droits réservés.</span>'],
]);

fs.writeFileSync(path.join(ROOT,'partenariats.html'), partners, 'utf8');
console.log('✅  partenariats.html wired');

console.log('\n✅  All pages wired with i18n attributes.');
