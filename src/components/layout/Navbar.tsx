"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import BookingTrigger from "../../components/booking/BookingTrigger"
const navLinks = [
  { label: "TRANG CHỦ", href: "/" },
  { label: "THÔNG TIN", href: "/about" },
  { label: "DỊCH VỤ", href: "/services" },
  { label: "TRƯNG BÀY", href: "/page" },
  { label: "TIN TỨC", href: "/blog" },
  { label: "LIÊN HỆ", href: "/contact" },
  { label: "TRA CỨU", href: "/lookup" },
];

const ScissorIcon = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path
      d="M8 6L14 18L8 30M28 6L22 18L28 30"
      stroke="#C9A96E"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="18" r="3" fill="#C9A96E" />
    <path
      d="M6 12h6M24 12h6M6 24h6M24 24h6"
      stroke="#C9A96E"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// ── CTA Button với hiệu ứng trượt màu, chữ không bị che ──────────────────────
// Dùng kỹ thuật: background-size transition thay vì ::before overlay
// background-image: linear-gradient(to right, màu_mới 50%, màu_cũ 50%)
// background-size: 200% 100%  →  hover: background-position shift sang trái
const ctaBaseStyle: React.CSSProperties = {
  backgroundImage: "linear-gradient(to right, #e8d5a3 50%, #9e8060 50%)",
  backgroundSize: "200% 100%",
  backgroundPosition: "right center",
  transition:
    "background-position 0.45s cubic-bezier(0.4, 0, 0.2, 1), color 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
};

const ctaHoverStyle: React.CSSProperties = {
  backgroundPosition: "left center",
};

function CtaButton({
  href,
  onClick,
  fullWidth = false,
}: {
  href: string;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        inline-flex items-center justify-center flex-shrink-0
        font-semibold tracking-[1.8px] no-underline whitespace-nowrap
        ${fullWidth ? "w-full h-[52px] mt-2" : "h-[70px] px-6"}
      `}
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "10.5px",
        fontWeight: 700,
        letterSpacing: "1.8px",
        color: hovered ? "#1c1713" : "#ffffff",
        ...ctaBaseStyle,
        ...(hovered ? ctaHoverStyle : {}),
      }}
    >
      Đặt Lịch Hẹn
    </Link>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2.5 no-underline flex-shrink-0"
      aria-label="Barber Shop Home"
    >
      <ScissorIcon size={36} />
      <div className="flex flex-col leading-none">
        <span
          className="text-white font-bold tracking-[3px] whitespace-nowrap"
          style={{ fontFamily: "'Cinzel', Georgia, serif", fontSize: "15px" }}
        >
          ThienBinh
        </span>
        <span
          className="text-[#C9A96E] tracking-[1.5px] mt-1 whitespace-nowrap hidden sm:block"
          style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "7.5px" }}
        >
          YOUR COMPLETE HAIR SOLUTION SINCE · 1952
        </span>
      </div>
    </Link>
  );
}

// ── Hamburger ─────────────────────────────────────────────────────────────────
function Hamburger({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="lg:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 bg-transparent border border-[#C9A96E]/30 hover:border-[#C9A96E] transition-colors duration-300 flex-shrink-0 cursor-pointer p-2"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <span
        className="block w-[22px] h-[1.5px] bg-[#C9A96E] transition-all duration-300 origin-center"
        style={{
          transform: isOpen ? "translateY(6.5px) rotate(45deg)" : "none",
        }}
      />
      <span
        className="block w-[22px] h-[1.5px] bg-[#C9A96E] transition-all duration-200"
        style={{
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? "scaleX(0)" : "none",
        }}
      />
      <span
        className="block w-[22px] h-[1.5px] bg-[#C9A96E] transition-all duration-300 origin-center"
        style={{
          transform: isOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
        }}
      />
    </button>
  );
}

// ── Navbar chính ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-[#1c1713] border-b border-[#C9A96E]/15 transition-all duration-300 ${
          scrolled ? "shadow-[0_4px_30px_rgba(0,0,0,0.5)] bg-[rgba(28,23,19,0.97)]" : ""
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-[1280px] mx-auto px-6 h-[70px] flex items-center gap-8">
          {/* Logo */}
          <div className="mr-auto">
            <Logo />
          </div>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="group relative flex items-center px-4 h-[70px] text-[#d4cfc9] hover:text-white no-underline transition-colors duration-300 whitespace-nowrap"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                  }}
                >
                  {link.label}
                  {/* Gold underline slide */}
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#C9A96E] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA — desktop */}
          <div className="hidden lg:block">
            <BookingTrigger label="Đặt Lịch Hẹn" variant="outline" />
          </div>

          {/* Hamburger */}
          <Hamburger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </div>
      </nav>

      {/* ── Overlay ── */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ── */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-[300px] max-w-[85vw] bg-[#1c1713] border-r border-[#C9A96E]/20 z-50 flex flex-col overflow-y-auto transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center px-5 h-[70px] border-b border-[#C9A96E]/15 flex-shrink-0">
          <Logo onClick={() => setIsOpen(false)} />
        </div>

        {/* Links */}
        <ul className="list-none m-0 py-4 flex-1">
          {navLinks.map((link, i) => (
            <li
              key={link.label}
              className="transition-all duration-300"
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateX(0)" : "translateX(-16px)",
                transitionDelay: isOpen ? `${i * 60}ms` : "0ms",
              }}
            >
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3.5 px-6 text-[#d4cfc9] hover:text-[#e8d5a3] border-l-2 border-transparent hover:border-[#C9A96E] hover:pl-8 no-underline transition-all duration-200"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  letterSpacing: "2px",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer CTA */}
        <div className="px-5 pb-8 pt-4 border-t border-[#C9A96E]/15 flex-shrink-0">
          <BookingTrigger label="Đặt Lịch Hẹn" variant="outline" className="w-full h-[52px] mt-2" />
        </div>
      </div>
    </>
  );
}