// ─── VALIDADORES PT ──────────────────────────────────────────────
// Validações leves para CC (Cartão de Cidadão), NIF e telefone PT.
// Strings vazias / null retornam null (sem erro) — campo opcional.

/**
 * Cartão de Cidadão Português — 8 dígitos + 1 dígito de controlo + 2 caracteres alfanuméricos.
 * Formato: NNNNNNNN N AAN (12 caracteres, com ou sem espaços).
 * Aceitamos só comprimento + alfanumérico; checksum oficial é overkill aqui.
 */
export function validateCC(value: string | null | undefined): string | null {
  if (!value) return null
  const clean = value.replace(/[\s-]/g, '').toUpperCase()
  if (clean.length === 0) return null
  if (clean.length !== 12) return 'CC deve ter 12 caracteres (ex: 12345678 9 ZZ4)'
  if (!/^\d{9}[A-Z0-9]{3}$/.test(clean)) return 'CC mal formado: 9 dígitos + 3 alfanuméricos'
  return null
}

/**
 * NIF Português — 9 dígitos com checksum mod 11.
 * Algoritmo oficial: soma ponderada dos primeiros 8 dígitos (pesos 9..2),
 * resto da divisão por 11; dígito de controlo = 0 se resto < 2, senão 11 - resto.
 */
export function validateNIF(value: string | null | undefined): string | null {
  if (!value) return null
  const clean = value.replace(/[\s-]/g, '')
  if (clean.length === 0) return null
  if (!/^\d{9}$/.test(clean)) return 'NIF deve ter 9 dígitos'
  // Primeiro dígito tem prefixos válidos
  const first = clean[0]
  const validFirst = ['1','2','3','5','6','8','9']
  if (!validFirst.includes(first)) return 'NIF começa com dígito inválido'
  let sum = 0
  for (let i = 0; i < 8; i++) sum += parseInt(clean[i], 10) * (9 - i)
  const rest = sum % 11
  const expected = rest < 2 ? 0 : 11 - rest
  if (parseInt(clean[8], 10) !== expected) return 'NIF inválido (checksum)'
  return null
}

/**
 * Telefone PT — móvel (9 dígitos começando 9) ou fixo (9 dígitos começando 2).
 * Aceita prefixo internacional opcional +351.
 */
export function validatePhonePT(value: string | null | undefined): string | null {
  if (!value) return null
  const clean = value.replace(/[\s\-()]/g, '')
  if (clean.length === 0) return null
  const stripped = clean.startsWith('+351') ? clean.slice(4) : clean
  if (!/^\d{9}$/.test(stripped)) return 'Telefone deve ter 9 dígitos (ex: 912345678)'
  if (!/^[29]/.test(stripped)) return 'Telefone PT começa por 2 (fixo) ou 9 (móvel)'
  return null
}

/** Valida vários campos de uma vez. Retorna mapa { campo -> erro } só com os que falharam. */
export function runValidators(values: Record<string, { value: string | null | undefined; rule: (v: any) => string | null }>): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const [field, { value, rule }] of Object.entries(values)) {
    const err = rule(value)
    if (err) errors[field] = err
  }
  return errors
}
