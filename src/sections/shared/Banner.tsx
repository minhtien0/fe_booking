"use client"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface BannerSlide {
  image: string
  eyebrow?: string        
  title: string           
  description?: string    
}

export interface BannerSectionProps {
  slides: BannerSlide[]
  height?: string         
}

// ─────────────────────────────────────────────────────────────────────────────
// MUSTACHE DIVIDER
// ─────────────────────────────────────────────────────────────────────────────
function MustacheDivider() {
  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="block w-5 h-[1.5px] bg-[#c8a97a] rounded-full"
          style={{ opacity: 0.8 }}
        />
      ))}
      <svg width="28" height="16" viewBox="0 0 32 18" fill="none">
        <path
          d="M1 9 C1 3,8 1,13 6 C14.5 7.5,15 8,16 8
             C17 8,17.5 7.5,19 6 C24 1,31 3,31 9
             C28 8,24 9,22 11 C20 13,18 13,16 11
             C14 13,12 13,10 11 C8 9,4 8,1 9Z"
          fill="#b89a6a"
        />
      </svg>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="block w-5 h-[1.5px] bg-[#c8a97a] rounded-full"
          style={{ opacity: 0.8 }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BANNER SECTION
// ─────────────────────────────────────────────────────────────────────────────
export default function BannerSection({
  slides,
  height = "420px",
}: BannerSectionProps) {
  // Chỉ dùng slide đầu tiên làm banner tĩnh
  // (nếu sau này muốn mở rộng thành slider thì thêm Swiper vào đây)
  const slide = slides[0]
  if (!slide) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@400;600;700&display=swap');
      `}</style>

      <section
        className="relative w-full overflow-hidden"
        style={{ height: `clamp(260px, 38vw, ${height})` }}
        aria-label={slide.title}
      >
        {/* ── Background image ──────────────────────────────────────────── */}
        <img
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* ── Dark overlay ──────────────────────────────────────────────── */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.2) 100%)",
          }}
        />

        {/* ── Content ───────────────────────────────────────────────────── */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center text-white max-w-[680px] mx-auto">

            {/* Eyebrow */}
            {slide.eyebrow && (
              <p
                className="text-[#e8d5a3] text-[13px] tracking-[3px] mb-3 italic"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {slide.eyebrow}
              </p>
            )}

            {/* Title */}
            <h1
              className="text-white text-[clamp(28px,5vw,52px)] font-light leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {slide.title}
            </h1>

            {/* Mustache divider */}
            <MustacheDivider />

            {/* Description */}
            {slide.description && (
              <p
                className="text-white/70 text-[14px] leading-relaxed mt-5 max-w-[480px] mx-auto"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {slide.description}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}