import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Replace this with your exact dev URL
    allowedDevOrigins: [
      "https://9003-idx-studio-1745204271320.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev",
    ],
  },
};

export default nextConfig;
