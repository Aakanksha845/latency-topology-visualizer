"use client";
import React, { useRef, memo, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { latLngToVector3 } from "@/utils/coords";
import { MARKER_HEIGHT, MARKER_PULSE_SPEED } from "@/constants";

type Props = {
  lat: number;
  lng: number;
  color: string;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onClick?: () => void;
  size?: number;
};

const Marker = memo(function Marker({
  lat,
  lng,
  color,
  onPointerOver,
  onPointerOut,
  onClick,
  size = 0.02,
}: Props) {
  const ref = useRef<THREE.Mesh>(null!);
  const pos = useMemo(
    () => latLngToVector3(lat, lng, MARKER_HEIGHT),
    [lat, lng]
  );

  useFrame((state) => {
    if (ref.current) {
      ref.current.lookAt(state.camera.position);
      const s =
        1 + Math.sin(state.clock.elapsedTime * MARKER_PULSE_SPEED) * 0.08;
      ref.current.scale.set(s * size, s * size, s * size);
    }
  });

  return (
    <mesh
      ref={ref}
      position={pos}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
});

export default Marker;
