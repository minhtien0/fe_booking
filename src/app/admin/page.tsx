"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useAdminGuard } from '../../hooks/useAdminGuard'
import Link from "next/link"

// ─── Design System ────────────────────────────────────────────────────────────
const C = {
  // Base
  bg: "#faf8f5",
  surface: "#ffffff",
  surfaceAlt: "#fdf9f4",
  // Gold scale
  gold: "#b89a6a",
  goldMid: "#a08555",
  goldLt: "#d4b896",
  goldPale: "#f0e8d8",
  goldGlow: "rgba(184,154,106,0.12)",
  goldGlow2: "rgba(184,154,106,0.06)",
  // Type
  ink: "#1a1714",
  ink2: "#3a3530",
  muted: "#7a6e62",
  faint: "#b0a090",
  placeholder: "#cfc5b8",
  // Border
  line: "#ede8e0",
  lineStrong: "#ddd0be",
  // Semantic
  green: "#16a34a",
  greenBg: "rgba(22,163,74,0.08)",
  red: "#dc2626",
  redBg: "rgba(220,38,38,0.08)",
  blue: "#2563eb",
  blueBg: "rgba(37,99,235,0.08)",
  amber: "#d97706",
  amberBg: "rgba(217,119,6,0.08)",
  // Font
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'Montserrat', sans-serif",
}

// ─── Data types ───────────────────────────────────────────────────────────────

interface StatCard {
  label: string; value: string | number
  sub: string; delta?: string; deltaUp?: boolean
  icon: string; accent?: boolean
}

interface BarberKPI {
  name: string; role: string
  revenue: number; bookings: number; done: number
  occupancy: number; retention: number; rating: number
}

interface WeekDay { day: string; revenue: number; bookings: number }
interface ServiceShare { name: string; pct: number; revenue: number; color: string }
interface HeatRow { name: string; short: string; data: number[] }
interface RetailItem { name: string; cat: string; sold: number; revenue: number; margin: number }
interface CohortItem { month: string; rate: number; note: string }

// ─── Mock data ────────────────────────────────────────────────────────────────

const WEEK: WeekDay[] = [
  { day: "T2", revenue: 4_200_000, bookings: 19 },
  { day: "T3", revenue: 5_850_000, bookings: 26 },
  { day: "T4", revenue: 4_900_000, bookings: 22 },
  { day: "T5", revenue: 6_300_000, bookings: 28 },
  { day: "T6", revenue: 7_100_000, bookings: 32 },
  { day: "T7", revenue: 8_900_000, bookings: 41 },
  { day: "CN", revenue: 6_400_000, bookings: 30 },
]

const BARBERS: BarberKPI[] = [
  { name: "Michel Brown", role: "Master Barber", revenue: 6_800_000, bookings: 28, done: 24, occupancy: 92, retention: 88, rating: 4.9 },
  { name: "Jonathan Smith", role: "Senior Barber", revenue: 4_500_000, bookings: 22, done: 19, occupancy: 85, retention: 79, rating: 4.8 },
  { name: "Adam Castellon", role: "Senior Barber", revenue: 4_100_000, bookings: 19, done: 16, occupancy: 78, retention: 82, rating: 4.7 },
  { name: "Jack Tosan", role: "Junior Barber", revenue: 3_000_000, bookings: 15, done: 12, occupancy: 70, retention: 65, rating: 4.6 },
]

const SERVICES: ServiceShare[] = [
  { name: "Royal Treatment", pct: 45, revenue: 8_200_000, color: C.gold },
  { name: "Classic Cut Combo", pct: 32, revenue: 5_900_000, color: C.goldMid },
  { name: "Cạo râu & Skincare", pct: 14, revenue: 2_600_000, color: C.goldLt },
  { name: "Dịch vụ khác", pct: 9, revenue: 1_700_000, color: C.placeholder },
]

