import { useRef, memo, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToVector3 } from "../utils/coords";
import {
  ARC_MIN_HEIGHT,
  ARC_MID_HEIGHT,
  ARC_POINTS_COUNT,
  ANIMATION_SPEED,
} from "../constants";

interface Props {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  color: string;
}

const ArcConnection = memo(function ArcConnection({
  start,
  end,
  color,
}: Props) {
  const curveRef = useRef<THREE.Line>(null!);

  useFrame(({ clock }) => {
    if (!curveRef.current?.material) return;
    const pulse = (Math.sin(clock.getElapsedTime() * ANIMATION_SPEED) + 1) / 2;
    (curveRef.current.material as THREE.LineBasicMaterial).opacity =
      0.5 + pulse * 0.5;
  });

  // Memoize curve calculation for performance
  const { geometry, material } = useMemo(() => {
    if (start.lat === end.lat && start.lng === end.lng) {
      return { geometry: null, material: null };
    }

    const startVec = latLngToVector3(start.lat, start.lng, ARC_MIN_HEIGHT);
    const endVec = latLngToVector3(end.lat, end.lng, ARC_MIN_HEIGHT);
    const midPoint = startVec.clone().add(endVec).multiplyScalar(0.5);
    const midPointLength = midPoint.length();

    if (midPointLength < ARC_MID_HEIGHT) {
      midPoint.normalize().multiplyScalar(ARC_MID_HEIGHT);
    } else {
      midPoint
        .normalize()
        .multiplyScalar(Math.max(midPointLength, ARC_MID_HEIGHT));
    }

    const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
    const curvePoints = curve.getPoints(ARC_POINTS_COUNT);

    const points = curvePoints.map((point) => {
      const distance = point.length();
      if (distance < ARC_MIN_HEIGHT) {
        point.normalize().multiplyScalar(ARC_MIN_HEIGHT);
      }
      return point;
    });

    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color,
      linewidth: 50,
      transparent: true,
    });

    return { geometry: geom, material: mat };
  }, [start.lat, start.lng, end.lat, end.lng, color]);

  if (!geometry || !material) return null;

  const line = new THREE.Line(geometry, material);
  return <primitive object={line} ref={curveRef} />;
});

export default ArcConnection;
