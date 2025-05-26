import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { Curves, OrbitControls, RectAreaLightHelper } from 'three/examples/jsm/Addons.js';
import Printer from './printer';
import Forklift from './forklift';
import keyboardManager from './keys';
import Shelf from './shelf';

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
const forklift = new Forklift(scene, gui, params);
const shelf = new Shelf(scene, gui, params);

// const helpers = new THREE.Group();
// helpers.add(new THREE.PlaneHelper(printer.clipPlane, 2, 0x00ff00));
// scene.add(helpers);

// const wireframe = new THREE.WireframeGeometry(geometry);
// const wline = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
// scene.add(wline)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(5, 10, 5);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

scene.add(printer.structure);
scene.add(forklift.structure);
scene.add(shelf.structure);

forklift.structure.translateX(4);
shelf.structure.translateX(20);
shelf.structure.rotateY(Math.PI / 2);

forklift.initForkControls();

function removeClippingFromMesh(mesh) {
    if (!mesh) return;

    if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => {
            mat.clippingPlanes = [];
            // Optional: update material to recompile shader if needed
            mat.needsUpdate = true;
        });
    } else if (mesh.material) {
        mesh.material.clippingPlanes = [];
        mesh.material.needsUpdate = true;
    }
}


function initGlobalControls() {
    const update = () => {
        if (keyboardManager.isPressed('g') && printer.currentMesh) {
            const distance = printer.getMeshPosition().distanceTo(forklift.getForkPosition());

            if (distance > 5) {
                console.log("too far!", distance);
            } else {
                removeClippingFromMesh(printer.currentMesh);
                forklift.removeMeshFromFork();
                forklift.addMeshToFork(printer.currentMesh);
                printer.removeMesh();
            }
        }

        if (keyboardManager.isPressed('r')) {
            forklift.removeMeshFromFork();
        }

        if (keyboardManager.isPressed('m')) {
            const point = shelf.getClosestShelf(forklift.getForkPosition());
            console.log(point);
        }

        requestAnimationFrame(update);
    };

    update();
}

initGlobalControls();

function animate() {
    controls.update();

    printer.animate();

    renderer.render(scene, camera);
}