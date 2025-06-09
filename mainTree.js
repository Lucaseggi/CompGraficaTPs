import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Forest from './forest';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const forest = new Forest(3, 3, 3);
scene.add(forest.group);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 5);
scene.add(light);

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        forest.increaseDepth();
    } else if (e.key === 'ArrowDown') {
        forest.decreaseDepth();
    }
});

function animate() {
    controls.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
