import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

let aspect = window.innerWidth / window.innerHeight;
let viewSize = 20; // half-size of visible area in Y direction

// Adjust left/right/top/bottom based on aspect ratio
function updateCameraBounds() {
    aspect = window.innerWidth / window.innerHeight;
    camera.left = -viewSize * aspect;
    camera.right = viewSize * aspect;
    camera.top = viewSize;
    camera.bottom = -viewSize;
    camera.updateProjectionMatrix();
}

const centerPointM = new THREE.MeshNormalMaterial();
const centerPointG = new THREE.SphereGeometry(0.1, 32);
const centerPoint = new THREE.Mesh(centerPointG, centerPointM);
scene.add(centerPoint)

const camera = new THREE.OrthographicCamera(-viewSize * aspect, viewSize * aspect, viewSize, -viewSize, 1, 1000);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.enableZoom = true;
controls.mouseButtons.RIGHT = null; // Disable right-click

const gridHelper = new THREE.GridHelper(viewSize * 2, viewSize * 2);
gridHelper.rotation.x = Math.PI / 2;  // Rotate grid to XY plane
scene.add(gridHelper);

// Points and curves storage
let curvesPoints = [[]];  // Start with one empty curve
let pointMeshes = [];
let draggingPoint = null;
let offset = new THREE.Vector3();
let curveObjects = [];      // Catmull-Rom curves
let bezierCurveObjects = []; // Bezier curves

const pointGeometry = new THREE.SphereGeometry(0.3, 8, 8);
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

// Toggle which curve type to draw
let showCatmull = true;
let showBezier = false;

function addPoint(x = 0, y = 0) {
    const mesh = new THREE.Mesh(pointGeometry, pointMaterial.clone());
    mesh.position.set(x, y, 0);
    scene.add(mesh);

    const lastCurve = curvesPoints[curvesPoints.length - 1];
    lastCurve.push(new THREE.Vector2(x, y));
    pointMeshes.push(mesh);
    updateCurves();
}

function updateCurves() {
    // Remove old curves
    curveObjects.forEach(c => scene.remove(c));
    bezierCurveObjects.forEach(c => scene.remove(c));
    curveObjects = [];
    bezierCurveObjects = [];

    curvesPoints.forEach(points => {
        if (points.length < 2) return;

        if (showCatmull) {
            // Catmull-Rom Curve (green)
            const catmullCurve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p.x, p.y, 0)));
            const catmullPoints = catmullCurve.getPoints(100);
            const catmullGeom = new THREE.BufferGeometry().setFromPoints(catmullPoints);
            const catmullMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
            const catmullLine = new THREE.Line(catmullGeom, catmullMat);
            scene.add(catmullLine);
            curveObjects.push(catmullLine);
        }

        if (showBezier) {
            // Bezier Curve(s) (blue)
            if (points.length >= 4) {
                // Cubic Bezier segments from consecutive groups of 4 points stepping by 3
                for (let i = 0; i <= points.length - 4; i += 3) {
                    const p0 = points[i];
                    const p1 = points[i + 1];
                    const p2 = points[i + 2];
                    const p3 = points[i + 3];
                    const bezierCurve = new THREE.CubicBezierCurve3(
                        new THREE.Vector3(p0.x, p0.y, 0),
                        new THREE.Vector3(p1.x, p1.y, 0),
                        new THREE.Vector3(p2.x, p2.y, 0),
                        new THREE.Vector3(p3.x, p3.y, 0)
                    );
                    const bezierPoints = bezierCurve.getPoints(20);
                    const bezierGeom = new THREE.BufferGeometry().setFromPoints(bezierPoints);
                    const bezierMat = new THREE.LineBasicMaterial({ color: 0x0000ff });
                    const bezierLine = new THREE.Line(bezierGeom, bezierMat);
                    scene.add(bezierLine);
                    bezierCurveObjects.push(bezierLine);
                }
            } else if (points.length === 3) {
                // Quadratic Bezier for 3 points
                const bezierCurve = new THREE.QuadraticBezierCurve3(
                    new THREE.Vector3(points[0].x, points[0].y, 0),
                    new THREE.Vector3(points[1].x, points[1].y, 0),
                    new THREE.Vector3(points[2].x, points[2].y, 0)
                );
                const bezierPoints = bezierCurve.getPoints(20);
                const bezierGeom = new THREE.BufferGeometry().setFromPoints(bezierPoints);
                const bezierMat = new THREE.LineBasicMaterial({ color: 0x0000ff });
                const bezierLine = new THREE.Line(bezierGeom, bezierMat);
                scene.add(bezierLine);
                bezierCurveObjects.push(bezierLine);
            } else if (points.length === 2) {
                // Just a line
                const lineGeom = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(points[0].x, points[0].y, 0),
                    new THREE.Vector3(points[1].x, points[1].y, 0)
                ]);
                const lineMat = new THREE.LineBasicMaterial({ color: 0x0000ff });
                const line = new THREE.Line(lineGeom, lineMat);
                scene.add(line);
                bezierCurveObjects.push(line);
            }
        }
    });
}

function onMouseDown(event) {
    event.preventDefault();
    setMousePosition(event);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pointMeshes);
    if (intersects.length > 0) {
        draggingPoint = intersects[0].object;
        const intersectPoint = intersects[0].point;
        offset.copy(intersectPoint).sub(draggingPoint.position);
    }
}

function onMouseMove(event) {
    if (!draggingPoint) return;
    setMousePosition(event);
    raycaster.setFromCamera(mouse, camera);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    intersection.sub(offset);

    // Snap to nearest integer on the 2D plane
    intersection.x = Math.round(intersection.x);
    intersection.y = Math.round(intersection.y);
    intersection.z = 0;
    draggingPoint.position.copy(intersection);

    // Update point in curvesPoints
    let found = false;
    let count = 0;
    for (let curve of curvesPoints) {
        for (let i = 0; i < curve.length; i++) {
            if (pointMeshes[count] === draggingPoint) {
                curve[i].x = intersection.x;
                curve[i].y = intersection.y;
                found = true;
                break;
            }
            count++;
        }
        if (found) break;
    }

    updateCurves();
}

function onMouseUp() {
    draggingPoint = null;
}

function setMousePosition(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'a') {
        addPoint();
    }
    if (e.key.toLowerCase() === 'e') {
        // Print points grouped by curve
        console.log(
            curvesPoints.map(curve =>
                curve.map(p => `new THREE.Vector2(${p.x}, ${p.y})`)
            )
        );
    }
    if (e.key.toLowerCase() === 'n') {
        curvesPoints.push([]);
    }
    if (e.key.toLowerCase() === 'c') {
        showCatmull = true;
        showBezier = false;
        updateCurves();
    }
    if (e.key.toLowerCase() === 'b') {
        showCatmull = false;
        showBezier = true;
        updateCurves();
    }

    if (e.key === 'Backspace') {
        // Prevent browser from navigating back
        e.preventDefault();

        if (curvesPoints.length === 0) return;

        let lastCurve = curvesPoints[curvesPoints.length - 1];
        if (lastCurve.length > 0) {
            const meshToRemove = pointMeshes.pop();
            scene.remove(meshToRemove);
            lastCurve.pop();
            updateCurves();
        } else {
            // If the current curve is empty, remove it entirely
            curvesPoints.pop();
        }
    }

});

window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateCameraBounds();
    gridHelper.scale.set(1, 1, 1); // Make sure grid does not get stretched
});

updateCameraBounds();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();