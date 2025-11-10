"use client";

import { useMemo } from "react";
import { LatencyLink } from "../data/latencyData";

type MetricsDashboardProps = {
  latencyLinks: LatencyLink[];
  isDark: boolean;
  latencyRange: { min: number; max: number };
};

export default function MetricsDashboard({
  latencyLinks,
  isDark,
  latencyRange,
}: MetricsDashboardProps) {
  const metrics = useMemo(() => {
    if (latencyLinks.length === 0) {
      return {
        totalConnections: 0,
        avgLatency: 0,
        minLatency: 0,
        maxLatency: 0,
        lowLatencyCount: 0,
        mediumLatencyCount: 0,
        highLatencyCount: 0,
        activeExchanges: new Set<string>().size,
      };
    }

    // Overall stats from all valid links
    const validLatencies = latencyLinks
      .map((link) => link.latency)
      .filter((latency) => !isNaN(latency));

    const avgLatency =
      validLatencies.length > 0
        ? Math.round(
            validLatencies.reduce((a, b) => a + b, 0) / validLatencies.length
          )
        : 0;
    const minLatency =
      validLatencies.length > 0 ? Math.min(...validLatencies) : 0;
    const maxLatency =
      validLatencies.length > 0 ? Math.max(...validLatencies) : 0;

    // Filter links by latency range for distribution (same as Globe component)
    const visibleLinks = latencyLinks.filter(
      (link) =>
        link.latency >= latencyRange.min && link.latency <= latencyRange.max
    );

    // Count distribution within the visible range
    const lowLatencyCount = visibleLinks.filter(
      (l) => !isNaN(l.latency) && l.latency <= 60
    ).length;
    const mediumLatencyCount = visibleLinks.filter(
      (l) => !isNaN(l.latency) && l.latency > 60 && l.latency <= 120
    ).length;
    const highLatencyCount = visibleLinks.filter(
      (l) => !isNaN(l.latency) && l.latency > 120
    ).length;

    const activeExchanges = new Set<string>();
    latencyLinks.forEach((link) => {
      activeExchanges.add(link.from);
      activeExchanges.add(link.to);
    });

    return {
      totalConnections: latencyLinks.length,
      avgLatency,
      minLatency,
      maxLatency,
      lowLatencyCount,
      mediumLatencyCount,
      highLatencyCount,
      activeExchanges: activeExchanges.size,
    };
  }, [latencyLinks, latencyRange]);

  return (
    <div
      className={`fixed top-4 right-4 z-40 ${
        isDark ? "bg-gray-900" : "bg-white"
      } rounded-lg shadow-lg border ${
        isDark ? "border-gray-700" : "border-gray-200"
      } p-4 hidden lg:block`}
      style={{ minWidth: "250px", maxWidth: "300px" }}
    >
      <h3
        className={`text-lg font-bold mb-4 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Performance Metrics
      </h3>

      <div className="space-y-3">
        <MetricItem
          label="Total Connections"
          value={metrics.totalConnections.toString()}
          isDark={isDark}
        />
        <MetricItem
          label="Active Exchanges"
          value={metrics.activeExchanges.toString()}
          isDark={isDark}
        />
        <MetricItem
          label="Avg Latency"
          value={`${metrics.avgLatency}ms`}
          isDark={isDark}
          color={getLatencyColor(metrics.avgLatency)}
        />
        <MetricItem
          label="Min Latency"
          value={`${metrics.minLatency}ms`}
          isDark={isDark}
          color="green"
        />
        <MetricItem
          label="Max Latency"
          value={`${metrics.maxLatency}ms`}
          isDark={isDark}
          color={getLatencyColor(metrics.maxLatency)}
        />
      </div>

      <div
        className={`mt-4 pt-4 border-t ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div
          className={`text-sm font-semibold mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Latency Distribution
        </div>
        <div className="space-y-2">
          <DistributionBar
            label="Low (≤60ms)"
            count={metrics.lowLatencyCount}
            total={metrics.totalConnections}
            color="green"
            isDark={isDark}
          />
          <DistributionBar
            label="Medium (61-120ms)"
            count={metrics.mediumLatencyCount}
            total={metrics.totalConnections}
            color="yellow"
            isDark={isDark}
          />
          <DistributionBar
            label="High (>120ms)"
            count={metrics.highLatencyCount}
            total={metrics.totalConnections}
            color="red"
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
}

function MetricItem({
  label,
  value,
  isDark,
  color,
}: {
  label: string;
  value: string;
  isDark: boolean;
  color?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${
          isDark ? "text-white" : "text-gray-900"
        }`}
        style={color ? { color } : undefined}
      >
        {value}
      </span>
    </div>
  );
}

function DistributionBar({
  label,
  count,
  total,
  color,
  isDark,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  isDark: boolean;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span
          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {label}
        </span>
        <span
          className={`text-xs font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {count} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div
        className={`h-2 rounded-full overflow-hidden ${
          isDark ? "bg-gray-800" : "bg-gray-200"
        }`}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function getLatencyColor(latency: number): string {
  if (latency <= 60) return "green";
  if (latency <= 120) return "yellow";
  return "red";
}
