import * as THREE from 'three';
import curves from './curves';

// const pgeometry = new THREE.BufferGeometry().setFromPoints(curves.B3Curve());

// const wireframe = new THREE.WireframeGeometry(geometry);
// const wline = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x00ff00 }));

export const rotateShapeMap = {
    A1: () => curves.A1Curve,
    A2: () => curves.A2Curve,
    A3: () => curves.A3Curve,
    A4: () => curves.A4Curve,
};

export const rotateShapeScaleFactorMap = {
    A1: 1.06,
    A2: 1.5,
    A3: 1.4,
    A4: 1.7,
};


export const extrudeShapeMap = {
    B1: () => curves.B1Curve,
    B2: () => curves.B2Curve,
    B3: () => curves.B3Curve,
    B4: () => curves.B4Curve,
};

export function rotateShape(points, segments = 12) {
    return new THREE.LatheGeometry(points, segments);
}