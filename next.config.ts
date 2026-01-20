import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
