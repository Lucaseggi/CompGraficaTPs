import * as THREE from 'three';

const createCamera = (position, lookAt = new THREE.Vector3(0, 0, 0)) => {
    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.set(...position);
    camera.lookAt(lookAt);
    return camera;
};

const cameras = {
    1: createCamera([0, 1, 6]),         // Diagonal top
    2: createCamera([0, 20, 0]),           // Top-down
    3: createCamera([20, 0, 0]),           // Side
    4: createCamera([0, 5, 20]),           // Front
    5: createCamera([-10, 5, -10]),        // Rear diagonal
    6: createCamera([0, 2, 5]),            // Close-up front
};

export function updateCamera(activeCamera, keyboardManager, forklift) {
    updateCameraToFollowForklift(forklift);

    for (let i = 1; i <= 6; i++) {
        const key = i.toString();
        if (keyboardManager.isJustPressed(key)) {
            activeCamera = cameras[i];
            console.info(`Switched to camera ${i}`);
            return cameras[i];
        }
    }
    return activeCamera;
}

const forkliftCameras = {
    driverOffset: new THREE.Vector3(3.2, 2.6, 0),
    sideOffset: new THREE.Vector3(2, 2, -8),
    backOffset: new THREE.Vector3(7, 5, 0)   
}


export function updateCameraToFollowForklift(forklift) {
    const forkPos = forklift.getForkliftPosition();

    // Get the forklift's world rotation quaternion
    const forkliftQuat = new THREE.Quaternion();
    forklift.structure.getWorldQuaternion(forkliftQuat);

    function getRotatedCamPos(offset) {
        const rotatedOffset = offset.clone().applyQuaternion(forkliftQuat);
        return forkPos.clone().add(rotatedOffset);
    }

    // Camera 4 — Driver View with horizontal lookAt
    const driverOffset = forkliftCameras["driverOffset"];
    cameras[4].position.copy(getRotatedCamPos(driverOffset));

    const target4 = forkPos.clone();
    target4.y = cameras[4].position.y;
    cameras[4].lookAt(target4);

    // Camera 5 — Side View
    const sideOffset = forkliftCameras["sideOffset"];
    cameras[5].position.copy(getRotatedCamPos(sideOffset));

    const target5 = forkPos.clone();
    target5.y = cameras[5].position.y;
    cameras[5].lookAt(target5);

    // Camera 6 — Back View
    const backOffset = forkliftCameras["backOffset"];
    cameras[6].position.copy(getRotatedCamPos(backOffset));
    cameras[6].lookAt(forkPos);
}

export default cameras;