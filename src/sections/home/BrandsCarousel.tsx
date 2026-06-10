"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, FreeMode } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/free-mode"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface Brand {
  id: string | number
  name: string
  href?: string
}

export interface BrandsCarouselProps {
  brands?: Brand[]
  autoplayDelay?: number   // ms, default 5000
  isLoading?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT DATA
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_BRANDS: Brand[] = [
  { id: 1,  name: "Clue Mode",   href: "#" },
  { id: 2,  name: "Opisute",     href: "#" },
  { id: 3,  name: "Novostore",   href: "#" },
  { id: 4,  name: "Mondo Jeans", href: "#" },
  { id: 5,  name: "Digishop",    href: "#" },
  { id: 6,  name: "Barberco",    href: "#" },
  { id: 7,  name: "Luxe Cut",    href: "#" },
  { id: 8,  name: "Trimcraft",   href: "#" },
]

// ─────────────────────────────────────────────────────────────────────────────
// SVG LOGO VARIANTS — tái tạo đúng phong cách từ ảnh
// Mỗi brand render một kiểu logo typography khác nhau
// ─────────────────────────────────────────────────────────────────────────────

/** Emblem tròn với laurel wreath */
function LogoEmblem({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase()
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        {/* Outer circle */}
        <circle cx="22" cy="22" r="20" stroke="currentColor" strokeWidth="0.9" fill="none" />
        {/* Inner circle */}
        <circle cx="22" cy="22" r="15" stroke="currentColor" strokeWidth="0.7" fill="none" />
        {/* Left leaf */}
        <path d="M8 22 C8 16,12 14,14 18 C12 18,10 20,8 22Z" fill="currentColor" opacity="0.7"/>
        <path d="M8 22 C8 28,12 30,14 26 C12 26,10 24,8 22Z" fill="currentColor" opacity="0.7"/>
        {/* Right leaf */}
        <path d="M36 22 C36 16,32 14,30 18 C32 18,34 20,36 22Z" fill="currentColor" opacity="0.7"/>
        <path d="M36 22 C36 28,32 30,30 26 C32 26,34 24,36 22Z" fill="currentColor" opacity="0.7"/>
        {/* Initial */}
        <text x="22" y="26" textAnchor="middle" fontSize="11" fill="currentColor"
          style={{ fontFamily: "serif", fontWeight: 400, letterSpacing: "0.05em" }}>
          {initial}
        </text>
      </svg>
      <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ fontFamily: "'Montserrat',sans-serif" }}>
        {name}
      </span>
    </div>
  )
}

/** Overline style: border-top + spaced caps */
function LogoOverline({ name, sub }: { name: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-[3px]">
      <div className="w-full border-t border-current mb-1" />
      <span className="text-[16px] font-bold tracking-[3px] uppercase leading-tight"
        style={{ fontFamily: "'Montserrat',sans-serif" }}>
        {name}
      </span>
      {sub && (
        <span className="text-[7px] tracking-[2.5px] uppercase opacity-70"
          style={{ fontFamily: "'Montserrat',sans-serif" }}>
          {sub}
        </span>
      )}
    </div>
  )
}

/** Square accent + name: "N OVOSTORE" */
function LogoSquareAccent({ name }: { name: string }) {
  const first = name.charAt(0).toUpperCase()
  const rest = name.slice(1).toUpperCase()
  return (
    <div className="flex items-center gap-[5px]">
      <span className="flex items-center justify-center w-[22px] h-[22px] bg-current text-white text-[13px] font-bold"
        style={{ fontFamily: "'Montserrat',sans-serif", color: "currentColor" }}>
        <span style={{ color: "#f6f3ed", mixBlendMode: "normal" }}>{first}</span>
      </span>
      <span className="text-[15px] font-bold tracking-[3px]"
        style={{ fontFamily: "'Montserrat',sans-serif" }}>
        {rest}
      </span>
    </div>
  )
}

/** Script / handwritten style */
function LogoScript({ name, sub }: { name: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-[2px]">
      <span className="text-[22px] font-light italic leading-tight"
        style={{ fontFamily: "'Playfair Display',serif", letterSpacing: "0.02em" }}>
        {name}
      </span>
      {sub && (
        <span className="text-[7px] tracking-[3px] uppercase opacity-70"
          style={{ fontFamily: "'Montserrat',sans-serif" }}>
          {sub}
        </span>
      )}
    </div>
  )
}

