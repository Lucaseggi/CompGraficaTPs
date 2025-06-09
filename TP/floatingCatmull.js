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
            new THREE.Vector3(1, 1, 2),
            new THREE.Vector3(4, 0, 0),
            new THREE.Vector3(-2, -1, 2),
            new THREE.Vector3(-4, 0, 0),
            new THREE.Vector3(-1, 1, -2),
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