import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_HERCULES_URL: 'http://localhost:3001',
    NEXT_PUBLIC_API_BASE_URL: 'http://localhost:3002',
  },
};

export default nextConfig;
