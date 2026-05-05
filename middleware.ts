import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['pt', 'en'] as const
type Locale = typeof SUPPORTED_LOCALES[number]
const DEFAULT_LOCALE: Locale = 'pt'
// Rotas que NÃO devem ser prefixadas com /pt ou /en — administração + auth.
const NON_LOCALIZED_PREFIXES = ['/dashboard', '/login', '/auth', '/api', '/_next', '/sitemap.xml', '/robots.txt', '/manifest.webmanifest', '/opengraph-image', '/twitter-image', '/.well-known']

function detectLocale(req: NextRequest): Locale {
  // 1) Cookie de preferência (set pelo LanguageSwitcher)
  const cookieLang = req.cookies.get('NEXT_LOCALE')?.value as Locale | undefined
  if (cookieLang && SUPPORTED_LOCALES.includes(cookieLang)) return cookieLang
  // 2) Accept-Language header — pega primeiro idioma suportado
  const accept = req.headers.get('accept-language') ?? ''
  const langs = accept.split(',').map(s => s.split(';')[0].trim().toLowerCase())
  for (const l of langs) {
    if (l.startsWith('pt')) return 'pt'
    if (l.startsWith('en')) return 'en'
  }
  return DEFAULT_LOCALE
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1) Rotas administrativas / técnicas — saltar i18n e ir direto à auth Supabase.
  const isNonLocalized = NON_LOCALIZED_PREFIXES.some(p => pathname.startsWith(p))

  // 2) Aplicar i18n routing apenas para o site público.
  if (!isNonLocalized) {
    const firstSeg = pathname.split('/')[1]
    const hasLocale = SUPPORTED_LOCALES.includes(firstSeg as Locale)
    if (!hasLocale) {
      const locale = detectLocale(request)
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
      return NextResponse.redirect(url)
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create a supabase client strictly for the middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verifica a sessão atualizada de forma segura
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Proteger Dashboard — qualquer utilizador autenticado é admin
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webm|mp4|mp3|ico|woff|woff2|ttf|otf)$).*)',
  ],
}
