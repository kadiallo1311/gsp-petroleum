/**
 * GSP — Image Processing Pipeline
 * Generates all web-optimized variants from source files.
 *
 * Usage: node scripts/process-images.js
 *
 * Source files expected in images/src/ :
 *   logo-gsp-source.png  — logo sur fond blanc (original)
 *   hero-bg-source.jpg   — photo hero (grande résolution)
 *   kaolin-source.jpg    — photo roches kaolin
 *   granite-source.jpg   — photo granite SF18B
 */

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const SRC = path.join(__dirname, '..', 'images', 'src');
const OUT = path.join(__dirname, '..', 'images');

// Create output dirs
['src', 'favicons'].forEach(d => {
  const p = path.join(d === 'src' ? OUT : OUT, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});
const FAVI = path.join(OUT, 'favicons');

// ─── Utility ────────────────────────────────────────────────────────────────

async function exists(file) {
  return fs.promises.access(file).then(() => true).catch(() => false);
}

async function saveWebP(pipeline, outPath, quality = 82) {
  await pipeline.webp({ quality }).toFile(outPath);
  const { size } = await fs.promises.stat(outPath);
  console.log(`  ✓ ${path.basename(outPath)}  (${(size/1024).toFixed(0)} Ko)`);
}

async function savePNG(pipeline, outPath) {
  await pipeline.png({ compressionLevel: 9, palette: false }).toFile(outPath);
  const { size } = await fs.promises.stat(outPath);
  console.log(`  ✓ ${path.basename(outPath)}  (${(size/1024).toFixed(0)} Ko)`);
}

async function saveJPG(pipeline, outPath, quality = 82) {
  await pipeline.jpeg({ quality, mozjpeg: true }).toFile(outPath);
  const { size } = await fs.promises.stat(outPath);
  console.log(`  ✓ ${path.basename(outPath)}  (${(size/1024).toFixed(0)} Ko)`);
}

// Remove white/near-white background from logo
async function removeBackground(inputPath) {
  const img = sharp(inputPath);
  const { width, height } = await img.metadata();

  const raw = await img.clone().raw().toBuffer({ resolveWithObject: true });
  const { data, info } = raw;
  const channels = info.channels; // 3 = RGB, 4 = RGBA
  const pixels = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels + 0];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const a = channels === 4 ? data[i * channels + 3] : 255;

    // White/near-white threshold → transparent
    const isWhite = r > 240 && g > 240 && b > 240;
    // Soft anti-alias: partial transparency near the edge
    const brightness = (r + g + b) / 3;
    const alpha = isWhite ? 0 : (brightness > 220 ? Math.round((255 - brightness) * 8) : a);

    pixels[i * 4 + 0] = r;
    pixels[i * 4 + 1] = g;
    pixels[i * 4 + 2] = b;
    pixels[i * 4 + 3] = Math.min(255, alpha);
  }

  return sharp(Buffer.from(pixels), { raw: { width, height, channels: 4 } });
}

// ─── LOGO processing ────────────────────────────────────────────────────────

async function processLogo() {
  const src = path.join(SRC, 'logo-gsp-source.png');
  if (!await exists(src)) {
    console.log('⚠  logo-gsp-source.png absent — skipping logo processing');
    return;
  }
  console.log('\n📌 Logo GSP');

  const transparent = await removeBackground(src);

  // PNG transparent — full size (header @2x)
  await savePNG(transparent.clone().resize({ width: 800 }), path.join(OUT, 'logo-gsp@2x.png'));

  // PNG transparent — standard (header @1x, 52px height → export 400px wide)
  await savePNG(transparent.clone().resize({ width: 400 }), path.join(OUT, 'logo-gsp.png'));

  // WebP transparent
  await saveWebP(transparent.clone().resize({ width: 400 }), path.join(OUT, 'logo-gsp.webp'), 90);

  // Logo blanc pour footer sombre (teinte tout en blanc)
  await savePNG(
    transparent.clone().resize({ width: 400 })
      .tint({ r: 255, g: 255, b: 255 }),
    path.join(OUT, 'logo-gsp-white.png')
  );

  // OG Image (1200×630) — logo centré sur fond navy
  await savePNG(
    sharp({ create: { width: 1200, height: 630, channels: 4, background: { r: 15, g: 42, b: 63, alpha: 1 } } })
      .composite([{
        input: await transparent.clone().resize({ width: 480 }).png().toBuffer(),
        gravity: 'centre'
      }]),
    path.join(OUT, 'og-image.png')
  );
  console.log('  ✓ og-image.png  (Open Graph 1200×630)');

  // Favicons
  for (const size of [16, 32, 64, 128, 180]) {
    await savePNG(
      transparent.clone().resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }),
      path.join(FAVI, `favicon-${size}x${size}.png`)
    );
  }

  // Apple Touch Icon (180×180 sur fond navy)
  await savePNG(
    sharp({ create: { width: 180, height: 180, channels: 4, background: { r: 15, g: 42, b: 63, alpha: 1 } } })
      .composite([{
        input: await transparent.clone().resize(140).png().toBuffer(),
        gravity: 'centre'
      }]),
    path.join(FAVI, 'apple-touch-icon.png')
  );
  console.log('  ✓ favicons (16, 32, 64, 128, 180px + apple-touch-icon)');
}

