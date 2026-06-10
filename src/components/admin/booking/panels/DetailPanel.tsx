"use client"

import { useState, useEffect } from "react"
import { apiFetch } from "../../../../lib/api"
import type { Booking, BookingStatus, ApiAvailabilityResponse } from "../../../../types/admin/booking"
import { STATUS_CONFIG, NEXT_STATUSES } from "../../../../constants/admin/bookingConfig"
import { fmt, toApiBookingStatus, formatDisplayDate } from "../../../../utils/admin/bookingMappers"
import { Avatar }     from "../ui/Avatar"
import { StatusPill } from "../ui/StatusPill"

interface DetailPanelProps {
  booking:  Booking | null
  loading:  boolean
  onClose:  () => void
  onSaved:  (id: string) => Promise<void> | void
}

export function DetailPanel({ booking, loading, onClose, onSaved }: DetailPanelProps) {
  const [note,               setNote]               = useState("")
  const [draftStatus,        setDraftStatus]        = useState<BookingStatus>("pending")
  const [selectedTime,       setSelectedTime]       = useState("")
  const [availableSlots,     setAvailableSlots]     = useState<string[]>([])
  const [availabilityLoading,setAvailabilityLoading]= useState(false)
  const [saving,             setSaving]             = useState(false)

  const locked = booking?.status === "cancelled"

  // Sync local state when selected booking changes
  useEffect(() => {
    setNote(booking?.note ?? "")
    setDraftStatus(booking?.status ?? "pending")
    setSelectedTime("")
  }, [booking?.id, booking?.note, booking?.status])

  // Fetch available slots for rescheduling
  useEffect(() => {
    const load = async () => {
      if (!booking || locked || !booking.barberId || !booking.date) {
        setAvailableSlots([]); return
      }
      setAvailabilityLoading(true)
      try {
        const res = await apiFetch<ApiAvailabilityResponse>(
          `/bookings/availability?barberId=${booking.barberId}&date=${booking.date}`,
        )
        setAvailableSlots(res.availableSlots ?? [])
      } catch {
        setAvailableSlots([])
      } finally {
        setAvailabilityLoading(false)
      }
    }
    void load()
  }, [booking?.id, booking?.barberId, booking?.date, locked])

  if (!booking) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6" style={{ fontFamily: "'Montserrat',sans-serif" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "#f8f5f0" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d6cec4" strokeWidth="1.5" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </div>
        <p className="text-[12px] text-[#bbb]">Chọn lịch hẹn để xem chi tiết</p>
      </div>
    )
  }

  const hasChanges =
    draftStatus !== booking.status ||
    note !== (booking.note ?? "") ||
    (selectedTime !== "" && selectedTime !== booking.time)

  const saveChanges = async () => {
    if (locked || saving) return
    const tasks: Promise<unknown>[] = []

    if (note !== (booking.note ?? "")) {
      tasks.push(apiFetch(`/admin/bookings/${booking.id}/note`, {
        method: "PATCH", body: JSON.stringify({ note }),
      }))
    }
    if (selectedTime !== "" && selectedTime !== booking.time) {
      tasks.push(apiFetch(`/admin/bookings/${booking.id}/reschedule`, {
        method: "PATCH",
        body: JSON.stringify({ bookingDate: booking.date, newStartTime: selectedTime, reason: "Admin đổi giờ" }),
      }))
    }
    if (draftStatus !== booking.status) {
      const apiStatus = toApiBookingStatus(draftStatus)
      const endpoint  = draftStatus === "confirmed" || draftStatus === "cancelled"
        ? apiFetch(`/admin/bookings/bulk-status`, { method: "PATCH", body: JSON.stringify({ ids: [Number(booking.id)], status: apiStatus }) })
        : apiFetch(`/admin/bookings/${booking.id}/status`, { method: "PATCH", body: JSON.stringify({ status: apiStatus }) })
      tasks.push(endpoint)
    }
    if (!tasks.length) return

    setSaving(true)
    try {
      await Promise.all(tasks)
      await onSaved(booking.id)
    } catch (err) {
      console.error("Failed to save booking changes", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white" style={{ fontFamily: "'Montserrat',sans-serif" }}>
      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-[#f0ebe3] flex items-center justify-between select-none">
        <p className="text-[10px] font-bold tracking-[1.8px] uppercase text-[#b89a6a]">Chi tiết lịch hẹn</p>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-[#bbb] hover:text-[#9e8060]" style={{ transition: "color 0.15s" }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

        {/* Customer info */}
        <div className="px-5 py-5 border-b border-[#f8f5f0] flex flex-col items-center text-center">
          <Avatar initials={booking.initials} size={52} color="#b89a6a" />
          <p className="mt-3 text-[14px] font-semibold text-[#1e1510]">{booking.customer}</p>
          <p className="text-[11px] text-[#9e8060] mt-[2px]">{booking.phone}</p>
          {booking.email && <p className="text-[10px] text-stone-400 mb-2">{booking.email}</p>}
          <StatusPill status={booking.status} />
          {locked && (
            <p className="mt-3 text-[11px] text-red-500 font-medium">Lịch này đã huỷ, mọi chỉnh sửa đã bị khóa.</p>
          )}
        </div>

        {/* Booking info rows */}
        <div className="px-5 py-4 border-b border-[#f8f5f0]">
          <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#bbb] mb-3">Thông tin lịch hẹn</p>
          {([
            ["Mã booking",   booking.code || `ID-#${booking.id}`,                   true ],
            ["Dịch vụ",      booking.service,                                         false],
            ["Barber",       booking.barber,                                          false],
            ["Ngày",         formatDisplayDate(booking.date),                         false],
            ["Khung giờ",    `${booking.time} - ${booking.endTime ?? ""}`,            false],
            ["Giá dịch vụ",  fmt(booking.price),                                      true ],
            ["Hình thức",    booking.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản", false],
            ["Lần ghé thăm", `${booking.visits} lần`,                                false],
          ] as [string, string, boolean][]).map(([label, val, gold]) => (
            <div key={label} className="flex items-baseline justify-between py-[6px] border-b border-[#f8f5f0] last:border-0">
              <span className="text-[11px] text-[#9e8060]">{label}</span>
              <span className="text-[12px] font-semibold truncate max-w-[160px] text-right" style={{ color: gold ? "#b89a6a" : "#1e1510" }}>
                {val}
              </span>
            </div>
          ))}
        </div>

        {/* Tags */}
        {booking.tags && booking.tags.length > 0 && (
          <div className="px-5 py-4 border-b border-[#f8f5f0]">
            <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#bbb] mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {booking.tags.map(t => (
                <span key={t} className="px-3 py-[3px] text-[10px] font-semibold rounded-full"
                  style={{ background: "rgba(184,154,106,0.12)", color: "#b89a6a" }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        <div className="px-5 py-4 border-b border-[#f8f5f0]">
          <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#bbb] mb-2">Ghi chú vận hành</p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            disabled={locked}
            placeholder="Thêm ghi chú nội bộ..."
            className="w-full px-3 py-2 text-[12px] border border-[#ede8e0] outline-none resize-none transition-all rounded-sm disabled:bg-[#faf8f5] disabled:text-[#b7aea4]"
            style={{ color: "#1e1510", fontFamily: "'Montserrat',sans-serif" }}
            onFocus={e => (e.target.style.borderColor = "#b89a6a")}
            onBlur={e  => (e.target.style.borderColor = "#ede8e0")}
          />
        </div>

        {/* Reschedule quick slots */}
        <div className="px-5 py-4 border-b border-[#f8f5f0]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#bbb]">Đổi giờ nhanh</p>
            <span className="text-[10px] text-[#9e8060]">{formatDisplayDate(booking.date)}</span>
          </div>
          <p className="text-[11px] text-[#7a7065] mb-3">
            Giờ hiện tại: <span className="font-semibold text-[#1e1510]">{booking.time}</span>
          </p>
          {availabilityLoading ? (
            <p className="text-[11px] text-stone-400 italic">Đang tải khung giờ rảnh...</p>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-[6px]">
              {availableSlots.map(t => {
                const active = selectedTime === t
                return (
                  <button key={t} disabled={locked}
                    onClick={() => !locked && setSelectedTime(t)}
                    className="py-[6px] text-[11px] font-medium border transition-all rounded-sm disabled:opacity-45 disabled:cursor-not-allowed"
                    style={{
                      fontFamily:  "'Montserrat',sans-serif",
                      background:  active ? "#b89a6a" : "#fff",
                      borderColor: active ? "#b89a6a" : "#ede8e0",
                      color:       active ? "#fff"    : "#3a3530",
                    }}>
                    {t}
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-[11px] text-stone-400 italic">
              {locked ? "Lịch đã huỷ nên không còn khung giờ chỉnh sửa." : "Không có khung giờ rảnh phù hợp."}
            </p>
          )}
        </div>

        {/* Activity logs */}
        <div className="px-5 py-4">
          <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#bbb] mb-3.5">Lịch sử hoạt động</p>
          {loading ? (
            <p className="text-[11px] text-stone-400 italic">Đang tải lịch sử hoạt động...</p>
          ) : booking.logs && booking.logs.length > 0 ? (
            <div className="relative pl-3.5 border-l border-[#ede8e0] space-y-4 ml-1.5 my-1">
              {booking.logs.map(log => (
                <div key={log.id} className="relative text-left">
                  <span
                    className="absolute -left-[19.5px] top-1 w-2 h-2 rounded-full ring-4 ring-white transition-all duration-200"
                    style={{ backgroundColor: log.color || "#b89a6a" }}
                  />
                  <div className="flex flex-col">
                    <p className="text-[11px] text-[#1e1510] leading-relaxed font-medium">{log.actionText}</p>
                    <p className="text-[9px] text-stone-400 mt-0.5 font-mono">
                      {new Date(log.createdAt).toLocaleString("vi-VN", {
                        hour: "2-digit", minute: "2-digit", second: "2-digit",
                        day: "2-digit", month: "2-digit", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-stone-400 italic">Chưa ghi nhận tiến trình hoạt động nào.</p>
          )}
        </div>
      </div>

      {/* Footer: status buttons + save */}
      <div className="shrink-0 px-5 pb-5 pt-3 border-t border-[#f0ebe3] bg-[#fdfcfb]">
        <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#bbb] mb-2">Cập nhật trạng thái</p>
        <div className="grid grid-cols-2 gap-2">
          {NEXT_STATUSES.map(ns => {
            const c      = STATUS_CONFIG[ns.s]
            const active = draftStatus === ns.s
            return (
              <button key={ns.s} type="button" disabled={locked}
                onClick={() => !locked && setDraftStatus(ns.s)}
                className="py-[7px] text-[11px] font-semibold border transition-all rounded-sm disabled:opacity-45 disabled:cursor-not-allowed"
                style={{
                  fontFamily:  "'Montserrat',sans-serif",
                  background:  active ? c.color : c.bg,
                  color:       active ? "#fff"  : c.color,
                  borderColor: `${c.color}30`,
                }}>
                {ns.label}
              </button>
            )
          })}
        </div>

        <button type="button" disabled={locked || saving || !hasChanges}
          onClick={() => void saveChanges()}
          className="mt-3 w-full py-[9px] text-[11px] font-bold uppercase tracking-[1px] border rounded-sm transition-all disabled:opacity-45 disabled:cursor-not-allowed"
          style={{
            fontFamily:  "'Montserrat',sans-serif",
            background:  locked ? "#f3f4f6" : "#b89a6a",
            color:       locked ? "#9ca3af" : "#fff",
            borderColor: locked ? "#e5e7eb" : "#b89a6a",
          }}>
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  )
}