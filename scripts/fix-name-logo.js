/**
 * 1. Replace company name:
 *    "General Services Petroleum SARL" → "General Service Petroleum"
 *    + all variants (with/without SARL, upper/lower case)
 * 2. Fix logo markup in all 5 pages:
 *    - Correct dimensions for trimmed logo (313x109 → h-12 / 48px)
 *    - Footer: use logo-gsp-white.png without filter
 *    - Remove deprecated srcset references
 *    - Update alt attributes
 */

const fs   = require('fs');
const path = require('path');

const ROOT  = path.join(__dirname, '..');
const PAGES = ['index.html','activites.html','partenariats.html','equipe.html','contact.html'];

// ── Name replacements (order matters: longest first) ───────────
const NAME_MAP = [
  // Full name with SARL
  [/General Services Petroleum SARL/g,   'General Service Petroleum'],
  [/GENERAL SERVICES PETROLEUM SARL/g,   'GENERAL SERVICE PETROLEUM'],
  // Schema JSON — "name":"..."
  [/"General Services Petroleum SARL"/g, '"General Service Petroleum"'],
  // Without SARL but with the S
  [/General Services Petroleum/g,        'General Service Petroleum'],
  [/GENERAL SERVICES PETROLEUM/g,        'GENERAL SERVICE PETROLEUM'],
  // Abbreviation combos
  [/GSP — General Services Petroleum/g,  'GSP — General Service Petroleum'],
  [/GSP — General Service Petroleum/g,   'GSP — General Service Petroleum'], // already OK
  // Schema alternateName (leave "GSP" alone)
  [/"alternateName": "SARL"/g,           ''], // remove any stray SARL alts
  // RCCM / legal mention "SARL" embedded in description
  [/ SARL(?=\s|[,.<"']|$)/g,             ''], // strip trailing SARL
];

// ── New header logo block (color, 48px tall, transparent PNG) ──
function headerLogoBlock(altText) {
  return `<a href="index.html" class="flex items-center" style="text-decoration:none">
      <picture>
        <source srcset="images/logo-gsp.webp" type="image/webp">
        <img src="images/logo-gsp.png" alt="${altText}"
             style="height:48px;width:auto;display:block"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      </picture>
      <!-- Fallback text logo -->
      <div class="items-center gap-2.5" style="display:none">
        <div style="width:44px;height:44px;background:#111;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-style:italic;color:white;font-size:18px;font-family:'Arial Black',Arial,sans-serif;letter-spacing:-1px">GP</div>
        <div>
          <div style="font-weight:800;font-size:11px;color:#111;font-family:'Arial Black',Arial,sans-serif;letter-spacing:0.05em;line-height:1.2">GENERAL SERVICE</div>
          <div style="font-weight:800;font-size:11px;color:#FF6B00;font-family:'Arial Black',Arial,sans-serif;letter-spacing:0.05em;line-height:1.2">PETROLEUM</div>
        </div>
      </div>
    </a>`;
}

// ── Footer logo block (white version, no filter needed) ────────
const FOOTER_LOGO_NEW = `<a href="index.html" class="flex items-center gap-3 mb-4" style="text-decoration:none">
          <picture>
            <source srcset="images/logo-gsp.webp" type="image/webp">
            <img src="images/logo-gsp-white.png" alt="General Service Petroleum"
                 style="height:40px;width:auto;display:block"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          </picture>
          <div style="display:none;align-items:center;gap:8px">
            <div style="width:38px;height:38px;background:rgba(255,255,255,0.1);border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-style:italic;color:white;font-size:15px;font-family:'Arial Black',Arial,sans-serif">GP</div>
            <div>
              <div style="font-weight:800;font-size:10px;color:white;font-family:'Arial Black',Arial,sans-serif">GENERAL SERVICE</div>
              <div style="font-weight:800;font-size:10px;color:#FF6B00;font-family:'Arial Black',Arial,sans-serif">PETROLEUM</div>
            </div>
          </div>
        </a>`;

// Regex to match the old footer logo (colour logo with filter:brightness or logo-gsp.png with invert)
const FOOTER_LOGO_REGEX = /<a href="index\.html" class="[^"]*flex[^"]*items-center[^"]*"[^>]*>[\s\S]*?<img src="images[\\\/]logo-gsp[^"]*"[^>]*(?:filter:brightness[^"]*invert[^"]*|logo-gsp-white)[^>]*>[\s\S]*?(?:<\/div>)?[\s\S]*?<\/a>/;

PAGES.forEach(page => {
  const filePath = path.join(ROOT, page);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Name replacements
  NAME_MAP.forEach(([from, to]) => { html = html.replace(from, to); });

  // 2. Fix header logo — replace any <picture>…</picture> + fallback inside header link
  // Match the header logo link block
  html = html.replace(
    /(<a href="index\.html" class="flex items-center[^"]*"[^>]*>)\s*<picture>[\s\S]*?<\/picture>\s*(<div class="items-center[^"]*"[\s\S]*?<\/div>\s*<\/div>)?\s*<\/a>/,
    headerLogoBlock('General Service Petroleum')
  );

  // 3. Fix footer logo — find img with logo-gsp.png and filter or logo-gsp-white.png in footer
  // Strategy: look for the footer <a> that wraps the logo
  html = html.replace(
    /<a href="index\.html" class="[^"]*flex[^"]*items-center[^"]*gap-3[^"]*"[^>]*style="text-decoration:none"[^>]*>\s*<img src="images[\\\/]logo-gsp[^"]*"[^>]*style="[^"]*height:4[0-9]px[^"]*"[^>]*onerror[^>]*>\s*<div[^>]*style="display:none[^"]*">[\s\S]*?<\/div>\s*<\/a>/,
    FOOTER_LOGO_NEW
  );

  // 4. Also fix footer inline logo without picture element (simpler pattern used in some pages)
  html = html.replace(
    /<img src="images[\\\/]logo-gsp\.png" alt="GSP" style="height:\d+px;filter:brightness\(0\) invert\(1\)"[^>]*>/g,
    `<img src="images/logo-gsp-white.png" alt="General Service Petroleum" style="height:40px;width:auto;object-fit:contain">`
  );

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅  ${page}`);
});

console.log('\nDone — logo markup fixed + name updated everywhere.');
