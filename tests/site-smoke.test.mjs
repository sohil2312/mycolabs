import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.SITE_URL || 'http://127.0.0.1:5173/';
const immutableCacheHeader = 'public, max-age=31536000, immutable';

function isThreeRequest(url) {
  return /\/assets\/three-|\/src\/three\/sporeNetwork|\/node_modules\/\.vite\/deps\/three/.test(url);
}

async function inspectVercelHeaders() {
  try {
    const config = JSON.parse(await readFile('vercel.json', 'utf8'));
    const routes = new Map((config.headers || []).map((route) => [route.source, route]));
    const requiredSources = ['/assets/(.*)', '/image.webp', '/image.png'];

    return requiredSources.flatMap((source) => {
      const route = routes.get(source);
      const cacheHeader = route?.headers?.find((header) => header.key.toLowerCase() === 'cache-control')?.value;
      return cacheHeader === immutableCacheHeader
        ? []
        : [`${source}: missing immutable cache header`];
    });
  } catch (error) {
    return [`vercel.json missing or invalid: ${error.message}`];
  }
}

async function inspectViewport(browser, viewport, errors) {
  const page = await browser.newPage();
  const requests = [];
  const onRequest = (request) => requests.push(request.url());

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('request', onRequest);
  await page.setViewportSize(viewport);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  page.off('request', onRequest);

  const pageState = await page.evaluate(() => {
    const canvas = document.querySelector('#hero-canvas');
    const sections = ['products', 'package-maker', 'process', 'growth', 'contact'];
    const fontStylesheets = Array.from(document.querySelectorAll('link[href*="fonts.googleapis.com"]'))
      .map((link) => link.href);
    const requiredText = [
      'Digital growth tools for Gujarat manufacturers',
      'Built for manufacturers across Gujarat',
      'Interactive growth system',
      'Website categories',
      'Website Building',
      'Company Profile Website',
      'Product Catalogue Website',
      'Catalogue categories',
      'Catalogue Building',
      'Category-wise Product Catalogue',
      'WhatsApp Bots & Automation',
      'WhatsApp Catalogue Bot',
      'Automation Tools & Simple Software',
      'IndiaMART Listing Improvement',
      'Google Business Profile Improvement',
      'SEO Improvement Starter',
      'Package Maker',
      'Selected package includes',
      'Full Digital Presence Pack'
    ];
    const forbiddenText = [
      'Idar + Himatnagar',
      'Simple pricing',
      'Rs ',
      '₹',
      'Compliance Docs Pack',
      'HR/Payroll Compliance',
      'Loan/CMA/Project Report',
      'A2 - Manufacturer Digital Presence Pack'
    ];
    const bodyText = document.body.textContent;

    return {
      title: document.title,
      canvasElementPresent: !!canvas,
      canvasWidth: canvas?.width || 0,
      canvasHeight: canvas?.height || 0,
      canvasVisible: !!canvas && getComputedStyle(canvas).display !== 'none',
      threeRequests: [],
      fontStylesheets,
      broadFontStylesheets: fontStylesheets.filter((href) => href.includes('500') || href.includes('600')),
      heroRevealCount: document.querySelectorAll('.hero .reveal').length,
      missingSections: sections.filter((id) => !document.getElementById(id)),
      missingText: requiredText.filter((text) => !bodyText.includes(text)),
      forbiddenText: forbiddenText.filter((text) => bodyText.includes(text)),
      productTabCount: document.querySelectorAll('[data-product-tab]').length,
      heroFocusTabCount: document.querySelectorAll('[data-hero-focus-tab]').length,
      scatteredProductMenuCount: document.querySelectorAll('[data-product-menu] .product-menu-card').length,
      packageMakerCheckedCount: document.querySelectorAll('[data-package-option]:checked').length,
      packageSuggestion: document.querySelector('[data-package-result]')?.textContent?.trim() || '',
      selectedPackageItems: Array.from(document.querySelectorAll('[data-selection-pill]')).map((item) => item.textContent.trim()),
      heroTitleAnimation: getComputedStyle(document.querySelector('#hero-title')).animationName,
      hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth + 2
    };
  });

  await page.close();

  return {
    ...pageState,
    threeRequests: requests.filter(isThreeRequest)
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const errors = [];

  const desktop = await inspectViewport(browser, { width: 1440, height: 1000 }, errors);
  const mobile = await inspectViewport(browser, { width: 390, height: 844 }, errors);

  await browser.close();

  const failures = await inspectVercelHeaders();
  for (const [name, result] of Object.entries({ desktop, mobile })) {
    if (!result.title.includes('Myco Labs')) failures.push(`${name}: title missing Myco Labs`);
    if (!result.canvasElementPresent) failures.push(`${name}: canvas element missing`);
    if (name === 'desktop' && (!result.canvasWidth || !result.canvasHeight || !result.canvasVisible)) {
      failures.push(`${name}: canvas missing or hidden`);
    }
    if (name === 'mobile' && result.canvasVisible) failures.push(`${name}: canvas should be hidden when animation is skipped`);
    if (name === 'mobile' && result.threeRequests.length) {
      failures.push(`${name}: requested Three.js without verifyCanvas ${result.threeRequests.join(', ')}`);
    }
    if (result.broadFontStylesheets.length) {
      failures.push(`${name}: font request still includes unused weights ${result.broadFontStylesheets.join(', ')}`);
    }
    if (result.heroRevealCount > 0) failures.push(`${name}: hero content still depends on reveal initialization`);
    if (result.missingSections.length) failures.push(`${name}: missing sections ${result.missingSections.join(', ')}`);
    if (result.missingText.length) failures.push(`${name}: missing text ${result.missingText.join(', ')}`);
    if (result.forbiddenText.length) failures.push(`${name}: forbidden text still visible ${result.forbiddenText.join(', ')}`);
    if (result.productTabCount < 5) failures.push(`${name}: product tabs missing`);
    if (result.heroFocusTabCount < 5) failures.push(`${name}: hero animation tabs missing`);
    if (result.scatteredProductMenuCount > 0) failures.push(`${name}: duplicated product menu should be removed`);
    if (result.packageMakerCheckedCount < 2) failures.push(`${name}: package maker defaults missing`);
    if (!result.packageSuggestion.includes('Full Digital Presence Pack')) failures.push(`${name}: package suggestion missing expected default`);
    if (!result.selectedPackageItems.includes('Website') || !result.selectedPackageItems.includes('Google Business Profile')) {
      failures.push(`${name}: selected package list missing expected default items`);
    }
    if (!result.heroTitleAnimation || result.heroTitleAnimation === 'none') failures.push(`${name}: hero title has no first-view animation`);
    if (result.hasHorizontalScroll) failures.push(`${name}: horizontal scroll detected`);
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
