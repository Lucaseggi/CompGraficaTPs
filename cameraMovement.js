import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const keys = {};
window.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
    delete keys[event.key];
});


export function focusCameraOnPointAndMove(camera, point) {
        if (Object.keys(keys).length != 0) {
            const rotationSpeed = 0.05;
            if (keys["ArrowUp"]) camera.position.y += rotationSpeed;
            if (keys["ArrowDown"]) camera.position.y -= rotationSpeed;
            if (keys["ArrowLeft"]) camera.position.x -= rotationSpeed;
            if (keys["ArrowRight"]) camera.position.x += rotationSpeed;
            camera.lookAt(point);
        }
}

export function focusCameraOnPointAndRotate(camera, point) {
    const rotationSpeed = 0.05;
    
    const xAxis = new THREE.Vector3(point.x, 0, 0);
    const yAxis = new THREE.Vector3(0, point.y, 0);
    camera.rotateOnAxis(xAxis, -rotationSpeed);

    if (Object.keys(keys).length != 0) {
        console.log("e");

        if (keys["ArrowUp"]) camera.rotateOnAxis(xAxis, -rotationSpeed);
        if (keys["ArrowDown"]) camera.rotateOnAxis(xAxis, rotationSpeed);
        if (keys["ArrowLeft"]) camera.position.x -= rotationSpeed;
        if (keys["ArrowRight"]) camera.position.x += rotationSpeed;
        camera.lookAt(point);
    }
}

export function orbitCamera(camera, point) {
    const rotationSpeed = 0.05;
    
    const xAxis = new THREE.Vector3(point.x, 0, 0);
    const yAxis = new THREE.Vector3(0, point.y, 0);
    camera.rotateOnAxis(xAxis, -rotationSpeed);

    if (Object.keys(keys).length != 0) {
        console.log("e");

        if (keys["ArrowUp"]) camera.rotateOnAxis(xAxis, -rotationSpeed);
        if (keys["ArrowDown"]) camera.rotateOnAxis(xAxis, rotationSpeed);
        if (keys["ArrowLeft"]) camera.position.x -= rotationSpeed;
        if (keys["ArrowRight"]) camera.position.x += rotationSpeed;
        camera.lookAt(point);
    }
}