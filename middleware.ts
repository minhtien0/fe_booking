import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? ''
)

export async function middleware(req: NextRequest) {
  console.log('[MW] hit:', req.nextUrl.pathname)
  const { pathname } = req.nextUrl

  // ── Whitelist: bỏ qua hoàn toàn ──────────────────────────────────────────
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/proxy/') ||
    pathname.startsWith('/favicon') ||
    pathname === '/login' ||
    pathname === '/403' ||
    pathname === '/404'
  ) {
    return NextResponse.next()
  }

  // ── Chỉ guard /admin* ────────────────────────────────────────────────────
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
    res.headers.set('x-user-id', String(payload.sub ?? ''))
    res.headers.set('x-user-email', String(payload.email ?? ''))
    res.headers.set('x-user-name', String(payload.name ?? ''))
    res.headers.set('x-user-role', String(payload.role ?? ''))
    return res

  } catch (err: any) {
    const isExpired = err?.code === 'ERR_JWT_EXPIRED'
    const res = redirectToLogin(req, isExpired ? 'token_expired' : 'invalid_token')
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

// ── Matcher: dùng regex để bắt /admin và MỌI sub-path ────────────────────
export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
  ],
}