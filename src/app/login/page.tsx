"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useAuth } from '../../hooks/useAuth'

// ─── Luxury Design Tokens ────────────────────────────────────────────────────
const T = {
  bg: "#0d0c09",
  panel: "#17140f",
  surface: "#201b14",
  border: "#362d20",
  borderHov: "#594b35",
  gold: "#d4b27a",
  goldMid: "#bfa06b",
  goldLt: "#e6cfab",
  goldDim: "rgba(212, 178, 122, 0.05)",
  goldGlow: "rgba(212, 178, 122, 0.12)",
  muted: "#857560",
  faint: "#4a3f31",
  ink: "#f7f4eb",
  ink2: "#dcd4c4",
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'Montserrat', sans-serif",
  mono: "'Courier New', monospace",
}

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Montserrat:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; -webkit-font-smoothing: antialiased; }

  @keyframes nebulaFloat {
    0%, 100% { opacity: 0.4; transform: scale(1) translate(0px, 0px); }
    50%       { opacity: 0.7; transform: scale(1.15) translate(20px, -15px); }
  }
  @keyframes lineMotion {
    0%, 100% { opacity: 0.3; transform: rotate(15deg) translateY(0px); }
    50%       { opacity: 0.6; transform: rotate(15deg) translateY(-15px); }
  }
  @keyframes lineMotionR {
    0%, 100% { opacity: 0.2; transform: rotate(-15deg) translateY(0px); }
    50%       { opacity: 0.5; transform: rotate(-15deg) translateY(15px); }
  }
  @keyframes shimmerSweep { 0% { left: -150%; } 100% { left: 150%; } }
  @keyframes spin          { to { transform: rotate(360deg); } }
  @keyframes panelReveal   { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes fadeIn        { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp       { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes successPulse  { 0% { box-shadow: 0 0 0 0 rgba(214,207,171,0.4); } 70% { box-shadow: 0 0 0 20px rgba(214,207,171,0); } 100% { box-shadow: 0 0 0 0 rgba(214,207,171,0); } }
  @keyframes checkDraw     { from { stroke-dashoffset: 50; } to { stroke-dashoffset: 0; } }
  @keyframes errorShake    { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }

  .su1 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s  both; }
  .su2 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.18s both; }
  .su3 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
  .su4 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.32s both; }
  .shake { animation: errorShake 0.4s ease-in-out; }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 100px ${T.panel} inset !important;
    -webkit-text-fill-color: ${T.ink} !important;
    caret-color: ${T.ink};
  }
  ::placeholder { color: ${T.faint}; opacity: 0.8; }
  ::-webkit-scrollbar { display: none; }
`

// ─── Sub-components ───────────────────────────────────────────────────────────

function BackgroundCanvas() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none", backgroundColor: T.bg }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80')`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15, mixBlendMode: "luminosity" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <div style={{ position: "absolute", top: "-30%", right: "-15%", width: "80vw", height: "80vw", borderRadius: "50%", background: `radial-gradient(circle, rgba(214,178,122,0.09) 0%, transparent 70%)`, animation: "nebulaFloat 10s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "-25%", left: "-20%", width: "70vw", height: "70vw", borderRadius: "50%", background: `radial-gradient(circle, rgba(143,113,67,0.06) 0%, transparent 65%)`, animation: "nebulaFloat 14s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "-10%", left: "12%", width: "1px", height: "130%", background: `linear-gradient(180deg, transparent 0%, rgba(212,178,122,0.15) 30%, rgba(212,178,122,0.25) 70%, transparent 100%)`, transform: "rotate(15deg)", transformOrigin: "top center", animation: "lineMotion 12s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "-5%", right: "15%", width: "1px", height: "120%", background: `linear-gradient(180deg, transparent 0%, rgba(212,178,122,0.08) 40%, rgba(212,178,122,0.18) 75%, transparent 100%)`, transform: "rotate(-15deg)", transformOrigin: "top center", animation: "lineMotionR 16s ease-in-out infinite" }} />
      <svg style={{ position: "absolute", top: 40, right: 40, opacity: 0.12, transform: "scale(0.85)" }} width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="45" stroke={T.gold} strokeWidth="0.5" strokeDasharray="4 6" />
        <circle cx="50" cy="50" r="28" stroke={T.gold} strokeWidth="0.5" />
        <line x1="50" y1="0" x2="50" y2="100" stroke={T.gold} strokeWidth="0.5" opacity="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke={T.gold} strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  )
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${T.border})` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 3, height: 3, background: T.gold, transform: "rotate(45deg)", opacity: 0.5 }} />
        <div style={{ width: 5, height: 5, background: T.gold, transform: "rotate(45deg)" }} />
        <div style={{ width: 3, height: 3, background: T.gold, transform: "rotate(45deg)", opacity: 0.5 }} />
      </div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${T.border}, transparent)` }} />
    </div>
  )
}

