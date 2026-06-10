// types/booking.ts

export interface BookingService {
  id: string | number
  name: string
  price: number
  duration: number   // phút
  type: 'service' | 'combo'
}

export interface BookingBarber {
  id: string | number
  name: string
  role: string
  avatar?: string
}

export interface BookingSlot {
  time: string       // "09:00"
  available: boolean
}

export type BookingStatus =
  | 'pending'
  | 'otp_verified'
  | 'confirmed'
  | 'inprogress'
  | 'done'
  | 'cancelled'
  | 'expired'

export type BookingType = 'service' | 'combo'

export type FilterTab = 'today' | 'upcoming' | 'all'

export interface BookingItem {
  id: number
  bookingCode: string | null
  appointmentTime: string  // ISO String
  bookingDate: string      // "2026-06-02"
  slotStartTime: string    // "14:30"
  slotEndTime: string      // "15:15"
  totalDuration: number
  snapshotPrice: number
  status: BookingStatus
  customerName: string
  customerPhone: string
  note: string | null
  barberName: string
  serviceName: string
  type: BookingType
}

export interface LookupOtpVerifyResponse {
  success: boolean
  managementToken: string
  booking: BookingItem | BookingItem[]
}

export interface NotificationState {
  type: 'success' | 'error'
  title: string
  message: string
}

export interface BookingFormData {
  name: string
  phone: string
  email: string
  serviceId: string | number | null
  barberId: string | number | null
  date: string       // "YYYY-MM-DD"
  time: string       // "HH:mm"
  note: string
}

export interface ServiceMeta {
  name: string
  price: string   // vd "120.000đ"
}