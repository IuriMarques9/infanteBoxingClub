// O Next.js usa o mesmo ficheiro para Twitter Card se existir
// `twitter-image`. Reaproveitamos o opengraph para evitar duplicação
// — basta re-exportar. O `runtime` é route segment config e tem de ser
// declarado literalmente no ficheiro (Next.js 15 não permite re-export).
export const runtime = 'nodejs'
export { default, alt, size, contentType } from './opengraph-image'
