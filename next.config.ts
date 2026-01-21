import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8055',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/assets/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/directus-api/:path*',
        destination: `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
