// ─── DADOS DO NEGÓCIO ─ SINGLE SOURCE OF TRUTH ─────────────────
// Centraliza todos os dados imutáveis do clube para evitar divergência
// entre ficheiros (já houve bugs de morada Nº4 vs Nº5, emails diferentes
// e horário 21h vs 22h em sítios diferentes).
//
// Quem precisar destes valores importa daqui:
//   - app/layout.tsx (JSON-LD)
//   - lib/content.ts (strings PT/EN)
//   - components/layout/Footer.tsx
//   - components/sections/Loc.tsx
//   - app/manifest.ts
//
// Para mudar morada/email/horário: edita SÓ aqui.

export const BUSINESS = {
  name: 'Infante Boxing Club',
  alternateName: 'Infante Boxing',
  legalName: 'Associação Infante Boxing Club',
  description: {
    pt: 'Ginásio de boxe em Olhão filiado na Federação Portuguesa de Boxe. Aulas de boxe de competição, manutenção e educativo para todos os níveis.',
    en: 'Boxing gym in Olhão affiliated with the Portuguese Boxing Federation. Competition, maintenance, and educational boxing classes for all levels.',
  },
  email: 'associacao.infante@gmail.com',
  phone: '+351 910 389 071',
  /** Só dígitos — para `tel:` e `https://wa.me/`. */
  phoneDigits: '351910389071',
  address: {
    /** Linha única, formato pt-PT — usar para apresentação humana. */
    full: 'Rua Dâmaso da Encarnação Nº 5, 8700-247 Olhão',
    street: 'Rua Dâmaso da Encarnação Nº 5',
    locality: 'Olhão',
    region: 'Faro',
    postalCode: '8700-247',
    /** ISO 3166-1 alpha-2. */
    country: 'PT',
  },
  /** Coordenadas reais (do embed Google Maps), não as do schema antigo. */
  geo: {
    lat: 37.0337,
    lng: -7.8463,
  },
  hours: {
    /** Em formato 24h "HH:MM". */
    open: '17:00',
    close: '21:00',
    /** Códigos schema.org/DayOfWeek (curto): Mo Tu We Th Fr Sa Su. */
    days: ['Mo', 'Tu', 'We', 'Th', 'Fr'] as const,
    /** Apresentação humana. */
    label: { pt: 'Seg–Sex · 17h–21h', en: 'Mon–Fri · 17h–21h' },
  },
  founded: '2020',
  /** Faixa de preço schema.org — €€ é o tier "moderado". */
  priceRange: '€€',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=100088583096544',
    instagram: 'https://www.instagram.com/infanteboxing_club/',
  },
  parent: {
    name: 'Federação Portuguesa de Boxe',
    url: 'https://www.fpboxe.pt',
  },
  /** Catálogo de serviços (turmas) para JSON-LD OfferCatalog. */
  services: [
    { name: 'Boxe Competição', minAge: 13 },
    { name: 'Boxe Manutenção', minAge: 18 },
    { name: 'Boxe Educativo - Gatinhos', minAge: 5, maxAge: 7 },
    { name: 'Boxe Educativo - Suricatas', minAge: 8, maxAge: 10 },
    { name: 'Boxe Educativo - Leões', minAge: 11, maxAge: 13 },
    { name: 'Boxe Mulheres', audienceType: 'Women' as const },
  ],
} as const

/** URL do mapa do Google embebido no site. Aponta à morada exacta. */
export const MAPS_EMBED_URL =
  'https://www.google.com/maps?q=Rua+D%C3%A2maso+da+Encarna%C3%A7%C3%A3o+5+8700-247+Olh%C3%A3o&output=embed'

/** Link wa.me directo para WhatsApp. */
export const WHATSAPP_URL = `https://wa.me/${BUSINESS.phoneDigits}`

/** Link mailto directo. */
export const MAILTO_URL = `mailto:${BUSINESS.email}`
