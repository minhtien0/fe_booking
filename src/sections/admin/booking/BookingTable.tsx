import type { Booking, BookingStatus } from "../../../types/admin/booking"
import { PAGE_SIZE } from "../../../constants/admin/bookingConfig"
import { fmt, formatDisplayDate } from "../../../utils/admin/bookingMappers"
import { Avatar }     from "../../../components/admin/booking/ui/Avatar"
import { StatusPill } from "../../../components/admin/booking/ui/StatusPill"

interface TabConfig {
  key:   string
  label: string
  count: number
}

interface BookingTableProps {
  paginated:         Booking[]
  filtered:          Booking[]
  selected:          string[]
  detail:            Booking | null
  activeTab:         "all" | BookingStatus | "today"
  tabs:              readonly TabConfig[]
  page:              number
  totalPages:        number
  onTabChange:       (key: "all" | BookingStatus | "today") => void
  onRowClick:        (b: Booking) => void
  onToggleSelect:    (id: string) => void
  onToggleAll:       () => void
  onPageChange:      (p: number | ((prev: number) => number)) => void
  onStatusChange:    (id: string, status: BookingStatus) => void
}

export function BookingTable({
  paginated, filtered, selected, detail,
  activeTab, tabs, page, totalPages,
  onTabChange, onRowClick, onToggleSelect, onToggleAll,
  onPageChange, onStatusChange,
}: BookingTableProps) {
  return (
    <div className="bg-white flex flex-col" style={{ border: "1px solid #f0ebe3" }}>
      {/* Tabs */}
      <div className="flex items-center border-b border-[#f0ebe3] px-1 overflow-x-auto">
        {tabs.map(tab => {
          const active = activeTab === tab.key
          return (
            <button key={tab.key}
              onClick={() => onTabChange(tab.key as "all" | BookingStatus | "today")}
              className="flex items-center gap-[6px] px-4 py-3 text-[12px] font-medium whitespace-nowrap relative"
              style={{ fontFamily: "'Montserrat',sans-serif", color: active ? "#b89a6a" : "#9e8060", transition: "color 0.15s" }}>
              {tab.label}
              {tab.count > 0 && (
                <span className="text-[10px] font-bold px-[5px] py-[1px] rounded-full"
                  style={{ background: active ? "rgba(184,154,106,0.15)" : "#f0ebe3", color: active ? "#b89a6a" : "#9e8060" }}>
                  {tab.count}
                </span>
              )}
              {active && <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "#b89a6a" }} />}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full" style={{ minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f0ebe3", background: "#faf8f5" }}>
              <th className="w-10 px-4 py-3">
                <input type="checkbox"
                  checked={selected.length === paginated.length && paginated.length > 0}
                  onChange={onToggleAll}
                  className="w-[14px] h-[14px] cursor-pointer accent-[#b89a6a]"
                />
              </th>
              {["Mã", "Khách hàng", "Dịch vụ", "Barber", "Ngày & Giờ", "Giá", "Trạng thái", ""].map(h => (
                <th key={h} className="px-3 py-3 text-left text-[9px] font-bold tracking-[1.5px] uppercase text-[#bbb]"
                  style={{ fontFamily: "'Montserrat',sans-serif" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-14 text-center text-[12px] text-[#bbb]"
                  style={{ fontFamily: "'Montserrat',sans-serif" }}>
                  Không có lịch hẹn phù hợp
                </td>
              </tr>
            ) : paginated.map((b, idx) => {
              const isSelected = selected.includes(b.id)
              const isDetail   = detail?.id === b.id
              return (
                <tr key={b.id}
                  className="row-hover cursor-pointer"
                  onClick={() => onRowClick(b)}
                  style={{
                    borderBottom: idx < paginated.length - 1 ? "1px solid #f8f5f0" : "none",
                    background:   isDetail ? "#fffaf4" : isSelected ? "rgba(184,154,106,0.04)" : "transparent",
                    transition:   "background 0.15s",
                  }}>
                  <td className="px-4 py-3" onClick={e => { e.stopPropagation(); onToggleSelect(b.id) }}>
                    <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(b.id)}
                      className="w-[14px] h-[14px] cursor-pointer accent-[#b89a6a]" />
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-[11px] font-bold" style={{ color: "#b89a6a", fontFamily: "'Montserrat',sans-serif" }}>
                      {b.code}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={b.initials} size={28} color="#b89a6a" />
                      <div>
                        <p className="text-[12px] font-semibold text-[#1e1510]" style={{ fontFamily: "'Montserrat',sans-serif" }}>{b.customer}</p>
                        <p className="text-[10px] text-[#bbb]" style={{ fontFamily: "'Montserrat',sans-serif" }}>{b.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-[12px] text-[#3a3530]" style={{ fontFamily: "'Montserrat',sans-serif" }}>{b.service}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-[12px] text-[#3a3530]" style={{ fontFamily: "'Montserrat',sans-serif" }}>{b.barber}</span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-[12px] font-semibold text-[#1e1510]" style={{ fontFamily: "'Montserrat',sans-serif" }}>{b.time}</p>
                    <p className="text-[10px] text-[#bbb]" style={{ fontFamily: "'Montserrat',sans-serif" }}>{formatDisplayDate(b.date)}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-[12px] font-semibold text-[#b89a6a]" style={{ fontFamily: "'Montserrat',sans-serif" }}>{fmt(b.price)}</span>
                  </td>
                  <td className="px-3 py-3"><StatusPill status={b.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onStatusChange(b.id, "confirmed")}
                        disabled={b.status === "cancelled"}
                        className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-[#22c55e] hover:text-[#22c55e] disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ transition: "all 0.15s" }} title={b.status === "cancelled" ? "Lịch đã huỷ" : "Xác nhận"}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3L10 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onStatusChange(b.id, "cancelled")}
                        disabled={b.status === "cancelled"}
                        className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-red-300 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ transition: "all 0.15s" }} title={b.status === "cancelled" ? "Lịch đã huỷ" : "Huỷ"}>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#f0ebe3]">
        <span className="text-[11px] text-[#bbb]" style={{ fontFamily: "'Montserrat',sans-serif" }}>
          Hiển thị {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length} lịch hẹn
        </span>
        <div className="flex items-center gap-1">
          <button disabled={page === 1} onClick={() => onPageChange(p => p - 1)}
            className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] disabled:opacity-30 hover:border-[#b89a6a]"
            style={{ transition: "border-color 0.15s" }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          {Array(totalPages).fill(null).map((_, i) => (
            <button key={i + 1} onClick={() => onPageChange(i + 1)}
              className="w-7 h-7 flex items-center justify-center border text-[12px] font-semibold"
              style={{
                fontFamily:  "'Montserrat',sans-serif",
                background:  page === i + 1 ? "#b89a6a" : "#fff",
                borderColor: page === i + 1 ? "#b89a6a" : "#ede8e0",
                color:       page === i + 1 ? "#fff"    : "#3a3530",
                transition:  "all 0.15s",
              }}>
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages || totalPages === 0} onClick={() => onPageChange(p => p + 1)}
            className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] disabled:opacity-30 hover:border-[#b89a6a]"
            style={{ transition: "border-color 0.15s" }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}