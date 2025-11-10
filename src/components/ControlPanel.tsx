"use client";

import { useState, useMemo } from "react";
import { EXCHANGES } from "../data/exchanges";
import { motion } from "framer-motion";
import {
  getSecondaryButtonClasses,
  getPrimaryButtonClasses,
  getPanelBgClasses,
  getHeaderTextClasses,
  getLabelTextClasses,
  getInputClasses,
  getSectionHeaderClasses,
  getListItemTextClasses,
  getListItemHoverClasses,
  getToggleLabelClasses,
  getCheckboxLabelClasses,
} from "../utils/theme";

type ControlPanelProps = {
  selectedExchanges: string[];
  selectedProviders: string[];
  latencyRange: { min: number; max: number };
  showRealTime: boolean;
  showHistorical: boolean;
  showRegions: boolean;
  onExchangeFilterChange: (exchanges: string[]) => void;
  onProviderFilterChange: (providers: string[]) => void;
  onLatencyRangeChange: (range: { min: number; max: number }) => void;
  onToggleRealTime: (show: boolean) => void;
  onToggleHistorical: (show: boolean) => void;
  onToggleRegions: (show: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;

  isDark: boolean;
  onThemeToggle?: () => void;
};

export default function ControlPanel({
  selectedExchanges,
  selectedProviders,
  latencyRange,
  showRealTime,
  showHistorical,
  showRegions,
  onExchangeFilterChange,
  onProviderFilterChange,
  onLatencyRangeChange,
  onToggleRealTime,
  onToggleHistorical,
  onToggleRegions,
  searchQuery,
  onSearchChange,
  isDark,
  onThemeToggle,
}: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const providers = ["AWS", "GCP", "Azure", "Other"];

  const handleExchangeToggle = (exchangeId: string) => {
    if (selectedExchanges.includes(exchangeId)) {
      onExchangeFilterChange(
        selectedExchanges.filter((id) => id !== exchangeId)
      );
    } else {
      onExchangeFilterChange([...selectedExchanges, exchangeId]);
    }
  };

  const handleProviderToggle = (provider: string) => {
    if (selectedProviders.includes(provider)) {
      onProviderFilterChange(selectedProviders.filter((p) => p !== provider));
    } else {
      onProviderFilterChange([...selectedProviders, provider]);
    }
  };

  // Memoize filtered exchanges for performance
  const filteredExchanges = useMemo(() => {
    if (!searchQuery.trim()) return EXCHANGES;
    const query = searchQuery.toLowerCase();
    return EXCHANGES.filter(
      (ex) =>
        ex.name.toLowerCase().includes(query) ||
        ex.city?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <motion.div
      initial={{ x: -400 }}
      animate={{ x: isOpen ? 0 : -350 }}
      transition={{ type: "spring", damping: 25 }}
      className={`fixed left-0 top-0 h-full z-50 ${getPanelBgClasses(
        isDark
      )} shadow-2xl`}
      style={{ width: "400px", maxWidth: "90vw" }}
    >
      <div className="h-full overflow-y-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={getHeaderTextClasses(isDark)}>Controls</h2>
          <div className="flex gap-2">
            <button
              onClick={onThemeToggle}
              className={getSecondaryButtonClasses(isDark)}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={getSecondaryButtonClasses(isDark)}
            >
              {isOpen ? "◀" : "▶"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className={getLabelTextClasses(isDark)}>
            Search Exchanges
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or city..."
            className={getInputClasses(isDark)}
          />
        </div>

        {/* Visualization Toggles */}
        <div className="mb-6">
          <h3 className={getSectionHeaderClasses(isDark)}>
            Visualization Layers
          </h3>
          <div className="space-y-2">
            <ToggleSwitch
              label="Real-time Latency"
              checked={showRealTime}
              onChange={onToggleRealTime}
              isDark={isDark}
            />
            <ToggleSwitch
              label="Historical Trends"
              checked={showHistorical}
              onChange={onToggleHistorical}
              isDark={isDark}
            />
            <ToggleSwitch
              label="Cloud Regions"
              checked={showRegions}
              onChange={onToggleRegions}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Cloud Provider Filter */}
        <div className="mb-6">
          <h3 className={getSectionHeaderClasses(isDark)}>Cloud Providers</h3>
          <div className="space-y-2">
            {providers.map((provider) => (
              <label key={provider} className={getCheckboxLabelClasses(isDark)}>
                <input
                  type="checkbox"
                  checked={selectedProviders.includes(provider)}
                  onChange={() => handleProviderToggle(provider)}
                  className="mr-2 w-4 h-4"
                />
                <span>{provider}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Latency Range Filter */}
        <div className="mb-6">
          <h3 className={getSectionHeaderClasses(isDark)}>
            Latency Range: {latencyRange.min}ms - {latencyRange.max}ms
          </h3>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="300"
              value={latencyRange.min}
              onChange={(e) =>
                onLatencyRangeChange({
                  min: parseInt(e.target.value),
                  max: latencyRange.max,
                })
              }
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="300"
              value={latencyRange.max}
              onChange={(e) =>
                onLatencyRangeChange({
                  min: latencyRange.min,
                  max: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Exchange Filter */}
        <div className="mb-6">
          <h3 className={getSectionHeaderClasses(isDark)}>
            Exchanges ({filteredExchanges.length})
          </h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredExchanges.map((exchange) => (
              <label
                key={exchange.id}
                className={`${getListItemHoverClasses(
                  isDark
                )} ${getListItemTextClasses(isDark)}`}
              >
                <input
                  type="checkbox"
                  checked={selectedExchanges.includes(exchange.id)}
                  onChange={() => handleExchangeToggle(exchange.id)}
                  className="mr-2 w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium">{exchange.name}</div>
                  <div className="text-xs opacity-70">
                    {exchange.city} • {exchange.provider}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className={getSectionHeaderClasses(isDark)}>Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => onExchangeFilterChange(EXCHANGES.map((e) => e.id))}
              className={getPrimaryButtonClasses(isDark)}
            >
              Select All Exchanges
            </button>
            <button
              onClick={() => onExchangeFilterChange([])}
              className={getSecondaryButtonClasses(isDark)}
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
  isDark,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isDark: boolean;
}) {
  return (
    <label className={getToggleLabelClasses(isDark)}>
      <span>{label}</span>
      <div
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-blue-500" : isDark ? "bg-gray-700" : "bg-gray-300"
        }`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
    </label>
  );
}
