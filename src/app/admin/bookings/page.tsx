"use client"

import { useMemo, useState } from "react"
import type { RtNotification } from "./../../../types/admin/booking"
import { TODAY, WEEKDAY_NAMES } from "../../../constants/admin/bookingConfig"
import { useBookingDashboard } from "../../../hooks/admin/booking/useBookingDashboard"
import { useBookingFilter }   from "../../../hooks/admin/booking/useBookingFilter"
import { useBookingActions }  from "../../../hooks/admin/booking/useBookingActions"
import { LeftPanel }           from "./../../../components/admin/booking/panels/LeftPanel"
import { DetailPanel }         from "./../../../components/admin/booking/panels/DetailPanel"
import { BookingFilterBar }    from "../../../sections/admin/booking/BookingFilterBar"
import { BookingTable }        from "../../../sections/admin/booking/BookingTable"
import { RtNotificationToast } from "../../../sections/admin/booking/RtNotificationToast"

// ─── Page-level global styles (fonts + scrollbar + row hover) ────────────────
const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&family=Montserrat:wght@400;500;600;700&display=swap');
  .scrollbar-thin::-webkit-scrollbar { width:4px; height:4px; }
  .scrollbar-thin::-webkit-scrollbar-track { background:transparent; }
  .scrollbar-thin::-webkit-scrollbar-thumb { background:#e5ddd0; border-radius:4px; }
  .row-hover:hover { background:#fffaf4 !important; }
  select { appearance:none; -webkit-appearance:none; }
`

export default function AdminBookingsPage() {
  const [rtNotification, setRtNotification] = useState<RtNotification | null>(null)

  // ── Data + realtime ────────────────────────────────────────────────────────
  const {
    bookings, barbersDuty, dashboardStats,
    detail, detailLoading, setDetail,
    loadDashboard, loadBookingDetail,
  } = useBookingDashboard()

  // ── Filters + pagination ───────────────────────────────────────────────────
  const filter = useBookingFilter(bookings, dashboardStats)

  // ── Actions ────────────────────────────────────────────────────────────────
  const actions = useBookingActions({
    paginated: filter.paginated,
    filtered:  filter.filtered,
    detail,
    loadDashboard,
    loadBookingDetail,
  })

  // ── Tab config ─────────────────────────────────────────────────────────────
  const TABS = [
    { key: "all",       label: "Tất cả",       count: filter.counts.all       },
    { key: "today",     label: "Hôm nay",       count: filter.counts.today     },
    { key: "pending",   label: "Chờ xác nhận",  count: filter.counts.pending   },
    { key: "confirmed", label: "Đã xác nhận",   count: filter.counts.confirmed },
    { key: "completed", label: "Hoàn tất",       count: filter.counts.completed },
    { key: "cancelled", label: "Đã huỷ",         count: filter.counts.cancelled },
  ] as const

  // ── Header label ───────────────────────────────────────────────────────────
  const todayLabel = useMemo(() => {
    const d = new Date(TODAY)
    return `${WEEKDAY_NAMES[d.getDay()]}, ${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`
  }, [])

  return (
    <>
      <style>{PAGE_STYLES}</style>

      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[24px] font-light text-[#1e1510]" style={{ fontFamily: "'Playfair Display',serif" }}>
            Quản lý lịch hẹn
          </h1>
          <p className="text-[11px] text-[#bbb] mt-[2px]" style={{ fontFamily: "'Montserrat',sans-serif" }}>
            {todayLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={actions.exportCSV}
            className="h-9 px-4 text-[11px] font-semibold border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a] hover:text-[#b89a6a]"
            style={{ fontFamily: "'Montserrat',sans-serif", transition: "all 0.18s" }}>
            Xuất CSV
          </button>
          <button
            className="h-9 px-5 text-[11px] font-bold tracking-[1px] uppercase text-white"
            style={{ background: "#b89a6a", fontFamily: "'Montserrat',sans-serif" }}
            onMouseOver={e => (e.currentTarget.style.background = "#a08455")}
            onMouseOut={e  => (e.currentTarget.style.background = "#b89a6a")}>
            + Thêm lịch hẹn
          </button>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="flex gap-5 items-start" style={{ minHeight: "calc(100vh - 160px)", minWidth: 900 }}>

        {/* LEFT — calendar + stats + barbers */}
        <div className="w-[252px] shrink-0 self-stretch">
          <LeftPanel
            selectedDate={filter.selectedDate}
            onDateSelect={filter.setSelectedDate}
            bookingDates={filter.bookingDates}
            bookings={bookings}
            barbersDuty={barbersDuty}
          />
        </div>

        {/* CENTER — filter bar + table */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <BookingFilterBar
            search={filter.search}
            filterStatus={filter.filterStatus}
            filterBarber={filter.filterBarber}
            filterService={filter.filterService}
            barberOptions={filter.barberOptions}
            serviceOptions={filter.serviceOptions}
            onSearch={filter.setSearch}
            onStatusChange={filter.setFilterStatus}
            onBarberChange={filter.setFilterBarber}
            onServiceChange={filter.setFilterService}
            onReset={filter.handleReset}
          />
          <BookingTable
            paginated={filter.paginated}
            filtered={filter.filtered}
            selected={actions.selected}
            detail={detail}
            activeTab={filter.activeTab}
            tabs={TABS}
            page={filter.page}
            totalPages={filter.totalPages}
            onTabChange={filter.setActiveTab}
            onRowClick={b => {
              if (detail?.id === b.id) { setDetail(null); return }
              setDetail(b)
              void loadBookingDetail(b.id)
            }}
            onToggleSelect={actions.toggleSelect}
            onToggleAll={actions.toggleAll}
            onPageChange={filter.setPage}
            onStatusChange={actions.handleStatusChange}
          />
        </div>

        {/* RIGHT — detail panel */}
        <div className="w-[252px] shrink-0 bg-white self-stretch" style={{ border: "1px solid #f0ebe3", minHeight: 500 }}>
          <DetailPanel
            booking={detail}
            loading={detailLoading}
            onClose={() => setDetail(null)}
            onSaved={actions.handleSavedDetail}
          />
        </div>
      </div>

      {rtNotification && (
        <RtNotificationToast
          notification={rtNotification}
          onDismiss={() => setRtNotification(null)}
        />
      )}
    </>
  )
}
