/**
 * `npm run images:download`
 *
 * Downloads every photo referenced in `image-manifest.mjs` (currently from the
 * Unsplash CDN), resizes it with sharp to a fixed destination size, and encodes
 * it as an optimized WebP in `public/`. Safe to run repeatedly (idempotent).
 *
 * Two modes:
 *  - sharp available (devDependency) -> full local resize + WebP conversion.
 *  - sharp missing                    -> falls back to requesting WebP from the
 *    CDN directly (`fm=webp&w=...`) and saves those bytes as-is.
 *
 * After running, switch the `image` / `imagePreview` fields in `data/*.ts` to
 * the matching static paths (see comments in those files).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sharpMod = await import("sharp")
  .then((m) => m.default)
  .catch(() => null);

const manifest = (await import("./image-manifest.mjs")).default;

/** When sharp is unavailable, ask the CDN to deliver WebP directly. */
const buildCdnWebpUrl = (src, width) => {
  const url = new URL(src);
  url.searchParams.set("fm", "webp");
  url.searchParams.set("w", String(width));
  return url.href;
};

let ok = 0;
let failed = 0;

console.log(`\nFABRIXPLASM — image downloader (sharp: ${sharpMod ? "yes" : "no (CDN WebP fallback)"})\n`);

for (const item of manifest) {
  try {
    const url = sharpMod ? item.src : buildCdnWebpUrl(item.src, item.width);
    const res = await fetch(url, {
      headers: { "user-agent": "fabrixplasm-image-optimizer/1.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buf = Buffer.from(await res.arrayBuffer());

    let out = buf;
    if (sharpMod) {
      out = await sharpMod(buf)
        .resize(item.width, item.height, { fit: "cover" })
        .webp({ quality: 70 })
        .toBuffer();
    }

    const dest = resolve(ROOT, item.dest);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, out);

    console.log(`  ✓ ${item.id.padEnd(30)} -> ${item.dest}  (${(out.length / 1024).toFixed(1)} KB)`);
    ok += 1;
  } catch (err) {
    console.error(`  ✗ ${item.id}: ${err.message}`);
    failed += 1;
  }
}

console.log(`\nDone. ${ok} downloaded, ${failed} failed.\n`);
if (failed > 0) process.exitCode = 1;