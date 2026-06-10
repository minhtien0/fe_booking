"use client"

import { useState } from "react"
import Link from "next/link"
import { type ComboDetail } from "../../types/combo"
import { useBooking } from "../../context/BookingContext"

// ─── Format VNĐ ───────────────────────────────────────────────────────────────
function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + "đ"
}

// ─── Booking CTA button ───────────────────────────────────────────────────────
function BookButton({ label, serviceId }: { label: string; serviceId?: string | number }) {
  const { openBooking } = useBooking()
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => openBooking(serviceId)}
      className="relative inline-flex items-center justify-center h-[52px] px-10 overflow-hidden"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <span className="absolute inset-0 bg-[#b89a6a] origin-left"
        style={{ transform: hovered ? "scaleX(1)" : "scaleX(0)", transition: "transform 0.45s cubic-bezier(0.76,0,0.24,1)" }} />
      <span className="absolute inset-0 border border-[#b89a6a]" />
      <span className="relative z-10 text-[11px] font-bold tracking-[2.5px] uppercase"
        style={{ color: hovered ? "#fff" : "#b89a6a", transition: "color 0.3s ease" }}>
        Đặt Ngay — Ưu Đãi Hôm Nay
      </span>
    </button>
  )
}

// ─── Savings badge ────────────────────────────────────────────────────────────
function SavingsBadge({ originalTotal, comboPrice }: { originalTotal: number; comboPrice: number }) {
  const saved = originalTotal - comboPrice
  const pct = Math.round((saved / originalTotal) * 100)
  return (
    <div className="inline-flex flex-col items-center justify-center w-[96px] h-[96px] rounded-full border-4 border-[#b89a6a] bg-[#b89a6a] shadow-lg shrink-0"
      style={{ boxShadow: "0 8px 32px rgba(184,154,106,0.35)" }}>
      <span className="text-white text-[26px] font-bold leading-tight"
        style={{ fontFamily: "'Montserrat', sans-serif" }}>-{pct}%</span>
      <span className="text-white/80 text-[9px] tracking-[1.5px] uppercase font-semibold"
        style={{ fontFamily: "'Montserrat', sans-serif" }}>Tiết kiệm</span>
    </div>
  )
}

// ─── Main hero ────────────────────────────────────────────────────────────────
export default function ComboDetailHero({ combo }: { combo: ComboDetail }) {
  const originalTotal = combo.services.reduce((s, sv) => s + sv.originalPrice, 0)
  const saved = originalTotal - combo.comboPrice
  const totalDuration = combo.services.reduce((s, sv) => s + sv.duration, 0)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        .hero-fadein { animation: fadeUp 0.75s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <section className="w-full relative overflow-hidden" style={{ minHeight: "520px" }}>
        {/* BG image */}
        <img src={combo.coverImage} alt={combo.name}
          className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.3) 100%)" }} />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-6 md:px-14 lg:px-24 py-20">
          <div className="max-w-[1180px] mx-auto w-full flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">

            {/* LEFT: text */}
            <div className="flex-1">
              {combo.badge && (
                <span className="hero-fadein inline-block px-4 py-[5px] mb-5 text-[10px] font-bold tracking-[2.5px] uppercase text-[#1c1a16] bg-[#b89a6a]"
                  style={{ fontFamily: "'Montserrat',sans-serif", animationDelay: "0.05s" }}>
                  ★ {combo.badge}
                </span>
              )}

              <p className="hero-fadein text-[#e8d5a3] text-[12px] tracking-[3px] uppercase mb-3 italic"
                style={{ fontFamily: "'Montserrat',sans-serif", animationDelay: "0.1s" }}>
                Combo Dịch Vụ
              </p>

              <h1 className="hero-fadein text-white leading-[1.15] mb-4"
                style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4.5vw,52px)", animationDelay: "0.18s" }}>
                {combo.name}
              </h1>

              <p className="hero-fadein text-white/70 text-[14px] leading-relaxed mb-8 max-w-[480px]"
                style={{ fontFamily: "'Montserrat',sans-serif", animationDelay: "0.28s" }}>
                {combo.tagline}
              </p>

              {/* Stats row */}
              <div className="hero-fadein flex flex-wrap gap-6 mb-10" style={{ animationDelay: "0.38s" }}>
                <div>
                  <p className="text-[#e8d5a3] text-[10px] tracking-[2px] uppercase mb-1"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}>Thời gian</p>
                  <p className="text-white text-[18px] font-semibold"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}>{totalDuration} phút</p>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <p className="text-[#e8d5a3] text-[10px] tracking-[2px] uppercase mb-1"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}>Dịch vụ bao gồm</p>
                  <p className="text-white text-[18px] font-semibold"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}>{combo.services.length} dịch vụ</p>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <p className="text-[#e8d5a3] text-[10px] tracking-[2px] uppercase mb-1"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}>Tiết kiệm được</p>
                  <p className="text-[#b89a6a] text-[18px] font-bold"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}>{formatPrice(saved)}</p>
                </div>
              </div>

              <div className="hero-fadein" style={{ animationDelay: "0.48s" }}>
                <BookButton />
              </div>
            </div>

            {/* RIGHT: price card */}
            <div className="hero-fadein w-full lg:w-[320px] shrink-0"
              style={{ animationDelay: "0.35s" }}>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-7">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-white/70 text-[12px] tracking-[2px] uppercase"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}>Giá combo</span>
                  <SavingsBadge originalTotal={originalTotal} comboPrice={combo.comboPrice} />
                </div>

                {/* Original total — strikethrough */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white/40 text-[14px] line-through"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}>
                    {formatPrice(originalTotal)}
                  </span>
                  <span className="text-[10px] text-white/40 italic"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}>giá gốc</span>
                </div>

                {/* Combo price */}
                <p className="text-[#e8d5a3] font-bold mb-6"
                  style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "clamp(28px,4vw,38px)" }}>
                  {formatPrice(combo.comboPrice)}
                </p>

                {/* Services summary */}
                <ul className="space-y-2 mb-6 border-t border-white/15 pt-5">
                  {combo.services.map(sv => (
                    <li key={sv.id} className="flex items-center justify-between">
                      <span className="text-white/70 text-[12px] flex items-center gap-2"
                        style={{ fontFamily: "'Montserrat',sans-serif" }}>
                        <span className="w-[5px] h-[5px] rounded-full bg-[#b89a6a] shrink-0" />
                        {sv.name}
                      </span>
                      <span className="text-white/40 text-[11px] line-through"
                        style={{ fontFamily: "'Montserrat',sans-serif" }}>
                        {formatPrice(sv.originalPrice)}
                      </span>
                    </li>
                  ))}
                </ul>

                <BookButton label="Đặt Ngay — Ưu Đãi Hôm Nay" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}