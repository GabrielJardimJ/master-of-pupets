import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
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
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto(process.env.PREVIEW_URL || "http://localhost:3000/");
  await page.waitForTimeout(3500);
  const metrics = await page.evaluate(() => {
    const entries = performance.getEntriesByType("resource");
    const scripts = entries.filter((e) => e.initiatorType === "script");
    return {
      viewport: "390x844 / touch / DPR 2",
      javascriptBytes: scripts.reduce((sum, e) => sum + e.encodedBodySize, 0),
      javascriptRequests: scripts.length,
      glbRequests: entries.filter((e) => e.name.endsWith(".glb")).length,
      canvasCount: document.querySelectorAll("canvas").length,
      blurSurfaces: [...document.querySelectorAll("*")].filter((e) => {
        const value = getComputedStyle(e).backdropFilter;
        return value && value !== "none";
      }).length,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  console.log(JSON.stringify(metrics, null, 2));
  if (process.argv[2])
    await writeFile(process.argv[2], JSON.stringify(metrics, null, 2) + "\n");
  await context.close();
} finally {
  await browser.close();
}
