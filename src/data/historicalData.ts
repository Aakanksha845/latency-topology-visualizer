import { EXCHANGES } from "./exchanges";

export type HistoricalLatencyPoint = {
  timestamp: number;
  latency: number;
};

export type HistoricalData = {
  [key: string]: HistoricalLatencyPoint[];
};

// Generate simulated historical data for all exchange pairs
function generateSimulatedHistoricalData(): HistoricalData {
  const historicalData: HistoricalData = {};
  const now = Date.now();

  // Generate data for the last 30 days (every hour)
  const hoursIn30Days = 30 * 24;
  const timestamps = [];

  for (let i = hoursIn30Days; i >= 0; i--) {
    timestamps.push(now - i * 60 * 60 * 1000);
  }

  // For each pair of exchanges
  for (let i = 0; i < EXCHANGES.length; i++) {
    for (let j = i + 1; j < EXCHANGES.length; j++) {
      const ex1 = EXCHANGES[i];
      const ex2 = EXCHANGES[j];
      const key = `${ex1.id}-${ex2.id}`;

      // Calculate base latency based on distance
      const distance = calculateDistance(ex1.lat, ex1.lng, ex2.lat, ex2.lng);
      const baseLatency = Math.max(20, Math.floor(distance / 100) + 20);

      historicalData[key] = [];

      // Generate historical points
      timestamps.forEach((timestamp, index) => {
        // Add some realistic variation and trends
        const hourOfDay = new Date(timestamp).getHours();
        const dayOfWeek = new Date(timestamp).getDay();

        // Peak hours (trading hours) have higher latency
        const isPeakHour = hourOfDay >= 9 && hourOfDay <= 16;
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        let latencyMultiplier = 1.0;

        if (isPeakHour && !isWeekend) {
          latencyMultiplier = 1.2 + Math.random() * 0.3; // 20-50% increase during peak
        } else if (isWeekend) {
          latencyMultiplier = 0.8 + Math.random() * 0.2; // 20% decrease on weekends
        } else {
          latencyMultiplier = 0.9 + Math.random() * 0.3; // Normal variation
        }

        // Add some random noise
        const noise = (Math.random() - 0.5) * 0.2; // ±10%
        const finalLatency = Math.max(
          10,
          Math.floor(baseLatency * (latencyMultiplier + noise))
        );

        historicalData[key].push({
          timestamp,
          latency: finalLatency,
        });
      });
    }
  }

  return historicalData;
}

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
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

// Pre-generate the historical data
const simulatedHistoricalData = generateSimulatedHistoricalData();

export function getHistoricalData(
  from: string,
  to: string,
  timeRange: "1h" | "24h" | "7d" | "30d" = "24h"
): HistoricalLatencyPoint[] {
  const key = `${from}-${to}`;
  const data = simulatedHistoricalData[key] || [];

  const now = Date.now();
  let cutoffTime = now;

  switch (timeRange) {
    case "1h":
      cutoffTime = now - 60 * 60 * 1000;
      break;
    case "24h":
      cutoffTime = now - 24 * 60 * 60 * 1000;
      break;
    case "7d":
      cutoffTime = now - 7 * 24 * 60 * 60 * 1000;
      break;
    case "30d":
      cutoffTime = now - 30 * 24 * 60 * 60 * 1000;
      break;
  }

  return data.filter((point) => point.timestamp >= cutoffTime);
}

export function getLatencyStats(
  from: string,
  to: string,
  timeRange: "1h" | "24h" | "7d" | "30d" = "24h"
): { min: number; max: number; avg: number; count: number } {
  const data = getHistoricalData(from, to, timeRange);

  if (data.length === 0) {
    return { min: 0, max: 0, avg: 0, count: 0 };
  }

  const latencies = data.map((d) => d.latency);
  const min = Math.min(...latencies);
  const max = Math.max(...latencies);
  const avg = Math.round(
    latencies.reduce((a, b) => a + b, 0) / latencies.length
  );

  return { min, max, avg, count: data.length };
}

export function getAllHistoricalData(): HistoricalData {
  return simulatedHistoricalData;
}
