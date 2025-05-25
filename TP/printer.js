import * as THREE from 'three';

function createLid() {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
    });
    const lid = new THREE.Mesh(geometry, material);

    lid.rotation.x = Math.PI / 2;

    return lid;
}

const printer = {
    createLid,
}

export default printer;