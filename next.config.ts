import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://icon-icons.com',
        port: '',
        pathname: '/icons2/**',
      },
    ],
  },
}

export default nextConfig
