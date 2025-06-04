import { NextResponse } from 'next/server'
import { auth } from './lib/auth'

// rotas livres
const publicRoutes = ['/signin', '/signup']

// rotas só para autenticados
const privateRoutes = ['/']

// rotas só para ADMIN
const adminRoutes = [
  '/settings',
  '/admin',
  '/admin/users',
  '/admin/units',
  '/admin/unit-types',
  '/admin/rates',
]

export default auth(async req => {
  const { pathname } = req.nextUrl

  const session = await auth()

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  if (!session && isPrivateRoute) {
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  if (isAdminRoute && session?.user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/?error=unauthorized', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
