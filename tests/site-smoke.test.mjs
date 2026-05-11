import { chromium } from 'playwright';

const baseUrl = process.env.SITE_URL || 'http://127.0.0.1:5173/';

async function inspectViewport(page, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  return page.evaluate(() => {
    const canvas = document.querySelector('#hero-canvas');
    const sections = ['products', 'package-maker', 'process', 'growth', 'contact'];
    const requiredText = [
      'Digital growth tools for Gujarat manufacturers',
      'Built for manufacturers across Gujarat',
      'Website Building',
      'Catalogue Building',
      'WhatsApp Bots & Automation',
      'IndiaMART Improvement',
      'Google Business Profile Improvement',
      'SEO Starter Pack',
      'Package Maker',
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
      canvasWidth: canvas?.width || 0,
      canvasHeight: canvas?.height || 0,
      canvasVisible: !!canvas && getComputedStyle(canvas).display !== 'none',
      missingSections: sections.filter((id) => !document.getElementById(id)),
      missingText: requiredText.filter((text) => !bodyText.includes(text)),
      forbiddenText: forbiddenText.filter((text) => bodyText.includes(text)),
      productTabCount: document.querySelectorAll('[data-product-tab]').length,
      scatteredProductMenuCount: document.querySelectorAll('[data-product-menu] .product-menu-card').length,
      packageMakerCheckedCount: document.querySelectorAll('[data-package-option]:checked').length,
      packageSuggestion: document.querySelector('[data-package-result]')?.textContent?.trim() || '',
      heroTitleAnimation: getComputedStyle(document.querySelector('#hero-title')).animationName,
      hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth + 2
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];

  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  const desktop = await inspectViewport(page, { width: 1440, height: 1000 });
  const mobile = await inspectViewport(page, { width: 390, height: 844 });

  await browser.close();

  const failures = [];
  for (const [name, result] of Object.entries({ desktop, mobile })) {
    if (!result.title.includes('Myco Labs')) failures.push(`${name}: title missing Myco Labs`);
    if (!result.canvasWidth || !result.canvasHeight || !result.canvasVisible) failures.push(`${name}: canvas missing or hidden`);
    if (result.missingSections.length) failures.push(`${name}: missing sections ${result.missingSections.join(', ')}`);
    if (result.missingText.length) failures.push(`${name}: missing text ${result.missingText.join(', ')}`);
    if (result.forbiddenText.length) failures.push(`${name}: forbidden text still visible ${result.forbiddenText.join(', ')}`);
    if (result.productTabCount < 5) failures.push(`${name}: product tabs missing`);
    if (result.scatteredProductMenuCount > 0) failures.push(`${name}: duplicated product menu should be removed`);
    if (result.packageMakerCheckedCount < 2) failures.push(`${name}: package maker defaults missing`);
    if (!result.packageSuggestion.includes('Full Digital Presence Pack')) failures.push(`${name}: package suggestion missing expected default`);
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
