"use client"

import { useState } from "react"
import { TODAY, MONTH_NAMES, DAY_NAMES } from "../../../../constants/admin/bookingConfig"
import { getDaysInMonth, getFirstDay, toDateStr } from "../../../../utils/admin/bookingMappers"

interface MiniCalendarProps {
  selectedDate:  string
  onSelect:      (d: string) => void
  bookingDates:  Set<string>
}

export function MiniCalendar({ selectedDate, onSelect, bookingDates }: MiniCalendarProps) {
  const [vy, setVy] = useState(() => parseInt(TODAY.split("-")[0]))
  const [vm, setVm] = useState(() => parseInt(TODAY.split("-")[1]) - 1)

  const days     = getDaysInMonth(vy, vm)
  const firstDay = getFirstDay(vy, vm)

  const prev = () => vm === 0  ? (setVy(y => y - 1), setVm(11)) : setVm(m => m - 1)
  const next = () => vm === 11 ? (setVy(y => y + 1), setVm(0))  : setVm(m => m + 1)

  return (
    <div>
      {/* Nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prev}
          className="w-7 h-7 flex items-center justify-center text-[#9e8060] hover:text-[#b89a6a]"
          style={{ transition: "color 0.15s" }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <span
          className="text-[12px] font-semibold text-[#1e1510]"
          style={{ fontFamily: "'Montserrat',sans-serif" }}
        >
          {MONTH_NAMES[vm]} {vy}
        </span>
        <button
          onClick={next}
          className="w-7 h-7 flex items-center justify-center text-[#9e8060] hover:text-[#b89a6a]"
          style={{ transition: "color 0.15s" }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map(d => (
          <div
            key={d}
            className="text-center text-[9px] font-bold text-[#ccc] tracking-[0.5px]"
            style={{ fontFamily: "'Montserrat',sans-serif" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-[1px]">
        {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
        {Array(days).fill(null).map((_, i) => {
          const day      = i + 1
          const dStr     = toDateStr(vy, vm, day)
          const active   = selectedDate === dStr
          const isToday  = dStr === TODAY
          const hasBooks = bookingDates.has(dStr)

          return (
            <button
              key={day}
              onClick={() => onSelect(active ? "" : dStr)}
              className="relative aspect-square flex items-center justify-center text-[11px] font-medium"
              style={{
                fontFamily:  "'Montserrat',sans-serif",
                borderRadius: 3,
                background:   active ? "#b89a6a" : "transparent",
                color:        active ? "#fff" : isToday ? "#b89a6a" : "#3a3530",
                border:       isToday && !active ? "1.5px solid #b89a6a" : "1.5px solid transparent",
                fontWeight:   active ? 700 : 400,
                transition:   "background 0.15s",
              }}
            >
              {day}
              {hasBooks && !active && (
                <span
                  className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full"
                  style={{ background: "#b89a6a" }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}