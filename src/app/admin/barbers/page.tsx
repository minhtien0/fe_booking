"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "../../../lib/api"

// ── Types ────────────────────────────────────────────────────────────────────
interface Barber {
  id: number
  name: string
  role: string
  phone?: string
  email?: string
  avatar?: string
  status: 0 | 1   // 0 = nghỉ, 1 = đang làm
  joinedAt?: string
}

interface BarberFormData {
  name:   string
  role:   string
  phone:  string
  email:  string
  status: 0 | 1
}

const EMPTY_FORM: BarberFormData = {
  name: "", role: "", phone: "", email: "", status: 1,
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function Avatar({ name, src, size = 36 }: { name: string; src?: string; size?: number }) {
  if (src) {
    return (
      <img
        src={src} alt={name}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{
        width: size, height: size,
        background: "#b89a6a",
        fontSize: size * 0.38,
        fontFamily: "'Playfair Display', serif",
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function StatusPill({ status }: { status: 0 | 1 }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-[3px] text-[11px] font-semibold rounded-full"
      style={{
        fontFamily:  "'Montserrat', sans-serif",
        background:  status === 1 ? "rgba(34,197,94,0.1)"  : "rgba(156,163,175,0.12)",
        color:       status === 1 ? "#16a34a"               : "#9ca3af",
      }}
    >
      <span
        className="w-[6px] h-[6px] rounded-full"
        style={{ background: status === 1 ? "#22c55e" : "#9ca3af" }}
      />
      {status === 1 ? "Đang làm" : "Nghỉ"}
    </span>
  )
}

// ── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  mode:    "add" | "edit"
  initial: BarberFormData
  onSave:  (data: BarberFormData) => Promise<void>
  onClose: () => void
}

function BarberModal({ mode, initial, onSave, onClose }: ModalProps) {
  const [form,    setForm]    = useState<BarberFormData>(initial)
  const [saving,  setSaving]  = useState(false)
  const [errors,  setErrors]  = useState<Partial<BarberFormData>>({})

  const validate = (): boolean => {
    const e: Partial<BarberFormData> = {}
    if (!form.name.trim())  e.name = "Bắt buộc"
    if (!form.role.trim())  e.role = "Bắt buộc"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try { await onSave(form) }
    finally { setSaving(false) }
  }

  const Field = ({
    label, field, placeholder, type = "text",
  }: {
    label: string
    field: keyof BarberFormData
    placeholder?: string
    type?: string
  }) => (
    <div>
      <label
        className="block text-[11px] font-semibold tracking-[1px] uppercase mb-1"
        style={{ color: "#9e8060", fontFamily: "'Montserrat', sans-serif" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={form[field] as string}
        onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setErrors(er => ({ ...er, [field]: undefined })) }}
        placeholder={placeholder}
        className="w-full px-3 py-[9px] text-[13px] border outline-none"
        style={{
          fontFamily:  "'Montserrat', sans-serif",
          borderColor: errors[field] ? "#f87171" : "#ede8e0",
          background:  "#fff",
          color:       "#1e1510",
          transition:  "border-color 0.18s",
        }}
        onFocus={e => (e.target.style.borderColor = "#b89a6a")}
        onBlur={e  => (e.target.style.borderColor = errors[field] ? "#f87171" : "#ede8e0")}
      />
      {errors[field] && (
        <p className="text-[11px] text-red-400 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {errors[field]}
        </p>
      )}
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] bg-white"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ebe3]">
          <div>
            <div className="w-1 h-5 bg-[#b89a6a] inline-block mr-2 align-middle" />
            <h3
              className="inline text-[16px] font-light text-[#1e1510]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {mode === "add" ? "Thêm Barber mới" : "Chỉnh sửa Barber"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a] hover:text-[#b89a6a]"
            style={{ transition: "all 0.18s" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Họ tên *"     field="name"  placeholder="Nguyễn Văn A" />
            <Field label="Chức vụ *"    field="role"  placeholder="Senior Barber" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Điện thoại"   field="phone" placeholder="0901 234 567" type="tel" />
            <Field label="Email"        field="email" placeholder="barber@email.com" type="email" />
          </div>

          {/* Status toggle */}
          <div>
            <label
              className="block text-[11px] font-semibold tracking-[1px] uppercase mb-2"
              style={{ color: "#9e8060", fontFamily: "'Montserrat', sans-serif" }}
            >
              Trạng thái
            </label>
            <div className="flex gap-2">
              {([1, 0] as const).map(val => (
                <button
                  key={val}
                  onClick={() => setForm(f => ({ ...f, status: val }))}
                  className="flex-1 py-[9px] text-[12px] font-semibold border transition-all"
                  style={{
                    fontFamily:  "'Montserrat', sans-serif",
                    borderColor: form.status === val ? "#b89a6a" : "#ede8e0",
                    background:  form.status === val ? "#fffaf4" : "#fff",
                    color:       form.status === val ? "#b89a6a" : "#9e8060",
                  }}
                >
                  {val === 1 ? "✓  Đang làm" : "✗  Nghỉ"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-[9px] text-[12px] font-semibold border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a]"
            style={{ fontFamily: "'Montserrat', sans-serif", transition: "border-color 0.18s" }}
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-7 py-[9px] text-[12px] font-bold tracking-[1px] uppercase text-white disabled:opacity-50"
            style={{ fontFamily: "'Montserrat', sans-serif", background: "#b89a6a", transition: "opacity 0.18s" }}
          >
            {saving ? "Đang lưu..." : mode === "add" ? "Thêm mới" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Delete confirm ────────────────────────────────────────────────────────────
function DeleteConfirm({ name, onConfirm, onClose }: { name: string; onConfirm: () => Promise<void>; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] bg-white p-6"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
        </div>
        <h3 className="text-center text-[16px] font-light text-[#1e1510] mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Xoá Barber?
        </h3>
        <p className="text-center text-[12px] text-[#9e8060] mb-6"
          style={{ fontFamily: "'Montserrat', sans-serif" }}>
          <strong>{name}</strong> sẽ bị xoá vĩnh viễn.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-[9px] border border-[#ede8e0] text-[12px] font-semibold text-[#9e8060]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Huỷ
          </button>
          <button
            onClick={async () => { setLoading(true); await onConfirm(); setLoading(false) }}
            disabled={loading}
            className="flex-1 py-[9px] text-[12px] font-bold text-white bg-red-500 disabled:opacity-50"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {loading ? "Đang xoá..." : "Xoá"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent = "#b89a6a" }: {
  label: string; value: number | string; icon: React.ReactNode; accent?: string
}) {
  return (
    <div className="bg-white p-5 flex items-center gap-4" style={{ border: "1px solid #f0ebe3" }}>
      <div className="w-11 h-11 flex items-center justify-center rounded-sm shrink-0"
        style={{ background: `${accent}15`, color: accent }}>
        {icon}
      </div>
      <div>
        <p className="text-[22px] font-light text-[#1e1510]" style={{ fontFamily: "'Playfair Display', serif" }}>
          {value}
        </p>
        <p className="text-[11px] text-[#9e8060] tracking-[0.5px]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {label}
        </p>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminBarbersPage() {
  const [barbers,    setBarbers]    = useState<Barber[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState("")

  const [showAdd,    setShowAdd]    = useState(false)
  const [editTarget, setEditTarget] = useState<Barber | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Barber | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────────
  const loadBarbers = async () => {
    try {
      const res = await apiFetch<{ data: Barber[] }>("/barbers/list")
      setBarbers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBarbers() }, [])

  // ── CRUD handlers ──────────────────────────────────────────────────
  const handleAdd = async (form: BarberFormData) => {
    await apiFetch("/barbers", { method: "POST", body: JSON.stringify(form) })
    await loadBarbers()
    setShowAdd(false)
  }

  const handleEdit = async (form: BarberFormData) => {
    if (!editTarget) return
    await apiFetch(`/barbers/${editTarget.id}`, { method: "PATCH", body: JSON.stringify(form) })
    await loadBarbers()
    setEditTarget(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await apiFetch(`/barbers/${deleteTarget.id}`, { method: "DELETE" })
    await loadBarbers()
    setDeleteTarget(null)
  }

  // ── Filtered list ──────────────────────────────────────────────────
  const filtered = barbers.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.role.toLowerCase().includes(search.toLowerCase())
  )

  const total   = barbers.length
  const active  = barbers.filter(b => b.status === 1).length
  const inactive = total - active

  // ── Skeleton row ───────────────────────────────────────────────────
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {[140, 100, 120, 80, 90].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 bg-[#ede8e0] rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&family=Montserrat:wght@400;500;600;700&display=swap');
      `}</style>

      {/* ── Page title ────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-7">
        <div>
          <p
            className="text-[11px] tracking-[2.5px] uppercase mb-1"
            style={{ color: "#b89a6a", fontFamily: "'Montserrat', sans-serif" }}
          >
            Quản lý
          </p>
          <h1
            className="text-[28px] font-light text-[#1e1510]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Barbers
          </h1>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 h-10 px-5 text-[12px] font-bold tracking-[1px] uppercase text-white"
          style={{ background: "#b89a6a", fontFamily: "'Montserrat', sans-serif", transition: "background 0.18s" }}
          onMouseOver={e => (e.currentTarget.style.background = "#a08455")}
          onMouseOut={e  => (e.currentTarget.style.background = "#b89a6a")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Thêm Barber
        </button>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Tổng barber" value={total} icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        } />
        <StatCard label="Đang làm việc" value={active} accent="#22c55e" icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" />
          </svg>
        } />
        <StatCard label="Đang nghỉ" value={inactive} accent="#9ca3af" icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><path d="M10 15l2-2 2 2M10 9l2 2 2-2" />
          </svg>
        } />
        <StatCard label="Tỷ lệ hoạt động" value={total ? `${Math.round((active / total) * 100)}%` : "—"} accent="#b89a6a" icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        } />
      </div>

      {/* ── Table card ────────────────────────────────────────────────── */}
      <div className="bg-white" style={{ border: "1px solid #f0ebe3" }}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0ebe3]">
          <div className="relative">
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#bbb" strokeWidth="1.8" strokeLinecap="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Tìm tên, chức vụ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-[7px] text-[12px] border border-[#ede8e0] outline-none w-56"
              style={{
                fontFamily: "'Montserrat', sans-serif", color: "#1e1510",
                transition: "border-color 0.18s",
              }}
              onFocus={e => (e.target.style.borderColor = "#b89a6a")}
              onBlur={e  => (e.target.style.borderColor = "#ede8e0")}
            />
          </div>
          <span className="text-[12px] text-[#bbb]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {filtered.length} barber
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #f0ebe3", background: "#faf8f5" }}>
                {["Barber", "Chức vụ", "Liên hệ", "Trạng thái", ""].map(h => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-bold tracking-[1.5px] uppercase text-[#bbb]"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(4).fill(null).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-[13px] text-[#bbb]"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {search ? "Không tìm thấy barber phù hợp" : "Chưa có barber nào"}
                  </td>
                </tr>
              ) : (
                filtered.map((b, idx) => (
                  <tr
                    key={b.id}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? "1px solid #f8f5f0" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseOver={e  => (e.currentTarget.style.background = "#fffaf4")}
                    onMouseOut={e   => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Name + avatar */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={b.name} src={b.avatar} size={36} />
                        <span className="text-[13px] font-semibold text-[#1e1510]"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {b.name}
                        </span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className="text-[12px] text-[#9e8060]"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {b.role}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {b.phone && <p className="text-[12px] text-[#3a3530]">{b.phone}</p>}
                        {b.email && <p className="text-[11px] text-[#bbb] mt-[1px]">{b.email}</p>}
                        {!b.phone && !b.email && <span className="text-[11px] text-[#d6cec4]">—</span>}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusPill status={b.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditTarget(b)}
                          className="w-8 h-8 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a] hover:text-[#b89a6a]"
                          style={{ transition: "all 0.18s" }}
                          title="Chỉnh sửa"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="w-8 h-8 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-red-300 hover:text-red-400"
                          style={{ transition: "all 0.18s" }}
                          title="Xoá"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {showAdd && (
        <BarberModal
          mode="add"
          initial={EMPTY_FORM}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}

      {editTarget && (
        <BarberModal
          mode="edit"
          initial={{
            name:   editTarget.name,
            role:   editTarget.role,
            phone:  editTarget.phone  ?? "",
            email:  editTarget.email  ?? "",
            status: editTarget.status,
          }}
          onSave={handleEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  )
}