import type { BookingStatus } from "../../../types/admin/booking"
import { STATUS_CONFIG } from "../../../constants/admin/bookingConfig"

interface BookingFilterBarProps {
  search:          string
  filterStatus:    "all" | BookingStatus
  filterBarber:    string
  filterService:   string
  barberOptions:   string[]
  serviceOptions:  string[]
  onSearch:        (v: string) => void
  onStatusChange:  (v: "all" | BookingStatus) => void
  onBarberChange:  (v: string) => void
  onServiceChange: (v: string) => void
  onReset:         () => void
}

export function BookingFilterBar({
  search, filterStatus, filterBarber, filterService,
  barberOptions, serviceOptions,
  onSearch, onStatusChange, onBarberChange, onServiceChange, onReset,
}: BookingFilterBarProps) {
  const selectClass = "pl-3 pr-8 py-[6px] text-[12px] border border-[#ede8e0] outline-none bg-white cursor-pointer"
  const selectStyle = { fontFamily: "'Montserrat',sans-serif", color: "#3a3530", transition: "border-color 0.15s" }
  const chevron = (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
      <path d="M2 4l4 4 4-4" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )

  return (
    <div className="bg-white px-4 py-3 flex flex-wrap items-center gap-2" style={{ border: "1px solid #f0ebe3" }}>
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Tìm tên, SĐT, mã booking..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-[6px] text-[12px] border border-[#ede8e0] outline-none"
          style={{ fontFamily: "'Montserrat',sans-serif", color: "#1e1510", transition: "border-color 0.15s" }}
          onFocus={e => (e.target.style.borderColor = "#b89a6a")}
          onBlur={e  => (e.target.style.borderColor = "#ede8e0")}
        />
      </div>

      {/* Status */}
      <div className="relative">
        <select value={filterStatus} onChange={e => onStatusChange(e.target.value as "all" | BookingStatus)}
          className={selectClass} style={selectStyle}
          onFocus={e => (e.target.style.borderColor = "#b89a6a")}
          onBlur={e  => (e.target.style.borderColor = "#ede8e0")}>
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {chevron}
      </div>

      {/* Barber */}
      <div className="relative">
        <select value={filterBarber} onChange={e => onBarberChange(e.target.value)}
          className={selectClass} style={selectStyle}
          onFocus={e => (e.target.style.borderColor = "#b89a6a")}
          onBlur={e  => (e.target.style.borderColor = "#ede8e0")}>
          <option value="all">Tất cả barber</option>
          {barberOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {chevron}
      </div>

      {/* Service */}
      <div className="relative">
        <select value={filterService} onChange={e => onServiceChange(e.target.value)}
          className={selectClass} style={selectStyle}
          onFocus={e => (e.target.style.borderColor = "#b89a6a")}
          onBlur={e  => (e.target.style.borderColor = "#ede8e0")}>
          <option value="all">Tất cả dịch vụ</option>
          {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {chevron}
      </div>

      <button
        onClick={onReset}
        className="px-3 py-[6px] text-[12px] font-medium border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a]"
        style={{ fontFamily: "'Montserrat',sans-serif", transition: "border-color 0.15s" }}>
        Reset
      </button>
    </div>
  )
}