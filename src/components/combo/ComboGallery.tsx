"use client"

import { useState } from "react"

interface ComboGalleryProps {
  images: string[]
  name: string
}

export default function ComboGallery({ images, name }: ComboGalleryProps) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (!images.length) return null

  return (
    <>
      <div className="mt-12 pt-10 border-t border-[#ede8e0]">
        <h2 className="text-[20px] md:text-[26px] font-light text-[#1e1510] mb-6"
          style={{ fontFamily: "'Playfair Display',serif" }}>
          Không gian & trải nghiệm
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((src, i) => (
            <button key={i} onClick={() => setLightbox(src)}
              className="relative overflow-hidden group"
              style={{ aspectRatio: i === 0 ? "16/9" : "4/3",
                gridColumn: i === 0 ? "span 2" : "span 1" }}>
              <img src={src} alt={`${name} ${i + 1}`}
                className="w-full h-full object-cover"
                style={{
                  transform: "scale(1)",
                  transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                loading="lazy" />
              {/* overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center"
                style={{ transition: "background 0.3s ease" }}>
                <svg className="opacity-0 group-hover:opacity-100" width="36" height="36"
                  viewBox="0 0 36 36" fill="none"
                  style={{ transition: "opacity 0.3s ease" }}>
                  <circle cx="18" cy="18" r="17" stroke="white" strokeWidth="1.5" />
                  <path d="M13 18h10M18 13v10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-6 text-white/70 hover:text-white text-[28px] leading-none"
            style={{ fontFamily: "sans-serif" }} onClick={() => setLightbox(null)}>×</button>
          <img src={lightbox} alt={name}
            className="max-w-full max-h-[88vh] object-contain"
            onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}