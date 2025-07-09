import * as THREE from 'three';
import { extrudeShape } from './extrude';
import { extrudeShapeMap, rotateShape, rotateShapeMap, rotateShapeScaleFactorMap } from './shapes';
import { MeshStandardMaterial } from 'three';
import { MeshBasicMaterial } from 'three';

function loadRepeatingTexture(path, repeatX = 1, repeatY = 1) {
    return new THREE.TextureLoader().load(path, texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);
    });
}

const textureFolder = '/textureMaps'

const materialFiles = {
    "Mármol N": "Marble03_1K_BaseColor",
    "Mármol B": "Marble09_1K_BaseColor",
    "Ondulado": "patron3",
    "Círculos 1": "Pattern02_1K_VarA",
    "Círculos 2": "Pattern02_1K_VarB",
    "Círculos 3": "Pattern02_1K_VarC",
    "Diamantes 1": "Pattern05_1K_VarA",
    "Diamantes 2": "Pattern05_1K_VarB",
    "Diamantes 3": "Pattern05_1K_VarC",
    "Madera": "Wood06_1K_BaseColor"
};

const format = '.jpg';
const urls = [
  textureFolder + '/greyRoom1_right' + format,
  textureFolder + '/greyRoom1_left' + format,
  textureFolder + '/greyRoom1_top' + format,
  textureFolder + '/greyRoom1_bottom' + format,
  textureFolder + '/greyRoom1_front' + format,
  textureFolder + '/greyRoom1_back' + format,
];

const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load(urls);

const printerColors = [0xf0f0f0, 0x1e8743, 0x0d015e];
const printerMaterial = THREE.MeshStandardMaterial;

const objectColor = [0x764394, 0x944343, 0x439447, 0x909443, 0x94438d, 0x939443];
const objectMaterial = THREE.MeshStandardMaterial;


class Printer {
    constructor(scene, gui, params) {
        this.scene = scene;
        this.gui = gui;
        this.params = params;

        this.currentMesh = null;
        this.building = false;
        this.unbuilding = false;
        this.objToBuild = null;

        this.baseHeight = 1;
        this.baseWidth = 1.8;
        this.shapeHeight = 2;
        this.endHeight = 3 + this.baseHeight;
        this.rodHeight = this.endHeight + 1;
        this.lidOffset = .4;
        this.lidCurrHeight = this.baseHeight + this.lidOffset;

        this.structure = this.createPrinter();
        this.clipPlane = this.createClipPlane();

        const shapeFolder = gui.addFolder('Impresora');
        shapeFolder.add(params, 'speed', 0.1, 2).name('Vel de imp');
        shapeFolder.add(params, 'height', 0, (this.endHeight - this.baseHeight) / 2.1).name('Altura total');

        const friendlyNames = Object.keys(materialFiles);

        this.selectedTexture = materialFiles["Mármol N"];
        shapeFolder
            .add(params, 'selectedPattern', friendlyNames)
            .name('Patrón')
            .onChange((friendlyName) => {
                const filename = materialFiles[friendlyName];
                this.selectedTexture = filename;
            });

        const revolutionFolder = shapeFolder.addFolder('Revolución');
        const extrusionFolder = shapeFolder.addFolder('Barrido');


        Object.entries(rotateShapeMap).forEach(([key, fn]) => {
            revolutionFolder.add({
                [key]: () => this.unbuildAndBuild(rotateShape, fn(), params, this.clipPlane, key)
            }, key);
        });

        extrusionFolder.add(params, 'rotation', 0, 2 * Math.PI).name('Áng de tors');

        Object.entries(extrudeShapeMap).forEach(([key, fn]) => {
            extrusionFolder.add({
                [key]: () => this.unbuildAndBuild(extrudeShape, fn(), params, this.clipPlane)
            }, key);
        });
    }

    createLight() {
        const lightGroup = new THREE.Group();

        const pointLight = new THREE.PointLight(0xffffff, 2, 20);
        pointLight.castShadow = true; // optional, if you want shadows

        lightGroup.add(pointLight);

        const bulbGeometry = new THREE.SphereGeometry(0.1);
        const bulbMaterial = new THREE.MeshStandardMaterial({
            emissive: new THREE.Color(0xffffaa),
            emissiveIntensity: 5,
            color: 0x000000,
            metalness: 0.1,
            roughness: 0.3
        });

        const bulbMesh = new THREE.Mesh(bulbGeometry, bulbMaterial);
        bulbMesh.position.set(0, 0, 0);

        lightGroup.add(bulbMesh);

        return lightGroup;
    }

    createLid() {
        const lidGroup = new THREE.Group();

        const geometry = new THREE.CylinderGeometry(1.35, 1.35, 0.1, 8);
        const material = new printerMaterial({
            color: printerColors[1],
        });
        const auxmaterial = new printerMaterial({
            color: printerColors[2],
        });

        const lid = new THREE.Mesh(geometry, material);
        lidGroup.add(lid)

        const bgeometry = new THREE.CylinderGeometry(0.1, 0.1, this.baseWidth);
        const barrita = new THREE.Mesh(bgeometry, auxmaterial);
        lidGroup.add(barrita)
        barrita.rotation.x = Math.PI / 2;
        barrita.rotation.z = Math.PI / 2;
        barrita.position.x = 0.9;
        barrita.position.y = 0.2;

        const barrita2 = barrita.clone();
        barrita2.position.y += 0.4;
        lidGroup.add(barrita2)

        const tgeometry = new THREE.BoxGeometry(0.4, 0.8, 0.4);
        const lidBox = new THREE.Mesh(tgeometry, material);
        lidGroup.add(lidBox)
        lidBox.position.y += 0.4;

        const barboxgeometry = new THREE.BoxGeometry(0.4, 0.8, 0.4);
        const barbox = new THREE.Mesh(barboxgeometry, material);
        lidGroup.add(barbox)
        barbox.position.x += this.baseWidth - 0.25;
        barbox.position.y += 0.4;

        const lights = 4;
        const radius = 1.35;
        for (let i = 0; i < lights; i++) {
            const lightGroup = new THREE.Group();
            lightGroup.rotation.y = i / lights * Math.PI * 2 + Math.PI / lights;

            const light = this.createLight();
            lightGroup.add(light)

            light.position.x = radius;
            lidGroup.add(lightGroup);
        }

        this.lid = lidGroup;

        return lidGroup;
    }

