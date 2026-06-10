"use client"

import { useEffect, useRef, useState } from "react"

// ─── Hook: trigger khi element scroll vào viewport ────────────────────────────
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

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function IconScissors() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="42" r="7" stroke="#b89a6a" strokeWidth="1.5" fill="none"/>
      <circle cx="22" cy="34" r="7" stroke="#b89a6a" strokeWidth="1.5" fill="none"/>
      <line x1="19" y1="37" x2="46" y2="10" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="17" y1="39" x2="44" y2="12" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="28" y1="28" x2="46" y2="46" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconRazor() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="8" width="10" height="34" rx="2" stroke="#b89a6a" strokeWidth="1.5" fill="none"/>
      <line x1="23" y1="42" x2="23" y2="50" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="19" y1="14" x2="27" y2="14" stroke="#b89a6a" strokeWidth="1.2"/>
      <line x1="19" y1="18" x2="27" y2="18" stroke="#b89a6a" strokeWidth="1.2"/>
      <path d="M28 8 L38 16 L38 36 L28 42" stroke="#b89a6a" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    </svg>
  )
}

function IconShave() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="18" width="16" height="22" rx="3" stroke="#b89a6a" strokeWidth="1.5" fill="none"/>
      <rect x="23" y="12" width="10" height="8" rx="2" stroke="#b89a6a" strokeWidth="1.5" fill="none"/>
      <line x1="28" y1="40" x2="28" y2="48" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="24" y1="48" x2="32" y2="48" stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="24" y1="24" x2="32" y2="24" stroke="#b89a6a" strokeWidth="1.2"/>
      <line x1="24" y1="28" x2="32" y2="28" stroke="#b89a6a" strokeWidth="1.2"/>
      <line x1="24" y1="32" x2="32" y2="32" stroke="#b89a6a" strokeWidth="1.2"/>
    </svg>
  )
}

function IconMask() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="10" width="18" height="36" rx="2" stroke="#b89a6a" strokeWidth="1.5" fill="none"/>
      <line x1="22" y1="10" x2="22" y2="46" stroke="#b89a6a" strokeWidth="1.2"/>
      <line x1="28" y1="10" x2="28" y2="46" stroke="#b89a6a" strokeWidth="1.2"/>
      <line x1="16" y1="20" x2="34" y2="20" stroke="#b89a6a" strokeWidth="1.2"/>
      <line x1="16" y1="30" x2="34" y2="30" stroke="#b89a6a" strokeWidth="1.2"/>
      <line x1="16" y1="38" x2="34" y2="38" stroke="#b89a6a" strokeWidth="1.2"/>
      <path d="M34 16 L42 12 L42 44 L34 40" stroke="#b89a6a" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    </svg>
  )
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({
  icon,
  title,
  description,
  delay,
  inView,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: string
  inView: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(52px)",
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}`,
      }}
      className="relative bg-white flex flex-col items-center text-center px-8 py-10 cursor-default overflow-hidden"
      // Subtle border
    >
      {/* Hover fill from bottom */}
      <span
        className="absolute inset-0 bg-[#f9f5ef] origin-bottom"
        style={{
          transform: hovered ? "scaleY(1)" : "scaleY(0)",
          transition: "transform 0.4s cubic-bezier(0.76,0,0.24,1)",
        }}
      />

      {/* Bottom border accent */}
      <span
        className="absolute bottom-0 left-0 h-[2px] bg-[#b89a6a]"
        style={{
          width: hovered ? "100%" : "0%",
          transition: "width 0.4s cubic-bezier(0.76,0,0.24,1)",
        }}
      />

      {/* Icon */}
      <div
        className="relative z-10 mb-6"
        style={{
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.35s ease",
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className="relative z-10 text-[#2c1f14] mb-4"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "22px",
          fontWeight: 400,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="relative z-10 text-[#8a7060] text-[14px] leading-relaxed max-w-[220px]"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {description}
      </p>
    </div>
  )
}

// ─── Decorative divider with mustache ────────────────────────────────────────
function MustacheDivider({ visible }: { visible: boolean }) {
  return (
    <div
      className="flex items-center justify-center gap-3 mt-4 mb-14"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease 0.4s",
      }}
    >
      {/* Left dashes */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-5 h-[1.5px] bg-[#c8a97a] rounded-full"
            style={{
              transform: visible ? "scaleX(1)" : "scaleX(0)",
              transition: `transform 0.5s ease ${0.3 + i * 0.08}s`,
              transformOrigin: "right",
            }}
          />
        ))}
      </div>

      {/* Mustache icon */}
      <svg width="32" height="18" viewBox="0 0 32 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 9 C1 3, 8 1, 13 6 C14.5 7.5, 15 8, 16 8
             C17 8, 17.5 7.5, 19 6 C24 1, 31 3, 31 9
             C28 8, 24 9, 22 11 C20 13, 18 13, 16 11
             C14 13, 12 13, 10 11 C8 9, 4 8, 1 9Z"
          fill="#b89a6a"
        />
      </svg>

      {/* Right dashes */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-5 h-[1.5px] bg-[#c8a97a] rounded-full"
            style={{
              transform: visible ? "scaleX(1)" : "scaleX(0)",
              transition: `transform 0.5s ease ${0.3 + i * 0.08}s`,
              transformOrigin: "left",
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────
const services = [
  {
    icon: <IconScissors />,
    title: "Tạo Kiểu",
    description:
      "Barber is a person whose occupation is mainly to cut dress style.",
  },
  {
    icon: <IconRazor />,
    title: "Tỉa Râu",
    description:
      "Barber is a person whose occupation is mainly to cut dress style.",
  },
  {
    icon: <IconShave />,
    title: "Ráy Tai",
    description:
      "Barber is a person whose occupation is mainly to cut dress style.",
  },
  {
    icon: <IconMask />,
    title: "Gội Đầu",
    description:
      "Barber is a person whose occupation is mainly to cut dress style.",
  },
]

export default function ServicesSection() {
  const { ref, inView } = useInView(0.15)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@400;600;700&display=swap');

        @media (prefers-reduced-motion: reduce) {
          .svc-anim { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="w-full bg-[#f6f3ed] py-20 px-4 md:px-10 overflow-hidden"
      >
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="text-center mb-0">
          <p
            className="svc-anim text-[#b89a6a] text-[13px] tracking-[2.5px] mb-3"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontStyle: "italic",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 0s, transform 0.7s ease 0s",
            }}
          >
            Trendy Salon &amp; Spa
          </p>

          <h2
            className="svc-anim text-[#1e1510]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 5vw, 52px)",
              fontWeight: 400,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.75s ease 0.1s, transform 0.75s ease 0.1s",
            }}
          >
            Dịch Vụ
          </h2>

          <MustacheDivider visible={inView} />
        </div>

        {/* ── Cards grid ────────────────────────────────────────────────────── */}
        {/* Desktop: 4 columns | Tablet: 2x2 | Mobile: 1 column */}
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((svc, i) => (
            <ServiceCard
              key={i}
              icon={svc.icon}
              title={svc.title}
              description={svc.description}
              // Stagger: desktop bay lần lượt, mobile giảm delay
              delay={`${0.15 + i * 0.12}s`}
              inView={inView}
            />
          ))}
        </div>
      </section>
    </>
  )
}