import * as THREE from "three";

export function latLngToVector3(lat: number, lng: number, radius = 2.5) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  // Apply Earth's axial tilt (same as Globe rotation [0.4, 0, 0])
  const tiltMatrix = new THREE.Matrix4().makeRotationX(0.4);
  const position = new THREE.Vector3(x, y, z);
  position.applyMatrix4(tiltMatrix);

  return position;
}
