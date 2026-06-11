"use client"

import { useState } from "react"
import { type BookingFormData, type BookingService, type BookingBarber } from "../../types/booking"
import { holdSlot } from "../../lib/bookingApi"
import { Turnstile } from "@marsidev/react-turnstile"

function formatPrice(n: any) {
  if (n === undefined || n === null) return "—"
  if (typeof n === "number") return n.toLocaleString("vi-VN") + "đ"
  if (typeof n === "string") {
    if (n.includes("đ") || n.includes(".")) return n
    const parsed = parseInt(n, 10)
    return isNaN(parsed) ? n : parsed.toLocaleString("vi-VN") + "đ"
  }
  return "—"
}

function InputField({
  label, value, onChange, type = "text", placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label
        className="block text-[11px] font-bold tracking-[1.5px] uppercase text-[#7a6e62] mb-1"
        style={{ fontFamily: "'Montserrat',sans-serif" }}
      >
        {label}{required && " *"}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 text-[13px] bg-white outline-none"
        style={{
          fontFamily: "'Montserrat',sans-serif",
          border: `1px solid ${focused ? "#b89a6a" : "#ede8e0"}`,
          transition: "border-color 0.25s",
          color: "#3a3530",
        }}
      />
    </div>
  )
}

const MONTH_VI = [
  "tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6",
  "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12",
]
function formatDate(d: string) {
  if (!d) return ""
  const [y, m, day] = d.split("-")
  return `${day} ${MONTH_VI[Number(m) - 1]} ${y}`
}

interface Props {
  form: BookingFormData
  onChange: (f: Partial<BookingFormData>) => void
  service?: BookingService
  barber?: BookingBarber
  resolvedBarberId?: number | null
  onHoldSuccess: (bookingId: number, expiresAt: string) => void
}

export default function BookingStep4Confirm({
  form, onChange, service, barber, resolvedBarberId, onHoldSuccess,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const handleHold = async () => {
    if (!form.name.trim()) { setError("Vui lòng nhập họ và tên."); return }
    if (!form.phone.trim()) { setError("Vui lòng nhập số điện thoại."); return }
    if (!service?.id) { setError("Chưa chọn dịch vụ."); return }
    if (!barber?.id) { setError("Chưa chọn barber."); return }
    if (!form.date) { setError("Chưa chọn ngày."); return }
    if (!form.time) { setError("Chưa chọn giờ."); return }
    if (!captchaToken) {
      setError("Vui lòng xác thực mã bảo vệ (CAPTCHA).");
      return
    }

    setError(null)
    setLoading(true)
    try {
      const res = await holdSlot({
        barber_id: resolvedBarberId ?? Number(barber?.id),
        service_id: service.type === 'service' ? Number(service.id) : undefined,
        combo_id: service.type === 'combo' ? Number(service.id) : undefined,
        booking_date: form.date,
        slot_start_time: form.time,
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_email: form.email.trim() || undefined,
        note: form.note.trim() || undefined,
        captcha_token: captchaToken,
      })
      onHoldSuccess(res.booking_id, res.expires_at)
    } catch (err: any) {
      setError(err.message ?? "Đã có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3
        className="text-[18px] font-light text-[#1e1510] mb-1"
        style={{ fontFamily: "'Playfair Display',serif" }}
      >
        Xác nhận thông tin
      </h3>
      <p
        className="text-[12px] text-[#9e8060] mb-6 italic"
        style={{ fontFamily: "'Montserrat',sans-serif" }}
      >
        Điền thông tin để hoàn tất đặt lịch ✦
      </p>

      {/* Summary box */}
      <div className="bg-[#f9f7f4] border border-[#ede8e0] p-4 mb-6">
        <p
          className="text-[10px] font-bold tracking-[2px] uppercase text-[#b89a6a] mb-3"
          style={{ fontFamily: "'Montserrat',sans-serif" }}
        >
          Tóm tắt lịch hẹn
        </p>
        <div className="space-y-2">
          {[
            { label: "Loại Dịch Vụ", value: service?.type === 'combo' ? '🎁 Combo' : '✂ Dịch vụ' },
            { label: "Tên Dịch Vụ", value: service?.name },
            { label: "Barber", value: barber?.name ?? "—" },
            { label: "Ngày Đặt", value: formatDate(form.date) || "—" },
            { label: "Giờ Đặt", value: form.time || "—" },
            { label: "Thời Gian Sử Dụng", value: service?.duration + ' Phút' || "—" },
            { label: "Giá", value: service ? formatPrice(service.price) : "—" },
          ].map(row => (
            <div key={row.label} className="flex justify-between">
              <span
                className="text-[12px] text-[#9e8060]"
                style={{ fontFamily: "'Montserrat',sans-serif" }}
              >
                {row.label}
              </span>
              <span
                className="text-[12px] font-semibold text-[#1e1510]"
                style={{ fontFamily: "'Montserrat',sans-serif" }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Personal info form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Họ và tên" value={form.name}
            onChange={v => onChange({ name: v })}
            placeholder="Nguyễn Văn A" required
          />
          <InputField
            label="Số điện thoại" value={form.phone}
            onChange={v => onChange({ phone: v })}
            type="tel" placeholder="0901 234 567" required
          />
        </div>
        <InputField
          label="Email" value={form.email}
          onChange={v => onChange({ email: v })}
          type="email" placeholder="example@email.com"
        />
        <div>
          <label
            className="block text-[11px] font-bold tracking-[1.5px] uppercase text-[#7a6e62] mb-1"
            style={{ fontFamily: "'Montserrat',sans-serif" }}
          >
            Ghi chú thêm
          </label>
          <textarea
            value={form.note}
            onChange={e => onChange({ note: e.target.value })}
            placeholder="Yêu cầu đặc biệt, kiểu tóc mong muốn..."
            rows={3}
            className="w-full px-4 py-3 text-[13px] bg-white outline-none resize-none"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              border: "1px solid #ede8e0",
              color: "#3a3530",
            }}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Turnstile
          // Thay bằng Site Key Turnstile (mã công khai) của bạn vào đây
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
          onSuccess={(token) => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken(null)}
          onError={() => setCaptchaToken(null)}
        />
      </div>

      {/* Error */}
      {error && (
        <p
          className="text-[12px] text-red-500 mt-4"
          style={{ fontFamily: "'Montserrat',sans-serif" }}
        >
          {error}
        </p>
      )}

      {/* Trust line */}
      <div className="flex items-center gap-2 mt-5 p-3 bg-[#fff9f0] border border-[#f0d9b5]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="#b89a6a" strokeWidth="2" strokeLinecap="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p
          className="text-[11px] text-[#7a6248]"
          style={{ fontFamily: "'Montserrat',sans-serif" }}
        >
          Miễn phí huỷ lịch trước 2 giờ · Không cần đặt cọc · Xác nhận qua SMS
        </p>
      </div>

      {/* Submit — gọi holdSlot */}
      <button
        onClick={handleHold}
        disabled={loading}
        className="w-full h-[46px] text-[11px] font-bold tracking-[2.5px] uppercase text-white mt-6"
        style={{
          fontFamily: "'Montserrat',sans-serif",
          background: loading ? "#c9b99a" : "#b89a6a",
          transition: "background 0.25s",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Đang xử lý..." : "Tiếp tục →"}
      </button>
    </div>
  )
}