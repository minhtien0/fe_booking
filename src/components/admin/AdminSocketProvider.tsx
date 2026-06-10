// src/components/admin/AdminSocketProvider.tsx 
"use client"

import {
  createContext, useContext, useCallback,
  useEffect, useRef, useState, ReactNode,
} from "react"
import { io, Socket }  from "socket.io-client"
import type { BookingConfirmedPayload, RtToast } from "../../hooks/useBookingSocket"

// ─── Context type ─────────────────────────────────────────────────────────────
interface SocketContextValue {
  toasts:       RtToast[]
  dismissToast: (id: string) => void
  dismissAll:   () => void
  /** Đăng ký callback nhận booking mới, trả về cleanup fn */
  onNewBooking: (cb: (p: BookingConfirmedPayload) => void) => () => void
}

const SocketContext = createContext<SocketContextValue | null>(null)

export function useAdminSocket() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useAdminSocket phải được dùng trong AdminSocketProvider')
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const TOAST_TTL  = 8_000

export function AdminSocketProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts]   = useState<RtToast[]>([])
  const socketRef             = useRef<Socket | null>(null)
  const listenersRef          = useRef<Set<(p: BookingConfirmedPayload) => void>>(new Set())

  useEffect(() => {
    // Tạo socket 1 lần, sống suốt phiên admin
    const socket = io(`${SOCKET_URL}/admin`, {
      transports:           ['websocket'],
      withCredentials:      true,
      reconnectionAttempts: 10,
      reconnectionDelay:    2_000,
      closeOnBeforeunload:  false,  // KHÔNG ngắt khi Next.js navigate
    })

    socketRef.current = socket

    socket.on('connect', () =>
      console.log('[Socket] Connected:', socket.id))

    socket.on('connect_error', (err) =>
      console.warn('[Socket] Error:', err.message))

    socket.on('booking:new', (payload: BookingConfirmedPayload) => {
      // Âm thanh
      try {
        const audio = new Audio('/sounds/notify.mp3')
        audio.volume = 0.5
        audio.play().catch(() => {})
      } catch {}

      // Toast
      const toast: RtToast = {
        ...payload,
        toastId:   `${payload.bookingId}-${Date.now()}`,
        createdAt: Date.now(),
        ttl:       TOAST_TTL,
      }
      setToasts(prev => [toast, ...prev].slice(0, 5))
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.toastId !== toast.toastId))
      }, TOAST_TTL)

      // Notify tất cả page listeners
      listenersRef.current.forEach(cb => cb(payload))
    })

    // Reconnect nếu bị drop lúc tab ẩn
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !socket.connected) {
        socket.connect()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      socket.disconnect()
    }
  }, []) // empty deps — chỉ chạy 1 lần khi layout mount

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.toastId !== id))
  }, [])

  const dismissAll = useCallback(() => setToasts([]), [])

  const onNewBooking = useCallback((cb: (p: BookingConfirmedPayload) => void) => {
    listenersRef.current.add(cb)
    return () => listenersRef.current.delete(cb)
  }, [])

  return (
    <SocketContext.Provider value={{ toasts, dismissToast, dismissAll, onNewBooking }}>
      {children}
    </SocketContext.Provider>
  )
}