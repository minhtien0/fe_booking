"use client"

import { useState, useEffect, useCallback } from "react"
import { useBooking } from "../../context/BookingContext"
import BookingStepIndicator from "./BookingStepIndicator"
import BookingStep1Service from "./BookingStep1Service"
import BookingStep2Barber from "./BookingStep2Barber"
import BookingStep3DateTime from "./BookingStep3DateTime"
import BookingStep4Confirm from "./BookingStep4Confirm"
import BookingStepOtp from "./BookingStepOtp"
import BookingSuccess from "./BookingSuccess"
import { verifyOtp, confirmBooking, resendOtp } from "../../lib/bookingApi"
import { type BookingFormData, type BookingService } from "../../types/booking"

// ── Step index ───────────────────────────────────────────────────────────────
// 0 Dịch vụ | 1 Barber | 2 Lịch hẹn | 3 Xác nhận (form + holdSlot) | 4 OTP | 5 Success
const FOOTER_STEPS = [0, 1, 2] // Chỉ các step này dùng footer Next/Back

const EMPTY_FORM: BookingFormData = {
  name: "", phone: "", email: "",
  serviceId: null, barberId: null,
  date: "", time: "", note: "",
}

interface BarberMeta { id: string | number; name: string; role: string; avatar?: string }

export default function BookingModal() {
  const { isOpen, preselectedService, closeBooking } = useBooking()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<BookingFormData>({ ...EMPTY_FORM })
  const [serviceMeta, setServiceMeta] = useState<BookingService | null>(null)
  const [barberMeta, setBarberMeta] = useState<BarberMeta | null>(null)

  // State OTP flow
  const [bookingId, setBookingId] = useState<number | null>(null)
  const [expiresAt, setExpiresAt] = useState<string>("")
  const [otpError, setOtpError] = useState<string | null>(null)

  // ── Side effects ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen && preselectedService != null) {
      setForm(f => ({ ...f, serviceId: preselectedService }))
      setStep(1)
    }
  }, [isOpen, preselectedService])

  // Reset toàn bộ khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(0)
        setForm({ ...EMPTY_FORM })
        setServiceMeta(null)
        setBarberMeta(null)
        setBookingId(null)
        setExpiresAt("")
        setOtpError(null)
      }, 400)
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeBooking() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [closeBooking])

  const updateForm = useCallback((patch: Partial<BookingFormData>) => {
    setForm(f => ({ ...f, ...patch }))
  }, [])

  // ── Footer step logic ────────────────────────────────────────────────────

  const canNext = () => {
    if (step === 0) return form.serviceId != null
    if (step === 1) return form.barberId != null
    if (step === 2) return Boolean(form.date && form.time)
    return false
  }

  // Nút "Tiếp theo" ở footer chỉ dùng cho step 0–2
  const handleNext = () => {
    if (step < 3) setStep(s => s + 1)
  }

  // ── Callbacks từ các Step component ─────────────────────────────────────

  /**
   * BookingStep4Confirm gọi sau khi POST /bookings/hold thành công
   */
  const handleHoldSuccess = useCallback((id: number, exp: string) => {
    setBookingId(id)
    setExpiresAt(exp)
    setStep(4) // → OTP
  }, [])

  /**
   * BookingStepOtp: xác thực OTP rồi confirm booking
   */
  const handleVerifyOtp = useCallback(async (otp: string) => {
    if (!bookingId) return
    setOtpError(null)
    // 1. Verify OTP
    await verifyOtp(bookingId, otp)
    // 2. Confirm ngay sau khi OTP đúng
    await confirmBooking(bookingId)
    // 3. Chuyển Success
    setStep(5)
  }, [bookingId])

  const handleResendOtp = useCallback(async () => {
    if (!bookingId) return
    await resendOtp(bookingId)
  }, [bookingId])

  if (!isOpen) return null

  const isDone = step === 5
  const showFooter = FOOTER_STEPS.includes(step)
  const totalVisible = 5 // step 0–4 hiển thị indicator (success ẩn)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@400;500;600;700&display=swap');
        @keyframes modalIn  { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes stepIn   { from { opacity:0; transform:translateX(18px); }             to { opacity:1; transform:translateX(0); } }
        .booking-modal { animation: modalIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .step-in       { animation: stepIn  0.35s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
        onClick={closeBooking}
      >
        <div
          className="booking-modal relative w-full max-w-[680px] bg-white overflow-hidden flex flex-col"
          style={{ maxHeight: "92vh" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Gold top bar */}
          <div className="h-1 w-full bg-[#b89a6a] shrink-0" />

          {/* Header */}
          <div className="shrink-0 px-6 pt-6 pb-5 border-b border-[#f0ebe3]">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[11px] tracking-[2.5px] uppercase text-[#b89a6a] italic mb-1"
                  style={{ fontFamily: "'Montserrat',sans-serif" }}>
                  ThienBinh · Đặt lịch
                </p>
                <h2 className="text-[22px] font-light text-[#1e1510]"
                  style={{ fontFamily: "'Playfair Display',serif" }}>
                  {isDone ? "Hoàn tất 🎉" : "Đặt lịch hẹn"}
                </h2>
              </div>
              <button
                onClick={closeBooking}
                className="w-9 h-9 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a] hover:text-[#b89a6a] shrink-0 mt-1"
                style={{ transition: "all 0.2s" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Step indicator: ẩn ở màn success */}
            {!isDone && <BookingStepIndicator current={step} />}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-7">
            {isDone ? (
              // ── Step 5: Success ──────────────────────────────────────────
              <BookingSuccess
                form={form}
                service={serviceMeta ?? undefined}
                barber={barberMeta ?? undefined}
                onClose={closeBooking}
              />
            ) : (
              <div className="step-in" key={step}>

                {/* Step 0: Chọn dịch vụ */}
                {step === 0 && (
                  <BookingStep1Service
                    selected={form.serviceId}
                    onSelect={id => updateForm({ serviceId: id })}
                    onServiceMeta={setServiceMeta}
                  />
                )}

                {/* Step 1: Chọn barber */}
                {step === 1 && (
                  <BookingStep2Barber
                    selected={form.barberId}
                    onSelect={id => updateForm({ barberId: id })}
                    onBarberMeta={setBarberMeta}
                  />
                )}

                {/* Step 2: Chọn ngày giờ */}
                {step === 2 && (
                  <BookingStep3DateTime
                    selectedDate={form.date}
                    selectedTime={form.time}
                    barberId={form.barberId}
                    onDateChange={d => updateForm({ date: d })}
                    onTimeChange={t => updateForm({ time: t })}
                  />
                )}

                {/* Step 3: Điền thông tin + holdSlot — tự có nút submit riêng */}
                {step === 3 && (
                  <BookingStep4Confirm
                    form={form}
                    onChange={updateForm}
                    service={serviceMeta ?? undefined}
                    barber={barberMeta ?? undefined}
                    onHoldSuccess={handleHoldSuccess}
                  />
                )}

                {/* Step 4: Nhập OTP */}
                {step === 4 && bookingId && (
                  <BookingStepOtp
                    phone={form.phone}
                    expiresAt={expiresAt}
                    onVerify={handleVerifyOtp}
                    onResend={handleResendOtp}
                  />
                )}
              </div>
            )}
          </div>

          {/* Footer: chỉ hiện ở step 0–2 */}
          {showFooter && (
            <div className="shrink-0 px-6 py-5 border-t border-[#f0ebe3] flex items-center justify-between gap-4 bg-white">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                className="flex items-center gap-2 text-[12px] font-semibold tracking-[1.5px] uppercase disabled:opacity-30"
                style={{ fontFamily: "'Montserrat',sans-serif", color: "#9e8060", transition: "opacity 0.2s" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Quay lại
              </button>

              <span className="text-[11px] text-[#bbb]"
                style={{ fontFamily: "'Montserrat',sans-serif" }}>
                Bước {step + 1} / 5
              </span>

              <button
                onClick={handleNext}
                disabled={!canNext()}
                className="relative h-[44px] px-8 text-[11px] font-bold tracking-[2px] uppercase text-white disabled:opacity-40"
                style={{ fontFamily: "'Montserrat',sans-serif", background: "#b89a6a", transition: "opacity 0.2s" }}
              >
                Tiếp theo →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}