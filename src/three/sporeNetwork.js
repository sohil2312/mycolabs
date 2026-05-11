import * as THREE from 'three';

const desktopQuery = '(min-width: 768px)';

function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getConfig() {
  const desktop = window.matchMedia(desktopQuery).matches;
  return {
    desktop,
    nodeCount: desktop ? 104 : 42,
    radius: desktop ? 7.4 : 5.2,
    linkDistance: desktop ? 2.55 : 2.05,
    pixelRatio: Math.min(window.devicePixelRatio || 1, desktop ? 1.8 : 1.35)
  };
}

function createNodePositions(count, radius) {
  const positions = [];
  for (let index = 0; index < count; index += 1) {
    const t = index / count;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = Math.PI * (1 + Math.sqrt(5)) * index;
    const wave = 0.74 + 0.26 * Math.sin(index * 1.7);
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

export function createSporeNetwork(canvas) {
  if (!canvas || !window.WebGLRenderingContext) {
    return { destroy() {} };
  }

  const reduceMotion = isReducedMotion();
  let config = getConfig();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, config.desktop ? 16 : 18);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: new URLSearchParams(window.location.search).has('verifyCanvas')
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(config.pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const group = new THREE.Group();
  group.position.x = config.desktop ? 3.2 : 0;
  scene.add(group);

  const coreGeometry = new THREE.SphereGeometry(config.desktop ? 1.05 : 0.75, 32, 24);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.9
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  group.add(core);

  const haloGeometry = new THREE.SphereGeometry(config.desktop ? 1.65 : 1.15, 32, 24);
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const halo = new THREE.Mesh(haloGeometry, haloMaterial);
  group.add(halo);

  const points = createNodePositions(config.nodeCount, config.radius);
  const nodeGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const nodeMaterial = new THREE.PointsMaterial({
    color: 0x58f1bd,
    size: config.desktop ? 0.075 : 0.095,
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
    opacity: config.desktop ? 0.18 : 0.14,
    blending: THREE.AdditiveBlending
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  group.add(lines);

  const pointer = new THREE.Vector2(0, 0);
  const targetRotation = new THREE.Vector2(0, 0);
  const clock = new THREE.Clock();
  let frameId = 0;

  const onPointerMove = (event) => {
    const x = event.clientX === undefined ? window.innerWidth / 2 : event.clientX;
    const y = event.clientY === undefined ? window.innerHeight / 2 : event.clientY;
    pointer.x = (x / window.innerWidth) * 2 - 1;
    pointer.y = -(y / window.innerHeight) * 2 + 1;
    targetRotation.x = pointer.y * 0.16;
    targetRotation.y = pointer.x * 0.24;
  };

  const resize = () => {
    config = getConfig();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = config.desktop ? 16 : 18;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(config.pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    group.position.x = config.desktop ? 3.2 : 0;
  };

  function animate() {
    const elapsed = clock.getElapsedTime();
    canvas.dataset.frames = String(Number(canvas.dataset.frames || 0) + 1);
    canvas.dataset.rotation = group.rotation.y.toFixed(4);
    group.rotation.x += (targetRotation.x - group.rotation.x) * 0.025;
    group.rotation.y += ((elapsed * 0.055) + targetRotation.y - group.rotation.y) * 0.025;
    core.scale.setScalar(1 + Math.sin(elapsed * 1.4) * 0.045);
    halo.scale.setScalar(1 + Math.sin(elapsed * 0.9) * 0.08);
    renderer.render(scene, camera);

    if (!reduceMotion) {
      frameId = window.requestAnimationFrame(animate);
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  resize();
  animate();

  return {
    destroy() {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      nodeGeometry.dispose();
      lineGeometry.dispose();
      coreGeometry.dispose();
      haloGeometry.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      coreMaterial.dispose();
      haloMaterial.dispose();
      renderer.dispose();
    }
  };
}