const HEATMAP_HOURS = ["9h", "10h", "11h", "13h", "14h", "15h", "17h", "18h", "19h", "20h"]
const HEATMAP: HeatRow[] = [
  { name: "Thứ Hai", short: "T2", data: [28, 45, 52, 30, 48, 62, 75, 80, 70, 50] },
  { name: "Thứ Ba", short: "T3", data: [35, 50, 58, 40, 55, 68, 80, 85, 78, 60] },
  { name: "Thứ Tư", short: "T4", data: [30, 42, 55, 35, 50, 65, 72, 78, 65, 48] },
  { name: "Thứ Năm", short: "T5", data: [42, 58, 65, 50, 62, 75, 85, 90, 82, 65] },
  { name: "Thứ Sáu", short: "T6", data: [55, 68, 75, 60, 72, 85, 92, 95, 90, 78] },
  { name: "Thứ Bảy", short: "T7", data: [75, 88, 92, 80, 88, 95, 98, 100, 98, 90] },
  { name: "Chủ Nhật", short: "CN", data: [80, 92, 95, 85, 90, 95, 95, 98, 95, 88] },
]

const RETAIL: RetailItem[] = [
  { name: "Premium Matte Pomade", cat: "Styling", sold: 142, revenue: 4_970_000, margin: 45 },
  { name: "Beard Conditioning Oil", cat: "Grooming", sold: 88, revenue: 3_080_000, margin: 50 },
  { name: "Sea Salt Texturizing Spray", cat: "Styling", sold: 64, revenue: 1_600_000, margin: 40 },
  { name: "Luxury Shaving Cream", cat: "Shaving", sold: 45, revenue: 1_350_000, margin: 55 },
]

