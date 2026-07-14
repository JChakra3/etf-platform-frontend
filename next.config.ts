import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allows fetching from FastAPI backend during SSR (ETF detail page)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'https://etf-platform-backend.onrender.com'}/:path*`,
      },
    ]
  },
}

export default nextConfig
