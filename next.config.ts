import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "/Users/jeromefrancis/Documents/college-app",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logos.hunter.io",
      },
    ],
  },
};

export default nextConfig;
