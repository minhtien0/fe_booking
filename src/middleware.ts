import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? '')

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Chỉ xử lý /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token = req.cookies.get('admin_access_token')?.value

  if (!token) {
    return redirectToLogin(req, 'unauthenticated')
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)

    if (payload.role !== 'Admin' || payload.scope !== 'admin') {
      return NextResponse.redirect(new URL('/403', req.url))
    }

    const res = NextResponse.next()

    res.headers.set('x-user-role', String(payload.role))
    res.headers.set('x-user-id', String(payload.sub ?? ''))

    return res
  } catch (err: any) {
    const res = redirectToLogin(
      req,
      err?.code === 'ERR_JWT_EXPIRED'
        ? 'token_expired'
        : 'unauthenticated'
    )

    res.cookies.delete('admin_access_token')
    res.cookies.delete('admin_refresh_token')

    return res
  }
}

function redirectToLogin(req: NextRequest, reason: string) {
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('reason', reason)
  url.searchParams.set('from', req.nextUrl.pathname)

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}