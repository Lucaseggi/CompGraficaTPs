import * as THREE from 'three';
import { ModeRegistry } from './modes/ModeRegistry';

const WarehouseMaterial = THREE.MeshStandardMaterial;

function loadRepeatingTexture(path, repeatX = 1, repeatY = 1) {
    return new THREE.TextureLoader().load(path, texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);
    });
}

const textureFolder = '/textureMaps'
const materialBaseFile = '/CorrugatedMetalPanel02_1K_BaseColor.png'
const materialNormalFile = '/CorrugatedMetalPanel02_1K_Normal.png'

const materialMap = loadRepeatingTexture(textureFolder + materialBaseFile, 4, 1);
const materialNormal = loadRepeatingTexture(textureFolder + materialNormalFile, 4, 1);

const ceilMaterialMap = loadRepeatingTexture(textureFolder + materialBaseFile, 4, 0.1);
const ceilMaterialNormal = loadRepeatingTexture(textureFolder + materialNormalFile, 4, 0.1);

const floorMaterialBaseFile = '/StoneTilesFloor01_1K_BaseColor.png'
const floorMaterialNormalFile = '/StoneTilesFloor01_1K_Normal.png'

const floorRepeatX = 9;
const floorRepeatY = floorRepeatX / 3 * 2;

const floorMaterialMap = loadRepeatingTexture(textureFolder + floorMaterialBaseFile, floorRepeatX, floorRepeatY);
const floorMaterialNormal = loadRepeatingTexture(textureFolder + floorMaterialNormalFile, floorRepeatX, floorRepeatY);

class Warehouse {
    constructor() {
        this.height = 20;
        this.width = 60;
        this.depth = 40;

        this.structure = this.buildWarehouse();

        this.activeMode = null;
        this.applyMode(ModeRegistry["BaseMode"]?.());
    }

    buildLamp() {
        const lamp = new THREE.Group();

        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5);
        const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 2.5;
        lamp.add(pole);

        const headGeometry = new THREE.ConeGeometry(1, 1, 32, 4, true);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, side: THREE.DoubleSide });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        lamp.add(head);

        const bulbGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.2)
        const bulbMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: new THREE.Color(0xffffaa),
            emissiveIntensity: 5,
            metalness: 0,
            roughness: 0.2
        });
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
        lamp.add(bulb);
        bulb.position.set(0, -0.3, 0)

        const spotLight = new THREE.SpotLight(0xffffff, 30, this.height * 2, Math.PI / 5, 0.6, 0.8);
        const spotLightHelper = new THREE.SpotLightHelper(spotLight);
        spotLight.position.set(0, 0, 0)
        spotLight.target.position.set(0, -1, 0);

        lamp.add(spotLight);
        // lamp.add(spotLightHelper);
        lamp.add(spotLight.target);

        lamp.userData.spotLight = spotLight;
        return lamp;
    }

    buildStandingLamp() {
        const lamp = new THREE.Group();

        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5);
        const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.rotation.z = - Math.PI/2
        pole.position.x = - 2.7;
        lamp.add(pole);

        const headGeometry = new THREE.ConeGeometry(1, 1, 32, 4, true);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, side: THREE.DoubleSide });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        lamp.add(head);

        const bulbGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.2)
        const bulbMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: new THREE.Color(0xffffaa),
            emissiveIntensity: 5,
            metalness: 0,
            roughness: 0.2
        });
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
        lamp.add(bulb);
        
        // bulb.position.set(0, -0.3, 0)
        
        const spotLight = new THREE.SpotLight(0xffffff, 30, this.height * 2, Math.PI / 5, 0.6, 0.8);
        const spotLightHelper = new THREE.SpotLightHelper(spotLight);
        spotLight.position.set(0, 0, 0)
        spotLight.target.position.set(0, -1, 0);

        lamp.add(spotLight);
        // lamp.add(spotLightHelper);
        lamp.add(spotLight.target);

        const rotationAngle = Math.PI / 2; 
        lamp.rotation.z += rotationAngle;

        lamp.userData.spotLight = spotLight;
        return lamp;

    }

    buildWarehouse() {
        const warehouse = new THREE.Group();

        const cylinderGeometry = new THREE.CylinderGeometry(this.depth / 2, this.depth / 2, this.width, 4, 1, false, 0, Math.PI);
        const cylinderMaterial = new WarehouseMaterial({ side: THREE.BackSide, map: ceilMaterialMap, normalMap: ceilMaterialNormal });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        warehouse.add(cylinder);

        cylinder.position.y = this.height;
        cylinder.scale.set(0.4, 1, 1);
        cylinder.rotation.z = Math.PI / 2;

        const wmaterial = new WarehouseMaterial({ side: THREE.BackSide, map: materialMap, normalMap: materialNormal });
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

        const rows = 2;
        const cols = 3;

        this.lamps = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const lamp = this.buildLamp();

                this.lamps.push(lamp);
                warehouse.add(lamp);
            }
        }

        this.standingLamps = [];
        const standingLamp1 = this.buildStandingLamp();
        const standingLamp2 = this.buildStandingLamp();
        standingLamp1.position.set(this.width / 3 - 5, 5.4, this.depth / 4);
        standingLamp2.position.set(this.width / 3 - 5, 5.4, - this.depth / 4);
        standingLamp1.rotateX(Math.PI * 2 * 45 / 360)
        standingLamp2.rotateX(- Math.PI * 2 * 45 / 360)
        warehouse.add(standingLamp1);
        warehouse.add(standingLamp2);

        return warehouse;
    }

    applyMode(modeInstance) {
        console.log("mode applied!", modeInstance)
        if (this.activeMode?.dispose) {
            this.activeMode.dispose(this);
        }
        this.activeMode = modeInstance;
        if (this.activeMode?.apply) {
            this.activeMode.apply(this);
        }
    }

    update(deltaTime) {
        if (this.activeMode?.update) {
            this.activeMode.update(this, deltaTime);
        }
    }
}

export default Warehouse;