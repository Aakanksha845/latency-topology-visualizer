import { NextRequest, NextResponse } from "next/server";
import { EXCHANGES } from "@/data/exchanges";
import {
  LATENCY_LOW_THRESHOLD,
  LATENCY_MEDIUM_THRESHOLD,
  MAX_HISTORICAL_POINTS,
} from "@/constants";

// Uptime Robot API configuration
const UPTIME_ROBOT_API_KEY =
  process.env.UPTIME_ROBOT_API_KEY ||
  process.env.NEXT_PUBLIC_UPTIME_ROBOT_API_KEY ||
  null;
const UPTIME_ROBOT_BASE_URL = "https://api.uptimerobot.com/v2";

let useSimulatedData = true; // Force simulated data for testing

const monitorLatencyCache: {
  [monitorId: string]: {
    latency: number | null;
    timestamp: number;
    lastAttempt: number;
  };
} = {};
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes - poll every 3 minutes

export type LatencyLink = {
  from: string;
  to: string;
  latency: number; // in ms
  color: string;
  timestamp: number;
};

export type HistoricalLatencyPoint = {
  timestamp: number;
  latency: number;
};

export type HistoricalData = {
  [key: string]: HistoricalLatencyPoint[];
};

const historicalDataStore: HistoricalData = {};
const baseLatencies: { [key: string]: number } = {};

