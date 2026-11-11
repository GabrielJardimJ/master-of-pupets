import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function scrollTo(page: import("@playwright/test").Page, id: string) {
  await page.locator(id).scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);
}

test("immersive desktop: centered GLB, delayed header and clean console", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const failed: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400 && r.url().startsWith("http://localhost"))
      failed.push(r.url());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".hero-visual")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 30000 },
  );
  await expect(page.locator("header")).toHaveAttribute("inert", "");
  expect(
    await page
      .locator("#inicio")
      .evaluate(
        (el) => Math.abs(el.getBoundingClientRect().height - innerHeight) < 2,
      ),
  ).toBeTruthy();
  expect(await page.locator("#inicio").innerText()).not.toContain("Sites com");
  const model = await page.request.get("/models/untold-glass.glb");
  expect((await model.body()).subarray(0, 4).toString()).toBe("glTF");
  await page.getByRole("button", { name: "Pausar animação" }).focus();
  await page.getByRole("button", { name: "Pausar animação" }).click();
  await page.mouse.move(0, 0);
  await page.screenshot({ path: "docs/screenshots/desktop-1440.png" });
  await scrollTo(page, "#manifesto");
  await expect(page.locator("header")).not.toHaveAttribute("inert", "");
  await expect(page.locator("header")).toHaveClass(/header-visible/);
  await page
    .locator(".desktop-nav")
    .getByRole("link", { name: "Serviços", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Mais sobre Desenvolvimento web" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test("morphing dialogs: touch targets, focus trap, Escape and contact destination", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await scrollTo(page, "#servicos");
  const trigger = page.getByRole("button", {
    name: "Mais sobre Design de interfaces",
  });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Design de interfaces");
  await expect(
    dialog.getByRole("button", { name: "Fechar detalhes" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect
    .poll(() => dialog.evaluate((el) => el.contains(document.activeElement)))
    .toBeTruthy();
  await page.screenshot({ path: "docs/screenshots/service-dialog.png" });
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "Conversar sobre o projeto" }).click();
  await expect(page).toHaveURL(/#contato/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("responsive: hero fits viewport, navigation and original technology assets", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [768, 1024],
    [1024, 768],
    [1440, 900],
    [2560, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    expect(
      await page
        .locator("#inicio")
        .evaluate(
          (el) => Math.abs(el.getBoundingClientRect().height - innerHeight) < 2,
        ),
    ).toBeTruthy();
    await page.screenshot({ path: `docs/screenshots/viewport-${width}.png` });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await scrollTo(page, "#manifesto");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page
    .locator("#mobile-menu")
    .getByRole("link", { name: "Projetos", exact: false })
    .click();
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  for (const name of [
    "html5",
    "css3",
    "javascript",
    "react",
    "nodejs",
    "vitejs",
    "vuejs",
    "figma",
  ]) {
    const r = await page.request.get(`/technologies/${name}.svg`);
    expect(r.ok()).toBeTruthy();
    expect(await r.text()).toContain("<svg");
  }
  await scrollTo(page, "#tecnologias");
  await page.screenshot({ path: "docs/screenshots/technologies-mobile.png" });
});

test("scroll choreography: passing words then a fully light process section", async ({
  page,
}) => {
  await page.goto("/");
  await page.setViewportSize({ width: 1440, height: 900 });
  const dimensions = await page.locator("#processo").evaluate((el) => ({
    top: el.getBoundingClientRect().top + scrollY,
    travel: el.getBoundingClientRect().height - innerHeight,
  }));
  await page.evaluate(
    ({ top, travel }) =>
      window.scrollTo({ top: top + travel * 0.35, behavior: "instant" }),
    dimensions,
  );
  await page.waitForTimeout(250);
  const before = await page
    .locator(".process-word-track")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.screenshot({ path: "docs/screenshots/process-letters.png" });
  await page.evaluate(
    ({ top, travel }) =>
      window.scrollTo({ top: top + travel * 0.96, behavior: "instant" }),
    dimensions,
  );
  await page.waitForTimeout(250);
  const after = await page
    .locator(".process-word-track")
    .evaluate((el) => getComputedStyle(el).transform);
  expect(after).not.toBe(before);
  expect(
    await page
      .locator(".process-inner")
      .evaluate((el) => getComputedStyle(el).color),
  ).toBe("rgb(16, 17, 26)");
  expect(
    await page
      .locator(".process-white")
      .evaluate((el) => getComputedStyle(el).clipPath),
  ).toContain("150%");
  expect(
    await page
      .locator(".process-details")
      .evaluate((el) => Number(getComputedStyle(el).opacity)),
  ).toBe(1);
  await page.screenshot({ path: "docs/screenshots/process-white.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await scrollTo(page, "#processo");
  await expect(page.locator(".process-chapter")).toHaveClass(/process-reduced/);
  await page.screenshot({ path: "docs/screenshots/process-mobile.png" });
});

test("technologies slow on hover, pause, and contact buttons respond magnetically", async ({
  page,
}) => {
  await page.goto("/");
  await scrollTo(page, "#tecnologias");
  const track = page.locator(".slider-track");
  await page.waitForTimeout(150);
  const before = await track.getAttribute("style");
  await page.waitForTimeout(180);
  expect(await track.getAttribute("style")).not.toBe(before);
  await page.getByRole("button", { name: "Pausar tecnologias" }).click();
  await page.waitForTimeout(80);
  const paused = await track.getAttribute("style");
  await page.waitForTimeout(120);
  expect(await track.getAttribute("style")).toBe(paused);
  await scrollTo(page, "#contato");
  const target = page.locator(".form-actions .magnetic");
  const box = (await target.boundingBox())!;
  await page.mouse.move(box.x + box.width - 4, box.y + 10);
  await page.waitForTimeout(200);
  expect(await target.getAttribute("style")).not.toContain("transform: none");
  await page.getByLabel("Seu nome").fill("Teste Untold");
  await page.getByLabel(/^E-mail/).fill("teste@example.com");
  await page
    .getByLabel("O que vamos construir?")
    .selectOption({ label: "Site institucional" });
  await page
    .getByLabel(/^Sua ideia/)
    .fill("Uma ideia para verificar a experiência completa.");
  const [file] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Baixar meu briefing" }).click(),
  ]);
  expect(await readFile((await file.path())!, "utf8")).toContain(
    "Teste Untold",
  );
  await expect(
    page.getByRole("button", { name: "Enviar projeto", exact: true }),
  ).toBeDisabled();
});

test("fallbacks: reduced motion, unsupported WebGL and mobile live sculpture", async ({
  browser,
}) => {
  for (const scenario of ["reduced", "no-webgl", "live"]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: scenario === "reduced" ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    if (scenario === "no-webgl")
      await page.addInitScript(() => {
        const get = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (
          this: HTMLCanvasElement,
          type: any,
          ...args: any[]
        ) {
          return type === "webgl2"
            ? null
            : (get as any).call(this, type, ...args);
        } as typeof get;
      });
    await page.goto("/");
    if (scenario === "live") {
      await expect(page.locator(".hero-visual")).toHaveAttribute(
        "data-ready",
        "true",
        { timeout: 30000 },
      );
      await page.getByRole("button", { name: "Pausar animação" }).focus();
      await page.getByRole("button", { name: "Pausar animação" }).click();
    } else {
      await expect(page.locator(".hero-visual")).toHaveAttribute(
        "data-ready",
        "false",
      );
      await expect(page.locator("canvas")).toHaveCount(0);
      await expect(page.locator(".glass-fallback")).toBeVisible();
    }
    await page.screenshot({
      path: `docs/screenshots/hero-${scenario}-390.png`,
    });
    await context.close();
  }
});

test("accessible page and open dialog; selection preserved with standard cursor", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  const check = async () => {
    const r = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      r.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  };
  await check();
  await scrollTo(page, "#servicos");
  await page
    .getByRole("button", { name: "Mais sobre Experiências digitais" })
    .click();
  await check();
  await page.keyboard.press("Escape");
  const selection = await page.locator("#manifesto h2").evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    getSelection()?.removeAllRanges();
    getSelection()?.addRange(range);
    return {
      cursor: getComputedStyle(el).cursor,
      text: getSelection()?.toString(),
    };
  });
  expect(selection.cursor).toBe("default");
  expect(selection.text).toContain("inesperado");
  expect((await page.request.get("/models/untold-glass.blend")).status()).toBe(
    404,
  );
  expect(errors).toEqual([]);
});
