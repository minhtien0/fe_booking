// src/lib/booking-admin.api.ts
import { apiFetch } from "./api"
import {
  type BookingRecord,
  type BookingStats,
  type BarberOnDuty,
  type BookingStatus,
  type TimeSlot,
} from "../types/admin/admin"

interface BookingListResponse {
  bookings:   BookingRecord[]
  total:      number
  page:       number
  totalPages: number
}

interface BookingDetailResponse {
  booking:  BookingRecord
  slots:    TimeSlot[]
  history:  { text: string; time: string; color: string }[]
}

function qs(params: Record<string, string | number | undefined>) {
  const p = Object.entries(params).filter(([,v]) => v !== undefined && v !== "")
  if (!p.length) return ""
  return "?" + new URLSearchParams(p.map(([k,v]) => [k, String(v)])).toString()
}

// ── Public / shared ────────────────────────────────────────────────────────
export async function adminFetchBookings(params?: Record<string, string | number | undefined>): Promise<BookingListResponse> {
  return apiFetch<BookingListResponse>(`/admin/bookings${qs(params ?? {})}`)
}

export async function adminFetchBookingDetail(id: string): Promise<BookingDetailResponse> {
  return apiFetch<BookingDetailResponse>(`/admin/bookings/${id}`)
}

export async function adminFetchStats(): Promise<BookingStats> {
  return apiFetch<BookingStats>("/admin/bookings/stats")
}

export async function adminFetchBarbers(): Promise<BarberOnDuty[]> {
  return apiFetch<BarberOnDuty[]>("/admin/barbers/on-duty")
}

// ── Mutations ──────────────────────────────────────────────────────────────
export async function adminConfirmBooking(id: string): Promise<BookingRecord> {
  return apiFetch<BookingRecord>(`/admin/bookings/${id}/confirm`, { method: "PATCH" })
}

export async function adminCancelBooking(id: string): Promise<BookingRecord> {
  return apiFetch<BookingRecord>(`/admin/bookings/${id}/cancel`, { method: "PATCH" })
}

export async function adminUpdateBookingTime(id: string, time: string): Promise<BookingRecord> {
  return apiFetch<BookingRecord>(`/admin/bookings/${id}/reschedule`, {
    method: "PATCH",
    body: JSON.stringify({ time }),
  })
}

export async function adminCreateBooking(data: Omit<BookingRecord, "id">): Promise<BookingRecord> {
  return apiFetch<BookingRecord>("/admin/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function adminUpdateBooking(id: string, data: Partial<BookingRecord>): Promise<BookingRecord> {
  return apiFetch<BookingRecord>(`/admin/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function adminDeleteBooking(id: string): Promise<void> {
  return apiFetch<void>(`/admin/bookings/${id}`, { method: "DELETE" })
}

export async function adminExportBookings(params?: Record<string, string>): Promise<Blob> {
  const res = await fetch(`/api/admin/bookings/export${qs(params ?? {})}`)
  return res.blob()
}
