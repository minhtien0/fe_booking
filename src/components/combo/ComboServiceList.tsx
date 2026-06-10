"use client"

import { useState } from "react"
import { type ComboService } from "../../types/combo"

function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + "đ"
}

// ─── Single service accordion card ────────────────────────────────────────────
function ServiceAccordion({
  service,
  index,
}: {
  service: ComboService
  index: number
}) {
  const [open, setOpen] = useState(index === 0)

  return (
    <div className="border border-[#ede8e0] bg-white overflow-hidden"
      style={{ transition: "box-shadow 0.2s ease", boxShadow: open ? "0 4px 24px rgba(184,154,106,0.10)" : "none" }}>

      {/* Header row */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-5 px-6 py-5 text-left"
      >
        {/* Step number */}
        <span className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold"
          style={{
            fontFamily: "'Montserrat',sans-serif",
            background: open ? "#b89a6a" : "#f6f3ed",
            color: open ? "#fff" : "#9e8060",
            transition: "all 0.25s ease",
          }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Name + duration */}
        <div className="flex-1 min-w-0">
          <p className="text-[17px] font-light text-[#1e1510] leading-tight"
            style={{ fontFamily: "'Playfair Display',serif" }}>
            {service.name}
          </p>
          <p className="text-[11px] text-[#9e8060] tracking-[1.5px] uppercase mt-[2px]"
            style={{ fontFamily: "'Montserrat',sans-serif" }}>
            {service.duration} phút
          </p>
        </div>

        {/* Original price */}
        <div className="text-right shrink-0">
          <p className="text-[#aaa] text-[12px] line-through"
            style={{ fontFamily: "'Montserrat',sans-serif" }}>
            {formatPrice(service.originalPrice)}
          </p>
          <p className="text-[10px] text-[#b89a6a] italic"
            style={{ fontFamily: "'Montserrat',sans-serif" }}>đã bao gồm</p>
        </div>

        {/* Chevron */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease" }}>
          <path d="M3 6l5 5 5-5" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Expandable body */}
      <div style={{ maxHeight: open ? "500px" : "0", transition: "max-height 0.45s cubic-bezier(0.16,1,0.3,1)", overflow: "hidden" }}>
        <div className="px-6 pb-6 border-t border-[#f0ebe3]">
          <p className="text-[#5a4f46] text-[13px] leading-relaxed mt-5 mb-5"
            style={{ fontFamily: "'Montserrat',sans-serif" }}>
            {service.description}
          </p>

          {/* Steps included */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {service.included.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-[13px] text-[#5a4f46]"
                style={{ fontFamily: "'Montserrat',sans-serif" }}>
                <svg className="shrink-0 mt-[3px]" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" fill="#b89a6a" opacity="0.15" />
                  <path d="M4 7l2.5 2.5L10 4.5" stroke="#b89a6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ComboServiceList({ services }: { services: ComboService[] }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-[22px] md:text-[28px] font-light text-[#1e1510]"
          style={{ fontFamily: "'Playfair Display',serif" }}>
          Các dịch vụ trong combo
        </h2>
        <span className="px-3 py-1 text-[11px] font-bold tracking-[1.5px] text-[#b89a6a] border border-[#b89a6a]"
          style={{ fontFamily: "'Montserrat',sans-serif" }}>
          {services.length} dịch vụ
        </span>
      </div>

      <div className="space-y-3">
        {services.map((sv, i) => (
          <ServiceAccordion key={sv.id} service={sv} index={i} />
        ))}
      </div>
    </div>
  )
}