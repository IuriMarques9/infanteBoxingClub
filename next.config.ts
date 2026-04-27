import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Lint é executado em dev. O build não bloqueia por warnings.
    ignoreDuringBuilds: true,
  },
  images: {
    // O Next serve as imagens em AVIF (mais compacto) com fallback
    // automático para WebP — reduz peso ~50% face ao PNG/JPEG original.
    formats: ['image/avif', 'image/webp'],
    // Cache no edge durante 1 ano. As imagens são content-hashed
    // pelo Next, por isso é seguro fazer caching agressivo.
    minimumCacheTTL: 60 * 60 * 24 * 365,
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
};

export default nextConfig;
