/**
 * GSP — Tanker truck : traitement premium ultra-HD
 * Amélioration netteté, couleurs, contraste + toutes variantes responsive
 */
const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const SRC = path.join(__dirname, '..', 'images', 'src', 'camion-source.png');
const OUT = path.join(__dirname, '..', 'images');

async function log(file) {
  const { size } = fs.statSync(file);
  console.log(`  ✓  ${path.basename(file).padEnd(44)} ${(size/1024).toFixed(1).padStart(7)} Ko`);
}

async function main() {
  console.log('\n════════════════════════════════════════════════════');
  console.log('   GSP — Tanker truck : pipeline premium');
  console.log('════════════════════════════════════════════════════\n');

  const { width, height } = await sharp(SRC).metadata();
  console.log(`  Source : ${width}×${height}px PNG\n`);

  // Pipeline d'amélioration visuelle premium :
  // 1. Upscale 2× via Lanczos (meilleure interpolation) → 3072×2048
  // 2. Unsharp mask : renforce les contours fins
  // 3. Saturation légèrement boostée (0→+0.12) pour les couleurs vives du camion
  // 4. Légère hausse de la luminosité pour les ombres
  // 5. Correction gamma douce pour la profondeur cinématographique
  // 6. Modulation contraste (+0.06) pour le relief

  const enhanced = () =>
    sharp(SRC)
      // Upscale avec meilleure qualité
      .resize(3072, 2048, { kernel: 'lanczos3', fit: 'fill' })
      // Sharpen : sigma=1.2, flat=1, jagged=2 → net sans artefact
      .sharpen({ sigma: 1.2, m1: 1.0, m2: 2.0 })
      // Modulation couleur : légère saturation + luminosité douce
      .modulate({ saturation: 1.12, brightness: 1.03 })
      // Gamma pour profondeur cinématographique
      .gamma(1.08)
      // Micro-contraste via linear
      .linear(1.06, -6);

  // ── 1. Hero fullscreen desktop (1920×1080) ─────────────────────────────
  await enhanced()
    .resize(1920, 1080, { fit: 'cover', position: 'centre' })
    .webp({ quality: 88, effort: 6 })
    .toFile(path.join(OUT, 'camion-hero.webp'));
  await log(path.join(OUT, 'camion-hero.webp'));

  await enhanced()
    .resize(1920, 1080, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(path.join(OUT, 'camion-hero.jpg'));
  await log(path.join(OUT, 'camion-hero.jpg'));

  // ── 2. Section activités large (1440×810) ──────────────────────────────
  await enhanced()
    .resize(1440, 810, { fit: 'cover', position: 'centre' })
    .webp({ quality: 86, effort: 6 })
    .toFile(path.join(OUT, 'camion-section.webp'));
  await log(path.join(OUT, 'camion-section.webp'));

  await enhanced()
    .resize(1440, 810, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(OUT, 'camion-section.jpg'));
  await log(path.join(OUT, 'camion-section.jpg'));

  // ── 3. Tablet (1024×576) ───────────────────────────────────────────────
  await enhanced()
    .resize(1024, 576, { fit: 'cover', position: 'centre' })
    .webp({ quality: 82, effort: 5 })
    .toFile(path.join(OUT, 'camion-tablet.webp'));
  await log(path.join(OUT, 'camion-tablet.webp'));

  // ── 4. Mobile portrait (768×500) ───────────────────────────────────────
  await enhanced()
    .resize(768, 500, { fit: 'cover', position: 'centre' })
    .webp({ quality: 80, effort: 5 })
    .toFile(path.join(OUT, 'camion-mobile.webp'));
  await log(path.join(OUT, 'camion-mobile.webp'));

  await enhanced()
    .resize(768, 500, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, 'camion-mobile.jpg'));
  await log(path.join(OUT, 'camion-mobile.jpg'));

  // ── 5. Thumbnail carré (600×400) pour cards ────────────────────────────
  await enhanced()
    .resize(600, 400, { fit: 'cover', position: 'centre' })
    .webp({ quality: 84 })
    .toFile(path.join(OUT, 'camion-thumb.webp'));
  await log(path.join(OUT, 'camion-thumb.webp'));

  // ── 6. Ultra-HD master conservé (3072×2048) — PNG lossless ────────────
  await enhanced()
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, 'src', 'camion-master-hd.png'));
  await log(path.join(OUT, 'src', 'camion-master-hd.png'));

  console.log('\n════════════════════════════════════════════════════');
  console.log('✅  Traitement premium terminé — 8 variantes générées');
  console.log('════════════════════════════════════════════════════\n');
}

main().catch(e => { console.error('❌', e.message, e.stack); process.exit(1); });
