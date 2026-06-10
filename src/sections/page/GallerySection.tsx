"use client"

import { useState, useCallback, useRef, useEffect } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface GalleryImage {
  id: string | number
  src: string
  alt: string
  category: string
  span?: "wide" | "tall" | "normal"
}

export interface GalleryCategory {
  label: string
  value: string
}

export interface GallerySectionProps {
  categories?: GalleryCategory[]
  images?: GalleryImage[]
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT DATA — 12 images, 3 per category
// span mix creates the mosaic: wide=col-span-2, tall=row-span-2, normal=1×1
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_CATEGORIES: GalleryCategory[] = [
  { label: "Tất Cả",          value: "all" },
  { label: "Cắt Tóc",      value: "haircut" },
  { label: "Chăm Mặt", value: "face-masking" },
  { label: "Cạo râu",      value: "shaving" },
  { label: "Uốn Nhuộm",   value: "hair-color" },
]

const DEFAULT_IMAGES: GalleryImage[] = [
  // SHAVING
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=85",
    alt: "Precision razor shaving",
    category: "shaving",
    span: "wide",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=85",
    alt: "Classic barber tools on table",
    category: "shaving",
    span: "normal",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=600&q=85",
    alt: "Hot towel straight-razor shave",
    category: "shaving",
    span: "tall",
  },

  // HAIRCUT
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=85",
    alt: "Post-wash towel wrap",
    category: "haircut",
    span: "normal",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1500840216050-6ffa99d75160?w=600&q=85",
    alt: "Modern scissor haircut",
    category: "haircut",
    span: "wide",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1584297091622-af8e5bd80b13?w=600&q=85",
    alt: "Barber crafting a fresh cut",
    category: "haircut",
    span: "tall",
  },

  // FACE MASKING
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&q=85",
    alt: "Relaxing scalp massage",
    category: "face-masking",
    span: "tall",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=85",
    alt: "Clay face-mask treatment",
    category: "face-masking",
    span: "normal",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900&q=85",
    alt: "Luxury spa facial",
    category: "face-masking",
    span: "wide",
  },

  // HAIR COLOR
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=85",
    alt: "Blow-dry finish styling",
    category: "hair-color",
    span: "normal",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85",
    alt: "Foil highlight technique",
    category: "hair-color",
    span: "wide",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1500840216050-6ffa99d75160?w=600&q=85",
    alt: "Vibrant hair colouring",
    category: "hair-color",
    span: "tall",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY ITEM
// ─────────────────────────────────────────────────────────────────────────────
function GalleryItem({
  image,
  visible,
  index,
}: {
  image: GalleryImage
  visible: boolean
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  // Reset hover state whenever this item becomes invisible
  useEffect(() => {
    if (!visible) setHovered(false)
  }, [visible])

  const stagger = `${index * 0.055}s`

  // Tailwind span classes
  const spanClass =
    image.span === "wide"
      ? "col-span-1 sm:col-span-2"
      : image.span === "tall"
      ? "col-span-1 row-span-2"
      : "col-span-1"

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden cursor-pointer ${spanClass}`}
      style={{
        opacity:       visible ? 1 : 0,
        transform:     visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)",
        transition:    visible
          ? `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${stagger},
             transform 0.55s cubic-bezier(0.22,1,0.36,1) ${stagger}`
          : "opacity 0.28s ease, transform 0.28s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* ── Image ─────────────────────────────────────────── */}
      <img
        src={image.src}
        alt={image.alt}
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{
          filter:     hovered ? "grayscale(1) brightness(0.82)" : "grayscale(0) brightness(1)",
          transform:  hovered ? "scale(1.07)" : "scale(1)",
          transition: "filter 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1)",
        }}
        loading="lazy"
        draggable={false}
      />

      {/* ── Hover overlay ─────────────────────────────────── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: hovered ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0)",
          transition: "background 0.55s ease",
        }}
      >
        {/* Circle + icon */}
        <div
          style={{
            opacity:    hovered ? 1 : 0,
            transform:  hovered ? "scale(1) rotate(0deg)" : "scale(0.55) rotate(-45deg)",
            transition: "opacity 0.4s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="23" cy="23" r="21.5" stroke="white" strokeWidth="1.4" />
            <line x1="23" y1="14" x2="23" y2="32" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="14" y1="23" x2="32" y2="23" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Bottom category label (fades in on hover) ─────── */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-2"
        style={{
          opacity:    hovered ? 1 : 0,
          transform:  hovered ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.4s ease 0.05s, transform 0.45s cubic-bezier(0.22,1,0.36,1) 0.05s",
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
        }}
      >
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize:   "10px",
            fontWeight: 600,
            letterSpacing: "2.5px",
            color: "rgba(255,255,255,0.85)",
            textTransform: "uppercase",
          }}
        >
          {image.alt}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER TAB
// ─────────────────────────────────────────────────────────────────────────────
function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative px-1 pb-1 outline-none select-none"
      style={{
        fontFamily:    "'Montserrat', sans-serif",
        fontSize:      "11px",
        fontWeight:    700,
        letterSpacing: "2.2px",
        textTransform: "uppercase",
        color:         active ? "#9e8060" : "#6b5d52",
        transition:    "color 0.3s ease",
        background:    "none",
        border:        "none",
        cursor:        "pointer",
      }}
    >
      {label}

      {/* Animated underline */}
      <span
        className="absolute bottom-0 left-0 h-[1.5px]"
        style={{
          width:      active ? "100%" : "0%",
          background: "#9e8060",
          transition: "width 0.38s cubic-bezier(0.76,0,0.24,1)",
        }}
      />
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────
export default function GallerySection({
  categories = DEFAULT_CATEGORIES,
  images     = DEFAULT_IMAGES,
}: GallerySectionProps) {
  const [activeFilter,    setActiveFilter]    = useState("all")
  const [displayedImages, setDisplayedImages] = useState<GalleryImage[]>(images)
  const [phase,           setPhase]           = useState<"in" | "out">("in")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleFilter = useCallback(
    (value: string) => {
      if (value === activeFilter || phase === "out") return

      // Phase 1: fade out current images
      setPhase("out")

      timerRef.current = setTimeout(() => {
        // Phase 2: swap images then fade in
        const next = value === "all"
          ? images
          : images.filter(img => img.category === value)
        setDisplayedImages(next)
        setActiveFilter(value)

        // Let DOM update before fading in
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setPhase("in"))
        )
      }, 320)
    },
    [activeFilter, phase, images]
  )

  // Cleanup timer on unmount
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        @media (prefers-reduced-motion: reduce) {
          .gal-section * { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <section className="gal-section w-full bg-[#f9f7f4] py-14 px-4 md:px-8 lg:px-12">

        {/* ── Filter tabs ────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10">
          {categories.map(cat => (
            <FilterTab
              key={cat.value}
              label={cat.label}
              active={activeFilter === cat.value}
              onClick={() => handleFilter(cat.value)}
            />
          ))}
        </div>

        {/* ── Mosaic grid ─────────────────────────────────────────────
            grid-auto-rows = base row height (260px).
            wide  → col-span-2  (landscape hero)
            tall  → row-span-2  (portrait feature)
            normal → 1×1
            grid-auto-flow: dense fills gaps for true mosaic feel
        ──────────────────────────────────────────────────────────── */}
        <div
          className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[6px]"
          style={{ gridAutoRows: "260px", gridAutoFlow: "dense" }}
        >
          {displayedImages.map((img, i) => (
            <GalleryItem
              key={img.id}
              image={img}
              visible={phase === "in"}
              index={i}
            />
          ))}
        </div>

      </section>
    </>
  )
}