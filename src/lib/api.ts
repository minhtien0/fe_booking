// src/lib/api.ts

export interface ApiError {
  status:  number
  message: string
}

const NEST_URL   = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const CLIENT_URL = typeof window !== 'undefined' ? '' : 'http://localhost:3000'

// Server Component → cần URL tuyệt đối
// Client Component → dùng relative URL /api/proxy/...
function proxyUrl(path: string) {
  return `${CLIENT_URL}/api/proxy${path}`
}

let isRefreshing    = false
let refreshPromise: Promise<boolean> | null = null

async function tryRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise
  isRefreshing   = true
  refreshPromise = fetch(`${CLIENT_URL}/api/auth/refresh`, { method: 'POST' })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => { isRefreshing = false; refreshPromise = null })
  return refreshPromise
}

export async function apiFetch<T>(
  path:    string,
  options?: RequestInit,
  retry = true,
): Promise<T> {
  const res = await fetch(proxyUrl(path), {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })

  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh()
    if (refreshed) return apiFetch<T>(path, options, false)

    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      window.location.href = '/login?reason=session_expired'
    }
    throw { status: 401, message: 'Không có quyền truy cập.' } as ApiError
  }

  if (res.status === 403) {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      window.location.href = '/403'
    }
    throw { status: 403, message: 'Không có quyền truy cập.' } as ApiError
  }

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw {
      status:  res.status,
      message: Array.isArray(err?.message)
        ? err.message.join('\n')
        : err?.message ?? `API error ${res.status}`,
    } as ApiError
  }

  if (res.status === 204) return undefined as T
  return res.json()
}