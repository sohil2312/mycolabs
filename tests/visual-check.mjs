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
    for (const xRatio of [0.14, 0.28, 0.42, 0.5, 0.58, 0.72, 0.86]) {
      for (const yRatio of [0.14, 0.26, 0.34, 0.42, 0.54, 0.66, 0.78, 0.9]) {
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
    for (const xRatio of [0.14, 0.28, 0.42, 0.5, 0.58, 0.72, 0.86]) {
      for (const yRatio of [0.14, 0.26, 0.34, 0.42, 0.54, 0.66, 0.78, 0.9]) {
        const pixels = new Uint8Array(4);
        context.readPixels(Math.floor(canvas.width * xRatio), Math.floor(canvas.height * yRatio), 1, 1, context.RGBA, context.UNSIGNED_BYTE, pixels);
        samples.push(Array.from(pixels));
      }
    }

    const header = document.querySelector('[data-site-header]').getBoundingClientRect();
    const heroTitle = document.querySelector('#hero-title').getBoundingClientRect();
    const cta = document.querySelector('.hero-actions').getBoundingClientRect();
    const products = document.querySelector('#products').getBoundingClientRect();
    const activeTab = document.querySelector('[data-product-tab][aria-selected="true"]')?.textContent?.trim() || '';

    return {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      samples,
      frames: Number(canvas.dataset.frames || 0),
      rotation: Number(canvas.dataset.rotation || 0),
      header,
      heroTitle,
      cta,
      products,
      activeTab,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth
    };
  });

  await page.screenshot({ path: `test-artifacts/${name}.png`, fullPage: true });

  await page.locator('#products').scrollIntoViewIfNeeded();
  await page.waitForTimeout(850);
  const productsState = await page.evaluate(() => {
    const isMobile = window.matchMedia('(max-width: 920px)').matches;
    const card = isMobile
      ? document.querySelector('[data-product-mobile-panel].is-active .product-detail-card')
      : document.querySelector('[data-product-detail] .product-detail-card');
    const rect = card.getBoundingClientRect();
    return {
      visible: rect.top < window.innerHeight && rect.bottom > 0 && getComputedStyle(card).opacity !== '0',
      activeTitle: card.querySelector('[data-product-title]')?.textContent?.trim() || '',
      top: rect.top,
      bottom: rect.bottom
    };
  });
  await page.screenshot({ path: `test-artifacts/${name}-services.png` });

  await page.locator('[data-product-tab="catalogue"]').click();
  await page.waitForTimeout(350);
  const tabState = await page.evaluate(() => {
    const isMobile = window.matchMedia('(max-width: 920px)').matches;
    const activeButton = document.querySelector('[data-product-tab][aria-selected="true"]');
    const mobilePanel = document.querySelector('[data-product-mobile-panel].is-active');
    const desktopTitle = document.querySelector('[data-product-detail] [data-product-title]')?.textContent?.trim() || '';
    const activeTitle = isMobile
      ? mobilePanel?.querySelector('[data-product-title]')?.textContent?.trim() || ''
      : desktopTitle;
    const buttonRect = activeButton?.getBoundingClientRect();
    const panelRect = mobilePanel?.getBoundingClientRect();

    return {
      activeTab: activeButton?.textContent?.trim() || '',
      activeTitle,
      mobilePanelVisible: !!mobilePanel && getComputedStyle(mobilePanel).display !== 'none' && panelRect.bottom > 0 && panelRect.top < window.innerHeight,
      mobilePanelGap: buttonRect && panelRect ? panelRect.top - buttonRect.bottom : null
    };
  });

  await page.locator('#package-maker').scrollIntoViewIfNeeded();
  await page.waitForTimeout(850);
  const packageState = await page.evaluate(() => {
    const card = document.querySelector('.package-maker-card');
    const rect = card.getBoundingClientRect();
    return {
      visible: rect.top < window.innerHeight && rect.bottom > 0 && getComputedStyle(card).opacity !== '0',
      selectedCount: document.querySelectorAll('[data-package-option]:checked').length,
      result: document.querySelector('[data-package-result]')?.textContent?.trim() || '',
      top: rect.top,
      bottom: rect.bottom
    };
  });
  await page.screenshot({ path: `test-artifacts/${name}-packages.png` });

  return {
    first,
    second: { samples: result.samples, frames: result.frames, rotation: result.rotation },
    productsState,
    tabState,
    packageState,
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
    if (result.products.top < result.header.bottom && result.products.bottom > result.header.top) failures.push(`${name}: header overlaps products at load`);
    if (!result.productsState.visible) failures.push(`${name}: product cards not visible after scroll`);
    if (!result.productsState.activeTitle.includes('Website Building')) failures.push(`${name}: default product tab content missing`);
    if (!result.tabState.activeTab.includes('Catalogue')) failures.push(`${name}: catalogue tab did not become active`);
    if (!result.tabState.activeTitle.includes('Catalogue Building')) failures.push(`${name}: catalogue tab content missing`);
    if (name === 'mobile' && !result.tabState.mobilePanelVisible) failures.push(`${name}: active mobile product detail is not visible below selected product`);
    if (name === 'mobile' && (result.tabState.mobilePanelGap === null || result.tabState.mobilePanelGap > 24)) failures.push(`${name}: active product detail is too far from selected product`);
    if (!result.packageState.visible) failures.push(`${name}: package maker not visible after scroll`);
    if (result.packageState.selectedCount < 2) failures.push(`${name}: package maker default selections missing`);
    if (!result.packageState.result.includes('Full Digital Presence Pack')) failures.push(`${name}: package maker result missing`);
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
