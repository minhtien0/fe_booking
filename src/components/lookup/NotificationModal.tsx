// src/app/lookup/components/NotificationModal.tsx
// Popup thông báo kết quả (thành công / thất bại) dùng chung toàn trang

import { NotificationState } from '../../types/booking'

interface NotificationModalProps {
  notification: NotificationState
  onClose: () => void
}

export function NotificationModal({ notification, onClose }: NotificationModalProps) {
  const isSuccess = notification.type === 'success'

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white border border-[#eaddcd] rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Icon */}
        <div
          className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
            isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}
        >
          {isSuccess ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>

        <h3 className="text-base font-serif text-[#3a322b] mb-1">{notification.title}</h3>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed whitespace-pre-line">
          {notification.message}
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#2c2520] hover:bg-[#b89a6a] text-white text-[11px] font-bold tracking-[1px] uppercase rounded-lg transition-all shadow-sm"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Đóng thông báo
        </button>
      </div>
    </div>
  )
}