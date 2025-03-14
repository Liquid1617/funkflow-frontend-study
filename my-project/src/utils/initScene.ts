import * as THREE from 'three';

export const initScene = (mountElement: HTMLDivElement) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const aspect = window.innerWidth / window.innerHeight;
  const viewSize = 5;
  const camera = new THREE.OrthographicCamera(
    -viewSize * aspect,
    viewSize * aspect,
    viewSize,
    -viewSize,
    0.1,
    100
  );
  camera.position.set(10, 10, 10);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  mountElement.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
  dirLight.position.set(10, 15, 10);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 50;
  dirLight.shadow.camera.left = -10;
  dirLight.shadow.camera.right = 10;
  dirLight.shadow.camera.top = 10;
  dirLight.shadow.camera.bottom = -10;
  scene.add(dirLight);

  const planeGeo = new THREE.PlaneGeometry(20, 20);
  const planeMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;

  const worldGroup = new THREE.Group();
  worldGroup.add(plane);
  worldGroup.add(new THREE.GridHelper(20, 20));

  const centralLineLength = 20;
  const redLineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-centralLineLength / 2, 0.01, 0),
    new THREE.Vector3(centralLineLength / 2, 0.01, 0)
  ]);
  const redLineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const redLine = new THREE.Line(redLineGeo, redLineMat);
  worldGroup.add(redLine);

  const blueLineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0.01, -centralLineLength / 2),
    new THREE.Vector3(0, 0.01, centralLineLength / 2)
  ]);
  const blueLineMat = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const blueLine = new THREE.Line(blueLineGeo, blueLineMat);
  worldGroup.add(blueLine);

  scene.add(worldGroup);

  return { scene, camera, renderer, worldGroup };
};
