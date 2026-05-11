import './styles.css';
import { growthSignals, packageOptions, packageResults, processSteps, productTabs } from './data/services.js';
import { initHeaderState, initReveals } from './utils/motion.js';
import { createSporeNetwork } from './three/sporeNetwork.js';

const whatsappHref = 'https://wa.me/910000000000?text=Hi%20Myco%20Labs%2C%20I%20want%20to%20discuss%20a%20digital%20growth%20package%20for%20my%20manufacturing%20business.';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderExamples(examples) {
  return examples.map((item) => `
    <article class="mini-product-card">
      <h4>${escapeHtml(item.name)}</h4>
      <p>${escapeHtml(item.description)}</p>
    </article>
  `).join('');
}

function renderProductCard(product, extraClass = '') {
  return `
    <article class="product-detail-card ${extraClass}" data-product-panel="${escapeHtml(product.id)}">
      <span class="card-kicker">${escapeHtml(product.kicker)}</span>
      <h3 data-product-title>${escapeHtml(product.title)}</h3>
      <strong class="category-label">${escapeHtml(product.categoryLabel)}</strong>
      <p>${escapeHtml(product.summary)}</p>
      <div class="chip-row">
        ${product.chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join('')}
      </div>
      <div class="example-stack">
        ${renderExamples(product.examples)}
      </div>
      <a class="button button-primary product-cta" href="${whatsappHref}" target="_blank" rel="noreferrer">
        Discuss ${escapeHtml(product.featured)}
      </a>
    </article>
  `;
}

function renderProductDetail(product) {
  const target = document.querySelector('[data-product-detail]');
  target.innerHTML = renderProductCard(product, 'reveal is-visible');
}

function setActiveProduct(productId, network) {
  const product = productTabs.find((item) => item.id === productId) || productTabs[0];
  document.querySelectorAll('[data-product-tab]').forEach((button) => {
    const active = button.dataset.productTab === product.id;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('[data-product-mobile-panel]').forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.productMobilePanel === product.id);
  });
  document.querySelectorAll('[data-hero-focus-tab]').forEach((button) => {
    const active = button.dataset.heroFocusTab === product.id;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const statusLabel = document.querySelector('[data-hero-status-label]');
  const statusSummary = document.querySelector('[data-hero-status-summary]');
  if (statusLabel) statusLabel.textContent = product.title;
  if (statusSummary) statusSummary.textContent = `${product.categoryLabel} connected to ${product.sceneLabel.toLowerCase()}.`;
  renderProductDetail(product);
  network?.setFocus?.(product.id);
}

function renderHeroFocusTabs(network) {
  const target = document.querySelector('[data-hero-focus-tabs]');
  target.innerHTML = productTabs.map((product, index) => `
    <button
      class="hero-focus-tab ${index === 0 ? 'is-active' : ''}"
      type="button"
      data-hero-focus-tab="${escapeHtml(product.id)}"
      aria-pressed="${index === 0 ? 'true' : 'false'}"
    >
      <span>${String(index + 1).padStart(2, '0')}</span>
      ${escapeHtml(product.label)}
    </button>
  `).join('');

  target.addEventListener('click', (event) => {
    const button = event.target.closest('[data-hero-focus-tab]');
    if (!button) return;
    setActiveProduct(button.dataset.heroFocusTab, network);
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function renderProducts(network) {
  const tabsTarget = document.querySelector('[data-product-tabs]');
  tabsTarget.innerHTML = productTabs.map((product, index) => `
    <div class="product-accordion-item">
      <button
        class="product-tab ${index === 0 ? 'is-active' : ''}"
        type="button"
        data-product-tab="${escapeHtml(product.id)}"
        aria-selected="${index === 0 ? 'true' : 'false'}"
      >
        <span>${String(index + 1).padStart(2, '0')}</span>
        ${escapeHtml(product.label)}
      </button>
      <div class="product-mobile-panel ${index === 0 ? 'is-active' : ''}" data-product-mobile-panel="${escapeHtml(product.id)}">
        ${renderProductCard(product, 'product-mobile-card')}
      </div>
    </div>
  `).join('');

  tabsTarget.addEventListener('click', (event) => {
    const button = event.target.closest('[data-product-tab]');
    if (!button) return;
    setActiveProduct(button.dataset.productTab, network);
  });

  renderProductDetail(productTabs[0]);
}

function selectPackage(selected) {
  if (selected.length >= 5) {
    return packageResults.find((result) => result.id === 'full');
  }
  if (selected.includes('automation') || selected.includes('whatsapp')) {
    return packageResults.find((result) => result.id === 'automation-growth');
  }
  if (selected.includes('catalogue') && selected.includes('website')) {
    return packageResults.find((result) => result.id === 'catalogue-growth');
  }
  return packageResults.find((result) => result.id === 'starter');
}

function updatePackageResult() {
  const selectedInputs = Array.from(document.querySelectorAll('[data-package-option]:checked'));
  const selected = selectedInputs.map((input) => input.value);
  const result = selectPackage(selected);
  document.querySelector('[data-package-result]').textContent = result.name;
  document.querySelector('[data-package-summary]').textContent = result.summary;
  document.querySelector('[data-package-count]').textContent = `${selected.length} selected`;
  document.querySelectorAll('.package-option').forEach((option) => {
    const input = option.querySelector('[data-package-option]');
    option.classList.toggle('is-selected', Boolean(input?.checked));
  });
  const selectedTarget = document.querySelector('[data-package-selected]');
  selectedTarget.innerHTML = selectedInputs.map((input) => `
    <span data-selection-pill>${escapeHtml(input.dataset.packageLabel || input.value)}</span>
  `).join('');
}

function renderPackageMaker() {
  const target = document.querySelector('[data-package-options]');
  target.innerHTML = packageOptions.map((option, index) => `
    <label class="package-option reveal" style="--delay: ${index * 55}ms">
      <input
        type="checkbox"
        value="${escapeHtml(option.id)}"
        data-package-option
        data-package-label="${escapeHtml(option.label)}"
        ${option.defaultChecked ? 'checked' : ''}
      />
      <span class="option-control" aria-hidden="true"></span>
      <span>
        <strong>${escapeHtml(option.label)}</strong>
        <small>${escapeHtml(option.description)}</small>
      </span>
    </label>
  `).join('');

  target.addEventListener('change', updatePackageResult);
  updatePackageResult();
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

function renderGrowthSignals() {
  const target = document.querySelector('[data-growth-signals]');
  target.innerHTML = growthSignals.map((signal, index) => `
    <article class="growth-card reveal" style="--delay: ${index * 85}ms">
      <span class="node-dot" aria-hidden="true"></span>
      <h3>${escapeHtml(signal.title)}</h3>
      <p>${escapeHtml(signal.description)}</p>
    </article>
  `).join('');
}

function init() {
  const canvas = document.querySelector('#hero-canvas');
  const network = createSporeNetwork(canvas);

  renderHeroFocusTabs(network);
  renderProducts(network);
  renderPackageMaker();
  renderProcess();
  renderGrowthSignals();
  initHeaderState();
  initReveals();

  window.addEventListener('pagehide', () => network.destroy(), { once: true });
}

init();
