// ─── Domain types ────────────────────────────────────────────────────────────

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "expired"

export interface BookingLog {
  id: number
  actionText: string
  color: string
  createdAt: string // ISO string
}

export interface Booking {
  id: string
  code: string
  customer: string
  phone: string
  initials: string
  service: string
  barber: string
  date: string   // "YYYY-MM-DD"
  time: string   // "HH:MM"
  endTime?: string
  price: number
  status: BookingStatus
  visits: number
  tags: string[]
  note: string
  barberId?: number | null
  email?: string
  paymentStatus?: string
  paymentMethod?: string
  confirmedAt?: string | null
  cancelledAt?: string | null
  cancellationReason?: string | null
  editedAt?: string | null
  editReason?: string | null
  isNoShow?: boolean
  logs?: BookingLog[]
}

export interface BarberDuty {
  id: number
  name: string
  initials: string
  bookings: number
  online: boolean
  color: string
}

// ─── API response types ───────────────────────────────────────────────────────

export interface ApiBookingRow {
  id: number | string
  code: string | null
  customer: string
  phone: string
  initials: string
  service: string
  barber: string
  barberId: number | null
  date: string
  time: string
  endTime?: string
  price: number
  status: string
  visits: number
  note: string
}

export interface ApiBookingDetailResponse extends ApiBookingRow {
  email?: string | null
  paymentStatus?: string | null
  paymentMethod?: string | null
  confirmedAt?: string | null
  cancelledAt?: string | null
  cancellationReason?: string | null
  editedAt?: string | null
  editReason?: string | null
  isNoShow?: boolean
  logs?: BookingLog[]
}

export interface ApiStatsResponse {
  counts: {
    all: number
    today: number
    pending: number
    confirmed: number
    inprogress: number
    done: number
    cancelled: number
    expired: number
  }
  todayRevenue: number
  monthRevenue: number
  completionRate: number
  pendingAlert: number
}

export interface ApiBarberDutyItem {
  id: number
  name: string
  initials: string
  bookingsToday: number
  doneToday: number
  status: string
  online: boolean
}

export interface ApiAvailabilityResponse {
  success: boolean
  date: string
  barberId: number
  availableSlots: string[]
}

export interface RtNotification {
  bookingId: number
  customerName: string
  customerPhone: string
  slotStart: string
  bookingDate: string
}