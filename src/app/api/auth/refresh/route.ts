// src/app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server'
const API_URL = process.env.API_URL ?? 'http://localhost:3001'
export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('admin_refresh_token')?.value

  if (!refreshToken) {
    return NextResponse.json({ message: 'Phiên đăng nhập đã hết hạn.' }, { status: 401 })
  }

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refresh_token: refreshToken }),
    })

    const data = await res.json()

    if (!res.ok) {
      const response = NextResponse.json(data, { status: res.status })
      response.cookies.set('admin_access_token', '', { maxAge: 0, path: '/' })
      response.cookies.set('admin_refresh_token', '', { maxAge: 0, path: '/' })
      return response
    }

    const isProd   = process.env.NODE_ENV === 'production'
    const response = NextResponse.json({ success: true, user: data.user })

    response.cookies.set('admin_access_token', data.access_token, {
      httpOnly: true,
      secure:   isProd,
      sameSite: 'lax',
      maxAge:   data.expires_in ?? 15 * 60,
      path:     '/',
    })

    return response

  } catch {
    return NextResponse.json({ message: 'Lỗi kết nối server.' }, { status: 502 })
  }
}