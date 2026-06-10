"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface Category {
  id: string | number
  name: string
  slug: string
  count?: number
}

interface CategoryListProps {
  categories?: Category[]
  activeSlug?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function CategoryList({
  categories = [],
  activeSlug,
}: CategoryListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("category", slug)
    params.delete("page")

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="mb-8">
      <h3
        className="text-[15px] font-semibold text-[#1e1510] mb-4"
        style={{ fontFamily: "'Playfair Display',serif" }}
      >
        Categories
      </h3>

      <ul className="space-y-[6px]">
        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug
          return (
            <li key={cat.id}>
              <button
                onClick={() => handleCategoryClick(cat.slug)}
                className="flex items-center justify-between text-[13px] py-[2px] w-full text-left"
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  color: isActive ? "#9e8060" : "#4a3f35",
                  fontWeight: isActive ? 600 : 400,
                  transition: "color 0.2s",
                }}
              >
                <span
                  className="hover:text-[#9e8060]"
                  style={{ transition: "color 0.2s" }}
                >
                  {cat.name}
                </span>

                {cat.count !== undefined && (
                  <span className="text-[11px] text-[#aaa]">
                    ({cat.count})
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}