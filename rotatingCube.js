import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const camera2 = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const colors = [ 0x845ec2, 0xd65db1, 0xff6f91, 0xff9671, 0xffc75f, 0xf9f871];
const grayscaleColors = [0x111111, 0x333333, 0x555555, 0x777777, 0x999999, 0xBBBBBB];

function createMaterials(colorArray) {
    return colorArray.map(color => new THREE.MeshBasicMaterial({ color }));
}

const cube = new THREE.Mesh( geometry, createMaterials(colors));
scene.add( cube );

camera.position.z = 5;
camera2.position.z = 2;

let greyscale = false
window.addEventListener('click', () => {
    console.log("sus")

    greyscale = !greyscale
    cube.material = createMaterials(greyscale ? grayscaleColors : colors)
})


let cam = camera

const keys = {};
window.addEventListener("keydown", (event) => {
    keys[event.key] = true;

    if (keys["ArrowUp"]) cam = camera2
    if (keys["ArrowDown"]) cam = camera

});

window.addEventListener("keyup", (event) => {
    delete keys[event.key];
});

let frame = 0
function animate() {

    if (Object.keys(keys).length === 0) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    } else {
        const rotationSpeed = 0.05;
        if (keys["ArrowUp"]) cube.rotation.x -= rotationSpeed;
        if (keys["ArrowDown"]) cube.rotation.x += rotationSpeed;
        if (keys["ArrowLeft"]) cube.rotation.y -= rotationSpeed;
        if (keys["ArrowRight"]) cube.rotation.y += rotationSpeed;
    }
    // if (!(frame++ % 10)) 
    renderer.render( scene, cam );

}