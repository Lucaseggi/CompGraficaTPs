import * as THREE from 'three';

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFF10f0 });

function buildLineHorizontal(length, z, grid) {
    const points = [];
    points.push(new THREE.Vector3(- length / 2, 0, z));
    points.push(new THREE.Vector3(length / 2, 0, z));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);

    grid.add(line)
}

function buildLineVertical(length, x, grid) {
    const points = [];
    points.push(new THREE.Vector3(x, 0, - length / 2));
    points.push(new THREE.Vector3(x, 0, length / 2));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, lineMaterial);

    grid.add(line)
}

export function buildGrid(width = 10, depth = 6, interval = 1) {
    const grid = new THREE.Group()

    for (let x = 0; x <= width; x++) {
        buildLineVertical(depth, - width / 2 + x * interval, grid)
    }

    for (let z = 0; z <= depth; z++) {
        buildLineHorizontal(width, - depth / 2 + z * interval, grid)
    }

    return grid
}

export function updateGrid(grid, speed = 1) {
    const now = new Date();
    const time = (now.getTime() % (1000 / speed)) / 1000 / speed;

    grid.position.z = time;    
}
