// src/app/api/proxy/[...path]/route.ts
// Proxy che URL NestJS cho tất cả request (public lẫn admin)
// - Có cookie admin_access_token → gắn Bearer token (admin)
// - Không có cookie              → forward bình thường (public)

import { NextRequest, NextResponse } from 'next/server'
import { cookies }                   from 'next/headers'

const NEST_URL = process.env.API_URL ?? 'http://localhost:3001'

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params
  const cookieStore            = await cookies()
  const token                  = cookieStore.get('admin_access_token')?.value

  const path      = '/' + pathSegments.join('/')
  const nestUrl   = `${NEST_URL}${path}${req.nextUrl.search}`

  const hasBody   = ['POST', 'PUT', 'PATCH'].includes(req.method)
  const body      = hasBody ? await req.text() : undefined

  const headers: HeadersInit = {
    'Content-Type': req.headers.get('content-type') ?? 'application/json',
    // Gắn token nếu có — nếu không có thì NestJS tự quyết định cho phép hay không
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }

  try {
    const upstream = await fetch(nestUrl, {
      method: req.method,
      headers,
      body,
    })

    const data        = await upstream.text()
    const contentType = upstream.headers.get('content-type') ?? 'application/json'

    return new NextResponse(data, {
      status:  upstream.status,
      headers: { 'Content-Type': contentType },
    })
  } catch {
    return NextResponse.json({ message: 'Lỗi kết nối tới server.' }, { status: 502 })
  }
}

export const GET    = handler
export const POST   = handler
export const PUT    = handler
export const PATCH  = handler
export const DELETE = handler