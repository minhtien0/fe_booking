"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "../../lib/api"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface ComboViewItem {
  title: string
  description: string
  price: string
  iconKey: string
  slug: string
}

// ─────────────────────────────────────────────────────────────────────────────
// ICONS 
// ─────────────────────────────────────────────────────────────────────────────
const Icons: Record<string, () => React.JSX.Element> = {
  Classic: () => (
    <svg className="pointer-events-none" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l1 7h-14l1-7z" />
      <path d="M4 10a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2" />
      <path d="M9 14v6" /><path d="M15 14v6" />
    </svg>
  ),
  Gentleman: () => (
    <svg className="pointer-events-none" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 12s2.5 3.5 5 3.5s5-3.5 5-3.5" />
      <path d="M3 8s3.5-.5 5-2c1.5 1.5 5 2 5 2s3.5-.5 5-2c1.5 1.5 5 2 5 2" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  Royal: () => (
    <svg className="pointer-events-none" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  ),
  Relax: () => (
    <svg className="pointer-events-none" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5Z" />
      <path d="M18 21a6 6 0 0 0-12 0" />
      <path d="M7 13a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3" />
    </svg>
  ),
  Default: () => (
    <svg className="pointer-events-none" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
    </svg>
  ),
}

function getIcon(iconKey: string): React.JSX.Element {
  const Comp = Icons[iconKey] ?? Icons.Default
  return <Comp />
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

// ─────────────────────────────────────────────────────────────────────────────
// MUSTACHE DIVIDER
// ─────────────────────────────────────────────────────────────────────────────
function MustacheDivider({ visible }: { visible: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-4 mb-14"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.4s" }}>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="block w-5 h-[1.5px] bg-[#c8a97a] rounded-full origin-right"
            style={{ transform: visible ? "scaleX(1)" : "scaleX(0)", transition: `transform 0.5s ease ${0.3 + i * 0.08}s` }} />
        ))}
      </div>
      <svg width="32" height="18" viewBox="0 0 32 18" fill="#b89a6a">
        <path d="M1 9 C1 3, 8 1, 13 6 C14.5 7.5, 15 8, 16 8 C17 8, 17.5 7.5, 19 6 C24 1, 31 3, 31 9 C28 8, 24 9, 22 11 C20 13, 18 13, 16 11 C14 13, 12 13, 10 11 C8 9, 4 8, 1 9Z" />
      </svg>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="block w-5 h-[1.5px] bg-[#c8a97a] rounded-full origin-left"
            style={{ transform: visible ? "scaleX(1)" : "scaleX(0)", transition: `transform 0.5s ease ${0.3 + i * 0.08}s` }} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE CARD
