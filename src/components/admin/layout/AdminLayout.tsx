// src/components/admin/layout/AdminLayoutClient.tsx  — CLIENT COMPONENT
"use client"
import { useCallback, useEffect, useState } from "react"
import { useRouter }                        from "next/navigation"
import AdminSidebar                         from "./AdminSidebar"
import AdminHeader                          from "./AdminHeader"
import { BookingToastStack }                from "../../booking/BookingToast"
import { useAdminSocket }                   from "../AdminSocketProvider"
import { useAuthStore }                     from "../../../stores/auth"
import { useAdminRealtimeStore }            from "../../../stores/adminRealtime"

interface Props {
  children: React.ReactNode
}

const SIDEBAR_EXPANDED  = 240
const SIDEBAR_COLLAPSED = 68
const HEADER_HEIGHT     = 64

export default function AdminLayoutClient({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const router          = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const clearAuth       = useAuthStore((s) => s.clearAuth)
  const pushBooking     = useAdminRealtimeStore((s) => s.pushBooking)
  const resetRealtime   = useAdminRealtimeStore((s) => s.resetRealtime)

  // Lấy toasts từ AdminSocketProvider (socket đã chạy ở trên)
  const { toasts, dismissToast } = useAdminSocket()

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED

  const handleAuthError = useCallback(() => {
    clearAuth()
    resetRealtime()
    router.replace('/login?reason=session_expired')
  }, [clearAuth, resetRealtime, router])

  // Đăng ký callback nhận booking mới từ socket provider
  const { onNewBooking } = useAdminSocket()
  useEffect(() => {
    const unregister = onNewBooking(pushBooking)
    return unregister
  }, [onNewBooking, pushBooking])

  useEffect(() => {
    if (!isAuthenticated) resetRealtime()
  }, [isAuthenticated, resetRealtime])

  useEffect(() => {
    window.addEventListener('admin-auth-expired', handleAuthError)
    return () => window.removeEventListener('admin-auth-expired', handleAuthError)
  }, [handleAuthError])

  return (
    <div
      style={{
        '--sidebar-width': `${sidebarWidth}px`,
        '--header-height': `${HEADER_HEIGHT}px`,
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Montserrat:wght@400;500;600;700&display=swap');
      `}</style>

      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <AdminHeader  collapsed={collapsed} />

      <main
        className="min-h-screen bg-[#f8f5f0] overflow-x-hidden"
        style={{
          paddingLeft: sidebarWidth,
          paddingTop:  HEADER_HEIGHT,
          transition:  'padding-left 0.28s cubic-bezier(0.4,0,0.2,1)',
          willChange:  'padding-left',
        }}
      >
        <div className="px-6 py-6 min-w-0">{children}</div>
      </main>

      <BookingToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}