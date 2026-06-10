import { useMemo } from "react"
import type { Booking, BarberDuty } from "../../../../types/admin/booking"
import { TODAY,WEEKDAY_NAMES } from "../../../../constants/admin/bookingConfig"
import { fmtM,  } from "../../../../utils/admin/bookingMappers"
import { MiniCalendar } from "../ui/MiniCalendar"
import { Avatar }       from "../ui/Avatar"

// Re-export WEEKDAY_NAMES from utils if needed
function getTodayLabel(): string {
  const d    = new Date(TODAY)
  const days = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"]
  return `${days[d.getDay()]}, ${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`
}

interface LeftPanelProps {
  selectedDate:  string
  onDateSelect:  (d: string) => void
  bookingDates:  Set<string>
  bookings:      Booking[]
  barbersDuty:   BarberDuty[]
}

export function LeftPanel({
  selectedDate, onDateSelect, bookingDates, bookings, barbersDuty,
}: LeftPanelProps) {
  const todayCount   = bookings.filter(b => b.date === TODAY).length
  const pendingCount = bookings.filter(b => b.status === "pending").length
  const revenue      = bookings
    .filter(b => b.status === "completed")
    .reduce((s, b) => s + b.price, 0)
  const doneRate     = bookings.length
    ? Math.round((bookings.filter(b => b.status === "completed").length / bookings.length) * 100)
    : 0

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto" style={{ fontFamily: "'Montserrat',sans-serif" }}>

      {/* Calendar */}
      <div className="bg-white p-4" style={{ border: "1px solid #f0ebe3" }}>
        <MiniCalendar
          selectedDate={selectedDate}
          onSelect={onDateSelect}
          bookingDates={bookingDates}
        />
      </div>

      {/* Stat cards 2×2 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4" style={{ border: "1px solid #f0ebe3" }}>
          <p className="text-[26px] font-light text-[#1e1510]" style={{ fontFamily: "'Playfair Display',serif" }}>{todayCount}</p>
          <p className="text-[11px] font-semibold text-[#3a3530] leading-tight">Hôm nay</p>
          <p className="text-[10px] text-[#22c55e] mt-1 font-medium">+3 vs hôm qua</p>
        </div>

        <div className="bg-white p-4" style={{ border: "1px solid #f0ebe3" }}>
          <p className="text-[26px] font-light text-[#1e1510]" style={{ fontFamily: "'Playfair Display',serif" }}>{pendingCount}</p>
          <p className="text-[11px] font-semibold text-[#3a3530] leading-tight">Chờ xác nhận</p>
          {pendingCount > 0 && (
            <p className="text-[10px] text-[#d97706] mt-1 font-medium">Cần xử lý</p>
          )}
        </div>

        <div className="bg-white p-4" style={{ border: "1px solid #f0ebe3" }}>
          <p className="text-[22px] font-light text-[#1e1510]" style={{ fontFamily: "'Playfair Display',serif" }}>{fmtM(revenue)}</p>
          <p className="text-[11px] font-semibold text-[#3a3530] leading-tight">Doanh thu tháng</p>
          <p className="text-[10px] text-[#22c55e] mt-1 font-medium">+12%</p>
        </div>

        <div className="bg-white p-4" style={{ border: "1px solid #f0ebe3" }}>
          <p className="text-[26px] font-light text-[#1e1510]" style={{ fontFamily: "'Playfair Display',serif" }}>{doneRate}%</p>
          <p className="text-[11px] font-semibold text-[#3a3530] leading-tight">Tỷ lệ hoàn thành</p>
          <div className="mt-2 h-[3px] bg-[#f0ebe3] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${doneRate}%`, background: "#b89a6a", transition: "width 0.6s ease" }}
            />
          </div>
        </div>
      </div>

      {/* Barber on duty */}
      <div className="bg-white" style={{ border: "1px solid #f0ebe3" }}>
        <div className="px-4 py-3 border-b border-[#f8f5f0]">
          <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#b89a6a]">Barber đang trực</p>
        </div>
        <div className="divide-y divide-[#f8f5f0]">
          {barbersDuty.map(b => (
            <div key={b.id} className="flex items-center gap-3 px-4 py-3">
              <div className="relative">
                <Avatar initials={b.initials} size={36} color={b.color} />
                <span
                  className="absolute bottom-0 right-0 w-[9px] h-[9px] rounded-full border-2 border-white"
                  style={{ background: b.online ? "#22c55e" : "#d1d5db" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#1e1510] truncate">{b.name}</p>
                <p className="text-[10px] text-[#9e8060]">{b.bookings} lịch hôm nay</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}