import * as THREE from 'three';

const baseWidth = 6;
const baseDepth = 4;
const towerSide = 1;
const towerHeight = 2;
const coneHeight = 1;

const baseGeometry = new THREE.BoxGeometry(baseWidth, 1.5, baseDepth);
const wallMaterial = new THREE.MeshNormalMaterial();
const baseMesh = new THREE.Mesh(baseGeometry, wallMaterial);

const createBaseTower = (x, z) => {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(towerSide, towerHeight, towerSide), wallMaterial);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(towerSide / 1.2, coneHeight, 10), wallMaterial);

    cone.position.y += 1.5
    // cone.rotateOnAxis((cone.position), 45)

    const towerGroup = new THREE.Group();
    towerGroup.add(tower);
    towerGroup.add(cone);

    towerGroup.position.set(x * (baseWidth - towerSide) / 2, 1, z * (baseDepth - towerSide) / 2);

    return towerGroup;
};

const towerOffsets = [
    [-1, -1],
    [-1,  1],
    [ 1, -1],
    [ 1,  1]
];

const towers = towerOffsets.map(([x, z]) => createBaseTower(x, z));

const castle = new THREE.Group();
castle.add(baseMesh);
towers.forEach(tower => castle.add(tower));

export default castle;