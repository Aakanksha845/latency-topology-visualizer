# Crypto Latency Topology Visualizer

A comprehensive Next.js application that displays a 3D world map visualizing cryptocurrency exchange server locations and real-time/historical latency data across AWS, GCP, and Azure co-location regions.

![Crypto Latency Visualizer](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-0.181-black?style=for-the-badge&logo=three.js)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Functionality Details](#functionality-details)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Data Sources](#data-sources)
- [Performance Optimization](#performance-optimization)
- [Browser Support](#browser-support)

## 🎯 Overview

This application provides an interactive 3D visualization of cryptocurrency exchange infrastructure, showing:

- **Real-time latency** between exchange servers
- **Historical trends** for latency analysis
- **Cloud provider regions** (AWS, GCP, Azure)
- **Geographic distribution** of exchange data centers

## ✨ Features

### Core Functionality

1. **3D World Map Display**

   - Interactive 3D globe with realistic Earth textures
   - Smooth camera controls (rotate, zoom, pan)
   - Touch controls optimized for mobile devices
   - Real-time rendering with optimized performance

2. **Exchange Server Locations**

   - Visual markers for 15+ major cryptocurrency exchanges
   - Color-coded markers by cloud provider (AWS, GCP, Azure)
   - Hover tooltips showing exchange details
   - Click to select exchanges for historical analysis

3. **Real-time Latency Visualization**

   - Animated arc connections between exchange servers
   - Color-coded latency ranges:
     - 🟢 Green: Low latency (≤60ms)
     - 🟡 Yellow: Medium latency (61-120ms)
     - 🔴 Red: High latency (>120ms)
   - Automatic updates every 8 seconds
   - Pulse animations for active connections

4. **Historical Latency Trends**

   - Time-series charts for selected exchange pairs
   - Multiple time ranges (1 hour, 24 hours, 7 days, 30 days)
   - Statistical metrics (min, max, average)
   - Interactive chart with hover details

5. **Cloud Provider Regions**

   - Visual region boundaries and clusters
   - Provider-specific color coding
   - Region connection visualization
   - Filterable by cloud provider

6. **Interactive Controls**

   - Advanced filtering panel
   - Search functionality for exchanges
   - Toggle switches for visualization layers
   - Latency range sliders
   - Provider and exchange filters

7. **Performance Metrics Dashboard**
   - Real-time connection statistics
   - Average, min, and max latency metrics
   - Latency distribution charts
   - Active exchange count

### Bonus Features

- **Latency Heatmap**: Color-coded heatmap overlay on globe surface
- **Dark/Light Theme**: System preference detection with manual toggle
- **Export Functionality**: Export data as JSON or CSV
- **Responsive Design**: Mobile-optimized interface

## 🔧 How It Works

### Architecture Overview

The application is built using a component-based architecture with the following key systems:

1. **3D Rendering System** (Three.js + React Three Fiber)

   - Renders the 3D globe and all 3D elements
   - Handles camera controls and interactions
   - Manages 3D object lifecycle

2. **Data Management System**

   - Generates realistic latency data based on geographic distance
   - Stores historical data in memory
   - Calculates statistics and trends

3. **State Management**

   - React hooks for local state
   - Context API for theme management
   - Real-time data updates

4. **UI Components**
   - Control panels for filtering
   - Charts for historical data
   - Dashboards for metrics

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- Git (for cloning the repository)

### Steps

1. **Clone the repository:**

```bash
git clone <repository-url>
cd crypto-latency-map
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **(Optional) Configure Environment Variables:**

   Create a `.env.local` file in the project root for real latency data:

   ```bash
   # Uptime Robot API Key (optional - falls back to simulated data)
   UPTIME_ROBOT_API_KEY=your_api_key_here
   NEXT_PUBLIC_UPTIME_ROBOT_API_KEY=your_api_key_here
   ```

   **Note:** Without the API key, the application will use simulated latency data. For production use with real data, obtain an API key from [Uptime Robot](https://uptimerobot.com/) and set up monitors for cryptocurrency exchanges.

4. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## 📖 Usage Guide

### Basic Navigation

#### Viewing the 3D Globe

- **Rotate**: Click and drag on the globe
- **Zoom**: Scroll wheel or pinch gesture on mobile
- **Pan**: Right-click and drag (desktop) or two-finger drag (mobile)

#### Interacting with Exchanges

- **Hover**: Move mouse over exchange markers to see details
- **Click**: Click on an exchange to select it for historical analysis
- **Select Pair**: Click on a second exchange to view latency history between them

### Using the Control Panel

The control panel (left side) provides comprehensive filtering options:

#### 1. Search Exchanges

- Type in the search bar to filter exchanges by name or city
- Results update in real-time

#### 2. Visualization Layers

Toggle these switches to show/hide different visualizations:

- **Real-time Latency**: Shows animated connections between exchanges
- **Historical Trends**: Opens historical chart panel
- **Cloud Regions**: Displays region boundaries and clusters

#### 3. Cloud Provider Filter

- Check/uncheck providers (AWS, GCP, Azure, Other) to filter exchanges
- Only exchanges from selected providers will be visible

#### 4. Latency Range Filter

- Use the two sliders to set minimum and maximum latency
- Only connections within this range will be displayed
- Range: 0ms to 300ms

#### 5. Exchange Selection

- Scroll through the list of exchanges
- Check/uncheck individual exchanges to show/hide them
- Use "Select All" or "Clear Selection" for quick actions

### Viewing Historical Data

1. **Select First Exchange**: Click on an exchange marker on the globe
2. **Select Second Exchange**: Click on another exchange marker
3. **View Chart**: Historical chart panel opens at bottom-right
4. **Choose Time Range**: Select 1h, 24h, 7d, or 30d
5. **View Statistics**: See min, max, average latency for the period
6. **Close Chart**: Click the × button or close button

### Using the Heatmap

1. **Toggle Heatmap**: Click the "🔥 Heatmap" button (bottom-right)
2. **Interpret Colors**:
   - Green areas: Low latency regions
   - Yellow areas: Medium latency regions
   - Red areas: High latency regions
3. **Toggle Off**: Click the button again to hide heatmap

### Exporting Data

1. **Click Export Button**: Bottom-left corner
2. **Choose Export Type**:
   - **Current Data**: Export current latency connections
   - **Historical Data**: Export all stored historical data
3. **Select Format**:
   - **JSON**: Structured data format
   - **CSV**: Spreadsheet-compatible format
4. **Download**: File downloads automatically

### Theme Toggle

- **Toggle Theme**: Click the sun/moon icon in the control panel header
- **Auto-detection**: Theme follows system preference on first load
- **Persistence**: Your preference is saved in localStorage

## 🔍 Functionality Details

### 1. Latency Data Generation

**How it works:**

- Calculates base latency using Haversine formula for geographic distance
- Formula: Base latency ≈ 1ms per 100km + 20ms base overhead
- Adds realistic variation (±20%) and noise (±5ms) for realism
- Updates every 8 seconds to simulate real-time monitoring

**Color Coding:**

- **Green (≤60ms)**: Excellent connection, suitable for high-frequency trading
- **Yellow (61-120ms)**: Good connection, acceptable for most trading
- **Red (>120ms)**: High latency, may cause delays in trading

### 2. Historical Data Storage

**Storage Mechanism:**

- Stores latency data points in memory
- Each connection pair maintains up to 1000 data points
- Timestamps recorded for each measurement
- Automatically prunes old data beyond 1000 points

**Time Range Calculations:**

- **1 Hour**: Last 60 minutes of data
- **24 Hours**: Last 24 hours of data
- **7 Days**: Last 7 days of data
- **30 Days**: Last 30 days of data

### 3. 3D Globe Rendering

**Components:**

- **Earth Mesh**: Sphere with 128x128 segments for smooth rendering
- **Textures**: Day map, normal map, and specular map for realism
- **Lighting**: Ambient and directional lights for depth
- **Stars**: Background starfield for space effect

**Performance:**

- Optimized geometry for smooth 60fps rendering
- Level-of-detail (LOD) considerations for markers
- Efficient texture loading and caching

### 4. Exchange Markers

**Visual Design:**

- Pulsing spheres that scale with animation
- Color-coded by cloud provider:
  - **Orange**: AWS
  - **Purple**: GCP
  - **Cyan**: Azure
  - **Lime**: Other
- Always face camera (billboard effect)
- Hover effects for interactivity

### 5. Arc Connections

**Rendering:**

- Quadratic Bezier curves for smooth arcs
- Height calculated based on distance
- Color based on latency value
- Pulsing opacity animation
- 50 points per curve for smoothness

**Filtering:**

- Only shows connections between visible exchanges
- Respects latency range filter
- Updates when filters change

### 6. Cloud Region Visualization

**Features:**

- Groups exchanges by provider and region
- Calculates center point for each region
- Draws boundary circles around regions
- Shows connections within regions
- Color-coded by provider

### 7. Heatmap Generation

**Algorithm:**

- Creates 30x30 grid of points on globe surface
- For each point, calculates intensity based on:
  - Distance to nearby exchanges
  - Latency values of connections
  - Inverse distance weighting
- Converts intensity to color gradient:
  - Green → Yellow → Red

### 8. Historical Chart

**Chart Components:**

- SVG-based line chart
- Time on X-axis, latency on Y-axis
- Area fill for visual emphasis
- Interactive points showing exact values
- Grid lines for readability

**Statistics Calculation:**

- **Min**: Lowest latency in time range
- **Max**: Highest latency in time range
- **Average**: Mean latency across all points
- **Count**: Number of data points

### 9. Performance Metrics

**Real-time Calculations:**

- Total connections: Count of all active connections
- Active exchanges: Number of unique exchanges in connections
- Average latency: Mean of all connection latencies
- Min/Max latency: Extreme values across all connections
- Distribution: Count of connections in each latency category

### 10. Responsive Design

**Mobile Optimizations:**

- Collapsible control panel
- Touch-friendly controls
- Optimized 3D rendering for mobile GPUs
- Adaptive UI component sizing
- Mobile menu button for easy access

**Breakpoints:**

- **Mobile**: < 768px (md breakpoint)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (lg breakpoint)

## 🛠 Technology Stack

### Core Dependencies

- **Framework**: Next.js 16.0.1 with React 19.2.0 and React DOM 19.2.0
- **3D Rendering**: Three.js 0.181.0 with React Three Fiber 9.4.0
- **3D Utilities**: @react-three/drei 10.7.6
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion 12.23.24
- **Language**: TypeScript 5.x
- **Build Tool**: Next.js built-in (Turbopack)

### Development Dependencies

- **TypeScript Types**: @types/node ^20, @types/react ^19, @types/react-dom ^19
- **Linting**: ESLint ^9 with eslint-config-next 16.0.1
- **CSS Processing**: @tailwindcss/postcss ^4
- **React Compiler**: babel-plugin-react-compiler 1.0.0

### External APIs

- **Uptime Robot API**: For real-time latency monitoring (optional, falls back to simulated data)

## 📁 Project Structure

```
crypto-latency-map/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx           # Main page component
│   │   ├── layout.tsx         # Root layout with metadata
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── Globe.tsx          # 3D globe and main scene
│   │   ├── Marker.tsx         # Exchange marker component
│   │   ├── ArcConnection.tsx  # Latency arc connections
│   │   ├── ControlPanel.tsx   # Filtering and controls
│   │   ├── MetricsDashboard.tsx # Performance metrics
│   │   ├── HistoricalChart.tsx # Time-series chart
│   │   ├── CloudRegions.tsx   # Region visualization
│   │   ├── LatencyHeatmap.tsx # Heatmap overlay
│   │   ├── Legend.tsx         # Color legend
│   │   ├── ExchangeTooltip.tsx # Hover tooltips
│   │   └── ExportButton.tsx   # Export functionality
│   ├── data/                  # Data files
│   │   ├── exchanges.ts       # Exchange locations and info
│   │   └── latencyData.ts     # Latency generation and storage
│   ├── utils/                 # Utility functions
│   │   ├── colors.ts          # Color constants
│   │   ├── coords.ts          # Coordinate conversion
│   │   └── export.ts          # Export utilities
│   └── contexts/              # React contexts
│       └── ThemeContext.tsx   # Theme management
├── public/
│   └── textures/              # Earth texture maps
│       ├── earth_daymap.jpg
│       ├── earth_normal_map.jpg
│       └── earth_specular_map.jpg
├── package.json
├── tsconfig.json
└── README.md
```

## 📊 Data Sources

### Exchange Locations

All coordinates are real-world locations:

- **Singapore** (1.3521°N, 103.8198°E): Binance, KuCoin, MEXC, Bitget
- **Tokyo** (35.6762°N, 139.6503°E): Bybit, Gate.io
- **Hong Kong** (22.3193°N, 114.1694°E): OKX, Huobi, BitMEX
- **San Francisco** (37.7749°N, 122.4194°W): Coinbase
- **Seattle** (47.6062°N, 122.3321°W): Kraken
- **Dubai** (25.2048°N, 55.2708°E): Bitfinex
- **London** (51.5074°N, 0.1278°W): Bitstamp
- **New York** (40.7128°N, 74.0060°W): Gemini
- **Amsterdam** (52.3676°N, 4.9041°E): Deribit

**Note**: Multiple exchanges in the same city use slightly different coordinates to represent different data center locations within that city.

### Latency Data

**Current Implementation:**

- Simulated data based on geographic distance
- Realistic variation and noise
- Historical data stored in memory

**For Production:**
Integrate with real latency monitoring APIs:

- Cloudflare Radar API
- Pingdom API
- Custom monitoring services
- Exchange-provided latency APIs

## ⚡ Performance Optimization

### 3D Rendering

- Efficient geometry (128x128 sphere segments)
- Texture compression and caching
- Optimized shader materials
- Frame rate limiting for battery life

### Data Processing

- Memoized calculations for filtering
- Efficient array operations
- Debounced updates
- Lazy loading of components

### Memory Management

- Automatic cleanup of old historical data
- Efficient data structures
- Component unmounting cleanup

## 🌐 Browser Support

- **Chrome/Edge**: Latest version (recommended)
- **Firefox**: Latest version
- **Safari**: Latest version (macOS/iOS)
- **Mobile**: iOS Safari, Chrome Mobile

**Requirements:**

- WebGL support for 3D rendering
- Modern JavaScript (ES6+)
- Canvas API support

## 🎓 Key Concepts

### Coordinate System

- Uses latitude/longitude (WGS84)
- Converts to 3D Cartesian coordinates for rendering
- Earth radius: 2.5 units in 3D space

### Latency Calculation

- Based on physical distance (Haversine formula)
- Accounts for network infrastructure
- Includes realistic variation

### Real-time Updates

- 8-second update interval
- Smooth transitions between updates
- Non-blocking data generation

## 🔮 Future Enhancements

- Integration with real-time latency APIs
- Database integration for historical data
- User authentication and saved preferences
- Custom exchange addition
- Network topology pathfinding
- Trading volume visualization
- Alert system for high latency
- Multi-language support
- Advanced analytics and predictions

## 📝 Assumptions and Limitations

### Data Assumptions

1. **Latency Data Generation**:

   - Uses simulated data by default (`useSimulatedData = true` in code)
   - When using Uptime Robot API, assumes monitors are named to match exchange names (e.g., "Exchange-Binance-Singapore")
   - Assumes Uptime Robot API availability and proper configuration via `UPTIME_ROBOT_API_KEY` environment variable
   - Latency calculations use Haversine formula: base latency ≈ 1ms per 100km + 20ms overhead

2. **Exchange Locations**:

   - Server coordinates are based on known data center locations
   - Multiple exchanges in same city use slightly offset coordinates
   - Assumes geographic accuracy of exchange data center locations

3. **Latency Thresholds**:
   - Green: ≤60ms (excellent for high-frequency trading)
   - Yellow: 61-120ms (acceptable for most trading)
   - Red: >120ms (high latency, may cause delays)

### Technical Assumptions

4. **Browser Requirements**:

   - WebGL support required for 3D rendering
   - Modern JavaScript (ES6+) support
   - Canvas API support
   - Assumes modern browser capabilities (Chrome/Edge/Firefox/Safari latest versions)

5. **System Requirements**:
   - Node.js 18+ for development and building
   - npm/yarn/pnpm package manager
   - Modern hardware with WebGL-capable GPU for 3D rendering

### Data Storage Limitations

6. **Historical Data**:

   - Stored in memory only (clears on server restart)
   - Maximum 1000 data points per exchange pair
   - No persistent storage across deployments

7. **Real-time Updates**:
   - Updates every 8 seconds (configurable via `LATENCY_UPDATE_INTERVAL`)
   - Assumes stable network connectivity for API calls

### Performance Limitations

8. **3D Rendering**:

   - Optimized for modern devices with WebGL support
   - May experience reduced performance on older devices or low-end mobile GPUs
   - Assumes 60fps target frame rate on capable hardware

9. **Network Topology**:
   - Visualizes connections between all exchange pairs
   - In reality, not all exchanges have direct network connections
   - Assumes full mesh network topology for visualization purposes

### External Dependencies

10. **Uptime Robot API**:
    - Optional dependency for real latency data
    - Free tier limitations: 168 historical data points (7 days at hourly intervals)
    - Requires API key configuration for production use
    - Falls back to simulated data if API unavailable

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Three.js community for excellent 3D graphics library
- React Three Fiber for React integration
- Next.js team for the amazing framework
- All cryptocurrency exchanges for providing trading infrastructure

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using Next.js, Three.js, and TypeScript**

# Getting Real Historical Data from Uptime Robot

## How It Works

Uptime Robot provides **real historical response times** through their API! Here's what we extract:

### What Uptime Robot Gives Us:

```json
{
  "monitors": [
    {
      "id": 123456,
      "friendly_name": "Exchange-Binance-Singapore",
      "average_response_time": 45,
      "response_times": [
        { "datetime": 1699401600, "value": 42 },
        { "datetime": 1699405200, "value": 48 },
        { "datetime": 1699408800, "value": 45 }
        // ... up to 168 data points
      ]
    }
  ]
}
```

### Key Points:

1. **`response_times` array** contains historical latency measurements
2. **`datetime`** is Unix timestamp (seconds)
3. **`value`** is response time in milliseconds
4. **Free tier** stores data at hourly intervals
5. **`response_times_limit: "168"`** = last 7 days (168 hours)

## How the Code Populates Historical Data:

### Step 1: Initial Load

When you first call `generateLatencyData()`:

- Fetches monitors from Uptime Robot
- Extracts `response_times` from each monitor
- Calculates inter-exchange latencies from historical data
- Populates `historicalDataStore` with past 7 days of data

### Step 2: Continuous Updates

Every 3 minutes (or your interval):

- Fetches current latency
- Appends new data point to historical store
- Keeps most recent data points (up to `MAX_HISTORICAL_POINTS`)

## Available Historical Data:

### Immediately Available (from Uptime Robot):

- ✅ **Last 7 days** of data (168 hourly data points)
- ✅ **Real response times** from actual pings
- ✅ **Per-monitor data** for each exchange

### After Running Your App:

- ✅ **More granular data** (every 3 minutes vs. hourly)
- ✅ **Extended history** beyond 7 days (if you keep app running)
- ✅ **Inter-exchange calculations** based on real data

## How to Use in Your Component:

```typescript
import {
  getHistoricalData,
  getLatencyStats,
  refreshHistoricalData,
} from "@/lib/data/latency";

// Get historical data for an exchange pair
const historicalData = getHistoricalData("binance", "okx", "7d");

// Get statistics
const stats = getLatencyStats("binance", "okx", "24h");

// Manually refresh from Uptime Robot (optional)
await refreshHistoricalData();
```

## Time Ranges Available:

### With Fresh Uptime Robot Data:

- ✅ **"1h"** - Last hour (if app has been running)
- ✅ **"24h"** - Last 24 hours (mix of Uptime Robot + app data)
- ✅ **"7d"** - Last 7 days (primarily Uptime Robot historical data)
- ✅ **"30d"** - Last 30 days (only if app has been running that long)

## Data Freshness:

### Uptime Robot Historical Data:

- **Updates:** Every hour (free tier)
- **Available:** Last 7 days (168 points)
- **Loaded:** Once on first API call

### Your App's Data:

- **Updates:** Every 3 minutes (configurable)
- **Available:** While app is running
- **Stored:** In memory (clears on restart)

## Improving Historical Data:

### Option 1: Run App Continuously

Keep your Next.js app running to accumulate more granular data:

```bash
# Production deployment (recommended)
npm run build
npm start
```

### Option 2: Increase Response Times Limit

Get more historical points from Uptime Robot:

```typescript
response_times_limit: "720"; // 30 days at hourly intervals
```

**Note:** Free tier may limit this to 168 points.

### Option 3: Store in Database

For persistent historical data across restarts:

```typescript
// Save to database after fetching
const data = await generateLatencyData();
await saveToDatabase(historicalDataStore);

// Load on startup
historicalDataStore = await loadFromDatabase();
```

## Testing Immediately:

To see historical data right away:

1. **Make sure monitors are running** for at least a few hours
2. **Call `generateLatencyData()`** - it will auto-populate from Uptime Robot
3. **Check the console** for:

   ```
   📊 Populating historical data from Uptime Robot...
     ✅ Binance ↔ OKX: 168 historical points
     ✅ Kraken ↔ Coinbase: 168 historical points
   ```

4. **Open your historical chart** - you should see data immediately!

## Example Console Output:

```
🤖 Fetching Uptime Robot monitors with historical data...
✅ Fetched 6 monitors with historical data
📊 Populating historical data from Uptime Robot...
  ✅ Binance ↔ Bitfinex: 168 historical points
  ✅ Binance ↔ Coinbase: 168 historical points
  ✅ Binance ↔ Kraken: 168 historical points
  ✅ Binance ↔ KuCoin: 168 historical points
  ✅ Binance ↔ OKX: 168 historical points
  ✅ Binance ↔ Gate.io: 168 historical points
  ... (all exchange pairs)
✅ Historical data populated from Uptime Robot
```

## Key Advantage:

**You get 7 days of historical data immediately** without having to wait! The Uptime Robot monitors you created have been collecting data for hours/days, and now we extract all of it.

This is **real production-quality data**, not simulated! 🎉
# latency-topology-visualizer
