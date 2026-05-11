import './styles.css';
import { services, deliverables, comparison, processSteps, packages } from './data/services.js';
import { initHeaderState, initReveals } from './utils/motion.js';
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
    <article class="deliverable-card reveal" style="--delay: ${index * 80}ms">
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
  const network = createSporeNetwork(canvas);

  window.addEventListener('pagehide', () => network.destroy(), { once: true });
}

init();
