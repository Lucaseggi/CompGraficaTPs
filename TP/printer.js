import * as THREE from 'three';
import { extrudeShape } from './extrude';
import { extrudeShapeMap, rotateShape, rotateShapeMap, rotateShapeScaleFactorMap } from './shapes';
import { MeshStandardMaterial } from 'three';
import { MeshBasicMaterial } from 'three';

const printerColors = [0x808080, 0x1e8743, 0x0d015e];
const printerMaterial = THREE.MeshStandardMaterial;

const objectColor = [0x858585];
const objectMaterial = THREE.MeshStandardMaterial;


class Printer {
    constructor(scene, gui, params) {
        this.scene = scene;
        this.gui = gui;
        this.params = params;

        this.currentMesh = null;
        this.building = false;
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

        const shapeFolder = gui.addFolder('Shapes');

        shapeFolder.add(params, 'height', 0, (this.endHeight - this.baseHeight) / 2.1).name('Height');

        Object.entries(rotateShapeMap).forEach(([key, fn]) => {
            shapeFolder.add({
                [key]: () => this.unbuildAndBuild(rotateShape, fn(), params, this.clipPlane, key)
            }, key);
        });

        shapeFolder.add(params, 'rotation', 0, 2 * Math.PI).name('Rotation');

        Object.entries(extrudeShapeMap).forEach(([key, fn]) => {
            shapeFolder.add({
                [key]: () => this.unbuildAndBuild(extrudeShape, fn(), params, this.clipPlane)
            }, key);
        });
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
            color: printerColors[0],
        });
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;        
    }

    createRod() {
        const rodRadius = 0.12;

        const geometry = new THREE.CylinderGeometry(rodRadius, rodRadius, this.rodHeight);
        const material = new printerMaterial({
            color: printerColors[0],
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
        this.objToBuild = () => {
            this.buildShape(buildTypeFn, buildFn, params, clipPlane, key);
        };
    }

    buildShape(buildTypeFn, buildFn, params, clipPlane, key) {
        this.removeMesh();

        const geometry = buildTypeFn(buildFn(), 50, this.shapeHeight * params.height, params.rotation);
        const material = new objectMaterial({
            color: objectColor[0],
            clippingPlanes: [clipPlane],
            side: THREE.DoubleSide,
            metalness: 0.8
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
        if (this.objToBuild) {
            this.lidCurrHeight = Math.max(this.baseHeight, this.lidCurrHeight - this.params.speed * 0.1);

            this.clipPlane.constant = this.lidCurrHeight;
            this.lid.position.y = this.lidCurrHeight;

            if (this.clipPlane.constant <= this.baseHeight) {
                this.objToBuild();
                this.objToBuild = null;
            }            
        }

        if (!this.building) return;

        this.lidCurrHeight = Math.min(this.rodHeight - 0.5, this.lidCurrHeight + this.params.speed * 0.1);

        this.clipPlane.constant = this.lidCurrHeight;
        this.lid.position.y = this.lidCurrHeight;

        if (this.clipPlane.constant >= this.endHeight) {
            this.building = false;
            this.gui.updateDisplay();
        }
    }
}

export default Printer;