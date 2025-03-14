import * as THREE from 'three';

export const animateScene = (
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
) => {
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();
};