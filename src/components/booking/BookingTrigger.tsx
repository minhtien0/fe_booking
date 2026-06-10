"use client"

import { useState } from "react"
import { useBooking } from "../../context/BookingContext"

interface BookingTriggerProps {
  label?: string
  serviceId?: string | number
  variant?: "gold" | "outline" | "dark"
  className?: string
}

export default function BookingTrigger({
  label = "Đặt Lịch Hẹn",
  serviceId,
  variant = "outline",
  className = "",
}: BookingTriggerProps) {
  const { openBooking } = useBooking()
  const [hovered, setHovered] = useState(false)

  const base: React.CSSProperties = {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    height: "50px",
    paddingLeft: "32px",
    paddingRight: "32px",
    position: "relative",
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    outline: "none",
    transition: "color 0.3s ease",
  }

  // Styles per variant
  const styles: Record<string, React.CSSProperties> = {
    gold: {
      ...base,
      background: "#b89a6a",
      color: "#fff",
    },
    outline: {
      ...base,
      background: "transparent",
      border: "1px solid #e8d5a3",
      color: hovered ? "#1c1713" : "#ffffff",
    },
    dark: {
      ...base,
      background: "transparent",
      border: "1px solid #b89a6a",
      color: hovered ? "#fff" : "#b89a6a",
    },
  }

  return (
    <button
      style={styles[variant]}
      className={`uppercase tracking-[2px] ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => openBooking(serviceId)}
    >
      {/* Sliding fill */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          background: variant === "gold" ? "#7a6248" : "#b89a6a",
          transformOrigin: "left",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.45s cubic-bezier(0.76,0,0.24,1)",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
    </button>
  )
}