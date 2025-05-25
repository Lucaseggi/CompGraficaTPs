import * as THREE from 'three';
import castle from './castle';
import pond from './pond';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

scene.add(castle);
scene.add(pond);

pond.rotation.x = -Math.PI / 2;
pond.position.set(0, 0, 6);
castle.translateY(0.5);

camera.position.set(0, 2, 11);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new OrbitControls( camera, renderer.domElement );

function animate() {
    controls.update();

	renderer.render( scene, camera );
}