import type {
  Booking,
  BarberDuty,
  BookingStatus,
  ApiBookingRow,
  ApiBookingDetailResponse,
  ApiBarberDutyItem,
} from "../../types/admin/booking"

// ─── Formatters ───────────────────────────────────────────────────────────────

export const fmt  = (n: number) => n.toLocaleString("vi-VN") + "đ"
export const fmtM = (n: number) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : fmt(n)

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function getDaysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate()
}

export function getFirstDay(y: number, m: number) {
  return new Date(y, m, 1).getDay()
}

export function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

export function formatDisplayDate(isoDate: string) {
  return isoDate.split("-").reverse().join("/")
}

// ─── Status normalizers ───────────────────────────────────────────────────────

export function normalizeBookingStatus(status: string): BookingStatus {
  const v = String(status).toLowerCase()
  if (v === "inprogress" || v === "in_progress") return "in-progress"
  if (v === "done" || v === "completed")          return "completed"
  if (v === "expired")                             return "expired"
  if (v === "cancelled" || v === "canceled")       return "cancelled"
  if (v === "confirmed")                           return "confirmed"
  return "pending"
}

export function toApiBookingStatus(status: BookingStatus): string {
  if (status === "completed")   return "done"
  if (status === "in-progress") return "inprogress"
  return status
}

// ─── API mappers ──────────────────────────────────────────────────────────────

export function mapApiBooking(row: ApiBookingRow): Booking {
  const visits = Number(row.visits ?? 0)
  const tags: string[] = []
  if (visits >= 10) tags.push("VIP", "Thường xuyên")
  else if (visits >= 5) tags.push("Thường xuyên")

  return {
    id:       String(row.id),
    code:     row.code ?? "",
    customer: row.customer ?? "",
    phone:    row.phone ?? "",
    initials: row.initials ?? "",
    service:  row.service  ?? "Dịch vụ tùy chỉnh",
    barber:   row.barber   ?? "Chưa chọn thợ",
    barberId: row.barberId ?? null,
    date:     row.date     ?? "",
    time:     row.time     ?? "00:00",
    endTime:  row.endTime  ?? undefined,
    price:    Number(row.price ?? 0),
    status:   normalizeBookingStatus(row.status),
    visits,
    tags,
    note:     row.note ?? "",
  }
}

export function mapApiBookingDetail(row: ApiBookingDetailResponse): Booking {
  return {
    ...mapApiBooking(row),
    email:               row.email               ?? undefined,
    paymentStatus:       row.paymentStatus        ?? undefined,
    paymentMethod:       row.paymentMethod        ?? undefined,
    confirmedAt:         row.confirmedAt          ?? null,
    cancelledAt:         row.cancelledAt          ?? null,
    cancellationReason:  row.cancellationReason   ?? null,
    editedAt:            row.editedAt             ?? null,
    editReason:          row.editReason           ?? null,
    isNoShow:            Boolean(row.isNoShow),
    logs:                row.logs                 ?? [],
  }
}

export function mapApiBarberDuty(row: ApiBarberDutyItem): BarberDuty {
  return {
    id:       row.id,
    name:     row.name,
    initials: row.initials,
    bookings: row.bookingsToday ?? 0,
    online:   Boolean(row.online),
    color:    row.online ? "#b89a6a" : "#d1d5db",
  }
}