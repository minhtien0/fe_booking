"use client"

import { useEffect, useRef, useState } from "react"
import { apiFetch } from "../../lib/api"

// 1. Định nghĩa Interface cho dữ liệu trả về từ API
interface BarberData {
  id: string
  name: string
  role: string
  avatar: string
  status: string
  createdAt: string
  updatedAt: string
}

interface BarbersApiResponse {
  data: BarberData[]
}

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

function MustacheDivider({ visible }: { visible: boolean }) {
  return (
    <div
      className="flex items-center justify-center gap-3 mt-4 mb-14"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.4s" }}
    >
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
      <svg width="32" height="18" viewBox="0 0 32 18" fill="none">
        <path
          d="M1 9 C1 3, 8 1, 13 6 C14.5 7.5, 15 8, 16 8
             C17 8, 17.5 7.5, 19 6 C24 1, 31 3, 31 9
             C28 8, 24 9, 22 11 C20 13, 18 13, 16 11
             C14 13, 12 13, 10 11 C8 9, 4 8, 1 9Z"
          fill="#b89a6a"
        />
      </svg>
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

function IconFacebook() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconTwitter() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2-4.52 4.5 0 .35.04.7.11 1.03C7.69 5.35 4.07 3.58 1.64.9a4.5 4.5 0 0 0-.61 2.26c0 1.56.8 2.94 2 3.75A4.48 4.48 0 0 1 .96 6v.06c0 2.18 1.55 4 3.6 4.42a4.52 4.52 0 0 1-2.04.08c.57 1.8 2.24 3.1 4.2 3.14A9.05 9.05 0 0 1 0 15.54 12.8 12.8 0 0 0 6.92 17.5c8.3 0 12.84-6.88 12.84-12.85 0-.2 0-.39-.01-.58A9.17 9.17 0 0 0 22 1.89 9 9 0 0 1 23 3z" />
    </svg>
  )
}

function BarberCard({
  name,
  role,
  image,
  delay,
  inView,
}: {
  name: string
  role: string
  image: string
  delay: string
  inView: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(48px)",
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}`,
      }}
    >
      <div className="relative overflow-hidden w-full aspect-[3/4]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top"
          style={{
            filter: hovered ? "grayscale(100%) brightness(0.75)" : "grayscale(0%) brightness(1)",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition:
              "filter 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(158,128,96,0.72) 0%, rgba(158,128,96,0.12) 50%, transparent 80%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.45s ease",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10"
          style={{
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            opacity: hovered ? 1 : 0,
            transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
          }}
        >
          <h3
            className="text-white text-[20px] font-light leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {name}
          </h3>
          <p
            className="text-[#e8d5a3] text-[10px] font-bold tracking-[2.5px] uppercase mt-1 mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {role}
          </p>
          <div className="flex gap-3">
            {[<IconFacebook />, <IconInstagram />, <IconTwitter />].map((icon, i) => (
              <button
                key={i}
                className="w-8 h-8 flex items-center justify-center border border-white/40 text-white/80 hover:border-[#e8d5a3] hover:text-[#e8d5a3]"
                style={{ transition: "border-color 0.2s ease, color 0.2s ease" }}
                aria-label={`Social ${i}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#b89a6a]/90 px-5 py-4"
        style={{
          opacity: hovered ? 0 : 1,
          transform: hovered ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <h3
          className="text-white text-[18px] font-light"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {name}
        </h3>
        <p
          className="text-white/75 text-[10px] font-bold tracking-[2px] uppercase"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {role}
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CACHE ENGINE FOR BARBERS
// ─────────────────────────────────────────────────────────────────────────────
let _cachedBarbers: BarberData[] | null = null
let _fetchingBarbersPromise: Promise<void> | null = null

async function fetchBarbersData() {
  if (_cachedBarbers) return
  if (_fetchingBarbersPromise) return _fetchingBarbersPromise

  _fetchingBarbersPromise = apiFetch<BarbersApiResponse>("/barbers/list")
    .then((response) => {
      _cachedBarbers = response.data.slice(0, 4)
    })
    .finally(() => {
      _fetchingBarbersPromise = null
    })

  return _fetchingBarbersPromise
}

export default function Barbers() {
  const { ref, inView } = useInView(0.1)
  const [barbers, setBarbers] = useState<BarberData[]>(_cachedBarbers ?? [])

  useEffect(() => {
    if (_cachedBarbers) {
      setBarbers(_cachedBarbers)
      return
    }

    fetchBarbersData()
      .then(() => {
        setBarbers(_cachedBarbers!)
      })
      .catch((error) => {
        console.error("Lỗi khi tải danh sách thợ cắt tóc:", error)
      })
  }, [])

  const slideUp = (delay: string): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
  })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@400;600;700&display=swap');

        @media (prefers-reduced-motion: reduce) {
          .barbers-anim * { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="barbers-anim w-full bg-white py-20 px-4 md:px-10 overflow-hidden"
      >
        <div className="text-center mb-0">
          <p
            className="text-[#b89a6a] text-[13px] tracking-[2.5px] mb-3"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontStyle: "italic",
              ...slideUp("0s"),
            }}
          >
            Trendy Salon &amp; Spa
          </p>

          <h2
            className="text-[#1e1510]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 5vw, 52px)",
              fontWeight: 400,
              ...slideUp("0.1s"),
            }}
          >
            Thợ Cắt Tóc
          </h2>

          <MustacheDivider visible={inView} />
        </div>

        <div className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {barbers.map((b, i) => (
            <BarberCard
              key={b.id}
              name={b.name}
              role={b.role}
              image={b.avatar}
              delay={`${0.15 + i * 0.1}s`}
              inView={inView}
            />
          ))}
        </div>
      </section>
    </>
  )
}