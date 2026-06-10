"use client"

import { useEffect, useState, useRef } from "react"
import { apiFetch } from "../../../lib/api"

// ── Types Theo Đúng Cấu Trúc Dữ Liệu Combo Có Sẵn Service ───────────────────

interface ComboServiceDetail {
  id: number
  name: string
  duration: number
  originalPrice: number
  description: string
  included: string[]
  slug: string
  status: number
  type: string
}

interface Combo {
  id?: number
  title?: string         
  name: string           
  tagline: string
  badge: string
  description: string
  benefits: string[]
  slug: string
  price?: string         
  comboPrice: number     
  iconKey?: string       
  bookingNote: string
  coverImage: string
  gallery: string[]
  services: ComboServiceDetail[] 
}

interface ComboFormData {
  name: string
  title: string
  tagline: string
  badge: string
  description: string
  benefits: string       
  slug: string
  comboPrice: number
  price: string
  iconKey: string
  bookingNote: string
  coverImage: string
  gallery: string        
  services: ComboServiceDetail[] 
}

const EMPTY_FORM: ComboFormData = {
  name: "", title: "", tagline: "", badge: "", description: "",
  benefits: "", slug: "", comboPrice: 0, price: "", iconKey: "Classic",
  bookingNote: "", coverImage: "", gallery: "", services: []
}

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

