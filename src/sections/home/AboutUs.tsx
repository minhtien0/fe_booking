"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

// ─── Hook: trigger khi element scroll vào viewport ────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect() // chỉ trigger 1 lần, không reset
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

// ─── CTA Button: fill trượt từ trái sang phải ────────────────────────────────
function CtaButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center justify-center h-[50px] px-10 overflow-hidden border border-[#9e8060]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Sliding fill layer */}
      <span
        className="absolute inset-0 bg-[#9e8060] origin-left"
        style={{
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.45s cubic-bezier(0.76, 0, 0.24, 1)",
        }}
      />
      <span
        className="relative z-10 text-[11px] font-bold tracking-[2.5px] uppercase"
        style={{
          color: hovered ? "#ffffff" : "#9e8060",
          transition: "color 0.3s ease",
        }}
      >
        {children}
      </span>
    </Link>
  )
}

// ─── Barber Mustache & Beard SVG Logo ────────────────────────────────────────
function BarberLogo({ visible }: { visible: boolean }) {
  return (
    <div
      className="flex justify-center my-6 md:justify-start"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.85)",
        transition:
          "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s",
      }}
    >
      <svg
        width="96"
        height="106"
        viewBox="0 0 96 106"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mustache left curl */}
        <path
          d="M8 32 C6 18, 22 10, 36 22 C30 26, 18 26, 8 32Z"
          fill="#1c1713"
        />
        {/* Mustache right curl */}
        <path
          d="M88 32 C90 18, 74 10, 60 22 C66 26, 78 26, 88 32Z"
          fill="#1c1713"
        />
        {/* Center bridge */}
        <path
          d="M36 22 C40 30, 56 30, 60 22 C55 18, 41 18, 36 22Z"
          fill="#1c1713"
        />
        {/* Beard body */}
        <path
          d="M18 40 C15 54, 20 70, 30 80
             C37 88, 46 94, 48 96
             C50 94, 59 88, 66 80
             C76 70, 81 54, 78 40
             C66 45, 56 47, 48 47
             C40 47, 30 45, 18 40Z"
          fill="#1c1713"
        />
      </svg>
    </div>
  )
}

// ─── AboutUs Section ──────────────────────────────────────────────────────────
export default function AboutUs() {
  const { ref, inView } = useInView(0.2)

  // Helper: slide-up style với delay
  const slideUp = (delay: string): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(36px)",
    transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}`,
  })

  // Cấu hình 3 ảnh: điểm xuất phát, xoay, vị trí
  const imgConfigs = [
    {
      // Top-left, bay vào từ phía trái trên
      from: "translate(-70px, -70px) rotate(-6deg)",
      to: "translate(0, 0) rotate(-6deg)",
      delay: "0.1s",
      zIndex: 1,
      style: { top: "0%", left: "0%", width: "52%" },
    },
    {
      // Top-right, bay vào từ phía phải trên
      from: "translate(70px, -70px) rotate(5deg)",
      to: "translate(0, 0) rotate(5deg)",
      delay: "0.28s",
      zIndex: 2,
      style: { top: "4%", right: "0%", width: "52%" },
    },
    {
      // Bottom center, bay lên từ dưới
      from: "translate(0, 80px) rotate(0deg)",
      to: "translate(0, 0) rotate(0deg)",
      delay: "0.45s",
      zIndex: 3,
      style: { top: "30%", left: "8%", width: "68%" },
    },
  ]

  const imgUrls = [
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80",
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@400;600;700&display=swap');

        /* Giảm animation trên thiết bị yêu cầu reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .about-anim { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="w-full bg-[#f9f7f4] py-20 px-6 md:px-12 lg:px-24 overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-8 lg:gap-20">

          {/* ────── LEFT: Text ────────────────────────────────────────────── */}
          <div className="flex-1 text-center md:text-left max-w-[500px] w-full mx-auto md:mx-0">

            {/* Eyebrow label */}
            <p
              className="about-anim text-[#9e8060] text-[11px] font-semibold tracking-[3.5px] uppercase mb-3"
              style={{ fontFamily: "'Montserrat', sans-serif", ...slideUp("0s") }}
            >
              Introducing
            </p>

            {/* Heading — dòng 1 */}
            <h2 style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.15 }}>
              <span
                className="about-anim block text-[38px] md:text-[48px] font-light text-[#2c1f14]"
                style={slideUp("0.15s")}
              >
                ThienBinh Shop
              </span>
              {/* Dòng 2 italic + màu vàng gold */}
              <span
                className="about-anim block text-[38px] md:text-[48px] font-light italic text-[#9e8060]"
                style={slideUp("0.3s")}
              >
                Science 2016
              </span>
            </h2>

            {/* SVG Logo */}
            <BarberLogo visible={inView} />

            {/* Body text */}
            <p
              className="about-anim text-[#6b5c4e] text-[14px] leading-[1.85] mb-8 max-w-[420px] mx-auto md:mx-0"
              style={{ fontFamily: "'Montserrat', sans-serif", ...slideUp("0.7s") }}
            >
            Thiên Bình dịch vụ chính là cắt, tạo kiểu và cạo tóc cho nam giới và trẻ em trai. Nơi làm việc của thợ cắt tóc được gọi là "tiệm cắt tóc" hoặc "cửa hàng cắt tóc". Tiệm cắt tóc cũng là nơi giao lưu xã hội và thảo luận công khai. Trong một số trường hợp, tiệm cắt tóc còn là diễn đàn công cộng.
            </p>

            {/* CTA */}
            <div
              className="about-anim flex justify-center md:justify-start"
              style={slideUp("0.85s")}
            >
              <CtaButton href="/about">Xem Thêm</CtaButton>
            </div>
          </div>

          {/* ────── RIGHT: 3 overlapping images — Desktop ─────────────────── */}
          <div className="flex-1 w-full hidden md:block">
            {/* Padding-bottom trick để giữ tỉ lệ container */}
            <div className="relative w-full" style={{ paddingBottom: "88%" }}>
              {imgConfigs.map((cfg, i) => (
                <div
                  key={i}
                  className="about-anim absolute overflow-hidden shadow-2xl"
                  style={{
                    ...cfg.style,
                    zIndex: cfg.zIndex,
                    borderRadius: "3px",
                    transform: inView ? cfg.to : cfg.from,
                    opacity: inView ? 1 : 0,
                    transition: `transform 1s cubic-bezier(0.16,1,0.3,1) ${cfg.delay}, opacity 0.65s ease ${cfg.delay}`,
                    // Subtle box shadow để tạo depth
                    boxShadow: "0 8px 40px rgba(44,31,20,0.18)",
                  }}
                >
                  <img
                    src={imgUrls[i]}
                    alt={`Barber ${i + 1}`}
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: "4/3", display: "block" }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ────── RIGHT: Mobile — đơn giản hơn, slide up thay vì bay ───── */}
          <div className="md:hidden w-full flex flex-col gap-4">
            {imgUrls.map((src, i) => (
              <div
                key={i}
                className="about-anim overflow-hidden rounded shadow-lg"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.65s ease ${i * 0.15}s, transform 0.65s ease ${i * 0.15}s`,
                  boxShadow: "0 4px 20px rgba(44,31,20,0.12)",
                }}
              >
                <img
                  src={src}
                  alt={`Barber ${i + 1}`}
                  className="w-full object-cover"
                  style={{ aspectRatio: "16/9", display: "block" }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}