// Tradução automática PT->EN via DeepL Free + glossário.
// Free tier: 500.000 caracteres/mês.
// Setup:
//   1. Conta DeepL API Free → https://www.deepl.com/pro-api
//   2. .env.local: DEEPL_API_KEY=...:fx
//   3. (opcional) .env.local: DEEPL_GLOSSARY_ID=... — glossário PT->EN com termos a NÃO traduzir
//      (marcas, nomes próprios, abreviaturas). Cria com a Glossaries API da DeepL.

const DEEPL_ENDPOINT = 'https://api-free.deepl.com/v2/translate'

interface TranslateOpts {
  /** Devolve o texto original sem traduzir (ex.: moradas, nomes próprios soltos). */
  keepAsIs?: boolean
}

export async function translatePtToEn(
  text: string | null | undefined,
  opts: TranslateOpts = {},
): Promise<string | null> {
  if (!text) return null
  const trimmed = text.trim()
  if (!trimmed) return null
  if (opts.keepAsIs) return trimmed

  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) {
    console.warn('[translate] DEEPL_API_KEY ausente — a devolver PT como fallback')
    return trimmed
  }

  const params = new URLSearchParams({
    text: trimmed,
    source_lang: 'PT',
    target_lang: 'EN-GB',
    preserve_formatting: '1',
  })
  const glossaryId = process.env.DEEPL_GLOSSARY_ID
  if (glossaryId) params.set('glossary_id', glossaryId)

  try {
    const res = await fetch(DEEPL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      cache: 'no-store',
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.warn('[translate] DeepL HTTP', res.status, body.slice(0, 200))
      return null
    }
    const data = await res.json() as { translations?: Array<{ text?: string }> }
    const result = data.translations?.[0]?.text
    if (!result) {
      console.warn('[translate] DeepL sem tradução para:', trimmed.slice(0, 60))
      return null
    }
    return result.trim()
  } catch (err) {
    console.warn('[translate] erro DeepL:', err)
    return null
  }
}

/**
 * Traduz vários campos em paralelo.
 * `keepAsIs` lista as chaves que devem ficar tal como estão (ex.: moradas).
 */
export async function translateFields<T extends Record<string, string | null | undefined>>(
  fields: T,
  opts: { keepAsIs?: (keyof T)[] } = {},
): Promise<Record<keyof T, string | null>> {
  const keepSet = new Set<string>(opts.keepAsIs as string[] | undefined)
  const entries = Object.entries(fields)
  const results = await Promise.all(
    entries.map(async ([k, v]) => [k, await translatePtToEn(v, { keepAsIs: keepSet.has(k) })] as const),
  )
  return Object.fromEntries(results) as Record<keyof T, string | null>
}
