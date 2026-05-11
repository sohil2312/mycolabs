# Myco Labs 3D Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fast, premium, A2-first Myco Labs single-page website with interactive Three.js animation on desktop and mobile.

**Architecture:** Create a Vite static site using focused vanilla JavaScript modules. Keep content data, UI animation, and Three.js rendering isolated so the landing page stays maintainable and fast. Use real HTML for all marketing content and a decorative WebGL canvas for the spore-network experience.

**Tech Stack:** Vite, vanilla JavaScript ES modules, Three.js, CSS custom properties, Intersection Observer, Playwright or Chrome DevTools protocol for verification.

---

## File Structure

Create this app structure:

```text
package.json
index.html
public/
  image.png
src/
  main.js
  styles.css
  data/
    services.js
  three/
    sporeNetwork.js
  utils/
    motion.js
docs/
  superpowers/
    specs/
      2026-05-11-mycolabs-3d-website-design.md
    plans/
      2026-05-11-mycolabs-3d-website.md
  visual-asset-prompts.md
```

Responsibilities:

- `package.json`: scripts and dependencies.
- `index.html`: semantic single-page marketing content and section anchors.
- `public/image.png`: logo/theme image copied from `website and logos/image.png`.
- `src/styles.css`: full visual system, responsive layout, dark premium theme, animations, accessibility states.
- `src/data/services.js`: service/package/process content used by `main.js`.
- `src/main.js`: DOM rendering for cards/timelines, interaction wiring, and bootstrapping.
- `src/three/sporeNetwork.js`: all Three.js setup, animation, resize, reduced-motion handling, and cleanup.
- `src/utils/motion.js`: scroll reveal helpers and pointer capability helpers.

---

