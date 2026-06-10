"use client"

import { useState } from "react"
import Link from "next/link"

/* ─── Icons ─────────────────────────────────────────────────────────── */
function IconFacebook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
function IconTwitter() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2-4.52 4.5 0 .35.04.7.11 1.03C7.69 5.35 4.07 3.58 1.64.9a4.5 4.5 0 0 0-.61 2.26c0 1.56.8 2.94 2 3.75A4.48 4.48 0 0 1 .96 6v.06c0 2.18 1.55 4 3.6 4.42a4.52 4.52 0 0 1-2.04.08c.57 1.8 2.24 3.1 4.2 3.14A9.05 9.05 0 0 1 0 15.54 12.8 12.8 0 0 0 6.92 17.5c8.3 0 12.84-6.88 12.84-12.85 0-.2 0-.39-.01-.58A9.17 9.17 0 0 0 22 1.89 9 9 0 0 1 23 3z" />
    </svg>
  )
}
function IconGoogle() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
    </svg>
  )
}
function IconInstagram() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function IconLinkedin() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

/* ─── Logo ───────────────────────────────────────────────────────────── */
function BarberShopLogo() {
  return (
    <div className="flex items-center gap-3 mb-5">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="28" width="18" height="3" rx="1" fill="#b89a6a" />
        {[0, 3, 6, 9, 12, 15].map(x => (
          <rect key={x} x={5 + x} y="31" width="1.5" height="6" rx="0.5" fill="#b89a6a" />
        ))}
        <circle cx="34" cy="14" r="4" stroke="#b89a6a" strokeWidth="1.4" fill="none" />
        <circle cx="42" cy="22" r="4" stroke="#b89a6a" strokeWidth="1.4" fill="none" />
        <line x1="31" y1="17" x2="45" y2="19" stroke="#b89a6a" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="37" y1="11" x2="39" y2="26" stroke="#b89a6a" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <div>
        <div className="footer-brand-name text-white text-[20px] font-bold tracking-[3px] leading-tight">
          ThienBinh
        </div>
        <div className="text-[#9e8060] text-[7.5px] tracking-[1.8px] uppercase footer-tagline">
          Giải pháp chăm sóc tóc toàn diện của bạn từ năm · 2016
        </div>
      </div>
    </div>
  )
}

/* ─── Subscribe Form ─────────────────────────────────────────────────── */
function SubscribeForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail("")
  }

  if (submitted) {
    return (
      <div className="py-5 flex items-center gap-2 footer-subscribe-success">
        <span className="text-[#b89a6a] text-[18px]">✓</span>
        <p className="text-[#b89a6a] text-[12px] tracking-[1px] uppercase footer-font">
          Cảm ơn bạn đã đăng ký!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-0">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Email Address..."
          className="footer-input w-full bg-[#2f2d2a] text-[#ccc] text-[12px] px-5 py-[14px] outline-none placeholder-[#555] footer-font"
          style={{
            borderBottom: `1px solid ${focused ? "#b89a6a" : "#3a3530"}`,
            borderTop: "1px solid transparent",
            borderLeft: "1px solid transparent",
            borderRight: "1px solid transparent",
            transition: "border-color 0.3s ease",
            letterSpacing: "0.5px",
          }}
          required
        />
      </div>
      <button
        type="submit"
        className="footer-subscribe-btn w-full py-[14px] text-[10px] font-bold tracking-[3px] uppercase text-white footer-font"
        style={{
          background: "linear-gradient(135deg, #9e8060 0%, #b89a6a 100%)",
          transition: "opacity 0.25s ease, transform 0.15s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.opacity = "1"
        }}
        onMouseDown={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scaleY(0.97)"
        }}
        onMouseUp={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scaleY(1)"
        }}
      >
        Đăng Ký Ngay
      </button>
    </form>
  )
}

