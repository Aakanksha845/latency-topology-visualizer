"use client";

import { useState, useEffect } from "react";
import Globe from "@/components/Globe";
import Legend from "@/components/Legend";
import ControlPanel from "@/components/ControlPanel";
import MetricsDashboard from "@/components/MetricsDashboard";
import HistoricalChart from "@/components/HistoricalChart";
import ExportButton from "@/components/ExportButton";
import { useTheme } from "@/contexts/ThemeContext";
import { LatencyLink } from "@/data/latencyData";
import { EXCHANGES, Exchange } from "@/data/exchanges";
import { LATENCY_UPDATE_INTERVAL } from "@/constants";
import { useDebounce } from "@/hooks/usePerformance";
import { fetchLatencyData } from "@/services/latencyService";

export default function HomeContent() {
  const { isDark, toggleTheme } = useTheme();

  const [selectedExchanges, setSelectedExchanges] = useState<string[]>(
    EXCHANGES.map((e) => e.id)
  );
  const [selectedProviders, setSelectedProviders] = useState<string[]>([
    "AWS",
    "GCP",
    "Azure",
    "Other",
  ]);
  const [latencyRange, setLatencyRange] = useState({ min: 0, max: 300 });
  const [showRealTime, setShowRealTime] = useState(true);
  const [showHistorical, setShowHistorical] = useState(false);
  const [showRegions, setShowRegions] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [latencyLinks, setLatencyLinks] = useState<LatencyLink[]>([]);
  const [selectedChartPair, setSelectedChartPair] = useState<{
    from?: string;
    to?: string;
  }>({});

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update latency data periodically
  useEffect(() => {
    const updateLatencyData = async () => {
      try {
        const data = await fetchLatencyData();
        setLatencyLinks(data);
      } catch (error) {
        console.error("Failed to update latency data:", error);
        // Fallback to simulated data if API fails
        // For now, we'll use empty array as fallback since we moved the function to API
        setLatencyLinks([]);
        // Reset latency range to show simulated data
        setLatencyRange({ min: 0, max: 300 });
      }
    };

    // Initial load
    updateLatencyData();

    // Set up periodic updates
    const interval = setInterval(updateLatencyData, LATENCY_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleExchangeClick = (exchange: Exchange) => {
    // Toggle selection or open historical chart
    if (selectedChartPair.from && selectedChartPair.from !== exchange.id) {
      setSelectedChartPair({ from: selectedChartPair.from, to: exchange.id });
      setShowHistorical(true);
    } else {
      setSelectedChartPair({ from: exchange.id });
    }
  };

  return (
    <main
      className={`flex justify-center items-center min-h-screen ${
        isDark ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <div className="w-full h-screen relative">
        <Globe
          selectedExchanges={selectedExchanges}
          selectedProviders={selectedProviders}
          latencyRange={latencyRange}
          showRealTime={showRealTime}
          showRegions={showRegions}
          showHeatmap={showHeatmap}
          onExchangeClick={handleExchangeClick}
          latencyLinks={latencyLinks}
        />

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowControlPanel(!showControlPanel)}
          className={`md:hidden fixed top-4 left-4 z-50 px-4 py-2 rounded-lg shadow-lg font-medium ${
            isDark
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-white text-gray-900 hover:bg-gray-100"
          }`}
        >
          ☰ Menu
        </button>

        <div className="hidden md:block">
          <ControlPanel
            selectedExchanges={selectedExchanges}
            selectedProviders={selectedProviders}
            latencyRange={latencyRange}
            showRealTime={showRealTime}
            showHistorical={showHistorical}
            showRegions={showRegions}
            onExchangeFilterChange={setSelectedExchanges}
            onProviderFilterChange={setSelectedProviders}
            onLatencyRangeChange={setLatencyRange}
            onToggleRealTime={setShowRealTime}
            onToggleHistorical={setShowHistorical}
            onToggleRegions={setShowRegions}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDark={isDark}
            onThemeToggle={toggleTheme}
          />
        </div>

        {showControlPanel && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setShowControlPanel(false)}
          >
            <div
              className="fixed left-0 top-0 h-full w-80 bg-gray-900 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ControlPanel
                selectedExchanges={selectedExchanges}
                selectedProviders={selectedProviders}
                latencyRange={latencyRange}
                showRealTime={showRealTime}
                showHistorical={showHistorical}
                showRegions={showRegions}
                onExchangeFilterChange={setSelectedExchanges}
                onProviderFilterChange={setSelectedProviders}
                onLatencyRangeChange={setLatencyRange}
                onToggleRealTime={setShowRealTime}
                onToggleHistorical={setShowHistorical}
                onToggleRegions={setShowRegions}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                isDark={isDark}
                onThemeToggle={toggleTheme}
              />
            </div>
          </div>
        )}

        <MetricsDashboard
          latencyLinks={latencyLinks}
          isDark={isDark}
          latencyRange={latencyRange}
        />
        <Legend />
        <ExportButton latencyLinks={latencyLinks} isDark={isDark} />

        {showHistorical && (
          <HistoricalChart
            selectedFrom={selectedChartPair.from}
            selectedTo={selectedChartPair.to}
            isDark={isDark}
            onClose={() => {
              setShowHistorical(false);
              setSelectedChartPair({});
            }}
          />
        )}

        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`fixed bottom-4 right-4 z-40 px-4 py-2 rounded-lg shadow-lg font-medium ${
            showHeatmap
              ? isDark
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-green-500 text-white hover:bg-green-600"
              : isDark
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          }`}
        >
          {showHeatmap ? "🔥 Heatmap ON" : "🔥 Heatmap OFF"}
        </button>
      </div>
    </main>
  );
}
