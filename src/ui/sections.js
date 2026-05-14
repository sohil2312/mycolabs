import { growthSignals, processSteps } from '../data/services.js';
import { escapeHtml } from '../utils/html.js';

export function renderProcess() {
  const target = document.querySelector('[data-process]');
  target.innerHTML = processSteps.map((step, index) => `
    <article class="timeline-step reveal" style="--delay: ${index * 80}ms">
      <span class="timeline-number">${String(index + 1).padStart(2, '0')}</span>
      <p>${escapeHtml(step)}</p>
    </article>
  `).join('');
}

export function renderGrowthSignals() {
  const target = document.querySelector('[data-growth-signals]');
  target.innerHTML = growthSignals.map((signal, index) => `
    <article class="growth-card reveal" style="--delay: ${index * 85}ms">
      <span class="node-dot" aria-hidden="true"></span>
      <h3>${escapeHtml(signal.title)}</h3>
      <p>${escapeHtml(signal.description)}</p>
    </article>
  `).join('');
}
