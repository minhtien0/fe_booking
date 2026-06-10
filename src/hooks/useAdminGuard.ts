// src/hooks/useAdminGuard.ts
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../stores/auth'

export function useLogout() {
  const router    = useRouter()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  return async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    clearAuth()
    router.replace('/login')
  }
}

// Giữ export useAdminGuard để không break các file đang import
// nhưng không làm gì — middleware đã chặn rồi
export function useAdminGuard() {
  return { isReady: true }
}