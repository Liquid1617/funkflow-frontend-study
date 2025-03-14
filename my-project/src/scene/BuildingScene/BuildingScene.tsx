import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PopOverMenu } from '../../components/PopOverMenu/PopOverMenu';
import { AddBuildingButton } from '../../components/AddBuildingButton/AddBuildingButton';
import {
  createBuilding,
  updateBuildingGeometry,
  updateHighlightGroup
} from '../../utils/building';
import { initScene } from '../../utils/initScene';
import { animateScene } from '../../utils/animateScene';
import {
  onPointerDownHandler,
  onPointerMoveHandler,
  onPointerUpHandler,
  onKeyDownHandler,
} from '../../utils/sceneEventHandlers';
import styles from './styles.module.css';
import { ISceneContext } from '../../interfaces/sceneInterfaces';

export interface IBuildingParams {
  floors: number;
  floorHeight: number;
  width: number;
  depth: number;
}

const DEFAULT_PARAMS: IBuildingParams = {
  floors: 3,
  floorHeight: 0.55,
  width: 2,
  depth: 2
};

const BuildingScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeBuildingParams, setActiveBuildingParams] = useState<IBuildingParams | null>(null);
  const [activeBuildingNumber, setActiveBuildingNumber] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isOpened, setIsOpened] = useState(false);

  const buildingRef = useRef<THREE.Mesh | null>(null);
  const buildingsRef = useRef<THREE.Mesh[]>([]);
  const worldGroupRef = useRef<THREE.Group | null>(null);
  const resizeDataRef = useRef<ISceneContext['resizeDataRef']['current']>(null);

  const updateMenuPosition = (pos: { x: number; y: number }) => {
    setMenuPosition(pos);
  };

  const handleDelete = () => {
    if (buildingRef.current && buildingRef.current.parent) {
      buildingRef.current.parent.remove(buildingRef.current);
      buildingsRef.current = buildingsRef.current.filter(b => b !== buildingRef.current);
      buildingRef.current = null;
      setIsOpened(false);
      setActiveBuildingParams(null);
      setActiveBuildingNumber(null);
    }
  };

  const handleAddBuilding = useCallback(() => {
    const params: IBuildingParams = { ...DEFAULT_PARAMS };
    setActiveBuildingParams(params);
    setIsOpened(false);

    if (!worldGroupRef.current) {
      setTimeout(() => {
        handleAddBuilding();
      }, 100);
      return;
    }

    const newBuilding = createBuilding(params);
    newBuilding.userData.buildingNumber = buildingsRef.current.length + 1;

    const margin = 1;
    let offsetX = 0;
    if (buildingsRef.current.length > 0) {
      const lastBuilding = buildingsRef.current[buildingsRef.current.length - 1];
      offsetX = lastBuilding.position.x + params.width + margin;
    }
    newBuilding.position.x = offsetX;

    worldGroupRef.current.add(newBuilding);
    buildingsRef.current.push(newBuilding);
    buildingRef.current = newBuilding;

    updateHighlightGroup(newBuilding, params);
  }, []);

  const handleParamsChange = (newParams: IBuildingParams) => {
    setActiveBuildingParams(newParams);
    if (buildingRef.current) {
      buildingRef.current.userData.params = newParams;
      updateBuildingGeometry(buildingRef.current, newParams);
      updateHighlightGroup(buildingRef.current, newParams);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const { scene, camera, renderer, worldGroup } = initScene(mountRef.current);
    worldGroupRef.current = worldGroup;

    if (buildingsRef.current.length === 0) {
      handleAddBuilding();
    }

    const context: ISceneContext = {
      renderer,
      camera,
      pointer: new THREE.Vector2(),
      raycaster: new THREE.Raycaster(),
      buildingRef,
      buildingsRef,
      worldGroup,
      resizeDataRef,
      isDragging: false,
      isResizing: false,
      clickStartTime: 0,
      clickStartX: 0,
      clickStartY: 0,
      lastX: 0,
      lastY: 0,
      setIsOpened,
      setActiveBuildingParams,
      setActiveBuildingNumber,
      handleParamsChange,
      updateMenuPosition
    } as ISceneContext & { updateMenuPosition: typeof updateMenuPosition };

    const canvas = renderer.domElement;
    const onPointerDown = (e: PointerEvent) => onPointerDownHandler(e, context);
    const onPointerMove = (e: PointerEvent) => onPointerMoveHandler(e, context);
    const onPointerUp = (e: PointerEvent) => onPointerUpHandler(e, context);
    const onKeyDown = (e: KeyboardEvent) => onKeyDownHandler(e, context);

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);
    window.addEventListener('keydown', onKeyDown);

    animateScene(scene, camera, renderer);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [handleAddBuilding]);

  return (
    <div ref={mountRef} className={styles.sceneContainer}>
      <div className={styles.addButtonContainer}>
        <AddBuildingButton onClick={handleAddBuilding} />
      </div>

      {isOpened && activeBuildingParams && (
        <PopOverMenu
          style={{ left: menuPosition.x, top: menuPosition.y }}
          params={activeBuildingParams}
          buildingNumber={activeBuildingNumber || 1}
          onChange={handleParamsChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default BuildingScene;
