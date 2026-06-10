// src/sections/lookup/LookupFormSection.tsx
interface LookupFormSectionProps {
  phoneInput: string
  codeInput: string
  isLoading: boolean
  errorMsg: string | null
  onPhoneChange: (v: string) => void
  onCodeChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}

const labelClass =
  'block text-[11px] font-bold tracking-[1.5px] uppercase text-[#7a6e62] mb-1.5'
const inputClass =
  'w-full px-4 py-3 text-[14px] bg-[#faf8f5] border border-[#e8dfd5] rounded-lg focus:outline-none focus:border-[#b89a6a] focus:bg-white transition-all tracking-wider font-mono'

export function LookupFormSection({
  phoneInput,
  codeInput,
  isLoading,
  errorMsg,
  onPhoneChange,
  onCodeChange,
  onSubmit,
}: LookupFormSectionProps) {
  return (
    <div className="max-w-md mx-auto bg-white border border-[#eaddcd] rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="text-lg font-serif text-[#3a322b] mb-4 text-center">
        Nhập thông tin tra cứu
      </h2>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className={labelClass} style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Số điện thoại đặt lịch *
          </label>
          <input
            type="tel"
            required
            value={phoneInput}
            onChange={e => onPhoneChange(e.target.value)}
            placeholder="Ví dụ: 0901234567"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Mã lịch hẹn (Nếu có)
          </label>
          <input
            type="text"
            value={codeInput}
            onChange={e => onCodeChange(e.target.value)}
            placeholder="Ví dụ: BK-202606-004"
            className={inputClass}
          />
        </div>

        {errorMsg && (
          <div className="text-[12px] text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-lg flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-[46px] bg-[#2c2520] hover:bg-[#b89a6a] text-white text-[12px] font-bold tracking-[2px] uppercase rounded-lg transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2 shadow-md"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0110.68-7.73L13.11 5.74A6 6 0 005.6 12H4z" />
              </svg>
              Đang kiểm tra hệ thống...
            </>
          ) : (
            'Tìm kiếm & Quản lý lịch'
          )}
        </button>
      </form>
    </div>
  )
}