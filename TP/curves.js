import * as THREE from 'three';

const maxX = 0.8;
const maxY = 1.5;

function A1Curve() {
    const points = [];

    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.5, 0));
    points.push(new THREE.Vector2(0.5, 0.3));

    const anchorPoints = [
        new THREE.Vector2(-10, -5),
        new THREE.Vector2(-3, -2),
        new THREE.Vector2(-7, 0),
        new THREE.Vector2(-7, 7),
        new THREE.Vector2(-3, 9),
        new THREE.Vector2(-10, 12)
    ]

    const multX = 0.06;
    const multY = 0.075;
    const transX = 2;
    const transY = 9;
    const catCurve = new THREE.CatmullRomCurve3(anchorPoints.map(p => new THREE.Vector3((p.x + transX) * -multX, (p.y + transY)* multY), 0), false);
    points.push(...catCurve.getPoints(30));


    // ALTERNATIVA CON BEZIER
    // const curve1 = new THREE.CubicBezierCurve(
    //     new THREE.Vector2(0.5, 0.3),
    //     new THREE.Vector2(0.4, 0.45),
    //     new THREE.Vector2(0.0, 0.35),
    //     new THREE.Vector2(0.15, 0.5)
    // );
    // points.push(...curve1.getPoints(10));

    // const curve2 = new THREE.CubicBezierCurve(
    //     new THREE.Vector2(0.15, 0.5),
    //     new THREE.Vector2(0.5, 0.5),
    //     new THREE.Vector2(0.5, 1.4),
    //     new THREE.Vector2(0.15, 1.4)
    // );
    // points.push(...curve2.getPoints(10));

    // const transformedPoints = curve1.getPoints(10).reverse().map(p =>
    //     new THREE.Vector2(p.x, 1.9 - p.y)
    // );

    // points.push(...transformedPoints);

    points.push(new THREE.Vector2(0.5, 1.6));
    points.push(new THREE.Vector2(0.5, 1.85));
    points.push(new THREE.Vector2(0, 1.85));

    return points;
}

function A2Curve() {
    const anchorPoints = [
        new THREE.Vector2(1, 0),
        new THREE.Vector2(0, 0),
        new THREE.Vector2(-4, 1),
        new THREE.Vector2(-2, 8),
        new THREE.Vector2(-4, 12),
        new THREE.Vector2(-2, 13),
        new THREE.Vector2(-2, 14)
    ]

    const mult = 0.1 * 1.3 / 1.4;
    const curve = new THREE.CatmullRomCurve3(anchorPoints.map(p => new THREE.Vector2(p.x * -mult, p.y * mult)), false);
    const points = curve.getPoints(50);

    return points;
}

// ALTERNATIVA CON BEZIER
// function A2Curve() {
//     const points = [];

//     const curve1 = new THREE.CubicBezierCurve(
//         new THREE.Vector2(0, 0),
//         new THREE.Vector2(0.5, 0),
//         new THREE.Vector2(0.4, 0.2),
//         new THREE.Vector2(0.2, 0.5)
//     );
//     points.push(...curve1.getPoints(10));

//     const curve2 = new THREE.CubicBezierCurve(
//         new THREE.Vector2(0.2, 0.5),
//         new THREE.Vector2(0.1, 0.7),
//         new THREE.Vector2(0.35, 1),
//         new THREE.Vector2(0.35, 1)
//     );
//     points.push(...curve2.getPoints(10));

//     const curve3 = new THREE.CubicBezierCurve(
//         new THREE.Vector2(0.35, 1),
//         new THREE.Vector2(0.45, 1.2),
//         new THREE.Vector2(0.05, 1.1),
//         new THREE.Vector2(0.15, 1.3)
//     );
//     points.push(...curve3.getPoints(10));


//     return points;
// }

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

