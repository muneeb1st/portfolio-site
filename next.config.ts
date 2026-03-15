import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack for production builds (use Webpack instead)
  turbopack: false,
};

export default nextConfig;