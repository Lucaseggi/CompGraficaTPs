import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { buildPendulum, updatePendulum } from './pendulumModule';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const pendulum = buildPendulum();
scene.add(pendulum);

camera.position.set(0, -4, 4);
// camera.lookAt(new THREE.Vector3(0, -100, 4));

const controls = new OrbitControls( camera, renderer.domElement );

function animate() {
    controls.update();

    updateNeedle();
    updatePendulum(pendulum);

	renderer.render( scene, camera );
}