function initializeBaseLatencies() {
  for (let i = 0; i < EXCHANGES.length; i++) {
    for (let j = i + 1; j < EXCHANGES.length; j++) {
      const key = `${EXCHANGES[i].id}-${EXCHANGES[j].id}`;
      const distance = calculateDistance(
        EXCHANGES[i].lat,
        EXCHANGES[i].lng,
        EXCHANGES[j].lat,
        EXCHANGES[j].lng
      );
      baseLatencies[key] = Math.max(20, Math.floor(distance / 100) + 20);
    }
  }
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

interface UptimeRobotMonitor {
  id: number;
  friendly_name: string;
  url: string;
  status: number;
  average_response_time: number; // milliseconds
  custom_http_statuses?: string;
  response_times?: Array<{
    datetime: number;
    value: number;
  }>;
}

interface UptimeRobotResponse {
  stat: string;
  monitors?: UptimeRobotMonitor[];
  pagination?: {
    offset: number;
    limit: number;
    total: number;
  };
}

async function fetchUptimeRobotMonitors(): Promise<UptimeRobotMonitor[]> {
  if (!UPTIME_ROBOT_API_KEY) {
    console.warn("Uptime Robot API key not configured");
    return [];
  }

  try {
    const response = await fetch(`${UPTIME_ROBOT_BASE_URL}/getMonitors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: new URLSearchParams({
        api_key: UPTIME_ROBOT_API_KEY,
        format: "json",
        response_times: "1", // Include response times
        response_times_limit: "168", // Last 168 data points (7 days at 1 hour intervals)
      }),
    });

    if (!response.ok) {
      console.warn(`Uptime Robot API failed: ${response.status}`);
      return [];
    }

    const data: UptimeRobotResponse = await response.json();

    if (data.stat !== "ok" || !data.monitors) {
      console.warn("Uptime Robot API returned error:", data);
      return [];
    }

    return data.monitors;
  } catch (error) {
    console.error("Failed to fetch Uptime Robot monitors:", error);
    return [];
  }
}

/**
 * Populate historical data store from Uptime Robot's response_times
 * This extracts real historical data from the API
 */
function populateHistoricalDataFromMonitors(monitors: UptimeRobotMonitor[]) {
  // Create a map of exchange ID to monitor
  const exchangeToMonitorMap: { [exchangeId: string]: UptimeRobotMonitor } = {};

  EXCHANGES.forEach((exchange) => {
    const monitor = monitors.find((m) => {
      const friendlyName = m.friendly_name.toLowerCase();
      const url = m.url.toLowerCase();
      const searchName = exchange.name.toLowerCase();

      return (
        friendlyName.includes(searchName) ||
        url.includes(searchName) ||
        friendlyName.includes(exchange.id.toLowerCase())
      );
    });

    if (monitor) {
      exchangeToMonitorMap[exchange.id] = monitor;
    }
  });

  // Now populate historical data for each exchange pair
  for (let i = 0; i < EXCHANGES.length; i++) {
    for (let j = i + 1; j < EXCHANGES.length; j++) {
      const ex1 = EXCHANGES[i];
      const ex2 = EXCHANGES[j];
      const key = [ex1.id, ex2.id].sort().join("-");

      const monitor1 = exchangeToMonitorMap[ex1.id];
      const monitor2 = exchangeToMonitorMap[ex2.id];

      // If we have historical data for both monitors
      if (monitor1?.response_times && monitor2?.response_times) {
        const distance = calculateDistance(ex1.lat, ex1.lng, ex2.lat, ex2.lng);

        // Use the longer response_times array as the base
        const baseResponseTimes =
          monitor1.response_times.length >= monitor2.response_times.length
            ? monitor1.response_times
            : monitor2.response_times;
        historicalDataStore[key] = [];

        // Generate historical points from real Uptime Robot data
        baseResponseTimes.forEach((rt1, index) => {
          const rt2 =
            monitor2.response_times?.[index] || monitor2.response_times?.[0];

          if (rt1 && rt2) {
            const latency1 = rt1.value;
            const latency2 = rt2.value;
            const avgLatency = (latency1 + latency2) / 2;
            const distanceComponent = Math.max(5, Math.floor(distance / 200));
            const calculatedLatency = Math.max(
              10,
              Math.floor(avgLatency + distanceComponent)
            );

            const variation = (Math.random() - 0.5) * 0.1;
            const finalLatency = Math.max(
              10,
              Math.floor(calculatedLatency * (1 + variation))
            );

            historicalDataStore[key].push({
              timestamp: rt1.datetime * 1000, // Convert to milliseconds
              latency: finalLatency,
            });
          }
        });
      }
    }
  }
}

async function fetchExchangeLatency(
  exchangeId: string,
  exchangeName: string
): Promise<number | null> {
  const cached = monitorLatencyCache[exchangeId];
  const now = Date.now();

  // Return cached data if still valid
  if (
    cached &&
    cached.lastAttempt &&
    now - cached.lastAttempt < CACHE_DURATION
  ) {
    if (cached.latency !== null) {
      return cached.latency;
    }
    return null;
  }

  if (!UPTIME_ROBOT_API_KEY) {
    console.warn(`No UPTIME_ROBOT_API_KEY configured`);
    return null;
  }

  try {
    const monitors = await fetchUptimeRobotMonitors();
    const monitor = monitors.find((m) => {
      const friendlyName = m.friendly_name.toLowerCase();
      const url = m.url.toLowerCase();
      const searchName = exchangeName.toLowerCase();

      return (
        friendlyName.includes(searchName) ||
        url.includes(searchName) ||
        friendlyName.includes(exchangeId.toLowerCase())
      );
    });

    if (!monitor) {
      console.warn(
        `No monitor found for exchange: ${exchangeName} (${exchangeId}). Searched in:`,
        monitors.map((m) => ({ name: m.friendly_name, url: m.url }))
      );
      monitorLatencyCache[exchangeId] = {
        latency: null,
        timestamp: now,
        lastAttempt: now,
      };
      return null;
    }

    const latency = monitor.average_response_time;

    // Cache the result
    monitorLatencyCache[exchangeId] = {
      latency,
      timestamp: now,
      lastAttempt: now,
    };

    return latency;
  } catch (error) {
    console.warn(`Failed to fetch latency for ${exchangeName}:`, error);
    monitorLatencyCache[exchangeId] = {
      latency: null,
      timestamp: now,
      lastAttempt: now,
    };
    return null;
  }
}

function calculateInterExchangeLatency(
  exchange1Latency: number | null,
  exchange2Latency: number | null,
  distance: number
): number {
  // If we have real data for both exchanges
  if (exchange1Latency !== null && exchange2Latency !== null) {
    const avgLatency = (exchange1Latency + exchange2Latency) / 2;
    const distanceComponent = Math.max(5, Math.floor(distance / 200));
    return Math.max(10, Math.floor(avgLatency + distanceComponent));
  }

  // If we have data for one exchange
  if (exchange1Latency !== null) {
    return Math.max(10, Math.floor(exchange1Latency + Math.random() * 20));
  }
  if (exchange2Latency !== null) {
    return Math.max(10, Math.floor(exchange2Latency + Math.random() * 20));
  }

  // Fallback to distance-based calculation
  return Math.max(20, Math.floor(distance / 100) + 20);
}

// Initialize on first load
if (Object.keys(baseLatencies).length === 0) {
  initializeBaseLatencies();
}

async function generateLatencyData(): Promise<LatencyLink[]> {
  const links: LatencyLink[] = [];
  const timestamp = Date.now();

  // If using simulated data
  if (useSimulatedData) {
    return generateSimulatedLatencyData(timestamp);
  }

  try {
    // Fetch latency data for all exchanges
    const exchangeLatencyPromises = EXCHANGES.map((ex) =>
      fetchExchangeLatency(ex.id, ex.name)
    );
    const exchangeLatencies = await Promise.all(exchangeLatencyPromises);

    // Create a map of exchange ID to latency
    const exchangeLatencyMap: { [id: string]: number | null } = {};
    EXCHANGES.forEach((ex, index) => {
      exchangeLatencyMap[ex.id] = exchangeLatencies[index];
    });

    // Generate latency links using real data
    for (let i = 0; i < EXCHANGES.length; i++) {
      for (let j = i + 1; j < EXCHANGES.length; j++) {
        if (
          EXCHANGES[i].lat === EXCHANGES[j].lat &&
          EXCHANGES[i].lng === EXCHANGES[j].lng
        ) {
          continue;
        }

        const key = `${EXCHANGES[i].id}-${EXCHANGES[j].id}`;
        const distance = calculateDistance(
          EXCHANGES[i].lat,
          EXCHANGES[i].lng,
          EXCHANGES[j].lat,
          EXCHANGES[j].lng
        );

        const exchange1Latency = exchangeLatencyMap[EXCHANGES[i].id];
        const exchange2Latency = exchangeLatencyMap[EXCHANGES[j].id];

        let latency = calculateInterExchangeLatency(
          exchange1Latency,
          exchange2Latency,
          distance
        );

        // Add realistic variation
        const variation = (Math.random() - 0.5) * 0.2;
        const noise = (Math.random() - 0.5) * 5;
        latency = Math.max(10, Math.floor(latency * (1 + variation) + noise));

        let color = "green";
        if (latency > LATENCY_MEDIUM_THRESHOLD) color = "red";
        else if (latency > LATENCY_LOW_THRESHOLD) color = "yellow";

        const link: LatencyLink = {
          from: EXCHANGES[i].id,
          to: EXCHANGES[j].id,
          latency,
          color,
          timestamp,
        };

        links.push(link);

        // Store historical data
        if (!historicalDataStore[key]) {
          historicalDataStore[key] = [];
        }
        historicalDataStore[key].push({ timestamp, latency });

        if (historicalDataStore[key].length > MAX_HISTORICAL_POINTS) {
          historicalDataStore[key].shift();
        }
      }
    }

    return links;
  } catch (error) {
    console.error(
      "Failed to generate real latency data, falling back to simulated:",
      error
    );
    useSimulatedData = true;
    return generateSimulatedLatencyData(timestamp);
  }
}

function generateSimulatedLatencyData(timestamp: number): LatencyLink[] {
  const links: LatencyLink[] = [];

  for (let i = 0; i < EXCHANGES.length; i++) {
    for (let j = i + 1; j < EXCHANGES.length; j++) {
      if (
        EXCHANGES[i].lat === EXCHANGES[j].lat &&
        EXCHANGES[i].lng === EXCHANGES[j].lng
      ) {
        continue;
      }

      const key = `${EXCHANGES[i].id}-${EXCHANGES[j].id}`;
      const baseLatency = baseLatencies[key] || 50;

      const variation = (Math.random() - 0.5) * 0.4;
      const noise = (Math.random() - 0.5) * 10;
      const latency = Math.max(
        10,
        Math.floor(baseLatency * (1 + variation) + noise)
      );

      let color = "green";
      if (latency > LATENCY_MEDIUM_THRESHOLD) color = "red";
      else if (latency > LATENCY_LOW_THRESHOLD) color = "yellow";

      const link: LatencyLink = {
        from: EXCHANGES[i].id,
        to: EXCHANGES[j].id,
        latency,
        color,
        timestamp,
      };

      links.push(link);

      if (!historicalDataStore[key]) {
        historicalDataStore[key] = [];
      }
      historicalDataStore[key].push({ timestamp, latency });

      if (historicalDataStore[key].length > MAX_HISTORICAL_POINTS) {
        historicalDataStore[key].shift();
      }
    }
  }

  return links;
}

export async function GET(request: NextRequest) {
  try {
    const latencyData = await generateLatencyData();
    return NextResponse.json({ data: latencyData });
  } catch (error) {
    console.error("Error generating latency data:", error);
    return NextResponse.json(
      { error: "Failed to generate latency data" },
      { status: 500 }
    );
  }
}
