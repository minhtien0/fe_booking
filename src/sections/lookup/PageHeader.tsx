// src/app/lookup/sections/PageHeader.tsx
export function PageHeader() {
  return (
    <div className="text-center mb-12">
      <span
        className="text-[11px] font-bold tracking-[3px] uppercase text-[#b89a6a]"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Hệ thống Salon cao cấp
      </span>
      <h1 className="text-3xl sm:text-4xl font-serif tracking-tight mt-2 text-[#3a322b]">
        Tra cứu &amp; Quản lý Lịch hẹn
      </h1>
      <p className="mt-3 text-sm text-[#7a6e62] max-w-md mx-auto leading-relaxed">
        Kiểm tra trạng thái, thay đổi thông tin thời gian hoặc hủy slot trống nhanh chóng
        bằng mã xác thực OTP bảo mật.
      </p>
    </div>
  )
}