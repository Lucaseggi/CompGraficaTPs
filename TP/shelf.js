import * as THREE from 'three';
import { rotateShape } from './shapes';
import keyboardManager from './keys';

const shelfColors = [0xff0000, 0x00ff00];
const shelfMaterial = THREE.MeshNormalMaterial;

class Shelf {
    constructor(scene, gui, params) {
        this.scene = scene;
        this.gui = gui;
        this.params = params;

        this.height = 6;
        this.width = 16;
        this.depth = 2;

        this.rows = 2;
        this.columns = 8;
        
        this.structure = this.buildShelf();
        this.spots = this.calculateSpots();
    }

    buildRods() {
        const rows = new THREE.Group();
        const rodRow = new THREE.Group();
        const rodGeometry = new THREE.BoxGeometry(0.1, this.height, 0.1);
        const rodMaterial = new shelfMaterial({
            color: shelfColors[0],
        });
        const rod = new THREE.Mesh(rodGeometry, rodMaterial);
        rod.position.z = (this.depth) / 2;
        rodRow.add(rod);

        const rodBack = rod.clone();
        rodBack.position.z = -rod.position.z;
        rodRow.add(rodBack);

        for (let i = 0; i <= this.columns; i++) {
            const aRodRow = rodRow.clone();
            
            aRodRow.position.x = - this.width / 2 + i * this.width / this.columns;
            rows.add(aRodRow);
        }

        // for each in this.width

        return rows;
    }

    buildShelves() {
        const shelves = new THREE.Group();
        const changui = 0.4;

        const levelGeometry = new THREE.BoxGeometry(this.width + changui, 0.1, this.depth + changui);
        const levelMaterial = new shelfMaterial({
            color: shelfColors[1],
        });
        const level = new THREE.Mesh(levelGeometry, levelMaterial);
        shelves.add(level);
        level.position.y = this.height * (.5 - .8);

        const level2 = level.clone();
        level2.position.y = this.height * (.5 - .4);
        shelves.add(level2);

        const level3 = level.clone();
        level3.position.y = this.height / 2 - 0.1;
        shelves.add(level3);

        return shelves;
    }

    buildShelf() {
        const rods = this.buildRods();
        const shelves = this.buildShelves();
        const shelf = new THREE.Group();
        shelf.add(rods);
        shelf.add(shelves);
        shelf.position.y = this.height / 2;

        return shelf;
    }

    // Static positions don't align with shelf.
    calculateSpots() {
        const spots = [];

        const spotWidth = this.width / this.columns;
        const startX = -this.width / 2 + spotWidth / 2;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const x = startX + col * spotWidth;
                const y = this.height * (1 - .4 * (row + 1));
                spots.push(new THREE.Vector3(x, y, 0));
            }
        }

        return spots;
    }

    getClosestShelf(forkliftPos) {
        if (!this.spots || this.spots.length === 0) return null;

        let closestSpot = null;
        let minDistance = Infinity;

        for (const spot of this.spots) {
            const distance = forkliftPos.distanceTo(spot);
            if (distance < minDistance) {
                minDistance = distance;
                closestSpot = spot;
            }
        }

        return closestSpot;
    }

    // addMeshToFork(mesh) {
    //     this.currentMesh = mesh;
    //     mesh.position.set(- this.surfaceSide / 2, 0, 0);
    //     this.forkSurface.add(mesh);
    // }

}

export default Shelf;