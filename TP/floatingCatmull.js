import * as THREE from 'three';

class FloatingCatmull {
    constructor(scene, options = {}) {
        this.scene = scene;

        this.segments = options.segments || 200;
        this.radius = options.radius || 0.2;
        this.tubeSegments = options.tubeSegments || 20;
        this.pathPoints = options.pathPoints || this.generateCatmullPoints();

        this.followers = [];
        this.buildTrack();
    }

    generateCatmullPoints() {
        return [
            new THREE.Vector3(0, .7, 2.5),
            new THREE.Vector3(4, -.5, 2),
            new THREE.Vector3(4, -.2, -2),
            new THREE.Vector3(-4, -.5, 2),
            new THREE.Vector3(-4.5, 0, 0),
            new THREE.Vector3(-2, .7, -1),
        ];
    }

    scaleCurve(factor) {
        this.pathPoints = this.pathPoints.map(p => p.clone().multiplyScalar(factor));
        this.buildTrack();
    }

    translateCurve(offsetVector) {
        this.pathPoints = this.pathPoints.map(p => p.clone().add(offsetVector));
        this.buildTrack();
    }

    buildTrack() {
        this.curve = new THREE.CatmullRomCurve3(this.pathPoints, true);
        
        // const points = this.curve.getPoints(100);
        // const geometry = new THREE.BufferGeometry().setFromPoints(points);
        // const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        // const curveObject = new THREE.Line(geometry, material);
        // this.scene.add(curveObject);
    }

    addFollower(mesh, offset = 0) {
        this.scene.add(mesh);
        this.followers.push({ mesh, offset });
    }

    update(delta = 0.001) {
        this.followers.forEach((follower) => {
            follower.offset = (follower.offset + delta) % 1;
            const pos = this.curve.getPointAt(follower.offset);

            follower.mesh.position.copy(pos);

            follower.mesh.rotation.y += 0.005;
            follower.mesh.rotation.x += 0.005;
        });
    }

}

export default FloatingCatmull;