## Task 1: Scaffold Vite Static Site

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/styles.css`
- Create: `src/data/services.js`
- Create: `src/utils/motion.js`
- Create: `src/three/sporeNetwork.js`
- Copy: `website and logos/image.png` to `public/image.png`

- [ ] **Step 1: Create package manifest**

Create `package.json`:

```json
{
  "name": "mycolabs-3d-website",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1"
  },
  "dependencies": {
    "vite": "^7.2.7",
    "three": "^0.181.2"
  },
  "devDependencies": {}
}
```

- [ ] **Step 2: Copy the logo/theme image into public assets**

Run:

```bash
mkdir -p public
cp "website and logos/image.png" public/image.png
```

Expected: `public/image.png` exists.

- [ ] **Step 3: Create source folders**

Run:

```bash
mkdir -p src/data src/three src/utils
```

Expected: `src/data`, `src/three`, and `src/utils` exist.

- [ ] **Step 4: Create initial HTML shell**

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Myco Labs builds digital catalogs, websites, WhatsApp catalogs, IndiaMART optimization, and Google Business Profile upgrades for Gujarat manufacturers."
    />
    <title>Myco Labs - Digital presence for Gujarat manufacturers</title>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <canvas id="hero-canvas" aria-hidden="true"></canvas>
    <header class="site-header" data-site-header>
      <a class="brand" href="#top" aria-label="Myco Labs home">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-text">myco labs</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        <a href="#services">Services</a>
        <a href="#a2-pack">A2 Pack</a>
        <a href="#process">Process</a>
        <a href="#packages">Packages</a>
        <a href="#contact">Contact</a>
      </nav>
      <a class="nav-cta" href="https://wa.me/910000000000?text=Hi%20Myco%20Labs%2C%20I%20want%20to%20upgrade%20my%20business%20digital%20presence." target="_blank" rel="noreferrer">
        WhatsApp inquiry
      </a>
    </header>

    <main id="main">
      <section id="top" class="hero section" aria-labelledby="hero-title">
        <div class="hero-content reveal">
          <p class="eyebrow">Myco Labs / Idar + Himatnagar</p>
          <h1 id="hero-title">Digital presence for Gujarat manufacturers</h1>
          <p class="hero-copy">
            Buyer-ready catalogs, fast websites, WhatsApp catalogs, IndiaMART optimization, and Google Business Profile upgrades for manufacturers who need better trust before the first call.
          </p>
          <div class="hero-actions">
            <a class="button button-primary" href="https://wa.me/910000000000?text=Hi%20Myco%20Labs%2C%20I%20want%20to%20discuss%20A2%20Manufacturer%20Digital%20Presence%20Pack." target="_blank" rel="noreferrer">
              Start on WhatsApp
            </a>
            <a class="button button-secondary" href="#a2-pack">View A2 Pack</a>
          </div>
          <div class="trust-strip" aria-label="Core deliverables">
            <span>Catalogs</span>
            <span>Websites</span>
            <span>WhatsApp</span>
            <span>IndiaMART</span>
            <span>GBP</span>
          </div>
        </div>
      </section>

      <section id="services" class="section services-section" aria-labelledby="services-title">
        <div class="section-heading reveal">
          <p class="eyebrow">What Myco Labs builds</p>
          <h2 id="services-title">A complete practical growth stack for local manufacturers</h2>
          <p>Start with A2, then add business-support services as the relationship grows.</p>
        </div>
        <div class="service-grid" data-services></div>
      </section>

      <section id="a2-pack" class="section a2-section" aria-labelledby="a2-title">
        <div class="section-heading reveal">
          <p class="eyebrow">A2 Manufacturer Digital Presence Pack</p>
          <h2 id="a2-title">Five assets that make a factory easier to trust</h2>
          <p>Designed for B2B buyers who want product clarity, proof, and a quick inquiry path.</p>
        </div>
        <div class="deliverable-orbit" data-deliverables></div>
      </section>

      <section class="section comparison-section" aria-labelledby="comparison-title">
        <div class="section-heading reveal">
          <p class="eyebrow">Before / After</p>
          <h2 id="comparison-title">From scattered presence to buyer-ready system</h2>
        </div>
        <div class="comparison-panel reveal" data-comparison></div>
      </section>

      <section id="process" class="section process-section" aria-labelledby="process-title">
        <div class="section-heading reveal">
          <p class="eyebrow">Process</p>
          <h2 id="process-title">Clear delivery from first visit to handover</h2>
        </div>
        <div class="timeline" data-process></div>
      </section>

      <section id="packages" class="section packages-section" aria-labelledby="packages-title">
        <div class="section-heading reveal">
          <p class="eyebrow">Packages</p>
          <h2 id="packages-title">Simple pricing with Premium as the practical default</h2>
        </div>
        <div class="package-grid" data-packages></div>
      </section>

      <section class="section trust-section" aria-labelledby="trust-title">
        <div class="trust-card reveal">
          <p class="eyebrow">Local advantage</p>
          <h2 id="trust-title">Built for Idar, Himatnagar, and Gujarat manufacturers</h2>
          <p>
            Gujarati + English communication, banking-sector credibility, WhatsApp-first follow-up, and a practical understanding of how small manufacturers actually sell.
          </p>
        </div>
      </section>

      <section id="contact" class="section final-cta" aria-labelledby="contact-title">
        <div class="final-cta-inner reveal">
          <p class="eyebrow">Start simple</p>
          <h2 id="contact-title">Send your business name and product category.</h2>
          <p>Myco Labs will review your current Google, IndiaMART, website, and WhatsApp presence and suggest the right next step.</p>
          <a class="button button-primary" href="https://wa.me/910000000000?text=Hi%20Myco%20Labs%2C%20my%20business%20name%20is%20..." target="_blank" rel="noreferrer">
            Message Myco Labs
          </a>
        </div>
      </section>
    </main>

    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 5: Create temporary source files**

Create these empty files so imports can be added in later tasks:

```js
// src/main.js
import './styles.css';
```

```css
/* src/styles.css */
```

```js
// src/data/services.js
export const services = [];
export const deliverables = [];
export const processSteps = [];
export const packages = [];
```

```js
// src/utils/motion.js
export function initReveals() {}
```

```js
// src/three/sporeNetwork.js
export function createSporeNetwork() {
  return { destroy() {} };
}
```

- [ ] **Step 6: Install dependencies**

Run:

```bash
npm install
```

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 7: Verify scaffold builds**

Run:

```bash
npm run build
```

Expected: `vite build` exits 0 and creates `dist/`.

---

## Task 2: Content Data and Rendering

**Files:**
- Modify: `src/data/services.js`
- Modify: `src/main.js`

- [ ] **Step 1: Add structured content data**

Replace `src/data/services.js`:

```js
export const services = [
  {
    title: 'A1 - Google Business Profile Boost',
    label: 'Month 1',
    summary: 'Improve local discovery, trust signals, photos, products, services, and review response discipline.',
    accent: 'Local visibility',
    featured: false
  },
  {
    title: 'A2 - Manufacturer Digital Presence Pack',
    label: 'Primary offer',
    summary: 'A buyer-ready system covering catalog, website, WhatsApp catalog, IndiaMART, and Google Business Profile.',
    accent: 'A2 hero offer',
    featured: true
  },
  {
    title: 'Compliance Docs Pack',
    label: 'Month 3',
    summary: 'Support for FSSAI, ISO, factory licence, pollution NOC, IEC, and similar business documentation.',
    accent: 'Documentation',
    featured: false
  },
  {
    title: 'HR/Payroll Compliance',
    label: 'Month 4',
    summary: 'Factory-friendly monthly support for basic HR, payroll, and compliance workflows.',
    accent: 'Retainer support',
    featured: false
  },
  {
    title: 'Loan/CMA/Project Report',
    label: 'Conditional',
    summary: 'High-margin documentation support only if outside-consultancy rules permit it and never for own-bank customers.',
    accent: 'Permission gate',
    featured: false
  },
  {
    title: 'Industrial WhatsApp Catalog',
    label: 'Pilot',
    summary: 'A controlled pilot for PPE, fasteners, lubricants, and industrial supplies before any physical-shop decision.',
    accent: 'Validate first',
    featured: false
  }
];

