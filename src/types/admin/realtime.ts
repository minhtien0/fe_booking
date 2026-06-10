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
    id: number
    code: string | null
    customer: string
    phone: string
    initials: string
    service: string
    barber: string
    barberId: number | null
    date: string
    time: string
    endTime: string
    price: number
    status: string
    visits: number
    note: string
  }
}

export interface RtToast extends BookingConfirmedPayload {
  toastId: string
  createdAt: number
  ttl: number
}
