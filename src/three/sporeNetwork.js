import * as THREE from 'three';

const desktopQuery = '(min-width: 1025px)';

const focusOrder = ['website', 'catalogue', 'whatsapp', 'growth', 'automation'];
const focusColors = {
  website: 0x10b981,
  catalogue: 0x58f1bd,
  whatsapp: 0x67e8f9,
  growth: 0xa7f3d0,
  automation: 0x22d3ee
};

function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getConfig() {
  const desktop = window.matchMedia(desktopQuery).matches;
  return {
    desktop,
    nodeCount: desktop ? 120 : 36,
    radius: desktop ? 7.4 : 4.8,
    linkDistance: desktop ? 2.25 : 1.72,
    orbitRadius: desktop ? 4.7 : 3.05,
    pixelRatio: Math.min(window.devicePixelRatio || 1, desktop ? 1.8 : 1.12)
  };
}

function createNodePositions(count, radius) {
  const positions = [];
  for (let index = 0; index < count; index += 1) {
    const t = index / count;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = Math.PI * (1 + Math.sqrt(5)) * index;
    const wave = 0.78 + 0.22 * Math.sin(index * 1.73);
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

function makeBasicMaterial(color, opacity) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}

function createProductOrbit(config) {
  const pivot = new THREE.Group();
  const productMeshes = [];
  const productMaterials = [];
  const beamMaterials = [];
  const beamGeometries = [];
  const panelMaterials = [];

  const markerGeometry = new THREE.IcosahedronGeometry(config.desktop ? 0.34 : 0.27, 2);
  const ringGeometry = new THREE.TorusGeometry(config.desktop ? 0.56 : 0.42, 0.01, 8, 48);
  const barGeometry = new THREE.BoxGeometry(config.desktop ? 0.9 : 0.62, 0.028, 0.028);
  const panelGeometry = new THREE.PlaneGeometry(config.desktop ? 1.38 : 1.02, config.desktop ? 0.72 : 0.54);

  focusOrder.forEach((id, index) => {
    const angle = (index / focusOrder.length) * Math.PI * 2;
    const group = new THREE.Group();
    group.position.set(
      Math.cos(angle) * config.orbitRadius,
      Math.sin(index * 1.35) * (config.desktop ? 0.65 : 0.42),
      Math.sin(angle) * config.orbitRadius
    );

    const material = makeBasicMaterial(focusColors[id], id === 'website' ? 0.95 : 0.45);
    const panelMaterial = new THREE.MeshBasicMaterial({
      color: focusColors[id],
      transparent: true,
      opacity: id === 'website' ? 0.18 : 0.055,
      wireframe: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const beamGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      group.position.clone()
    ]);
    const beamMaterial = new THREE.LineBasicMaterial({
      color: focusColors[id],
      transparent: true,
      opacity: id === 'website' ? 0.38 : 0.075,
      blending: THREE.AdditiveBlending
    });
    const beam = new THREE.Line(beamGeometry, beamMaterial);
    const marker = new THREE.Mesh(markerGeometry, material);
    const ring = new THREE.Mesh(ringGeometry, material);
    const bar = new THREE.Mesh(barGeometry, material);
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    ring.rotation.x = Math.PI / 2;
    bar.position.x = config.desktop ? 0.74 : 0.55;
    panel.position.z = -0.16;
    panel.rotation.z = index % 2 === 0 ? 0.08 : -0.08;
    group.add(panel, marker, ring, bar);
    pivot.add(beam);
    pivot.add(group);
    productMeshes.push(group);
    productMaterials.push(material);
    beamMaterials.push(beamMaterial);
    beamGeometries.push(beamGeometry);
    panelMaterials.push(panelMaterial);
  });

  return {
    pivot,
    productMeshes,
    productMaterials,
    beamMaterials,
    beamGeometries,
    panelMaterials,
    markerGeometry,
    ringGeometry,
    barGeometry,
    panelGeometry
  };
}

function disposeProductOrbit(productOrbit) {
  productOrbit.productMaterials.forEach((material) => material.dispose());
  productOrbit.beamMaterials.forEach((material) => material.dispose());
  productOrbit.panelMaterials.forEach((material) => material.dispose());
  productOrbit.beamGeometries.forEach((geometry) => geometry.dispose());
  productOrbit.markerGeometry.dispose();
  productOrbit.ringGeometry.dispose();
  productOrbit.barGeometry.dispose();
  productOrbit.panelGeometry.dispose();
}

export function createSporeNetwork(canvas) {
  if (!canvas || !window.WebGLRenderingContext) {
    return { destroy() {}, setFocus() {} };
  }

  const reduceMotion = isReducedMotion();
  let config = getConfig();
  let activeFocus = 'website';
  let activeIndex = 0;
  let targetOrbitRotation = 0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, config.desktop ? 16 : 18);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: config.desktop,
    alpha: true,
    powerPreference: config.desktop ? 'high-performance' : 'low-power',
    preserveDrawingBuffer: new URLSearchParams(window.location.search).has('verifyCanvas')
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(config.pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const group = new THREE.Group();
  group.position.x = config.desktop ? 3.2 : 0;
  scene.add(group);

  const coreGeometry = new THREE.IcosahedronGeometry(config.desktop ? 1.05 : 0.76, 3);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: focusColors.website,
    transparent: true,
    opacity: 0.9
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  group.add(core);

  const haloGeometry = new THREE.TorusGeometry(config.desktop ? 1.82 : 1.2, 0.015, 8, 88);
  const haloMaterial = makeBasicMaterial(0x10b981, 0.38);
  const haloA = new THREE.Mesh(haloGeometry, haloMaterial);
  const haloB = new THREE.Mesh(haloGeometry, haloMaterial);
  haloA.rotation.x = Math.PI / 2;
  haloB.rotation.y = Math.PI / 2;
  group.add(haloA, haloB);

  const points = createNodePositions(config.nodeCount, config.radius);
  const nodeGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const nodeMaterial = new THREE.PointsMaterial({
    color: 0x58f1bd,
    size: config.desktop ? 0.074 : 0.092,
    transparent: true,
    opacity: 0.88,
    depthWrite: false
  });
  const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
  group.add(nodes);

  const lineGeometry = createLineGeometry(points, config.linkDistance);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: config.desktop ? 0.16 : 0.12,
    blending: THREE.AdditiveBlending
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  group.add(lines);

  let productOrbit = createProductOrbit(config);
  group.add(productOrbit.pivot);

  const pointer = new THREE.Vector2(0, 0);
  const targetRotation = new THREE.Vector2(0, 0);
  const clock = new THREE.Clock();
  let frameId = 0;

  const setFocus = (focusId) => {
    activeFocus = focusOrder.includes(focusId) ? focusId : 'website';
    activeIndex = focusOrder.indexOf(activeFocus);
    targetOrbitRotation = -(activeIndex / focusOrder.length) * Math.PI * 2;
    const color = focusColors[activeFocus];
    coreMaterial.color.setHex(color);
    haloMaterial.color.setHex(color);
    productOrbit.productMaterials.forEach((material, index) => {
      material.opacity = index === activeIndex ? 0.96 : 0.34;
      material.color.setHex(index === activeIndex ? color : focusColors[focusOrder[index]]);
    });
    productOrbit.beamMaterials.forEach((material, index) => {
      material.opacity = index === activeIndex ? 0.38 : 0.075;
      material.color.setHex(index === activeIndex ? color : focusColors[focusOrder[index]]);
    });
    productOrbit.panelMaterials.forEach((material, index) => {
      material.opacity = index === activeIndex ? 0.18 : 0.055;
      material.color.setHex(index === activeIndex ? color : focusColors[focusOrder[index]]);
    });
  };

  const onPointerMove = (event) => {
    const x = event.clientX === undefined ? window.innerWidth / 2 : event.clientX;
    const y = event.clientY === undefined ? window.innerHeight / 2 : event.clientY;
    pointer.x = (x / window.innerWidth) * 2 - 1;
    pointer.y = -(y / window.innerHeight) * 2 + 1;
    targetRotation.x = pointer.y * 0.14;
    targetRotation.y = pointer.x * 0.22;
  };

  const rebuildOrbit = () => {
    group.remove(productOrbit.pivot);
    disposeProductOrbit(productOrbit);
    productOrbit = createProductOrbit(config);
    group.add(productOrbit.pivot);
    setFocus(activeFocus);
  };

  const resize = () => {
    const nextConfig = getConfig();
    const changedMode = nextConfig.desktop !== config.desktop;
    config = nextConfig;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = config.desktop ? 16 : 18;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(config.pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    group.position.x = config.desktop ? 3.2 : 0;
    if (changedMode) rebuildOrbit();
  };

  function animate() {
    const elapsed = clock.getElapsedTime();
    canvas.dataset.frames = String(Number(canvas.dataset.frames || 0) + 1);
    canvas.dataset.rotation = group.rotation.y.toFixed(4);
    group.rotation.x += (targetRotation.x - group.rotation.x) * 0.025;
    group.rotation.y += ((elapsed * 0.048) + targetRotation.y - group.rotation.y) * 0.025;
    productOrbit.pivot.rotation.y += (targetOrbitRotation + elapsed * 0.075 - productOrbit.pivot.rotation.y) * 0.035;
    productOrbit.pivot.rotation.x = Math.sin(elapsed * 0.38) * 0.14;
    core.rotation.x = elapsed * 0.22;
    core.rotation.y = elapsed * 0.28;
    core.scale.setScalar(1 + Math.sin(elapsed * 1.35) * 0.045);
    haloA.rotation.z = elapsed * 0.18;
    haloB.rotation.x = Math.PI / 2 + elapsed * 0.14;
    nodes.rotation.y = -elapsed * 0.025;
    productOrbit.productMeshes.forEach((mesh, index) => {
      const isActive = index === activeIndex;
      mesh.scale.setScalar(isActive ? 1.18 + Math.sin(elapsed * 1.7) * 0.04 : 0.92);
      mesh.rotation.y = elapsed * (0.22 + index * 0.03);
      mesh.rotation.x = elapsed * 0.08;
      productOrbit.beamMaterials[index].opacity = isActive ? 0.31 + Math.sin(elapsed * 2.1) * 0.08 : 0.075;
      productOrbit.panelMaterials[index].opacity = isActive ? 0.14 + Math.sin(elapsed * 1.5) * 0.04 : 0.055;
    });

    renderer.render(scene, camera);

    if (!reduceMotion) {
      frameId = window.requestAnimationFrame(animate);
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  resize();
  setFocus(activeFocus);
  animate();

  return {
    setFocus,
    destroy() {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      nodeGeometry.dispose();
      lineGeometry.dispose();
      coreGeometry.dispose();
      haloGeometry.dispose();
      disposeProductOrbit(productOrbit);
      nodeMaterial.dispose();
      lineMaterial.dispose();
      coreMaterial.dispose();
      haloMaterial.dispose();
      renderer.dispose();
    }
  };
}
