"use client"

import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { useAuthStore } from "../../../stores/auth"

const BREADCRUMB_MAP: Record<string, string[]> = {
  "/admin":           ["Dashboard"],
  "/admin/bookings":  ["Quản lý", "Đặt lịch"],
  "/admin/barbers":   ["Quản lý", "Barbers"],
  "/admin/services":  ["Quản lý", "Dịch vụ"],
  "/admin/combos":    ["Quản lý", "Combo"],
  "/admin/blog":      ["Quản lý", "Blog"],
  "/admin/gallery":   ["Quản lý", "Gallery"],
  "/admin/settings":  ["Hệ thống", "Cài đặt"],
}

interface Props {
  collapsed: boolean
}

export default function AdminHeader({ collapsed }: Props) {
  const pathname  = usePathname()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const crumbs    = BREADCRUMB_MAP[pathname] ?? ["Admin"]

  const [isOpenDropdown, setIsOpenDropdown] = useState(false)
  const [isLoggingOut,   setIsLoggingOut]   = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpenDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      // Gọi Next.js logout route — route này sẽ:
      // 1. Đọc HttpOnly cookie lấy token
      // 2. Gọi NestJS /auth/logout để blacklist + xoá DB
      // 3. Xoá tất cả cookie
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Lỗi mạng vẫn tiếp tục logout phía client
    }

    // Xoá Zustand store
    clearAuth()

    // Redirect về login
    window.location.href = '/login?reason=logout'
  }

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between h-16 px-6"
      style={{
        left:        collapsed ? 68 : 240,
        background:  "#fff",
        borderBottom: "1px solid #f0ebe3",
        transition:  "left 0.28s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2l4 4-4 4" stroke="#d6cec4" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
            <span
              className="text-[13px]"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color:      i === crumbs.length - 1 ? "#1e1510" : "#bbb",
                fontWeight: i === crumbs.length - 1 ? 600 : 400,
              }}
            >
              {c}
            </span>
          </span>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 flex items-center justify-center border border-[#ede8e0] rounded-sm hover:border-[#b89a6a]"
          style={{ transition: "border-color 0.18s", color: "#9e8060" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full border-2 border-white"
            style={{ background: "#b89a6a" }}
          />
        </button>

        <div className="w-px h-6 bg-[#f0ebe3]" />

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setIsOpenDropdown(!isOpenDropdown)}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
              style={{ background: "#b89a6a", fontFamily: "'Playfair Display', serif" }}
            >
              A
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[12px] font-semibold text-[#1e1510] leading-none"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Admin
              </p>
              <p className="text-[10px] text-[#bbb] mt-[2px]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Quản trị viên
              </p>
            </div>
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              className={`text-[#bbb] transition-transform duration-200 ${isOpenDropdown ? 'rotate-180' : ''}`}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>

          {isOpenDropdown && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border border-[#ede8e0] shadow-lg py-1 z-50"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <div className="px-4 py-2 border-b border-[#f5f0e8] sm:hidden">
                <p className="text-[12px] font-semibold text-[#1e1510]">Admin</p>
                <p className="text-[10px] text-[#bbb]">Quản trị viên</p>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-left px-4 py-2.5 text-[12px] text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <span className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                )}
                {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}