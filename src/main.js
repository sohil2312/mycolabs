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

function renderProductDetail(product) {
  const target = document.querySelector('[data-product-detail]');
  target.innerHTML = `
    <article class="product-detail-card reveal is-visible" data-product-panel="${escapeHtml(product.id)}">
      <span class="card-kicker">${escapeHtml(product.kicker)}</span>
      <h3 data-product-title>${escapeHtml(product.title)}</h3>
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

function setActiveProduct(productId, network) {
  const product = productTabs.find((item) => item.id === productId) || productTabs[0];
  document.querySelectorAll('[data-product-tab]').forEach((button) => {
    const active = button.dataset.productTab === product.id;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });
  renderProductDetail(product);
  network?.setFocus?.(product.id);
}

function renderProducts(network) {
  const tabsTarget = document.querySelector('[data-product-tabs]');
  tabsTarget.innerHTML = productTabs.map((product, index) => `
    <button
      class="product-tab ${index === 0 ? 'is-active' : ''}"
      type="button"
      data-product-tab="${escapeHtml(product.id)}"
      aria-selected="${index === 0 ? 'true' : 'false'}"
    >
      <span>${String(index + 1).padStart(2, '0')}</span>
      ${escapeHtml(product.label)}
    </button>
  `).join('');

  tabsTarget.addEventListener('click', (event) => {
    const button = event.target.closest('[data-product-tab]');
    if (!button) return;
    setActiveProduct(button.dataset.productTab, network);
  });

  const menuTarget = document.querySelector('[data-product-menu]');
  menuTarget.innerHTML = productTabs.map((group, index) => `
    <article class="product-menu-card reveal" style="--delay: ${index * 70}ms">
      <span class="card-kicker">${escapeHtml(group.title)}</span>
      <h3>${escapeHtml(group.featured)}</h3>
      <ul>
        ${group.examples.map((item) => `<li>${escapeHtml(item.name)}</li>`).join('')}
      </ul>
    </article>
  `).join('');

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
  const selected = Array.from(document.querySelectorAll('[data-package-option]:checked')).map((input) => input.value);
  const result = selectPackage(selected);
  document.querySelector('[data-package-result]').textContent = result.name;
  document.querySelector('[data-package-summary]').textContent = result.summary;
  document.querySelector('[data-package-count]').textContent = `${selected.length} selected`;
}

function renderPackageMaker() {
  const target = document.querySelector('[data-package-options]');
  target.innerHTML = packageOptions.map((option, index) => `
    <label class="package-option reveal" style="--delay: ${index * 55}ms">
      <input
        type="checkbox"
        value="${escapeHtml(option.id)}"
        data-package-option
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

  renderProducts(network);
  renderPackageMaker();
  renderProcess();
  renderGrowthSignals();
  initHeaderState();
  initReveals();

  window.addEventListener('pagehide', () => network.destroy(), { once: true });
}

init();
