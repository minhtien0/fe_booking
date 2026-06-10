import type { RtNotification } from "../../../types/admin/booking"

interface RtNotificationToastProps {
  notification: RtNotification
  onDismiss:    () => void
}

export function RtNotificationToast({ notification, onDismiss }: RtNotificationToastProps) {
  return (
    <div style={{
      position:        "fixed",
      bottom:          24,
      right:           24,
      zIndex:          99999,
      width:           350,
      backgroundColor: "#2c2520",
      border:          "1px solid #b89a6a",
      padding:         "16px",
      boxShadow:       "0 20px 40px rgba(0,0,0,0.35), 0 0 15px rgba(184,154,106,0.2)",
      borderRadius:    "4px",
      fontFamily:      "'Montserrat', sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {/* Bell icon */}
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          backgroundColor: "rgba(184,154,106,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#b89a6a", flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#b89a6a", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>
            Có Lịch Hẹn Mới Xác Nhận!
          </div>
          <div style={{ fontSize: 13, color: "#ffffff", fontWeight: 500, marginBottom: 2 }}>
            {notification.customerName}
          </div>
          <div style={{ fontSize: 11, color: "#ede8e0", opacity: 0.7, marginBottom: 8 }}>
            SĐT: {notification.customerPhone}
          </div>
          <div style={{
            display: "inline-block", backgroundColor: "rgba(184,154,106,0.1)",
            border: "1px solid rgba(184,154,106,0.3)",
            padding: "3px 8px", fontSize: 10, color: "#b89a6a", fontWeight: 600,
          }}>
            🕒 {notification.slotStart} — {notification.bookingDate}
          </div>
        </div>

        {/* Close */}
        <button onClick={onDismiss}
          style={{ background: "none", border: "none", color: "#9c8a7c", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#b89a6a")}
          onMouseLeave={e => (e.currentTarget.style.color = "#9c8a7c")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}