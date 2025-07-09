import * as THREE from 'three';

import BaseMode from './BaseMode.js';

export default class MAMode extends BaseMode {
    constructor() {
        super("MA");
        this.lights = [];
    }

    apply(warehouse) {
        this.angle = 0;
        this.lamps = warehouse.lamps;

        // Set all spotlights to colored and rotating
        this.colors = [0xff0000, 0x00ff00, 0x0000ff];

        this.lamps.forEach((lamp, i) => {
            const spot = lamp.userData.spotLight;
            if (spot) {
                spot.color.setHex(this.colors[i % this.colors.length]);
                spot.intensity = 30;
            }
        });
    }

    update(warehouse, deltaTime) {
        this.angle = (this.angle ?? 0) + deltaTime;

        const radius = 2;
        const speed = 1;

        this.lamps.forEach((lamp, i) => {
            const spot = lamp.userData.spotLight;
            if (spot) {
                const offset = (i / this.lamps.length) * Math.PI * 2;

                // Move lamp group position in a circle on XZ plane
                const lampX = Math.cos(this.angle * speed + offset) * radius;
                const lampZ = Math.sin(this.angle * speed + offset) * radius;
                lamp.position.x = lampX;
                lamp.position.z = lampZ;

                // Move spotlight target relative to the lamp's new position
                // Here the target moves around the lamp a bit
                const targetRadius = 1;
                const targetX = Math.cos(this.angle * speed * 2 + offset) * targetRadius;
                const targetZ = Math.sin(this.angle * speed * 2 + offset) * targetRadius;
                spot.target.position.set(targetX, -1, targetZ);
                spot.target.updateMatrixWorld();
            }
        });
    }

    dispose(warehouse) {
        this.lamps.forEach((lamp) => {
            const spot = lamp.userData.spotLight;
            if (spot) {
                spot.color.setHex(0xffffff);
                spot.intensity = 30;
                spot.target.position.set(0, -1, 0);
                spot.target.updateMatrixWorld();
            }
        });
    }

}