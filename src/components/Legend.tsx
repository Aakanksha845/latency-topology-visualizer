"use client";
import { providerColors } from "@/utils/colors";
import { useTheme } from "@/contexts/ThemeContext";

export default function Legend() {
  const { isDark } = useTheme();

  return (
    <div
      className={`fixed top-102 right-4 z-40 ${
        isDark ? "bg-gray-900" : "bg-white"
      } rounded-lg shadow-lg border ${
        isDark ? "border-gray-700" : "border-gray-200"
      } p-4`}
      style={{ minWidth: "200px" }}
    >
      <div
        className={`text-sm font-bold mb-3 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Cloud Providers
      </div>
      <ul className="space-y-2 mb-4">
        {Object.entries(providerColors).map(([key, color]) => (
          <li key={key} className="flex items-center">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: color }}
            ></span>
            <span
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {key}
            </span>
          </li>
        ))}
      </ul>

      <div
        className={`border-t pt-3 ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div
          className={`text-sm font-bold mb-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Latency Colors
        </div>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full mr-2 bg-green-500"></span>
            <span
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Low ({"≤"}60ms)
            </span>
          </li>
          <li className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full mr-2 bg-yellow-500"></span>
            <span
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Medium (61-120ms)
            </span>
          </li>
          <li className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full mr-2 bg-red-500"></span>
            <span
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              High ({">"}120ms)
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
