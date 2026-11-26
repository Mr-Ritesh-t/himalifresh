import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable X-Powered-By header to avoid exposing framework version
  poweredByHeader: false,

  // Enable modern high-performance response compression
  compress: true,

  // Image optimization: unoptimized so direct /api/images & /images URLs work on Cloudflare Workers
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000, // 30 days image cache
    remotePatterns: [
      {
        protocol: "https",
        hostname: "t3.storage.dev",
      },
      {
        protocol: "https",
        hostname: "*.storage.dev",
      },
    ],
  },

  // Tree-shake and optimize modular packages for faster JS execution & smaller bundles
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // High-performance caching and security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.boosthis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://www.boosthis.com; frame-src 'self' https://www.google.com https://maps.google.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
