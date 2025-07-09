import * as THREE from 'three';
import { GUI } from 'dat.gui';
import Printer from './printer';
import Forklift from './forklift';
import keyboardManager from './keys';
import Shelf from './shelf';
import CameraManager from './cameras';
import Warehouse from './warehouse';
import { buildSun, updateSun } from '../sun';
import Forest from '../forest';
import FloatingCatmull from './floatingCatmull';
import ShaderManager from './shaderManager';
import { EffectComposer, RenderPass } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.localClippingEnabled = true;
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const gui = new GUI();
const params = { speed: 0.6, building: false, shape: "", height: 1, rotation: 0, selectedPattern: "Mármol N" };

const printer = new Printer(scene, gui, params);
const shaderManager = new ShaderManager(composer);
const forklift = new Forklift(scene, gui, params, shaderManager);
const shelf = new Shelf(scene, gui, params);
const warehouse = new Warehouse();
const sun = buildSun();
const forest = new Forest(3, 3, 2);
const floatingCatmull = new FloatingCatmull(scene);

// const helpers = new THREE.Group();
// helpers.add(new THREE.PlaneHelper(printer.clipPlane, 2, 0x00ff00));
// scene.add(helpers);

// const wireframe = new THREE.WireframeGeometry(geometry);
// const wline = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
// scene.add(wline)

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 3);
directionalLight1.position.set(0, 5, 5);
// directionalLight1.castShadow = true;
// scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 3);
directionalLight2.position.set(0, 5, -5);
// directionalLight2.castShadow = true;
// scene.add(directionalLight2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);

scene.add(printer.structure);
scene.add(forklift.structure);
scene.add(shelf.structure);
scene.add(warehouse.structure);
scene.add(sun);
scene.add(forest.group);
// scene.add(floatingCatmull);

// const pgeometry = new THREE.BufferGeometry().setFromPoints(curves.A1Curve());
// const line = new THREE.Line(pgeometry, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
// scene.add(line)

printer.structure.rotateY(Math.PI)
forklift.structure.translateX(10);
forklift.structure.translateY(0.5);
shelf.structure.translateX(20);
shelf.structure.rotateY(Math.PI / 2);
sun.position.set(160, 80, 40);
sun.rotateY(-Math.PI / 1.6);
sun.scale.set(4, 4, 4);
forest.group.position.set(120, 0, 40);
forest.group.scale.set(5, 5, 5);
floatingCatmull.scaleCurve(5);
floatingCatmull.translateCurve(new THREE.Vector3(0, warehouse.height, 0));

forklift.initForkControls();
shelf.structure.updateMatrixWorld(true);

const cameraManager = new CameraManager(printer, forklift, shelf, keyboardManager, renderer, forklift.boombox.listener);

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
            const { shelfPoint, worldShelfPoint } = shelf.getClosestShelf(forklift.getForkPosition());
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
            if (forklift.currentMesh) floatingCatmull.addFollower(forklift.currentMesh);
            forklift.removeMeshFromFork();
            console.info("Mesh dropped");
        }

        if (keyboardManager.isJustPressed('ArrowUp')) {
            forest.increaseDepth();
        } else if (keyboardManager.isJustPressed('ArrowDown')) {
            forest.decreaseDepth();
        }

        requestAnimationFrame(update);
    };

    update();
}

initGlobalControls();

const renderPass = new RenderPass(scene, cameraManager.activeCamera); 
composer.addPass(renderPass);

function animate() {
    const activeCamera = cameraManager.updateCamera(forklift.boombox.listener);
    cameraManager.updateControls();

    printer.animate();
    floatingCatmull.update(0.0005);
    updateSun(sun);

    renderPass.camera = activeCamera;
    composer.render(); 
    // renderer.render(scene, activeCamera);
}