import * as THREE from 'three';
import { extrudeShape } from './extrude';
import { extrudeShapeMap, rotateShape, rotateShapeMap, rotateShapeScaleFactorMap } from './shapes';
import { MeshStandardMaterial } from 'three';
import { MeshBasicMaterial } from 'three';

const printerColors = [0xff0000];
const printerMaterial = THREE.MeshNormalMaterial;

class Printer {
    constructor(scene, gui, params) {
        this.scene = scene;
        this.gui = gui;
        this.params = params;

        this.currentMesh = null;
        this.building = false;
        this.startTime = null;

        this.baseHeight = 1;
        this.baseWidth = 1.8;
        this.endHeight = 2;
        this.shapeHeight = this.endHeight - 0.05;

        this.lid = this.createLid();
        this.base = this.createBase();
        this.rod = this.createRod();
        this.clipPlane = this.createClipPlane();

        const shapeFolder = gui.addFolder('Shapes');
        Object.entries(rotateShapeMap).forEach(([key, fn]) => {
            shapeFolder.add({
                [key]: () => {
                    const mesh = this.buildShape(rotateShape, fn(), params, this.clipPlane, key);
                    scene.add(mesh)
                    return mesh;
                }
            }, key);
        });

        shapeFolder.add(params, 'rotation', - 2 * Math.PI, 2 * Math.PI).name('Rotation');

        Object.entries(extrudeShapeMap).forEach(([key, fn]) => {
            shapeFolder.add({
                [key]: () => {
                    const mesh = this.buildShape(extrudeShape, fn(), params, this.clipPlane);
                    scene.add(mesh)
                    return mesh;
                }
            }, key);
        });
    }

    createLid() {
        const geometry = new THREE.CircleGeometry(0.8);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide,
        });
        const lid = new THREE.Mesh(geometry, material);
        lid.rotation.x = Math.PI / 2;

        return lid;
    }

    createBase() {
        const  baseCurve = () => {
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
        const rodHeight = 4;
        const rodRadius = 0.1;

        const geometry = new THREE.CylinderGeometry(rodRadius, rodRadius, rodHeight);
        const material = new printerMaterial({
            color: printerColors[0],
        });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(this.baseWidth - 0.26, rodHeight/2);

        return mesh;
    }

    createClipPlane() {
        const clipPlane = new THREE.Plane(new THREE.Vector3(0, - 1, 0), 0);
        return clipPlane;
    }

    createPrinter() {
        const printerGroup = new THREE.Group();

        const lid = this.createLid();
        printerGroup.add(this.createLid())

        const base = this.createBase();
        printerGroup.add(this.createBase())

        const rod = this.createRod();
        printerGroup.add(this.createRod())

        const clipPlane = this.createClipPlane();
        printerGroup.add(this.createClipPlane())

        return printerGroup;
    }

    isBuilding() {
        return this.building;
    }

    buildShape(buildTypeFn, buildFn, params, clipPlane, key) {
        if (this.currentMesh) {
            this.scene.remove(this.currentMesh);
            this.currentMesh.geometry.dispose();
            this.currentMesh.material.dispose();
            this.currentMesh = null;
        }

        const geometry = buildTypeFn(buildFn(), 50, this.shapeHeight, params.rotation);
        const material = new THREE.MeshNormalMaterial({
            color: 0xffcc00,
            clippingPlanes: [clipPlane],
        });
        const mesh = new THREE.Mesh(geometry, material);

        if (buildTypeFn === extrudeShape) {
            mesh.rotation.x = Math.PI / 2;
        }
        if (buildTypeFn === rotateShape) {
            mesh.scale.set(rotateShapeScaleFactorMap[key], rotateShapeScaleFactorMap[key], rotateShapeScaleFactorMap[key]);
        }

        this.scene.add(mesh);
        this.currentMesh = mesh;

        this.building = true;
        this.startTime = performance.now();

        return mesh;
    }

    animate() {
        if (!this.building) return;

        const now = performance.now();
        const elapsed = (now - this.startTime) / 1000;

        this.clipPlane.constant = Math.min(this.endHeight, (elapsed * this.params.speed) * this.endHeight);
        this.lid.position.y = Math.min(this.endHeight, (elapsed * this.params.speed) * this.endHeight);

        if (this.clipPlane.constant >= this.endHeight) {
            this.building = false;
            this.gui.updateDisplay();
        }
    }
}

export default Printer;