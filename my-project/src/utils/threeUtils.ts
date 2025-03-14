import * as THREE from 'three';

export const getPointerPosition = (
  event: PointerEvent,
  renderer: THREE.WebGLRenderer,
  pointer: THREE.Vector2
) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
};
