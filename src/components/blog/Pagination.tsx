"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  // ───────────────────────────────────────────────────────────────────────────
  // BUILD URL GIỮ NGUYÊN QUERY HIỆN TẠI
  // VD:
  // /blog?tag=abc&page=2
  // /blog?search=test&page=3
  // ───────────────────────────────────────────────────────────────────────────
  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("page", String(page))

    // Page 1 => bỏ page khỏi URL cho đẹp
    if (page === 1) {
      params.delete("page")
    }

    const query = params.toString()

    return query ? `${pathname}?${query}` : pathname
  }

  // ───────────────────────────────────────────────────────────────────────────
  // BUILD PAGE NUMBERS + ...
  // ───────────────────────────────────────────────────────────────────────────
  const pages: (number | "...")[] = []

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (currentPage > 3) {
      pages.push("...")
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push("...")
    }

    pages.push(totalPages)
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STYLE
  // ───────────────────────────────────────────────────────────────────────────
  const btnBase: React.CSSProperties = {
    fontFamily: "'Montserrat',sans-serif",
    fontSize: "13px",
    minWidth: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #d6cec4",
    transition: "all 0.2s ease",
  }

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-10"
      aria-label="Pagination"
    >
      {/* PREV */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          scroll={false}
          prefetch
          style={{ ...btnBase, color: "#4a3f35" }}
          className="hover:border-[#9e8060] hover:text-[#9e8060]"
          aria-label="Previous page"
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path
              d="M7 1L2 6L7 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      ) : (
        <span
          style={{
            ...btnBase,
            color: "#ccc",
            cursor: "not-allowed",
          }}
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path
              d="M7 1L2 6L7 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}

      {/* PAGE ITEMS */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dot-${i}`}
            style={{
              ...btnBase,
              border: "none",
              color: "#aaa",
            }}
          >
            …
          </span>
        ) : p === currentPage ? (
          <span
            key={p}
            style={{
              ...btnBase,
              background: "#9e8060",
              borderColor: "#9e8060",
              color: "#fff",
            }}
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            scroll={false}
            prefetch
            style={{
              ...btnBase,
              color: "#4a3f35",
            }}
            className="hover:border-[#9e8060] hover:text-[#9e8060]"
          >
            {p}
          </Link>
        )
      )}

      {/* NEXT */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          scroll={false}
          prefetch
          style={{ ...btnBase, color: "#4a3f35" }}
          className="hover:border-[#9e8060] hover:text-[#9e8060]"
          aria-label="Next page"
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path
              d="M1 1L6 6L1 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      ) : (
        <span
          style={{
            ...btnBase,
            color: "#ccc",
            cursor: "not-allowed",
          }}
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path
              d="M1 1L6 6L1 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}
    </nav>
  )
}