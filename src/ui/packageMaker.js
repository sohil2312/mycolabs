import { packageOptions, packageResults } from '../data/services.js';
import { escapeHtml } from '../utils/html.js';

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

export function renderPackageMaker() {
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
