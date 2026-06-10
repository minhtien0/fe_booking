"use client"

/**
 * BookingToast.tsx
 * Stack toast notifications cho booking mới real-time.
 *
 * Features:
 *  - Slide-in từ phải, slide-out khi dismiss
 *  - Progress bar countdown (gold → depleted)
 *  - Stacked: tối đa 5 toasts, mới nhất ở trên
 *  - Click vào toast → dismiss ngay
 */

import { useEffect, useState, useRef } from "react"
import type { RtToast } from "../../types/admin/realtime"

// ─── Single toast item ────────────────────────────────────────────────────────

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: RtToast
  onDismiss: (id: string) => void
}) {
  const [progress, setProgress] = useState(100)
  const [visible,  setVisible]  = useState(false)   
  const [leaving,  setLeaving]  = useState(false)   
  const frameRef = useRef<number>(0)

  // Slide-in ngay sau mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Progress bar countdown
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const pct     = Math.max(0, 100 - (elapsed / toast.ttl) * 100)
      setProgress(pct)
      if (pct > 0) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [toast.ttl])

  const handleDismiss = () => {
    setLeaving(true)
    setTimeout(() => onDismiss(toast.toastId), 280)
  }

  const fmtPrice = (n: number) => n.toLocaleString("vi-VN") + "đ"

  return (
    <div
      onClick={handleDismiss}
      style={{
        width: 340,
        background: "#1c1714",
        border: "1px solid #b89a6a",
        boxShadow: "0 16px 48px rgba(0,0,0,0.55), 0 0 20px rgba(184,154,106,0.12)",
        cursor: "pointer",
        overflow: "hidden",
        // Slide animation
        transform: leaving
          ? "translateX(calc(100% + 32px))"
          : visible ? "translateX(0)" : "translateX(calc(100% + 32px))",
        opacity: leaving ? 0 : visible ? 1 : 0,
        transition: leaving
          ? "transform 0.28s cubic-bezier(0.4,0,1,1), opacity 0.28s ease"
          : "transform 0.42s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
      }}
    >
      {/* Top gold shimmer bar */}
      <div style={{
        height: 2,
        background: "linear-gradient(90deg, transparent, #b89a6a, #d4b896, #b89a6a, transparent)",
      }} />

      <div style={{ padding: "14px 14px 10px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>

          {/* Bell icon */}
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(184,154,106,0.1)",
            border: "1px solid rgba(184,154,106,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            animation: "bellRing 0.6s ease 0.1s",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header label */}
            <div style={{
              fontSize: 8, fontFamily: "'Montserrat',sans-serif",
              fontWeight: 700, letterSpacing: "2px",
              textTransform: "uppercase", color: "#b89a6a", marginBottom: 5,
            }}>
              ✦ Lịch hẹn mới xác nhận
            </div>

            {/* Customer name */}
            <div style={{
              fontSize: 14, fontFamily: "'Cormorant Garamond',serif",
              fontWeight: 400, color: "#f0e8d8",
              marginBottom: 3, lineHeight: 1.2,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {toast.customerName}
            </div>

            {/* Phone + code */}
            <div style={{
              fontSize: 10, fontFamily: "'Montserrat',sans-serif",
              color: "#7a6e62", marginBottom: 8,
            }}>
              {toast.customerPhone}
              <span style={{ margin: "0 6px", color: "#3d3328" }}>·</span>
              <span style={{ color: "#b89a6a", fontWeight: 600 }}>{toast.bookingCode}</span>
            </div>

            {/* Detail chips row */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {/* Time */}
              <span style={{
                fontSize: 10, fontFamily: "'Montserrat',sans-serif", fontWeight: 600,
                padding: "2px 7px",
                background: "rgba(184,154,106,0.08)",
                border: "1px solid rgba(184,154,106,0.22)",
                color: "#b89a6a",
              }}>
                🕒 {toast.slotStart}
                {toast.slotEnd ? ` – ${toast.slotEnd}` : ""}
              </span>

              {/* Service */}
              <span style={{
                fontSize: 10, fontFamily: "'Montserrat',sans-serif",
                padding: "2px 7px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid #2a2318",
                color: "#c4b49a",
                maxWidth: 120, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {toast.serviceName}
              </span>

              {/* Price */}
              <span style={{
                fontSize: 10, fontFamily: "'Montserrat',sans-serif", fontWeight: 700,
                padding: "2px 7px",
                background: "rgba(22,163,74,0.08)",
                border: "1px solid rgba(22,163,74,0.2)",
                color: "#4ade80",
              }}>
                {fmtPrice(toast.price)}
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={e => { e.stopPropagation(); handleDismiss() }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#3d3328", padding: 2, flexShrink: 0,
              transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#b89a6a"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#3d3328"}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "#2a2318" }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: `linear-gradient(90deg, #a08555, #b89a6a, #d4b896)`,
          transition: "width 0.1s linear",
        }} />
      </div>
    </div>
  )
}

// ─── Toast stack container ────────────────────────────────────────────────────

interface BookingToastStackProps {
  toasts: RtToast[]
  onDismiss: (id: string) => void
}

export function BookingToastStack({ toasts, onDismiss }: BookingToastStackProps) {
  if (!toasts.length) return null

  return (
    <>
      <style>{`
        @keyframes bellRing {
          0%,100% { transform: rotate(0deg); }
          20%      { transform: rotate(-15deg); }
          40%      { transform: rotate(12deg); }
          60%      { transform: rotate(-8deg); }
          80%      { transform: rotate(5deg); }
        }
      `}</style>

      {/* Stack container — fixed bottom-right */}
      <div style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",   // container passthrough
        alignItems: "flex-end",
      }}>
        {toasts.map(toast => (
          <div key={toast.toastId} style={{ pointerEvents: "auto" }}>
            <ToastItem toast={toast} onDismiss={onDismiss} />
          </div>
        ))}
      </div>
    </>
  )
}
