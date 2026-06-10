import type {
  Booking,
  BookingStatus,
  BarberDuty,
  ApiStatsResponse,
} from "./booking"

export type { BookingStatus }

export type BookingRecord = Booking

export type BookingStats = ApiStatsResponse

export type BarberOnDuty = BarberDuty

export interface TimeSlot {
  time: string
  available: boolean
  barberId?: number | null
  barberName?: string
}
