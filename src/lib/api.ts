// src/lib/api.ts
export interface ApiError {
  status: number
  message: string
}

// 👉 CHỈ dùng 1 nguồn API duy nhất
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  retry = true,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include', 
  })

  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh()

    if (refreshed) {
      return apiFetch<T>(path, options, false)
    }

    if (
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith('/admin')
    ) {
      window.location.href = '/login?reason=session_expired'
    }

    throw { status: 401, message: 'Không có quyền truy cập.' } as ApiError
  }
  if (res.status === 403) {
    if (
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith('/admin')
    ) {
      window.location.href = '/403'
    }

    throw { status: 403, message: 'Không có quyền truy cập.' } as ApiError
  }

  if (!res.ok) {
    const err = await res.json().catch(() => null)

    throw {
      status: res.status,
      message: Array.isArray(err?.message)
        ? err.message.join('\n')
        : err?.message ?? `API error ${res.status}`,
    } as ApiError
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

/**
 * refresh token (giữ nguyên logic backend)
 */
let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

async function tryRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise

  isRefreshing = true

  refreshPromise = fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  return refreshPromise
}