import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Disable compression as it can interfere with streaming responses
  compress: false,
  experimental: {},
};

export default nextConfig;
