import { LatencyLink } from "@/data/latencyData";

export const fetchLatencyData = async (): Promise<LatencyLink[]> => {
  try {
    const response = await fetch("/api/latency");
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch latency data from API:", error);
    throw error;
  }
};
