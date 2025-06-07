import * as THREE from 'three';
import { GUI } from 'dat.gui';
import Boombox from './TP/boombox';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.set(0, 0, 6)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.localClippingEnabled = true;
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gui = new GUI();

const boombox = new Boombox(scene, gui, camera);
scene.add(boombox.structure);

const controls = new OrbitControls( camera, renderer.domElement );

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3);
directionalLight1.position.set(0, 5, 5);
// directionalLight1.castShadow = true;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 3);
directionalLight2.position.set(0, 5, -5);
// directionalLight2.castShadow = true;
scene.add(directionalLight2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

function animate() {
    controls.update();

    renderer.render(scene, camera);
}