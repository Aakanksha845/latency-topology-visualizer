import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/cloudflare/:path*",
        destination: "https://api.cloudflare.com/client/v4/radar/:path*",
      },
      {
        source: "/api/uptimerobot/:path*",
        destination: "https://api.uptimerobot.com/:path*",
      },
    ];
  },
};

export default nextConfig;
