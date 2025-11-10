// Earth and 3D Scene Constants
export const EARTH_RADIUS = 2.5;
export const EARTH_SEGMENTS = 64;
export const MARKER_HEIGHT = 2.52;
export const ARC_MIN_HEIGHT = 2.55;
export const ARC_MID_HEIGHT = 2.8;
export const REGION_CONNECTION_HEIGHT = 2.53;

// Performance Constants
export const LATENCY_UPDATE_INTERVAL = 60000; // 1 minute
export const STARS_COUNT_DESKTOP = 5000;
export const STARS_COUNT_MOBILE = 2000;
export const ARC_POINTS_COUNT = 50;
export const REGION_ARC_POINTS_COUNT = 20;
export const HEATMAP_GRID_SIZE = 30;

// Latency Thresholds
export const LATENCY_LOW_THRESHOLD = 60; // ms
export const LATENCY_MEDIUM_THRESHOLD = 120; // ms
export const LATENCY_MAX = 300; // ms

// Color Constants
export const COLORS = {
  AWS: "#ffff00", // yellow
  GCP: "#800080", // purple
  Azure: "#00ffff", // cyan
  Other: "#00ff00", // lime
  Low: "#00ff00", // green
  Medium: "#ffff00", // yellow
  High: "#ff0000", // red
} as const;

// Animation Constants
export const ANIMATION_SPEED = 3;
export const PULSE_SPEED = 2;
export const MARKER_PULSE_SPEED = 3;

// Responsive Breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

// Historical Data Limits
export const MAX_HISTORICAL_POINTS = 1000;
export const HISTORICAL_TIME_RANGES = ["1h", "24h", "7d", "30d"] as const;

// Export Formats
export const EXPORT_FORMATS = ["json", "csv"] as const;
