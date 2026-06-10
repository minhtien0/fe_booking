import type { BookingStatus } from "../../types/admin/booking"

export const TODAY = new Date().toLocaleDateString("sv-SE", {
  timeZone: "Asia/Ho_Chi_Minh",
})

export const PAGE_SIZE = 8

export const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bg: string; color: string }
> = {
  pending:      { label: "Chờ xác nhận",    bg: "rgba(251,191,36,0.12)",  color: "#d97706" },
  confirmed:    { label: "Đã xác nhận",      bg: "rgba(34,197,94,0.1)",    color: "#16a34a" },
  "in-progress":{ label: "Đang thực hiện",  bg: "rgba(99,102,241,0.1)",   color: "#4f46e5" },
  completed:    { label: "Hoàn tất",         bg: "rgba(107,114,128,0.1)",  color: "#4b5563" },
  cancelled:    { label: "Đã huỷ",           bg: "rgba(239,68,68,0.08)",   color: "#dc2626" },
  expired:      { label: "Hết hạn",          bg: "rgba(148,163,184,0.10)", color: "#64748b" },
}

export const NEXT_STATUSES: { s: BookingStatus; label: string }[] = [
  { s: "pending",     label: "Chờ xác nhận" },
  { s: "confirmed",   label: "Xác nhận"     },
  { s: "in-progress", label: "Thực hiện"    },
  { s: "completed",   label: "Hoàn tất"     },
  { s: "cancelled",   label: "Huỷ"          },
]

export const MONTH_NAMES = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4",
  "Tháng 5","Tháng 6","Tháng 7","Tháng 8",
  "Tháng 9","Tháng 10","Tháng 11","Tháng 12",
]

export const DAY_NAMES = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

export const WEEKDAY_NAMES = [
  "Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư",
  "Thứ Năm","Thứ Sáu","Thứ Bảy",
]