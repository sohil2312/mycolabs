import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.SITE_URL || 'http://127.0.0.1:5173/';

async function inspect(page, name, viewport) {
  await page.setViewportSize(viewport);
  const url = new URL(baseUrl);
  url.searchParams.set('verifyCanvas', '1');
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const first = await page.evaluate(() => {
    const canvas = document.querySelector('#hero-canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const samples = [];
    for (const xRatio of [0.18, 0.32, 0.48, 0.64, 0.78, 0.9]) {
      for (const yRatio of [0.16, 0.28, 0.42, 0.58, 0.72, 0.86]) {
        const pixels = new Uint8Array(4);
        context.readPixels(Math.floor(canvas.width * xRatio), Math.floor(canvas.height * yRatio), 1, 1, context.RGBA, context.UNSIGNED_BYTE, pixels);
        samples.push(Array.from(pixels));
      }
    }
    return {
      samples,
      frames: Number(canvas.dataset.frames || 0),
      rotation: Number(canvas.dataset.rotation || 0)
    };
  });

  await page.waitForTimeout(650);

  const result = await page.evaluate(() => {
    const canvas = document.querySelector('#hero-canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const samples = [];
    for (const xRatio of [0.18, 0.32, 0.48, 0.64, 0.78, 0.9]) {
      for (const yRatio of [0.16, 0.28, 0.42, 0.58, 0.72, 0.86]) {
        const pixels = new Uint8Array(4);
        context.readPixels(Math.floor(canvas.width * xRatio), Math.floor(canvas.height * yRatio), 1, 1, context.RGBA, context.UNSIGNED_BYTE, pixels);
        samples.push(Array.from(pixels));
      }
    }

    const header = document.querySelector('[data-site-header]').getBoundingClientRect();
    const heroTitle = document.querySelector('#hero-title').getBoundingClientRect();
    const cta = document.querySelector('.hero-actions').getBoundingClientRect();
    const services = document.querySelector('#services').getBoundingClientRect();

    return {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      samples,
      frames: Number(canvas.dataset.frames || 0),
      rotation: Number(canvas.dataset.rotation || 0),
      header,
      heroTitle,
      cta,
      services,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth
    };
  });

  await page.screenshot({ path: `test-artifacts/${name}.png`, fullPage: true });

  await page.locator('#services').scrollIntoViewIfNeeded();
  await page.waitForTimeout(850);
  const servicesState = await page.evaluate(() => {
    const card = document.querySelector('.service-card');
    const rect = card.getBoundingClientRect();
    return {
      visible: rect.top < window.innerHeight && rect.bottom > 0 && getComputedStyle(card).opacity !== '0',
      top: rect.top,
      bottom: rect.bottom
    };
  });
  await page.screenshot({ path: `test-artifacts/${name}-services.png` });

  await page.locator('#packages').scrollIntoViewIfNeeded();
  await page.waitForTimeout(850);
  const packagesState = await page.evaluate(() => {
    const card = document.querySelector('.package-card.is-featured');
    const rect = card.getBoundingClientRect();
    return {
      visible: rect.top < window.innerHeight && rect.bottom > 0 && getComputedStyle(card).opacity !== '0',
      top: rect.top,
      bottom: rect.bottom
    };
  });
  await page.screenshot({ path: `test-artifacts/${name}-packages.png` });

  return {
    first,
    second: { samples: result.samples, frames: result.frames, rotation: result.rotation },
    servicesState,
    packagesState,
    ...result
  };
}

function pixelSum(pixel) {
  return pixel[0] + pixel[1] + pixel[2] + pixel[3];
}

function sampleBrightness(samples) {
  return samples.reduce((sum, pixel) => sum + pixelSum(pixel), 0);
}

async function main() {
  await mkdir('test-artifacts', { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  const desktop = await inspect(page, 'desktop-home', { width: 1440, height: 1200 });
  const mobile = await inspect(page, 'mobile-home', { width: 390, height: 844 });
  await browser.close();

  const failures = [];
  for (const [name, result] of Object.entries({ desktop, mobile })) {
    if (result.canvasWidth < result.viewportWidth) failures.push(`${name}: canvas drawing buffer narrower than viewport`);
    if (sampleBrightness(result.second.samples) === 0) failures.push(`${name}: sampled canvas grid is blank`);
    if (result.second.frames <= result.first.frames) failures.push(`${name}: render frame counter did not advance`);
    if (result.second.rotation === result.first.rotation) failures.push(`${name}: scene rotation did not advance`);
    if (result.scrollWidth > result.viewportWidth + 2) failures.push(`${name}: horizontal scroll detected`);
    if (result.heroTitle.right > result.viewportWidth + 2 || result.heroTitle.left < -2) failures.push(`${name}: hero title outside viewport`);
    if (result.cta.right > result.viewportWidth + 2 || result.cta.left < -2) failures.push(`${name}: hero CTA outside viewport`);
    if (result.services.top < result.header.bottom && result.services.bottom > result.header.top) failures.push(`${name}: header overlaps services at load`);
    if (!result.servicesState.visible) failures.push(`${name}: service cards not visible after scroll`);
    if (!result.packagesState.visible) failures.push(`${name}: featured package not visible after scroll`);
  }
  if (errors.length) failures.push(`console errors: ${errors.join(' | ')}`);

  if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
  }

  console.log(JSON.stringify({ desktop, mobile }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
