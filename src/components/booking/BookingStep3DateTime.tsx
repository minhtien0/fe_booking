"use client"

import { useState, useEffect } from "react"
import { apiFetch } from "../../lib/api"

// ── API response type ──────────────────────────────────────────────
interface AvailabilityResponse {
  success: boolean
  date: string
  barberId: number | string
  availableSlots: string[]
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDay(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

interface Props {
  selectedDate: string
  selectedTime: string
  barberId: string | number | null   
  onDateChange: (d: string) => void
  onTimeChange: (t: string) => void
}

export default function BookingStep3DateTime({
  selectedDate, selectedTime, barberId,
  onDateChange, onTimeChange,
}: Props) {
  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  // ── Slots state ────────────────────────────────────────────────────
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [slotsLoading,   setSlotsLoading]   = useState(false)
  const [slotsError,     setSlotsError]     = useState(false)

  // ── Fetch khi date hoặc barberId thay đổi ─────────────────────────
  useEffect(() => {
    if (!selectedDate) { setAvailableSlots([]); return }

    const params = new URLSearchParams({ date: selectedDate })
    // "any" hoặc null → không truyền barberId, server tự pick barber
    if (barberId && barberId !== "any") {
      params.set("barberId", String(barberId))
    }

    setSlotsLoading(true)
    setSlotsError(false)
    onTimeChange("") // reset giờ đã chọn khi đổi ngày / barber

    apiFetch<AvailabilityResponse>(`/bookings/availability?${params.toString()}`)
      .then(res => {
        setAvailableSlots(res.availableSlots ?? [])
      })
      .catch(() => {
        setSlotsError(true)
        setAvailableSlots([])
      })
      .finally(() => setSlotsLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, barberId])

  const MONTH_NAMES = [
    "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
    "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",
  ]
  const DAY_NAMES = ["CN","T2","T3","T4","T5","T6","T7"]

  const days     = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDay(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0, 0, 0, 0)
    const t = new Date(); t.setHours(0, 0, 0, 0)
    return d < t
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`

  return (
    <div>
      <h3 className="text-[18px] font-light text-[#1e1510] mb-1"
        style={{ fontFamily: "'Playfair Display',serif" }}>
        Chọn ngày & giờ
      </h3>
      <p className="text-[12px] text-[#9e8060] mb-6 italic"
        style={{ fontFamily: "'Montserrat',sans-serif" }}>
        Đặt lịch trước → ưu tiên phục vụ, không phải chờ đợi ✦
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* ── Calendar ────────────────────────────────────────────────── */}
        <div className="flex-1">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center text-[#9e8060] hover:text-[#b89a6a] border border-[#ede8e0] hover:border-[#b89a6a]"
              style={{ transition: "all 0.2s" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <span className="text-[13px] font-semibold text-[#1e1510]"
              style={{ fontFamily: "'Montserrat',sans-serif" }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center text-[#9e8060] hover:text-[#b89a6a] border border-[#ede8e0] hover:border-[#b89a6a]"
              style={{ transition: "all 0.2s" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-[#bbb] tracking-[1px]"
                style={{ fontFamily: "'Montserrat',sans-serif" }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-[3px]">
            {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
            {Array(days).fill(null).map((_, i) => {
              const day     = i + 1
              const dateStr = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`
              const past    = isPast(day)
              const active  = selectedDate === dateStr
              const isToday = dateStr === todayStr

              return (
                <button key={day} disabled={past}
                  onClick={() => onDateChange(dateStr)}
                  className="aspect-square flex items-center justify-center text-[12px] font-medium rounded-sm transition-all duration-150"
                  style={{
                    fontFamily:  "'Montserrat',sans-serif",
                    background:  active ? "#b89a6a" : "transparent",
                    color:       past ? "#d6cec4" : active ? "#fff" : isToday ? "#b89a6a" : "#3a3530",
                    border:      isToday && !active ? "1.5px solid #b89a6a" : "1.5px solid transparent",
                    cursor:      past ? "not-allowed" : "pointer",
                    fontWeight:  active ? 700 : 400,
                  }}>
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Time slots ──────────────────────────────────────────────── */}
        <div className="w-full sm:w-[180px] shrink-0">
          <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#9e8060] mb-3"
            style={{ fontFamily: "'Montserrat',sans-serif" }}>
            {selectedDate ? "Giờ trống" : "Chọn ngày trước"}
          </p>

          {/* Chưa chọn ngày */}
          {!selectedDate && (
            <p className="text-[12px] text-[#ccc] italic"
              style={{ fontFamily: "'Montserrat',sans-serif" }}>
              Vui lòng chọn ngày để xem giờ trống
            </p>
          )}

          {/* Loading */}
          {selectedDate && slotsLoading && (
            <div className="flex flex-col gap-2">
              {Array(6).fill(null).map((_, i) => (
                <div key={i} className="h-8 bg-[#f0ebe3] rounded animate-pulse" />
              ))}
            </div>
          )}

          {/* Error */}
          {selectedDate && !slotsLoading && slotsError && (
            <p className="text-[12px] text-red-400 italic"
              style={{ fontFamily: "'Montserrat',sans-serif" }}>
              Không thể tải giờ trống. Thử lại.
            </p>
          )}

          {/* Empty */}
          {selectedDate && !slotsLoading && !slotsError && availableSlots.length === 0 && (
            <p className="text-[12px] text-[#ccc] italic"
              style={{ fontFamily: "'Montserrat',sans-serif" }}>
              Không còn giờ trống trong ngày này
            </p>
          )}

          {/* Slots list */}
          {selectedDate && !slotsLoading && !slotsError && availableSlots.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-1">
              {availableSlots.map(t => {
                const active = selectedTime === t
                return (
                  <button key={t}
                    onClick={() => onTimeChange(t)}
                    className="px-3 py-[7px] text-[12px] font-medium border transition-all duration-150"
                    style={{
                      fontFamily:  "'Montserrat',sans-serif",
                      background:  active ? "#b89a6a" : "#fff",
                      borderColor: active ? "#b89a6a" : "#ede8e0",
                      color:       active ? "#fff" : "#3a3530",
                    }}>
                    {t}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}