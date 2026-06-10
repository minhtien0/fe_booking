// src/app/lookup/components/StatusBadge.tsx
// Badge trạng thái lịch hẹn – tách riêng để dùng lại ở nhiều nơi

import { BookingStatus } from '../../types/booking'

const STATUS_CONFIG: Record<
  BookingStatus,
  { text: string; styles: string }
> = {
  pending:      { text: 'Chờ xác thực',    styles: 'bg-amber-50 text-amber-700 border-amber-200' },
  otp_verified: { text: 'Đã xác thực',     styles: 'bg-blue-50 text-blue-700 border-blue-200' },
  confirmed:    { text: 'Đã xác nhận slot',styles: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  inprogress:   { text: 'Đang phục vụ',    styles: 'bg-purple-50 text-purple-700 border-purple-200' },
  done:         { text: 'Hoàn thành',      styles: 'bg-gray-100 text-gray-700 border-gray-200' },
  cancelled:    { text: 'Đã hủy lịch',     styles: 'bg-rose-50 text-rose-700 border-rose-200' },
  expired:      { text: 'Hết hạn giữ chỗ', styles: 'bg-orange-50 text-orange-700 border-orange-200' },
}

interface StatusBadgeProps {
  status: BookingStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { text: status, styles: 'bg-gray-50 text-gray-600 border-gray-200' }
  return (
    <span
      className={`text-[11px] font-semibold uppercase tracking-[1px] px-2.5 py-1 rounded border ${config.styles}`}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {config.text}
    </span>
  )
}