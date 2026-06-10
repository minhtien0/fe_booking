"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
// TODO: Thay đổi đường dẫn này cho đúng với file apiFetch mà bạn đã setup
import { apiFetch } from "../../../lib/api"
import { useToast } from "../../../hooks/useToast"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type ServiceStatus = 1 | 0  // 1: Đang bán (active), 0: Tạm ẩn (inactive)
type ServiceType = "haircut" | "shaving" | "facial"

interface Service {
  id: number
  name: string
  type: ServiceType
  originalPrice: number    // Khớp với JSON: originalPrice
  duration: number    // phút
  description: string
  status: ServiceStatus // Khớp với JSON: 1 hoặc 0
  slug: string
  included?: string[]
}

interface ServiceFormData {
  name: string
  type: ServiceType
  originalPrice: string
  duration: string
  description: string
  status: "active" | "inactive" // Giữ dạng string để dễ quản lý UI Select
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<ServiceType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  haircut: {
    label: "Tạo kiểu tóc",
    color: "#b89a6a",
    bg: "rgba(184,154,106,0.1)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  shaving: {
    label: "Cạo râu",
    color: "#7c9885",
    bg: "rgba(124,152,133,0.1)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M6 4l6 7-6 7h12V4H6z" />
      </svg>
    ),
  },
  facial: {
    label: "Chăm sóc da",
    color: "#9b7a9b",
    bg: "rgba(155,122,155,0.1)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
      </svg>
    ),
  },
}

const EMPTY_FORM: ServiceFormData = {
  name: "", type: "haircut", originalPrice: "", duration: "", description: "", status: "active",
}

const fmt = (n: number) => (n ?? 0).toLocaleString("vi-VN") + "đ"

// ─────────────────────────────────────────────────────────────────────────────
// STATUS PILL
// ─────────────────────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: ServiceStatus }) {
  const isActive = status === 1
  return (
    <span
      className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{
        fontFamily: "'Montserrat',sans-serif",
        background: isActive ? "rgba(34,197,94,0.1)" : "rgba(156,163,175,0.12)",
        color: isActive ? "#16a34a" : "#9ca3af",
      }}
    >
      <span className="w-[5px] h-[5px] rounded-full"
        style={{ background: isActive ? "#22c55e" : "#9ca3af" }} />
      {isActive ? "Đang bán" : "Tạm ẩn"}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY BADGE
