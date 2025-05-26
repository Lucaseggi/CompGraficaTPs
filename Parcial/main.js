import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { Curves, OrbitControls, RectAreaLightHelper } from 'three/examples/jsm/Addons.js';
import { buildWheel, createBar, createWheel, spinWheel, unspinCannister, wheelBar } from './wheel';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 1, 6);

const controls = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const wheel = buildWheel(2, true);
scene.add(wheel);

function animate() {
    controls.update();

    spinWheel(wheel);

    renderer.render(scene, camera);
}