function InputField({
  label, type = "text", value, onChange,
  placeholder, autoComplete, icon, error,
}: {
  label: string; type?: string; value: string
  onChange: (v: string) => void; placeholder?: string
  autoComplete?: string; icon: React.ReactNode; error?: string
}) {
  const [focused, setFocused] = useState(false)
  const [show, setShow] = useState(false)
  const isPass = type === "password"

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 9, fontFamily: T.sans, fontWeight: 700, letterSpacing: "3.5px", textTransform: "uppercase", color: focused ? T.goldLt : T.muted, marginBottom: 8, transition: "color 0.25s ease" }}>
        {label}
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: focused ? T.gold : T.faint, transition: "color 0.25s ease", pointerEvents: "none", display: "flex", alignItems: "center" }}>
          {icon}
        </div>
        <input
          type={isPass && show ? "text" : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{ width: "100%", paddingLeft: 46, paddingRight: isPass ? 46 : 16, paddingTop: 14, paddingBottom: 14, fontSize: 13, fontFamily: T.sans, fontWeight: 500, color: T.ink, background: focused ? T.goldDim : "rgba(0,0,0,0.15)", border: `1px solid ${error ? "#ef4444" : focused ? T.gold : T.border}`, outline: "none", transition: "all 0.25s ease", boxShadow: focused ? `0 4px 16px rgba(0,0,0,0.4), ${T.goldGlow}, inset 0 1px 0 rgba(212,178,122,0.05)` : "inset 0 1px 2px rgba(0,0,0,0.3)", letterSpacing: isPass && !show ? "4px" : "0.5px" }}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.muted, padding: 0, display: "flex", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = T.gold}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = T.muted}
          >
            {show ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7, fontSize: 10, fontFamily: T.sans, fontWeight: 500, color: "#f87171", animation: "fadeIn 0.2s ease both" }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#f87171" strokeWidth="1.6" strokeLinecap="round"><circle cx="6" cy="6" r="5" /><line x1="6" y1="3.5" x2="6" y2="6.5" /><circle cx="6" cy="8.5" r="0.5" fill="#f87171" /></svg>
          {error}
        </div>
      )}
    </div>
  )
}

function SubmitButton({ loading, disabled }: { loading: boolean; disabled: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button type="submit" disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", width: "100%", height: 48, marginTop: 8, overflow: "hidden", border: `1px solid ${disabled ? "rgba(0,0,0,0.2)" : hovered ? T.goldLt : T.goldMid}`, background: disabled ? "#24201a" : hovered ? `linear-gradient(135deg, ${T.goldMid}, ${T.goldLt})` : `linear-gradient(135deg, rgba(153,122,77,0.95), ${T.gold} 60%, ${T.goldLt})`, cursor: disabled || loading ? "not-allowed" : "pointer", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", transform: hovered && !disabled && !loading ? "translateY(-1px)" : "translateY(0)", boxShadow: hovered && !disabled && !loading ? `0 12px 28px rgba(191,160,107,0.18), 0 4px 10px rgba(0,0,0,0.3)` : "0 4px 12px rgba(0,0,0,0.2)" }}>
      {!disabled && !loading && (
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "50%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", animation: "shimmerSweep 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite", pointerEvents: "none" }} />
      )}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ width: 16, height: 16, border: `2px solid transparent`, borderTopColor: T.bg, borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
          <span style={{ fontSize: 10, fontFamily: T.sans, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: T.bg }}>Xác thực khóa...</span>
        </div>
      ) : (
        <span style={{ fontSize: 10, fontFamily: T.sans, fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: disabled ? T.faint : T.bg, transition: "color 0.3s ease" }}>
          Khởi chạy hệ thống
        </span>
      )}
    </button>
  )
}

