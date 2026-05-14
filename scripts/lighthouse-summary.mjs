import { readFile } from 'node:fs/promises';

const reportPath = process.argv[2] || 'site_review/lighthouse.json';
const report = JSON.parse(await readFile(reportPath, 'utf8'));
const audits = report.audits || {};
const categories = report.categories || {};
const metrics = audits.metrics?.details?.items?.[0] || {};

function score(value) {
  return value === null || value === undefined ? 'n/a' : Math.round(value * 100);
}

function time(value) {
  return value === null || value === undefined ? 'n/a' : `${Math.round(value)} ms`;
}

function bytes(value) {
  if (value === null || value === undefined) return 'n/a';
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(2)} MiB`;
  if (value >= 1024) return `${Math.round(value / 1024)} KiB`;
  return `${value} B`;
}

const categoryRows = Object.entries(categories).map(([id, category]) => ({
  id,
  title: category.title,
  score: score(category.score)
}));

const metricRows = [
  ['FCP', metrics.firstContentfulPaint],
  ['LCP', metrics.largestContentfulPaint],
  ['TTI', metrics.interactive],
  ['Speed Index', metrics.speedIndex],
  ['TBT', metrics.totalBlockingTime],
  ['TTFB', metrics.timeToFirstByte]
].map(([name, value]) => ({ name, value: time(value) }));

const failingAudits = Object.entries(audits)
  .filter(([, audit]) => audit.score !== null && audit.score !== undefined && audit.score < 1)
  .map(([id, audit]) => ({
    id,
    title: audit.title,
    score: score(audit.score),
    displayValue: audit.displayValue || ''
  }))
  .sort((a, b) => a.score - b.score)
  .slice(0, 12);

const heavyResources = audits['total-byte-weight']?.details?.items
  ?.slice()
  ?.sort((a, b) => b.totalBytes - a.totalBytes)
  ?.slice(0, 8)
  ?.map((item) => ({ url: item.url, transfer: bytes(item.totalBytes) })) || [];

console.log('\nCategory scores');
console.table(categoryRows);

console.log('\nCore metrics');
console.table(metricRows);

console.log('\nTop failing audits');
console.table(failingAudits);

console.log('\nLargest resources');
console.table(heavyResources);
