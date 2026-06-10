import { type ComboDetail } from "../../types/combo"

const TRUST_ICONS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: "Cam kết chất lượng",
    sub:   "100% hài lòng hoặc hoàn tiền",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    label: "Đúng giờ",
    sub:   "Barber luôn sẵn sàng đúng lịch hẹn",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    label: "Sản phẩm cao cấp",
    sub:   "Chỉ dùng thương hiệu uy tín quốc tế",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "Barber chuyên nghiệp",
    sub:   "Đội ngũ được đào tạo và chứng nhận",
  },
]

export default function ComboBenefits({ combo }: { combo: ComboDetail }) {
  return (
    <div className="mt-12 pt-10 border-t border-[#ede8e0]">

      {/* Why choose */}
      <h2 className="text-[20px] md:text-[26px] font-light text-[#1e1510] mb-6"
        style={{ fontFamily: "'Playfair Display',serif" }}>
        Tại sao nên chọn combo này?
      </h2>

      <ul className="space-y-3 mb-12">
        {combo.benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-4 p-4 bg-[#f9f7f4] border-l-4 border-[#b89a6a]">
            <span className="shrink-0 w-6 h-6 rounded-full bg-[#b89a6a] flex items-center justify-center text-white text-[11px] font-bold mt-[1px]"
              style={{ fontFamily: "'Montserrat',sans-serif" }}>
              {i + 1}
            </span>
            <p className="text-[13px] text-[#5a4f46] leading-relaxed"
              style={{ fontFamily: "'Montserrat',sans-serif" }}>
              {b}
            </p>
          </li>
        ))}
      </ul>

      {/* Trust badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {TRUST_ICONS.map((t, i) => (
          <div key={i} className="flex flex-col items-center text-center p-5 border border-[#ede8e0] bg-white">
            <div className="mb-3">{t.icon}</div>
            <p className="text-[13px] font-semibold text-[#2c1f14] mb-1"
              style={{ fontFamily: "'Montserrat',sans-serif" }}>{t.label}</p>
            <p className="text-[11px] text-[#8a7a68] leading-snug"
              style={{ fontFamily: "'Montserrat',sans-serif" }}>{t.sub}</p>
          </div>
        ))}
      </div>

      {/* Booking note */}
      {combo.bookingNote && (
        <div className="mt-8 p-5 bg-[#f6f3ed] border border-[#e4ddd3] flex gap-4 items-start">
          <svg className="shrink-0 mt-[2px]" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="#b89a6a" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-[13px] text-[#5a4f46] leading-relaxed"
            style={{ fontFamily: "'Montserrat',sans-serif" }}>
            <strong className="text-[#b89a6a]">Lưu ý: </strong>{combo.bookingNote}
          </p>
        </div>
      )}
    </div>
  )
}