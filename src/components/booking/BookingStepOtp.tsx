"use client"

// components/booking/BookingStepOtp.tsx
// Màn hình nhập 6 chữ số OTP sau khi holdSlot thành công.

import { useState, useRef, useEffect, useCallback } from "react"

interface Props {
  phone: string          // SĐT đã mask từ backend message, hoặc tự mask ở đây
  expiresAt: string      // ISO string — đếm ngược
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
}

/** Mask SĐT: "0901234567" → "090****567" */
function maskPhone(p: string) {
  return p.length >= 7 ? p.slice(0, 3) + '****' + p.slice(-3) : p
}

/** Trả về số giây còn lại (>= 0) */
function secondsLeft(iso: string) {
  return Math.max(0, Math.floor((new Date(iso).getTime() - Date.now()) / 1000))
}

export default function BookingStepOtp({ phone, expiresAt, onVerify, onResend }: Props) {
  const [digits, setDigits]         = useState<string[]>(Array(6).fill(''))
  const [loading, setLoading]       = useState(false)
  const [resending, setResending]   = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [remaining, setRemaining]   = useState(() => secondsLeft(expiresAt))
  const [resendCooldown, setResendCooldown] = useState(60) // giây chờ trước khi resend
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null))

  // ── Đếm ngược hết hạn ────────────────────────────────────────────────────
  useEffect(() => {
    if (remaining <= 0) return
    const t = setInterval(() => setRemaining(secondsLeft(expiresAt)), 1000)
    return () => clearInterval(t)
  }, [expiresAt, remaining])

  // ── Đếm ngược cooldown resend ────────────────────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setInterval(() => setResendCooldown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [resendCooldown])

  // ── Auto-focus ô đầu tiên ────────────────────────────────────────────────
  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const otp = digits.join('')

  // ── Xử lý nhập từng ô ────────────────────────────────────────────────────
  const handleChange = (idx: number, val: string) => {
    // Cho phép paste cả 6 số vào ô đầu
    if (val.length > 1) {
      const clean = val.replace(/\D/g, '').slice(0, 6)
      const next  = [...Array(6).fill('')]
      clean.split('').forEach((c, i) => { next[i] = c })
      setDigits(next)
      inputRefs.current[Math.min(clean.length, 5)]?.focus()
      return
    }
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[idx]  = val
    setDigits(next)
    setError(null)
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (otp.length < 6) { setError('Vui lòng nhập đủ 6 chữ số'); return }
    setLoading(true)
    setError(null)
    try {
      await onVerify(otp)
    } catch (err: any) {
      setError(err.message ?? 'OTP không đúng hoặc đã hết hạn')
      // Xoá ô nếu sai để nhập lại
      setDigits(Array(6).fill(''))
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }, [otp, onVerify])

  // Auto-submit khi điền đủ 6 số
  useEffect(() => {
    if (otp.length === 6 && !digits.includes('')) handleSubmit()
  }, [otp]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Resend ────────────────────────────────────────────────────────────────
  const handleResend = async () => {
    setResending(true)
    setError(null)
    try {
      await onResend()
      setDigits(Array(6).fill(''))
      setResendCooldown(60)
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setError(err.message ?? 'Không thể gửi lại OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex flex-col items-center text-center py-2">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ background: 'rgba(184,154,106,0.1)', border: '1.5px solid #b89a6a' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="#b89a6a" strokeWidth="1.8" strokeLinecap="round">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2.5" />
        </svg>
      </div>

      <h3 className="text-[18px] font-light text-[#1e1510] mb-1"
        style={{ fontFamily: "'Playfair Display',serif" }}>
        Xác thực OTP
      </h3>
      <p className="text-[12px] text-[#9e8060] mb-1 max-w-[300px] leading-relaxed"
        style={{ fontFamily: "'Montserrat',sans-serif" }}>
        Mã 6 chữ số đã được gửi đến{' '}
        <strong className="text-[#b89a6a]">{maskPhone(phone)}</strong>
      </p>

      {/* Countdown */}
      <p className="text-[11px] mb-6"
        style={{ fontFamily: "'Montserrat',sans-serif",
          color: remaining < 60 ? '#ef4444' : '#9e8060' }}>
        {remaining > 0
          ? `Mã hết hạn sau ${mm}:${ss}`
          : <span className="text-red-500">Mã đã hết hạn — vui lòng gửi lại</span>
        }
      </p>

      {/* 6-digit input */}
      <div className="flex gap-2 sm:gap-3 mb-5">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={6}  /* cho phép paste */
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className="w-11 h-14 text-center text-[20px] font-bold outline-none"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              border: `2px solid ${error ? '#ef4444' : d ? '#b89a6a' : '#ede8e0'}`,
              color: '#1e1510',
              background: '#fff',
              transition: 'border-color 0.2s',
              caretColor: '#b89a6a',
            }}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-[12px] text-red-500 mb-4"
          style={{ fontFamily: "'Montserrat',sans-serif" }}>
          {error}
        </p>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={loading || otp.length < 6}
        className="w-full h-[46px] text-[11px] font-bold tracking-[2.5px] uppercase text-white mb-4"
        style={{
          fontFamily: "'Montserrat',sans-serif",
          background: loading || otp.length < 6 ? '#c9b99a' : '#b89a6a',
          transition: 'background 0.25s',
          cursor: loading || otp.length < 6 ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Đang xác thực...' : 'Xác nhận OTP'}
      </button>

      {/* Resend */}
      <p className="text-[12px] text-[#9e8060]" style={{ fontFamily: "'Montserrat',sans-serif" }}>
        Chưa nhận được mã?{' '}
        {resendCooldown > 0
          ? <span className="text-[#bbb]">Gửi lại sau {resendCooldown}s</span>
          : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[#b89a6a] font-semibold underline underline-offset-2 disabled:opacity-50"
            >
              {resending ? 'Đang gửi...' : 'Gửi lại OTP'}
            </button>
          )
        }
      </p>
    </div>
  )
}