/* ─── Social Link ────────────────────────────────────────────────────── */
function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 flex items-center justify-center rounded-full"
      style={{
        color: hovered ? "#b89a6a" : "#666",
        background: hovered ? "rgba(184,154,106,0.1)" : "transparent",
        border: `1px solid ${hovered ? "rgba(184,154,106,0.35)" : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  )
}

/* ─── Footer Heading ─────────────────────────────────────────────────── */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className="text-white text-[13px] font-bold tracking-[3px] uppercase footer-font">
        {children}
      </h4>
      <div
        className="mt-3"
        style={{
          width: "28px",
          height: "1.5px",
          background: "linear-gradient(90deg, #b89a6a, transparent)",
        }}
      />
    </div>
  )
}

/* ─── FooterLink ─────────────────────────────────────────────────────── */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      className="relative block footer-font text-[12px] leading-[1.6] py-[2px] footer-link"
      style={{
        color: hovered ? "#b89a6a" : "#8a8070",
        transition: "color 0.25s ease",
        paddingLeft: hovered ? "10px" : "0px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 text-[#b89a6a]"
          style={{ fontSize: "8px" }}
        >
          ›
        </span>
      )}
      {children}
    </a>
  )
}

/* ─── Data ───────────────────────────────────────────────────────────── */
const openingHours = [
  { id: 1, label: "Thứ 2 – Thứ 6", time: "11:30 – 14:00" },
  { id: 2, label: "Thứ 7 – Chủ Nhật", time: "09:00 – 20:00" },
  { id: 3, label: "Thứ 2 – Thứ 6", time: "17:30 – 23:00" },
  { id: 4, label: "Thứ 7 – Chủ Nhật", time: "04:30 – 13:00" },
]

const bottomLinks = [
  { label: "Đặt Lịch", href: "#" },
  { label: "Điều Khoản", href: "#" },
  { label: "Báo Lỗi", href: "#" },
]

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

        .footer-font { font-family: 'Montserrat', sans-serif; }
        .footer-brand-name { font-family: 'Montserrat', sans-serif; }
        .footer-tagline { font-family: 'Montserrat', sans-serif; }

        .footer-section { 
          animation: footerFadeUp 0.6s ease both;
        }
        .footer-section:nth-child(1) { animation-delay: 0.05s; }
        .footer-section:nth-child(2) { animation-delay: 0.12s; }
        .footer-section:nth-child(3) { animation-delay: 0.19s; }
        .footer-section:nth-child(4) { animation-delay: 0.26s; }

        @keyframes footerFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .footer-subscribe-success {
          animation: successPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes successPop {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }

        .hours-row::after {
          content: '';
          flex: 1;
          height: 1px;
          background: repeating-linear-gradient(
            90deg, #3a3530 0px, #3a3530 2px, transparent 2px, transparent 6px
          );
          margin: 0 8px;
        }

        .footer-bottom-link {
          position: relative;
          overflow: hidden;
        }
        .footer-bottom-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -1px;
          width: 0; height: 1px;
          background: #b89a6a;
          transition: width 0.3s ease;
        }
        .footer-bottom-link:hover::after { width: 100%; }
      `}</style>

      <footer style={{ background: "#222019" }}>

        {/* ── Gold top accent ── */}
        <div style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #b89a6a 30%, #e8c98a 50%, #b89a6a 70%, transparent 100%)",
        }} />

        {/* ── Main content ── */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

            {/* Col 1: Brand */}
            <div className="footer-section">
              <BarberShopLogo />
              <p className="footer-font text-[12.5px] leading-[1.9] mb-7 max-w-[220px]"
                style={{ color: "#6e6558" }}>
                Tiệm cắt tóc của chúng tôi được tạo ra dành cho những người đàn ông đánh giá cao chất lượng cao cấp, thời gian và vẻ ngoài hoàn hảo.
              </p>
              <div className="flex items-center gap-2">
                <SocialLink href="#"><IconFacebook /></SocialLink>
                <SocialLink href="#"><IconTwitter /></SocialLink>
                <SocialLink href="#"><IconGoogle /></SocialLink>
                <SocialLink href="#"><IconInstagram /></SocialLink>
                <SocialLink href="#"><IconLinkedin /></SocialLink>
              </div>
            </div>

            {/* Col 2: Address */}
            <div className="footer-section">
              <FooterHeading>Trụ Sở Chính</FooterHeading>
              <address className="not-italic space-y-1">
                <p className="footer-font text-[12.5px] leading-[1.9] mb-4"
                  style={{ color: "#6e6558" }}>
                  711 Thanh Xuân, Quận 12<br />
                  TP. Hồ Chí Minh, Sài Gòn
                </p>
                <a href="mailto:thienbinh@shop.com"
                  className="footer-font block text-[12.5px] pb-1"
                  style={{ color: "#8a8070", transition: "color 0.25s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#b89a6a")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8a8070")}>
                  thienbinh@shop.com
                </a>
                <a href="tel:+123456789101"
                  className="footer-font block text-[12.5px]"
                  style={{ color: "#8a8070", transition: "color 0.25s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#b89a6a")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8a8070")}>
                  (+123) 456 789 101
                </a>
              </address>
            </div>

            {/* Col 3: Hours */}
            <div className="footer-section">
              <FooterHeading>Giờ Mở Cửa</FooterHeading>
              <ul className="space-y-[10px]">
                {openingHours.map(row => (
                  <li key={row.id} className="hours-row flex items-center footer-font text-[12px]"
                    style={{ color: "#6e6558" }}>
                    <span className="shrink-0">{row.label}</span>
                    <span className="shrink-0" style={{ color: "#9e8060" }}>{row.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Subscribe */}
            <div className="footer-section">
              <FooterHeading>Đăng Ký</FooterHeading>
              <p className="footer-font text-[12px] mb-4 leading-relaxed" style={{ color: "#6e6558" }}>
                Nhận ưu đãi & tin tức mới nhất từ ThienBinh.
              </p>
              <SubscribeForm />
            </div>

          </div>
        </div>

        {/* ── Ornamental divider ── */}
        <div className="flex items-center max-w-[1200px] mx-auto px-6 md:px-10">
          <div style={{ flex: 1, height: "1px", background: "#2e2c28" }} />
          <div className="mx-4 flex items-center gap-2">
            <div style={{ width: "4px", height: "4px", background: "#b89a6a", transform: "rotate(45deg)", opacity: 0.5 }} />
            <div style={{ width: "6px", height: "6px", background: "#b89a6a", transform: "rotate(45deg)" }} />
            <div style={{ width: "4px", height: "4px", background: "#b89a6a", transform: "rotate(45deg)", opacity: 0.5 }} />
          </div>
          <div style={{ flex: 1, height: "1px", background: "#2e2c28" }} />
        </div>

        {/* ── Bottom bar ── */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="footer-font text-[11px] text-center sm:text-left" style={{ color: "#4a4740" }}>
            © 2026 ThienBinh · Powered by{" "}
            <a href="#" className="footer-bottom-link inline-block"
              style={{ color: "#6e6558", transition: "color 0.25s ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#b89a6a")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6e6558")}>
              DynamicLayers
            </a>
          </p>
          <nav className="flex items-center gap-6">
            {bottomLinks.map(link => (
              <Link key={link.label} href={link.href}
                className="footer-bottom-link footer-font text-[10px] font-semibold tracking-[2px] uppercase"
                style={{ color: "#4a4740", transition: "color 0.25s ease" }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "#b89a6a")}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "#4a4740")}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

      </footer>
    </>
  )
}