import { LatencyLink } from "../data/latencyData";
import { EXCHANGES } from "../data/exchanges";
import { getAllHistoricalData } from "../data/latencyData";

export function exportLatencyReport(
  latencyLinks: LatencyLink[],
  format: "json" | "csv" = "json"
) {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    totalConnections: latencyLinks.length,
    exchanges: EXCHANGES.map((ex) => ({
      id: ex.id,
      name: ex.name,
      city: ex.city,
      region: ex.region,
      provider: ex.provider,
    })),
    connections: latencyLinks.map((link) => {
      const from = EXCHANGES.find((e) => e.id === link.from);
      const to = EXCHANGES.find((e) => e.id === link.to);
      return {
        from: from?.name || link.from,
        to: to?.name || link.to,
        latency: link.latency,
        color: link.color,
        timestamp: new Date(link.timestamp).toISOString(),
      };
    }),
    statistics: {
      avgLatency: Math.round(
        latencyLinks.reduce((sum, link) => sum + link.latency, 0) /
          latencyLinks.length
      ),
      minLatency: Math.min(...latencyLinks.map((l) => l.latency)),
      maxLatency: Math.max(...latencyLinks.map((l) => l.latency)),
    },
  };

  if (format === "csv") {
    const csvRows = [
      ["From Exchange", "To Exchange", "Latency (ms)", "Status", "Timestamp"],
      ...latencyLinks.map((link) => {
        const from = EXCHANGES.find((e) => e.id === link.from);
        const to = EXCHANGES.find((e) => e.id === link.to);
        return [
          from?.name || link.from,
          to?.name || link.to,
          link.latency.toString(),
          link.color,
          new Date(link.timestamp).toISOString(),
        ];
      }),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `latency-report-${timestamp.replace(/:/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    const jsonContent = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `latency-report-${timestamp.replace(/:/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export function exportHistoricalData(format: "json" | "csv" = "json") {
  const historicalData = getAllHistoricalData();
  const timestamp = new Date().toISOString();

  if (format === "csv") {
    const csvRows = [
      ["From Exchange", "To Exchange", "Latency (ms)", "Timestamp"],
    ];

    Object.entries(historicalData).forEach(([key, points]) => {
      const [fromId, toId] = key.split("-");
      const from = EXCHANGES.find((e) => e.id === fromId);
      const to = EXCHANGES.find((e) => e.id === toId);

      points.forEach((point) => {
        csvRows.push([
          from?.name || fromId,
          to?.name || toId,
          point.latency.toString(),
          new Date(point.timestamp).toISOString(),
        ]);
      });
    });

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historical-latency-${timestamp.replace(/:/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    const report = {
      timestamp,
      historicalData,
    };
    const jsonContent = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historical-latency-${timestamp.replace(/:/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

