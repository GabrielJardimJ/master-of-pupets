import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
// Exact paths from the original SVG; only viewBox, sizing and icon background vary.
const symbol = await readFile("public/brand/symbol.svg", "utf8");
await writeFile("public/favicon.svg", symbol);
for (const [name, size] of [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["apple-touch-icon.png", 180],
]) {
  await sharp(Buffer.from(symbol))
    .resize(size, size)
    .flatten({ background: "#10111A" })
    .png()
    .toFile(`public/${name}`);
}
const logo = await readFile("public/brand/logo-horizontal-dark.svg", "utf8");
const logoLayer = await sharp(Buffer.from(logo))
  .resize(460, 205)
  .png()
  .toBuffer();
const poster = await sharp("public/models/untold-glass-preview.webp")
  .resize(600, 600)
  .png()
  .toBuffer();
const image = sharp({
  create: { width: 1200, height: 630, channels: 4, background: "#10111A" },
});
await image
  .composite([
    { input: poster, left: 600, top: 15 },
    { input: logoLayer, left: 55, top: 145 },
  ])
  .png()
  .toFile("public/opengraph-image.png");
await writeFile(
  "public/manifest.webmanifest",
  JSON.stringify(
    {
      name: "Untold — Creative digital studio",
      short_name: "Untold",
      lang: "pt-BR",
      start_url: "/",
      display: "standalone",
      background_color: "#10111A",
      theme_color: "#10111A",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    null,
    2,
  ),
);

// Standard ICO container embedding the original symbol as a 32px PNG.
const faviconPng = await sharp(Buffer.from(symbol))
  .resize(32, 32)
  .png()
  .toBuffer();
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader[6] = 32;
icoHeader[7] = 32;
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(faviconPng.length, 14);
icoHeader.writeUInt32LE(22, 18);
await writeFile("public/favicon.ico", Buffer.concat([icoHeader, faviconPng]));
