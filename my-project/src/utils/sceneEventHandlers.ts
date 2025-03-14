import * as THREE from 'three';
import { getPointerPosition } from './threeUtils';
import { ISceneContext } from '../interfaces/sceneInterfaces';


export const onPointerDownHandler = (event: PointerEvent, ctx: ISceneContext) => {
  const { renderer, camera, pointer, raycaster, buildingRef, setIsOpened } = ctx;
  getPointerPosition(event, renderer, pointer);
  raycaster.setFromCamera(pointer, camera);

  if (buildingRef.current) {
    const highlightGroup = buildingRef.current.getObjectByName('highlightGroup');
    const children = highlightGroup ? highlightGroup.children : [];
    const resizeHandles = children.filter(child => (child as any).userData.isResizeHandle);
    const resizeIntersects = raycaster.intersectObjects(resizeHandles, true);
    if (resizeIntersects.length > 0) {
      ctx.isResizing = true;
      const handle = resizeIntersects[0].object;
      const handleSign = (handle as any).userData.handleSign;
      const buildingWorldCenter = new THREE.Vector3();
      buildingRef.current.getWorldPosition(buildingWorldCenter);
      const resizePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -buildingWorldCenter.y);
      const intersectionPoint = new THREE.Vector3();
      const oldScale = buildingRef.current.scale.clone();
      buildingRef.current.scale.set(1, 1, 1);
      raycaster.ray.intersectPlane(resizePlane, intersectionPoint);
      buildingRef.current.scale.copy(oldScale);

      ctx.resizeDataRef.current = {
        activeHandle: handle,
        activeSign: handleSign,
        initialIntersection: intersectionPoint.clone(),
        initialWidth: buildingRef.current.userData.params.width,
        initialDepth: buildingRef.current.userData.params.depth,
        plane: resizePlane
      };
      return;
    }
  }
  ctx.isDragging = true;
  ctx.clickStartTime = performance.now();
  ctx.clickStartX = event.clientX;
  ctx.clickStartY = event.clientY;
  ctx.lastX = event.clientX;
  ctx.lastY = event.clientY;
  setIsOpened(false);
};

export const onPointerMoveHandler = (event: PointerEvent, ctx: ISceneContext) => {
  const { renderer, camera, pointer, raycaster, worldGroup, buildingRef, resizeDataRef } = ctx;
  getPointerPosition(event, renderer, pointer);
  raycaster.setFromCamera(pointer, camera);

  if (ctx.isResizing && resizeDataRef.current && buildingRef.current) {
    const data = resizeDataRef.current;
    const newIntersection = new THREE.Vector3();
    if (data.plane && raycaster.ray.intersectPlane(data.plane, newIntersection)) {
      const oldScale = buildingRef.current.scale.clone();
      buildingRef.current.scale.set(1, 1, 1);
      if (!data.initialIntersection) return;
      const delta = newIntersection.clone().sub(data.initialIntersection);
      buildingRef.current.scale.copy(oldScale);

      const effectiveDeltaX = data.activeSign!.x * delta.x;
      const effectiveDeltaZ = data.activeSign!.z * delta.z;
      const minDimension = 0.2;

      const newWidth = Math.max(minDimension, data.initialWidth! + 2 * effectiveDeltaX);
      const newDepth = Math.max(minDimension, data.initialDepth! + 2 * effectiveDeltaZ);

      const currentParams = { ...buildingRef.current.userData.params };
      currentParams.width = newWidth;
      currentParams.depth = newDepth;
      ctx.handleParamsChange(currentParams);
      return;
    }
  }

  if (!ctx.isDragging) return;
  const deltaXFromStart = event.clientX - ctx.clickStartX;
  const deltaYFromStart = event.clientY - ctx.clickStartY;
  if (Math.abs(deltaXFromStart) > 5 || Math.abs(deltaYFromStart) > 5) {
    const deltaX = event.clientX - ctx.lastX;
    const deltaY = event.clientY - ctx.lastY;
    worldGroup.rotation.y += deltaX * 0.01;
    worldGroup.rotation.x += deltaY * 0.01;
    ctx.lastX = event.clientX;
    ctx.lastY = event.clientY;
  }
};

