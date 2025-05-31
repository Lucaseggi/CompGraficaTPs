import * as THREE from 'three';
import { rotateShape } from './shapes';
import keyboardManager from './keys';

const forkliftColors = [0xf0c94a, 0xb30000, 0x1f2236, 0x73bfc9, 0xa724ad, 0xA0522D];
const forkliftMaterial = THREE.MeshStandardMaterial;

class Forklift {
    constructor(scene, gui, params) {
        this.scene = scene;
        this.gui = gui;
        this.params = params;

        this.chassisWidth = 4;
        this.chassisHeight = 1.6;
        this.chassisDepth = 2;

        this.forkHeight = 6;
        this.surfaceSide = 2;

        this.wheels = [];
        this.structure = this.buildForklift();
    }

    buildShape(points, depth, color) {
        const shape = new THREE.Shape(points);

        const extrudeSettings = {
            depth: depth,
            bevelEnabled: false,
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new forkliftMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = - depth / 2;

        return mesh;
    }

    buildChassis() {
        const chassisCurve = () => {
            const points = [];

            const distanceToEdge = Math.min(this.chassisWidth, this.chassisHeight) / 2 - 0.3;

            points.push(new THREE.Vector3(distanceToEdge, 0));
            points.push(new THREE.Vector3(this.chassisWidth - distanceToEdge, 0));
            points.push(new THREE.Vector3(this.chassisWidth, distanceToEdge));
            points.push(new THREE.Vector3(this.chassisWidth, this.chassisHeight - distanceToEdge));
            points.push(new THREE.Vector3(this.chassisWidth - distanceToEdge, this.chassisHeight));
            points.push(new THREE.Vector3(distanceToEdge, this.chassisHeight));
            points.push(new THREE.Vector3(0, this.chassisHeight - distanceToEdge));
            points.push(new THREE.Vector3(0, distanceToEdge));
            points.push(new THREE.Vector3(distanceToEdge, 0));

            return points;
        }

        return this.buildShape(chassisCurve(), this.chassisDepth, forkliftColors[0]);
    }

    buildSeat() {
        const seatCurve = () => {
            const points = [];

            points.push(new THREE.Vector3(0, 0));
            points.push(new THREE.Vector3(this.chassisWidth / 8, 0));
            points.push(new THREE.Vector3(this.chassisWidth / 8, this.chassisHeight * 0.8));
            points.push(new THREE.Vector3(this.chassisWidth / 8 * 0.8, this.chassisHeight * 0.8));
            points.push(new THREE.Vector3(0, 0));

            return points;
        }

        return this.buildShape(seatCurve(), this.chassisDepth * 0.7, forkliftColors[0]);
    }

    buildBrakes() {
        const brakeCurve = () => {
            const points = [];

            points.push(new THREE.Vector3(0, 0));
            points.push(new THREE.Vector3(this.chassisWidth / 8, 0));
            points.push(new THREE.Vector3(this.chassisWidth / 8 * 0.5, this.chassisHeight * 0.2));
            points.push(new THREE.Vector3(0, this.chassisHeight * 0.15));
            points.push(new THREE.Vector3(0, 0));

            return points;
        }

        return this.buildShape(brakeCurve(), this.chassisDepth * 0.7, forkliftColors[1]);
    }

    buildWheel() {
        const wheelCurve = () => {
            const points = [];

            const wheelRadius = this.chassisHeight / 2 * 0.9;
            const wheelThickness = 0.4;

            points.push(new THREE.Vector3(0, 0));
            points.push(new THREE.Vector3(wheelRadius, 0));
            points.push(new THREE.Vector3(wheelRadius, wheelThickness));
            points.push(new THREE.Vector3(wheelRadius - 0.1, wheelThickness));
            points.push(new THREE.Vector3(wheelRadius - 0.2, wheelThickness - 0.2));
            points.push(new THREE.Vector3(0, wheelThickness - 0.2));

            return points;
        }

        const geometry = rotateShape(wheelCurve(), 20);
        const material = new forkliftMaterial({
            color: forkliftColors[2],
            roughness: 0.3,      
        });
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }

    buildFork() {
        const forkGroup = new THREE.Group();

        const rodGeometry = new THREE.BoxGeometry(0.1, this.forkHeight, 0.1);
        const rodMaterial = new forkliftMaterial({
            color: forkliftColors[3],
            metalness: 0.8,            
            roughness: 0.3,            
        });
        const rod = new THREE.Mesh(rodGeometry, rodMaterial);
        forkGroup.add(rod);
        rod.position.z = - this.chassisDepth / 2 * 0.6;

        const rod2 = rod.clone();
        forkGroup.add(rod2);
        rod2.position.z = - rod.position.z;

        const barGeometry = new THREE.BoxGeometry(0.1, 0.16, this.chassisDepth * 0.8);
        const barMaterial = new forkliftMaterial({
            color: forkliftColors[4],
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.position.x = 0.05;
        forkGroup.add(bar);

        const bar2 = bar.clone();
        forkGroup.add(bar2);
        bar2.position.y = this.forkHeight * 0.8 / 2;

        const bar3 = bar.clone();
        forkGroup.add(bar3);
        bar3.position.y = - bar2.position.y;

        const surfaceGeometry = new THREE.BoxGeometry(this.surfaceSide, 0.1, this.surfaceSide);
        surfaceGeometry.center();

        const surfaceMaterial = new forkliftMaterial({
            color: forkliftColors[5],
        });
        const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
        const surfaceGroup = new THREE.Group();
        forkGroup.add(surfaceGroup);
        surfaceGroup.add(surface);
        surface.position.x = - this.chassisDepth / 2;
        this.forkSurface = surfaceGroup;

        return forkGroup;
    }

    buildForklift() {
        const forklift = new THREE.Group();

        const chassis = this.buildChassis();
        forklift.add(chassis);

        const seat = this.buildSeat();
        forklift.add(seat);
        seat.position.set(this.chassisWidth * 0.7, this.chassisHeight);

        const brakes = this.buildBrakes();
        forklift.add(brakes);
        brakes.position.set(this.chassisWidth * 0.2, this.chassisHeight);

        const frontWheelGroup = new THREE.Group();
        const wheel = this.buildWheel();
        frontWheelGroup.add(wheel);
        this.wheels.push(wheel);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.z = this.chassisWidth / 2 - 1;

        wheel.position.y = 0.2;
        wheel.position.x = this.chassisWidth / 4;
        wheel.position.z = this.chassisDepth / 2;

        const wheel2 = wheel.clone();
        this.wheels.push(wheel2);
        wheel2.rotation.x = - Math.PI / 2;
        wheel2.position.z = - this.chassisDepth / 2;
        frontWheelGroup.add(wheel2);

        const backWheelGroup = frontWheelGroup.clone();
        backWheelGroup.children.forEach(wheelClone => {
            this.wheels.push(wheelClone);
        });
        backWheelGroup.position.x = this.chassisWidth * 2 / 4;
        const wheelGroup = new THREE.Group();
        wheelGroup.add(frontWheelGroup);
        wheelGroup.add(backWheelGroup);

        forklift.add(wheelGroup);

        const fork = this.buildFork();
        forklift.add(fork);
        fork.position.y = this.forkHeight / 2 + 0.2;
        fork.position.x = -0.1;

        const forkliftWrapper = new THREE.Group();
        forkliftWrapper.add(forklift);
        forklift.position.x = - this.chassisWidth / 2;

        return forkliftWrapper;
    }

    getForkPosition() {
        const worldPosition = new THREE.Vector3();
        this.forkSurface.getWorldPosition(worldPosition);
        return worldPosition;
    }

    getForkliftPosition() {
        const worldPosition = new THREE.Vector3();
        this.structure.getWorldPosition(worldPosition);
        return worldPosition;
    }

    addMeshToFork(mesh) {
        this.currentMesh = mesh;
        mesh.position.set(- this.surfaceSide / 2, 0, 0);
        this.forkSurface.add(mesh);
    }

    removeMeshFromFork() {
        if (this.currentMesh) {
            this.forkSurface.remove(this.currentMesh);

            if (this.currentMesh.geometry) {
                this.currentMesh.geometry.dispose();
            }

            const material = this.currentMesh.material;
            if (Array.isArray(material)) {
                material.forEach(mat => mat.dispose());
            } else if (material) {
                material.dispose();
            }

            this.currentMesh = null;
        }
    }

    initForkControls() {
        const forkSpeed = 0.05;
        const driveSpeed = 0.05;
        const rotateSpeed = 0.05;

        const update = () => {
            if (!this.forkSurface) return;
            if (keyboardManager.isPressed('q')) {
                this.forkSurface.position.y = Math.max(this.forkSurface.position.y - forkSpeed, - this.forkHeight / 2 * 0.9);
            }
            if (keyboardManager.isPressed('e')) {
                this.forkSurface.position.y = Math.min(this.forkSurface.position.y + forkSpeed, this.forkHeight / 2 * 0.9);
            }
            if (keyboardManager.isPressed('w')) {
                this.structure.translateX(-driveSpeed);
                this.wheels.forEach(wheel => {
                    wheel.rotation.y += rotateSpeed;
                });
            }
            if (keyboardManager.isPressed('s')) {
                this.structure.translateX(driveSpeed);
                this.wheels.forEach(wheel => {
                    wheel.rotation.y -= rotateSpeed;
                });
            }
            if (keyboardManager.isPressed('a')) {
                this.structure.rotateY(rotateSpeed);
            }
            if (keyboardManager.isPressed('d')) {
                this.structure.rotateY(-rotateSpeed);
            }
            requestAnimationFrame(update);
        };

        update();
    }

}

export default Forklift;