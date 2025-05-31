import * as THREE from 'three';
import { buildGrid } from './grid';

const colors = [0xf5f5f5, 0xf5f5f5, 0x2e2e2e];
const WarehouseMaterial = THREE.MeshStandardMaterial;

class Warehouse {
    constructor() {
        this.height = 20;
        this.width = 60;
        this.depth = 40;

        this.structure = this.buildWarehouse();
    }

    buildWarehouse() {
        const warehouse = new THREE.Group();

        const cylinderGeometry = new THREE.CylinderGeometry(this.depth / 2, this.depth / 2, this.width, 4, 1, false, 0, Math.PI);
        const cylinderMaterial = new WarehouseMaterial({ color: colors[0], side: THREE.BackSide });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        warehouse.add(cylinder);

        cylinder.position.y = this.height;
        cylinder.rotation.z = Math.PI / 2;

        const wmaterial = new WarehouseMaterial({ color: colors[1], side: THREE.BackSide });
        const geometries = [
            new THREE.PlaneGeometry(this.width, this.height),
            new THREE.PlaneGeometry(this.width, this.height),
            new THREE.PlaneGeometry(this.depth, this.height),
            new THREE.PlaneGeometry(this.depth, this.height),
        ];

        const wallPos = [
            [0, this.height / 2, this.depth / 2, 0, this.width],
            [0, this.height / 2, -this.depth / 2, Math.PI, this.width],
            [-this.width / 2, this.height / 2, 0, -Math.PI / 2, this.depth],
            [this.width / 2, this.height / 2, 0, Math.PI / 2, this.depth],
        ]

        geometries.map((geom, i) => {
            const wall = new THREE.Mesh(geom, wmaterial);
            const wallGrid = buildGrid(this.height, wallPos[i][4], 1);
            const wallGroup = new THREE.Group();
            wallGroup.add(wall)
            wallGroup.add(wallGrid);

            wallGroup.position.set(wallPos[i][0], wallPos[i][1], wallPos[i][2]);
            wall.rotation.y = wallPos[i][3];
            wallGrid.rotation.z = Math.PI / 2;
            wallGrid.rotation.y = wallPos[(i + 2) % 4][3];

            warehouse.add(wallGroup)
        });
        
        const fmaterial = new WarehouseMaterial({ color: colors[2], side: THREE.BackSide });
        const fgeometry = new THREE.PlaneGeometry(this.width, this.depth);
        const floor = new THREE.Mesh(fgeometry, fmaterial);
        floor.rotation.x = Math.PI / 2;
        warehouse.add(floor);

        const floorGrid = buildGrid(this.width, this.depth);
        warehouse.add(floorGrid);

        return warehouse;
    }

}

export default Warehouse;