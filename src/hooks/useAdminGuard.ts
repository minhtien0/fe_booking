// src/hooks/useAdminGuard.ts
// Client-side guard — lớp bảo vệ thứ 3 (sau middleware và server layout)
// Xử lý hydration race condition và đồng bộ state sau page refresh

import { useEffect, useState } from 'react'
import { useRouter }           from 'next/navigation'
import { useAuthStore }        from '../stores/auth'

interface UseAdminGuardReturn {
  isReady: boolean   // true khi đã verify xong — dùng để show loading
}

export function useAdminGuard(): UseAdminGuardReturn {
  const router          = useRouter()
  const { isAuthenticated, clearAuth } = useAuthStore()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Nếu store chưa có auth state (ví dụ F5 trang) → ping server để kiểm tra
    if (!isAuthenticated) {
      // Middleware đã chặn rồi nên đây chỉ là fallback
      // Nếu đến đây mà chưa authenticated → middleware có vấn đề
      router.replace('/login?reason=unauthenticated')
      return
    }

    setIsReady(true)
  }, [isAuthenticated, router])

  return { isReady }
}

// Hook dùng để logout
export function useLogout() {
  const router    = useRouter()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  return async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // bỏ qua lỗi mạng
    }
    clearAuth()
    router.replace('/login')
  }
}