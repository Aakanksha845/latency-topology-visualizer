"use client";

import { useMemo, useRef, memo } from "react";
import { LatencyLink } from "../data/latencyData";
import { EXCHANGES } from "../data/exchanges";
import { latLngToVector3 } from "../utils/coords";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { HEATMAP_GRID_SIZE, EARTH_RADIUS, PULSE_SPEED } from "../constants";
import { useIsMobile } from "../hooks/usePerformance";

type LatencyHeatmapProps = {
  latencyLinks: LatencyLink[];
  showHeatmap: boolean;
};

const LatencyHeatmap = memo(function LatencyHeatmap({
  latencyLinks,
  showHeatmap,
}: LatencyHeatmapProps) {
  const isMobile = useIsMobile();
  const gridSize = isMobile ? 20 : HEATMAP_GRID_SIZE; // Reduce grid on mobile

  const heatmapData = useMemo(() => {
    if (!showHeatmap || latencyLinks.length === 0) return [];

    // Create a grid of points on the globe surface
    const points: Array<{
      lat: number;
      lng: number;
      intensity: number;
      color: THREE.Color;
    }> = [];

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const lat = -90 + (i / (gridSize - 1)) * 180;
        const lng = -180 + (j / (gridSize - 1)) * 360;

        // Calculate intensity based on nearby exchanges and their latencies
        let totalIntensity = 0;
        let count = 0;

        EXCHANGES.forEach((exchange) => {
          const distance = calculateDistance(
            lat,
            lng,
            exchange.lat,
            exchange.lng
          );

          // Find connections involving this exchange
          const relevantLinks = latencyLinks.filter(
            (link) => link.from === exchange.id || link.to === exchange.id
          );

          relevantLinks.forEach((link) => {
            const weight = 1 / (1 + distance / 1000);
            const latencyIntensity = Math.min(link.latency / 200, 1);
            totalIntensity += weight * latencyIntensity;
            count += weight;
          });
        });

        const intensity = count > 0 ? totalIntensity / count : 0;

        // Convert intensity to color (green -> yellow -> red)
        const color = new THREE.Color();
        if (intensity < 0.3) {
          color.setRGB(0, 1, 0); // Green
        } else if (intensity < 0.6) {
          const t = (intensity - 0.3) / 0.3;
          color.setRGB(t, 1, 0); // Green to Yellow
        } else {
          const t = (intensity - 0.6) / 0.4;
          color.setRGB(1, 1 - t, 0); // Yellow to Red
        }

        points.push({ lat, lng, intensity, color });
      }
    }

    return points;
  }, [latencyLinks, showHeatmap, gridSize]);

  if (!showHeatmap || heatmapData.length === 0) return null;

  return (
    <group>
      {heatmapData.map((point, index) => (
        <HeatmapPoint
          key={`${point.lat}-${point.lng}-${index}`}
          lat={point.lat}
          lng={point.lng}
          color={point.color}
          intensity={point.intensity}
        />
      ))}
    </group>
  );
});

export default LatencyHeatmap;

function HeatmapPoint({
  lat,
  lng,
  color,
  intensity,
}: {
  lat: number;
  lng: number;
  color: THREE.Color;
  intensity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pos = useMemo(
    () => latLngToVector3(lat, lng, EARTH_RADIUS),
    [lat, lng]
  );

  useFrame(({ clock }) => {
    if (meshRef.current?.material) {
      const pulse = (Math.sin(clock.getElapsedTime() * PULSE_SPEED) + 1) / 2;
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
        intensity * 0.3 + pulse * 0.1;
    }
  });

  if (intensity < 0.1) return null;

  return (
    <mesh ref={meshRef} position={pos}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={intensity * 0.3} />
    </mesh>
  );
}

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
