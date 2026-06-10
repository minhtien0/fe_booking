// src/lib/bookingApi.ts
import { apiFetch } from './api'

export interface HoldResponse {
  booking_id: number
  expires_at: string
  message:    string
}

export interface VerifyOtpResponse {
  message: string
}

export interface ConfirmResponse {
  booking_id:   number
  status:       string
  confirmed_at: string
  message:      string
}

// Bước 1 — Giữ chỗ + gửi OTP
export async function holdSlot(payload: {
  barber_id:       number
  service_id?:     number
  combo_id?:       number
  booking_date:    string
  slot_start_time: string
  customer_name:   string
  customer_phone:  string
  customer_email?: string
  note?:           string
  captcha_token:   string
}): Promise<HoldResponse> {
  return apiFetch<HoldResponse>('/bookings/hold', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}

// Bước 2 — Xác thực OTP
export async function verifyOtp(
  bookingId: number,
  otp:       string,
): Promise<VerifyOtpResponse> {
  return apiFetch<VerifyOtpResponse>(`/bookings/${bookingId}/verify-otp`, {
    method: 'POST',
    body:   JSON.stringify({ otp }),
  })
}

// Bước 3 — Xác nhận chốt lịch
export async function confirmBooking(bookingId: number): Promise<ConfirmResponse> {
  return apiFetch<ConfirmResponse>(`/bookings/${bookingId}/confirm`, {
    method: 'POST',
    body:   JSON.stringify({}),
  })
}

// Gửi lại OTP
export async function resendOtp(bookingId: number): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/bookings/${bookingId}/resend-otp`, {
    method: 'POST',
    body:   JSON.stringify({}),
  })
}