import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { IBuildingParams } from '../scene/BuildingScene/BuildingScene'

export function disableDepth(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach(mat => {
      mat.depthTest = false
      mat.depthWrite = false
    })
  } else {
    material.depthTest = false
    material.depthWrite = false
  }
}

export function createBuilding(params: IBuildingParams): THREE.Mesh {
  const { floors, floorHeight } = params
  const baseWidth = 2
  const baseDepth = 2

  const boxes: THREE.BoxGeometry[] = []
  for (let i = 0; i < floors; i++) {
    const box = new THREE.BoxGeometry(baseWidth, floorHeight, baseDepth)
    box.translate(0, floorHeight / 2 + i * floorHeight, 0)
    boxes.push(box)
  }

  const mergeFn =
    (BufferGeometryUtils as any).mergeBufferGeometries ||
    (BufferGeometryUtils as any).mergeGeometries
  if (!mergeFn) {
    throw new Error('No merge function found in BufferGeometryUtils')
  }
  const merged = mergeFn(boxes)

  const buildingMaterial = new THREE.MeshPhongMaterial({
    color: 0xf0f0f0,
    flatShading: true,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    transparent: false,
    opacity: 1,
    side: THREE.FrontSide
  })

  const building = new THREE.Mesh(merged, buildingMaterial)
  building.position.y = 0.01
  building.castShadow = true
  building.userData.isBuilding = true
  building.userData.params = { ...params }

  const edgesGeo = new THREE.EdgesGeometry(merged)
  const edgesMat = new THREE.LineBasicMaterial({
    color: 0x000000,
    depthTest: true,
    linewidth: 1
  })
  const edges = new THREE.LineSegments(edgesGeo, edgesMat)
  building.add(edges)

  const highlightGroup = new THREE.Group()
  highlightGroup.name = 'highlightGroup'
  highlightGroup.renderOrder = 1
  highlightGroup.visible = false
  building.add(highlightGroup)

  building.scale.x = params.width / baseWidth
  building.scale.z = params.depth / baseDepth

  return building
}

export function updateBuildingGeometry(building: THREE.Mesh, params: IBuildingParams) {
  const { floors, floorHeight } = params
  const baseWidth = 2
  const baseDepth = 2

  const boxes: THREE.BoxGeometry[] = []
  for (let i = 0; i < floors; i++) {
    const box = new THREE.BoxGeometry(baseWidth, floorHeight, baseDepth)
    box.translate(0, floorHeight / 2 + i * floorHeight, 0)
    boxes.push(box)
  }

  const mergeFn =
    (BufferGeometryUtils as any).mergeBufferGeometries ||
    (BufferGeometryUtils as any).mergeGeometries
  if (!mergeFn) {
    throw new Error('No merge function found in BufferGeometryUtils')
  }
  const newMerged = mergeFn(boxes)

  building.geometry.dispose()
  building.geometry = newMerged

  building.traverse(child => {
    if (child instanceof THREE.LineSegments && child.name === '') {
      child.geometry.dispose()
      child.geometry = new THREE.EdgesGeometry(newMerged)
    }
  })

  building.scale.x = params.width / baseWidth
  building.scale.z = params.depth / baseDepth
}

export function updateHighlightGroup(building: THREE.Mesh, params: IBuildingParams) {
  const highlightGroup = building.getObjectByName('highlightGroup')
  if (!highlightGroup) return

  while (highlightGroup.children.length > 0) {
    highlightGroup.remove(highlightGroup.children[0])
  }

  for (let i = 0; i < params.floors; i++) {
    const floorBox = new THREE.BoxGeometry(2, params.floorHeight, 2)
    floorBox.translate(0, params.floorHeight / 2 + i * params.floorHeight, 0)
    const floorEdgesGeo = new THREE.EdgesGeometry(floorBox)
    const floorEdgesMat = new THREE.LineBasicMaterial({
      color: 0x0084ff,
      linewidth: 2
    })
    disableDepth(floorEdgesMat)
    const floorEdges = new THREE.LineSegments(floorEdgesGeo, floorEdgesMat)
    highlightGroup.add(floorEdges)
  }

  const originalScale = building.scale.clone()
  building.scale.set(1, 1, 1)
  building.updateMatrixWorld(true)
  const tempBox = new THREE.Box3().setFromObject(building)
  building.scale.copy(originalScale)
  const size = tempBox.getSize(new THREE.Vector3())
  const center = tempBox.getCenter(new THREE.Vector3())
  const localCenter = building.worldToLocal(center.clone())
  const lowestLocalY = tempBox.min.y - building.position.y

  const outerBoxGeo = new THREE.BoxGeometry(size.x, size.y, size.z)
  const outerEdgesGeo = new THREE.EdgesGeometry(outerBoxGeo)
  const outerEdgesMat = new THREE.LineBasicMaterial({
    color: 0x0084ff,
    linewidth: 2
  })
  disableDepth(outerEdgesMat)
  const outerEdges = new THREE.LineSegments(outerEdgesGeo, outerEdgesMat)
  outerEdges.position.copy(localCenter)
  highlightGroup.add(outerEdges)

  const cornerSize = 0.1
  const cornerGeo = new THREE.BoxGeometry(cornerSize, cornerSize, cornerSize)
  const cornerMat = new THREE.MeshBasicMaterial({ color: 0x0084ff })
  disableDepth(cornerMat)
  const offsets = [
    new THREE.Vector3(size.x / 2, size.y / 2, size.z / 2),
    new THREE.Vector3(size.x / 2, size.y / 2, -size.z / 2),
    new THREE.Vector3(size.x / 2, -size.y / 2, size.z / 2),
    new THREE.Vector3(size.x / 2, -size.y / 2, -size.z / 2),
    new THREE.Vector3(-size.x / 2, size.y / 2, size.z / 2),
    new THREE.Vector3(-size.x / 2, size.y / 2, -size.z / 2),
    new THREE.Vector3(-size.x / 2, -size.y / 2, size.z / 2),
    new THREE.Vector3(-size.x / 2, -size.y / 2, -size.z / 2)
  ]
  offsets.forEach(offset => {
    const corner = new THREE.Mesh(cornerGeo, cornerMat)
    corner.position.copy(localCenter).add(offset)
    corner.userData.isResizeHandle = true
    corner.userData.handleSign = {
      x: offset.x >= 0 ? 1 : -1,
      z: offset.z >= 0 ? 1 : -1
    }
    highlightGroup.add(corner)
  })

  const axesGroup = new THREE.Group()
  const arrowSize = 2
  const arrowX = new THREE.ArrowHelper(
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, 0),
    arrowSize,
    0xff0000
  )
  const arrowY = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 0),
    arrowSize,
    0x00ff00
  )
  const arrowZ = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, 0),
    arrowSize,
    0x0000ff
  )
  axesGroup.add(arrowX, arrowY, arrowZ)
  axesGroup.position.set(
    localCenter.x - (size.x / 2 + 0.2),
    lowestLocalY,
    localCenter.z - (size.z / 2 + 0.2)
  )
    ;[arrowX, arrowY, arrowZ].forEach(arrow => {
      disableDepth(arrow.line.material)
      disableDepth(arrow.cone.material)
    })
  highlightGroup.add(axesGroup)
}
