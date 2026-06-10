"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import Link from "next/link"
import { useState } from "react"
import BookingTrigger from "../../components/booking/BookingTrigger"
function CtaButton({ href }: { href: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center justify-center h-[54px] px-10 overflow-hidden border border-[#e8d5a3]/60 group/btn"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <span
        className="absolute inset-0 bg-[#e8d5a3] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] origin-left"
        style={{ transform: hovered ? "scaleX(1)" : "scaleX(0)" }}
      />
      <span
        className="relative z-10 text-[11px] font-bold tracking-[2.5px] transition-colors duration-300"
        style={{ color: hovered ? "#1c1713" : "#ffffff" }}
      >
        Đặt Lịch Hẹn
      </span>
    </Link>
  )
}

const slides = [
  {
    img: "https://img5.thuthuatphanmem.vn/uploads/2022/01/16/hinh-anh-barber-dep-chat-nhat-viet-nam_021743225.jpg",
    eyebrow: "Tôn Trọng Cổ Điển",
    heading: ["Phong cách cắt tóc", "Giúp nụ cười của bạn thêm rạng rỡ."],
    sub: "Tiệm cắt tóc của chúng tôi là không gian được tạo ra dành riêng cho những quý ông đánh giá cao chất lượng cao cấp, thời gian và vẻ ngoài hoàn hảo.",
  },
  {
    img: "https://img5.thuthuatphanmem.vn/uploads/2022/01/16/hinh-anh-barber-viet-nam-ngau-tuyet-dep_021744424.jpg",
    eyebrow: "Trải nghiệm cắt tóc cao cấp",
    heading: ["Hãy chỉnh chu", "Hãy tự tin."],
    sub: "Dịch vụ chăm sóc cá nhân tinh tế dành cho quý ông hiện đại. Bước vào và bước ra với vẻ ngoài hoàn hảo nhất.",
  },
]

export default function HeroSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@400;600;700&display=swap');

        /* Ken Burns effect */
        @keyframes kenBurns {
          0%   { transform: scale(1.08) translate(0%, 0%); }
          100% { transform: scale(1) translate(-1%, -0.5%); }
        }

        /* Reveal from bottom */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Eyebrow line expand */
        @keyframes lineExpand {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }

        .swiper-slide-active .hero-img {
          animation: kenBurns 7s ease-out forwards;
        }

        .swiper-slide-active .hero-eyebrow {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }
        .swiper-slide-active .hero-line {
          animation: lineExpand 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }
        .swiper-slide-active .hero-h1-1 {
          animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
        }
        .swiper-slide-active .hero-h1-2 {
          animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
        }
        .swiper-slide-active .hero-sub {
          animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both;
        }
        .swiper-slide-active .hero-cta {
          animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both;
        }

        /* Pagination styling */
        .hero-swiper .swiper-pagination {
          bottom: 36px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .hero-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: rgba(232, 213, 163, 0.45);
          opacity: 1;
          transition: all 0.4s ease;
          margin: 0 !important;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          width: 28px;
          background: #e8d5a3;
        }
      `}</style>

      <section className="w-full h-screen relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          speed={1000}
          className="w-full h-full hero-swiper"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-full overflow-hidden">
                {/* Image with Ken Burns */}
                <img
                  src={slide.img}
                  className="hero-img absolute inset-0 w-full h-full object-cover object-center"
                  alt={slide.eyebrow}
                />

                {/* Gradient overlay — richer, more cinematic */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative z-10 h-full flex items-center">
                  <div className="ml-[8%] max-w-[600px] text-white">

                    {/* Eyebrow */}
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        className="hero-line block h-px w-10 bg-[#e8d5a3] origin-left"
                        style={{ opacity: 0, transform: "scaleX(0)" }}
                      />
                      <p
                        className="hero-eyebrow text-[#e8d5a3] text-[11px] font-semibold tracking-[3.5px] uppercase"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          opacity: 0,
                          transform: "translateY(32px)",
                        }}
                      >
                        {slide.eyebrow}
                      </p>
                    </div>

                    {/* Heading — Playfair Display, line by line */}
                    <h1
                      style={{ fontFamily: "'Playfair Display', serif" }}
                      className="mb-6"
                    >
                      {slide.heading.map((line, li) => (
                        <span
                          key={li}
                          className={`block text-5xl md:text-[64px] leading-[1.12] font-light ${li === 1 ? "italic text-[#e8d5a3]" : ""} ${li === 0 ? "hero-h1-1" : "hero-h1-2"}`}
                          style={{ opacity: 0, transform: "translateY(32px)" }}
                        >
                          {line}
                        </span>
                      ))}
                    </h1>

                    {/* Sub */}
                    <p
                      className="hero-sub text-white/65 text-[15px] leading-relaxed max-w-[420px] mb-10"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        opacity: 0,
                        transform: "translateY(32px)",
                        fontWeight: 400,
                      }}
                    >
                      {slide.sub}
                    </p>

                    {/* CTA */}
                    <div
                      className="hero-cta"
                      style={{ opacity: 0, transform: "translateY(32px)" }}
                    >
                      <BookingTrigger label="Đặt Lịch Hẹn" variant="outline" />
                    </div>

                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  )
}