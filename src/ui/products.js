import { whatsappHref } from '../config.js';
import { productTabs } from '../data/services.js';
import { escapeHtml } from '../utils/html.js';

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

export function renderHeroFocusTabs(network) {
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

export function renderProducts(network) {
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
