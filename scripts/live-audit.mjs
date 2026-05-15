import { chromium } from 'playwright';

const targetUrl = process.argv[2] || process.env.SITE_URL || 'https://mycolabs-gold.vercel.app/';

function isTrackedResponse(url, resourceType) {
  if (resourceType === 'document' || resourceType === 'stylesheet' || resourceType === 'script') return true;
  return /\/image\.(webp|png)(\?|$)/.test(url);
}

function isThreeRequest(url) {
  return /\/assets\/three-|\/src\/three\/sporeNetwork|\/node_modules\/\.vite\/deps\/three/.test(url);
}

function bytes(value) {
  if (!value) return 'n/a';
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(2)} MiB`;
  if (value >= 1024) return `${Math.round(value / 1024)} KiB`;
  return `${value} B`;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2
});

const requests = [];
const responses = [];

page.on('request', (request) => {
  requests.push(request.url());
});

page.on('response', (response) => {
  const request = response.request();
  const url = response.url();
  const resourceType = request.resourceType();
  if (!isTrackedResponse(url, resourceType)) return;

  const headers = response.headers();
  responses.push({
    type: resourceType,
    url,
    status: response.status(),
    cacheControl: headers['cache-control'] || '',
    contentType: headers['content-type'] || '',
    contentLength: Number(headers['content-length'] || 0) || null
  });
});

const mainResponse = await page.goto(targetUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const performanceEntries = await page.evaluate(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  const resources = performance.getEntriesByType('resource');

  return [navigation, ...resources]
    .filter(Boolean)
    .filter((entry) => ['navigation', 'link', 'script', 'css', 'img'].includes(entry.initiatorType))
    .map((entry) => ({
      name: entry.name,
      type: entry.initiatorType,
      transferSize: entry.transferSize,
      encodedBodySize: entry.encodedBodySize,
      decodedBodySize: entry.decodedBodySize
    }));
});

await browser.close();

const threeRequests = requests.filter(isThreeRequest);
const summary = {
  checkedAt: new Date().toISOString(),
  url: targetUrl,
  status: mainResponse?.status() || null,
  mobileThreeRequested: threeRequests.length > 0,
  threeRequests,
  responses: responses.map((item) => ({
    ...item,
    contentLength: bytes(item.contentLength)
  })),
  transferSizes: performanceEntries.map((item) => ({
    ...item,
    transferSize: bytes(item.transferSize),
    encodedBodySize: bytes(item.encodedBodySize),
    decodedBodySize: bytes(item.decodedBodySize)
  }))
};

console.log(JSON.stringify(summary, null, 2));
