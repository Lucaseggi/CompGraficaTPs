import * as THREE from 'three';
import { buildCylinders, updateCylinderGrid } from './cylinderGrid';

const circleGeometry = new THREE.CircleGeometry(4, 32);
const circleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
});


export function buildSun() {
    const sun = new THREE.Mesh(circleGeometry, circleMaterial);

    const sunGroup = new THREE.Group();
    sunGroup.add(sun)

    const width = 10;
    const height = 6;
    const intensity = 10;
    const rectLight = new THREE.RectAreaLight( 0xff10F0, intensity,  width, height );
    rectLight.position.set( 0, -3, 2 );
    rectLight.lookAt( 0, 0, 0 );
    sunGroup.add( rectLight )

    const rectLight2 = new THREE.RectAreaLight( 0xffff00, intensity,  width, height );
    rectLight2.position.set( 0, 3, 3 );
    rectLight2.lookAt( 0, 0, 0 );
    sunGroup.add( rectLight2 )

    // const rectLightHelper = new RectAreaLightHelper( rectLight );
    // rectLight.add( rectLightHelper );

    const cylinderGrid = buildCylinders();
    sunGroup.add(cylinderGrid)
    
    cylinderGrid.position.y = -5.5
    cylinderGrid.position.z = 2
    
    return sunGroup
}

export function updateSun(sun) {
    updateCylinderGrid(sun.children[3])
}