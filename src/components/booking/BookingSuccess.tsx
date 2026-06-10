"use client"

import { type BookingFormData, type BookingService, type BookingBarber } from "../../types/booking"

function formatPrice(n: number) { return n.toLocaleString("vi-VN") + "đ" }

const MONTH_VI = ["tháng 1","tháng 2","tháng 3","tháng 4","tháng 5","tháng 6","tháng 7","tháng 8","tháng 9","tháng 10","tháng 11","tháng 12"]
function formatDate(d: string) {
  if (!d) return ""
  const [y, m, day] = d.split("-")
  return `${day} ${MONTH_VI[Number(m)-1]} ${y}`
}

interface Props {
  form: BookingFormData
  service?: BookingService
  barber?: BookingBarber
  onClose: () => void
}

export default function BookingSuccess({ form, service, barber, onClose }: Props) {
  return (
    <div className="flex flex-col items-center text-center py-4">
      {/* Animated checkmark */}
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: "rgba(184,154,106,0.12)", border: "2px solid #b89a6a" }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M8 18l7 7L28 11" stroke="#b89a6a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ strokeDasharray: 40, strokeDashoffset: 0, animation: "drawCheck 0.5s ease 0.2s both" }} />
        </svg>
        <style>{`@keyframes drawCheck { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }`}</style>
      </div>

      <h3 className="text-[24px] font-light text-[#1e1510] mb-2"
        style={{ fontFamily: "'Playfair Display',serif" }}>
        Đặt lịch thành công!
      </h3>
      <p className="text-[13px] text-[#7a6e62] mb-7 max-w-[320px] leading-relaxed"
        style={{ fontFamily: "'Montserrat',sans-serif" }}>
        Chúng tôi sẽ xác nhận lịch hẹn qua SMS đến số{" "}
        <strong className="text-[#b89a6a]">{form.phone}</strong> trong vài phút.
      </p>

      {/* Booking summary card */}
      <div className="w-full max-w-[340px] border border-[#ede8e0] bg-[#f9f7f4] text-left p-5 mb-7">
        <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#b89a6a] mb-4"
          style={{ fontFamily: "'Montserrat',sans-serif" }}>Chi tiết lịch hẹn</p>
        {[
          { icon: "✂", label: "Dịch vụ",  value: service?.name ?? "—" },
          { icon: "👤", label: "Barber",   value: barber?.name ?? "—" },
          { icon: "📅", label: "Ngày",     value: formatDate(form.date) },
          { icon: "🕐", label: "Giờ",      value: form.time },
          { icon: "💰", label: "Giá",      value: service ? formatPrice(service.price) : "—" },
        ].map(row => (
          <div key={row.label} className="flex items-center gap-3 py-2 border-b border-[#ede8e0] last:border-0">
            <span className="text-[14px]">{row.icon}</span>
            <span className="text-[12px] text-[#9e8060] w-16 shrink-0"
              style={{ fontFamily: "'Montserrat',sans-serif" }}>{row.label}</span>
            <span className="text-[13px] font-semibold text-[#1e1510]"
              style={{ fontFamily: "'Montserrat',sans-serif" }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Add to calendar hint */}
      <p className="text-[12px] text-[#bbb] italic mb-7"
        style={{ fontFamily: "'Montserrat',sans-serif" }}>
        Đừng quên thêm vào lịch của bạn 📆
      </p>

      <button onClick={onClose}
        className="px-10 h-[46px] text-[11px] font-bold tracking-[2.5px] uppercase text-white bg-[#b89a6a] hover:bg-[#7a6248]"
        style={{ fontFamily: "'Montserrat',sans-serif", transition: "background 0.25s" }}>
        Đóng
      </button>
    </div>
  )
}