export const deliverables = [
  {
    title: 'PDF Sales Catalog',
    summary: 'A 12-16 page bilingual catalog with product photos, specs, MOQ, lead time, and QR inquiry paths.'
  },
  {
    title: 'Single-page Website',
    summary: 'A fast page with company story, products, inquiry form path, Google Maps, WhatsApp, and basic SEO.'
  },
  {
    title: 'WhatsApp Business Catalog',
    summary: 'Up to 30 SKUs organized so buyers can ask for quotes without waiting for a file.'
  },
  {
    title: 'IndiaMART Optimization',
    summary: 'Sharper photos, keywords, product descriptions, and profile hygiene for marketplace buyers.'
  },
  {
    title: 'Google Business Profile',
    summary: 'Better categories, photos, services, products, posts, and local trust signals.'
  }
];

export const comparison = {
  before: [
    'Old PDF or PowerPoint profile',
    'Weak or missing website',
    'Half-set WhatsApp catalog',
    'IndiaMART dependency',
    'Unoptimized Google listing'
  ],
  after: [
    'Buyer-ready product catalog',
    'Fast website with inquiry paths',
    'Organized WhatsApp catalog',
    'Cleaner marketplace presence',
    'Better Google trust signals'
  ]
};

export const processSteps = [
  'Discovery and current presence review',
  'Plant visit and content gathering',
  'Photography and catalog copy',
  'Catalog and website production',
  'WhatsApp and GBP setup',
  'Handover, support, and follow-up'
];

export const packages = [
  {
    name: 'Standard',
    price: 'Rs 12,000',
    note: 'Budget entry',
    features: ['8-page catalog', 'Core digital setup', 'One revision round'],
    featured: false
  },
  {
    name: 'Premium',
    price: 'Rs 18,000',
    note: 'Recommended',
    features: ['16-page catalog', 'Two on-site photoshoots', '12-month minor updates'],
    featured: true
  },
  {
    name: 'Export',
    price: 'Rs 25,000',
    note: 'Exporter-focused',
    features: ['English + Hindi versions', 'HS codes and certifications', 'IEC/APEDA help'],
    featured: false
  }
];
```

- [ ] **Step 2: Render data-driven sections**

Replace `src/main.js`:

```js
import './styles.css';
import { services, deliverables, comparison, processSteps, packages } from './data/services.js';
import { initReveals, initHeaderState } from './utils/motion.js';
import { createSporeNetwork } from './three/sporeNetwork.js';

const whatsappHref = 'https://wa.me/910000000000?text=Hi%20Myco%20Labs%2C%20I%20want%20to%20discuss%20A2%20Manufacturer%20Digital%20Presence%20Pack.';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderServices() {
  const target = document.querySelector('[data-services]');
  target.innerHTML = services.map((service, index) => `
    <article class="service-card reveal ${service.featured ? 'is-featured' : ''}" style="--delay: ${index * 70}ms">
      <div class="card-kicker">${escapeHtml(service.label)}</div>
      <h3>${escapeHtml(service.title)}</h3>
      <p>${escapeHtml(service.summary)}</p>
      <span class="card-accent">${escapeHtml(service.accent)}</span>
    </article>
  `).join('');
}

