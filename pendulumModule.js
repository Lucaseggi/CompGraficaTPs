import * as THREE from 'three';
import { buildClock, updateNeedle } from './clockModule';

const pendulumGeometry = new THREE.BoxGeometry(0.3, 3, 0.2);

const pendulumMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide
});

export function buildPendulum() {
    const clock = buildClock();

    const pendulum = new THREE.Mesh(pendulumGeometry, pendulumMaterial);

    const pendulumGroup = new THREE.Group();
    pendulum.position.y -= 1.5
    pendulumGroup.add(pendulum);
    pendulumGroup.add(clock);
    
    clock.scale.set(0.2, 0.2, 1);
    clock.position.set(0, -3, 0.25);

    pendulumGroup.clock = clock;
    
    return pendulumGroup;
}

export function updatePendulum(pendulumGroup) {
    updateNeedle(pendulumGroup.children[1])

    const now = new Date();
    const time = now.getTime()
    const swing = Math.sin((time % 3000) / 3000 * Math.PI * 2);

    const maxAngle = Math.PI / 8; // ~20 degrees swing
    pendulumGroup.rotation.z = swing * maxAngle;
    pendulumGroup.clock.rotation.z = - swing * maxAngle;
}
