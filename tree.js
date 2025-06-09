import * as THREE from 'three';

class Tree {
    constructor(depth, length = 1, thickness = 0.1) {
        this.group = this.buildTree(depth, length, thickness);
    }

    buildTree(level, length, thickness) {
        const group = new THREE.Group();

        if (level <= 0) return group;

        if (level === 1) {
            const leaf = new THREE.Mesh(
                new THREE.BoxGeometry(),
                new THREE.MeshPhongMaterial({ color: 0x00ff00 })
            );
            leaf.rotation.set(Math.PI / 4, 0, Math.PI / 4);
            leaf.position.y = length;
            group.add(leaf);
            group.scale.set(thickness * 20 * 0.3, thickness * 20, thickness * 20 * 0.3);
            return group;
        }

        const branch = new THREE.Mesh(
            new THREE.CylinderGeometry(thickness * 0.8, thickness, length, 8),
            new THREE.MeshBasicMaterial({ color: 0x8B4513 })
        );
        branch.position.y = length / 2;
        group.add(branch);

        const randomAngle = (base, variance = 0.4) => base + (Math.random() - 0.5) * variance;

        const addChild = (baseZRot, baseYRot, yPos) => {
            const zRot = randomAngle(baseZRot);     // Randomize tilt
            const yRot = randomAngle(baseYRot);     // Randomize twist
            const child = new Tree(level - 1, length * 0.75, thickness * 0.7).group;
            child.rotation.set(0, yRot, zRot);
            child.position.y = yPos + (Math.random() - 0.5) * 0.2;
            group.add(child);
        };

        addChild(Math.PI / 6, 0, length);
        addChild(Math.PI / 6, (4 * Math.PI) / 6, length);
        addChild(Math.PI / 6, (9 * Math.PI) / 6, length / 2);

        return group;
    }
}

export default Tree;