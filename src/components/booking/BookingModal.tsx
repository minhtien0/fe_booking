"use client"

import { useState, useEffect, useCallback } from "react"
import { useBooking } from "../../context/BookingContext"
import { useRouter } from 'next/navigation';
import BookingStepIndicator from "./BookingStepIndicator"
import BookingStep1Service from "./BookingStep1Service"
import BookingStep2Barber from "./BookingStep2Barber"
import BookingStep3DateTime from "./BookingStep3DateTime"
import BookingStep4Confirm from "./BookingStep4Confirm"
import BookingStepOtp from "./BookingStepOtp"
import BookingSuccess from "./BookingSuccess"
import { verifyOtp, confirmBooking, resendOtp } from "../../lib/bookingApi"
import { type BookingFormData, type BookingService, type BookingBarber } from "../../types/booking"

const FOOTER_STEPS = [0, 1, 2]

const EMPTY_FORM: BookingFormData = {
  name: "", phone: "", email: "",
  serviceId: null, barberId: null,
  date: "", time: "", note: "",
}

interface BarberMeta { id: string | number; name: string; role: string; avatar?: string }

export default function BookingModal() {
  const { isOpen, preselectedItem, closeBooking } = useBooking()
  const router = useRouter();
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<BookingFormData>({ ...EMPTY_FORM })
  const [serviceMeta, setServiceMeta] = useState<BookingService | null>(null)
  const [barberMeta, setBarberMeta] = useState<BarberMeta | null>(null)
  const [resolvedBarberId, setResolvedBarberId] = useState<number | null>(null)
  const [bookingId, setBookingId] = useState<number | null>(null)
  const [expiresAt, setExpiresAt] = useState<string>("")
  const [otpError, setOtpError] = useState<string | null>(null)

  // ── Khi mở modal với preselectedItem (từ trang combo/service) ────────────
  useEffect(() => {
    if (!isOpen || !preselectedItem) return

    if (preselectedItem.type === 'combo') {
      // Preselect combo: set serviceId = combo.id, bỏ qua step 0 (đã chọn rồi)
      setForm(f => ({ ...f, serviceId: preselectedItem.id }))
      // serviceMeta sẽ được set bởi BookingStep1Service khi render
      setStep(0) // Vẫn vào step 0 để user thấy combo đã được chọn sẵn
    } else {
      // Preselect service thông thường
      setForm(f => ({ ...f, serviceId: preselectedItem.id }))
      setStep(1) // Skip step 0, vào thẳng chọn barber
    }
  }, [isOpen, preselectedItem])

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

  const handleBarberMeta = useCallback((meta: BookingBarber) => {
    setBarberMeta(meta)

    if (meta.id === 'any') {
      // UI hiện "Barber bất kỳ", nhưng lưu id thật vào resolvedBarberId riêng
      setResolvedBarberId(meta.resolvedId ?? null)
      setForm(f => ({ ...f, barberId: 'any' }))
    } else {
      setResolvedBarberId(Number(meta.id))
      setForm(f => ({ ...f, barberId: meta.id }))
    }
  }, [])

  const canNext = () => {
    if (step === 0) return form.serviceId != null
    if (step === 1) return form.barberId != null
    if (step === 2) return Boolean(form.date && form.time)
    return false
  }

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1)
  }

  const handleHoldSuccess = useCallback((id: number, exp: string) => {
    setBookingId(id)
    setExpiresAt(exp)
    setStep(4)
  }, [])

  const handleVerifyOtp = useCallback(async (otp: string) => {
    if (!bookingId) return
    setOtpError(null)
    await verifyOtp(bookingId, otp)
    const response = await confirmBooking(bookingId)
    if (response?.managementToken && response?.booking) {
      localStorage.setItem('lk_mgmt_token', response.managementToken)
      localStorage.setItem('lk_mgmt_phone', form.phone)
      localStorage.setItem('lk_mgmt_code', '')

      const bookings = Array.isArray(response.booking)
        ? response.booking
        : [response.booking]

      localStorage.setItem('lk_mgmt_bookings', JSON.stringify(bookings))
    }
    router.push('/lookup');
    setStep(5)
  }, [bookingId, router, form])

  const handleResendOtp = useCallback(async () => {
    if (!bookingId) return
    await resendOtp(bookingId)
  }, [bookingId])

  if (!isOpen) return null

  const isDone = step === 5
  const showFooter = FOOTER_STEPS.includes(step)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@400;500;600;700&display=swap');
        @keyframes modalIn { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes stepIn  { from { opacity:0; transform:translateX(18px); } to { opacity:1; transform:translateX(0); } }
        .booking-modal { animation: modalIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .step-in       { animation: stepIn  0.35s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

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
          <div className="h-1 w-full bg-[#b89a6a] shrink-0" />

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
            {!isDone && <BookingStepIndicator current={step} />}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-7">
            {isDone ? (
              <BookingSuccess
                form={form}
                service={serviceMeta ?? undefined}
                barber={barberMeta ?? undefined}
                onClose={closeBooking}
              />
            ) : (
              <div className="step-in" key={step}>
                {step === 0 && (
                  <BookingStep1Service
                    selected={form.serviceId}
                    preselectedType={preselectedItem?.type}
                    onSelect={id => updateForm({ serviceId: id })}
                    onServiceMeta={setServiceMeta}
                  />
                )}
                {step === 1 && (
                  <BookingStep2Barber
                    selected={form.barberId}
                    onSelect={id => {
                      // Nếu chọn barber cụ thể  cập nhật form luôn
                      // Nếu chọn 'any'  handleBarberMeta sẽ lo (có busiestId)
                      if (id !== 'any') updateForm({ barberId: id })
                    }}
                    onBarberMeta={handleBarberMeta}
                  />
                )}
                {step === 2 && (
                  <BookingStep3DateTime
                    selectedDate={form.date}
                    selectedTime={form.time}
                    barberId={resolvedBarberId}
                    onDateChange={d => updateForm({ date: d })}
                    onTimeChange={t => updateForm({ time: t })}
                  />
                )}
                {step === 3 && (
                  <BookingStep4Confirm
                    form={form}
                    onChange={updateForm}
                    service={serviceMeta ?? undefined}
                    barber={barberMeta ?? undefined}
                    resolvedBarberId={resolvedBarberId}
                    onHoldSuccess={handleHoldSuccess}
                  />
                )}
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

          {showFooter && (
            <div className="shrink-0 px-6 py-5 border-t border-[#f0ebe3] flex items-center justify-between gap-4 bg-white">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                className="flex items-center gap-2 text-[12px] font-semibold tracking-[1.5px] uppercase disabled:opacity-30"
                style={{ fontFamily: "'Montserrat',sans-serif", color: "#9e8060" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Quay lại
              </button>

              <span className="text-[11px] text-[#bbb]" style={{ fontFamily: "'Montserrat',sans-serif" }}>
                Bước {step + 1} / 5
              </span>

              <button
                onClick={handleNext}
                disabled={!canNext()}
                className="h-[44px] px-8 text-[11px] font-bold tracking-[2px] uppercase text-white disabled:opacity-40"
                style={{ fontFamily: "'Montserrat',sans-serif", background: "#b89a6a" }}
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