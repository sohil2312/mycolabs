import './styles.css';
import { createSporeNetwork } from './three/sporeNetwork.js';
import { renderPackageMaker } from './ui/packageMaker.js';
import { renderHeroFocusTabs, renderProducts } from './ui/products.js';
import { renderGrowthSignals, renderProcess } from './ui/sections.js';
import { initHeaderState, initReveals } from './utils/motion.js';

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
