import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// ─── OPEN GRAPH IMAGE 1200×630 ─────────────────────────────────
// Gerado dinamicamente pelo Next.js (edge runtime via @vercel/og).
// Compõe o logo (PNG quadrado) com a marca + tagline numa landscape
// 1200×630 — formato exigido por Facebook, Twitter/X, LinkedIn.
// Aplica-se a TODAS as rotas que não definam o seu próprio og image.

export const runtime = 'nodejs'  // permite ler ficheiros locais
export const alt = 'Infante Boxing Club — Ginásio de Boxe em Olhão'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  // Carrega o logo do sistema de ficheiros (Edge não permite URL fetch
  // local mas Node runtime permite readFile).
  const logoPath = join(process.cwd(), 'public', 'infanteLogoSemFundo.png')
  const logoBuffer = readFileSync(logoPath)
  const logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
          color: 'white',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* glow gold no canto superior esquerdo */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: -200,
            width: 600,
            height: 600,
            background:
              'radial-gradient(circle, rgba(232, 181, 91, 0.25) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        {/* glow gold no canto inferior direito */}
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: -200,
            width: 500,
            height: 500,
            background:
              'radial-gradient(circle, rgba(232, 181, 91, 0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top row: logo + selo Federação */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Infante Boxing Club"
            width={140}
            height={140}
            style={{ objectFit: 'contain' }}
          />
          <div
            style={{
              display: 'flex',
              padding: '10px 22px',
              border: '2px solid rgba(232, 181, 91, 0.5)',
              borderRadius: 999,
              fontSize: 18,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#E8B55B',
              fontWeight: 700,
            }}
          >
            Federação Portuguesa de Boxe
          </div>
        </div>

        {/* Centro: título + tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            zIndex: 1,
            marginTop: 40,
          }}
        >
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: '#E8B55B',
              letterSpacing: -2,
              lineHeight: 1,
              textShadow: '0 0 40px rgba(232, 181, 91, 0.4)',
              display: 'flex',
            }}
          >
            INFANTE
          </div>
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: 'white',
              letterSpacing: -2,
              lineHeight: 1,
              display: 'flex',
            }}
          >
            BOXING CLUB
          </div>
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.7)',
              marginTop: 30,
              maxWidth: 900,
              display: 'flex',
            }}
          >
            Ginásio de Boxe em Olhão · Competição, Manutenção e Educativo
          </div>
        </div>

        {/* Bottom row: CTA + URL */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 18,
                letterSpacing: 4,
                color: '#E8B55B',
                fontWeight: 700,
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              1ª aula grátis
            </div>
            <div
              style={{
                fontSize: 22,
                color: 'rgba(255, 255, 255, 0.5)',
                display: 'flex',
              }}
            >
              infanteboxingclub.pt
            </div>
          </div>
          {/* faixa decorativa */}
          <div
            style={{
              display: 'flex',
              gap: 10,
            }}
          >
            <div style={{ width: 60, height: 6, background: '#E8B55B', display: 'flex' }} />
            <div style={{ width: 30, height: 6, background: 'rgba(232, 181, 91, 0.5)', display: 'flex' }} />
            <div style={{ width: 12, height: 6, background: 'rgba(232, 181, 91, 0.25)', display: 'flex' }} />
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
