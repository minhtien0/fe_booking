"use client"

import { useState, useCallback, useEffect } from "react"
import { apiFetch } from "../../../lib/api"
import { useAdminRealtimeStore } from "../../../stores/adminRealtime"
import type { BookingConfirmedPayload } from "../../../types/admin/realtime"
import type {
  Booking,
  BarberDuty,
  ApiBookingRow,
  ApiBookingDetailResponse,
  ApiStatsResponse,
  ApiBarberDutyItem,
} from "../../../types/admin/booking"
import {
  mapApiBooking,
  mapApiBookingDetail,
  mapApiBarberDuty,
} from "../../../utils/admin/bookingMappers"

interface UseDashboardReturn {
  bookings:       Booking[]
  barbersDuty:    BarberDuty[]
  dashboardStats: ApiStatsResponse | null
  isLoading:      boolean
  detail:         Booking | null
  detailLoading:  boolean
  setDetail:      (b: Booking | null) => void
  loadDashboard:  () => Promise<Booking[]>
  loadBookingDetail: (id: string) => Promise<Booking | null>
}

export function useBookingDashboard(): UseDashboardReturn {
  const [bookings,       setBookings]       = useState<Booking[]>([])
  const [barbersDuty,    setBarbersDuty]    = useState<BarberDuty[]>([])
  const [dashboardStats, setDashboardStats] = useState<ApiStatsResponse | null>(null)
  const [isLoading,      setIsLoading]      = useState(false)
  const [detail,         setDetail]         = useState<Booking | null>(null)
  const [detailLoading,  setDetailLoading]  = useState(false)
  const lastBooking = useAdminRealtimeStore((s) => s.lastBooking)
  const lastBookingSeq = useAdminRealtimeStore((s) => s.lastBookingSeq)

  const loadDashboard = useCallback(async (): Promise<Booking[]> => {
    setIsLoading(true)
    try {
      const [bookingRes, statsRes, barbersRes] = await Promise.all([
        apiFetch<{ data: ApiBookingRow[]; total: number; page: number; limit: number; totalPages: number }>(
          "/admin/bookings?page=1&limit=100",
        ),
        apiFetch<ApiStatsResponse>("/admin/bookings/stats"),
        apiFetch<ApiBarberDutyItem[]>("/admin/bookings/barbers-duty"),
      ])
      const mapped = (bookingRes.data ?? []).map(mapApiBooking)
      setBookings(mapped)
      setDashboardStats(statsRes)
      setBarbersDuty((barbersRes ?? []).map(mapApiBarberDuty))
      return mapped
    } catch (err) {
      console.error("Failed to load booking dashboard", err)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadBookingDetail = useCallback(async (id: string): Promise<Booking | null> => {
    setDetailLoading(true)
    try {
      const res    = await apiFetch<ApiBookingDetailResponse>(`/admin/bookings/${id}`)
      const mapped = mapApiBookingDetail(res)
      setDetail(mapped)
      return mapped
    } catch (err) {
      console.error(`Failed to load booking detail #${id}`, err)
      return null
    } finally {
      setDetailLoading(false)
    }
  }, [])

  // Realtime: prepend new confirmed booking from socket
  const handleNewBooking = useCallback((payload: BookingConfirmedPayload) => {
    setBookings(prev => {
      if (prev.some(b => b.id === String(payload.row.id))) return prev
      return [mapApiBooking(payload.row), ...prev]
    })
    setDashboardStats(prev =>
      prev
        ? { ...prev, counts: { ...prev.counts, all: prev.counts.all + 1, today: prev.counts.today + 1, confirmed: prev.counts.confirmed + 1 } }
        : prev,
    )
  }, [])

  useEffect(() => { void loadDashboard() }, [loadDashboard])

  useEffect(() => {
    if (!lastBooking) return
    handleNewBooking(lastBooking)
  }, [handleNewBooking, lastBooking, lastBookingSeq])

  return {
    bookings, barbersDuty, dashboardStats, isLoading,
    detail, detailLoading, setDetail,
    loadDashboard, loadBookingDetail,
  }
}
