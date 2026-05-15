import './styles.css';
import { renderPackageMaker } from './ui/packageMaker.js';
import { renderHeroFocusTabs, renderProducts } from './ui/products.js';
import { renderGrowthSignals, renderProcess } from './ui/sections.js';
import { initHeaderState, initReveals } from './utils/motion.js';

function isCanvasVerification() {
  const params = new URLSearchParams(window.location.search);
  return params.has('verifyCanvas');
}

function shouldLoadSporeNetwork() {
  if (isCanvasVerification()) return true;
  return !window.matchMedia('(pointer: coarse), (max-width: 920px)').matches;
}

function scheduleSporeNetwork(canvas, network) {
  if (!canvas || !shouldLoadSporeNetwork()) return;
  const verifyCanvas = isCanvasVerification();

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

  if (isCanvasVerification()) {
    document.documentElement.classList.add('verify-canvas');
  }

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
