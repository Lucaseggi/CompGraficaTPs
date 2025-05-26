import * as THREE from 'three';

export function createCannister() {
    const geometry = new THREE.BoxGeometry(2, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    const box = new THREE.Mesh(geometry, material);

    return box;
}


export function createWheel(radius = 2, withCannister = false) {
    const wheelGroup = new THREE.Group();

    const geometry = new THREE.CylinderGeometry(radius, radius, 0.5, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x444444 });
    const wheel = new THREE.Mesh(geometry, material);

    wheel.rotation.x = Math.PI / 2;
    wheelGroup.add(wheel)
    
    if (withCannister) {
        const cannister = createCannister();
        const cannisterGroup = new THREE.Group();
        cannisterGroup.add(cannister);
        wheelGroup.add(cannisterGroup);

        cannisterGroup.position.y = - 3;
        wheelGroup.cannisterGroup = cannisterGroup;
        cannisterGroup.cannister = cannister;
    }

    return wheelGroup;
}

export function createBar(width = 6, height = 1) {
    const group = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(width - 1, height, height);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x8888ff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.x = (width - 1) / 2; // Center body so cone aligns to origin
    body.castShadow = true;
    body.receiveShadow = true;

    const coneGeometry = new THREE.ConeGeometry(height / 2, 1, 32);
    const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xff4444 });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.rotation.z = Math.PI / 2; 
    cone.position.x = -1 / 2;
    cone.castShadow = true;
    cone.receiveShadow = true;

    group.add(body);
    group.add(cone);

    group.position.x += 1;

    return group;
}

export function wheelBar(radius = 2, withCannister = false) {
    const wheelBar = new THREE.Group();
    
    wheelBar.add(createBar());
    
    const wheel = createWheel(radius, withCannister);
    wheelBar.add(wheel);
    wheel.position.x += 6;
    wheelBar.wheel = wheel;

    return wheelBar;
}

export function buildWheel(radius = 2) {
    const wheelGroup = new THREE.Group();

    wheelGroup.add(createWheel());

    const wheelBar1 = wheelBar(radius, true);
    wheelGroup.add(wheelBar1);
    
    const wheelBar2 = wheelBar1.clone();
    wheelBar2.rotation.z = Math.PI * 2 / 3;
    wheelBar2.children[1].rotation.z = Math.PI * 4 / 3;
    wheelGroup.add(wheelBar2);

    const wheelBar3 = wheelBar1.clone();
    wheelBar3.rotation.z = Math.PI * 4 / 3;
    wheelBar3.children[1].rotation.z = Math.PI * 2 / 3;
    wheelGroup.add(wheelBar3);

    return wheelGroup;
}


export function spinWheel(wheel) {
    const now = new Date();
    const angle = now.getTime() / 10000

    wheel.rotation.z = angle;

    let modifier = Math.PI * 4 / 3;
    wheel.children.forEach((child, i) => {

        if (child.children[1]) {
            unspinCannister(child.children[1], modifier * i - 1)
        }
    });
}

export function unspinCannister(wheelGroup, modifier) {
    const now = new Date();
    const angle = now.getTime() / 10000

    wheelGroup.children[0].rotation.y = + angle;

    wheelGroup.rotation.z = - angle;
}