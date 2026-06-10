"use client"

import { useEffect, useRef, useState } from "react"
import { apiFetch } from "../../lib/api"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — map thẳng vào API response
// ─────────────────────────────────────────────────────────────────────────────
export interface PricingItem {
  id: string | number
  name: string
  price: number
  currency?: string       // default "đ"
  description: string
}

export interface PricingCategory {
  id: string | number
  label: string
  items: PricingItem[]
}

export interface PricingSectionProps {
  eyebrow?: string
  title?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — IntersectionObserver, trigger once
// ─────────────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─────────────────────────────────────────────────────────────────────────────
// MUSTACHE DIVIDER
// ─────────────────────────────────────────────────────────────────────────────
function MustacheDivider({ visible }: { visible: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-3 mb-14"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.4s" }}>
      {[0, 1, 2].map(i => (
        <span key={i} className="block w-5 h-[1.5px] bg-[#c8a97a] rounded-full"
          style={{
            transform: visible ? "scaleX(1)" : "scaleX(0)", transformOrigin: "right",
            transition: `transform 0.5s ease ${0.3 + i * 0.08}s`
          }} />
      ))}
      <svg width="32" height="18" viewBox="0 0 32 18" fill="none">
        <path d="M1 9 C1 3,8 1,13 6 C14.5 7.5,15 8,16 8 C17 8,17.5 7.5,19 6
                 C24 1,31 3,31 9 C28 8,24 9,22 11 C20 13,18 13,16 11
                 C14 13,12 13,10 11 C8 9,4 8,1 9Z" fill="#b89a6a" />
      </svg>
      {[0, 1, 2].map(i => (
        <span key={i} className="block w-5 h-[1.5px] bg-[#c8a97a] rounded-full"
          style={{
            transform: visible ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left",
            transition: `transform 0.5s ease ${0.3 + i * 0.08}s`
          }} />
      ))}
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────────────────
// PRICING ITEM ROW  — đồng bộ chiều cao khi data dài/ngắn
// ─────────────────────────────────────────────────────────────────────────────
function PricingRow({
  item, inView, delay,
}: { item: PricingItem; inView: boolean; delay: string }) {
  const [hovered, setHovered] = useState(false)
  const currency = item.currency ?? "đ"

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col flex-1 pb-6 mb-6 border-b border-[#e5ddd0] last:border-0 last:mb-0"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay},
                     transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}`,
      }}
    >
      <div className="flex items-baseline gap-2 mb-2 min-h-[2.8rem]">
        <span
          className="shrink-0 text-[17px] leading-snug"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            color: hovered ? "#9e8060" : "#2c1f14",
            transition: "color 0.25s ease",
            maxWidth: "58%",
          }}
        >
          {item.name}
        </span>
        <span
          className="flex-1 h-[1px] mx-1 self-end mb-[5px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, #c4b49a 0, #c4b49a 4px, transparent 4px, transparent 8px)",
            minWidth: 16,
            opacity: 0.6,
          }}
          aria-hidden
        />
        <span
          className="shrink-0 text-[20px] font-light whitespace-nowrap"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#9e8060",
            transition: "transform 0.25s ease",
            display: "inline-block",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        >
          {item.price.toLocaleString("vi-VN")}{currency}
        </span>
      </div>

      <p
        className="text-[#8a7a68] text-[13px] leading-relaxed line-clamp-2 min-h-[2.6rem]"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
        title={item.description}
      >
        {item.description}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY COLUMN — flex-col để items trải đều theo chiều cao cột
// ─────────────────────────────────────────────────────────────────────────────
function PricingColumn({
  category, colIndex, inView,
}: { category: PricingCategory; colIndex: number; inView: boolean }) {
  const colDelay = colIndex * 0.1

  return (
    <div className="flex flex-col h-full">
      <div
        className="inline-block self-start px-5 py-2 mb-8 text-[13px] font-semibold tracking-[1.5px] text-white"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          background: "#9e8060",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 0.65s ease ${colDelay}s, transform 0.65s ease ${colDelay}s`,
        }}
      >
        {category.label}
      </div>

      <div className="flex flex-col flex-1">
        {category.items.map((item, itemIdx) => (
          <PricingRow
            key={item.id}
            item={item}
            inView={inView}
            delay={`${colDelay + 0.12 + itemIdx * 0.1}s`}
          />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON — khớp với layout mới
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCol() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="h-9 w-32 bg-[#e0d4c3] mb-8 rounded" />
      {[0, 1, 2].map(i => (
        <div key={i} className="mb-6 pb-6 border-b border-[#e5ddd0] last:border-0">
          {/* name + price row */}
          <div className="flex items-center gap-2 mb-2 min-h-[2.8rem]">
            <div className="h-4 bg-[#e0d4c3] rounded w-28" />
            <div className="flex-1 h-[1px] bg-[#e0d4c3]" />
            <div className="h-5 bg-[#e0d4c3] rounded w-14" />
          </div>
          {/* description — 2 dòng cố định */}
          <div className="min-h-[2.6rem] space-y-1">
            <div className="h-3 bg-[#ede6db] rounded w-full" />
            <div className="h-3 bg-[#ede6db] rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR STATE
// ─────────────────────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <p className="text-[14px] text-[#9e8060]"
        style={{ fontFamily: "'Montserrat', sans-serif" }}>
        Không thể tải bảng giá. Vui lòng thử lại.
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-2 text-[11px] font-bold tracking-[2px] uppercase text-white bg-[#b89a6a] hover:bg-[#7a6248]"
        style={{ fontFamily: "'Montserrat', sans-serif", transition: "background 0.25s" }}
      >
        Thử lại
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// Fetch từ: NEXT_PUBLIC_API_URL + /services/pricing
// Chỉnh URL trong .env.local:
//   NEXT_PUBLIC_API_URL=http://localhost:3001
// ─────────────────────────────────────────────────────────────────────────────
let _cachedCategories: PricingCategory[] | null = null
let _fetchingPromise: Promise<void> | null = null

async function fetchPricingData() {
  if (_cachedCategories) return
  if (_fetchingPromise) return _fetchingPromise

  _fetchingPromise = apiFetch<PricingCategory[]>("/services/pricing")
    .then(data => { _cachedCategories = data })
    .finally(() => { _fetchingPromise = null })

  return _fetchingPromise
}
export default function PricingSection({
  eyebrow = "Save 20% On Beauty Spa",
  title = "Giá Chi Tiết",
}: PricingSectionProps) {
  const { ref, inView } = useInView(0.1)
  const [categories, setCategories] = useState<PricingCategory[]>(_cachedCategories ?? [])
  const [isLoading, setIsLoading] = useState(!_cachedCategories)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (_cachedCategories) {
      setCategories(_cachedCategories)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    fetchPricingData()
      .then(() => { setCategories(_cachedCategories!) })
      .catch(err => {
        console.error("[PricingSection] fetch failed:", err)
        setIsError(true)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleRetry = () => {
    _cachedCategories = null   // xóa cache để fetch lại
    setIsError(false)
    setIsLoading(true)
    fetchPricingData()
      .then(() => { setCategories(_cachedCategories!) })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false))
  }

  const slideUp = (delay: string): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
  })

  return (
    <>
      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="pricing-section w-full bg-[#f6f3ed] py-20 px-4 md:px-10 overflow-hidden"
      >
        <div className="text-center">
          <p className="text-[#b89a6a] text-[13px] tracking-[2px] mb-2"
            style={{ fontFamily: "'Montserrat', sans-serif", fontStyle: "italic", ...slideUp("0s") }}>
            {eyebrow}
          </p>
          <h2 className="text-[#1e1510]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 400, ...slideUp("0.1s") }}>
            {title}
          </h2>
          <MustacheDivider visible={inView} />
        </div>

        <div className="max-w-[1180px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">
              <SkeletonCol /><SkeletonCol /><SkeletonCol />
            </div>
          ) : isError ? (
            <ErrorState onRetry={handleRetry} /> 
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-stretch">
            {categories.map((cat, colIdx) => (
              <PricingColumn key={cat.id} category={cat} colIndex={colIdx} inView={inView} />
            ))}
          </div>
          )}
        </div>
      </section>
    </>
  )
}