import { create } from "zustand"
import type { BookingConfirmedPayload } from "../types/admin/realtime"

interface AdminRealtimeState {
  lastBooking: BookingConfirmedPayload | null
  lastBookingSeq: number
  pushBooking: (payload: BookingConfirmedPayload) => void
  resetRealtime: () => void
}

export const useAdminRealtimeStore = create<AdminRealtimeState>((set) => ({
  lastBooking: null,
  lastBookingSeq: 0,

  pushBooking: (payload) =>
    set((state) => ({
      lastBooking: payload,
      lastBookingSeq: state.lastBookingSeq + 1,
    })),

  resetRealtime: () => set({ lastBooking: null, lastBookingSeq: 0 }),
}))