/** Boxed style: border rectangle around name */
function LogoBoxed({ name, sub }: { name: string; sub?: string }) {
  return (
    <div className="border border-current px-4 py-2 flex flex-col items-center gap-[2px]">
      <span className="text-[14px] font-bold tracking-[3px] uppercase"
        style={{ fontFamily: "'Montserrat',sans-serif" }}>
        {name}
      </span>
      {sub && (
        <div className="flex items-center gap-1 w-full justify-center">
          <span className="flex-1 border-t border-current opacity-50" />
          <span className="text-[7px] tracking-[2px] uppercase opacity-70"
            style={{ fontFamily: "'Montserrat',sans-serif" }}>
            {sub}
          </span>
          <span className="flex-1 border-t border-current opacity-50" />
        </div>
      )}
    </div>
  )
}

/** Minimal all-caps serif */
function LogoSerif({ name }: { name: string }) {
  return (
    <span className="text-[15px] font-light tracking-[5px] uppercase"
      style={{ fontFamily: "'Playfair Display',serif" }}>
      {name}
    </span>
  )
}

// Map brand id → logo variant (vòng lặp qua 6 styles)
function BrandLogo({ brand }: { brand: Brand }) {
  const variants = [
    <LogoEmblem    name={brand.name} />,
    <LogoOverline  name={brand.name} sub="boutique" />,
    <LogoSquareAccent name={brand.name} />,
    <LogoScript    name={brand.name} sub="london" />,
    <LogoBoxed     name={brand.name} sub="est. 1989" />,
    <LogoSerif     name={brand.name} />,
    <LogoOverline  name={brand.name} />,
    <LogoBoxed     name={brand.name} />,
  ]
  const idx = (Number(brand.id) - 1) % variants.length
  return <>{variants[idx]}</>
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function BrandsCarousel({
  brands = DEFAULT_BRANDS,
  autoplayDelay = 5000,
  isLoading = false,
}: BrandsCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const handleMouseEnter = useCallback(() => {
    swiperRef.current?.autoplay?.stop()
  }, [])
  const handleMouseLeave = useCallback(() => {
    swiperRef.current?.autoplay?.start()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@400;600;700&display=swap');

        .brands-swiper {
          /* Remove default swiper overflow */
          overflow: visible !important;
        }
        .brands-swiper .swiper-wrapper {
          align-items: center;
        }

        /* Fade edges */
        .brands-track-wrap {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .brands-swiper .swiper-wrapper {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div
        className="w-full bg-[#f6f3ed] border-t border-b border-[#e4ddd3] py-10 overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="brands-track-wrap w-full overflow-hidden">
          {isLoading ? (
            // Skeleton row
            <div className="flex items-center justify-center gap-16 px-10 animate-pulse">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 w-28 bg-[#e0d8cc] rounded" />
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, FreeMode]}
              onSwiper={s => { swiperRef.current = s }}
              onSlideChange={s => setActiveIdx(s.realIndex)}
              // slidesPerView: auto => chỉ định width bằng CSS
              slidesPerView="auto"
              spaceBetween={0}
              loop
              centeredSlides={false}
              freeMode={{
                enabled: true,
                momentum: true,
                momentumRatio: 0.35,
                momentumVelocityRatio: 0.5,
              }}
              grabCursor
              speed={700}
              autoplay={{
                delay: autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="brands-swiper"
            >
              {brands.map((brand, i) => (
                <SwiperSlide
                  key={brand.id}
                  style={{ width: "auto" }}
                >
                  <BrandSlide brand={brand} isActive={activeIdx === i} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BRAND SLIDE — wrapper với hover
// ─────────────────────────────────────────────────────────────────────────────
function BrandSlide({ brand, isActive }: { brand: Brand; isActive: boolean }) {
  const [hovered, setHovered] = useState(false)
  const Tag = brand.href ? "a" : "div"

  return (
    <Tag
      href={brand.href}
      target={brand.href ? "_blank" : undefined}
      rel={brand.href ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-center select-none cursor-pointer px-10 md:px-14 py-2"
      style={{
        color: hovered ? "#9e8060" : "#4a3f35",
        opacity: hovered ? 1 : 0.55,
        transform: hovered ? "scale(1.06)" : "scale(1)",
        transition: "color 0.3s ease, opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        // Divider between brands
        borderRight: "1px solid #d6cec4",
        minWidth: "160px",
      }}
    >
      <BrandLogo brand={brand} />
    </Tag>
  )
}