// ─────────────────────────────────────────────────────────────────────────────
function ServiceCard({
  combo, delay, inView
}: {
  combo: ComboViewItem
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
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}`,
      }}
      className="relative flex-shrink-0 w-[280px] sm:w-[300px] h-[400px] bg-white flex flex-col items-center text-center px-6 py-10 cursor-pointer overflow-hidden snap-center border border-transparent hover:border-[#b89a6a]/20 transition-colors"
    >
      <span
        className="absolute inset-0 bg-[#f9f5ef] origin-bottom pointer-events-none"
        style={{
          transform: hovered ? "scaleY(1)" : "scaleY(0)",
          transition: "transform 0.5s cubic-bezier(0.76,0,0.24,1)",
        }}
      />

      <div className="relative z-10 mb-6 transition-transform duration-500 pointer-events-none"
        style={{ transform: hovered ? "scale(1.1)" : "scale(1)" }}>
        {getIcon(combo.iconKey)}
      </div>

      <h3 className="relative z-10 text-[#2c1f14] mb-3 text-[20px] line-clamp-2 pointer-events-none"
        style={{ fontFamily: "'Playfair Display', serif" }}>
        {combo.title}
      </h3>

      <p className="relative z-10 text-[#8a7060] text-[13.5px] leading-relaxed mb-4 line-clamp-4 pointer-events-none"
        style={{ fontFamily: "'Montserrat', sans-serif" }}>
        {combo.description}
      </p>

      <div className="relative z-10 mt-auto flex flex-col items-center gap-1 pointer-events-none">
        <span className="text-[#b89a6a] font-bold text-[22px]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {combo.price}
        </span>
        <span className="text-[11px] text-[#b89a6a]/70 uppercase tracking-widest opacity-0 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}>
          Xem chi tiết
        </span>
      </div>

      <span className="absolute bottom-0 left-0 h-[3px] bg-[#b89a6a] transition-all duration-500 pointer-events-none"
        style={{ width: hovered ? "100%" : "0%" }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[300px] h-[400px] bg-white flex flex-col items-center text-center px-6 py-10 snap-center animate-pulse">
      <div className="w-14 h-14 rounded-full bg-[#e8e0d5] mb-6" />
      <div className="h-5 bg-[#e8e0d5] rounded w-3/4 mb-3" />
      <div className="h-3 bg-[#ede8e0] rounded w-full mb-1.5" />
      <div className="h-3 bg-[#ede8e0] rounded w-4/5 mb-1.5" />
      <div className="h-3 bg-[#ede8e0] rounded w-full mb-1.5" />
      <div className="h-3 bg-[#ede8e0] rounded w-3/5 mb-6" />
      <div className="h-6 bg-[#e0d4c3] rounded w-28 mt-auto" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CACHE ENGINE FOR COMBOS
// ─────────────────────────────────────────────────────────────────────────────
let _cachedCombos: ComboViewItem[] | null = null
let _fetchingCombosPromise: Promise<void> | null = null

async function fetchCombosData() {
  if (_cachedCombos) return
  if (_fetchingCombosPromise) return _fetchingCombosPromise

  _fetchingCombosPromise = apiFetch<ComboViewItem[]>("/combos/view-list")
    .then((data) => {
      _cachedCombos = data
    })
    .finally(() => {
      _fetchingCombosPromise = null
    })

  return _fetchingCombosPromise
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function ComboSection() {
  const { ref, inView } = useInView(0.1)
  const router = useRouter()

  const [combos, setCombos] = useState<ComboViewItem[]>(_cachedCombos ?? [])
  const [isLoading, setIsLoading] = useState(!_cachedCombos)
  const [isError, setIsError] = useState(false)

  const sliderRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  // Fetch 
  useEffect(() => {
    if (_cachedCombos) {
      setCombos(_cachedCombos)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setIsError(false)

    fetchCombosData()
      .then(() => {
        setCombos(_cachedCombos!)
      })
      .catch((err) => {
        console.error("[ComboSection] fetch failed:", err)
        setIsError(true)
        setCombos([])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  //  Auto-scroll 
  useEffect(() => {
    const el = sliderRef.current
    if (!el || isLoading || isError) return

    const interval = setInterval(() => {
      if (isDraggingRef.current) return
      const firstCard = el.querySelector("[data-service-card]") as HTMLElement | null
      const cardWidth = firstCard?.offsetWidth ?? 300
      const maxScrollLeft = el.scrollWidth - el.clientWidth
      const next = el.scrollLeft + cardWidth + 24
      el.scrollTo({ left: next >= maxScrollLeft ? 0 : next, behavior: "smooth" })
    }, 5000)

    return () => clearInterval(interval)
  }, [isLoading, isError])

  // ── Drag & Click Handlers ──────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = sliderRef.current
    if (!el) return
    isDraggingRef.current = true
    startXRef.current = e.clientX
    scrollLeftRef.current = el.scrollLeft
    el.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = sliderRef.current
    if (!el || !isDraggingRef.current) return
    el.scrollLeft = scrollLeftRef.current - (e.clientX - startXRef.current)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false

    try { sliderRef.current?.releasePointerCapture(e.pointerId) } catch { }

    const dragDistance = Math.abs(e.clientX - startXRef.current)

    // Nếu khoảng cách di chuyển nhỏ (< 6px), xem như hành động Click
    if (dragDistance < 6) {
      // Lấy chính xác phần tử DOM nằm ngay dưới tọa độ chuột lúc nhả click
      const actualTarget = document.elementFromPoint(e.clientX, e.clientY)

      // Từ phần tử thực tế đó, dò ngược lên để lấy data-slug
      const targetCard = actualTarget?.closest("[data-slug]") as HTMLElement | null
      const slug = targetCard?.getAttribute("data-slug")

      router.push(`/combo/${slug}`)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Montserrat:wght@400;600;700&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <section ref={ref as React.RefObject<HTMLElement>} className="w-full bg-[#f6f3ed] py-24 overflow-hidden">
        <div className="text-center px-4">
          <p className="text-[#b89a6a] text-[13px] tracking-[3px] uppercase mb-3 font-semibold"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease",
            }}>
            Luxury Experience
          </p>
          <h2 className="text-[#1e1510] leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.75s ease 0.1s",
            }}>
            Combo Cao Cấp
          </h2>
          <MustacheDivider visible={inView} />
        </div>

        {isError ? (
          <p className="text-center text-[13px] text-[#9e8060] italic py-10"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Không thể tải danh sách combo. Vui lòng thử lại sau.
          </p>
        ) : (
          <div className="relative group">
            <div
              ref={sliderRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 px-8 md:px-[10%] pb-10 cursor-grab active:cursor-grabbing select-none"
              style={{ scrollBehavior: "smooth" }}
            >
              {isLoading
                ? [0, 1, 2, 3].map(i => <div key={i} data-service-card><SkeletonCard /></div>)
                : combos.map((combo, i) => (
                  <div key={`${combo.title}-${i}`} data-service-card data-slug={combo.slug}>
                    <ServiceCard
                      combo={combo}
                      delay={`${0.2 + i * 0.1}s`}
                      inView={inView}
                    />
                  </div>
                ))
              }
            </div>
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#f6f3ed] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {!isLoading && !isError && combos.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-[#8a7060]/60 italic text-[13px]">
              Vuốt ngang hoặc nhấn để xem chi tiết
            </p>
          </div>
        )}
      </section>
    </>
  )
}