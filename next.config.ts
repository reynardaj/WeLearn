import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fvfpqb05pisf0qtu.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      // You can add other hostnames here as well
    ],
  },
};

export default nextConfig;