function B1Curve(interpolationsPerSegment = 8) {
  let points = [];

  points = addInterpolatedPoints(points, new THREE.Vector2(Math.sin(0), Math.cos(0)), 0);
  points = addInterpolatedPoints(points, new THREE.Vector2(Math.sin(Math.PI * 2 / 3), Math.cos(Math.PI * 2 / 3)), interpolationsPerSegment);
  points = addInterpolatedPoints(points, new THREE.Vector2(Math.sin(Math.PI * 4 / 3), Math.cos(Math.PI * 4 / 3)), interpolationsPerSegment);
  points = addInterpolatedPoints(points, new THREE.Vector2(Math.sin(0), Math.cos(0)), interpolationsPerSegment);

  return points;
}

function B2Curve() {
    const anchorPoints = [];
    const total = 6;

    for (let i = 0; i < total; i++) {
        const outer = new THREE.Vector3(
            Math.sin(Math.PI * 2 * i / total),
            Math.cos(Math.PI * 2 * i / total),
            0
        );

        const inner = new THREE.Vector3(
            Math.sin(Math.PI * 2 * (i + 0.5) / total) * 0.55,
            Math.cos(Math.PI * 2 * (i + 0.5) / total) * 0.55,
            0
        );

        anchorPoints.push(outer, inner);
    }

    const curve = new THREE.CatmullRomCurve3(anchorPoints, true);
    const points = curve.getPoints(50);

    return points.map(p => new THREE.Vector2(p.x, p.y));
}

function B3Curve(interpolationsPerSegment = 4) {
    let points = [];

    const ratio = 1.5;
    const side = 0.3 * ratio;
    const distance = 0.25 * ratio;

    points = addInterpolatedPoints(points, new THREE.Vector2(- side / 2, distance), interpolationsPerSegment);
    points = addInterpolatedPoints(points, new THREE.Vector2(side / 2, distance), interpolationsPerSegment);
    points = addInterpolatedPoints(points, new THREE.Vector2(side / 2, side + distance), interpolationsPerSegment);

    const curve1 = new THREE.CubicBezierCurve(
        new THREE.Vector2(side / 2, side + distance),
        new THREE.Vector2(distance + side, side + distance),
        new THREE.Vector2(distance + side, side + distance),
        new THREE.Vector2(distance + side, side / 2)
    );
    points.push(...curve1.getPoints(10));

    points = addInterpolatedPoints(points, new THREE.Vector2(distance, side / 2), interpolationsPerSegment);

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

function B4Curve(interpolationsPerSegment = 6) {
    let points = [];

    const curve1 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0, -0.5),
        new THREE.Vector2(0.7, -0.5),
        new THREE.Vector2(0.7, 0)
    );
    points.push(...curve1.getPoints(10));

    points = addInterpolatedPoints(points, new THREE.Vector2(0.7, 1), interpolationsPerSegment);

    const curve2 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0.7, 1),
        new THREE.Vector2(0.7, 1.5),
        new THREE.Vector2(0, 1.5),
        new THREE.Vector2(0, 1)
    );
    points.push(...curve2.getPoints(10));

    points = addInterpolatedPoints(points, new THREE.Vector2(0, 0), interpolationsPerSegment);

    const transformedPoints = points.map(p =>
        new THREE.Vector2(p.x - 0.7 / 2, p.y - 0.5)
    );

    return transformedPoints.reverse();
}

function addInterpolatedPoints(points, newPoint, n = 1) {
  if (points.length === 0) {
    // If no points yet, just start with newPoint
    return [newPoint.clone()];
  }

  const lastPoint = points[points.length - 1];
  const result = [...points];

  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1); // param from 0 to 1 exclusive
    const x = lastPoint.x * (1 - t) + newPoint.x * t;
    const y = lastPoint.y * (1 - t) + newPoint.y * t;
    result.push(new THREE.Vector2(x, y));
  }

  // Add the new point at the end
  result.push(newPoint.clone());

  return result;
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