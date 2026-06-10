"use client"

import { useEffect, useRef, useState } from "react"
import BookingTrigger from "../../components/booking/BookingTrigger"

// ─── Hook: trigger khi scroll vào viewport ────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

// ─── Custom Select ────────────────────────────────────────────────────────────
function CustomSelect({
  placeholder,
  options,
}: {
  placeholder: string
  options: string[]
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Close khi click ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-transparent border border-[#555048] text-[14px] outline-none"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          color: selected ? "#e8d8c0" : "#8a8070",
          transition: "border-color 0.25s ease",
          borderColor: open ? "#b89a6a" : "#555048",
        }}
      >
        <span>{selected ?? placeholder}</span>

        {/* Chevron */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s cubic-bezier(0.76,0,0.24,1)",
            flexShrink: 0,
          }}
        >
          <path d="M2 4L6 8L10 4" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        className="absolute left-0 right-0 z-50 overflow-hidden border border-[#555048]"
        style={{
          top: "calc(100% + 2px)",
          maxHeight: open ? `${options.length * 56}px` : "0px",
          opacity: open ? 1 : 0,
          transition: "max-height 0.38s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease",
          background: "#2a2720",
          borderColor: open ? "#b89a6a" : "#555048",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setSelected(opt)
              setOpen(false)
            }}
            className="w-full text-left px-5 py-4 text-[14px] block"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: selected === opt ? "#1c1a16" : "#d4c4a8",
              background: selected === opt ? "#b89a6a" : "transparent",
              transition: "background 0.2s ease, color 0.2s ease",
              borderBottom: i < options.length - 1 ? "1px solid #3a352e" : "none",
            }}
            onMouseEnter={(e) => {
              if (selected !== opt) {
                ; (e.currentTarget as HTMLButtonElement).style.background = "#3a352e"
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== opt) {
                ; (e.currentTarget as HTMLButtonElement).style.background = "transparent"
              }
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function AppInput({
  placeholder,
  type = "text",
}: {
  placeholder: string
  type?: string
}) {
  const [focused, setFocused] = useState(false)

  return (
    <input
      type={type}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full px-5 py-4 bg-transparent text-[#e8d8c0] text-[14px] outline-none placeholder-[#8a8070]"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        border: `1px solid ${focused ? "#b89a6a" : "#555048"}`,
        transition: "border-color 0.25s ease",
      }}
    />
  )
}

// ─── Submit Button ────────────────────────────────────────────────────────────
function SubmitButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="submit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative h-[50px] px-10 overflow-hidden text-[11px] font-bold tracking-[2.5px] uppercase outline-none"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        border: "1px solid #b89a6a",
        color: hovered ? "#1c1a16" : "#e8d8c0",
        transition: "color 0.3s ease",
      }}
    >
      {/* Sliding fill */}
      <span
        className="absolute inset-0 bg-[#b89a6a] origin-left"
        style={{
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.45s cubic-bezier(0.76,0,0.24,1)",
        }}
      />
      <span className="relative z-10">Đặt Lịch Hẹn</span>
    </button>
  )
}

// ─── Slide-up style helper ────────────────────────────────────────────────────
function slideUp(inView: boolean, delay: string): React.CSSProperties {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(32px)",
    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}`,
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Appointment() {
  const { ref, inView } = useInView(0.1)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@400;600;700&display=swap');

        @media (prefers-reduced-motion: reduce) {
          .apt-anim { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="w-full min-h-screen flex flex-col md:flex-row overflow-hidden"
      >
        {/* ── LEFT: Image ──────────────────────────────────────────────────── */}
        <div
          className="w-full md:w-[46%] lg:w-[48%] relative overflow-hidden"
          style={{ minHeight: "320px" }}
        >
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=85"
            alt="Barber at work"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              transform: inView ? "scale(1)" : "scale(1.06)",
              transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1) 0s",
            }}
          />
          {/* Subtle dark right-fade để blend với right panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40" />
        </div>

        {/* ── RIGHT: Form panel ────────────────────────────────────────────── */}
        <div
          className="flex-1 flex items-center justify-center px-8 md:px-14 lg:px-20 py-16 md:py-0 relative overflow-hidden"
          style={{ background: "#1e1c18" }}
        >
          {/* Watermark barber world map silhouette */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04]"
            aria-hidden
          >
            <svg viewBox="0 0 600 400" className="w-full h-full">
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                style={{ fontFamily: "serif", fontSize: 260, fill: "#c8a97a", fontWeight: 700 }}>
                B
              </text>
            </svg>
          </div>

          {/* Form content */}
          <div className="relative z-10 w-full max-w-[500px]">

            {/* Heading */}
            <h2
              className="apt-anim text-white mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(30px, 4vw, 44px)",
                fontWeight: 400,
                lineHeight: 1.2,
                ...slideUp(inView, "0.1s"),
              }}
            >
              Đặt Lịch Hẹn
            </h2>

            {/* Sub */}
            <p
              className="apt-anim text-[#9a8e80] text-[14px] leading-relaxed mb-10 max-w-[380px]"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                ...slideUp(inView, "0.22s"),
              }}
            >
              Barber is a person whose occupation is mainly to cut, dress, groom, style, and shave men's and boys' hair. A barber is also skilled in providing beard trimming, facial grooming, hair treatments, and personalized styling services to help clients maintain a clean and fashionable appearance. In addition to hair care, barbers often create a welcoming and relaxing environment where customers can feel comfortable, confident, and refreshed after every visit.
            </p>
            <BookingTrigger label="Đặt Lịch Hẹn" variant="outline" />


          </div>
        </div>
      </section>
    </>
  )
}