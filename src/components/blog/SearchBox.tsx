"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface SearchBoxProps {
  defaultValue?: string
  placeholder?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function SearchBox({
  defaultValue = "",
  placeholder = "Search...",
}: SearchBoxProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [keyword, setKeyword] = useState(defaultValue)

  // Sync khi URL đổi
  useEffect(() => {
    setKeyword(defaultValue)
  }, [defaultValue])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    const trimmed = keyword.trim()

    // reset page khi search
    params.delete("page")

    if (trimmed) {
      params.set("search", trimmed)
    } else {
      params.delete("search")
    }

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  const handleClear = () => {
    setKeyword("")

    const params = new URLSearchParams(searchParams.toString())

    params.delete("search")
    params.delete("page")

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  return (
    <div className="mb-8">
      <h3
        className="text-[15px] font-semibold text-[#1e1510] mb-4"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Search
      </h3>

      <form
        onSubmit={handleSubmit}
        className="relative"
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-[#e7dfd4] bg-white px-4 py-3 pr-20 text-[13px] outline-none focus:border-[#9e8060] transition-colors"
          style={{
            fontFamily: "'Montserrat', sans-serif",
          }}
        />

        <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2">
          {keyword && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[#999] hover:text-[#9e8060] text-[12px] transition-colors"
            >
              Clear
            </button>
          )}

          <button
            type="submit"
            className="text-[#9e8060] hover:opacity-80 transition-opacity"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}