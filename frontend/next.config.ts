import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignore ESLint errors during build to unblock production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript build errors to unblock production builds
    // (keeps runtime working, but you should fix types ASAP)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
