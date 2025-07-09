import * as THREE from 'three';
import BaseMode from './BaseMode';

export default class KrustyMode extends BaseMode {
    constructor() {
        super("KrustyKrabTheme");
        this.time = 0;
        this.speed = 0.5; // Adjust for faster or slower color cycling
    }

    apply(warehouse) {
        super.apply(warehouse);
        this.lamps = warehouse.lamps;

        this.baseHueOffsets = this.lamps.map((_, i) => i * 0.2); // Offset per lamp

        this.ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white
        warehouse.structure.add(this.ambientLight);
    }

    update(warehouse, deltaTime) {
        this.time += deltaTime * this.speed;

        this.lamps.forEach((lamp, i) => {
            const spot = lamp.userData.spotLight;
            if (spot) {
                const hue = (this.time + this.baseHueOffsets[i]) % 1.0;
                const color = new THREE.Color().setHSL(hue, 1.0, 0.5);
                spot.color.copy(color);
            }
        });
    }

    dispose(warehouse) {
        // Optionally reset light colors or states if needed
        this.lamps.forEach(lamp => {
            const spot = lamp.userData.spotLight;
            if (spot) spot.color.set(0xffffff);
        });

        if (this.ambientLight) {
            warehouse.structure.remove(this.ambientLight);
            this.ambientLight.dispose?.();
            this.ambientLight = null;
        }
    }
}
