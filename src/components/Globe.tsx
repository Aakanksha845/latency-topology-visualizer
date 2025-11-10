"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo, useEffect, useState, memo, useCallback } from "react";
import { EXCHANGES, Exchange } from "../data/exchanges";
import Marker from "./Marker";
import ExchangeTooltip from "./ExchangeTooltip";
import ArcConnection from "./ArcConnection";
import { LatencyLink } from "../data/latencyData";
import CloudRegions from "./CloudRegions";
import LatencyHeatmap from "./LatencyHeatmap";
import {
  EARTH_RADIUS,
  EARTH_SEGMENTS,
  STARS_COUNT_DESKTOP,
  STARS_COUNT_MOBILE,
  COLORS,
} from "../constants";
import { useIsMobile } from "../hooks/usePerformance";

// Memoized Earth component for performance
const Earth = memo(() => {
  const earthRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshPhongMaterial>(null!);

  const textures = useLoader(THREE.TextureLoader, [
    "/textures/earth_daymap.jpg",
    "/textures/earth_normal_map.jpg",
    "/textures/earth_specular_map.jpg",
  ]);

  const [dayMap, normalMap, specularMap] = useMemo(() => {
    textures.forEach((t) => {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1, 1);
    });
    return textures;
  }, [textures]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.specularMap = specularMap;
      materialRef.current.needsUpdate = true;
    }
  }, [specularMap]);

  return (
    <mesh ref={earthRef} rotation={[0.4, 0, 0]}>
      <sphereGeometry args={[EARTH_RADIUS, EARTH_SEGMENTS, EARTH_SEGMENTS]} />
      <meshPhongMaterial
        ref={materialRef}
        map={dayMap}
        normalMap={normalMap}
        shininess={8}
        specular={new THREE.Color(0x222222)}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
});

Earth.displayName = "Earth";

type GlobeProps = {
  selectedExchanges: string[];
  selectedProviders: string[];
  latencyRange: { min: number; max: number };
  showRealTime: boolean;
  showRegions: boolean;
  showHeatmap: boolean;
  onExchangeClick?: (exchange: Exchange) => void;
  latencyLinks: LatencyLink[];
};

const Globe = ({
  selectedExchanges,
  selectedProviders,
  latencyRange,
  showRealTime,
  showRegions,
  showHeatmap,
  onExchangeClick,
  latencyLinks,
}: GlobeProps) => {
  const [hoveredExchange, setHoveredExchange] = useState<Exchange | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  // Memoize exchange lookup map for O(1) access
  const exchangeMap = useMemo(
    () => new Map(EXCHANGES.map((ex) => [ex.id, ex])),
    []
  );

  // Filter exchanges based on selection - memoized for performance
  const visibleExchanges = useMemo(() => {
    if (selectedExchanges.length === 0 && selectedProviders.length === 4) {
      return EXCHANGES; // All selected, return all
    }
    return EXCHANGES.filter(
      (ex) =>
        (selectedExchanges.length === 0 || selectedExchanges.includes(ex.id)) &&
        selectedProviders.includes(ex.provider)
    );
  }, [selectedExchanges, selectedProviders]);

  // Create Set for O(1) lookup
  const visibleExchangeSet = useMemo(
    () => new Set(visibleExchanges.map((e) => e.id)),
    [visibleExchanges]
  );

  // Filter latency links - optimized with early returns
  const visibleLatencyLinks = useMemo(() => {
    if (!showRealTime || latencyLinks.length === 0) return [];

    return latencyLinks.filter((link) => {
      // Early return if not in latency range
      if (link.latency < latencyRange.min || link.latency > latencyRange.max) {
        return false;
      }

      // Use map for O(1) lookup instead of find
      const from = exchangeMap.get(link.from);
      const to = exchangeMap.get(link.to);
      if (!from || !to) return false;

      // Use Set for O(1) lookup
      return visibleExchangeSet.has(from.id) && visibleExchangeSet.has(to.id);
    });
  }, [
    latencyLinks,
    showRealTime,
    latencyRange,
    visibleExchangeSet,
    exchangeMap,
  ]);

  // Memoize color getter function
  const getProviderColor = useCallback((provider: Exchange["provider"]) => {
    return COLORS[provider] || COLORS.Other;
  }, []);

  // Optimized mouse tracking with throttling
  useEffect(() => {
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "90vh", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 8], near: 0.01, far: 1000 }}
        performance={{ min: 0.5 }}
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.4} />
        <Stars
          radius={100}
          depth={50}
          count={isMobile ? STARS_COUNT_MOBILE : STARS_COUNT_DESKTOP}
          factor={4}
          fade
        />

        <Earth />

        {/* Latency Heatmap */}
        <LatencyHeatmap latencyLinks={latencyLinks} showHeatmap={showHeatmap} />

        {/* Cloud Regions */}
        <CloudRegions
          showRegions={showRegions}
          selectedProviders={selectedProviders}
        />

        {/* Exchange Markers */}
        {visibleExchanges.map((exchange) => (
          <Marker
            key={exchange.id}
            lat={exchange.lat}
            lng={exchange.lng}
            color={getProviderColor(exchange.provider)}
            onPointerOver={() => setHoveredExchange(exchange)}
            onPointerOut={() => setHoveredExchange(null)}
            onClick={() => onExchangeClick?.(exchange)}
          />
        ))}

        {/* Latency Connections */}
        {visibleLatencyLinks.map((link) => {
          const from = exchangeMap.get(link.from);
          const to = exchangeMap.get(link.to);
          if (!from || !to) return null;

          return (
            <ArcConnection
              key={`${link.from}-${link.to}`}
              start={{ lat: from.lat, lng: from.lng }}
              end={{ lat: to.lat, lng: to.lng }}
              color={link.color}
            />
          );
        })}

        <OrbitControls
          enableZoom
          enableRotate
          enablePan
          autoRotate={false}
          minDistance={3.5}
          maxDistance={50}
          touches={{
            ONE: 0,
            TWO: 2,
          }}
        />
      </Canvas>

      <ExchangeTooltip
        visible={!!hoveredExchange}
        x={mousePos.x}
        y={mousePos.y}
        name={hoveredExchange?.name}
        city={hoveredExchange?.city}
        region={hoveredExchange?.region}
        provider={hoveredExchange?.provider}
      />
    </div>
  );
};

export default Globe;
