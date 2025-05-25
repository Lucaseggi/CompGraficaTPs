import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { Curves, OrbitControls, RectAreaLightHelper } from 'three/examples/jsm/Addons.js';
import Printer from './printer';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.localClippingEnabled = true;
document.body.appendChild(renderer.domElement);

camera.position.set(0, 1, 6);

const controls = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gui = new GUI();
const params = { speed: 0.6, building: false, shape: "", rotation: 0 };
gui.add(params, 'speed', 0.1, 2);

const printer = new Printer(scene, gui, params);

const helpers = new THREE.Group();
helpers.add(new THREE.PlaneHelper(printer.clipPlane, 2, 0x00ff00));
scene.add(helpers);

// const wireframe = new THREE.WireframeGeometry(geometry);
// const wline = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
// scene.add(wline)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(5, 10, 5);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

scene.add(printer.lid);
scene.add(printer.base);
scene.add(printer.rod);

function animate() {
    controls.update();

    printer.animate();

    renderer.render(scene, camera);
}