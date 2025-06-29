import * as THREE from 'three';

const WarehouseMaterial = THREE.MeshStandardMaterial;

const textureFolder = '/textureMaps'
const materialBaseFile = '/CorrugatedMetalPanel02_1K_BaseColor.png'
const materialNormalFile = '/CorrugatedMetalPanel02_1K_Normal.png'

const materialMap = new THREE.TextureLoader().load(textureFolder + materialBaseFile, texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
});
const materialNormal = new THREE.TextureLoader().load(textureFolder + materialNormalFile);

const floorMaterialBaseFile = '/StoneTilesFloor01_1K_BaseColor.png'
const floorMaterialNormalFile = '/StoneTilesFloor01_1K_Normal.png'

const floorRepeatX = 9;
const floorRepeatY = floorRepeatX / 3 * 2;


const floorMaterialMap = new THREE.TextureLoader().load(textureFolder + floorMaterialBaseFile, texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(floorRepeatX, floorRepeatY);
});
const floorMaterialNormal = new THREE.TextureLoader().load(textureFolder + floorMaterialNormalFile, texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(floorRepeatX, floorRepeatY);
});


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
        const cylinderMaterial = new WarehouseMaterial({ side: THREE.BackSide, map: materialMap});
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        warehouse.add(cylinder);

        cylinder.position.y = this.height;
        cylinder.rotation.z = Math.PI / 2;

        const wmaterial = new WarehouseMaterial({side: THREE.BackSide, map: materialMap});
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
            const wallGroup = new THREE.Group();
            wallGroup.add(wall)

            wallGroup.position.set(wallPos[i][0], wallPos[i][1], wallPos[i][2]);
            wall.rotation.y = wallPos[i][3];

            warehouse.add(wallGroup)
        });
        
        const fmaterial = new WarehouseMaterial({ side: THREE.BackSide, map: floorMaterialMap, normalMap: floorMaterialNormal });
        const fgeometry = new THREE.PlaneGeometry(this.width, this.depth);
        const floor = new THREE.Mesh(fgeometry, fmaterial);
        floor.rotation.x = Math.PI / 2;
        warehouse.add(floor);

        return warehouse;
    }

}

export default Warehouse;