function LockoutBanner({ seconds }: { seconds: number }) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const label = mins > 0 ? `${mins}:${String(secs).padStart(2, "0")} phút` : `${secs} giây`

  return (
    <div style={{ padding: "14px 16px", marginBottom: 20, background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.20)", animation: "fadeIn 0.3s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <p style={{ fontSize: 11, fontFamily: T.sans, fontWeight: 600, color: "#f87171", letterSpacing: "0.3px" }}>
          Truy cập bị tạm khoá do đăng nhập sai nhiều lần
        </p>
      </div>
      <div style={{ height: 2, background: "rgba(239,68,68,0.15)", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "#ef4444", width: "100%", opacity: 0.5 }} />
      </div>
      <p style={{ marginTop: 6, fontSize: 10, fontFamily: T.mono, color: "#f87171", opacity: 0.7, letterSpacing: "1px" }}>
        Thử lại sau: {label}
      </p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  // useAuth xử lý toàn bộ login logic + redirect
  // login()     → gọi /api/auth/login (Next.js route) → set HttpOnly cookie → redirect /admin
  // isLoading   → trạng thái đang gọi API
  // serverError → lỗi trả về từ NestJS (401 sai mật khẩu, 403 không có quyền, 429 bị khoá...)
  const { login, isLoading, error: serverError } = useAuth()

  // ── Form state ───────────────────────────────────────────────────────────────
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [fieldErr, setFieldErr] = useState<{ e?: string; p?: string }>({})
  const [success, setSuccess]   = useState(false)
  const [mounted, setMounted]   = useState(false)
  const [animate, setAnimate]   = useState(true)
  const [shaking, setShaking]   = useState(false)

  // ── Lockout countdown (429 từ NestJS) ────────────────────────────────────────
  const [lockedUntilMs, setLockedUntilMs] = useState<number | null>(null)
  const [countdown, setCountdown]         = useState(0)
  const isLocked = countdown > 0

  // ── Lỗi hiển thị: ưu tiên serverError, nếu không có thì không hiện ──────────
  // serverError từ useAuth đã bao gồm mọi loại lỗi từ backend
  const displayError = isLocked ? null : (serverError ?? null)

  const formRef = useRef<HTMLFormElement>(null)

  const memoizedStyles = useMemo(() => (
    <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
  ), [])

  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
    const t = setTimeout(() => setAnimate(false), 800)
    return () => clearTimeout(t)
  }, [])

  // Countdown timer cho lockout
  useEffect(() => {
    if (!lockedUntilMs) return
    const tick = () => {
      const remaining = Math.ceil((lockedUntilMs - Date.now()) / 1000)
      if (remaining <= 0) {
        setLockedUntilMs(null)
        setCountdown(0)
      } else {
        setCountdown(remaining)
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lockedUntilMs])

  // Shake khi có lỗi mới từ server
  useEffect(() => {
    if (!serverError) return
    setShaking(true)
    const t = setTimeout(() => setShaking(false), 450)
    return () => clearTimeout(t)
  }, [serverError])

  // ── Client-side validation ────────────────────────────────────────────────────
  const validate = useCallback(() => {
    const errs: { e?: string; p?: string } = {}
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim())           errs.e = "Email không được để trống."
    else if (!emailReg.test(email)) errs.e = "Email không đúng định dạng."
    if (!password)               errs.p = "Mật khẩu không được để trống."
    else if (password.length < 8) errs.p = "Mật khẩu tối thiểu 8 ký tự."
    setFieldErr(errs)
    return Object.keys(errs).length === 0
  }, [email, password])

  // ── Submit — delegate hoàn toàn cho useAuth.login() ──────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || isLocked || isLoading) return

    // Kiểm tra 429 từ serverError để set lockout countdown
    // (useAuth đã gọi API, nếu bị 429 serverError sẽ có "retryAfter" trong message)
    const result = await login({
      email:    email.trim().toLowerCase(),
      password,
    })

    // Nếu login thành công, useAuth tự redirect → set success UI
    // Nếu lỗi, serverError đã được set bởi useAuth
    // Chỉ cần handle 429 riêng để bật countdown
    if ((result as any)?.status === 429) {
      const retryAfterSec = (result as any)?.retryAfter ?? 15 * 60
      setLockedUntilMs(Date.now() + retryAfterSec * 1000)
    }
  }

  const onEmailChange    = (v: string) => { setEmail(v);    setFieldErr(p => ({ ...p, e: undefined })) }
  const onPasswordChange = (v: string) => { setPassword(v); setFieldErr(p => ({ ...p, p: undefined })) }

  const isReady = email.trim().length > 0 && password.length >= 8 && !isLocked

  return (
    <>
      {memoizedStyles}
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px", position: "relative", backgroundColor: T.bg }}>
        <BackgroundCanvas />

        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 410, animation: mounted ? "panelReveal 0.75s cubic-bezier(0.16, 1, 0.3, 1) both" : "none" }}>
          <div style={{ background: T.panel, border: `1px solid ${T.border}`, boxShadow: `0 30px 70px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,178,122,0.04), inset 0 1px 0 rgba(212,178,122,0.08)`, animation: success ? "successPulse 0.8s ease" : "none" }}>

            <div style={{ height: 2, background: `linear-gradient(90deg, transparent 0%, ${T.goldMid} 15%, ${T.gold} 50%, ${T.goldLt} 85%, transparent 100%)` }} />

            <div style={{ padding: "40px 40px 32px" }}>

              {/* Header */}
              <div className={animate ? "su1" : ""} style={{ textAlign: "center" }}>
                <div style={{ width: 52, height: 52, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}`, background: `radial-gradient(circle at center, rgba(212,178,122,0.1), transparent 75%)` }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="1.2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="0" strokeWidth="1.5" />
                    <path d="M7 11V7a5 5 0 0110 0v4M12 15v3" strokeWidth="1.5" />
                  </svg>
                </div>
                <div style={{ fontSize: 9, fontFamily: T.sans, fontWeight: 700, letterSpacing: "6px", textTransform: "uppercase", color: T.gold, marginBottom: 6 }}>ThienBinh</div>
                <h1 style={{ fontSize: 26, fontFamily: T.serif, fontWeight: 300, color: T.ink, letterSpacing: "0.5px", lineHeight: 1.2, marginBottom: 6 }}>Internal Gateway</h1>
                <p style={{ fontSize: 11, fontFamily: T.serif, fontStyle: "italic", color: T.muted }}>Cổng kết nối dành riêng cho Quản trị viên</p>
              </div>

              <div className={animate ? "su2" : ""}><Divider /></div>

              {success ? (
                <div style={{ textAlign: "center", padding: "32px 0", animation: "fadeIn 0.4s ease both" }}>
                  <div style={{ width: 52, height: 52, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.goldMid}`, background: `radial-gradient(circle, rgba(212,178,122,0.15), transparent 70%)`, animation: "successPulse 0.8s ease" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.goldLt} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" style={{ strokeDasharray: 50, strokeDashoffset: 0, animation: "checkDraw 0.4s ease 0.1s both" }} />
                    </svg>
                  </div>
                  <p style={{ fontSize: 15, fontFamily: T.serif, fontWeight: 400, color: T.ink, marginBottom: 6 }}>Cấp phép truy cập thành công</p>
                  <p style={{ fontSize: 10, fontFamily: T.sans, fontWeight: 500, color: T.muted, letterSpacing: "0.5px" }}>Đang thiết lập phiên làm việc Quản trị...</p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} noValidate
                  className={`${animate ? "su3" : ""} ${shaking ? "shake" : ""}`}>

                  <InputField
                    label="Email quản trị"
                    type="email"
                    value={email}
                    onChange={onEmailChange}
                    placeholder="admin@company.com"
                    autoComplete="email"
                    error={fieldErr.e}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    }
                  />

                  <InputField
                    label="Mật mã hệ thống"
                    type="password"
                    value={password}
                    onChange={onPasswordChange}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    error={fieldErr.p}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    }
                  />

                  {isLocked && <LockoutBanner seconds={countdown} />}

                  {displayError && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", marginBottom: 20, background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.18)", animation: "fadeIn 0.3s ease both" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="1" fill="#ef4444" />
                      </svg>
                      <p style={{ fontSize: 11, fontFamily: T.sans, fontWeight: 500, color: "#f87171", lineHeight: 1.5, letterSpacing: "0.2px" }}>
                        {displayError}
                      </p>
                    </div>
                  )}

                  <SubmitButton loading={isLoading} disabled={!isReady} />
                </form>
              )}

              {!success && (
                <div className={animate ? "su4" : ""} style={{ marginTop: 24, textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(212,178,122,0.06)" }} />
                    <div style={{ width: 4, height: 4, background: T.faint, transform: "rotate(45deg)" }} />
                    <div style={{ flex: 1, height: 1, background: "rgba(212,178,122,0.06)" }} />
                  </div>
                  <p style={{ fontSize: 9, fontFamily: T.sans, fontWeight: 500, color: T.muted, lineHeight: 1.8, letterSpacing: "0.3px" }}>
                    Cảnh báo bảo mật: Mọi dữ liệu truy cập và địa chỉ IP đều được ghi nhật ký tự động.
                    Hành vi xâm nhập trái phép sẽ bị xử lý theo chính sách an ninh nội bộ.
                  </p>
                </div>
              )}
            </div>

            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, rgba(212,178,122,0.15), transparent)` }} />
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 9, fontFamily: T.mono, letterSpacing: "2.5px", textTransform: "uppercase", color: T.faint, animation: mounted ? "fadeIn 1s ease 0.6s both" : "none" }}>
            Hệ thống Quản trị v2.1 &middot; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </>
  )
}