    createBase() {
        const baseCurve = () => {
            const points = [];

            points.push(new THREE.Vector3(0, 0));
            points.push(new THREE.Vector3(this.baseWidth, 0));
            points.push(new THREE.Vector3(this.baseWidth, this.baseHeight));
            points.push(new THREE.Vector3(this.baseWidth - 0.1, this.baseHeight + 0.2));
            points.push(new THREE.Vector3(this.baseWidth - 0.4, this.baseHeight + 0.2));
            points.push(new THREE.Vector3(this.baseWidth - 0.5, this.baseHeight));
            points.push(new THREE.Vector3(0, this.baseHeight));

            return points;
        }

        const geometry = rotateShape(baseCurve(), 8);
        const material = new printerMaterial({
            // color: printerColors[0],
            roughness: 0.1,
            envMap: envMap,
            envMapIntensity: 1.0,  // adjust reflection strength
            metalness: 1.0,        // reflection only visible if metalness > 0
        });
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }

    createRod() {
        const rodRadius = 0.12;

        const geometry = new THREE.CylinderGeometry(rodRadius, rodRadius, this.rodHeight);
        const material = new printerMaterial({
            color: printerColors[0],
            roughness: 0.3,
        });
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }

    createClipPlane() {
        const clipPlane = new THREE.Plane(new THREE.Vector3(0, - 1, 0), 0);
        return clipPlane;
    }

    createPrinter() {
        const printerGroup = new THREE.Group();

        const lid = this.createLid();
        printerGroup.add(lid)
        lid.position.y = this.baseHeight + .4;

        const base = this.createBase();
        printerGroup.add(base)

        const rod = this.createRod();
        printerGroup.add(rod)
        rod.position.set(this.baseWidth - 0.26, this.rodHeight / 2);

        // const clipPlane = this.createClipPlane();
        // printerGroup.add(this.createClipPlane())

        return printerGroup;
    }

    isBuilding() {
        return this.building;
    }

    unbuildAndBuild(buildTypeFn, buildFn, params, clipPlane, key) {
        this.unbuilding = true;
        this.building = false;
        this.objToBuild = () => {
            this.buildShape(buildTypeFn, buildFn, params, clipPlane, key);
        };
    }

    buildShape(buildTypeFn, buildFn, params, clipPlane, key) {
        this.removeMesh();

        const geometry = buildTypeFn(buildFn(), 50, this.shapeHeight * params.height, params.rotation);
        // const file = materialFiles[Math.floor(Math.random() * materialFiles.length)];
        const texture = loadRepeatingTexture(`${textureFolder}/${this.selectedTexture}.png`, 0.2, 0.2);
        const material = new objectMaterial({
            // color: objectColor[Math.floor(Math.random() * objectColor.length)],
            clippingPlanes: [clipPlane],
            side: THREE.DoubleSide,
            metalness: 0.8,
            map: texture,
            // wireframe: true
        });
        const mesh = new THREE.Mesh(geometry, material);

        if (buildTypeFn === extrudeShape) {
            mesh.rotation.x = Math.PI / 2;
        }
        if (buildTypeFn === rotateShape) {
            mesh.scale.set(rotateShapeScaleFactorMap[key], rotateShapeScaleFactorMap[key] * params.height, rotateShapeScaleFactorMap[key]);
        }

        mesh.position.y = this.baseHeight;

        this.scene.add(mesh);
        this.currentMesh = mesh;

        this.building = true;

        return mesh;
    }

    getMeshPosition() {
        if (!this.currentMesh) return;

        const worldPosition = new THREE.Vector3();
        this.currentMesh.getWorldPosition(worldPosition);
        return worldPosition;
    }

    removeMesh() {
        if (this.currentMesh) {
            this.scene.remove(this.currentMesh);
            this.currentMesh.geometry.dispose();
            this.currentMesh.material.dispose();
            this.currentMesh = null;
        }
    }

    animate() {
        if (this.unbuilding) {
            this.lidCurrHeight = Math.max(this.baseHeight, this.lidCurrHeight - this.params.speed * 0.1);

            this.clipPlane.constant = this.lidCurrHeight;
            this.lid.position.y = this.lidCurrHeight;

            if (this.clipPlane.constant <= this.baseHeight) {
                console.log("finished unbuilding")
                this.objToBuild();
                this.objToBuild = null;
                this.unbuilding = false;
                this.building = true;
            }
        }

        if (this.building) {
            this.lidCurrHeight = Math.min(this.rodHeight - 0.5, this.lidCurrHeight + this.params.speed * 0.1);

            this.clipPlane.constant = this.lidCurrHeight;
            this.lid.position.y = this.lidCurrHeight;

            if (this.clipPlane.constant >= this.endHeight) {
                this.building = false;
                this.gui.updateDisplay();
            }
        }

    }
}

export default Printer;