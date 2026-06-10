// src/app/lookup/components/OtpModal.tsx
interface OtpModalProps {
  phoneInput: string
  otpInput: string
  isVerifyingOtp: boolean
  onOtpChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export function OtpModal({
  phoneInput,
  otpInput,
  isVerifyingOtp,
  onOtpChange,
  onSubmit,
  onClose,
}: OtpModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#eaddcd] rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-50 text-amber-600 mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h3 className="text-base font-serif text-[#3a322b] mb-1">Xác thực OTP</h3>
        <p className="text-xs text-stone-500 mb-4 leading-relaxed">
          Mã xác thực quyền sở hữu lịch hẹn vừa được gửi đến SĐT{' '}
          <strong className="font-mono text-stone-800">{phoneInput}</strong>.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            required
            maxLength={6}
            placeholder="------"
            value={otpInput}
            onChange={e => onOtpChange(e.target.value.replace(/\D/g, ''))}
            className="w-full text-center px-4 py-3 text-xl font-bold tracking-[8px] font-mono bg-[#faf8f5] border border-[#e8dfd5] rounded-lg focus:outline-none focus:border-[#b89a6a]"
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-stone-500 text-xs font-semibold hover:bg-stone-50 border border-stone-200 rounded-lg transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isVerifyingOtp}
              className="flex-1 py-2 bg-[#2c2520] hover:bg-[#b89a6a] text-white text-xs font-bold tracking-[1px] uppercase rounded-lg transition-all disabled:opacity-50"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {isVerifyingOtp ? 'Đang check...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}