// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
export async function POST() {
  const response = NextResponse.json({ success: true })

  response.cookies.set('admin_access_token', '', {
    httpOnly: true,
    maxAge:   0,
    path:     '/',
  })
  response.cookies.set('admin_refresh_token', '', {
    httpOnly: true,
    maxAge:   0,
    path:     '/',
  })

  return response
}