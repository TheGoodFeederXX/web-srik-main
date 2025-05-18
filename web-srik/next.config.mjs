/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'db-pic.thegoodfeeder.xyz',
        port: '',
        pathname: '/**',
      }
    ],
  },
}

export default nextConfig
