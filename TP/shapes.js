import * as THREE from 'three';
import curves from './curves';


function createA1Shape() {
  const points = curves.A1Curve();

  const geometry = new THREE.LatheGeometry(points);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const lathe = new THREE.Mesh(geometry, material);

  return lathe;
}

function createA2Shape() {
  const points = curves.A2Curve();

  const geometry = new THREE.LatheGeometry(points);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const lathe = new THREE.Mesh(geometry, material);

  return lathe;
}

function createA3Shape() {
  const points = curves.A3Curve();

  const geometry = new THREE.LatheGeometry(points);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00});
  const lathe = new THREE.Mesh(geometry, material);

  return lathe;
}

function createA4Shape() {
  const points = curves.A4Curve();

  const geometry = new THREE.LatheGeometry(points);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00});
  const lathe = new THREE.Mesh(geometry, material);

  return lathe;
}


function createB3Shape() {
  const shape = new THREE.Shape();

  const points = curves.B3Curve();

  shape.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i].x, points[i].y);
  }

  return shape;
}

function createB4Shape() {
  const shape = new THREE.Shape();

  const points = curves.B4Curve();

  shape.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i].x, points[i].y);
  }

  return shape;
}

const shapes = {
  createA1Shape,
  createA2Shape,
  createA3Shape,  
  createA4Shape,
  createB3Shape,
  createB4Shape,
}

export default shapes;