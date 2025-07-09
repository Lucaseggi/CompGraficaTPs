import * as THREE from 'three';

import BaseMode from './BaseMode.js';
import MAMode from './MAMode.js';

export default class RickMode extends MAMode {
    constructor() {
        super("NGGYU");
    }

    apply(warehouse) {
        super.apply(warehouse);

        const video = document.createElement('video');
        video.src = 'videos/RickRoll.mp4';
        video.loop = true;
        video.muted = true;
        video.play();

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBFormat;

        const geometry = new THREE.PlaneGeometry(warehouse.width * 0.6, warehouse.height);
        const material = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });

        this.rickScreen = new THREE.Mesh(geometry, material);
        this.rickScreen.position.set(- warehouse.width / 2 + 0.2, warehouse.height / 1.6, 0);
        this.rickScreen.rotateY(Math.PI / 2)
        warehouse.structure.add(this.rickScreen);
    }

    update(warehouse, deltaTime) {
        super.update(warehouse, deltaTime);
    }

    dispose(warehouse) {
        super.dispose(warehouse);

        if (this.rickScreen) {
            warehouse.structure.remove(this.rickScreen);
            this.rickScreen.dispose?.();
            this.rickScreen = null;
        }

    }

}