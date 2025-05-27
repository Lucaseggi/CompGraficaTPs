import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

class CameraManager {
    constructor(printer, forklift, shelf, keyboardManager, renderer) {        
        printer.structure.updateMatrixWorld(true);
        const printerWorldPosition = new THREE.Vector3();
        printer.structure.getWorldPosition(printerWorldPosition);
        
        shelf.structure.updateMatrixWorld(true);
        const shelfWorldPosition = new THREE.Vector3();
        shelf.structure.getWorldPosition(shelfWorldPosition);

        forklift.structure.updateMatrixWorld(true);
        const forkliftWorldPosition = new THREE.Vector3();
        forklift.structure.getWorldPosition(forkliftWorldPosition);

        this.cameras = {
            1: this.createCamera([-4, 8, 12]),
            2: this.createCamera([-6, 6, 8], printerWorldPosition),     
            3: this.createCamera([10, 6, 10], shelfWorldPosition),       
            4: this.createCamera([0, 0, 0]),              
            5: this.createCamera([0, 0, 0]),               
            6: this.createCamera([0, 0, 0]),
        };

        this.forkliftCameras = {
            driverOffset: new THREE.Vector3(1.4, 3.2, 0),
            sideOffset: new THREE.Vector3(0, 2, -8),
            backOffset: new THREE.Vector3(5, 5, 0)
        };

        this.renderer = renderer;
        this.controls = {
            1: this.createControls(1, forkliftWorldPosition),
            2: this.createControls(2, printerWorldPosition),
            3: this.createControls(3, shelfWorldPosition),
        }

        this.forklift = forklift;
        this.keyboardManager = keyboardManager;

        this.activeCamera = this.cameras[1];
    }

    createCamera(position, lookAt = new THREE.Vector3(0, 0, 0)) {
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(...position);
        camera.lookAt(lookAt.position || lookAt);
        return camera;
    }

    updateCamera() {
        this.updateFollowCameras();

        if (this.keyboardManager.isPressed('O')) {
            this.zoomActiveCamera('in');
        }
        if (this.keyboardManager.isPressed('P')) {
            this.zoomActiveCamera('out');
        }

        for (let i = 1; i <= 6; i++) {
            const key = i.toString();
            if (this.keyboardManager.isJustPressed(key)) {
                this.activeCamera = this.cameras[i];
                console.info(`Switched to camera ${i}`);
                return this.cameras[i];
            }
        }
        return this.activeCamera;
    }

    createControls(i, target = new THREE.Vector3(0, 0, 0)) {
        const controls = new OrbitControls(this.cameras[i], this.renderer.domElement);
        controls.target.copy(target);
        controls.update();                    
        return controls;
    }
    
    updateControls() {
        for (const i in this.controls) {
            const control = this.controls[i];
            control.enabled = (this.cameras[i] === this.activeCamera);
            if (control.enabled) {
                control.update();
            }
        }
    }

    updateFollowCameras() {
        const forkPos = this.forklift.getForkliftPosition();
        const forkliftQuat = new THREE.Quaternion();
        this.forklift.structure.getWorldQuaternion(forkliftQuat);

        const getRotatedCamPos = (offset) =>
            forkPos.clone().add(offset.clone().applyQuaternion(forkliftQuat));

        // Camera 4 — Driver View
        const driverOffset = this.forkliftCameras.driverOffset;
        const cam4 = this.cameras[4];
        cam4.position.copy(getRotatedCamPos(driverOffset));
        const target4 = forkPos.clone();
        target4.y = cam4.position.y * 0.9;
        cam4.lookAt(target4);

        // Camera 5 — Side View
        const cam5 = this.cameras[5];
        cam5.position.copy(getRotatedCamPos(this.forkliftCameras.sideOffset));
        const target5 = forkPos.clone();
        target5.y = cam5.position.y;
        cam5.lookAt(target5);

        // Camera 6 — Back View
        const cam6 = this.cameras[6];
        cam6.position.copy(getRotatedCamPos(this.forkliftCameras.backOffset));
        const target6 = forkPos.clone();
        target6.y = cam6.position.y / 2;
        cam6.lookAt(target6);
    }

    getActiveCamera() {
        return this.activeCamera;
    }

    getActiveCameraIndex() {
        return Object.entries(this.cameras).find(([i, cam]) => cam === this.activeCamera)?.[0];
    }

    zoomActiveCamera(direction) {
        const controls = this.controls[this.getActiveCameraIndex()];
        const camera = this.activeCamera;

        const zoomFactor = 0.98;
        const factor = direction === 'in' ? zoomFactor : 1 / zoomFactor;

        const toTarget = new THREE.Vector3().subVectors(controls.target, camera.position);
        toTarget.multiplyScalar(1 - factor);
        camera.position.add(toTarget);
        controls.update();
    }

}

export default CameraManager;
