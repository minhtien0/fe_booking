// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
const API_URL = process.env.API_URL ?? 'http://localhost:3001'
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      '127.0.0.1'

    const res = await fetch(`${API_URL}/auth/login`, {
      method:  'POST',
      headers: {
        'Content-Type':    'application/json',
        'X-Forwarded-For': ip,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status })
    }

    if (!data.access_token) {
      return NextResponse.json({ message: 'Server không trả token.' }, { status: 500 })
    }

    const isProd      = process.env.NODE_ENV === 'production'
    const accessMaxAge  = data.expires_in ?? 15 * 60
    const refreshMaxAge = 7 * 24 * 60 * 60

    const response = NextResponse.json({ success: true, user: data.user })

    response.cookies.set('admin_access_token', data.access_token, {
      httpOnly: true,
      secure:   isProd,
      sameSite: 'lax',
      maxAge:   accessMaxAge,
      path:     '/',
    })

    response.cookies.set('admin_refresh_token', data.refresh_token, {
      httpOnly: true,
      secure:   isProd,
      sameSite: 'lax',
      maxAge:   refreshMaxAge,
      path:     '/',
    })

    return response

  } catch (err) {
    console.error('[Login Route] Error:', err)
    return NextResponse.json({ message: 'Lỗi kết nối server.' }, { status: 502 })
  }
}