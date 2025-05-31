import * as THREE from 'three';
import { OrbitControls, RectAreaLightHelper } from 'three/examples/jsm/Addons.js';
import { buildGrid, updateGrid } from './movingGrid';
import { buildGrandfatherClock, updateGrandfatherClock } from './grandfatherClock';
import { updateNeedle } from './clockModule';
import { updatePendulum } from './pendulumModule';
import { buildSun, updateSun } from './sun';
import { buildCylinders, updateCylinderGrid } from './cylinderGrid';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 1, 6);

const controls = new OrbitControls(camera, renderer.domElement);

const grid = buildGrid(20, 50)
scene.add(grid);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Optionally add ambient or hemisphere light for fill
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const grandfatherClock = buildGrandfatherClock();
// scene.add(grandfatherClock)
grandfatherClock.position.y = 3;

const sun = buildSun();
scene.add(sun)
sun.translateY(10)
sun.translateZ(-30)

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

function animate() {
    controls.update();
    updateGrid(grid)
    updateSun(sun)

    updateGrandfatherClock(grandfatherClock);


    renderer.render(scene, camera);
}