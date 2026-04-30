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
  // ─── SECURITY HEADERS ──────────────────────────────────────────
  // Aplicados a todas as rotas. Lighthouse "Best Practices" e Mozilla
  // Observatory pontuam estes cabeçalhos. CSP propositadamente omitido
  // — mal configurado parte inline scripts/styles do Next em produção.
  // HSTS sem `preload` por agora (preload é cache irreversível dos
  // browsers; activar só após 6 meses estáveis).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), payment=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
};

export default nextConfig;