const COHORT: CohortItem[] = [
  { month: "T2 / 2026", rate: 72, note: "Sau Tết, giảm nhẹ theo mùa" },
  { month: "T3 / 2026", rate: 75, note: "Re-engagement campaign" },
  { month: "T4 / 2026", rate: 78.5, note: "Loyalty points tối ưu" },
  { month: "T5 / 2026", rate: 81.2, note: "Đỉnh tăng trưởng Q2" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const vnd = (n: number) =>
  n >= 1_000_000
    ? (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
    : n >= 1_000
      ? (n / 1_000).toFixed(0) + "k"
      : String(n)

const vndFull = (n: number) => n.toLocaleString("vi-VN") + " đ"

function initials(s: string) {
  return s.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase()
}

// ─── Sparkline SVG ────────────────────────────────────────────────────────────

function Spark({ data, color = C.gold, h = 32 }: { data: number[]; color?: string; h?: number }) {
  const W = 80
  const max = Math.max(...data), min = Math.min(...data)
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: h - 2 - ((v - min) / (max - min || 1)) * (h - 4),
  }))
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("")
  const area = `${line}L${W},${h}L0,${h}Z`
  return (
    <svg viewBox={`0 0 ${W} ${h}`} width={W} height={h} style={{ overflow: "visible", display: "block" }}>
      <path d={area} fill={color} fillOpacity={0.1} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts.at(-1)!.x} cy={pts.at(-1)!.y} r="2.5" fill={color} />
    </svg>
  )
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({ data, activeIdx }: { data: WeekDay[]; activeIdx: number }) {
  const maxRev = Math.max(...data.map(d => d.revenue))
  return (
    <div className="flex items-end gap-2 h-36">
      {data.map((d, i) => {
        const pct = (d.revenue / maxRev) * 100
        const isActive = i === activeIdx
        return (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group relative">
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none z-10"
              style={{ transition: "opacity 0.15s" }}>
              <div className="px-2.5 py-1.5 text-[10px] whitespace-nowrap shadow-lg"
                style={{ background: C.ink, color: "#fff", fontFamily: C.sans, borderRadius: 2 }}>
                <div className="font-bold">{vnd(d.revenue)} đ</div>
                <div style={{ color: C.goldLt }}>{d.bookings} lịch</div>
              </div>
            </div>
            {/* Bar */}
            <div className="w-full relative flex items-end" style={{ height: "100%" }}>
              <div className="w-full absolute bottom-0"
                style={{
                  height: `${pct}%`,
                  background: isActive
                    ? `linear-gradient(180deg,${C.goldLt} 0%,${C.gold} 100%)`
                    : `linear-gradient(180deg,${C.goldPale} 0%,${C.goldGlow2.replace("0.06", "0.3")} 100%)`,
                  border: `1px solid ${isActive ? C.gold : C.line}`,
                  transition: "all 0.3s",
                  minHeight: 4,
                }} />
            </div>
            <span className="text-[10px] font-bold"
              style={{ fontFamily: C.sans, color: isActive ? C.gold : C.faint }}>
              {d.day}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function DonutChart({ segments }: { segments: ServiceShare[] }) {
  const size = 120, cx = 60, cy = 60, r = 44, inner = 28
  let cursor = -90 // start from top
  const arcs = segments.map(s => {
    const deg = (s.pct / 100) * 360
    const start = cursor; cursor += deg
    const toRad = (d: number) => (d * Math.PI) / 180
    const x1 = cx + r * Math.cos(toRad(start))
    const y1 = cy + r * Math.sin(toRad(start))
    const x2 = cx + r * Math.cos(toRad(start + deg))
    const y2 = cy + r * Math.sin(toRad(start + deg))
    const xi1 = cx + inner * Math.cos(toRad(start))
    const yi1 = cy + inner * Math.sin(toRad(start))
    const xi2 = cx + inner * Math.cos(toRad(start + deg))
    const yi2 = cy + inner * Math.sin(toRad(start + deg))
    const large = deg > 180 ? 1 : 0
    return {
      d: `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${xi2.toFixed(2)},${yi2.toFixed(2)} A${inner},${inner} 0 ${large},0 ${xi1.toFixed(2)},${yi1.toFixed(2)} Z`,
      color: s.color,
    }
  })
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {arcs.map((a, i) => (
        <path key={i} d={a.d} fill={a.color} stroke={C.surface} strokeWidth="1.5" />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontFamily: C.sans, fontSize: 9, fill: C.faint, fontWeight: 600, letterSpacing: 1 }}>DOANH THU</text>
      <text x={cx} y={cy + 8} textAnchor="middle" style={{ fontFamily: C.serif, fontSize: 14, fill: C.ink, fontWeight: 400 }}>Tháng</text>
    </svg>
  )
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────

function Heatmap({ rows }: { rows: HeatRow[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 580 }}>
        {/* Header */}
        <div className="flex gap-1 mb-1.5 pl-10">
          {HEATMAP_HOURS.map(h => (
            <div key={h} className="flex-1 text-center text-[9px] font-bold"
              style={{ fontFamily: C.sans, color: C.faint, letterSpacing: "0.5px" }}>{h}</div>
          ))}
        </div>
        {/* Rows */}
        {rows.map(row => (
          <div key={row.short} className="flex gap-1 mb-1 items-center">
            <div className="w-9 text-right text-[10px] font-semibold pr-2 shrink-0"
              style={{ fontFamily: C.sans, color: C.muted }}>{row.short}</div>
            {row.data.map((v, i) => {
              const alpha = 0.06 + (v / 100) * 0.94
              const textDark = v < 50
              return (
                <div key={i} className="flex-1 h-8 flex items-center justify-center text-[9px] font-bold group relative"
                  style={{
                    background: `rgba(184,154,106,${alpha.toFixed(2)})`,
                    color: textDark ? C.goldMid : "#fff",
                    border: `1px solid ${C.line}`,
                    transition: "transform 0.15s",
                    cursor: "default",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}>
                  {v}%
                </div>
              )
            })}
          </div>
        ))}
        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pl-10">
          {[["Thấp", "0.06"], ["Trung bình", "0.35"], ["Cao", "0.65"], ["Đỉnh tải", "1"]].map(([label, alpha]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 border" style={{ display: "inline-block", background: `rgba(184,154,106,${alpha})`, borderColor: C.line }} />
              <span className="text-[9px]" style={{ fontFamily: C.sans, color: C.faint }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function Card({ title, subtitle, action, children, noPad, className = "" }:
  { title?: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; noPad?: boolean; className?: string }
) {
  return (
    <div className={`flex flex-col ${className}`}
      style={{ background: C.surface, border: `1px solid ${C.line}` }}>
      {title && (
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b"
          style={{ borderColor: C.line }}>
          <div>
            <h2 className="text-[10px] font-bold tracking-[2px] uppercase"
              style={{ fontFamily: C.sans, color: C.muted }}>{title}</h2>
            {subtitle && (
              <p className="text-[11px] mt-0.5" style={{ fontFamily: C.sans, color: C.faint }}>{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={noPad ? "flex-1" : "p-5 flex-1"}>
        {children}
      </div>
    </div>
  )
}

// ─── KPI stat tile ────────────────────────────────────────────────────────────

function KpiTile({ s }: { s: StatCard }) {
  const weekData = WEEK.map(d => d.revenue)
  return (
    <div className="p-5 flex flex-col gap-3 relative overflow-hidden group"
      style={{
        background: s.accent ? C.surfaceAlt : C.surface,
        border: `1px solid ${s.accent ? C.lineStrong : C.line}`,
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = C.goldLt
        el.style.boxShadow = `0 4px 20px ${C.goldGlow}`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = s.accent ? C.lineStrong : C.line
        el.style.boxShadow = "none"
      }}>
      {s.accent && (
        <div className="absolute top-0 left-0 w-full h-[2px]"
          style={{ background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
      )}
      <div className="flex items-start justify-between">
        <p className="text-[9px] font-bold tracking-[2px] uppercase"
          style={{ fontFamily: C.sans, color: C.muted }}>{s.label}</p>
        <span className="text-[16px]" style={{ color: s.accent ? C.gold : C.placeholder }}>
          <i className={`ti ${s.icon}`} aria-hidden />
        </span>
      </div>
      <div>
        <p className="text-[30px] font-light leading-none"
          style={{ fontFamily: C.serif, color: C.ink, letterSpacing: "-1px" }}>{s.value}</p>
        {s.delta && (
          <p className="text-[10px] mt-1 font-semibold flex items-center gap-1"
            style={{ fontFamily: C.sans, color: s.deltaUp ? C.green : C.red }}>
            {s.deltaUp ? "↑" : "↓"} {s.delta}
          </p>
        )}
        <p className="text-[10px] mt-1" style={{ fontFamily: C.sans, color: C.faint }}>{s.sub}</p>
      </div>
      <div className="mt-auto">
        <Spark data={weekData} color={s.accent ? C.gold : C.goldLt} />
      </div>
    </div>
  )
}

// ─── Barber row ───────────────────────────────────────────────────────────────

function BarberRow({ b, rank, max }: { b: BarberKPI; rank: number; max: number }) {
  const pct = (b.revenue / max) * 100
  const rankColor = rank === 1 ? C.gold : rank === 2 ? C.goldMid : C.faint
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0"
      style={{ borderColor: C.line }}>
      <div className="w-5 text-center shrink-0 text-[13px] font-light"
        style={{ fontFamily: C.serif, color: rankColor }}>{rank}</div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{ background: C.goldGlow, color: C.gold, fontFamily: C.sans, border: `1px solid ${C.goldPale}` }}>
        {initials(b.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-[12px] font-semibold truncate"
            style={{ fontFamily: C.sans, color: C.ink }}>{b.name}</p>
          <span className="text-[9px] px-1.5 py-0.5 font-bold"
            style={{ fontFamily: C.sans, background: C.goldGlow, color: C.muted }}>
            {b.role.split(" ")[0]}
          </span>
        </div>
        {/* Revenue bar */}
        <div className="h-[3px] rounded-full overflow-hidden" style={{ background: C.line }}>
          <div className="h-full rounded-full"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg,${C.gold},${C.goldLt})`, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
        </div>
      </div>
      {/* Stats */}
      <div className="hidden sm:grid grid-cols-3 gap-3 text-right shrink-0">
        {[
          { label: "Doanh thu", val: vnd(b.revenue) + " đ" },
          { label: "Lấp đầy", val: b.occupancy + "%" },
          { label: "Giữ chân", val: b.retention + "%" },
        ].map(x => (
          <div key={x.label}>
            <p className="text-[9px]" style={{ fontFamily: C.sans, color: C.faint }}>{x.label}</p>
            <p className="text-[12px] font-bold" style={{ fontFamily: C.sans, color: C.ink2 }}>{x.val}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 shrink-0 ml-2">
        <span className="text-[10px]" style={{ color: C.amber }}>★</span>
        <span className="text-[11px] font-bold" style={{ fontFamily: C.sans, color: C.ink2 }}>{b.rating}</span>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type TF = "today" | "7days" | "month"

const STATS: Record<TF, StatCard[]> = {
  today: [
    { label: "Doanh thu hôm nay", value: "1.14M", sub: "Mục tiêu 1.2M đ", delta: "5% vs hôm qua", deltaUp: true, icon: "ti-cash", accent: true },
    { label: "Ghế trống hiện tại", value: "2 / 4", sub: "Giờ cao điểm 17h–20h", icon: "ti-armchair" },
    { label: "Tỷ lệ hủy lịch", value: "4.1%", sub: "Target ≤ 5%", delta: "2% vs hôm qua", deltaUp: false, icon: "ti-alert-triangle" },
    { label: "AOV trung bình", value: "285k đ", sub: "Mục tiêu 300k đ", delta: "15k vs tuần trước", deltaUp: true, icon: "ti-receipt" },
  ],
  "7days": [
    { label: "Doanh thu 7 ngày", value: "43.65M", sub: "7 ngày gần nhất", delta: "8% vs tuần trước", deltaUp: true, icon: "ti-cash", accent: true },
    { label: "Lượt khách", value: "198", sub: "18 khách lần đầu", delta: "12% vs tuần trước", deltaUp: true, icon: "ti-users" },
    { label: "Lấp đầy trung bình", value: "79.5%", sub: "Hiệu suất ghế", delta: "3.2% cải thiện", deltaUp: true, icon: "ti-chart-pie" },
    { label: "Đánh giá 5 sao", value: "94.2%", sub: "Chuẩn Luxury tier", delta: "1.4% cải thiện", deltaUp: true, icon: "ti-star" },
  ],
  month: [
    { label: "Doanh thu tháng", value: "18.4M", sub: "Mục tiêu 20M đ", delta: "12% vs tháng trước", deltaUp: true, icon: "ti-cash", accent: true },
    { label: "Khách hàng mới", value: "38", sub: "So với 30 tháng trước", delta: "8 khách mới thêm", deltaUp: true, icon: "ti-user-plus" },
    { label: "Retention Rate", value: "78.5%", sub: "Mục tiêu 80%", delta: "3.5% cải thiện", deltaUp: true, icon: "ti-refresh" },
    { label: "AOV trung bình", value: "320k đ", sub: "Mục tiêu Q2: 350k đ", delta: "20k vs tháng trước", deltaUp: true, icon: "ti-trending-up" },
  ],
}

const EXEC_STATS: StatCard[] = [
  { label: "Biên lợi nhuận ròng", value: "34.2%", sub: "Chi phí vận hành tối ưu", delta: "2.1% vs Q1", deltaUp: true, icon: "ti-percentage" },
  { label: "Tỷ lệ bán kèm Retail", value: "24.5%", sub: "24 / 100 hóa đơn", delta: "3.8% cải thiện", deltaUp: true, icon: "ti-shopping-bag" },
  { label: "LTV / Khách hàng", value: "2.4M đ", sub: "Tần suất: 4.2 lần/năm", delta: "180k vs năm ngoái", deltaUp: true, icon: "ti-coin" },
  { label: "CAC chi phí kiếm khách", value: "85k đ", sub: "Giảm qua Word-of-mouth", delta: "12% giảm", deltaUp: false, icon: "ti-user-check" },
]

const STRATEGIC = [
  { href: "/admin/reports/finance", icon: "ti-file-analytics", label: "Xuất báo cáo tài chính" },
  { href: "/admin/marketing/promotions", icon: "ti-ticket", label: "Cấu hình khuyến mãi" },
  { href: "/admin/barbers/schedule", icon: "ti-calendar-time", label: "Tối ưu lịch trực barber" },
  { href: "/admin/inventory", icon: "ti-package", label: "Quản lý kho sản phẩm" },
]

export default function AdminDashboardPage() {
  const [tf, setTf] = useState<TF>("month")
  const [chartDay, setChartDay] = useState(5)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const maxBarber = Math.max(...BARBERS.map(b => b.revenue))
  const weekTotal = WEEK.reduce((s, d) => s + d.revenue, 0)
  const weekBookings = WEEK.reduce((s, d) => s + d.bookings, 0)

  const dateStr = mounted
    ? new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })
    : ""
  const { isReady } = useAdminGuard()

  if (!isReady) return <div>Đang kiểm tra quyền truy cập...</div>
  if (!mounted) return null

  return (
    <>
      {/* Fonts + icons */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" rel="stylesheet" />

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fu  { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        .fu1 { animation-delay: 0.04s } .fu2 { animation-delay: 0.08s }
        .fu3 { animation-delay: 0.12s } .fu4 { animation-delay: 0.16s }
        .fu5 { animation-delay: 0.20s } .fu6 { animation-delay: 0.24s }
        .fu7 { animation-delay: 0.28s } .fu8 { animation-delay: 0.32s }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:4px; height:4px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:#ddd0be; border-radius:2px }
      `}</style>

      <div className="flex flex-col flex-1 min-h-screen" style={{ background: C.bg }}>

        {/* ══════ Header ══════ */}
        <header className="bg-white border-b flex flex-col md:flex-row md:items-center md:justify-between px-8 py-5 gap-4 shrink-0"
          style={{ borderColor: C.line }}>
          <div>
            <p className="text-[10px] font-bold tracking-[3px] uppercase mb-1"
              style={{ fontFamily: C.sans, color: C.faint }}>ThienBinh Barbershop · Analytics</p>
            <h1 className="text-[26px] font-light leading-tight"
              style={{ fontFamily: C.serif, color: C.ink, letterSpacing: "-0.5px" }}>
              Báo cáo Chiến lược & Hiệu suất
            </h1>
            <p className="text-[11px] mt-0.5 capitalize" style={{ fontFamily: C.sans, color: C.faint }}>
              {dateStr}
            </p>
          </div>

          {/* Timeframe switcher */}
          <div className="flex items-center gap-3">
            <div className="flex p-1 gap-0.5" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
              {([
                { key: "today", label: "Hôm nay" },
                { key: "7days", label: "7 Ngày" },
                { key: "month", label: "Tháng" },
              ] as { key: TF; label: string }[]).map(t => (
                <button key={t.key} onClick={() => setTf(t.key)}
                  className="px-4 py-1.5 text-[10px] font-bold tracking-[1.5px] uppercase"
                  style={{
                    fontFamily: C.sans,
                    background: tf === t.key ? C.gold : "transparent",
                    color: tf === t.key ? "#fff" : C.muted,
                    transition: "all 0.2s",
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            <Link href="/admin/reports"
              className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold tracking-[1.5px] uppercase"
              style={{ fontFamily: C.sans, border: `1px solid ${C.line}`, color: C.muted, background: C.surface, transition: "all 0.2s" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = C.gold
                  ; (e.currentTarget as HTMLElement).style.color = C.gold
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = C.line
                  ; (e.currentTarget as HTMLElement).style.color = C.muted
              }}>
              <i className="ti ti-download" style={{ fontSize: 13 }} aria-hidden />
              Xuất báo cáo
            </Link>
          </div>
        </header>

        {/* ══════ Body ══════ */}
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">

          {/* ── R1: Primary KPIs ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {STATS[tf].map((s, i) => (
              <div key={i} className={`fu fu${i + 1}`}>
                <KpiTile s={s} />
              </div>
            ))}
          </div>

          {/* ── R2: Revenue chart + Service mix + Donut ── */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

            {/* Bar chart — 7 cols */}
            <div className="xl:col-span-7 fu fu5">
              <Card title="Doanh thu & Lịch hẹn 7 ngày" subtitle={`Tổng: ${vnd(weekTotal)} đ · ${weekBookings} lịch`}
                action={
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[9px] font-bold uppercase" style={{ fontFamily: C.sans, color: C.green }}>↑ 8%</span>
                    <span className="text-[9px]" style={{ fontFamily: C.sans, color: C.faint }}>vs tuần trước</span>
                  </div>
                }>
                <BarChart data={WEEK} activeIdx={chartDay} />
                {/* Day selector pills */}
                <div className="flex gap-1 mt-3">
                  {WEEK.map((d, i) => (
                    <button key={d.day} onClick={() => setChartDay(i)}
                      className="flex-1 py-1 text-[9px] font-bold"
                      style={{
                        fontFamily: C.sans,
                        background: chartDay === i ? C.gold : C.bg,
                        color: chartDay === i ? "#fff" : C.faint,
                        border: `1px solid ${chartDay === i ? C.gold : C.line}`,
                        transition: "all 0.2s",
                      }}>
                      {d.day}
                    </button>
                  ))}
                </div>
                {/* Selected day detail */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: C.line }}>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[1.5px]" style={{ fontFamily: C.sans, color: C.faint }}>
                      {WEEK[chartDay].day} — Doanh thu
                    </p>
                    <p className="text-[22px] font-light" style={{ fontFamily: C.serif, color: C.ink }}>
                      {vndFull(WEEK[chartDay].revenue)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-[1.5px]" style={{ fontFamily: C.sans, color: C.faint }}>Lịch hẹn</p>
                    <p className="text-[22px] font-light" style={{ fontFamily: C.serif, color: C.gold }}>
                      {WEEK[chartDay].bookings}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Service mix — 5 cols */}
            <div className="xl:col-span-5 fu fu6">
              <Card title="Cơ cấu doanh thu dịch vụ" subtitle="Tháng hiện tại">
                <div className="flex items-center gap-5">
                  <DonutChart segments={SERVICES} />
                  <div className="flex-1 space-y-2.5">
                    {SERVICES.map((s, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                            <span className="text-[10px] font-semibold truncate max-w-[120px]"
                              style={{ fontFamily: C.sans, color: C.ink2 }}>{s.name}</span>
                          </div>
                          <span className="text-[10px] font-bold" style={{ fontFamily: C.sans, color: C.ink }}>{s.pct}%</span>
                        </div>
                        <div className="h-[2px] rounded-full overflow-hidden" style={{ background: C.line }}>
                          <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                        </div>
                        <p className="text-[9px] text-right mt-0.5" style={{ fontFamily: C.sans, color: C.faint }}>
                          {vnd(s.revenue)} đ
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* ── R3: Executive financials ── */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-4" style={{ background: C.gold }} />
              <h2 className="text-[10px] font-bold tracking-[2.5px] uppercase" style={{ fontFamily: C.sans, color: C.muted }}>
                Chỉ số tài chính điều hành (Executive KPIs)
              </h2>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {EXEC_STATS.map((s, i) => (
                <div key={i} className={`fu fu${i + 1}`}>
                  <KpiTile s={s} />
                </div>
              ))}
            </div>
          </div>

          {/* ── R4: Barber leaderboard + Strategic actions ── */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

            {/* Barbers — 8 cols */}
            <div className="xl:col-span-8 fu fu5">
              <Card title="Hiệu suất Nhân sự (KPI Leaderboard)"
                subtitle="Doanh thu · Lấp đầy ghế · Giữ chân khách · Đánh giá">
                <div>
                  {BARBERS.map((b, i) => (
                    <BarberRow key={b.name} b={b} rank={i + 1} max={maxBarber} />
                  ))}
                </div>
              </Card>
            </div>

            {/* Strategic — 4 cols */}
            <div className="xl:col-span-4 fu fu6">
              <Card title="Thao tác chiến lược">
                <div className="space-y-2">
                  {STRATEGIC.map(q => (
                    <Link key={q.href} href={q.href}
                      className="flex items-center gap-3 px-3 py-3 group"
                      style={{ border: `1px solid ${C.line}`, background: C.bg, transition: "all 0.2s" }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = C.gold
                        el.style.background = C.goldGlow
                        el.style.transform = "translateX(3px)"
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = C.line
                        el.style.background = C.bg
                        el.style.transform = "translateX(0)"
                      }}>
                      <div className="w-7 h-7 flex items-center justify-center shrink-0"
                        style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.gold }}>
                        <i className={`ti ${q.icon}`} style={{ fontSize: 14 }} aria-hidden />
                      </div>
                      <span className="text-[11px] font-semibold flex-1"
                        style={{ fontFamily: C.sans, color: C.ink2 }}>{q.label}</span>
                      <i className="ti ti-chevron-right text-[11px] opacity-0 group-hover:opacity-100"
                        style={{ color: C.gold, transition: "opacity 0.15s" }} aria-hidden />
                    </Link>
                  ))}
                </div>

                {/* Revenue split summary */}
                <div className="mt-4 pt-4 border-t" style={{ borderColor: C.line }}>
                  <p className="text-[9px] font-bold uppercase tracking-[2px] mb-3"
                    style={{ fontFamily: C.sans, color: C.faint }}>Phân bổ doanh thu tháng</p>
                  <div className="flex gap-0.5 h-2 rounded-full overflow-hidden mb-3">
                    {SERVICES.map(s => (
                      <div key={s.name} style={{ width: `${s.pct}%`, background: s.color }} />
                    ))}
                  </div>
                  {SERVICES.map(s => (
                    <div key={s.name} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color, display: "inline-block" }} />
                        <span className="text-[10px]" style={{ fontFamily: C.sans, color: C.muted }}>{s.name}</span>
                      </div>
                      <span className="text-[10px] font-bold" style={{ fontFamily: C.sans, color: C.ink2 }}>
                        {s.pct}% · {vnd(s.revenue)} đ
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* ── R5: Heatmap + Retail ── */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

            {/* Heatmap — 8 cols */}
            <div className="xl:col-span-8 fu fu5">
              <Card title="Mật độ lấp đầy ghế theo khung giờ"
                subtitle="Phân tích peak-hours · Đơn vị % lấp đầy">
                <Heatmap rows={HEATMAP} />
              </Card>
            </div>

            {/* Retail — 4 cols */}
            <div className="xl:col-span-4 fu fu6">
              <Card title="Hiệu suất bán kèm (Retail)" noPad>
                <div className="divide-y" style={{ borderColor: C.line }}>
                  {RETAIL.map((r, i) => (
                    <div key={i} className="px-4 py-3 flex items-start gap-3 group"
                      style={{ transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.goldGlow2}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                      <div className="w-6 text-center shrink-0 text-[13px] font-light mt-0.5"
                        style={{ fontFamily: C.serif, color: i < 2 ? C.gold : C.faint }}>{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold truncate" style={{ fontFamily: C.sans, color: C.ink }}>{r.name}</p>
                        <p className="text-[9px] font-bold uppercase tracking-[1px]" style={{ fontFamily: C.sans, color: C.faint }}>{r.cat} · {r.sold} đã bán</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[12px] font-bold" style={{ fontFamily: C.sans, color: C.gold }}>{vnd(r.revenue)} đ</p>
                        <p className="text-[9px] font-bold" style={{ fontFamily: C.sans, color: C.green }}>Biên {r.margin}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: C.line }}>
                  <span className="text-[10px] font-bold uppercase tracking-[1px]" style={{ fontFamily: C.sans, color: C.muted }}>Tổng doanh thu bán lẻ</span>
                  <span className="text-[14px] font-semibold" style={{ fontFamily: C.serif, color: C.gold }}>
                    {vnd(RETAIL.reduce((s, r) => s + r.revenue, 0))} đ
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {/* ── R6: Retention cohort ── */}
          <div className="fu fu7">
            <Card title="Chu kỳ sức khỏe thương hiệu — Retention Rate theo tháng"
              subtitle="Tỷ lệ khách hàng cũ quay lại · Mục tiêu Q2: 80%">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {COHORT.map((c, i) => {
                  const isLast = i === COHORT.length - 1
                  return (
                    <div key={i} className="p-4 relative overflow-hidden"
                      style={{
                        background: isLast ? C.surfaceAlt : C.surface,
                        border: `1px solid ${isLast ? C.lineStrong : C.line}`,
                      }}>
                      {isLast && (
                        <div className="absolute top-0 left-0 w-full h-[2px]"
                          style={{ background: `linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
                      )}
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-[9px] font-bold uppercase tracking-[2px]"
                          style={{ fontFamily: C.sans, color: C.faint }}>{c.month}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5"
                          style={{ fontFamily: C.sans, background: isLast ? C.goldGlow : C.bg, color: isLast ? C.gold : C.muted, border: `1px solid ${isLast ? C.goldLt : C.line}` }}>
                          {isLast ? "Current" : `#${i + 1}`}
                        </span>
                      </div>
                      <p className="text-[36px] font-light leading-none mb-1"
                        style={{ fontFamily: C.serif, color: isLast ? C.gold : C.ink, letterSpacing: "-1px" }}>
                        {c.rate}%
                      </p>
                      {/* Progress bar */}
                      <div className="h-[3px] rounded-full overflow-hidden mb-2" style={{ background: C.line }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${c.rate}%`, background: isLast ? `linear-gradient(90deg,${C.gold},${C.goldLt})` : C.goldLt, transition: "width 1s" }} />
                      </div>
                      <p className="text-[10px]" style={{ fontFamily: C.sans, color: C.faint }}>{c.note}</p>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="pt-4 pb-2 border-t flex items-center justify-between" style={{ borderColor: C.line }}>
            <p className="text-[10px]" style={{ fontFamily: C.sans, color: C.placeholder }}>
              Dữ liệu cập nhật: {dateStr}
            </p>
            <p className="text-[9px] tracking-[2px] uppercase" style={{ fontFamily: C.sans, color: C.goldLt }}>
              ThienBinh Barbershop · Admin Analytics v2
            </p>
          </div>

        </main>
      </div>
    </>
  )
}