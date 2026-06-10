"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// ── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    group: "Tổng quan",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
      {
        href: "/admin/bookings",
        label: "Đặt lịch",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        ),
        badge: 3,
      },
    ],
  },
  {
    group: "Quản lý",
    items: [
      {
        href: "/admin/barbers",
        label: "Barbers",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        href: "/admin/services",
        label: "Dịch vụ",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        ),
      },
      {
        href: "/admin/combos",
        label: "Combo",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        ),
      },
      {
        href: "/admin/blog",
        label: "Blog",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
        ),
      },
      {
        href: "/admin/gallery",
        label: "Gallery",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        ),
      },
    ],
  },
  {
    group: "Hệ thống",
    items: [
      {
        href: "/admin/settings",
        label: "Cài đặt",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        ),
      },
    ],
  },
]

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export default function AdminSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)

  return (
    <>
      <aside
        className="fixed left-0 top-0 h-screen z-40 flex flex-col"
        style={{
          width:      "var(--sidebar-width)", // Kế thừa biến từ Layout cha
          background: "#0f0c08",
          borderRight: "1px solid rgba(184,154,106,0.12)",
          transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
          overflow:   "hidden",
        }}
      >
        {/* ── Logo Area ──────────────────────────────────────────────────── */}
        <div
          className="shrink-0 flex items-center h-16 px-4"
          style={{ borderBottom: "1px solid rgba(184,154,106,0.1)" }}
        >
          {/* Icon */}
          <div
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-sm"
            style={{ background: "#b89a6a" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Brand name — Sửa lỗi kẹt khoảng cách ml-3 */}
          <div
            className="overflow-hidden"
            style={{
              opacity:    collapsed ? 0 : 1,
              width:      collapsed ? 0 : "auto",
              marginLeft: collapsed ? 0 : 12,
              transition: "opacity 0.2s ease, width 0.28s ease, margin-left 0.28s ease",
              whiteSpace: "nowrap",
            }}
          >
            <span
              className="text-white text-[15px] font-semibold tracking-[1px]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ThienBinh
            </span>
            <span
              className="block text-[10px] tracking-[2px] uppercase"
              style={{ color: "#b89a6a", fontFamily: "'Montserrat', sans-serif" }}
            >
              Admin
            </span>
          </div>
        </div>

        {/* ── Navigation List ────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-none">
          {NAV_ITEMS.map(group => (
            <div key={group.group} className="mb-4">
              {/* Group label */}
              {!collapsed && (
                <p
                  className="px-4 mb-2 text-[9px] font-bold tracking-[2.5px] uppercase"
                  style={{ color: "rgba(184,154,106,0.5)", fontFamily: "'Montserrat', sans-serif" }}
                >
                  {group.group}
                </p>
              )}
              {collapsed && <div className="h-2" />}

              {group.items.map(item => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className="relative flex items-center mx-2 rounded-sm mb-[2px] group"
                    style={{
                      padding:    "10px 14px",
                      justifyContent: collapsed ? "center" : "flex-start", // Căn giữa icon hoàn hảo khi đóng
                      background: active ? "rgba(184,154,106,0.12)" : "transparent",
                      transition: "background 0.18s ease, justify-content 0.28s",
                    }}
                  >
                    {/* Active line indicator */}
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
                        style={{ height: 20, background: "#b89a6a" }}
                      />
                    )}

                    {/* Icon */}
                    <span
                      style={{
                        color:      active ? "#b89a6a" : "rgba(255,255,255,0.45)",
                        transition: "color 0.18s",
                        flexShrink: 0,
                      }}
                      className="group-hover:!text-[#b89a6a]"
                    >
                      {item.icon}
                    </span>

                    {/* Label + badge — Sửa lỗi ml-3 khi thu nhỏ */}
                    <span
                      className="flex-1 flex items-center justify-between overflow-hidden"
                      style={{
                        opacity:    collapsed ? 0 : 1,
                        maxWidth:   collapsed ? 0 : 160,
                        marginLeft: collapsed ? 0 : 12,
                        transition: "opacity 0.15s ease, max-width 0.28s ease, margin-left 0.28s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        className="text-[13px] font-medium"
                        style={{
                          color:       active ? "#fff" : "rgba(255,255,255,0.55)",
                          fontFamily:  "'Montserrat', sans-serif",
                          transition:  "color 0.18s",
                        }}
                      >
                        {item.label}
                      </span>
                      {"badge" in item && item.badge && (
                        <span
                          className="text-[10px] font-bold px-[6px] py-[1px] rounded-full"
                          style={{ background: "#b89a6a", color: "#fff", fontFamily: "'Montserrat', sans-serif" }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* ── Toggle Footer Button ───────────────────────────────────────── */}
        <div
          className="shrink-0 flex items-center h-12 px-4"
          style={{ borderTop: "1px solid rgba(184,154,106,0.1)" }}
        >
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-8 h-8 rounded-sm shrink-0"
            style={{
              background: "rgba(184,154,106,0.08)",
              color:      "rgba(255,255,255,0.4)",
              transition: "background 0.18s, color 0.18s",
            }}
            title={collapsed ? "Mở rộng" : "Thu gọn"}
          >
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.28s ease" }}
            >
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          
          {!collapsed && (
            <span
              className="ml-2 text-[11px] overflow-hidden whitespace-nowrap"
              style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Montserrat', sans-serif" }}
            >
              Thu gọn
            </span>
          )}
        </div>
      </aside>
    </>
  )
}