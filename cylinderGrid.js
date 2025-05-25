import * as THREE from 'three';
import { log } from 'three/tsl';

const material = new THREE.MeshBasicMaterial( {color: 0x000000} ); 

function buildCillinderHorizontal(length, z, group) {

    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 20)
    const cylinder = new THREE.Mesh(cylinderGeometry, material);

    cylinder.position.z += z

    group.add(cylinder)
}


export function buildCylinders(width = 10, depth = 0, interval = 4) {
    const grid = new THREE.Group()

    for (let z = 0; z <= depth; z++) {
        buildCillinderHorizontal(width, - depth / 2 + z * interval, grid)
    }

    grid.rotateZ(Math.PI / 2)
    grid.rotateY(Math.PI / 2)

    return grid
}


function getScaleByDistance(z) {
    const baseScale = 0.9;
    const minScale = 0.05;
    const scaleFactor = 0.5;

    const scale = baseScale * Math.exp(-scaleFactor * Math.abs(z));
    return Math.max(scale, minScale);
}



let frame = 1
const maxDistance = 5
export function updateCylinderGrid(grid, speed = 1) {
    if (frame++ % 100 == 1) {
        buildCillinderHorizontal(10, 0, grid);
    }

    
    grid.children.forEach((cylinder) => {
        const z = cylinder.position.z;
        const scale = getScaleByDistance(z);
        cylinder.position.z += 0.008;
        cylinder.scale.set(scale, 1, scale);

        if (cylinder.position.z > maxDistance) grid.remove(cylinder)
    });
}
