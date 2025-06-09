import * as THREE from 'three';
import Tree from './tree';

class Forest {
    constructor(rows = 3, cols = 3, initialDepth = 3) {
        this.rows = rows;
        this.cols = cols;
        this.depth = initialDepth;
        this.group = new THREE.Group();
        this.spacing = 3;

        this.build();
    }

    build() {
        this.dispose(); // clean up old trees if any

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const tree = new Tree(this.depth).group;
                tree.position.set(
                    (j - this.cols / 2) * this.spacing + (Math.random() - 0.5),
                    0,
                    (i - this.rows / 2) * this.spacing + (Math.random() - 0.5)
                );
                const scale = 0.5 + Math.random();
                tree.scale.set(scale, scale, scale);
                this.group.add(tree);
            }
        }
    }

    increaseDepth() {
        if (this.depth < 6) {
            this.depth++;
            this.build();
        }
    }

    decreaseDepth() {
        if (this.depth > 1) {
            this.depth--;
            this.build();
        }
    }

    dispose() {
        this.group.traverse((child) => {
            if (child.isMesh) {
                child.geometry?.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose());
                } else {
                    child.material?.dispose();
                }
            }
        });
        this.group.clear();
    }
}

export default Forest;