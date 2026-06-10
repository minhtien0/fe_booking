"use client";
import { useState } from "react"
// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — chỉnh thông tin tại đây
// ─────────────────────────────────────────────────────────────────────────────
const CONTACT_INFO = {
  heading:     "Hãy liên hệ với chúng tôi &\ngửi tin nhắn cho chúng tôi ngay hôm nay!",
  description:
    "Saasbiz là một công ty kiến ​​trúc khác biệt. Được LoganCee thành lập năm 1991, chúng tôi là một công ty thuộc sở hữu của nhân viên, theo đuổi quy trình thiết kế dân chủ, coi trọng ý kiến ​​đóng góp của mọi người.",
  address:     ["711 Thanh Xuan Quan 12", "TP HCM, Sai Gon"],
  email:       "thienbinh@shop.com",
  phone:       "+88 (0) 101 0000 000",
  fax:         "+88 (0) 202 0000 001",
  mapSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25281528897!2d-74.11976389999999!3d40.697403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1716000000000",
}
// ─────────────────────────────────────────────────────────────────────────────
// LABEL component
// ─────────────────────────────────────────────────────────────────────────────
function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <p
      className="text-[13px] text-[#3a3530] leading-relaxed"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <span className="text-[#9e8060] font-semibold mr-1">{label}</span>
      {href ? (
        <a href={href} className="hover:text-[#9e8060]" style={{ transition: "color .2s" }}>
          {value}
        </a>
      ) : (
        value
      )}
    </p>
  )
}
// ─────────────────────────────────────────────────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm]         = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused]   = useState<string | null>(null)

  const inputStyle = (field: string): React.CSSProperties => ({
    fontFamily: "'Montserrat', sans-serif",
    fontSize:   "13px",
    border:     `1px solid ${focused === field ? "#9e8060" : "#d6cec4"}`,
    outline:    "none",
    transition: "border-color .25s ease",
    background: "#fff",
    color:      "#3a3530",
    width:      "100%",
    padding:    "12px 14px",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: replace with real API call
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center h-48">
        <p
          className="text-[#9e8060] text-[15px] font-semibold text-center"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          ✓ Your message has been sent!<br />
          <span className="text-[#7a6e62] text-[13px] font-normal">We'll get back to you shortly.</span>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Row: Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
          style={inputStyle("name")}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused(null)}
          style={inputStyle("email")}
          required
        />
      </div>

      {/* Textarea */}
      <textarea
        placeholder="Message"
        value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
        onFocus={() => setFocused("message")}
        onBlur={() => setFocused(null)}
        rows={7}
        style={{ ...inputStyle("message"), resize: "vertical", minHeight: "160px" }}
        required
      />

      {/* Submit */}
      <div>
        <SendButton />
      </div>
    </form>
  )
}
// ─────────────────────────────────────────────────────────────────────────────
// SEND BUTTON — fill trượt từ trái
// ─────────────────────────────────────────────────────────────────────────────
function SendButton() {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="submit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative h-[48px] px-10 overflow-hidden text-[11px] font-bold tracking-[2.5px] uppercase"
      style={{ fontFamily: "'Montserrat', sans-serif", color: hovered ? "#fff" : "#fff", background: "#9e8060", transition: "background .3s ease" }}
    >
      <span
        className="absolute inset-0 bg-[#7a6248] origin-left"
        style={{ transform: hovered ? "scaleX(1)" : "scaleX(0)", transition: "transform .4s cubic-bezier(0.76,0,0.24,1)" }}
      />
      <span className="relative z-10">Gửi Lời Nhắn </span>
    </button>
  )
}
// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@400;600;700&display=swap');
      `}</style>

      {/* ── Google Map ────────────────────────────────────────────────────── */}
      <div className="w-full" style={{ height: "clamp(220px, 32vw, 300px)" }}>
        <iframe
          src={CONTACT_INFO.mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Our Location"
        />
      </div>

      {/* ── Contact body ──────────────────────────────────────────────────── */}
      <section className="w-full bg-white py-16 px-4 md:px-10">
        <div className="max-w-[1100px] mx-auto">
          {/*
            Desktop: left info + right form side by side
            Mobile : stack (info → form)
          */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

            {/* ── LEFT: Info ─────────────────────────────────────────────── */}
            <div className="flex-1 max-w-[440px]">
              {/* Heading */}
              <h2
                className="text-[#1e1510] mb-5 leading-[1.25]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize:   "clamp(26px, 3.5vw, 40px)",
                  fontWeight: 400,
                }}
              >
                {CONTACT_INFO.heading.split("\n").map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h2>

              {/* Description */}
              <p
                className="text-[#7a6e62] text-[13px] leading-relaxed mb-7"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {CONTACT_INFO.description}
              </p>

              {/* Address */}
              <div className="mb-5">
                {CONTACT_INFO.address.map((line, i) => (
                  <p
                    key={i}
                    className="text-[13px] text-[#3a3530] leading-relaxed"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Contact details */}
              <div className="space-y-[6px]">
                <InfoRow label="Email:" value={CONTACT_INFO.email} href={`mailto:${CONTACT_INFO.email}`} />
                <InfoRow label="Phone:" value={CONTACT_INFO.phone} href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`} />
                <InfoRow label="Fax:"   value={CONTACT_INFO.fax} />
              </div>
            </div>

            {/* ── RIGHT: Form ────────────────────────────────────────────── */}
            <div className="flex-1 w-full max-w-[600px] border border-[#ede8e0] p-8">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}