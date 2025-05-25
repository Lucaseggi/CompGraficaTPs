import * as THREE from 'three';

const radiuses = [2, 1, 1];
const translations = [[0, 0], [0, 2], [1.5, 1.5]];


const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x6F67FE});


const circles = []
radiuses.forEach((r, i) => {
    const geometry = new THREE.CircleGeometry(r, );
    const mesh = new THREE.Mesh(geometry, circleMaterial);
    
    mesh.position.set(translations[i][0], translations[i][1], );

    circles.push(mesh);
});

const pond = new THREE.Group();
circles.forEach(circle => pond.add(circle));

export default pond;