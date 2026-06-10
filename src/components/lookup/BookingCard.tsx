// src/app/lookup/components/BookingCard.tsx
// Card hiển thị chi tiết một lịch hẹn – có nút Sửa / Hủy khi status cho phép

import { BookingItem } from '../../types/booking'
import { StatusBadge } from './StatusBadge'

interface BookingCardProps {
  booking: BookingItem
  onEdit: (booking: BookingItem) => void
  onCancel: (id: number) => void
}

const MODIFIABLE_STATUSES = new Set(['pending', 'confirmed'])

export function BookingCard({ booking, onEdit, onCancel }: BookingCardProps) {
  const isModifiable = MODIFIABLE_STATUSES.has(booking.status)

  const accentColor =
    booking.status === 'confirmed'
      ? 'bg-emerald-500'
      : booking.status === 'pending'
      ? 'bg-amber-400'
      : 'bg-stone-300'

  return (
    <div className="bg-white border border-[#eaddcd] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden relative group animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      {/* Thanh màu trạng thái bên trái */}
      <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${accentColor}`} />

      <div className="p-5 sm:p-6 ml-1">
        {/* Header: mã lịch + ngày đặt + badge */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded mr-2">
              {booking.bookingCode || 'CHƯA CÓ MÃ'}
            </span>
            <span className="text-xs text-stone-400">Ngày đặt: {booking.bookingDate}</span>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Nội dung chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-sm">
          <div className="space-y-2">
            <p className="text-[13px] text-stone-500">
              Khách hàng:{' '}
              <span className="font-semibold text-stone-800">{booking.customerName}</span>
            </p>
            <p className="text-[13px] text-stone-500">
              Số điện thoại:{' '}
              <span className="font-mono font-medium text-stone-700">{booking.customerPhone}</span>
            </p>
            <p className="text-[13px] text-stone-500">
              Dịch vụ:{' '}
              <span className="font-medium text-stone-800">{booking.serviceName}</span>
              {booking.type === 'combo' ? (
                <span className="text-[9px] font-bold uppercase tracking-[0.5px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded ml-1.5 align-middle">
                  Combo
                </span>
              ) : (
                <span className="text-[9px] font-bold uppercase tracking-[0.5px] bg-stone-50 text-stone-600 border border-stone-200 px-1.5 py-0.5 rounded ml-1.5 align-middle">
                  Đơn lẻ
                </span>
              )}
            </p>
            <p className="text-[13px] text-stone-500">
              Stylist/Barber:{' '}
              <span className="text-[#b89a6a] font-medium">{booking.barberName}</span>
            </p>
          </div>

          <div className="space-y-2 md:border-l md:pl-6 border-stone-100">
            <p className="text-[13px] text-stone-500">
              Khung giờ:{' '}
              <span className="font-mono bg-[#fffbf5] text-[#7a6248] border border-[#f5ebd8] px-2 py-0.5 rounded font-bold">
                {booking.slotStartTime} - {booking.slotEndTime}
              </span>{' '}
              ({booking.totalDuration} phút)
            </p>
            <p className="text-[13px] text-stone-500">
              Tổng chi phí:{' '}
              <span className="font-bold text-[#b89a6a] text-base">
                {booking.snapshotPrice.toLocaleString('vi-VN')}đ
              </span>
            </p>
            {booking.note && (
              <p className="text-xs text-stone-400 italic bg-stone-50 p-2 rounded">
                📌 Ghi chú: "{booking.note}"
              </p>
            )}
          </div>
        </div>

        {/* Khu vực thao tác – chỉ hiển thị khi được phép */}
        {isModifiable && (
          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-stone-50">
            <button
              onClick={() => onCancel(booking.id)}
              className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all"
            >
              Hủy lịch hẹn
            </button>
            <button
              onClick={() => onEdit(booking)}
              className="px-4 py-1.5 text-xs font-bold tracking-[0.5px] uppercase bg-[#2c2520] hover:bg-[#b89a6a] text-white rounded-lg transition-all"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Chỉnh sửa chi tiết
            </button>
          </div>
        )}
      </div>
    </div>
  )
}