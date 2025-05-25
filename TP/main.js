import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { Curves, OrbitControls, RectAreaLightHelper } from 'three/examples/jsm/Addons.js';
import shapes from './shapes';
import printer from './printer';
import curves from './curves';

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


const clipPlane = new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 0 );
const helpers = new THREE.Group();
helpers.add( new THREE.PlaneHelper( clipPlane, 2, 0x00ff00 ) );
// scene.add(helpers)

const shapeHeight = 1;
const extrudeSettings = {
    depth: shapeHeight,
    bevelEnabled: false,
    steps: 10
};

const geometry = new THREE.ExtrudeGeometry(shapes.createB3Shape(), extrudeSettings);
const material = new THREE.MeshNormalMaterial({ color: 0xffcc00, clippingPlanes: [] });
const mesh = new THREE.Mesh(geometry, material);

// mesh.rotation.x -= Math.PI / 2;
// mesh.scale.set(0.5, 0.5, 1);
// console.log(mesh.geometry)
// scene.add(mesh)

const wireframe = new THREE.WireframeGeometry(geometry);
const wline = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
scene.add(wline);

let startTime = null;
const endHeight = 2;
const timeToBuild = 3;

const gui = new GUI();
const params = { speed: 0.5, building: false };
gui.add(params, 'speed', 0, 1);
gui.add(params, 'building').name('Building').onChange(function(value) {
    console.log('Building toggled:', value);
    if (value) {
        startTime = performance.now();
    }
});

const lid = printer.createLid();
// scene.add(lid);

const pgeometry = new THREE.BufferGeometry().setFromPoints(curves.B3Curve());
const pmaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const line = new THREE.Line(pgeometry, pmaterial);
scene.add(line);

scene.add(line);

function animate() {
    controls.update();

    if (params.building) {
        const now = performance.now();
        const elapsed = (now - startTime) / 1000;
    
        clipPlane.constant = Math.min(endHeight, (elapsed / timeToBuild) * endHeight);
        lid.position.y = Math.min(endHeight, (elapsed / timeToBuild) * endHeight);
 
        if (clipPlane.constant >= endHeight) {
            params.building = false;
            gui.updateDisplay();
        }

    }

    renderer.render(scene, camera);
}