"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface Tag {
  id: string | number
  name: string
  slug: string
}

interface TagCloudProps {
  tags?: Tag[]
  activeSlug?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function TagCloud({
  tags = [],
  activeSlug,
}: TagCloudProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleTagClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("tag", slug)
    params.delete("page")

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="mb-8">
      <h3
        className="text-[15px] font-semibold text-[#1e1510] mb-4"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Tag Clouds
      </h3>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = activeSlug === tag.slug

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagClick(tag.slug)}
              className="px-3 py-[5px] text-[11px] font-semibold border"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                borderColor: isActive ? "#9e8060" : "#ccc4b8",
                color: isActive ? "#fff" : "#4a3f35",
                background: isActive ? "#9e8060" : "transparent",
                transition: "all 0.2s ease",
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "#9e8060"
                  e.currentTarget.style.color = "#9e8060"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "#ccc4b8"
                  e.currentTarget.style.color = "#4a3f35"
                }
              }}
            >
              {tag.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}