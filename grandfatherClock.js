import * as THREE from 'three';
import { buildPendulum, updatePendulum } from './pendulumModule';

function buildChassis(clock) {
    const chassis = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({ color: 0x895129 });
    const stringMaterial = new THREE.MeshPhysicalMaterial({ color: 0xFFFFFF });
    const brassMaterial = new THREE.MeshPhysicalMaterial({ color: 0xFF5733 });

    const width = 3;
    const depth = 2;
    const height = 4;
    const thickness = 0.2;

    const backWallGeometry = new THREE.BoxGeometry(width, height, thickness);
    const sideWallGeometry = new THREE.BoxGeometry(depth, height, thickness);
    const bottomWallGeometry = new THREE.BoxGeometry(width, depth, thickness);

    const backWall = new THREE.Mesh(backWallGeometry, material)
    backWall.translateZ(-depth / 2)
    chassis.add(backWall)

    const sideWall = new THREE.Mesh(sideWallGeometry, material)
    const sideWall2 = new THREE.Mesh(sideWallGeometry, material)
    sideWall.rotateY(Math.PI / 2)
    sideWall2.rotateY(Math.PI / 2)
    sideWall.translateZ(- width / 2)
    sideWall2.translateZ(width / 2)
    chassis.add(sideWall)
    chassis.add(sideWall2)

    const bottowmWall = new THREE.Mesh(bottomWallGeometry, material)
    const bottowmWall2 = new THREE.Mesh(bottomWallGeometry, material)
    bottowmWall.rotateX(Math.PI / 2)
    bottowmWall2.rotateX(Math.PI / 2)
    bottowmWall.translateZ(- height / 2)
    bottowmWall2.translateZ(height / 2)
    chassis.add(bottowmWall)
    chassis.add(bottowmWall2)


    const cyllinderGeometry = new THREE.CylinderGeometry(width/ 2, width / 2, depth, 4, 1, false, 0, Math.PI)
    const cyllinder = new THREE.Mesh(cyllinderGeometry, material)
    cyllinder.rotateZ(Math.PI / 2)
    cyllinder.rotateX(Math.PI / 2)
    cyllinder.position.y += height/2
    chassis.add(cyllinder)


    const ropeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 3)
    const weightGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1)
    const rope = new THREE.Mesh(ropeGeometry, stringMaterial)
    const weight = new THREE.Mesh(weightGeometry, brassMaterial)
    const ropeWeight = new THREE.Group()
    ropeWeight.add(weight)
    ropeWeight.add(rope)
    weight.position.y -= 1.5;
    ropeWeight.position.z += 0.5;
    
    const ropeWeight2 = ropeWeight.clone()
    ropeWeight.position.x -= 0.8;
    ropeWeight2.position.x += 0.8;
    ropeWeight.position.y += 0.5;
    ropeWeight2.position.y += 1;
    chassis.add(ropeWeight)
    chassis.add(ropeWeight2)

    chassis.scale.set(1.4, 1.4, 1.4)
    clock.add(chassis)
}

export function buildGrandfatherClock() {
    const grandfatherClock = new THREE.Group();

    const pendulum = buildPendulum();
    pendulum.position.y += 2.8
    grandfatherClock.add(pendulum);

    buildChassis(grandfatherClock)

    return grandfatherClock
}

export function updateGrandfatherClock(grandfatherClock) {
    updatePendulum(grandfatherClock.children[0])
}