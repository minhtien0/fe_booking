// src/app/lookup/sections/BookingListSection.tsx
// Section danh sách lịch hẹn – hiển thị sau khi xác thực thành công
// Gồm: session bar, filter tabs, danh sách cards, nút xem thêm

import { BookingItem, FilterTab } from '../../types/booking'
import { BookingCard } from '../../components/lookup/BookingCard'

interface BookingListSectionProps {
  phoneInput: string
  filterTab: FilterTab
  filteredBookings: BookingItem[]
  displayedBookings: BookingItem[]
  visibleCount: number
  onFilterTabChange: (tab: FilterTab) => void
  onLoadMore: () => void
  onEdit: (booking: BookingItem) => void
  onCancel: (id: number) => void
  onLogout: () => void
}

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'today',    label: 'Hôm nay' },
  { key: 'upcoming', label: 'Sắp diễn ra' },
  { key: 'all',      label: 'Tất cả lịch' },
]

export function BookingListSection({
  phoneInput,
  filterTab,
  filteredBookings,
  displayedBookings,
  visibleCount,
  onFilterTabChange,
  onLoadMore,
  onEdit,
  onCancel,
  onLogout,
}: BookingListSectionProps) {
  return (
    <div className="space-y-6">
      {/* Session bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#eaddcd] rounded-xl p-4 shadow-sm">
        <p className="text-sm">
          Phiên quản trị bảo mật của SĐT:{' '}
          <strong className="font-mono text-[#b89a6a]">{phoneInput}</strong>
          <span className="ml-2 inline-block px-2 py-0.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded">
            Token Active
          </span>
        </p>
        <button
          onClick={onLogout}
          className="text-xs font-semibold text-rose-600 hover:underline"
        >
          Thoát phiên chỉnh sửa
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-stone-200 gap-6">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterTabChange(key)}
            className={`pb-3 text-xs font-bold tracking-[1.5px] uppercase transition-all relative ${
              filterTab === key ? 'text-[#b89a6a]' : 'text-stone-400 hover:text-stone-600'
            }`}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {label}
            {filterTab === key && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b89a6a]" />
            )}
          </button>
        ))}
      </div>

      {/* Danh sách lịch hẹn */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#eaddcd] rounded-2xl">
          <svg className="mx-auto h-12 w-12 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-[13px] text-stone-500">
            Không tìm thấy lịch hẹn nào trong danh mục này.
          </p>
        </div>
      ) : (
        <>
          {displayedBookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onEdit={onEdit}
              onCancel={onCancel}
            />
          ))}

          {/* Nút xem thêm */}
          {filteredBookings.length > visibleCount && (
            <div className="flex justify-center pt-4 animate-in fade-in duration-500">
              <button
                onClick={onLoadMore}
                className="px-6 py-2.5 text-[11px] font-bold tracking-[1.5px] uppercase border border-[#2c2520] text-[#2c2520] hover:bg-[#2c2520] hover:text-white rounded-lg transition-all duration-300 shadow-sm flex items-center gap-2"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <span>Xem thêm lịch hẹn</span>
                <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded text-[10px] font-mono border border-stone-200">
                  +{filteredBookings.length - visibleCount}
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}