// src/app/lookup/components/CancelConfirmModal.tsx
// Popup xác nhận trước khi thực hiện hủy lịch hẹn

interface CancelConfirmModalProps {
  isCancelling: boolean
  onConfirm: () => void
  onClose: () => void
}

export function CancelConfirmModal({ isCancelling, onConfirm, onClose }: CancelConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#eaddcd] rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Icon cảnh báo */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-50 text-rose-600 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h3 className="text-base font-serif text-[#3a322b] mb-2">Xác nhận hủy lịch hẹn</h3>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          Bạn có chắc chắn muốn hủy bỏ lịch hẹn này không? Sau khi xác nhận, slot phục vụ này sẽ lập tức được mở lại công khai.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-stone-200 text-stone-600 text-[11px] font-bold tracking-[1px] uppercase rounded-lg hover:bg-stone-50 transition-all"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Giữ lại lịch
          </button>
          <button
            onClick={onConfirm}
            disabled={isCancelling}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold tracking-[1px] uppercase rounded-lg transition-all disabled:opacity-50"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {isCancelling ? 'Đang hủy...' : 'Đồng ý Hủy'}
          </button>
        </div>
      </div>
    </div>
  )
}