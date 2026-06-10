"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/pagination"

// ─── Data ─────────────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "Có những công ty thiết kế, và rồi có những chuyên gia thiết kế giao diện trải nghiệm người dùng chuyên nghiệp. Đây là một trong những thương hiệu nổi tiếng nhất thế giới.",
    author: "Tu Sena",
    role: "IT Solutions",
    bg: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=85",
  },
  {
    quote:
      "Dịch vụ tuyệt vời và sự chú ý đến từng chi tiết. Các thợ cắt tóc ở đây đều là những người thợ lành nghề thực thụ, họ rất tự hào về công việc của mình. Tôi chưa bao giờ trông đẹp hơn thế này.",
    author: "Teacher Ba",
    role: "Creative Director",
    bg: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1400&q=85",
  },
  {
    quote:
      "Vượt trội hơn hẳn so với những nơi khác — theo đúng nghĩa đen. Không gian cổ điển, kỹ năng hiện đại. Địa điểm yêu thích của tôi cho trải nghiệm chăm sóc sắc đẹp cao cấp.",
    author: "Ộ I I",
    role: "Brand Strategist",
    bg: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1400&q=85",
  },
]

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [slideDir, setSlideDir] = useState<"left" | "right">("left")
  const [isAnimating, setIsAnimating] = useState(false)
  const swiperRef = useRef<SwiperType | null>(null)
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Tổng số slides
  const total = testimonials.length

  // ── Xử lý khi Swiper chuyển slide ─────────────────────────────────────────
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    const newIndex = swiper.realIndex
    const oldIndex = activeIndex

    // Xác định hướng lướt
    const dir =
      newIndex > oldIndex ||
      (oldIndex === total - 1 && newIndex === 0)
        ? "left"
        : "right"

    // Nếu đang animate thì cancel timer cũ
    if (animTimerRef.current) clearTimeout(animTimerRef.current)

    setPrevIndex(oldIndex)
    setSlideDir(dir)
    setActiveIndex(newIndex)
    setIsAnimating(true)

    // Reset animating flag sau khi transition hoàn tất
    animTimerRef.current = setTimeout(() => {
      setIsAnimating(false)
      setPrevIndex(null)
    }, 900)
  }, [activeIndex, total])

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current)
    }
  }, [])

  // ── Clip-path reveal theo hướng lướt ──────────────────────────────────────
  // "Incoming" bg slide in từ phía người dùng lướt
  const getIncomingClip = (): React.CSSProperties => {
    if (!isAnimating) {
      return { clipPath: "inset(0 0% 0 0%)", transition: "none" }
    }
    const fromRight = slideDir === "left"
    return {
      clipPath: fromRight
        ? "inset(0 0% 0 0%)"   // reveal từ trái → phải (lướt sang trái)
        : "inset(0 0% 0 0%)",   // reveal từ phải → trái (lướt sang phải)
      animation: fromRight
        ? "revealFromRight 0.85s cubic-bezier(0.76,0,0.24,1) forwards"
        : "revealFromLeft 0.85s cubic-bezier(0.76,0,0.24,1) forwards",
    }
  }

  // "Outgoing" bg slide out ngược chiều
  const getOutgoingClip = (): React.CSSProperties => {
    if (!isAnimating || prevIndex === null) return { opacity: 0 }
    const fromRight = slideDir === "left"
    return {
      animation: fromRight
        ? "exitToLeft 0.85s cubic-bezier(0.76,0,0.24,1) forwards"
        : "exitToRight 0.85s cubic-bezier(0.76,0,0.24,1) forwards",
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@400;600;700&display=swap');

        /* ── Background reveal animations ── */
        @keyframes revealFromRight {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }
        @keyframes revealFromLeft {
          from { clip-path: inset(0 0 0 100%); }
          to   { clip-path: inset(0 0 0 0%); }
        }
        @keyframes exitToLeft {
          from { clip-path: inset(0 0% 0 0); transform: translateX(0); }
          to   { clip-path: inset(0 0% 0 0); transform: translateX(-4%); opacity: 0; }
        }
        @keyframes exitToRight {
          from { clip-path: inset(0 0% 0 0); transform: translateX(0); }
          to   { clip-path: inset(0 0% 0 0); transform: translateX(4%); opacity: 0; }
        }

        /* ── Quote fade/slide ── */
        @keyframes quoteIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Swiper pagination pill ── */
        .testimonial-swiper .swiper-pagination {
          bottom: 0 !important;
          position: relative !important;
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .testimonial-swiper .swiper-pagination-bullet {
          width: 8px; height: 8px;
          background: rgba(255,255,255,0.35);
          opacity: 1;
          border-radius: 9999px;
          transition: all 0.4s ease;
          margin: 0 !important;
        }
        .testimonial-swiper .swiper-pagination-bullet-active {
          width: 28px;
          background: #e8d5a3;
        }

        @media (prefers-reduced-motion: reduce) {
          .testi-bg, .testi-quote { animation-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── Outer container: fixed aspect ratio, clips overflow ────────────── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "480px", height: "clamp(480px, 56vw, 640px)" }}>

        {/* ══ BACKGROUND LAYER ══════════════════════════════════════════════ */}
        {/* Outgoing BG */}
        {prevIndex !== null && isAnimating && (
          <div
            key={`bg-out-${prevIndex}`}
            className="testi-bg absolute inset-0 z-0"
            style={getOutgoingClip()}
          >
            <img
              src={testimonials[prevIndex].bg}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/55" />
          </div>
        )}

        {/* Incoming / Active BG */}
        <div
          key={`bg-in-${activeIndex}`}
          className="testi-bg absolute inset-0 z-1"
          style={getIncomingClip()}
        >
          <img
            src={testimonials[activeIndex].bg}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              // Subtle Ken Burns on active bg
              animation: "kenBurns 8s ease-out forwards",
            }}
          />
          {/* Cinematic dark overlay */}
          <div className="absolute inset-0 bg-black/55" />
          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </div>

        {/* Ken Burns keyframe injected globally */}
        <style>{`
          @keyframes kenBurns {
            from { transform: scale(1.06); }
            to   { transform: scale(1); }
          }
        `}</style>

        {/* ══ SWIPER CONTENT LAYER ════════════════════════════════════════== */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="w-full max-w-[800px] mx-auto">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
              speed={700}
              className="testimonial-swiper"
              onSwiper={(swiper) => { swiperRef.current = swiper }}
              onSlideChange={handleSlideChange}
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={i}>
                  <div
                    className="text-white text-center px-4 md:px-12"
                    style={{
                      animation: "quoteIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both",
                    }}
                  >
                    {/* Opening quote mark */}
                    <div
                      className="text-[#b89a6a] text-[72px] leading-none mb-[-12px] select-none"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      "
                    </div>

                    {/* Quote text */}
                    <blockquote
                      className="text-white text-[18px] md:text-[22px] leading-[1.65] font-light mb-6"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {t.quote}
                    </blockquote>

                    {/* Author */}
                    <cite
                      className="not-italic"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <span className="text-[#e8d5a3] text-[13px] font-semibold tracking-[1.5px]">
                        {t.author}
                      </span>
                      <span className="text-white/50 text-[13px] mx-2">—</span>
                      <span className="text-white/60 text-[12px] tracking-[1px]">
                        {t.role}
                      </span>
                    </cite>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

      </section>
    </>
  )
}