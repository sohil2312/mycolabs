import './styles.css';
import { renderPackageMaker } from './ui/packageMaker.js';
import { renderHeroFocusTabs, renderProducts } from './ui/products.js';
import { renderGrowthSignals, renderProcess } from './ui/sections.js';
import { initHeaderState, initReveals } from './utils/motion.js';

function shouldLoadSporeNetwork() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('verifyCanvas')) return true;
  return !window.matchMedia('(pointer: coarse) and (max-width: 1024px)').matches;
}

function scheduleSporeNetwork(canvas, network) {
  if (!canvas || !shouldLoadSporeNetwork()) return;
  const verifyCanvas = new URLSearchParams(window.location.search).has('verifyCanvas');

  const load = async () => {
    const { createSporeNetwork } = await import('./three/sporeNetwork.js');
    const instance = createSporeNetwork(canvas);
    network.setFocus = instance.setFocus;
    network.destroy = instance.destroy;
  };

  if (verifyCanvas) {
    load();
    return;
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(load, { timeout: 900 });
    return;
  }

  window.setTimeout(load, 300);
}

function init() {
  const canvas = document.querySelector('#hero-canvas');
  const network = { destroy() {}, setFocus() {} };

  renderHeroFocusTabs(network);
  renderProducts(network);
  renderPackageMaker();
  renderProcess();
  renderGrowthSignals();
  initHeaderState();
  initReveals();
  scheduleSporeNetwork(canvas, network);

  window.addEventListener('pagehide', () => network.destroy(), { once: true });
}

init();
