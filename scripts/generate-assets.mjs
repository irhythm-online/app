/**
 * Regenerates the raster PNG assets (app icon, splash screen, Android adaptive
 * icon) from the canonical `assets/logo/icon.svg` source in BRAND.md.
 *
 * Expo requires PNG (not SVG) for `app.config.ts` icon/splash fields, so this
 * script uses `sharp` to rasterize. Run it again any time icon.svg changes:
 *
 *   node scripts/generate-assets.mjs
 *
 * Requires the `sharp` devDependency (already in package.json).
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const NAVY_900 = "#0A1628";

const iconSvg = readFileSync(path.join(root, "assets/logo/icon.svg"));

async function main() {
  // 1024x1024 app icon — the icon mark rasterized directly, no extra padding
  // (icon.svg already includes its own rounded-square background).
  await sharp(iconSvg).resize(1024, 1024).png().toFile(path.join(root, "assets/icon.png"));

  // Android adaptive icon foreground: same mark, transparent-ish flat navy
  // background is fine per spec — reuse the icon mark at 1024x1024.
  await sharp(iconSvg)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(root, "assets/adaptive-icon.png"));

  // Splash screen: navy gradient-ish background (flat navy-900, matches the
  // splash.backgroundColor in app.config.ts) with the icon mark centered at
  // ~40% width.
  const splashW = 1284;
  const splashH = 2778;
  const markSize = Math.round(splashW * 0.42);
  const markPng = await sharp(iconSvg).resize(markSize, markSize).png().toBuffer();

  const background = await sharp({
    create: {
      width: splashW,
      height: splashH,
      channels: 4,
      background: NAVY_900,
    },
  })
    .png()
    .toBuffer();

  await sharp(background)
    .composite([
      {
        input: markPng,
        left: Math.round((splashW - markSize) / 2),
        top: Math.round((splashH - markSize) / 2),
      },
    ])
    .png()
    .toFile(path.join(root, "assets/splash.png"));

  // Web favicon, reuse the icon mark at a small size.
  await sharp(iconSvg).resize(48, 48).png().toFile(path.join(root, "assets/favicon.png"));

  console.log("Generated assets/icon.png, assets/adaptive-icon.png, assets/splash.png, assets/favicon.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
