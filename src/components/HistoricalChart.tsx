"use client";

import { useState, useMemo } from "react";
import {
  HistoricalLatencyPoint,
  getHistoricalData,
  getLatencyStats,
} from "../data/historicalData";
import { EXCHANGES } from "../data/exchanges";
import { motion, AnimatePresence } from "framer-motion";

type HistoricalChartProps = {
  selectedFrom?: string;
  selectedTo?: string;
  isDark: boolean;
  onClose: () => void;
};

export default function HistoricalChart({
  selectedFrom,
  selectedTo,
  isDark,
  onClose,
}: HistoricalChartProps) {
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">(
    "24h"
  );
  const [fromExchange, setFromExchange] = useState<string>(selectedFrom || "");
  const [toExchange, setToExchange] = useState<string>(selectedTo || "");

  const historicalData = useMemo(() => {
    if (!fromExchange || !toExchange) return [];
    return getHistoricalData(fromExchange, toExchange, timeRange);
  }, [fromExchange, toExchange, timeRange]);

  const stats = useMemo(() => {
    if (!fromExchange || !toExchange) return null;
    return getLatencyStats(fromExchange, toExchange, timeRange);
  }, [fromExchange, toExchange, timeRange]);

  const fromExchangeData = EXCHANGES.find((e) => e.id === fromExchange);
  const toExchangeData = EXCHANGES.find((e) => e.id === toExchange);

  if (!selectedFrom && !selectedTo) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-4 right-4 z-50 ${
          isDark ? "bg-gray-900" : "bg-white"
        } rounded-lg shadow-2xl border ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
        style={{ width: "600px", maxWidth: "calc(100vw - 2rem)" }}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Historical Latency Trends
            </h3>
            <button
              onClick={onClose}
              className={`text-xl ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              ×
            </button>
          </div>

          {/* Exchange Selection */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                From Exchange
              </label>
              <select
                value={fromExchange}
                onChange={(e) => setFromExchange(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select exchange...</option>
                {EXCHANGES.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.city})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                To Exchange
              </label>
              <select
                value={toExchange}
                onChange={(e) => setToExchange(e.target.value)}
                className={`w-full px-3 py-2 rounded border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select exchange...</option>
                {EXCHANGES.filter((e) => e.id !== fromExchange).map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="mb-4">
            <div className="flex gap-2">
              {(["1h", "24h", "7d", "30d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    timeRange === range
                      ? isDark
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : isDark
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {range === "1h"
                    ? "1 Hour"
                    : range === "24h"
                    ? "24 Hours"
                    : range === "7d"
                    ? "7 Days"
                    : "30 Days"}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          {stats && stats.count > 0 && (
            <div
              className={`grid grid-cols-4 gap-4 mb-4 p-3 rounded ${
                isDark ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              <div>
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Min
                </div>
                <div
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.min}ms
                </div>
              </div>
              <div>
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Max
                </div>
                <div
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.max}ms
                </div>
              </div>
              <div>
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Average
                </div>
                <div
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.avg}ms
                </div>
              </div>
              <div>
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Samples
                </div>
                <div
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.count}
                </div>
              </div>
            </div>
          )}

          {/* Chart */}
          {historicalData.length > 0 ? (
            <div className="h-64">
              <LineChart data={historicalData} isDark={isDark} />
            </div>
          ) : (
            <div
              className={`h-64 flex items-center justify-center ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {fromExchange && toExchange
                ? "No historical data available for this time range"
                : "Select two exchanges to view historical data"}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function LineChart({
  data,
  isDark,
}: {
  data: HistoricalLatencyPoint[];
  isDark: boolean;
}) {
  const width = 560;
  const height = 240;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const latencies = data.map((d) => d.latency);
  const minLatency = Math.min(...latencies);
  const maxLatency = Math.max(...latencies);
  const latencyRange = maxLatency - minLatency || 1;

  const timeRange = data[data.length - 1]?.timestamp - data[0]?.timestamp || 1;

  const points = data.map((point, index) => {
    const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth;
    const y =
      padding.top +
      chartHeight -
      ((point.latency - minLatency) / latencyRange) * chartHeight;
    return { x, y, latency: point.latency };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${pathData} L ${points[points.length - 1]?.x || 0} ${
    padding.top + chartHeight
  } L ${padding.left} ${padding.top + chartHeight} Z`;

  return (
    <svg width={width} height={height} className="w-full h-full">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = padding.top + chartHeight - ratio * chartHeight;
        const value = Math.round(minLatency + ratio * latencyRange);
        return (
          <g key={ratio}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke={isDark ? "#374151" : "#e5e7eb"}
              strokeWidth={1}
            />
            <text
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill={isDark ? "#9ca3af" : "#6b7280"}
            >
              {value}ms
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path
        d={areaPath}
        fill={isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.1)"}
      />

      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={isDark ? "#3b82f6" : "#2563eb"}
        strokeWidth={2}
      />

      {/* Points */}
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={3}
          fill={isDark ? "#3b82f6" : "#2563eb"}
          className="hover:r-5 transition-all"
        />
      ))}

      {/* X-axis label */}
      <text
        x={width / 2}
        y={height - 5}
        textAnchor="middle"
        fontSize="12"
        fill={isDark ? "#9ca3af" : "#6b7280"}
      >
        Time
      </text>
    </svg>
  );
}
