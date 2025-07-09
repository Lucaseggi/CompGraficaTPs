import * as THREE from 'three';
import BaseMode from './BaseMode.js';

export default class BoneMode extends BaseMode {
    constructor() {
        super("BadToTheBone");
        this.time = 0;
        this.speed = 2.5; // brightness pulse speed
        this.minIntensity = 5;
        this.maxIntensity = 30;

        this.stateTime = 0;
        this.state = 0; // 0 = pulse only, 1 = pulse + rotate normal, 2 = rotate fast + converge

        this.moveRadius = 2;
        this.normalSpeed = 1;
        this.fastSpeed = 5;
        this.convergeDuration = 3; // seconds to converge to center
        this.convergeProgress = 0;
    }

    apply(warehouse) {
        this.lamps = warehouse.lamps;

        this.lamps.forEach(lamp => {
            const spot = lamp.userData.spotLight;
            if (spot) {
                spot.color.set(0xffffff);
                spot.intensity = (this.minIntensity + this.maxIntensity) / 2;
                // spot.target.position.set(this.moveRadius, -1, 0); // initial target position on circle
                spot.target.updateMatrixWorld();
            }
        });

        this.stateTime = 0;
        this.state = 0;
        this.convergeProgress = 0;

        this.ambientLight = new THREE.AmbientLight(0x404040, 0.4); // soft white
        warehouse.structure.add(this.ambientLight);
    }

    update(warehouse, deltaTime) {
        this.time += deltaTime * this.speed;
        this.stateTime += deltaTime;

        // Pulsing brightness
        const pulse = (Math.sin(this.time) + 1) / 2; // [0,1]
        const intensity = this.minIntensity + pulse * (this.maxIntensity - this.minIntensity);

        this.lamps.forEach(lamp => {
            const spot = lamp.userData.spotLight;
            if (spot) {
                spot.intensity = intensity;
            }
        });

        if (this.state === 1 || this.state === 2) {
            const speed = (this.state === 1) ? this.normalSpeed : this.fastSpeed;

            this.lamps.forEach((lamp, i) => {
                const spot = lamp.userData.spotLight;
                if (spot) {
                    let x, z;
                    const offset = (i * Math.PI * 2) / this.lamps.length;

                    if (this.state === 1) {
                        // Rotate normally on circle radius
                        x = Math.cos(this.stateTime * speed + offset) * this.moveRadius;
                        z = Math.sin(this.stateTime * speed + offset) * this.moveRadius;
                    } else if (this.state === 2) {
                        // Rotate faster and converge to center
                        // Increase convergeProgress from 0 to 1 over convergeDuration seconds
                        this.convergeProgress = Math.min(this.convergeProgress + deltaTime / this.convergeDuration, 1);

                        // Radius shrinks from moveRadius to 0
                        const radius = this.moveRadius * (1 - this.convergeProgress);

                        x = Math.cos(this.stateTime * speed + offset) * radius;
                        z = Math.sin(this.stateTime * speed + offset) * radius;
                    }

                    spot.target.position.set(x, -1, z);
                    spot.target.updateMatrixWorld();
                }
            });
        }

        // State transitions cycling in loop
        if (this.state === 0 && this.stateTime >= 4) {
            this.state = 1;
            this.stateTime = 0;
        } else if (this.state === 1 && this.stateTime >= 7) {
            this.state = 2;
            this.stateTime = 0;
            this.convergeProgress = 0; // reset converge progress for next cycle
        } else if (this.state === 2 && this.stateTime >= 4) {
            this.state = 0;
            this.stateTime = 0;
        }

    }

    dispose(warehouse) {
        this.lamps.forEach(lamp => {
            const spot = lamp.userData.spotLight;
            if (spot) {
                spot.intensity = 20;
                spot.color.set(0xffffff);
                spot.target.position.set(0, -1, 0);
                spot.target.updateMatrixWorld();
            }
        });

        if (this.ambientLight) {
            warehouse.structure.remove(this.ambientLight);
            this.ambientLight.dispose?.();
            this.ambientLight = null;
        }
    }
}
