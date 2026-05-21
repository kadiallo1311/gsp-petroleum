/**
 * Logo fix — re-processes logo-gsp.png to:
 * 1. Remove the white background fully (transparent)
 * 2. Trim surrounding whitespace
 * 3. Export optimised PNG + WebP
 * 4. Generate a true white-on-transparent version for dark backgrounds
 */

const sharp = require('sharp');
const path  = require('path');
const OUT   = path.join(__dirname, '..', 'images');

async function run() {
  // ── Step 1: Read raw RGBA data from original ──────────────────
  const src = path.join(OUT, 'logo-gsp.png');
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info; // channels === 4
  const buf = Buffer.from(data);

  // ── Step 2: Remove white background ──────────────────────────
  // Background pixels are near-white (R,G,B all ≥ 230).
  // Keep the orange swoosh (high R, low G, low B) and black text.
  const transparent = Buffer.from(buf);
  for (let i = 0; i < transparent.length; i += 4) {
    const r = buf[i], g = buf[i+1], b = buf[i+2];
    // Is this pixel "background" (very light)?
    const isWhite = r > 230 && g > 230 && b > 230;
    const dist = Math.sqrt(
      (r - 255) ** 2 + (g - 255) ** 2 + (b - 255) ** 2
    );
    if (isWhite) {
      transparent[i+3] = 0; // fully transparent
    } else if (dist < 55) {
      // Soft anti-alias edge: proportional alpha
      transparent[i+3] = Math.round(255 * (1 - (dist / 55) ** 0.7));
    }
  }

  // ── Step 3: Build transparent image + trim ───────────────────
  const trimmed = await sharp(transparent, {
    raw: { width, height, channels: 4 }
  })
    .png()
    .toBuffer();

  // Trim whitespace (sharp's trim uses content detection)
  const trimmedBuf = await sharp(trimmed)
    .trim({ background: { r:0, g:0, b:0, alpha:0 }, threshold: 10 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const trimMeta = await sharp(trimmedBuf).metadata();
  console.log(`Trimmed logo: ${trimMeta.width}x${trimMeta.height}`);

  // ── Step 4: Save colour version ──────────────────────────────
  await sharp(trimmedBuf)
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, 'logo-gsp.png'));

  await sharp(trimmedBuf)
    .webp({ quality: 90 })
    .toFile(path.join(OUT, 'logo-gsp.webp'));

  // @2x version (scale up from trimmed)
  await sharp(trimmedBuf)
    .resize({ width: trimMeta.width * 2, kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, 'logo-gsp@2x.png'));

  // ── Step 5: White version for dark backgrounds ────────────────
  // Replace ALL non-transparent pixels with white (#FFFFFF),
  // preserving the alpha channel
  const { data: trimData, info: ti } = await sharp(trimmedBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const whiteBuf = Buffer.from(trimData);
  for (let i = 0; i < whiteBuf.length; i += 4) {
    const a = trimData[i+3];
    if (a > 0) {
      whiteBuf[i]   = 255; // R → white
      whiteBuf[i+1] = 255; // G → white
      whiteBuf[i+2] = 255; // B → white
      // keep original alpha for smooth edges
    }
  }

  await sharp(whiteBuf, {
    raw: { width: ti.width, height: ti.height, channels: 4 }
  })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, 'logo-gsp-white.png'));

  console.log('✅  logo-gsp.png — transparent background');
  console.log('✅  logo-gsp.webp');
  console.log('✅  logo-gsp@2x.png');
  console.log('✅  logo-gsp-white.png — white on transparent');
}

run().catch(err => { console.error(err); process.exit(1); });
