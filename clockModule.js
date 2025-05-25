import * as THREE from 'three';

const circleGeometry = new THREE.CircleGeometry(4, 32);
const circleMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide
});
const circle = new THREE.Mesh(circleGeometry, circleMaterial);

const hourNeedleGeometry = new THREE.BoxGeometry(0.5, 2.5, 0.2);
const minuteNeedleGeometry = new THREE.BoxGeometry(0.25, 3.5, 0.2);
const needleMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
});

const hourIndicatorGeometry = new THREE.BoxGeometry(0.25, 1, 0.1);
const indicatorMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide
});

const hourNeedle = new THREE.Mesh(hourNeedleGeometry, needleMaterial);
const minuteNeedle = new THREE.Mesh(minuteNeedleGeometry, needleMaterial);
const indicator = new THREE.Mesh(hourIndicatorGeometry, indicatorMaterial);

hourNeedle.position.y = 1.25;
minuteNeedle.position.y = 1.75;

export function buildClock() {
    const clock = new THREE.Group();
    clock.add(circle);
    const hourNeedleGroup = new THREE.Group();
    const minuteNeedleGroup = new THREE.Group();
    const indicatorGroup = new THREE.Group();

    for (let i = 0; i < 12; i++) {
        const clone = indicator.clone();
        const pivot = new THREE.Group();

        clone.position.y = 3;
        pivot.rotation.z = i * (Math.PI / 6);
        pivot.add(clone);

        indicatorGroup.add(pivot);
    }

    hourNeedleGroup.add(hourNeedle);
    minuteNeedleGroup.add(minuteNeedle);
    clock.add(hourNeedleGroup);
    clock.add(minuteNeedleGroup);
    clock.add(indicatorGroup)

    return clock
}

export function updateNeedle(clock) {
    const now = new Date();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    const minuteAngle = - minutes * (Math.PI * 2 / 60);
    const hourAngle = - hours * (Math.PI * 2 / 12);

    clock.children[1].rotation.z = hourAngle;
    clock.children[2].rotation.z = minuteAngle;
}