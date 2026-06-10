// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL ?? 'http://localhost:3001'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const accessToken  = cookieStore.get('admin_access_token')?.value
  const refreshToken = cookieStore.get('admin_refresh_token')?.value

  // Gọi NestJS logout để blacklist access token + xoá refresh token khỏi DB
  if (accessToken) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken ?? '' }),
      })
    } catch {
      // NestJS lỗi vẫn tiếp tục xoá cookie phía client
    }
  }

  // Xoá tất cả cookie → middleware sẽ chặn /admin
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_access_token',  '', { httpOnly: true,  maxAge: 0, path: '/' })
  response.cookies.set('admin_refresh_token', '', { httpOnly: true,  maxAge: 0, path: '/' })
  response.cookies.set('admin_logged_in',     '', { httpOnly: false, maxAge: 0, path: '/' })

  return response
}