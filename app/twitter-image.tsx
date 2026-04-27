// O Next.js usa o mesmo ficheiro para Twitter Card se existir
// `twitter-image`. Reaproveitamos o opengraph para evitar duplicação
// — basta re-exportar.
export { default, alt, size, contentType, runtime } from './opengraph-image'
