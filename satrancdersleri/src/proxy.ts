import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') || pathname.startsWith('/profil')) {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.redirect(new URL('/giris', req.url))
    }
    if (pathname.startsWith('/admin') && session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/profil/:path*'],
}
