// components/booking/BookingStepIndicator.tsx
// 5 steps: Dịch vụ → Barber → Lịch hẹn → Xác nhận → OTP
// step index: 0        1       2           3           4
const STEPS = [
  { label: "Dịch vụ",  icon: "✂"  },
  { label: "Barber",   icon: "👤" },
  { label: "Lịch hẹn", icon: "📅" },
  { label: "Xác nhận", icon: "✓"  },
  { label: "OTP",      icon: "🔐" },
]
export default function BookingStepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 px-2">
      {STEPS.map((step, i) => {
        const done   = i < current
        const active = i === current

        return (
          <div key={i} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[12px] sm:text-[13px] font-bold transition-all duration-300"
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  background: done ? "#b89a6a" : active ? "#1c1a16" : "#f0ebe3",
                  color:      done || active ? "#fff" : "#9e8060",
                  border:     active ? "2px solid #b89a6a" : "2px solid transparent",
                  boxShadow:  active ? "0 0 0 4px rgba(184,154,106,0.18)" : "none",
                }}
              >
                {done ? "✓" : step.icon}
              </div>
              <span
                className="text-[9px] sm:text-[10px] mt-[5px] tracking-[0.5px] sm:tracking-[1px] font-semibold uppercase"
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  color: active ? "#b89a6a" : done ? "#9e8060" : "#bbb",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className="w-6 sm:w-12 h-[2px] mb-5 mx-1 rounded-full transition-all duration-500"
                style={{ background: done ? "#b89a6a" : "#e8e0d5" }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}