function renderDeliverables() {
  const target = document.querySelector('[data-deliverables]');
  target.innerHTML = deliverables.map((item, index) => `
    <article class="deliverable-card reveal" style="--angle: ${index * 72}deg; --delay: ${index * 80}ms">
      <span class="node-dot" aria-hidden="true"></span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
    </article>
  `).join('');
}

function renderComparison() {
  const target = document.querySelector('[data-comparison]');
  const list = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  target.innerHTML = `
    <div class="comparison-column before">
      <span class="comparison-label">Before</span>
      <h3>Scattered presence</h3>
      <ul>${list(comparison.before)}</ul>
    </div>
    <div class="comparison-divider" aria-hidden="true"></div>
    <div class="comparison-column after">
      <span class="comparison-label">After</span>
      <h3>Buyer-ready system</h3>
      <ul>${list(comparison.after)}</ul>
    </div>
  `;
}

function renderProcess() {
  const target = document.querySelector('[data-process]');
  target.innerHTML = processSteps.map((step, index) => `
    <article class="timeline-step reveal" style="--delay: ${index * 80}ms">
      <span class="timeline-number">${String(index + 1).padStart(2, '0')}</span>
      <p>${escapeHtml(step)}</p>
    </article>
  `).join('');
}

function renderPackages() {
  const target = document.querySelector('[data-packages]');
  target.innerHTML = packages.map((pack, index) => `
    <article class="package-card reveal ${pack.featured ? 'is-featured' : ''}" style="--delay: ${index * 90}ms">
      <span class="package-note">${escapeHtml(pack.note)}</span>
      <h3>${escapeHtml(pack.name)}</h3>
      <p class="package-price">${escapeHtml(pack.price)}</p>
      <ul>${pack.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>
      <a class="button ${pack.featured ? 'button-primary' : 'button-secondary'}" href="${whatsappHref}" target="_blank" rel="noreferrer">
        Ask about ${escapeHtml(pack.name)}
      </a>
    </article>
  `).join('');
}

function init() {
  renderServices();
  renderDeliverables();
  renderComparison();
  renderProcess();
  renderPackages();
  initHeaderState();
  initReveals();

  const canvas = document.querySelector('#hero-canvas');
  const network = createSporeNetwork(canvas, {
    labels: ['Catalog', 'Website', 'WhatsApp', 'IndiaMART', 'GBP', 'Compliance', 'Payroll']
  });

  window.addEventListener('pagehide', () => network.destroy(), { once: true });
}

init();
```

- [ ] **Step 3: Verify content appears in built HTML runtime**

Run:

```bash
npm run build
```

Expected: build exits 0. The page will still be unstyled until Task 3 but data-rendered content is ready.

---

## Task 3: Premium Responsive CSS System

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add full visual system and layout CSS**

Replace `src/styles.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

:root {
  color-scheme: dark;
  --bg: #030706;
  --bg-2: #07110f;
  --panel: rgba(8, 20, 18, 0.72);
  --panel-strong: rgba(13, 31, 28, 0.88);
  --line: rgba(16, 185, 129, 0.22);
  --line-strong: rgba(16, 185, 129, 0.52);
  --text: #f8fafc;
  --muted: #9fb2ad;
  --soft: #d8efe8;
  --brand: #10b981;
  --brand-2: #58f1bd;
  --navy: #0f172a;
  --danger-muted: #b8aaa1;
  --radius: 8px;
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
  font-family: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  background: var(--bg);
}

