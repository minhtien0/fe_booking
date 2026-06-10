/**
 * Custom hook — quản lý toàn bộ vòng đời Socket.IO cho AdminBookingsPage.
 *
 * Trách nhiệm:
 *  - Kết nối / ngắt kết nối socket sạch
 *  - Nhận 'booking:new' → prepend row vào bảng + thêm toast
 *  - Expose toasts array và hàm dismiss để component render
 */

"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { io, Socket } from "socket.io-client"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookingConfirmedPayload {
    bookingId: number
    bookingCode: string
    customerName: string
    customerPhone: string
    bookingDate: string
    slotStart: string
    slotEnd: string
    serviceName: string
    barberName: string
    price: number
    row: {
        id: number; code: string | null; customer: string; phone: string
        initials: string; service: string; barber: string; barberId: number | null
        date: string; time: string; endTime: string; price: number
        status: string; visits: number; note: string
    }
}

export interface RtToast extends BookingConfirmedPayload {
    toastId: string
    createdAt: number
    ttl: number
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseBookingSocketOptions {
    onNewBooking: (payload: BookingConfirmedPayload) => void
    toastTtl?: number
    enabled?: boolean
    onAuthError?: () => void
}

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
const TOAST_TTL = 8_000

export function useBookingSocket({
    onNewBooking,
    toastTtl = TOAST_TTL,
    enabled = true,
    onAuthError,
}: UseBookingSocketOptions) {
    const [toasts, setToasts] = useState<RtToast[]>([])
    const socketRef = useRef<Socket | null>(null)
    const onNewBookingRef = useRef(onNewBooking)

    useEffect(() => { onNewBookingRef.current = onNewBooking }, [onNewBooking])

    useEffect(() => {
        if (!enabled) {
            setToasts([])
            return
        }

        const socket = io(`${SOCKET_URL}/admin`, {
            transports: ['websocket'],
            withCredentials: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2_000,
            closeOnBeforeunload: false,
        })

        socketRef.current = socket

        socket.on('connect', () =>
            console.log('[Socket] Connected admin namespace:', socket.id))

        socket.on('connect_error', (err) => {
            console.warn('[Socket] Connection error:', err.message)
            const message = err.message.toLowerCase()
            if (
                message.includes("unauthorized") ||
                message.includes("jwt") ||
                message.includes("token")
            ) {
                onAuthError?.()
            }
        })

        socket.on('booking:new', (payload: BookingConfirmedPayload) => {
            try {
                const audio = new Audio('/sounds/notify.mp3')
                audio.volume = 0.5
                audio.play().catch(() => { })
            } catch { }

            const toast: RtToast = {
                ...payload,
                toastId: `${payload.bookingId}-${Date.now()}`,
                createdAt: Date.now(),
                ttl: toastTtl,
            }
            setToasts(prev => [toast, ...prev].slice(0, 5))

            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.toastId !== toast.toastId))
            }, toastTtl)

            onNewBookingRef.current(payload)
        })

        const handleVisibility = () => {
            if (document.visibilityState === 'visible' && !socket.connected) {
                socket.connect()
            }
        }
        document.addEventListener('visibilitychange', handleVisibility)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility)
            socket.disconnect()
            socketRef.current = null
        }
    }, [enabled, onAuthError, toastTtl])

    const dismissToast = useCallback((toastId: string) => {
        setToasts(prev => prev.filter(t => t.toastId !== toastId))
    }, [])

    const dismissAll = useCallback(() => setToasts([]), [])

    return { toasts, dismissToast, dismissAll }
}