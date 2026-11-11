// Capture the shipped scene rather than approximating the new aurora in a raster editor.
import { chromium } from "@playwright/test";
import sharp from "sharp";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader-webgl",
  ],
});
try {
  for (const [name, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: "no-preference",
    });
    await page.goto(process.env.PREVIEW_URL || "http://localhost:3000/");
    await page
      .locator(".hero-visual[data-ready=true]")
      .waitFor({ timeout: 30000 });
    await page.getByRole("button", { name: "Pausar animação" }).focus();
    await page.getByRole("button", { name: "Pausar animação" }).click();
    await page.addStyleTag({
      content: ".scene-controls{visibility:hidden!important}",
    });
    const buffer = await page.locator("canvas").screenshot();
    await sharp(buffer)
      .webp({ quality: 88 })
      .toFile(`public/models/untold-aurora-${name}.webp`);
    await page.close();
    console.log(`Captured ${name}: ${width}x${height}`);
  }
} finally {
  await browser.close();
}