// ─── HERO background ────────────────────────────────────────────────────────

async function processHero() {
  const src = path.join(SRC, 'hero-bg-source.jpg');
  if (!await exists(src)) {
    console.log('⚠  hero-bg-source.jpg absent — skipping');
    return;
  }
  console.log('\n🖼  Hero background');

  // Desktop 1920×1080
  await saveWebP(sharp(src).resize(1920, 1080, { fit: 'cover', position: 'centre' }), path.join(OUT, 'hero-bg.webp'), 78);
  await saveJPG(sharp(src).resize(1920, 1080, { fit: 'cover', position: 'centre' }), path.join(OUT, 'hero-bg.jpg'), 75);

  // Tablet 1024×768
  await saveWebP(sharp(src).resize(1024, 768, { fit: 'cover', position: 'centre' }), path.join(OUT, 'hero-bg-tablet.webp'), 75);

  // Mobile 768×1024 (portrait)
  await saveWebP(sharp(src).resize(768, 1024, { fit: 'cover', position: 'centre' }), path.join(OUT, 'hero-bg-mobile.webp'), 72);
  await saveJPG(sharp(src).resize(768, 1024, { fit: 'cover', position: 'centre' }), path.join(OUT, 'hero-bg-mobile.jpg'), 70);
}

// ─── KAOLIN photo ───────────────────────────────────────────────────────────

async function processKaolin() {
  const src = path.join(SRC, 'kaolin-source.jpg');
  if (!await exists(src)) {
    console.log('⚠  kaolin-source.jpg absent — skipping');
    return;
  }
  console.log('\n🪨  Kaolin / Argile');

  // Section activité — desktop
  await saveWebP(sharp(src).resize(800, 500, { fit: 'cover', position: 'centre' }), path.join(OUT, 'kaolin-activity.webp'), 82);
  await saveJPG(sharp(src).resize(800, 500, { fit: 'cover', position: 'centre' }), path.join(OUT, 'kaolin-activity.jpg'), 82);

  // Mobile
  await saveWebP(sharp(src).resize(400, 300, { fit: 'cover', position: 'centre' }), path.join(OUT, 'kaolin-activity-mobile.webp'), 78);

  // Thumbnail (card)
  await saveWebP(sharp(src).resize(400, 250, { fit: 'cover' }), path.join(OUT, 'kaolin-thumb.webp'), 80);
}

// ─── GRANITE photo ──────────────────────────────────────────────────────────

async function processGranite() {
  const src = path.join(SRC, 'granite-source.jpg');
  if (!await exists(src)) {
    console.log('⚠  granite-source.jpg absent — skipping');
    return;
  }
  console.log('\n🪨  Granite SF18B');

  // Section activité — desktop
  await saveWebP(sharp(src).resize(800, 500, { fit: 'cover', position: 'centre' }), path.join(OUT, 'granite-activity.webp'), 82);
  await saveJPG(sharp(src).resize(800, 500, { fit: 'cover', position: 'centre' }), path.join(OUT, 'granite-activity.jpg'), 82);

  // Mobile
  await saveWebP(sharp(src).resize(400, 300, { fit: 'cover', position: 'centre' }), path.join(OUT, 'granite-activity-mobile.webp'), 78);

  // Thumbnail
  await saveWebP(sharp(src).resize(400, 250, { fit: 'cover' }), path.join(OUT, 'granite-thumb.webp'), 80);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  GSP — Image Processing Pipeline');
  console.log('═══════════════════════════════════════');
  console.log(`  Source : ${SRC}`);
  console.log(`  Output : ${OUT}`);

  await processLogo();
  await processHero();
  await processKaolin();
  await processGranite();

  console.log('\n✅ Terminé. Placez vos fichiers dans images/src/ puis relancez.');
}

main().catch(err => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
