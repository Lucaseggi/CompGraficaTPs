import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { Curves, OrbitControls, RectAreaLightHelper } from 'three/examples/jsm/Addons.js';
import Printer from './printer';
import Forklift from './forklift';
import keyboardManager from './keys';
import Shelf from './shelf';
import CameraManager from './cameras';
import Warehouse from './warehouse';
import { directPointLight } from 'three/tsl';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import curves from './curves';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.localClippingEnabled = true;
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gui = new GUI();
const params = { speed: 0.6, building: false, shape: "", height: 1, rotation: 0 };
gui.add(params, 'speed', 0.1, 2).name('Print speed');

const printer = new Printer(scene, gui, params);
const forklift = new Forklift(scene, gui, params);
const shelf = new Shelf(scene, gui, params);
const warehouse = new Warehouse();

// const helpers = new THREE.Group();
// helpers.add(new THREE.PlaneHelper(printer.clipPlane, 2, 0x00ff00));
// scene.add(helpers);

// const wireframe = new THREE.WireframeGeometry(geometry);
// const wline = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
// scene.add(wline)

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight1.position.set(0, 10, 5);
// directionalLight1.castShadow = true;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5);
directionalLight2.position.set(0, 10, -5);
// directionalLight2.castShadow = true;
scene.add(directionalLight2);


const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);

// scene.add(printer.structure);
// scene.add(forklift.structure);
// scene.add(shelf.structure);
// scene.add(warehouse.structure);

const pgeometry = new THREE.BufferGeometry().setFromPoints(curves.A1Curve());
const line = new THREE.Line(pgeometry, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
scene.add(line)

printer.structure.rotateY(Math.PI)
forklift.structure.translateX(10);
forklift.structure.translateY(0.5);
shelf.structure.translateX(20);
shelf.structure.rotateY(Math.PI / 2);

forklift.initForkControls();
shelf.structure.updateMatrixWorld(true);

const cameraManager = new CameraManager(printer, forklift, shelf, keyboardManager, renderer);

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
        if (keyboardManager.isJustPressed('g')) {
            const printerPoint = printer.getMeshPosition();
            const distanceToPrinter = printerPoint?.distanceTo(forklift.getForkPosition());
            const {shelfPoint, worldShelfPoint} = shelf.getClosestShelf(forklift.getForkPosition());
            const distanceToShelf = worldShelfPoint.distanceTo(forklift.getForkPosition());

            if (distanceToPrinter < 5 && printer.currentMesh) {
                removeClippingFromMesh(printer.currentMesh);
                forklift.removeMeshFromFork();
                forklift.addMeshToFork(printer.currentMesh);
                printer.removeMesh();
                console.info("Mesh removed from printer");
            } else if (distanceToShelf < 5) {
                if (forklift.currentMesh) {
                    const success = shelf.addMeshToShelf(shelfPoint, forklift.currentMesh);
                    if (success) forklift.removeMeshFromFork();
                    console.info("Mesh deposited in shelf");
                } else if (shelf.isSpotOccupied(shelfPoint)) {
                    forklift.addMeshToFork(shelf.removeMeshFromSpot(shelfPoint));
                    console.info("Mesh removed from shelf");
                }
            } else if (forklift.currentMesh) {
                console.info("Nowhere to drop object");
            } else {
                console.info("No object to grab");
            }

        }

        if (keyboardManager.isJustPressed('r')) {
            forklift.removeMeshFromFork();
            console.info("Mesh dropped");
        }

        requestAnimationFrame(update);
    };

    update();
}

initGlobalControls();

const loader = new EXRLoader();

loader.load('../bloem_field_sunrise_4k.exr', texture => {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = texture;   // Show as background (skybox)
  scene.environment = texture; // Use for reflections/lighting
});

function animate() {
    const activeCamera = cameraManager.updateCamera();
    cameraManager.updateControls();

    printer.animate();

    renderer.render(scene, activeCamera);
}