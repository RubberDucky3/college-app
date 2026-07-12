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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://adservice.google.com https://adservice.google.de",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: http:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https: ws:",
              "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
