"use client"

import { useState } from "react"
import { type ComboDetail } from "../../types/combo"
import { useBooking } from "../../context/BookingContext"

function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + "đ"
}

function SavingsBar({ pct }: { pct: number }) {
  return (
    <div className="w-full h-2 bg-[#f0ebe3] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#b89a6a] rounded-full"
        style={{ width: `${pct}%`, transition: "width 1s cubic-bezier(0.16,1,0.3,1) 0.3s" }}
      />
    </div>
  )
}

function BookButton({ label, comboId }: { label: string; comboId: string | number }) {
  const { openBooking } = useBooking()
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => openBooking({ id: Number(comboId), type: 'combo' })}
      className="relative w-full h-[50px] flex items-center justify-center overflow-hidden"
      style={{ background: "#b89a6a" }}
    >
      <span
        className="absolute inset-0 bg-[#7a6248] origin-left"
        style={{
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.4s cubic-bezier(0.76,0,0.24,1)",
        }}
      />
      <span
        className="relative z-10 text-[11px] font-bold tracking-[2.5px] uppercase text-white"
        style={{ fontFamily: "'Montserrat',sans-serif" }}
      >
        {label}
      </span>
    </button>
  )
}

export default function ComboPriceCompare({ combo }: { combo: ComboDetail }) {
  const originalTotal = combo.services.reduce((s, sv) => s + sv.originalPrice, 0)
  const saved = originalTotal - combo.comboPrice
  const pct = Math.round((saved / originalTotal) * 100)

  return (
    <div className="sticky top-6">
      <div className="border border-[#ede8e0] bg-white overflow-hidden shadow-sm">
        <div className="h-1 w-full bg-[#b89a6a]" />

        <div className="p-7">
          {combo.badge && (
            <span
              className="inline-block px-3 py-[4px] mb-5 text-[9px] font-bold tracking-[2px] uppercase text-white bg-[#b89a6a]"
              style={{ fontFamily: "'Montserrat',sans-serif" }}
            >
              ★ {combo.badge}
            </span>
          )}

          <p className="text-[#bbb] text-[14px] line-through mb-1" style={{ fontFamily: "'Montserrat',sans-serif" }}>
            {formatPrice(originalTotal)}
          </p>

          <p
            className="text-[#b89a6a] font-bold mb-1"
            style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "clamp(28px,3.5vw,36px)" }}
          >
            {formatPrice(combo.comboPrice)}
          </p>

          <p className="text-[12px] text-[#9e8060] italic mb-6" style={{ fontFamily: "'Montserrat',sans-serif" }}>
            Đã bao gồm {combo.services.length} dịch vụ cao cấp
          </p>

          <div className="mb-2">
            <div className="flex justify-between text-[11px] mb-2" style={{ fontFamily: "'Montserrat',sans-serif" }}>
              <span className="text-[#7a6e62]">Bạn tiết kiệm được</span>
              <span className="text-[#b89a6a] font-bold">{pct}%</span>
            </div>
            <SavingsBar pct={pct} />
          </div>

          <p className="text-right text-[13px] font-semibold text-[#b89a6a] mb-7" style={{ fontFamily: "'Montserrat',sans-serif" }}>
            -{formatPrice(saved)}
          </p>

          <ul className="space-y-3 border-t border-[#f0ebe3] pt-5 mb-7">
            {combo.services.map(sv => (
              <li key={sv.id} className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <svg className="shrink-0 mt-[3px]" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" fill="#b89a6a" opacity="0.15" />
                    <path
                      d="M4 7l2.5 2.5L10 4.5"
                      stroke="#b89a6a"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-[12px] text-[#3a3530] leading-tight truncate" style={{ fontFamily: "'Montserrat',sans-serif" }}>
                      {sv.name}
                    </p>
                    <p className="text-[10px] text-[#aaa]" style={{ fontFamily: "'Montserrat',sans-serif" }}>
                      {sv.duration} phút
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-[#aaa] line-through shrink-0" style={{ fontFamily: "'Montserrat',sans-serif" }}>
                  {formatPrice(sv.originalPrice)}
                </span>
              </li>
            ))}
          </ul>

          {/* dùng openBooking giống bên trên */}
          <BookButton label="Đặt Lịch Ngay" comboId={combo.id} />
        </div>
      </div>

      <div className="mt-4 p-4 bg-[#fff9f0] border border-[#f0d9b5] flex items-start gap-3">
        <svg className="shrink-0 mt-[2px]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
        <p className="text-[12px] text-[#7a6248] leading-relaxed" style={{ fontFamily: "'Montserrat',sans-serif" }}>
          Ưu đãi giá combo có thể thay đổi. Đặt lịch sớm để giữ mức giá này!
        </p>
      </div>
    </div>
  )
}