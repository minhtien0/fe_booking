import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    middlewarePrefetch: 'flexible',
  },
};

export default nextConfig;