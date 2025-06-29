import * as THREE from 'three';

export function extrudeShape(shapePoints, numSteps = 4, depth = 1, rotation = Math.PI / 2) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const uvs = [];
    const indices = [];

    
    // Create front and back vertices
    for (let i = 0; i <= numSteps; i++) {
        const z = -i * depth / numSteps;
        const angle = i * rotation / numSteps;

        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        shapePoints.forEach((p, pointIndex) => {
            const rotatedX = p.x * cosA - p.y * sinA;
            const rotatedY = p.x * sinA + p.y * cosA;

            vertices.push(rotatedX, rotatedY, z);
            const u = pointIndex / (shapePoints.length - 1);
            const v = numSteps - i / numSteps;
            i == numSteps ? uvs.push(p.x, p.y) : uvs.push(u, v);
        });
    }

    // Create side faces
    const pointsPerLayer = shapePoints.length;

    for (let step = 0; step < numSteps; step++) {
        const currOffset = step * pointsPerLayer;
        const nextOffset = (step + 1) * pointsPerLayer;

        for (let i = 0; i < pointsPerLayer; i++) {
            const next = (i + 1) % pointsPerLayer;

            const a = currOffset + i;
            const b = currOffset + next;
            const c = nextOffset + next;
            const d = nextOffset + i;

            indices.push(a, b, c); // first triangle
            indices.push(a, c, d); // second triangle
        }
    }

    const triangles = THREE.ShapeUtils.triangulateShape(shapePoints, []);

    // Front face (z = 0 layer)
    const frontOffset = 0;
    for (const tri of triangles) {
        const [a, b, c] = tri;
        indices.push(frontOffset + a, frontOffset + b, frontOffset + c);
    }

    // Back face (z = -depth layer)
    const backOffset = numSteps * pointsPerLayer;
    for (const tri of triangles) {
        const [a, b, c] = tri;
        // Reverse winding order so the normal points outward
        indices.push(backOffset + c, backOffset + b, backOffset + a);
    }


    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
}