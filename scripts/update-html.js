/**
 * Met à jour logo + favicons sur toutes les pages HTML
 * node scripts/update-html.js
 */
const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const pages = ['activites.html', 'partenariats.html', 'equipe.html', 'contact.html'];

const FAVICONS = `
  <!-- Favicons -->
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicons/favicon-32x32.png"/>
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicons/favicon-16x16.png"/>
  <link rel="icon" type="image/png" sizes="192x192" href="images/favicons/favicon-192x192.png"/>
  <link rel="apple-touch-icon" sizes="180x180" href="images/favicons/apple-touch-icon.png"/>
  <meta name="theme-color" content="#0F2A3F"/>`;

// Logo header : <picture> WebP + PNG avec fallback texte
const LOGO_HEADER = `<a href="index.html" class="flex items-center gap-3" style="text-decoration:none">
      <picture>
        <source srcset="images/logo-gsp.webp" type="image/webp">
        <img src="images/logo-gsp.png" alt="General Services Petroleum" style="height:52px;width:auto;display:block"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      </picture>
      <div class="items-center gap-2.5" style="display:none">
        <div style="width:46px;height:46px;background:#111;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-style:italic;color:white;font-size:19px;font-family:'Arial Black',Arial,sans-serif">GP</div>
        <div><div style="font-weight:800;font-size:12px;color:#111;font-family:'Arial Black',Arial,sans-serif;letter-spacing:0.05em;line-height:1.2">GENERAL SERVICES</div><div style="font-weight:800;font-size:12px;color:#FF6B00;font-family:'Arial Black',Arial,sans-serif;letter-spacing:0.05em;line-height:1.2">PETROLEUM</div></div>
      </div>
    </a>`;

// Logo footer version blanche
const LOGO_FOOTER = `<a href="index.html" class="flex items-center gap-3 mb-4" style="text-decoration:none">
          <picture>
            <source srcset="images/logo-gsp-white.png" type="image/png">
            <img src="images/logo-gsp-white.png" alt="GSP" style="height:46px;width:auto;display:block"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          </picture>
          <div class="items-center gap-2" style="display:none">
            <div style="width:40px;height:40px;background:rgba(255,255,255,0.1);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-style:italic;color:white;font-size:16px;font-family:'Arial Black',Arial,sans-serif">GP</div>
            <div><div style="font-weight:800;font-size:11px;color:white;font-family:'Arial Black',Arial,sans-serif;letter-spacing:0.05em;line-height:1.3">GENERAL SERVICES</div><div style="font-weight:800;font-size:11px;color:#FF6B00;font-family:'Arial Black',Arial,sans-serif;letter-spacing:0.05em;line-height:1.3">PETROLEUM</div></div>
          </div>
        </a>`;

pages.forEach(page => {
  const file = path.join(ROOT, page);
  if (!fs.existsSync(file)) { console.log(`⚠ ${page} introuvable`); return; }

  let html = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // 1. Ajouter favicons si absents
  if (!html.includes('favicon-32x32.png')) {
    html = html.replace('</head>', FAVICONS + '\n</head>');
    // supprimer éventuel doublon si déjà présent via <link rel="stylesheet">
    changed = true;
  }

  // 2. Mettre à jour OG image
  html = html.replace(
    /content="https:\/\/gspetroleum\.sn\/images\/og-gsp\.jpg"/g,
    'content="https://gspetroleum.sn/images/og-image.png"'
  );

  // 3. Remplacer logo header (ancienne balise <img> simple sans <picture>)
  // Pattern: <a href="index.html" ... logo-gsp.png ... onerror ...
  const headerLogoRe = /<a href="index\.html" class="flex items-center gap-3" style="text-decoration:none">\s*<img src="images\/logo-gsp\.png"[^>]*onerror="[^"]*"[^>]*>\s*<div class="items-center gap-2\.5" style="display:none">/g;
  if (headerLogoRe.test(html)) {
    // Reconstruct properly - replace just the opening part
    html = html.replace(
      /<a href="index\.html" class="flex items-center gap-3" style="text-decoration:none">\s*<img src="images\/logo-gsp\.png"[^>]*>\s*<div class="items-center gap-2\.5" style="display:none">/g,
      `<a href="index.html" class="flex items-center gap-3" style="text-decoration:none">
      <picture>
        <source srcset="images/logo-gsp.webp" type="image/webp">
        <img src="images/logo-gsp.png" alt="General Services Petroleum" style="height:52px;width:auto;display:block"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      </picture>
      <div class="items-center gap-2.5" style="display:none">`
    );
    changed = true;
  }

  // 4. Logo footer : remplacer filter:brightness(0) invert(1) par version blanche
  html = html.replace(
    /style="height:46px;filter:brightness\(0\) invert\(1\);display:block"/g,
    'style="height:46px;width:auto;display:block"'
  );
  html = html.replace(
    /<img src="images\/logo-gsp\.png" alt="GSP" style="height:46px;width:auto;display:block"/g,
    '<img src="images/logo-gsp-white.png" alt="GSP" style="height:46px;width:auto;display:block"'
  );

  fs.writeFileSync(file, html, 'utf-8');
  console.log(`  ✓  ${page}`);
});

console.log('\n✅ Toutes les pages mises à jour.');