function ComboImage({ src, name }: { src?: string; name: string }) {
  if (src) {
    return (
      <img src={src} alt={name} className="object-cover shrink-0 rounded-sm border border-[#f0ebe3]" style={{ width: 64, height: 48 }} />
    )
  }
  return (
    <div className="flex items-center justify-center text-[#9e8060] bg-[#faf8f5] rounded-sm shrink-0 border border-[#ede8e0]" style={{ width: 64, height: 48 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  )
}

// ── Modal Form Cấu Hình Gói Combo ───────────────────────────────────────────
interface ModalProps {
  mode: "add" | "edit"
  initial: ComboFormData
  onSave: (data: ComboFormData) => Promise<void>
  onClose: () => void
}

function ComboModal({ mode, initial, onSave, onClose }: ModalProps) {
  const [form, setForm] = useState<ComboFormData>(initial)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<ComboFormData>>({})

  // Các state phục vụ danh sách dịch vụ từ API /services
  const [allServices, setAllServices] = useState<ComboServiceDetail[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState<string>("")

  // Refs phục vụ kích hoạt chọn file ẩn
  const coverInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // Lấy danh sách dịch vụ gốc từ API khi mở modal lên
  useEffect(() => {
    const loadSystemServices = async () => {
      try {
        const res = await apiFetch<any>("/services")
        const servicesData = Array.isArray(res) ? res : res?.data || []
        setAllServices(servicesData)
      } catch (err) {
        console.error("Không thể tải danh sách dịch vụ hệ thống:", err)
      }
    }
    loadSystemServices()
  }, [])

  const handleNameChange = (val: string) => {
    if (mode === "add") {
      const generatedSlug = val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").replace(/([^0-9a-z-\s])/g, "").replace(/(\s+)/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "")
      setForm(f => ({ ...f, name: val, title: val, slug: generatedSlug }))
    } else {
      setForm(f => ({ ...f, name: val, title: val }))
    }
    setErrors(er => ({ ...er, name: undefined }))
  }

  // Thêm dịch vụ từ danh sách hệ thống vào Combo
  const handleAddServiceFromList = () => {
    if (!selectedServiceId) return
    const targetSv = allServices.find(s => s.id === parseInt(selectedServiceId))
    if (!targetSv) return

    // Kiểm tra trùng lặp trùng ID
    if (form.services.some(s => s.id === targetSv.id)) return

    setForm(f => ({
      ...f,
      services: [...f.services, targetSv]
    }))
    setSelectedServiceId("") // Reset select dropdown
  }

  // Loại bỏ dịch vụ khỏi combo
  const removeService = (id: number) => {
    setForm(f => ({
      ...f,
      services: f.services.filter(sv => sv.id !== id)
    }))
  }

  // Xử lý đọc file cục bộ chuyển sang dạng Base64 để hiển thị nhanh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: "cover" | "gallery") => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Result = reader.result as string
        if (target === "cover") {
          setForm(f => ({ ...f, coverImage: base64Result }))
        } else {
          setForm(f => {
            const currentArr = f.gallery.split("\n").map(g => g.trim()).filter(Boolean)
            currentArr.push(base64Result)
            return { ...f, gallery: currentArr.join("\n") }
          })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Xóa bớt 1 ảnh trong gallery
  const removeGalleryImage = (indexToRemove: number) => {
    const currentArr = form.gallery.split("\n").map(g => g.trim()).filter(Boolean)
    const updatedArr = currentArr.filter((_, idx) => idx !== indexToRemove)
    setForm(f => ({ ...f, gallery: updatedArr.join("\n") }))
  }

  const validate = (): boolean => {
    const e: Partial<ComboFormData> = {}
    if (!form.name.trim()) e.name = "Bắt buộc"
    if (!form.slug.trim()) e.slug = "Bắt buộc"
    if (form.comboPrice <= 0) e.comboPrice = "Giá phải lớn hơn 0" as any
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try { await onSave(form) }
    finally { setSaving(false) }
  }

  // Lọc bỏ những dịch vụ đã được chọn vào combo để tránh menu select hiển thị trùng lặp
  const filterAvailableServices = allServices.filter(
    systemSv => !form.services.some(addedSv => addedSv.id === systemSv.id)
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="w-full max-w-[880px] bg-white my-8 flex flex-col max-h-[90vh]" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ebe3]">
          <div>
            <div className="w-1 h-5 bg-[#b89a6a] inline-block mr-2 align-middle" />
            <h3 className="inline text-[16px] font-light text-[#1e1510]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {mode === "add" ? "Thêm Combo dịch vụ mới" : "Chỉnh sửa Combo nâng cao"}
            </h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Nội dung Form hai cột lớn */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          
          {/* ── CỘT TRÁI: THÔNG TIN CƠ BẢN VÀ HÌNH ẢNH ── */}
          <div className="space-y-4">
            <h4 className="text-[12px] font-bold uppercase tracking-[1px] text-[#b89a6a] border-b pb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>Thông tin cơ bản</h4>
            
            <div>
              <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-1 text-[#9e8060]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Tên Combo / Title *</label>
              <input type="text" value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="Classic Cut Combo" className="w-full px-3 py-[8px] text-[13px] border outline-none" style={{ fontFamily: "'Montserrat', sans-serif", borderColor: errors.name ? "#f87171" : "#ede8e0" }} />
              {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-1 text-[#9e8060]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Slug định danh *</label>
              <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="classic-cut-combo" className="w-full px-3 py-[8px] text-[13px] border outline-none bg-gray-50" style={{ fontFamily: "'Montserrat', sans-serif", borderColor: errors.slug ? "#f87171" : "#ede8e0" }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-1 text-[#9e8060]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Giá Số (comboPrice) *</label>
                <input type="number" value={form.comboPrice || ""} onChange={e => setForm(f => ({ ...f, comboPrice: parseInt(e.target.value) || 0, price: (parseInt(e.target.value) || 0).toLocaleString('vi-VN') + 'đ' }))} placeholder="250000" className="w-full px-3 py-[8px] text-[13px] border outline-none" style={{ fontFamily: "'Montserrat', sans-serif", borderColor: errors.comboPrice ? "#f87171" : "#ede8e0" }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-1 text-[#9e8060]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Icon Key</label>
                <input type="text" value={form.iconKey} onChange={e => setForm(f => ({ ...f, iconKey: e.target.value }))} placeholder="Classic" className="w-full px-3 py-[8px] text-[13px] border outline-none" style={{ fontFamily: "'Montserrat', sans-serif", borderColor: "#ede8e0" }} />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-1 text-[#9e8060]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Nhãn Badge / Tagline</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="Phổ biến nhất" className="w-full px-3 py-[8px] text-[12px] border outline-none" style={{ fontFamily: "'Montserrat', sans-serif", borderColor: "#ede8e0" }} />
                <input type="text" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="Trải nghiệm tiêu chuẩn vàng..." className="w-full px-3 py-[8px] text-[12px] border outline-none" style={{ fontFamily: "'Montserrat', sans-serif", borderColor: "#ede8e0" }} />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-1 text-[#9e8060]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Mô tả ngắn (Có thể kéo dài ô nhập)</label>
              <textarea value={form.description} rows={4} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Combo lý tưởng cho quý ông..." className="w-full px-3 py-[8px] text-[12px] border outline-none resize-y min-h-[80px]" style={{ fontFamily: "'Montserrat', sans-serif", borderColor: "#ede8e0" }} />
            </div>

            {/* Khu vực xử lý Ảnh Bìa To & Chọn File */}
            <div>
              <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-1.5 text-[#9e8060]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Ảnh Bìa (Click vào khung ảnh để thay đổi)</label>
              <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={(e) => handleFileChange(e, "cover")} />
              
              <div 
                onClick={() => coverInputRef.current?.click()}
                className="w-full h-44 border border-dashed border-[#b89a6a] bg-[#fffaf4] flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-md group relative transition-all hover:bg-[#fbf4e9]"
              >
                {form.coverImage ? (
                  <>
                    <img src={form.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white text-[11px] font-medium uppercase tracking-[1px]">
                      Thay đổi ảnh bìa mới
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b89a6a" strokeWidth="1.5" className="mx-auto mb-1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span className="text-[11px] text-[#b89a6a] font-medium uppercase tracking-[0.5px]">Tải ảnh bìa từ máy tính</span>
                  </div>
                )}
              </div>
            </div>

            {/* Khu vực xử lý Bộ sưu tập ảnh (Gallery) */}
            <div>
              <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-1.5 text-[#9e8060]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Bộ sưu tập Gallery (Xem trước và quản lý)</label>
              <input type="file" accept="image/*" multiple ref={galleryInputRef} className="hidden" onChange={(e) => handleFileChange(e, "gallery")} />
              
              <div className="grid grid-cols-4 gap-2 border p-3 bg-gray-50 rounded-sm" style={{ borderColor: "#ede8e0" }}>
                {form.gallery.split("\n").map((url, i) => {
                  const trimmed = url.trim()
                  if (!trimmed) return null
                  return (
                    <div key={i} className="relative aspect-[4/3] border bg-white rounded overflow-hidden group">
                      <img src={trimmed} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bold uppercase flex items-center justify-center"
                      >
                        Xóa ảnh
                      </button>
                    </div>
                  )
                })}
                
                {/* Nút thêm ảnh vào Album */}
                <div 
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-[4/3] border border-dashed border-[#b89a6a] bg-[#fffaf4] hover:bg-[#fbf4e9] rounded flex flex-col items-center justify-center cursor-pointer transition-all text-[#b89a6a]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="text-[9px] font-bold uppercase tracking-[0.5px] mt-1 text-center px-1">Thêm ảnh</span>
                </div>
              </div>

              <textarea 
                value={form.gallery} 
                onChange={e => setForm(f => ({ ...f, gallery: e.target.value }))} 
                className="w-full mt-2 p-2 text-[10px] bg-gray-50 border font-mono resize-y min-h-[50px] outline-none" 
                placeholder="Đường dẫn text của Gallery..." 
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-1 text-[#9e8060]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Lợi ích (Benefits - Mỗi dòng 1 ý)</label>
              <textarea value={form.benefits} rows={4} onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))} className="w-full px-3 py-[8px] text-[12px] border outline-none resize-y min-h-[80px]" style={{ fontFamily: "'Montserrat', sans-serif", borderColor: "#ede8e0" }} />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-[1px] uppercase mb-1 text-[#9e8060]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Ghi chú Đặt lịch (bookingNote)</label>
              <input type="text" value={form.bookingNote} onChange={e => setForm(f => ({ ...f, bookingNote: e.target.value }))} className="w-full px-3 py-[8px] text-[12px] border outline-none" style={{ fontFamily: "'Montserrat', sans-serif", borderColor: "#ede8e0" }} />
            </div>
          </div>

          {/* ── CỘT PHẢI: MAP DANH SÁCH & HỘP CHỌN CHUNG CONTAINER CHUYỂN ĐỘNG SIÊU MƯỢT ── */}
          <div className="flex flex-col border-l border-[#f0ebe3] pl-6">
            <h4 className="text-[12px] font-bold uppercase tracking-[1px] text-[#b89a6a] border-b pb-1 mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Dịch vụ đang chọn thuộc combo ({form.services?.length || 0})
            </h4>
            
            {/* Khung cuộn chứa cả List Item và Hộp chọn phía dưới */}
            <div className="overflow-y-auto max-h-[520px] pr-1 flex flex-col">
              
              {/* Danh sách các service hiện tại */}
              {form.services && form.services.length > 0 ? (
                form.services.map(sv => (
                  <div 
                    key={sv.id} 
                    className="flex items-center justify-between border border-[#b89a6a] bg-[#fffaf4] rounded-sm animate-smooth-add transition-all duration-300"
                  >
                    <div className="text-left p-3">
                      <p className="text-[12px] font-semibold text-[#1e1510]" style={{ fontFamily: "'Montserrat', sans-serif" }}>{sv.name}</p>
                      <p className="text-[11px] text-[#9e8060] font-mono">{formatVND(sv.originalPrice)} • {sv.duration} phút</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeService(sv.id)}
                      className="text-[11px] text-red-400 hover:text-red-600 font-bold uppercase tracking-[0.5px] p-3"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Gỡ ra
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 mb-3 text-center text-[12px] text-gray-400 italic border border-dashed border-[#ede8e0] rounded-sm">
                  Chưa map bất kỳ dịch vụ hệ thống nào vào gói.
                </div>
              )}

              {/* HỘP CHỌN NHANH: Nằm nối tiếp danh sách, tự đẩy xuống mượt mà nhờ animation chiều cao ở trên */}
              <div className="p-4 bg-[#faf8f5] border border-[#ede8e0] rounded-sm mt-1 transition-all duration-350 ease-in-out">
                <h5 className="text-[11px] font-bold uppercase tracking-[1px] text-[#1e1510] mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  ＋ Chọn dịch vụ từ hệ thống
                </h5>
                <p className="text-[11px] text-gray-400 mb-3">Hệ thống tự động hiển thị danh sách nạp từ endpoint /services.</p>
                
                <div className="flex gap-2">
                  <select 
                    value={selectedServiceId}
                    onChange={e => setSelectedServiceId(e.target.value)}
                    className="flex-1 px-2.5 py-2 text-[12px] bg-white border border-[#ede8e0] outline-none"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <option value="">-- Chọn dịch vụ cần gán --</option>
                    {filterAvailableServices.map(sv => (
                      <option key={sv.id} value={sv.id}>
                        {sv.name} ({formatVND(sv.originalPrice)} - {sv.duration}p)
                      </option>
                    ))}
                  </select>
                  
                  <button
                    type="button"
                    onClick={handleAddServiceFromList}
                    disabled={!selectedServiceId}
                    className="px-4 py-2 bg-[#1e1510] hover:bg-[#b89a6a] text-white text-[11px] font-bold uppercase tracking-[1px] transition-all disabled:opacity-40"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Gán vào
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-3.5 bg-[#faf8f5] border-t border-[#f0ebe3] flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-[12px] font-semibold border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Huỷ</button>
          <button onClick={handleSubmit} disabled={saving} className="px-7 py-2 text-[12px] font-bold tracking-[1px] uppercase text-white disabled:opacity-50" style={{ fontFamily: "'Montserrat', sans-serif", background: "#b89a6a" }}>
            {saving ? "Đang lưu..." : mode === "add" ? "Thêm mới" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page View ───────────────────────────────────────────────────────────
export default function AdminCombosPage() {
  const [combos, setCombos] = useState<Combo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<Combo | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Combo | null>(null)

  const loadPageData = async () => {
    try {
      const comboRes = await apiFetch<any>("/combos/view-list")
      const comboData = Array.isArray(comboRes) ? comboRes : comboRes?.data || []
      setCombos(comboData)
    } catch (err) {
      console.error("Lỗi đồng bộ dữ liệu API:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPageData() }, [])

  const handleAdd = async (formData: ComboFormData) => {
    const payload: Combo = {
      name: formData.name,
      title: formData.title,
      tagline: formData.tagline,
      badge: formData.badge,
      description: formData.description,
      benefits: formData.benefits.split("\n").map(b => b.trim()).filter(Boolean),
      slug: formData.slug,
      comboPrice: formData.comboPrice,
      price: formData.price,
      iconKey: formData.iconKey,
      bookingNote: formData.bookingNote,
      coverImage: formData.coverImage,
      gallery: formData.gallery.split("\n").map(g => g.trim()).filter(Boolean),
      services: formData.services 
    }

    await apiFetch("/combos", { method: "POST", body: JSON.stringify(payload) })
    await loadPageData()
    setShowAdd(false)
  }

  const handleOpenEdit = async (comboItem: Combo) => {
    setLoading(true)
    try {
      const detailData = await apiFetch<Combo>(`/combos/detail/${comboItem.slug}`)
      setEditTarget(detailData)
    } catch (err) {
      console.error("Không thể tải chi tiết combo:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (formData: ComboFormData) => {
    if (!editTarget) return

    const payload: Combo = {
      id: editTarget.id,
      name: formData.name,
      title: formData.title,
      tagline: formData.tagline,
      badge: formData.badge,
      description: formData.description,
      benefits: formData.benefits.split("\n").map(b => b.trim()).filter(Boolean),
      slug: formData.slug,
      comboPrice: formData.comboPrice,
      price: formData.price,
      iconKey: formData.iconKey,
      bookingNote: formData.bookingNote,
      coverImage: formData.coverImage,
      gallery: formData.gallery.split("\n").map(g => g.trim()).filter(Boolean),
      services: formData.services 
    }

    await apiFetch(`/combos/${editTarget.id}`, { method: "PATCH", body: JSON.stringify(payload) })
    await loadPageData()
    setEditTarget(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await apiFetch(`/combos/${deleteTarget.id}`, { method: "DELETE" })
    await loadPageData()
    setDeleteTarget(null)
  }

  const filtered = combos.filter(c => {
    const comboName = (c.name || c.title || "").toLowerCase()
    const comboSlug = (c.slug || "").toLowerCase()
    const searchTarget = search.toLowerCase()
    return comboName.includes(searchTarget) || comboSlug.includes(searchTarget)
  })

  return (
    <>
      {/* Khai báo keyframe smoothExpand tinh tế tại đây */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&family=Montserrat:wght@400;500;600;700&display=swap');
        
        @keyframes smoothExpand {
          0% {
            opacity: 0;
            max-height: 0px;
            margin-bottom: 0px;
            transform: translateY(-6px) scale(0.97);
          }
          100% {
            opacity: 1;
            max-height: 140px;
            margin-bottom: 10px;
            transform: translateY(0) scale(1);
          }
        }
        .animate-smooth-add {
          animation: smoothExpand 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          overflow: hidden;
        }
      `}</style>

      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[11px] tracking-[2.5px] uppercase mb-1 text-[#b89a6a]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Hệ thống quản lý</p>
          <h1 className="text-[26px] font-light text-[#1e1510]" style={{ fontFamily: "'Playfair Display', serif" }}>Gói Combo Dịch Vụ</h1>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 h-9 px-4 text-[12px] font-bold tracking-[1px] uppercase text-white"
          style={{ background: "#b89a6a", fontFamily: "'Montserrat', sans-serif" }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.8" strokeLinecap="round" /></svg>
          Thêm Combo mới
        </button>
      </div>

      <div className="bg-white border border-[#f0ebe3]">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f0ebe3]">
          <div className="relative">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.8" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text" placeholder="Tìm kiếm tên combo, slug định danh..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-[6px] text-[12px] border border-[#ede8e0] outline-none w-64" style={{ fontFamily: "'Montserrat', sans-serif" }}
            />
          </div>
          <span className="text-[12px] text-[#bbb]" style={{ fontFamily: "'Montserrat', sans-serif" }}>{filtered.length} combo hiện dụng</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #f0ebe3", background: "#faf8f5" }}>
                {["Gói Combo", "Dịch vụ bao gồm", "Giá hiển thị", "Icon Key", "Slug hệ thống", ""].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold tracking-[1.5px] uppercase text-[#bbb]" style={{ fontFamily: "'Montserrat', sans-serif" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-[#bbb] text-[12px]">Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-[12px] text-[#bbb]">Không có gói combo nào.</td></tr>
              ) : (
                filtered.map((c, idx) => (
                  <tr key={c.slug || idx} className="hover:bg-[#fffaf4] transition-all" style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #f8f5f0" : "none" }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <ComboImage src={c.coverImage} name={c.name || c.title || ""} />
                        <div>
                          <p className="text-[13px] font-semibold text-[#1e1510]" style={{ fontFamily: "'Montserrat', sans-serif" }}>{c.name || c.title}</p>
                          <p className="text-[11px] text-[#9e8060] max-w-[240px] truncate">{c.description}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[260px]">
                        {c.services && c.services.length > 0 ? (
                          c.services.map(sv => (
                            <span 
                              key={sv.id} 
                              className="text-[10px] font-medium px-2 py-0.5 rounded-sm border border-[#ede8e0] bg-[#faf8f5] text-[#1e1510]"
                              style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                              {sv.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Chưa map dịch vụ</span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3 text-[12px] font-medium text-gray-800 font-mono">
                      {c.price || (c.comboPrice ? formatVND(c.comboPrice) : "—")}
                    </td>
                    <td className="px-5 py-3 text-[12px] text-gray-500 font-mono">{c.iconKey || "—"}</td>
                    <td className="px-5 py-3 text-[12px] text-[#bbb] font-mono">{c.slug}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => handleOpenEdit(c)} className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-[#b89a6a] hover:text-[#b89a6a]">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button onClick={() => setDeleteTarget(c)} className="w-7 h-7 flex items-center justify-center border border-[#ede8e0] text-[#9e8060] hover:border-red-300 hover:text-red-400">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" /></svg>
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

      {showAdd && (
        <ComboModal mode="add" initial={EMPTY_FORM} onSave={handleAdd} onClose={() => setShowAdd(false)} />
      )}

      {editTarget && (
        <ComboModal
          mode="edit"
          initial={{
            name: editTarget.name || editTarget.title || "",
            title: editTarget.title || editTarget.name || "",
            tagline: editTarget.tagline || "",
            badge: editTarget.badge || "",
            description: editTarget.description || "",
            benefits: editTarget.benefits ? editTarget.benefits.join("\n") : "",
            slug: editTarget.slug || "",
            comboPrice: editTarget.comboPrice || 0,
            price: editTarget.price || "",
            iconKey: editTarget.iconKey || "Classic",
            bookingNote: editTarget.bookingNote || "",
            coverImage: editTarget.coverImage || "",
            gallery: editTarget.gallery ? editTarget.gallery.join("\n") : "", 
            services: editTarget.services || [] 
          }}
          onSave={handleEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-[340px] bg-white p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-center text-[15px] font-light mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Xoá Combo Dịch Vụ?</h3>
            <p className="text-center text-[12px] text-[#9e8060] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>Hành động này không thể hoàn tác.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border text-[12px] font-semibold text-[#9e8060]">Huỷ</button>
              <button onClick={handleDelete} className="flex-1 py-2 text-[12px] font-bold text-white bg-red-500">Xoá bỏ</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}