import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas públicas (sem login)
const publicRoutes = [
  '/signin',
  '/signup',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
]

// Rotas privadas (exigem login)
const privateRoutes = ['/']

// Rotas somente para ADMIN / OWNER
const adminRoutes = [
  '/reports',
  '/settings',
  '/admin',
  '/admin/users',
  '/admin/units',
  '/admin/unit-types',
  '/admin/rates',
]

// ⚙️ Função auxiliar — checa se o usuário está autenticado
function hasAuthCookie(req: NextRequest): boolean {
  const cookies = req.cookies
  // Auth.js usa cookies diferentes dependendo do ambiente
  return Boolean(
    cookies.get('__Secure-authjs.session-token') ||
      cookies.get('authjs.session-token') ||
      cookies.get('__Secure-next-auth.session-token') ||
      cookies.get('next-auth.session-token')
  )
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const referer = req.headers.get('referer')

  const isPublic = publicRoutes.some(r => pathname.startsWith(r))
  const isPrivate = privateRoutes.some(r => pathname.startsWith(r))
  const isAdmin = adminRoutes.some(r => pathname.startsWith(r))

  const isLoggedIn = hasAuthCookie(req)

  // 🔓 Se rota pública
  if (isPublic) {
    // Usuário logado não deve acessar /signin
    if (isLoggedIn && pathname === '/signin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }

  // 🔐 Se rota privada e não logado
  if (isPrivate && !isLoggedIn) {
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  // ⚠️ Proteção básica de rota admin
  // Como o cookie não carrega `role`, a checagem completa será feita no servidor
  if (isAdmin && !isLoggedIn) {
    const redirectUrl = new URL('/signin', req.url)
    redirectUrl.searchParams.set('error', 'unauthorized')
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

// 🔧 Configuração: aplica a todas as rotas (exceto estáticos / APIs)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
