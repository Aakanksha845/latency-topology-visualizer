"use client";

import { useState } from "react";
import { exportLatencyReport, exportHistoricalData } from "../utils/export";
import { LatencyLink } from "../data/latencyData";

type ExportButtonProps = {
  latencyLinks: LatencyLink[];
  isDark: boolean;
};

export default function ExportButton({
  latencyLinks,
  isDark,
}: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`px-4 py-2 rounded-lg shadow-lg font-medium ${
          isDark
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        📥 Export Data
      </button>

      {showMenu && (
        <div
          className={`absolute bottom-full left-0 mb-2 rounded-lg shadow-xl border ${
            isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
          } p-2 min-w-[200px]`}
        >
          <div className={`text-xs font-semibold mb-2 px-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            Current Data
          </div>
          <button
            onClick={() => {
              exportLatencyReport(latencyLinks, "json");
              setShowMenu(false);
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm mb-1 ${
              isDark
                ? "hover:bg-gray-800 text-gray-300"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            Export as JSON
          </button>
          <button
            onClick={() => {
              exportLatencyReport(latencyLinks, "csv");
              setShowMenu(false);
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm mb-2 ${
              isDark
                ? "hover:bg-gray-800 text-gray-300"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            Export as CSV
          </button>

          <div className={`border-t my-2 ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`} />

          <div className={`text-xs font-semibold mb-2 px-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            Historical Data
          </div>
          <button
            onClick={() => {
              exportHistoricalData("json");
              setShowMenu(false);
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm mb-1 ${
              isDark
                ? "hover:bg-gray-800 text-gray-300"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            Export Historical (JSON)
          </button>
          <button
            onClick={() => {
              exportHistoricalData("csv");
              setShowMenu(false);
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm ${
              isDark
                ? "hover:bg-gray-800 text-gray-300"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            Export Historical (CSV)
          </button>
        </div>
      )}
    </div>
  );
}

