import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const VMgltf = 'models/VM/scene.gltf'
const Benchgltf = 'models/bench/scene.gltf'

const loader = new GLTFLoader();

loader.load(
  '/models/VM/scene.gltf',
  function (gltf) {
    console.log('GLTF loaded:', gltf);
    console.log('Scene:', gltf.scene);
    scene.add(gltf.scene);
    gltf.scene.scale.set(10, 10, 10);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('An error happened', error);
  }
);