// ─────────────────────────────────────────────────────────────────────────────
function CategoryBadge({ type }: { type: ServiceType }) {
  const cfg = CATEGORY_CONFIG[type]
  if (!cfg) return null
  return (
    <span
      className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ fontFamily: "'Montserrat',sans-serif", background: cfg.bg, color: cfg.color }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM INPUT
// ─────────────────────────────────────────────────────────────────────────────
function Field({
  label, value, onChange, placeholder, type = "text", error, required,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; error?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-[6px]"
        style={{ color: "#9e8060", fontFamily: "'Montserrat',sans-serif" }}>
        {label}{required && <span style={{ color: "#b89a6a" }}> *</span>}
      </label>
      <input type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-[9px] text-[13px] border outline-none"
        style={{
          fontFamily: "'Montserrat',sans-serif",
          borderColor: error ? "#f87171" : "#ede8e0",
          color: "#1e1510", background: "#fff",
          transition: "border-color 0.15s",
        }}
        onFocus={e => (e.target.style.borderColor = "#b89a6a")}
        onBlur={e => (e.target.style.borderColor = error ? "#f87171" : "#ede8e0")}
      />
      {error && <p className="text-[11px] text-red-400 mt-1" style={{ fontFamily: "'Montserrat',sans-serif" }}>{error}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ServiceModal({
  mode, initial, onSave, onClose,
}: {
  mode: "add" | "edit"
  initial: ServiceFormData
  onSave: (data: ServiceFormData) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState<ServiceFormData>(initial)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({})

  const set = (k: keyof ServiceFormData) => (v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  const validate = () => {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = "Bắt buộc"
    if (!form.originalPrice.trim()) e.originalPrice = "Bắt buộc"
    else if (isNaN(+form.originalPrice)) e.originalPrice = "Phải là số"
    if (!form.duration.trim()) e.duration = "Bắt buộc"
    else if (isNaN(+form.duration)) e.duration = "Phải là số"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try { await onSave(form) }
    catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="w-full max-w-[560px] bg-white"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ebe3]">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-[#b89a6a]" />
            <h3 className="text-[17px] font-light text-[#1e1510]"
              style={{ fontFamily: "'Playfair Display',serif" }}>
              {mode === "add" ? "Thêm dịch vụ mới" : "Chỉnh sửa dịch vụ"}
            </h3>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a] hover:text-[#b89a6a]"
            style={{ transition: "all 0.15s" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <Field label="Tên dịch vụ" value={form.name} onChange={set("name")}
            placeholder="Cắt tóc tiêu chuẩn" error={errors.name} required />

          {/* Type selector */}
          <div>
            <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-[6px]"
              style={{ color: "#9e8060", fontFamily: "'Montserrat',sans-serif" }}>
              Danh mục <span style={{ color: "#b89a6a" }}>*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(CATEGORY_CONFIG) as [ServiceType, typeof CATEGORY_CONFIG[ServiceType]][]).map(([k, cfg]) => (
                <button key={k}
                  onClick={() => setForm(f => ({ ...f, type: k }))}
                  className="flex items-center gap-2 px-3 py-[9px] border text-[12px] font-medium transition-all"
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    borderColor: form.type === k ? cfg.color : "#ede8e0",
                    background: form.type === k ? cfg.bg : "#fff",
                    color: form.type === k ? cfg.color : "#9e8060",
                  }}>
                  <span style={{ color: form.type === k ? cfg.color : "#bbb" }}>{cfg.icon}</span>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Giá (đ)" value={form.originalPrice} onChange={set("originalPrice")}
              placeholder="120000" type="number" error={errors.originalPrice} required />
            <Field label="Thời gian (phút)" value={form.duration} onChange={set("duration")}
              placeholder="30" type="number" error={errors.duration} required />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-[6px]"
              style={{ color: "#9e8060", fontFamily: "'Montserrat',sans-serif" }}>
              Mô tả
            </label>
            <textarea value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="Mô tả ngắn về dịch vụ..."
              className="w-full px-3 py-[9px] text-[13px] border outline-none resize-none"
              style={{
                fontFamily: "'Montserrat',sans-serif",
                borderColor: "#ede8e0", color: "#1e1510",
                transition: "border-color 0.15s",
              }}
              onFocus={e => (e.target.style.borderColor = "#b89a6a")}
              onBlur={e => (e.target.style.borderColor = "#ede8e0")}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-[6px]"
              style={{ color: "#9e8060", fontFamily: "'Montserrat',sans-serif" }}>
              Trạng thái
            </label>
            <div className="flex gap-2">
              {([["active", "✓  Đang bán"], ["inactive", "✗  Tạm ẩn"]] as const).map(([val, lbl]) => (
                <button key={val}
                  onClick={() => setForm(f => ({ ...f, status: val }))}
                  className="flex-1 py-[9px] text-[12px] font-semibold border transition-all"
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    borderColor: form.status === val ? "#b89a6a" : "#ede8e0",
                    background: form.status === val ? "#fffaf4" : "#fff",
                    color: form.status === val ? "#b89a6a" : "#9e8060",
                  }}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button onClick={onClose}
            className="px-5 py-[9px] text-[12px] font-semibold border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a]"
            style={{ fontFamily: "'Montserrat',sans-serif", transition: "border-color 0.15s" }}>
            Huỷ
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-7 py-[9px] text-[12px] font-bold tracking-[1px] uppercase text-white disabled:opacity-50"
            style={{ fontFamily: "'Montserrat',sans-serif", background: "#b89a6a", transition: "opacity 0.15s" }}>
            {saving ? "Đang lưu..." : mode === "add" ? "Thêm mới" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRM
// ─────────────────────────────────────────────────────────────────────────────
function DeleteConfirm({ name, onConfirm, onClose }: {
  name: string; onConfirm: () => Promise<void>; onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="w-full max-w-[340px] bg-white p-6"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
        </div>
        <h3 className="text-center text-[16px] font-light text-[#1e1510] mb-1"
          style={{ fontFamily: "'Playfair Display',serif" }}>Xoá dịch vụ?</h3>
        <p className="text-center text-[12px] text-[#9e8060] mb-6"
          style={{ fontFamily: "'Montserrat',sans-serif" }}>
          <strong>{name}</strong> sẽ bị xoá vĩnh viễn.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-[9px] border border-[#ede8e0] text-[12px] font-semibold text-[#9e8060]"
            style={{ fontFamily: "'Montserrat',sans-serif" }}>Huỷ</button>
          <button
            onClick={async () => { setLoading(true); await onConfirm(); setLoading(false) }}
            disabled={loading}
            className="flex-1 py-[9px] text-[12px] font-bold text-white bg-red-500 disabled:opacity-50"
            style={{ fontFamily: "'Montserrat',sans-serif" }}>
            {loading ? "Đang xoá..." : "Xoá"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL PANEL
// ─────────────────────────────────────────────────────────────────────────────
function DetailPanel({ service, onClose, onEdit, onToggleStatus }: {
  service: Service | null
  onClose: () => void
  onEdit: (s: Service) => void
  onToggleStatus: (id: number) => void
}) {
  if (!service) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: "#f8f5f0" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d6cec4" strokeWidth="1.5" strokeLinecap="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <p className="text-[12px] text-[#bbb]" style={{ fontFamily: "'Montserrat',sans-serif" }}>
          Chọn dịch vụ để xem chi tiết
        </p>
      </div>
    )
  }

  const cfg = CATEGORY_CONFIG[service.type]

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ fontFamily: "'Montserrat',sans-serif" }}>
      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-[#f0ebe3] flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-[1.8px] uppercase text-[#b89a6a]">Chi tiết dịch vụ</p>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-[#bbb] hover:text-[#9e8060]"
          style={{ transition: "color 0.15s" }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Icon + name block */}
        <div className="px-5 py-5 border-b border-[#f8f5f0] flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
            style={{ background: cfg?.bg, color: cfg?.color }}>
            <div style={{ transform: "scale(1.7)" }}>{cfg?.icon}</div>
          </div>
          <p className="text-[15px] font-semibold text-[#1e1510] leading-snug mb-2 px-2">
            {service.name}
          </p>
          <CategoryBadge type={service.type} />
          <div className="mt-2"><StatusPill status={service.status} /></div>
        </div>

        {/* Info rows */}
        <div className="px-5 py-4 border-b border-[#f8f5f0]">
          <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#bbb] mb-3">Thông tin</p>
          {[
            ["ID", `#${service.id}`],
            ["Giá gốc", fmt(service.originalPrice)],
            ["Thời gian", `${service.duration} phút`],
          ].map(([label, val]) => (
            <div key={label} className="flex items-baseline justify-between py-[7px] border-b border-[#f8f5f0] last:border-0">
              <span className="text-[11px] text-[#9e8060]">{label}</span>
              <span className="text-[12px] font-semibold text-[#1e1510]">{val}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="px-5 py-4">
          <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#bbb] mb-2">Mô tả</p>
          <p className="text-[12px] text-[#6b5f54] leading-relaxed">{service.description || "—"}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 px-5 pb-5 pt-3 border-t border-[#f0ebe3] flex flex-col gap-2">
        <button onClick={() => onEdit(service)}
          className="w-full py-[9px] text-[12px] font-bold tracking-[1px] uppercase text-white"
          style={{ background: "#b89a6a", fontFamily: "'Montserrat',sans-serif" }}
          onMouseOver={e => (e.currentTarget.style.background = "#a08455")}
          onMouseOut={e => (e.currentTarget.style.background = "#b89a6a")}>
          Chỉnh sửa
        </button>
        <button onClick={() => onToggleStatus(service.id)}
          className="w-full py-[9px] text-[12px] font-semibold border transition-all"
          style={{
            fontFamily: "'Montserrat',sans-serif",
            borderColor: service.status === 1 ? "#e5e7eb" : "#b89a6a",
            color: service.status === 1 ? "#9ca3af" : "#b89a6a",
          }}>
          {service.status === 1 ? "Tạm ẩn dịch vụ" : "Kích hoạt lại"}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent = "#b89a6a" }: {
  label: string; value: string | number; icon: React.ReactNode; accent?: string
}) {
  return (
    <div className="bg-white p-5 flex items-center gap-4 animate-fadeIn" style={{ border: "1px solid #f0ebe3" }}>
      <div className="w-11 h-11 flex items-center justify-center rounded-sm shrink-0"
        style={{ background: `${accent}15`, color: accent }}>
        {icon}
      </div>
      <div>
        <p className="text-[22px] font-light text-[#1e1510]"
          style={{ fontFamily: "'Playfair Display',serif" }}>{value}</p>
        <p className="text-[11px] text-[#9e8060]" style={{ fontFamily: "'Montserrat',sans-serif" }}>{label}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminServicesPage() {
  const toast = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<"all" | ServiceType>("all")
  const [filterStatus, setFilterStatus] = useState<"all" | 1 | 0>("all")
  const [sortBy, setSortBy] = useState<"name" | "originalPrice" | "duration">("name")

  const [detail, setDetail] = useState<Service | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<Service | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  // Fetch danh sách dịch vụ từ API
  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiFetch<Service[]>("/services")
      setServices(res || [])
    } catch (error) {
      console.error("Lỗi khi tải danh sách dịch vụ:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  // ── Derived ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = services
    if (search) list = list.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== "all") list = list.filter(s => s.type === filterType)
    if (filterStatus !== "all") list = list.filter(s => s.status === filterStatus)

    return [...list].sort((a, b) => {
      if (sortBy === "name") return (a.name ?? "").localeCompare(b.name ?? "")
      if (sortBy === "originalPrice") return (b.originalPrice ?? 0) - (a.originalPrice ?? 0)
      if (sortBy === "duration") return (b.duration ?? 0) - (a.duration ?? 0)
      return 0
    })
  }, [services, search, filterType, filterStatus, sortBy])

  const activeCount = services.filter(s => s.status === 1).length
  const inactiveCount = services.filter(s => s.status === 0).length

  // ── CRUD Tích hợp API ──────────────────────────────────────────────
  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD") // Khử dấu tiếng Việt chuẩn Unicode
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "") // Xóa ký tự đặc biệt
      .replace(/(\s+)/g, "-") // Thay khoảng trắng bằng dấu -
      .replace(/-+/g, "-") // Thu gọn nhiều dấu - liên tiếp
      .replace(/^-+|-+$/g, ""); // Cắt dấu - ở đầu và cuối chuỗi
  }

  const handleAdd = useCallback(async (form: ServiceFormData) => {
    try {
      await apiFetch("/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          slug: generateSlug(form.name),
          type: form.type,
          originalPrice: +form.originalPrice,
          duration: +form.duration,
          description: form.description,
          status: form.status === "active" ? 1 : 0,
        })
      })

      await fetchServices()
      toast.success(`Đã thêm dịch vụ "${form.name}" thành công!`)
      setShowAdd(false)
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || error?.message;

      toast.error(
        typeof serverMessage === "string"
          ? serverMessage
          : "Không thể thêm dịch vụ. Vui lòng kiểm tra lại."
      )
      console.error("Lỗi thêm dịch vụ:", error)
    }
  }, [fetchServices, toast])

  const handleEdit = useCallback(async (form: ServiceFormData) => {
    if (!editTarget) return
    try {
      await apiFetch(`/services/${editTarget.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          originalPrice: +form.originalPrice,
          duration: +form.duration,
          description: form.description,
          status: form.status === "active" ? 1 : 0,
        })
      })
      await fetchServices()

      if (detail?.id === editTarget.id) {
        setDetail(d => d ? {
          ...d,
          name: form.name,
          type: form.type,
          originalPrice: +form.originalPrice,
          duration: +form.duration,
          description: form.description,
          status: form.status === "active" ? 1 : 0
        } : d)
      }
      setEditTarget(null)
      toast.success(`Đã cập nhật dịch vụ "${form.name}" thành công!`)

    } catch (error) {
      toast.error("Cập nhật thất bại. Vui lòng kiểm tra lại.")
      console.error("Lỗi cập nhật dịch vụ:", error)
    }
  }, [editTarget, detail, fetchServices, toast])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    const deletedName = deleteTarget.name
    try {
      await apiFetch(`/services/${deleteTarget.id}`, {
        method: "DELETE"
      })
      await fetchServices()
      if (detail?.id === deleteTarget.id) setDetail(null)
      setDeleteTarget(null)
      toast.success(`Đã xóa vĩnh viễn dịch vụ "${deletedName}".`)
    } catch (error) {
      toast.error("Không thể xóa dịch vụ này. Vui lòng thử lại.")
      console.error("Lỗi xóa dịch vụ:", error)
    }
  }, [deleteTarget, detail, fetchServices, toast])

  const handleToggleStatus = useCallback(async (id: number) => {
    const targetService = services.find(s => s.id === id)
    if (!targetService) return

    const nextStatus = targetService.status === 1 ? 0 : 1
    try {
      await apiFetch(`/services/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus })
      })
      await fetchServices()
      setDetail(d => d?.id === id ? { ...d, status: nextStatus } : d)
      if (nextStatus === 1) {
        toast.success(`Đã kích hoạt hiển thị dịch vụ "${targetService.name}".`)
      } else {
        toast.info(`Đã tạm ẩn dịch vụ "${targetService.name}".`)
      }

    } catch (error) {
      toast.error("Không thể thay đổi trạng thái lúc này.")
      console.error("Lỗi thay đổi trạng thái:", error)
    }
  }, [services, fetchServices, toast])

  const toggleSelect = (id: number) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll = () =>
    setSelected(s => s.length === filtered.length ? [] : filtered.map(sv => sv.id))

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&family=Montserrat:wght@400;500;600;700&display=swap');
        .row-hover:hover { background:#fffaf4 !important; }
        select { appearance:none; -webkit-appearance:none; }
        .scrollbar-thin::-webkit-scrollbar { width:4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background:#e5ddd0; border-radius:4px; }
      `}</style>

      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[11px] tracking-[2.5px] uppercase mb-1"
            style={{ color: "#b89a6a", fontFamily: "'Montserrat',sans-serif" }}>Quản lý</p>
          <h1 className="text-[28px] font-light text-[#1e1510]"
            style={{ fontFamily: "'Playfair Display',serif" }}>Dịch vụ</h1>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 h-10 px-5 text-[12px] font-bold tracking-[1px] uppercase text-white"
          style={{ background: "#b89a6a", fontFamily: "'Montserrat',sans-serif" }}
          onMouseOver={e => (e.currentTarget.style.background = "#a08455")}
          onMouseOut={e => (e.currentTarget.style.background = "#b89a6a")}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Thêm dịch vụ
        </button>
      </div>

      {/* Thay thế 4 card cũ bằng 3 card hợp lý với dữ liệu mới */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Tổng số dịch vụ" value={services.length} icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        } />
        <StatCard label="Đang hoạt động (Hiển thị)" value={activeCount} accent="#22c55e" icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" />
          </svg>
        } />
        <StatCard label="Tạm ẩn / Khóa" value={inactiveCount} accent="#ef4444" icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        } />
      </div>

      <div className="flex gap-5 items-start">
        {/* MAIN */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">

          {/* Toolbar */}
          <div className="bg-white px-4 py-3 flex flex-wrap items-center gap-2"
            style={{ border: "1px solid #f0ebe3" }}>

            <div className="relative flex-1 min-w-[180px]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Tìm tên dịch vụ..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-[6px] text-[12px] border border-[#ede8e0] outline-none"
                style={{ fontFamily: "'Montserrat',sans-serif", color: "#1e1510" }}
              />
            </div>

            <div className="relative">
              <select value={filterType} onChange={e => setFilterType(e.target.value as any)}
                className="pl-3 pr-8 py-[6px] text-[12px] border border-[#ede8e0] outline-none bg-white cursor-pointer"
                style={{ fontFamily: "'Montserrat',sans-serif" }}>
                <option value="all">Tất cả danh mục</option>
                {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>

            <div className="relative">
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value === "all" ? "all" : +e.target.value as any)}
                className="pl-3 pr-8 py-[6px] text-[12px] border border-[#ede8e0] outline-none bg-white cursor-pointer"
                style={{ fontFamily: "'Montserrat',sans-serif" }}>
                <option value="all">Tất cả trạng thái</option>
                <option value="1">Đang bán</option>
                <option value="0">Tạm ẩn</option>
              </select>
            </div>

            {/* Sắp xếp (Đã bỏ bookings, revenue) */}
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                className="pl-3 pr-8 py-[6px] text-[12px] border border-[#ede8e0] outline-none bg-white cursor-pointer"
                style={{ fontFamily: "'Montserrat',sans-serif" }}>
                <option value="name">Tên từ A–Z</option>
                <option value="originalPrice">Giá cao nhất</option>
                <option value="duration">Thời gian lâu nhất</option>
              </select>
            </div>

            <div className="flex border border-[#ede8e0] ml-auto">
              {(["table", "grid"] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)}
                  className="w-8 h-8 flex items-center justify-center transition-all"
                  style={{ background: viewMode === v ? "#b89a6a" : "transparent", color: viewMode === v ? "#fff" : "#9e8060" }}>
                  {v === "table"
                    ? <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M1 4h12M1 8h12M1 12h12M4 1v12" /></svg>
                    : <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="1" y="1" width="5" height="5" rx="1" /><rect x="8" y="1" width="5" height="5" rx="1" /><rect x="1" y="8" width="5" height="5" rx="1" /><rect x="8" y="8" width="5" height="5" rx="1" /></svg>
                  }
                </button>
              ))}
            </div>
          </div>

          {/* TABLE VIEW (Đã xoá cột lượt đặt và doanh thu) */}
          {viewMode === "table" && (
            <div className="bg-white" style={{ border: "1px solid #f0ebe3" }}>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full" style={{ minWidth: 640 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f0ebe3", background: "#faf8f5" }}>
                      <th className="w-10 px-4 py-3">
                        <input type="checkbox"
                          checked={selected.length === filtered.length && filtered.length > 0}
                          onChange={toggleAll}
                          className="w-[14px] h-[14px] cursor-pointer accent-[#b89a6a]"
                        />
                      </th>
                      {["Dịch vụ", "Danh mục", "Giá gốc", "Thời gian", "Trạng thái", ""].map(h => (
                        <th key={h} className="px-3 py-3 text-left text-[9px] font-bold tracking-[1.5px] uppercase text-[#bbb]"
                          style={{ fontFamily: "'Montserrat',sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="px-4 py-14 text-center text-[12px] text-[#b89a6a]"
                        style={{ fontFamily: "'Montserrat',sans-serif" }}>Đang tải dữ liệu dịch vụ...</td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-14 text-center text-[12px] text-[#bbb]"
                        style={{ fontFamily: "'Montserrat',sans-serif" }}>Không có dịch vụ phù hợp</td></tr>
                    ) : filtered.map((sv, idx) => {
                      const isSelected = selected.includes(sv.id)
                      const isDetail = detail?.id === sv.id
                      const cfg = CATEGORY_CONFIG[sv.type]
                      return (
                        <tr key={sv.id}
                          className="row-hover cursor-pointer"
                          onClick={() => setDetail(isDetail ? null : sv)}
                          style={{
                            borderBottom: idx < filtered.length - 1 ? "1px solid #f8f5f0" : "none",
                            background: isDetail ? "#fffaf4" : isSelected ? "rgba(184,154,106,0.04)" : "transparent",
                          }}>
                          <td className="px-4 py-3" onClick={e => { e.stopPropagation(); toggleSelect(sv.id) }}>
                            <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(sv.id)}
                              className="w-[14px] h-[14px] cursor-pointer accent-[#b89a6a]"
                            />
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
                                style={{ background: cfg?.bg, color: cfg?.color }}>
                                {cfg?.icon}
                              </div>
                              <div>
                                <p className="text-[13px] font-semibold text-[#1e1510]"
                                  style={{ fontFamily: "'Montserrat',sans-serif" }}>{sv.name}</p>
                                <p className="text-[10px] text-[#bbb] line-clamp-1 max-w-[240px]"
                                  style={{ fontFamily: "'Montserrat',sans-serif" }}>{sv.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3"><CategoryBadge type={sv.type} /></td>
                          <td className="px-3 py-3">
                            <span className="text-[13px] font-semibold text-[#b89a6a]"
                              style={{ fontFamily: "'Montserrat',sans-serif" }}>{fmt(sv.originalPrice)}</span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-[12px] text-[#3a3530]"
                              style={{ fontFamily: "'Montserrat',sans-serif" }}>{sv.duration} phút</span>
                          </td>
                          <td className="px-3 py-3"><StatusPill status={sv.status} /></td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
                              <button onClick={() => setEditTarget(sv)}
                                className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a] hover:text-[#b89a6a]"
                                title="Sửa">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button onClick={() => handleToggleStatus(sv.id)}
                                className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a] hover:text-[#b89a6a]"
                                title={sv.status === 1 ? "Tạm ẩn" : "Kích hoạt"}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                  {sv.status === 1
                                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                                  }
                                </svg>
                              </button>
                              <button onClick={() => setDeleteTarget(sv)}
                                className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-red-300 hover:text-red-400"
                                title="Xoá">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                  <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-[#f0ebe3] flex items-center justify-between">
                <span className="text-[11px] text-[#bbb]" style={{ fontFamily: "'Montserrat',sans-serif" }}>
                  {selected.length > 0 ? `${selected.length} đã chọn · ` : ""}{filtered.length} dịch vụ
                </span>
              </div>
            </div>
          )}

          {/* GRID VIEW (Đã dọn dẹp) */}
          {viewMode === "grid" && (
            <>
              {loading ? (
                <div className="text-center py-14 text-[12px] text-[#b89a6a]" style={{ fontFamily: "'Montserrat',sans-serif" }}>
                  Đang tải dữ liệu dịch vụ...
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-14 text-[12px] text-[#bbb]" style={{ fontFamily: "'Montserrat',sans-serif" }}>
                  Không có dịch vụ phù hợp
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map(sv => {
                    const cfg = CATEGORY_CONFIG[sv.type]
                    const isDetail = detail?.id === sv.id
                    return (
                      <div key={sv.id}
                        onClick={() => setDetail(isDetail ? null : sv)}
                        className="bg-white p-5 cursor-pointer group flex flex-col justify-between"
                        style={{
                          border: isDetail ? "1px solid #b89a6a" : "1px solid #f0ebe3",
                          boxShadow: isDetail ? "0 2px 16px rgba(184,154,106,0.15)" : "none",
                          transition: "all 0.2s",
                          minHeight: "190px"
                        }}>
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-sm flex items-center justify-center"
                              style={{ background: cfg?.bg, color: cfg?.color }}>
                              <div style={{ transform: "scale(1.3)" }}>{cfg?.icon}</div>
                            </div>
                            <StatusPill status={sv.status} />
                          </div>
                          <p className="text-[14px] font-semibold text-[#1e1510] mb-1 leading-snug"
                            style={{ fontFamily: "'Montserrat',sans-serif" }}>{sv.name}</p>
                          <p className="text-[11px] text-[#9e8060] mb-3 line-clamp-2 leading-relaxed"
                            style={{ fontFamily: "'Montserrat',sans-serif" }}>{sv.description}</p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[18px] font-light text-[#b89a6a]"
                              style={{ fontFamily: "'Playfair Display',serif" }}>{fmt(sv.originalPrice)}</span>
                            <span className="text-[11px] text-[#bbb]"
                              style={{ fontFamily: "'Montserrat',sans-serif" }}>{sv.duration} phút</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-[#f8f5f0]">
                            <CategoryBadge type={sv.type} />
                            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                              <button onClick={() => setEditTarget(sv)}
                                className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a] hover:text-[#b89a6a]">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button onClick={() => setDeleteTarget(sv)}
                                className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-red-300 hover:text-red-400">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                  <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* DETAIL PANEL */}
        <div className="w-[260px] shrink-0 bg-white self-stretch"
          style={{ border: "1px solid #f0ebe3", minHeight: 500 }}>
          <DetailPanel
            service={detail}
            onClose={() => setDetail(null)}
            onEdit={s => { setEditTarget(s); setDetail(null) }}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>

      {/* Modals */}
      {showAdd && (
        <ServiceModal mode="add" initial={EMPTY_FORM} onSave={handleAdd} onClose={() => setShowAdd(false)} />
      )}
      {editTarget && (
        <ServiceModal
          mode="edit"
          initial={{
            name: editTarget.name,
            type: editTarget.type,
            originalPrice: String(editTarget.originalPrice),
            duration: String(editTarget.duration),
            description: editTarget.description,
            status: editTarget.status === 1 ? "active" : "inactive"
          }}
          onSave={handleEdit}
          onClose={() => setEditTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm name={deleteTarget.name} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />
      )}
    </>
  )
}