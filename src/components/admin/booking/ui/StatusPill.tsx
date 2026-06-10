import type { BookingStatus } from "../../../../types/admin/booking"
import { STATUS_CONFIG } from "../../../../constants/admin/bookingConfig"

interface StatusPillProps {
  status: BookingStatus
}

export function StatusPill({ status }: StatusPillProps) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.color, fontFamily: "'Montserrat',sans-serif" }}
    >
      <span className="w-[5px] h-[5px] rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  )
}