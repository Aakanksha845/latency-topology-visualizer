/**
 * Performance monitoring hook
 * Tracks FPS and provides performance metrics
 */

import { useEffect, useState, useRef } from "react";

export function usePerformance() {
  const [fps, setFps] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const fpsHistory = useRef<number[]>([]);

  useEffect(() => {
    lastTime.current = performance.now();
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime.current;

      if (delta >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / delta);
        setFps(currentFps);

        // Keep last 10 FPS readings
        fpsHistory.current.push(currentFps);
        if (fpsHistory.current.length > 10) {
          fpsHistory.current.shift();
        }

        // Calculate average FPS
        const avgFps =
          fpsHistory.current.reduce((a, b) => a + b, 0) /
          fpsHistory.current.length;

        // Mark as low performance if average FPS < 30
        setIsLowPerformance(avgFps < 30);

        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return { fps, isLowPerformance };
}

/**
 * Hook to detect mobile device
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

/**
 * Debounce hook for performance optimization
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
