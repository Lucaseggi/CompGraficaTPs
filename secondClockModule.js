import * as THREE from 'three';

const circleGeometry = new THREE.CircleGeometry(4, 32);
const circleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide
});
const circle = new THREE.Mesh(circleGeometry, circleMaterial);

const rectangleGeometry = new THREE.BoxGeometry(0.5, 3.5);
const rectangleMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide
});
const rectangle = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
rectangle.position.y -= 1.75;
// rectangle.ro

const secondClock = new THREE.Group();
secondClock.add(circle);
const needle = new THREE.Group();
needle.add(rectangle);
secondClock.add(needle);

export function updateSecondNeedle() {
    const now = new Date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const angle = -seconds * (Math.PI * 2 / 60); 

    const quarter = now.getMilliseconds() / 1000;
    console.log(quarter)

    const swing = Math.sin(quarter);
    // if (quarter < 250) swing = 0
    const maxAngle = Math.PI / 2;
    const dir = seconds % 2 ? -1 : 1
    needle.rotation.z = dir * swing * maxAngle;    
}

export default secondClock;