export const onPointerUpHandler = (event: PointerEvent, ctx: ISceneContext) => {
  const clickDuration = performance.now() - ctx.clickStartTime;
  const dx = event.clientX - ctx.clickStartX;
  const dy = event.clientY - ctx.clickStartY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (ctx.isResizing) {
    ctx.isResizing = false;
    ctx.resizeDataRef.current = null;
    return;
  }
  ctx.isDragging = false;

  if (distance < 10 && clickDuration < 200) {
    getPointerPosition(event, ctx.renderer, ctx.pointer);
    ctx.raycaster.setFromCamera(ctx.pointer, ctx.camera);
    const intersects = ctx.raycaster.intersectObjects(ctx.buildingsRef.current, true);
    let selectedBuilding: THREE.Mesh | null = null;
    for (let i = 0; i < intersects.length; i++) {
      let obj: any = intersects[i].object;
      while (obj && !obj.userData.isBuilding && obj.parent) {
        obj = obj.parent;
      }
      if (obj && obj.userData.isBuilding) {
        selectedBuilding = obj;
        break;
      }
    }

    if (selectedBuilding) {
      ctx.buildingsRef.current.forEach(b => {
        b.traverse(child => {
          if (child instanceof THREE.LineSegments && child.material) {
            (child.material as THREE.LineBasicMaterial).color.set(0x000000);
            (child.material as THREE.LineBasicMaterial).linewidth = 1;
          }
        });
        const highlightGroup = b.getObjectByName('highlightGroup');
        if (highlightGroup) highlightGroup.visible = false;
        const mat = b.material as THREE.MeshPhongMaterial;
        mat.transparent = false;
        mat.opacity = 1;
        mat.side = THREE.FrontSide;
        mat.depthWrite = true;
      });

      ctx.buildingRef.current = selectedBuilding;
      selectedBuilding.traverse(child => {
        if (child instanceof THREE.LineSegments && child.material) {
          (child.material as THREE.LineBasicMaterial).color.set(0x0084ff);
          (child.material as THREE.LineBasicMaterial).linewidth = 3;
        }
      });
      const highlightGroup = selectedBuilding.getObjectByName('highlightGroup');
      if (highlightGroup) highlightGroup.visible = true;
      const buildingMaterial = selectedBuilding.material as THREE.MeshPhongMaterial;
      buildingMaterial.transparent = true;
      buildingMaterial.opacity = 0.5;
      buildingMaterial.side = THREE.DoubleSide;
      buildingMaterial.depthWrite = false;

      const params = { ...selectedBuilding.userData.params };
      const buildingNumber = selectedBuilding.userData.buildingNumber || 1;
      ctx.setActiveBuildingParams(params);
      ctx.setActiveBuildingNumber(buildingNumber);
      const cubePosition = new THREE.Vector3();
      selectedBuilding.getWorldPosition(cubePosition);
      cubePosition.project(ctx.camera);
      const halfWidth = window.innerWidth / 2;
      const halfHeight = window.innerHeight / 2;
      const screenX = cubePosition.x * halfWidth + halfWidth;
      const screenY = -cubePosition.y * halfHeight + halfHeight;
      const menuX = screenX + 10;
      const menuY = screenY;
      (ctx as any).updateMenuPosition({ x: menuX + 150, y: menuY - 100 });
      ctx.setIsOpened(true);
    } else {
      ctx.buildingsRef.current.forEach(b => {
        const mat = b.material as THREE.MeshPhongMaterial;
        mat.transparent = false;
        mat.opacity = 1;
        mat.side = THREE.FrontSide;
        mat.depthWrite = true;
        const highlightGroup = b.getObjectByName('highlightGroup');
        if (highlightGroup) highlightGroup.visible = false;
        b.traverse(child => {
          if (child instanceof THREE.LineSegments && child.material) {
            (child.material as THREE.LineBasicMaterial).color.set(0x000000);
            (child.material as THREE.LineBasicMaterial).linewidth = 1;
          }
        });
      });
      ctx.buildingRef.current = null;
      ctx.setIsOpened(false);
      ctx.setActiveBuildingParams(null);
      ctx.setActiveBuildingNumber(null);
    }
  }
};

export const onKeyDownHandler = (event: KeyboardEvent, ctx: ISceneContext) => {
  if (!ctx.buildingRef.current) return;
  const moveStep = 0.1;
  switch (event.key) {
    case 'ArrowUp':
      ctx.buildingRef.current.position.z -= moveStep;
      break;
    case 'ArrowDown':
      ctx.buildingRef.current.position.z += moveStep;
      break;
    case 'ArrowLeft':
      ctx.buildingRef.current.position.x -= moveStep;
      break;
    case 'ArrowRight':
      ctx.buildingRef.current.position.x += moveStep;
      break;
    default:
      break;
  }
};
