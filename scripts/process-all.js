/**
 * GSP — Pipeline complet : logo + photos
 * node scripts/process-all.js
 */
const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const SRC  = path.join(__dirname, '..', 'images', 'src');
const OUT  = path.join(__dirname, '..', 'images');
const FAVI = path.join(OUT, 'favicons');

[OUT, FAVI].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

async function log(file) {
  const { size } = fs.statSync(file);
  console.log(`  ✓  ${path.basename(file).padEnd(40)} ${(size/1024).toFixed(1).padStart(6)} Ko`);
}

// ─── Suppression fond blanc (logo sur fond blanc → transparent) ─────────────
async function removeWhiteBg(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];

    // Distance au blanc
    const dist = Math.sqrt((255-r)**2 + (255-g)**2 + (255-b)**2);
    // Seuil : blanc pur et tons très proches → transparent
    // Dégradé doux pour les contours anti-aliasés
    let alpha;
    if (dist < 15)       alpha = 0;
    else if (dist < 60)  alpha = Math.round((dist - 15) / 45 * 255);
    else                 alpha = 255;

    out[i * 4]     = r;
    out[i * 4 + 1] = g;
    out[i * 4 + 2] = b;
    out[i * 4 + 3] = alpha;
  }

  return sharp(out, { raw: { width, height, channels: 4 } });
}

// ─── LOGO ────────────────────────────────────────────────────────────────────
async function processLogo() {
  const src = path.join(SRC, 'logo-gsp-source.jpg');
  console.log('\n📌  Logo GSP — suppression fond blanc + toutes variantes');

  const transparent = await removeWhiteBg(src);
  const { width: W, height: H } = await sharp(src).metadata();
  const ratio = H / W;

  // PNG transparent haute résolution
  const buf800 = await transparent.clone().resize(800).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(OUT, 'logo-gsp@2x.png'), buf800);
  await log(path.join(OUT, 'logo-gsp@2x.png'));

  const buf400 = await sharp(buf800).resize(400).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(OUT, 'logo-gsp.png'), buf400);
  await log(path.join(OUT, 'logo-gsp.png'));

  // WebP transparent
  const webp = await sharp(buf400).webp({ quality: 90, lossless: false }).toBuffer();
  fs.writeFileSync(path.join(OUT, 'logo-gsp.webp'), webp);
  await log(path.join(OUT, 'logo-gsp.webp'));

  // Version blanche (footer) — tout en blanc sauf le fond reste transparent
  const white = await sharp(buf400)
    .tint({ r: 255, g: 255, b: 255 })
    .png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(OUT, 'logo-gsp-white.png'), white);
  await log(path.join(OUT, 'logo-gsp-white.png'));

  // OG Image 1200×630 — logo centré sur fond navy
  const logoForOG = await sharp(buf800).resize({ width: 560 }).png().toBuffer();
  const ogH = Math.round(560 * ratio);
  const ogTop  = Math.round((630 - ogH) / 2);
  const ogLeft = Math.round((1200 - 560) / 2);
  await sharp({
    create: { width: 1200, height: 630, channels: 4,
              background: { r: 15, g: 42, b: 63, alpha: 1 } }
  }).composite([{ input: logoForOG, top: ogTop, left: ogLeft }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, 'og-image.png'));
  await log(path.join(OUT, 'og-image.png'));

  // Favicons
  for (const sz of [16, 32, 48, 64, 128, 180, 192, 512]) {
    const f = path.join(FAVI, `favicon-${sz}x${sz}.png`);
    await sharp(buf800).resize(sz, sz, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
      .png({ compressionLevel: 9 }).toFile(f);
    await log(f);
  }

  // Apple Touch Icon (180×180) — fond navy
  const atiLogo = await sharp(buf800).resize(130).png().toBuffer();
  await sharp({ create: { width: 180, height: 180, channels: 4,
                           background: { r: 15, g: 42, b: 63, alpha: 1 } } })
    .composite([{ input: atiLogo, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(FAVI, 'apple-touch-icon.png'));
  await log(path.join(FAVI, 'apple-touch-icon.png'));
}

// ─── PHOTOS ──────────────────────────────────────────────────────────────────
async function processPhoto(srcFile, baseName, label) {
  const src = path.join(SRC, srcFile);
  console.log(`\n🪨  ${label}`);

  // Desktop 800×500
  const d = path.join(OUT, `${baseName}-activity.webp`);
  await sharp(src).resize(800, 500, { fit: 'cover', position: 'centre' })
    .webp({ quality: 84 }).toFile(d);
  await log(d);

  const dj = path.join(OUT, `${baseName}-activity.jpg`);
  await sharp(src).resize(800, 500, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 84, mozjpeg: true }).toFile(dj);
  await log(dj);

  // Tablet 600×400
  const t = path.join(OUT, `${baseName}-tablet.webp`);
  await sharp(src).resize(600, 400, { fit: 'cover', position: 'centre' })
    .webp({ quality: 80 }).toFile(t);
  await log(t);

  // Mobile 400×300
  const m = path.join(OUT, `${baseName}-mobile.webp`);
  await sharp(src).resize(400, 300, { fit: 'cover', position: 'centre' })
    .webp({ quality: 78 }).toFile(m);
  await log(m);

  // Thumbnail carré 300×300
  const th = path.join(OUT, `${baseName}-thumb.webp`);
  await sharp(src).resize(300, 300, { fit: 'cover', position: 'centre' })
    .webp({ quality: 80 }).toFile(th);
  await log(th);
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('══════════════════════════════════════════════');
  console.log('   GSP — Pipeline traitement images complet');
  console.log('══════════════════════════════════════════════');

  await processLogo();
  await processPhoto('kaolin-source.jpg',  'kaolin',  'Kaolin / Argile (photo 1)');
  await processPhoto('granite-source.jpg', 'granite', 'Granite SF18B (photo 2)');

  console.log('\n══════════════════════════════════════════════');
  console.log('✅  Terminé — tous les fichiers dans images/');
  console.log('══════════════════════════════════════════════\n');
}

main().catch(e => { console.error('\n❌ Erreur :', e.message); process.exit(1); });
