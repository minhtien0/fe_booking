// src/app/lookup/components/EditBookingModal.tsx
// Modal chỉnh sửa chi tiết lịch hẹn (tên, SĐT, ngày, giờ, ghi chú, lý do)

import { BookingItem } from '../../types/booking'

interface EditBookingModalProps {
  booking: BookingItem
  editName: string
  editPhone: string
  editDate: string
  editTime: string
  editNote: string
  editReason: string
  isSavingEdit: boolean
  onNameChange:   (v: string) => void
  onPhoneChange:  (v: string) => void
  onDateChange:   (v: string) => void
  onTimeChange:   (v: string) => void
  onNoteChange:   (v: string) => void
  onReasonChange: (v: string) => void
  onSave:  () => void
  onClose: () => void
}

export function EditBookingModal({
  booking,
  editName, editPhone, editDate, editTime, editNote, editReason,
  isSavingEdit,
  onNameChange, onPhoneChange, onDateChange, onTimeChange,
  onNoteChange, onReasonChange,
  onSave, onClose,
}: EditBookingModalProps) {
  const inputClass =
    'w-full px-3 py-2 text-xs bg-[#faf8f5] border border-[#e8dfd5] rounded-lg focus:outline-none focus:border-[#b89a6a] focus:bg-white transition-all'

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#eaddcd] rounded-2xl w-full max-w-lg shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#fcfbfa] border-b border-[#eaddcd] flex justify-between items-center">
          <h3
            className="text-[12px] font-bold uppercase tracking-[1.5px] text-[#5c5043]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Chỉnh sửa chi tiết lịch hẹn
          </h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold tracking-[1px] uppercase text-[#7a6e62] mb-1">
                Tên khách hàng
              </label>
              <input
                type="text"
                value={editName}
                onChange={e => onNameChange(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[1px] uppercase text-[#7a6e62] mb-1">
                Số điện thoại mới
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={e => onPhoneChange(e.target.value)}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold tracking-[1px] uppercase text-[#7a6e62] mb-1">
                Ngày đặt hẹn mới
              </label>
              <input
                type="date"
                value={editDate}
                onChange={e => onDateChange(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[1px] uppercase text-[#7a6e62] mb-1">
                Giờ bắt đầu
              </label>
              <input
                type="time"
                value={editTime}
                onChange={e => onTimeChange(e.target.value)}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-[1px] uppercase text-[#7a6e62] mb-1">
              Lời nhắn / Yêu cầu bổ sung
            </label>
            <textarea
              rows={2}
              value={editNote}
              onChange={e => onNoteChange(e.target.value)}
              placeholder="Ví dụ: Đổi thợ nếu thợ cũ trùng lịch..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Lý do chỉnh sửa – bắt buộc theo DTO Backend */}
          <div className="bg-[#fffbf5] border border-[#f5ebd8] p-3 rounded-xl">
            <label className="block text-[11px] font-bold tracking-[1px] uppercase text-amber-900 mb-1">
              Lý do chỉnh sửa lịch *{' '}
              <span className="text-[10px] text-amber-600 font-normal italic">
                (Yêu cầu lưu nhật ký hệ thống)
              </span>
            </label>
            <input
              type="text"
              required
              value={editReason}
              onChange={e => onReasonChange(e.target.value)}
              placeholder="Ví dụ: Đổi lịch do bận giờ hành chính..."
              className="w-full px-3 py-2 text-xs bg-white border border-[#eaddcd] rounded-lg focus:outline-none focus:border-[#b89a6a] transition-all"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-500 hover:bg-stone-100 rounded-lg transition-all"
            >
              Đóng
            </button>
            <button
              onClick={onSave}
              disabled={isSavingEdit}
              className="px-5 py-2 text-[11px] font-bold tracking-[1px] uppercase bg-[#2c2520] hover:bg-[#b89a6a] text-white rounded-lg transition-all disabled:opacity-40"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {isSavingEdit ? 'Đang lưu hệ thống...' : 'Xác nhận cập nhật'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}