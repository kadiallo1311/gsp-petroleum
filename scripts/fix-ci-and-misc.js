/**
 * Comprehensive fix script:
 * 1. Remove Côte d'Ivoire / Abidjan / ivoirien mentions
 * 2. Remove "Forme juridique: SARL OHADA" from contact.html
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ── Replacements for Côte d'Ivoire ─────────────────────────────
const CI_REPLACEMENTS = [
  // KWM description on index + i18n
  [
    /Véhicule d'expansion du Groupe GSP en Côte d'Ivoire, dédié aux activités minières et à l'adressage du marché ivoirien de la céramique industrielle\./gi,
    "Véhicule d'expansion du Groupe GSP dans la sous-région ouest-africaine, dédié aux activités minières et à l'industrie céramique."
  ],
  // activites.html KWM heading
  [
    /Notre véhicule d'expansion vers la Côte d'Ivoire/gi,
    "Notre véhicule d'expansion sous-régional"
  ],
  // activites.html KWM long description
  [
    /Kairos West Mining \(KWM\) est le véhicule stratégique d'expansion du Groupe GSP en Afrique de l'Ouest, dédié à l'extension de nos activités minières sur le marché ivoirien de la céramique industrielle\. La société, en cours de constitution juridique en SAS de droit ivoirien \(OHADA\), capitalise sur l'expertise opérationnelle développée au Sénégal pour adresser un marché ivoirien à fort potentiel, dans la continuité de notre partenariat KEDA\./gi,
    "Kairos West Mining (KWM) est le véhicule stratégique d'expansion du Groupe GSP dans la sous-région ouest-africaine, dédié à l'extension de nos activités minières et à l'industrie de la céramique industrielle. La société est actuellement en cours de constitution dans un pays de la sous-région ouest-africaine, capitalisant sur l'expertise opérationnelle développée au Sénégal dans la continuité de notre partenariat KEDA."
  ],
  // activites.html bullet points
  [
    /Démarrage Sénégal, extension Côte d'Ivoire puis CEDEAO/gi,
    "Démarrage Sénégal, extension sous-régionale progressive vers la CEDEAO"
  ],
  [
    /Capacité d'extension vers la Côte d'Ivoire/gi,
    "Capacité d'extension vers la sous-région CEDEAO"
  ],
  // partenariats.html KEDA
  [
    /Une extension vers le marché ivoirien \(KEDA Côte d'Ivoire\) est en cours de structuration via notre véhicule Kairos West Mining\./gi,
    "Une extension vers la sous-région ouest-africaine est en cours de structuration via notre véhicule Kairos West Mining."
  ],
  // equipe.html governance sections
  [
    /Kairos West Mining adopte une gouvernance adaptée au droit ivoirien \(OHADA\)\./gi,
    "Kairos West Mining est en cours de constitution dans un pays de la sous-région ouest-africaine, avec une gouvernance adaptée au droit OHADA."
  ],
  [
    /Gouvernance SAS de droit ivoirien \(OHADA\) en cours de constitution\. Arbitrage CCJA Abidjan\. Conseil d'administration prévu\./gi,
    "Société en cours de constitution dans un pays de la sous-région ouest-africaine. Gouvernance OHADA. Conseil d'administration prévu."
  ],
  // KWM tag on activites.html
  [
    /'act\.kwm\.tag':\s*'Expansion régionale'/g,
    "'act.kwm.tag': 'Expansion régionale'"
  ],
  // Remaining ivoirien/Côte d'Ivoire fallback patterns
  [/\bmarché ivoirien\b/gi, "marché sous-régional"],
  [/\bivoirien\b/gi,        "de la sous-région"],
  [/\bCôte d'Ivoire\b/gi,  "la sous-région ouest-africaine"],
  [/\bAbidjan\b/gi,         "un pays de la sous-région"],
];

const PAGES = ['index.html','activites.html','partenariats.html','equipe.html','contact.html','js/i18n.js'];

PAGES.forEach(page => {
  const fp = path.join(ROOT, page);
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');

  CI_REPLACEMENTS.forEach(([from, to]) => {
    html = html.replace(from, to);
  });

  // ── Remove "Forme juridique: SARL OHADA" row (contact.html only) ──
  if (page === 'contact.html') {
    html = html.replace(
      /\s*<div class="flex justify-between text-sm">\s*<span class="text-gsp-muted">Forme juridique<\/span>\s*<span class="text-gsp-text text-xs">SARL — OHADA<\/span>\s*<\/div>/g,
      ''
    );
  }

  fs.writeFileSync(fp, html, 'utf8');
  console.log('✅  ' + page);
});

console.log('\nDone.');