body {
  min-width: 320px;
  margin: 0;
  color: var(--text);
  background:
    linear-gradient(rgba(16, 185, 129, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.035) 1px, transparent 1px),
    radial-gradient(circle at 28% 18%, rgba(16, 185, 129, 0.2), transparent 28rem),
    radial-gradient(circle at 76% 8%, rgba(56, 189, 248, 0.1), transparent 24rem),
    linear-gradient(180deg, #030706 0%, #06110f 45%, #020404 100%);
  background-size: 48px 48px, 48px 48px, auto, auto, auto;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: url('/image.png');
  background-size: cover;
  background-position: center;
  opacity: 0.08;
  mix-blend-mode: screen;
  filter: saturate(0.9) contrast(1.1);
  z-index: -3;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

.skip-link {
  position: fixed;
  left: 1rem;
  top: 1rem;
  z-index: 30;
  padding: 0.7rem 1rem;
  background: var(--text);
  color: var(--navy);
  border-radius: var(--radius);
  transform: translateY(-160%);
  transition: transform 180ms ease;
}

.skip-link:focus {
  transform: translateY(0);
}

#hero-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  opacity: 0.96;
}

.site-header {
  position: fixed;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 20;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0.62rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius);
  background: rgba(4, 11, 10, 0.56);
  backdrop-filter: blur(20px) saturate(1.2);
  box-shadow: var(--shadow);
  transition: background 220ms ease, border-color 220ms ease;
}

.site-header.is-scrolled {
  background: rgba(4, 11, 10, 0.88);
  border-color: var(--line);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  min-width: max-content;
  font-weight: 800;
}

.brand-mark {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 999px;
  background: var(--brand);
  box-shadow: 0 0 22px rgba(16, 185, 129, 0.9);
}

.brand-text {
  color: var(--text);
  font-size: 1rem;
}

.site-nav {
  justify-self: center;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.site-nav a,
.nav-cta,
.button {
  cursor: pointer;
}

.site-nav a {
  padding: 0.65rem 0.78rem;
  color: var(--muted);
  border-radius: var(--radius);
  font-size: 0.86rem;
  transition: color 180ms ease, background 180ms ease;
}

.site-nav a:hover,
.site-nav a:focus-visible {
  color: var(--text);
  background: rgba(255, 255, 255, 0.06);
  outline: none;
}

.nav-cta,
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.78rem 1rem;
  border-radius: var(--radius);
  border: 1px solid transparent;
  font-weight: 800;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
}

.nav-cta,
.button-primary {
  color: #02110c;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  box-shadow: 0 16px 40px rgba(16, 185, 129, 0.28);
}

.button-secondary {
  color: var(--text);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
}

.nav-cta:hover,
.button:hover,
.nav-cta:focus-visible,
.button:focus-visible {
  transform: translateY(-2px);
  outline: none;
  border-color: var(--line-strong);
}

.section {
  position: relative;
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 7rem 0;
}

.hero {
  display: grid;
  align-items: center;
  min-height: 100svh;
  padding-top: 9rem;
}

.hero-content {
  width: min(760px, 100%);
}

.eyebrow,
.card-kicker,
.package-note,
.comparison-label {
  margin: 0 0 0.85rem;
  color: var(--brand-2);
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  max-width: 12ch;
  margin-bottom: 1.25rem;
  font-size: clamp(4rem, 8vw, 8.6rem);
  line-height: 0.95;
  font-weight: 800;
}

h2 {
  max-width: 13ch;
  margin-bottom: 1rem;
  font-size: clamp(2.35rem, 5vw, 5rem);
  line-height: 1;
  font-weight: 800;
}

h3 {
  margin-bottom: 0.75rem;
  font-size: 1.15rem;
  line-height: 1.18;
}

p {
  color: var(--muted);
  line-height: 1.72;
}

.hero-copy {
  max-width: 660px;
  color: var(--soft);
  font-size: 1.12rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 2rem 0;
}

.trust-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.trust-strip span,
.card-accent {
  display: inline-flex;
  padding: 0.48rem 0.68rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  color: var(--soft);
  background: rgba(6, 18, 16, 0.7);
  font-size: 0.78rem;
  font-weight: 700;
}

.section-heading {
  display: grid;
  gap: 0.3rem;
  margin-bottom: 2rem;
}

.section-heading p {
  max-width: 700px;
}

.service-grid,
.package-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.service-card,
.deliverable-card,
.package-card,
.comparison-panel,
.timeline-step,
.trust-card,
.final-cta-inner {
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--radius);
  background: var(--panel);
  box-shadow: var(--shadow);
  backdrop-filter: blur(18px) saturate(1.15);
}

.service-card,
.package-card,
.timeline-step {
  padding: 1.35rem;
  min-height: 14rem;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
}

