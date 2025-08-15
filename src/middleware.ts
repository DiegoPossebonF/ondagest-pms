import { type NextRequest, NextResponse } from 'next/server'
import { auth } from './lib/auth'

// rotas livres
const publicRoutes = ['/signin', '/signup', '/verify-email']

// rotas só para autenticados
const privateRoutes = ['/']

// rotas só para ADMIN
const adminRoutes = [
  '/reports',
  '/settings',
  '/admin',
  '/admin/users',
  '/admin/units',
  '/admin/unit-types',
  '/admin/rates',
]

export default async function middleware(req: NextRequest) {
  const referer = req.headers.get('referer')
  const { pathname } = req.nextUrl

  const session = await auth()

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    if (session && pathname === '/signin') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  }

  if (!session && isPrivateRoute) {
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  if (isAdminRoute && session?.user.role !== 'ADMIN') {
    const redirectUrl = new URL(referer || '/', req.url)
    redirectUrl.searchParams.set('error', 'unauthorized')

    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
