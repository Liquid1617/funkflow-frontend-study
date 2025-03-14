import * as THREE from 'three';

export interface ISceneContext {
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  pointer: THREE.Vector2;
  raycaster: THREE.Raycaster;
  buildingRef: React.MutableRefObject<THREE.Mesh | null>;
  buildingsRef: React.MutableRefObject<THREE.Mesh[]>;
  worldGroup: THREE.Group;
  resizeDataRef: React.MutableRefObject<{
    activeHandle?: THREE.Object3D;
    activeSign?: { x: number; z: number };
    initialIntersection?: THREE.Vector3;
    initialWidth?: number;
    initialDepth?: number;
    plane?: THREE.Plane;
  } | null>;
  isDragging: boolean;
  isResizing: boolean;
  clickStartTime: number;
  clickStartX: number;
  clickStartY: number;
  lastX: number;
  lastY: number;
  setIsOpened: (open: boolean) => void;
  setActiveBuildingParams: (params: any) => void;
  setActiveBuildingNumber: (num: number | null) => void;
  handleParamsChange: (params: any) => void;
  updateMenuPosition: (pos: { x: number; y: number }) => void;
}