.service-card:hover,
.package-card:hover {
  transform: translateY(-4px);
  border-color: var(--line-strong);
  background: var(--panel-strong);
}

.service-card.is-featured,
.package-card.is-featured {
  border-color: var(--line-strong);
  background:
    radial-gradient(circle at 20% 0%, rgba(16, 185, 129, 0.22), transparent 16rem),
    var(--panel-strong);
}

.service-card p,
.deliverable-card p,
.package-card p {
  min-height: 5rem;
}

.a2-section {
  width: min(1080px, calc(100% - 2rem));
}

.deliverable-orbit {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.8rem;
}

.deliverable-orbit::before {
  content: '';
  position: absolute;
  inset: 22% 4%;
  border: 1px solid var(--line);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.6;
}

.deliverable-card {
  position: relative;
  min-height: 18rem;
  padding: 1.2rem;
  overflow: hidden;
}

.node-dot {
  display: block;
  width: 0.8rem;
  height: 0.8rem;
  margin-bottom: 1rem;
  border-radius: 50%;
  background: var(--brand);
  box-shadow: 0 0 24px rgba(16, 185, 129, 0.78);
}

.comparison-panel {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  padding: 1rem;
}

.comparison-column {
  padding: 1.3rem;
}

.comparison-column ul,
.package-card ul {
  display: grid;
  gap: 0.7rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.comparison-column li,
.package-card li {
  color: var(--soft);
}

.comparison-column li::before,
.package-card li::before {
  content: '';
  display: inline-block;
  width: 0.45rem;
  height: 0.45rem;
  margin-right: 0.55rem;
  border-radius: 50%;
  background: var(--brand);
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.8);
}

.comparison-column.before li::before {
  background: var(--danger-muted);
  box-shadow: none;
}

.comparison-divider {
  width: 1px;
  background: linear-gradient(transparent, var(--line-strong), transparent);
}

.timeline {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.75rem;
}

.timeline-step {
  min-height: 12rem;
}

.timeline-number {
  display: block;
  margin-bottom: 2rem;
  color: var(--brand-2);
  font-size: 0.9rem;
  font-weight: 800;
}

.package-price {
  color: var(--text);
  font-size: 2rem;
  font-weight: 800;
}

.trust-card,
.final-cta-inner {
  padding: clamp(1.4rem, 5vw, 4rem);
}

.trust-card h2,
.final-cta-inner h2 {
  max-width: 15ch;
}

.final-cta {
  padding-bottom: 5rem;
}

.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms ease, transform 600ms ease;
  transition-delay: var(--delay, 0ms);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 920px) {
  .site-header {
    grid-template-columns: 1fr auto;
  }

  .site-nav {
    display: none;
  }

  .section {
    padding: 5rem 0;
  }

  .hero {
    min-height: 92svh;
  }

  h1 {
    max-width: 11ch;
    font-size: clamp(3.2rem, 15vw, 5.8rem);
  }

  h2 {
    font-size: clamp(2rem, 10vw, 3.7rem);
  }

  .service-grid,
  .package-grid,
  .deliverable-orbit,
  .timeline {
    grid-template-columns: 1fr;
  }

  .deliverable-orbit::before {
    inset: 0 auto 0 1.6rem;
    width: 1px;
    border: 0;
    border-left: 1px solid var(--line);
    border-radius: 0;
  }

  .deliverable-card,
  .service-card,
  .package-card,
  .timeline-step {
    min-height: auto;
  }

  .comparison-panel {
    grid-template-columns: 1fr;
  }

  .comparison-divider {
    width: 100%;
    height: 1px;
  }
}

