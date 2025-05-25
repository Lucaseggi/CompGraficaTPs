import * as THREE from 'three';

const maxX = 0.8;
const maxY = 1.5;

function A1Curve() {
    const points = [];

    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.5, 0));
    points.push(new THREE.Vector2(0.5, 0.3));

    const curve1 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0.5, 0.3),
        new THREE.Vector2(0.4, 0.45),
        new THREE.Vector2(0.0, 0.35),
        new THREE.Vector2(0.15, 0.5)
    );
    points.push(...curve1.getPoints(10));

    const curve2 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0.15, 0.5),
        new THREE.Vector2(0.5, 0.5),
        new THREE.Vector2(0.5, 1.4),
        new THREE.Vector2(0.15, 1.4)
    );
    points.push(...curve2.getPoints(10));

    const transformedPoints = curve1.getPoints(10).reverse().map(p =>
        new THREE.Vector2(p.x, 1.9 - p.y)
    );

    console.log(transformedPoints)
    points.push(...transformedPoints);

    points.push(new THREE.Vector2(0.5, 1.6));
    points.push(new THREE.Vector2(0.5, 1.85));
    points.push(new THREE.Vector2(0, 1.85));

    return points;
}

function A2Curve() {
    const points = [];

    const curve1 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.5, 0),
        new THREE.Vector2(0.4, 0.2),
        new THREE.Vector2(0.2, 0.5)
    );
    points.push(...curve1.getPoints(10));

    const curve2 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0.2, 0.5),
        new THREE.Vector2(0.1, 0.7),
        new THREE.Vector2(0.35, 1),
        new THREE.Vector2(0.35, 1)
    );
    points.push(...curve2.getPoints(10));

    const curve3 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0.35, 1),
        new THREE.Vector2(0.45, 1.2),
        new THREE.Vector2(0.05, 1.1),
        new THREE.Vector2(0.15, 1.3)
    );
    points.push(...curve3.getPoints(10));


    return points;
}

function A3Curve() {
    const points = [];

    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.7, 0));
    points.push(new THREE.Vector2(0.2, 0.3));
    points.push(new THREE.Vector2(0.2, 0.4));

    const curve1 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0.2, 0.4),
        new THREE.Vector2(0.35, 0.4),
        new THREE.Vector2(0.55, 0.6),
        new THREE.Vector2(0.55, 0.7)
    );
    points.push(...curve1.getPoints(10));

    points.push(new THREE.Vector2(0.55, 1.1));

    const curve2 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0.55, 1.1),
        new THREE.Vector2(0.55, 1.4),
        new THREE.Vector2(0.2, 1.2),
        new THREE.Vector2(0.15, 1.5)
    );
    points.push(...curve2.getPoints(10));

    return points;
}

function A4Curve() {
    const points = [];

    points.push(new THREE.Vector2(0, 0));

    const curve1 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0.25, 0),
        new THREE.Vector2(0.5, 0),
        new THREE.Vector2(0.5, 0.3),
        new THREE.Vector2(0.3, 0.3)
    );
    points.push(...curve1.getPoints(10));

    const curve2 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0.3, 0.3),
        new THREE.Vector2(0.1, 0.3),
        new THREE.Vector2(0.2, 0.6),
        new THREE.Vector2(0.55, 0.7)
    );
    points.push(...curve2.getPoints(10));

    const curve4 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0.55, 0.7),
        new THREE.Vector2(0.2, 0.75),
        new THREE.Vector2(0.45, 0.95),
        new THREE.Vector2(0.15, 1)
    );
    points.push(...curve4.getPoints(10));

    return points;
}

function B1Curve() {
    const points = [];

    points.push(new THREE.Vector2(Math.sin(0), Math.cos(0)));
    points.push(new THREE.Vector2(Math.sin(Math.PI * 2 / 3), Math.cos(Math.PI * 2 / 3)));
    points.push(new THREE.Vector2(Math.sin(Math.PI * 4 / 3), Math.cos(Math.PI * 4 / 3)));
    points.push(new THREE.Vector2(Math.sin(0), Math.cos(0)));

    return points;
}

function B2Curve() {
    const points = [];

    const total = 6;
        for(let i = 0; i < total; i++) {
        const curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector2(Math.sin(Math.PI * 2 * i / total), Math.cos(Math.PI * 2 * i / total)),
            new THREE.Vector2(Math.sin(Math.PI * 2 * i / total), Math.cos(Math.PI * 2 * i / total)),
            new THREE.Vector2(Math.sin(Math.PI * 2 * (i + .5) / total) * 0.55, Math.cos(Math.PI * 2 * (i + .5) / total) * 0.55),
            new THREE.Vector2(Math.sin(Math.PI * 2 * (i + 1) / total), Math.cos(Math.PI * 2 * (i + 1) / total)),
        ], false, 'centripetal', 0.8 );
        points.push(...curve.getPoints(15));
    }

    return points;
}

function B3Curve() {
    const points = [];

    const side = 0.3;
    const distance = 0.25;

    points.push(new THREE.Vector2(- side / 2, distance));
    points.push(new THREE.Vector2(side / 2, distance));

    const curve1 = new THREE.CubicBezierCurve(
        new THREE.Vector2(side / 2, side + distance),
        new THREE.Vector2(distance + side, side + distance),
        new THREE.Vector2(distance + side, side + distance),
        new THREE.Vector2(distance + side, side / 2)
    );
    points.push(...curve1.getPoints(10));

    points.push(new THREE.Vector2(distance, side / 2));

    const rotated1 = points.map(p => 
        new THREE.Vector2(p.y, -p.x)
    );

    const rotated2 = points.map(p => 
        new THREE.Vector2(-p.x, -p.y)
    );

    const rotated3 = points.map(p => 
        new THREE.Vector2(- p.y, p.x)
    );

    points.push(...rotated1);
    points.push(...rotated2);
    points.push(...rotated3);

    return points;
}

function B4Curve() {
    const points = [];

    const curve1 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0, -0.5),
        new THREE.Vector2(0.7, -0.5),
        new THREE.Vector2(0.7, 0)
    );
    points.push(...curve1.getPoints(10));

    points.push(new THREE.Vector2(0.7, 1));
  
    const curve2 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0.7, 1),
        new THREE.Vector2(0.7, 1.5),
        new THREE.Vector2(0, 1.5),
        new THREE.Vector2(0, 1)
    );
    points.push(...curve2.getPoints(10));

    points.push(new THREE.Vector2(0, 0));

    const transformedPoints = points.map(p => 
        new THREE.Vector2(p.x - 0.7 / 2, p.y - 1.5 / 2)
    );
    
    return transformedPoints;
}

const curves = {
    A1Curve,
    A2Curve,
    A3Curve,
    A4Curve,
    B1Curve,
    B2Curve,
    B3Curve,
    B4Curve,
}

export default curves;