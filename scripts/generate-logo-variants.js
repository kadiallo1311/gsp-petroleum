/**
 * GSP — Generate all logo variants from SVG source
 * node scripts/generate-logo-variants.js
 */
const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const SVG  = path.join(__dirname, '..', 'images', 'logo-gsp.svg');
const OUT  = path.join(__dirname, '..', 'images');
const FAVI = path.join(OUT, 'favicons');

if (!fs.existsSync(FAVI)) fs.mkdirSync(FAVI, { recursive: true });

async function save(pipeline, file) {
  await pipeline.toFile(file);
  const { size } = fs.statSync(file);
  console.log(`  ✓  ${path.basename(file).padEnd(38)} ${(size/1024).toFixed(1).padStart(5)} Ko`);
}

async function svgToPng(width, bg) {
  // Render SVG at 3× then downscale for crispness
  const scale = 3;
  let p = sharp(SVG, { density: 300 }).resize(width * scale);
  if (bg) {
    const buf = await p.png().toBuffer();
    p = sharp({ create: { width: width * scale, height: Math.round(width * scale * 220/560),
                           channels: 4, background: bg } })
      .composite([{ input: buf, gravity: 'centre' }]);
  }
  return p.resize(width).png({ compressionLevel: 9 });
}

async function main() {
  console.log('\n══════════════════════════════════════════');
  console.log('   GSP — Logo Variants Generator');
  console.log('══════════════════════════════════════════\n');

  // ── PNG transparent (tailles standard) ──────────────────────────────────
  await save(await svgToPng(560),  path.join(OUT, 'logo-gsp@2x.png'));   // Retina
  await save(await svgToPng(280),  path.join(OUT, 'logo-gsp.png'));      // Header standard
  await save(await svgToPng(200),  path.join(OUT, 'logo-gsp-small.png')); // Mobile

  // ── WebP transparent ────────────────────────────────────────────────────
  const buf280 = await (await svgToPng(280)).toBuffer();
  await save(sharp(buf280).webp({ quality: 90, lossless: true }), path.join(OUT, 'logo-gsp.webp'));

  // ── Logo blanc pour footer sombre ───────────────────────────────────────
  // Invert black → white, keep orange as-is
  const logoWhite = await (await svgToPng(280)).modulate({ brightness: 1 })
    .negate({ alpha: false })
    .toBuffer();
  // Use tint approach: render on dark bg then extract
  const logoBufLg = await (await svgToPng(560)).toBuffer();
  await save(
    sharp({ create: { width: 560, height: 220, channels: 4,
                       background: { r: 255, g: 255, b: 255, alpha: 0 } } })
      .composite([{ input: logoBufLg, blend: 'dest-over' }])
      .png(),
    path.join(OUT, 'logo-gsp-transparent.png')
  );

  // White version: tout blanc (pour les fonds sombres type footer navy)
  await save(
    sharp(logoBufLg)
      .tint({ r: 255, g: 255, b: 255 })
      .png(),
    path.join(OUT, 'logo-gsp-white.png')
  );

  // ── Open Graph 1200×630 ─────────────────────────────────────────────────
  const logoCentre = await (await svgToPng(500)).toBuffer();
  await save(
    sharp({ create: { width: 1200, height: 630, channels: 4,
                       background: { r: 15, g: 42, b: 63, alpha: 1 } } })
      .composite([
        // logo centré
        { input: logoCentre, gravity: 'centre' },
        // sous-titre
      ])
      .png({ compressionLevel: 9 }),
    path.join(OUT, 'og-image.png')
  );

  // ── Favicons ────────────────────────────────────────────────────────────
  const faviSizes = [16, 32, 48, 64, 128, 180, 192, 512];
  for (const sz of faviSizes) {
    const buf = await sharp(SVG, { density: 300 })
      .resize(sz * 3).resize(sz)
      .png({ compressionLevel: 9 })
      .toBuffer();
    await save(sharp(buf), path.join(FAVI, `favicon-${sz}x${sz}.png`));
  }

  // Apple Touch Icon — fond navy
  const atiLogo = await sharp(SVG, { density: 300 }).resize(480).resize(150).png().toBuffer();
  await save(
    sharp({ create: { width: 180, height: 180, channels: 4,
                       background: { r: 15, g: 42, b: 63, alpha: 1 } } })
      .composite([{ input: atiLogo, gravity: 'centre' }])
      .png(),
    path.join(FAVI, 'apple-touch-icon.png')
  );

  // ── WebP favicon 32px ───────────────────────────────────────────────────
  const fav32 = await sharp(SVG, { density: 300 }).resize(96).resize(32).webp({ quality: 90 }).toBuffer();
  fs.writeFileSync(path.join(FAVI, 'favicon-32.webp'), fav32);
  console.log(`  ✓  favicon-32.webp                          ${(fav32.length/1024).toFixed(1).padStart(5)} Ko`);

  console.log('\n✅  Toutes les variantes générées dans images/');
  console.log('\n   Fichiers créés :');
  console.log('   • logo-gsp.png          → header standard (280px)');
  console.log('   • logo-gsp@2x.png       → header Retina (560px)');
  console.log('   • logo-gsp.webp         → header WebP');
  console.log('   • logo-gsp-white.png    → footer fond sombre');
  console.log('   • og-image.png          → Open Graph 1200×630');
  console.log('   • favicons/             → 16 à 512px + Apple Touch');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
