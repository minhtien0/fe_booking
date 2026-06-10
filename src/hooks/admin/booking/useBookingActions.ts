"use client"

import { useState, useCallback } from "react"
import { apiFetch } from "../../../lib/api"
import type { Booking, BookingStatus } from "../../../types/admin/booking"
import { toApiBookingStatus } from "../../../utils/admin/bookingMappers"
import { STATUS_CONFIG } from "../../../constants/admin/bookingConfig"

interface UseBookingActionsProps {
  paginated:         Booking[]
  filtered:          Booking[]
  detail:            Booking | null
  loadDashboard:     () => Promise<Booking[]>
  loadBookingDetail: (id: string) => Promise<Booking | null>
}

interface UseBookingActionsReturn {
  selected:          string[]
  toggleSelect:      (id: string) => void
  toggleAll:         () => void
  handleStatusChange:(id: string, status: BookingStatus) => Promise<void>
  handleSavedDetail: (id: string) => Promise<void>
  exportCSV:         () => void
}

export function useBookingActions({
  paginated,
  filtered,
  detail,
  loadDashboard,
  loadBookingDetail,
}: UseBookingActionsProps): UseBookingActionsReturn {
  const [selected, setSelected] = useState<string[]>([])

  const toggleSelect = useCallback((id: string) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }, [])

  const toggleAll = useCallback(() => {
    setSelected(s => s.length === paginated.length ? [] : paginated.map(b => b.id))
  }, [paginated])

  const handleStatusChange = useCallback(
    async (id: string, status: BookingStatus) => {
      try {
        await apiFetch(`/admin/bookings/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: toApiBookingStatus(status) }),
        })
        await Promise.all([
          loadDashboard(),
          detail?.id === id ? loadBookingDetail(id) : Promise.resolve(null),
        ])
      } catch (err) {
        console.error("Failed to update booking status", err)
        void loadDashboard()
        if (detail?.id === id) void loadBookingDetail(id)
      }
    },
    [loadDashboard, loadBookingDetail, detail?.id],
  )

  const handleSavedDetail = useCallback(
    async (id: string) => {
      await Promise.all([loadDashboard(), loadBookingDetail(id)])
    },
    [loadDashboard, loadBookingDetail],
  )

  const exportCSV = useCallback(() => {
    const rows = [
      ["Mã", "Khách hàng", "SĐT", "Dịch vụ", "Barber", "Ngày", "Giờ", "Giá", "Trạng thái"],
      ...filtered.map(b => [
        b.code, b.customer, b.phone, b.service, b.barber,
        b.date, b.time, b.price, STATUS_CONFIG[b.status].label,
      ]),
    ]
    const csv = rows.map(r => r.join(",")).join("\n")
    const a   = document.createElement("a")
    a.href    = "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    a.download = "bookings.csv"
    a.click()
  }, [filtered])

  return {
    selected, toggleSelect, toggleAll,
    handleStatusChange, handleSavedDetail, exportCSV,
  }
}