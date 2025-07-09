import * as THREE from 'three';
import BaseMode from './BaseMode';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

const VMgltf = 'models/VM/scene.gltf'
const Benchgltf = 'models/Bench/scene.gltf'

export default class ChurchMode extends BaseMode {
    constructor() {
        super("Lacrimosa");

        this.VM = new THREE.Group();
        this.bench = new THREE.Mesh();
    }

    apply(warehouse) {
        const loader = new GLTFLoader();

        loader.load(
            VMgltf,
            (gltf) => {
                gltf.scene.scale.set(40, 40, 40);
                this.VM = gltf.scene;
                warehouse.structure.add(this.VM);
                this.VM.rotateY(Math.PI / 2);
                this.VM.position.x = - warehouse.width / 2 + 4;
                this.VM.position.y = - 60;
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.error('An error happened', error);
            }
        );

        this.benches = [];

        loader.load(
            Benchgltf,
            (gltf) => {
                gltf.scene.scale.set(4, 4, 4);
                gltf.scene.rotateY(-Math.PI / 2);

                this.bench = gltf.scene; // Store the original if needed

                const rows = 2;
                const cols = 4;
                const spacingX = 6;
                const spacingZ = 20;
                const targetY = 0;
                const startX = - warehouse.width / 3;
                const startZ = -((rows - 1) * spacingZ) / 2;

                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const startY = -8 * (cols - col); // below ground

                        const cloneBench = clone(gltf.scene);
                        cloneBench.position.set(
                            startX + col * spacingX,
                            startY,
                            startZ + row * spacingZ
                        );
                        warehouse.structure.add(cloneBench);
                        this.benches.push({ object: cloneBench, targetY });
                    }
                }
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error happened', error);
            }
        );

        const lightColor = new THREE.Color(0xffdd88);
        const lightIntensity = 10;
        const lightDistance = 20;

        this.spotLights = [];

        let x = - warehouse.width / 3 - 4;
        let y = 0;
        let targetY = 25;
        let targetZ = 0;

        let target = new THREE.Object3D();
        target.position.set(x - 5, targetY, targetZ);

        [-5, 0, 5].forEach((zOffset) => {
            const spotLight = new THREE.SpotLight(lightColor, lightIntensity, lightDistance, Math.PI / 6, 0.5, 1);
            spotLight.position.set(x, y, zOffset);

            spotLight.target = target;

            // const helper = new THREE.SpotLightHelper(spotLight);
            // warehouse.structure.add(helper);

            warehouse.structure.add(spotLight);
            warehouse.structure.add(spotLight.target);

            this.spotLights.push(spotLight);
        });


        x = - warehouse.width / 6;
        [-10, 0, 10].forEach((zOffset) => {
            const spotLight = new THREE.SpotLight(lightColor, lightIntensity, lightDistance, Math.PI / 6, 0.5, 0.1);
            spotLight.position.set(x, warehouse.height - 2, zOffset);

            target = new THREE.Object3D();
            target.position.set(x, 0, zOffset);

            spotLight.target = target;

            // const helper = new THREE.SpotLightHelper(spotLight);
            // warehouse.structure.add(helper);

            warehouse.structure.add(spotLight);
            warehouse.structure.add(spotLight.target);

            this.spotLights.push(spotLight);
        });

        const carpetGeometry = new THREE.PlaneGeometry(warehouse.width * 0.5, 8);
        const carpetMaterial = new THREE.MeshStandardMaterial({
            color: 0x800000, // deep red
            roughness: 0.8,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
        carpet.rotation.x = -Math.PI / 2; // Face up
        carpet.position.y = 0.01; // Slightly above the floor to avoid z-fighting
        carpet.position.x = - warehouse.width * 0.25;

        const carpetGroup = new THREE.Group();
        carpetGroup.add(carpet)
        carpetGroup.rotation.z = Math.PI / 1000;
        carpetGroup.position.y = -0.06;
        warehouse.structure.add(carpetGroup);
        this.carpet = carpetGroup;

        this.removedLights = [...warehouse.lamps];

        this.removedLights.forEach(lamp => {
            lamp.visible = false;
        });

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('images/churchGlass.jpg');

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            emissive: new THREE.Color(0xffffaa),
            emissiveMap: texture,
            emissiveIntensity: 3,
            metalness: 0.1,
            roughness: 0.3,
            side: THREE.FrontSide,
        });

        const geometry = new THREE.PlaneGeometry(10, 6); // adjust width & height as needed
        const vitro = new THREE.Mesh(geometry, material);

        vitro.position.set(- warehouse.width / 2 - 7, warehouse.height / 2, 0);
        vitro.scale.set(3, 3, 3);
        vitro.rotation.y = Math.PI / 2;

        this.vitro = vitro;
        warehouse.structure.add(vitro);
    }

    update(warehouse, deltaTime) {
        if (!this.benches) return;

        this.benches.forEach(({ object, targetY }) => {
            if (object.position.y < targetY) {
                object.position.y += deltaTime * 2; // speed of rise
                if (object.position.y > targetY) {
                    object.position.y = targetY; // clamp to target
                }
            }
        });

        if (this.vitro.position.x < - warehouse.width / 2 + 0.2) {
            this.vitro.position.x += deltaTime * 0.2;
            if (this.vitro.position.x > - warehouse.width / 2 + 0.2) {
                this.vitro.position.x = - warehouse.width / 2 + 0.2;
            }
        } else {
            this.spotLights.forEach(light => {
                // Smoothly increase intensity until target is reached
                const targetIntensity = 30;
                if (light.intensity < targetIntensity) {
                    light.intensity += deltaTime * 5;
                    if (light.intensity > targetIntensity) {
                        light.intensity = targetIntensity;
                    }
                }
            });
        }

        if (this.VM.position.y < 0) {
            this.VM.position.y += deltaTime * 2;
            if (this.VM.position.y > 0) {
                this.VM.position.y = 0;
            }
        }

        if (this.carpet.position.y < 0.1) {
            this.carpet.position.y += deltaTime * 0.006;
            if (this.carpet.position.y > 0.1) {
                this.carpet.position.y = 0.1;
            }
        }
    }

    dispose(warehouse) {
        this.benches.forEach(bench => {
            warehouse.structure.remove(bench.object);
            bench.dispose?.();
            bench = null;
        });

        this.spotLights.forEach(light => {
            warehouse.structure.remove(light);
            light.dispose?.();
            light = null;
        });

        this.removedLights?.forEach(lamp => {
            lamp.visible = true;
        });

        if (this.VM) {
            warehouse.structure.remove(this.VM);
            this.VM.dispose?.();
            this.VM = null;
        }

        if (this.vitro) {
            warehouse.structure.remove(this.vitro);
            this.vitro.dispose?.();
            this.vitro = null;
        }

        if (this.carpet) {
            warehouse.structure.remove(this.carpet);
            this.carpet.dispose?.();
            this.carpet = null;
        }
    }
}