@media (max-width: 560px) {
  .site-header {
    top: 0.6rem;
    left: 0.6rem;
    right: 0.6rem;
  }

  .brand-text {
    font-size: 0.92rem;
  }

  .nav-cta {
    min-height: 2.45rem;
    padding: 0.65rem 0.72rem;
    font-size: 0.78rem;
  }

  .section {
    width: min(100% - 1rem, 1180px);
  }

  .hero-actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 2: Verify CSS build**

Run:

```bash
npm run build
```

Expected: build exits 0 with no CSS syntax errors.

---

## Task 4: Scroll Motion and Header State

**Files:**
- Modify: `src/utils/motion.js`

- [ ] **Step 1: Implement reveal and header helpers**

Replace `src/utils/motion.js`:

```js
export function initHeaderState() {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

export function initReveals() {
  const elements = Array.from(document.querySelectorAll('.reveal'));
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -8% 0px'
  });

  elements.forEach((element) => observer.observe(element));
}
```

- [ ] **Step 2: Verify build**

Run:

```bash
npm run build
```

Expected: build exits 0.

---

## Task 5: Three.js Spore Network

**Files:**
- Modify: `src/three/sporeNetwork.js`

- [ ] **Step 1: Implement performant Three.js scene**

Replace `src/three/sporeNetwork.js`:

```js
import * as THREE from 'three';

const desktopQuery = '(min-width: 768px)';

function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getConfig() {
  const desktop = window.matchMedia(desktopQuery).matches;
  return {
    desktop,
    nodeCount: desktop ? 96 : 38,
    radius: desktop ? 7.2 : 5.2,
    linkDistance: desktop ? 2.5 : 2.1,
    pixelRatio: Math.min(window.devicePixelRatio || 1, desktop ? 1.8 : 1.35)
  };
}

function createNodePositions(count, radius) {
  const positions = [];
  for (let index = 0; index < count; index += 1) {
    const t = index / count;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = Math.PI * (1 + Math.sqrt(5)) * index;
    const wave = 0.74 + 0.26 * Math.sin(index * 1.7);
    positions.push(new THREE.Vector3(
      Math.sin(inclination) * Math.cos(azimuth) * radius * wave,
      Math.cos(inclination) * radius * wave,
      Math.sin(inclination) * Math.sin(azimuth) * radius * wave
    ));
  }
  return positions;
}

function createLineGeometry(points, maxDistance) {
  const vertices = [];
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      if (points[i].distanceTo(points[j]) < maxDistance) {
        vertices.push(points[i].x, points[i].y, points[i].z, points[j].x, points[j].y, points[j].z);
      }
    }
  }
  return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
}

export function createSporeNetwork(canvas) {
  if (!canvas || !window.WebGLRenderingContext) {
    return { destroy() {} };
  }

  const reduceMotion = isReducedMotion();
  let config = getConfig();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, config.desktop ? 16 : 18);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(config.pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const group = new THREE.Group();
  group.position.x = config.desktop ? 3.2 : 0;
  scene.add(group);

  const coreGeometry = new THREE.SphereGeometry(config.desktop ? 1.05 : 0.75, 32, 24);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.9
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  group.add(core);

  const haloGeometry = new THREE.SphereGeometry(config.desktop ? 1.65 : 1.15, 32, 24);
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const halo = new THREE.Mesh(haloGeometry, haloMaterial);
  group.add(halo);

  let points = createNodePositions(config.nodeCount, config.radius);
  const nodeGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const nodeMaterial = new THREE.PointsMaterial({
    color: 0x58f1bd,
    size: config.desktop ? 0.075 : 0.095,
    transparent: true,
    opacity: 0.88,
    depthWrite: false
  });
  const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
  group.add(nodes);

  let lineGeometry = createLineGeometry(points, config.linkDistance);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: config.desktop ? 0.18 : 0.14,
    blending: THREE.AdditiveBlending
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  group.add(lines);

  const pointer = new THREE.Vector2(0, 0);
  const targetRotation = new THREE.Vector2(0, 0);
  const clock = new THREE.Clock();
  let frameId = 0;

  const onPointerMove = (event) => {
    const x = event.clientX === undefined ? window.innerWidth / 2 : event.clientX;
    const y = event.clientY === undefined ? window.innerHeight / 2 : event.clientY;
    pointer.x = (x / window.innerWidth) * 2 - 1;
    pointer.y = -(y / window.innerHeight) * 2 + 1;
    targetRotation.x = pointer.y * 0.16;
    targetRotation.y = pointer.x * 0.24;
  };

  const resize = () => {
    config = getConfig();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = config.desktop ? 16 : 18;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(config.pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    group.position.x = config.desktop ? 3.2 : 0;
  };

  function animate() {
    const elapsed = clock.getElapsedTime();
    group.rotation.x += (targetRotation.x - group.rotation.x) * 0.025;
    group.rotation.y += ((elapsed * 0.055) + targetRotation.y - group.rotation.y) * 0.025;
    core.scale.setScalar(1 + Math.sin(elapsed * 1.4) * 0.045);
    halo.scale.setScalar(1 + Math.sin(elapsed * 0.9) * 0.08);
    renderer.render(scene, camera);

    if (!reduceMotion) {
      frameId = window.requestAnimationFrame(animate);
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  resize();
  animate();

  return {
    destroy() {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      nodeGeometry.dispose();
      lineGeometry.dispose();
      coreGeometry.dispose();
      haloGeometry.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      coreMaterial.dispose();
      haloMaterial.dispose();
      renderer.dispose();
    }
  };
}
```

- [ ] **Step 2: Verify build**

Run:

```bash
npm run build
```

Expected: build exits 0.

---

## Task 6: Browser Verification and Fix Pass

**Files:**
- Modify as needed: `src/styles.css`
- Modify as needed: `src/three/sporeNetwork.js`
- Modify as needed: `src/main.js`

- [ ] **Step 1: Start dev server**

Run:

```bash
npm run dev -- --port 5173
```

Expected: Vite dev server starts at `http://127.0.0.1:5173/`.

- [ ] **Step 2: Verify desktop render**

Open `http://127.0.0.1:5173/` in a browser at about `1440x1000`.

Expected:

- Header visible and not overlapping hero text.
- Hero text readable.
- Three.js canvas visible and animated.
- CTA buttons visible.
- Services, A2 pack, process, packages, trust, and final CTA visible while scrolling.

- [ ] **Step 3: Verify mobile render**

Open the same URL at about `390x844`.

Expected:

- Three.js canvas visible in hero.
- No horizontal scroll.
- Header fits.
- Hero CTAs fit within viewport.
- Cards stack cleanly.
- Text does not overflow buttons or cards.

- [ ] **Step 4: Run build after visual fixes**

Run:

```bash
npm run build
```

Expected: build exits 0.

- [ ] **Step 5: Run automated smoke check**

Create a temporary script `.tmp-check-app.cjs`:

```js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  const result = await page.evaluate(() => {
    const canvas = document.querySelector('#hero-canvas');
    const sections = ['services', 'a2-pack', 'process', 'packages', 'contact'];
    const missing = sections.filter((id) => !document.getElementById(id));
    return {
      title: document.title,
      canvasWidth: canvas?.width || 0,
      canvasHeight: canvas?.height || 0,
      hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth + 2,
      missing,
      servicesText: document.body.innerText.includes('A2 - Manufacturer Digital Presence Pack'),
      packagesText: document.body.innerText.includes('Premium')
    };
  });
  await browser.close();

  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  if (!result.canvasWidth || !result.canvasHeight) {
    console.error('Canvas has no drawing buffer');
    process.exit(1);
  }
  if (result.hasHorizontalScroll) {
    console.error('Mobile viewport has horizontal scroll');
    process.exit(1);
  }
  if (result.missing.length) {
    console.error(`Missing sections: ${result.missing.join(', ')}`);
    process.exit(1);
  }
  if (!result.servicesText || !result.packagesText) {
    console.error('Required marketing content missing');
    process.exit(1);
  }
  console.log(JSON.stringify(result, null, 2));
})();
```

Run:

```bash
node .tmp-check-app.cjs
```

Expected: exits 0 and prints JSON with canvas dimensions, no missing sections, and no horizontal scroll.

- [ ] **Step 6: Remove temporary smoke script**

Run:

```bash
rm .tmp-check-app.cjs
```

Expected: temporary script is removed.

---

## Task 7: Completion Audit

**Files:**
- Inspect: `index.html`
- Inspect: `src/styles.css`
- Inspect: `src/data/services.js`
- Inspect: `src/three/sporeNetwork.js`
- Inspect: build and browser outputs

- [ ] **Step 1: Check objective coverage**

Verify:

- Interactive 3D website exists.
- Uses Three.js.
- Has mobile 3D animation.
- Uses logo folder theme via `public/image.png` and matching colors.
- Feels premium and top-brand rather than generic.
- Includes wide product range.
- Includes A2 as primary offer.
- Has visual asset prompts in Markdown.
- Builds fast as a static site.

- [ ] **Step 2: Run final build**

Run:

```bash
npm run build
```

Expected: build exits 0.

- [ ] **Step 3: Report status**

If every checklist item is supported by real files and command/browser evidence, mark the active goal complete. If any item is missing, fix it before reporting completion.
