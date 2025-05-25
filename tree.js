import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

camera.position.set(0, 0, 6);

let treeGroup = new THREE.Group();
scene.add(treeGroup);

let depth = 3; 

const controls = new OrbitControls( camera, renderer.domElement );

function buildTree(level, length = 1, thickness = 0.1) {
    if (level <= 0) return;

    const group = new THREE.Group();

    if (level === 1) {
        const leaf = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshPhongMaterial({ color: 0x00ff00 })
        );

        leaf.rotation.z = Math.PI / 4;
        leaf.rotation.x = Math.PI / 4;
        
        leaf.position.y = length;
        group.add(leaf);
        group.scale.set(thickness * 20 * 0.3, thickness * 20, thickness * 20 * 0.3);

        return group;
    }

    const branch = new THREE.Mesh(
        new THREE.CylinderGeometry(thickness * 0.8, thickness, length, 8),
        new THREE.MeshBasicMaterial({ color: 0x8B4513 }) // brown
    );
    branch.position.y = length / 2;
    group.add(branch);

    const child1 = buildTree(level - 1, length * 0.75, thickness * 0.7);
    const child2 = buildTree(level - 1, length * 0.75, thickness * 0.7);
    const child3 = buildTree(level - 1, length * 0.75, thickness * 0.7);

    child1.rotation.z = Math.PI / 6;
    child2.rotation.z = Math.PI / 6;
    child3.rotation.z = Math.PI / 6;

    child2.rotation.y = 4 * Math.PI / 6;
    child3.rotation.y = 9 * Math.PI / 6;

    child1.position.y = length;
    child2.position.y = length;
    child3.position.y = length/2;
    

    group.add(child1);
    group.add(child2);
    group.add(child3);

    return group;
}

function updateTree() {
    scene.remove(treeGroup);
    treeGroup = buildTree(depth);
    scene.add(treeGroup);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        if (depth < 7) {
        depth++;
        updateTree();
        }
    } else if (e.key === 'ArrowDown') {
        if (depth > 1) {
            depth--;
            updateTree();
        }
    }
});

updateTree();

const size = 10;
const divisions = 10;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.z = 3
scene.add(directionalLight)

function animate() {
    controls.update();

    renderer.render(scene, camera);
}