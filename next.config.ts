import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.sellerpintar.com"
      }
    ]
  }
};

export default nextConfig;
