import * as THREE from 'three';

export default class BaseMode {
    constructor(name = "BaseMode") {
        this.name = name;
    }

    apply(warehouse) {
        const rows = 2;
        const cols = 3;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const lamp = warehouse.lamps[row * cols + col];
                lamp.position.y = warehouse.height + 2.1;

                lamp.position.x = (col - (cols - 1) / 2) * (warehouse.width * 1.1 / cols);
                lamp.position.z = (row - (rows - 1) / 2) * (warehouse.depth * .6 / rows);
            }
        }
    }

    update(warehouse, deltaTime) {
        // optional override
    }

    dispose(warehouse) {
        // optional override
    }
}