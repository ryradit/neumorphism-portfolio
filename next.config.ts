import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.ryradit.my.id',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
