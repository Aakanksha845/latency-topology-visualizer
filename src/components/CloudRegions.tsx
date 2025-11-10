"use client";

import { useMemo, useRef, memo } from "react";
import { EXCHANGES, Exchange } from "../data/exchanges";
import { latLngToVector3 } from "../utils/coords";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  MARKER_HEIGHT,
  REGION_CONNECTION_HEIGHT,
  REGION_ARC_POINTS_COUNT,
  PULSE_SPEED,
  COLORS,
} from "../constants";

type CloudRegionsProps = {
  showRegions: boolean;
  selectedProviders: string[];
};

function groupExchangesByRegion() {
  const groups: {
    [key: string]: {
      provider: string;
      region: string;
      exchanges: Exchange[];
      centerLat: number;
      centerLng: number;
    };
  } = {};

  EXCHANGES.forEach((exchange) => {
    const key = `${exchange.provider}-${exchange.region}`;
    if (!groups[key]) {
      groups[key] = {
        provider: exchange.provider,
        region: exchange.region || "unknown",
        exchanges: [],
        centerLat: 0,
        centerLng: 0,
      };
    }
    groups[key].exchanges.push(exchange);
  });

  // Calculate center points
  Object.values(groups).forEach((group) => {
    const avgLat =
      group.exchanges.reduce((sum, e) => sum + e.lat, 0) /
      group.exchanges.length;
    const avgLng =
      group.exchanges.reduce((sum, e) => sum + e.lng, 0) /
      group.exchanges.length;
    group.centerLat = avgLat;
    group.centerLng = avgLng;
  });

  return groups;
}

const CloudRegions = memo(function CloudRegions({
  showRegions,
  selectedProviders,
}: CloudRegionsProps) {
  const regionGroups = useMemo(() => groupExchangesByRegion(), []);

  if (!showRegions) return null;

  return (
    <>
      {Object.entries(regionGroups)
        .filter(([_, group]) => selectedProviders.includes(group.provider))
        .map(([key, group]) => (
          <RegionCluster key={key} group={group} provider={group.provider} />
        ))}
    </>
  );
});

export default CloudRegions;

function RegionCluster({
  group,
  provider,
}: {
  group: {
    provider: string;
    region: string;
    exchanges: Exchange[];
    centerLat: number;
    centerLng: number;
  };
  provider: string;
}) {
  const centerPos = latLngToVector3(
    group.centerLat,
    group.centerLng,
    MARKER_HEIGHT
  );
  const radius = Math.max(0.15, group.exchanges.length * 0.02);

  const getProviderColor = (provider: string) => {
    return COLORS[provider as keyof typeof COLORS] || COLORS.Other;
  };

  const color = getProviderColor(provider);

  return (
    <group>
      <mesh position={centerPos}>
        <ringGeometry args={[radius, radius + 0.02, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[centerPos.x, centerPos.y + 0.1, centerPos.z]}>
        <boxGeometry args={[0.01, 0.01, 0.01]} />
        <meshBasicMaterial color={color} transparent opacity={0} />
      </mesh>

      {group.exchanges.map((exchange1, i) => {
        return group.exchanges.slice(i + 1).map((exchange2) => {
          const pos1 = latLngToVector3(
            exchange1.lat,
            exchange1.lng,
            REGION_CONNECTION_HEIGHT
          );
          const pos2 = latLngToVector3(
            exchange2.lat,
            exchange2.lng,
            REGION_CONNECTION_HEIGHT
          );

          return (
            <RegionConnection
              key={`${exchange1.id}-${exchange2.id}`}
              start={pos1}
              end={pos2}
              color={color}
            />
          );
        });
      })}
    </group>
  );
}

function RegionConnection({
  start,
  end,
  color,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
}) {
  const lineRef = useRef<THREE.Line>(null!);

  useFrame(({ clock }) => {
    if (!lineRef.current?.material) return;
    const pulse = (Math.sin(clock.getElapsedTime() * PULSE_SPEED) + 1) / 2;
    (lineRef.current.material as THREE.LineBasicMaterial).opacity =
      0.2 + pulse * 0.2;
  });

  const minHeight = REGION_CONNECTION_HEIGHT;
  const startNormalized = start.clone().normalize();
  const endNormalized = end.clone().normalize();
  const startPos = startNormalized.multiplyScalar(
    Math.max(start.length(), minHeight)
  );
  const endPos = endNormalized.multiplyScalar(
    Math.max(end.length(), minHeight)
  );
  const midPoint = startPos.clone().add(endPos).multiplyScalar(0.5);
  const midDistance = midPoint.length();
  if (midDistance < minHeight) {
    midPoint.normalize().multiplyScalar(minHeight + 0.05);
  }

  const curve = new THREE.QuadraticBezierCurve3(startPos, midPoint, endPos);
  const curvePoints = curve.getPoints(REGION_ARC_POINTS_COUNT);
  const points = curvePoints.map((point) => {
    const distance = point.length();
    if (distance < minHeight) {
      point.normalize().multiplyScalar(minHeight);
    }
    return point;
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.3,
    linewidth: 2,
  });

  return (
    <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />
  );
}
