"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "../../lib/api"
import { type BookingService } from "../../types/booking"

// API response types 
interface PricingItem {
  id: number
  name: string
  price: number
  currency: string
  description: string
  duration: number
}

interface PricingGroup {
  id: string
  label: string
  items: PricingItem[]
}

interface ComboItem {
  id: number
  title: string
  description: string
  price: number        
  iconKey: string
  slug: string
  duration: number
}

// helpers 
function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + "đ"
}

const LABEL_VI: Record<string, string> = {
  "hair-styling": "Tạo kiểu tóc",
  "shaving": "Cạo râu",
  "face-masking": "Chăm sóc da mặt",
}

// props 
interface Props {
  selected: string | number | null
  onSelect: (id: string | number) => void
  onServiceMeta?: (meta: BookingService) => void
}
let _cachedGroups: PricingGroup[] | null = null
let _cachedCombos: ComboItem[] | null = null
let _fetchingPromise: Promise<void> | null = null   // chặn duplicate request khi StrictMode double-mount

async function fetchPricingData() {
  // Đã có cache trả ngay, không gọi API
  if (_cachedGroups && _cachedCombos) return

  // Đang fetch dở (StrictMode mount lần 2) → chờ promise cũ, không tạo request mới
  if (_fetchingPromise) return _fetchingPromise

  _fetchingPromise = Promise.all([
    apiFetch<PricingGroup[]>("/services/pricing"),
    apiFetch<ComboItem[]>("/combos/view-list"),
  ]).then(([groups, combos]) => {
    _cachedGroups = groups
    _cachedCombos = combos
  }).finally(() => {
    _fetchingPromise = null
  })

  return _fetchingPromise
}

export default function BookingStep1Service({ selected, onSelect, onServiceMeta }: Props) {
  // Khởi tạo từ cache ngay lập tức nếu có — không flicker loading
  const [groups, setGroups] = useState<PricingGroup[]>(_cachedGroups ?? [])
  const [combos, setCombos] = useState<ComboItem[]>(_cachedCombos ?? [])
  const [loading, setLoading] = useState(!_cachedGroups || !_cachedCombos)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Cache đã có skip hoàn toàn, không fetch
    if (_cachedGroups && _cachedCombos) {
      setGroups(_cachedGroups)
      setCombos(_cachedCombos)
      setLoading(false)
      return
    }

    setLoading(true)
    fetchPricingData()
      .then(() => {
        setGroups(_cachedGroups!)
        setCombos(_cachedCombos!)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // loading / error states 
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span
          className="text-[13px] text-[#b89a6a] tracking-widest uppercase animate-pulse"
          style={{ fontFamily: "'Montserrat',sans-serif" }}
        >
          Đang tải dịch vụ…
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-[13px] text-red-400" style={{ fontFamily: "'Montserrat',sans-serif" }}>
          Không thể tải dịch vụ. Vui lòng thử lại.
        </p>
        <p className="text-[11px] text-[#bbb] mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* SECTION: individual services */}
      <div>
        <h3
          className="text-[18px] font-light text-[#1e1510] mb-1"
          style={{ fontFamily: "'Playfair Display',serif" }}
        >
          Chọn dịch vụ
        </h3>
        <p
          className="text-[12px] text-[#9e8060] mb-6 italic"
          style={{ fontFamily: "'Montserrat',sans-serif" }}
        >
          Chọn một hoặc nhiều dịch vụ lẻ, hoặc xem các combo bên dưới để tiết kiệm hơn ✦
        </p>

        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.id}>
              {/* Group label */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-[10px] font-bold tracking-[2px] uppercase text-[#b89a6a]"
                  style={{ fontFamily: "'Montserrat',sans-serif" }}
                >
                  {LABEL_VI[group.id] ?? group.label}
                </span>
                <div className="flex-1 h-px bg-[#ede8e0]" />
              </div>

              {/* Service cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.items.map((item) => {
                  const isActive = selected === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item.id)
                        onServiceMeta?.({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          duration: item.duration,     
                          type: 'service',
                        })
                      }}
                      className="relative text-left p-4 border transition-all duration-250 overflow-hidden"
                      style={{
                        borderColor: isActive ? "#b89a6a" : "#ede8e0",
                        background: isActive ? "#fffaf4" : "#fff",
                        boxShadow: isActive ? "0 2px 16px rgba(184,154,106,0.15)" : "none",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span
                          className="text-[14px] font-semibold leading-snug"
                          style={{
                            fontFamily: "'Montserrat',sans-serif",
                            color: isActive ? "#b89a6a" : "#1e1510",
                          }}
                        >
                          {item.name}
                        </span>
                        <div
                          className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-[1px]"
                          style={{
                            borderColor: isActive ? "#b89a6a" : "#d6cec4",
                            background: isActive ? "#b89a6a" : "transparent",
                            transition: "all 0.2s",
                          }}
                        >
                          {isActive && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path
                                d="M2 5l2.5 2.5L8 3"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p
                        className="text-[11px] text-[#9e8060] mb-2 leading-relaxed line-clamp-2"
                        style={{ fontFamily: "'Montserrat',sans-serif" }}
                      >
                        {item.description}
                      </p>
                      <span
                        className="text-[15px] font-bold text-[#b89a6a]"
                        style={{ fontFamily: "'Montserrat',sans-serif" }}
                      >
                        {formatPrice(item.price)}
                      </span>
                      <span
                        className="absolute bottom-0 left-0 h-[2px] bg-[#b89a6a]"
                        style={{
                          width: isActive ? "100%" : "0%",
                          transition: "width 0.35s ease",
                        }}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: combos  */}
      <div>
        <h3
          className="text-[18px] font-light text-[#1e1510] mb-1"
          style={{ fontFamily: "'Playfair Display',serif" }}
        >
          Hoặc chọn Combo
        </h3>
        <p
          className="text-[12px] text-[#9e8060] mb-6 italic"
          style={{ fontFamily: "'Montserrat',sans-serif" }}
        >
          Combo giúp bạn tiết kiệm hơn so với đặt lẻ từng dịch vụ ✦
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {combos.map((combo) => {
            const isActive = selected === combo.slug

            return (
              <button
                key={combo.slug}
                onClick={() => {
                  onSelect(combo.slug)
                  onServiceMeta?.({
                    id: combo.id,
                    name: combo.title,
                    price: combo.price,
                    duration: combo.duration, 
                    type: 'combo',
                  })
                }}
                className="relative text-left p-4 border transition-all duration-250 overflow-hidden"
                style={{
                  borderColor: isActive ? "#b89a6a" : "#ede8e0",
                  background: isActive ? "#fffaf4" : "#fff",
                  boxShadow: isActive ? "0 2px 16px rgba(184,154,106,0.15)" : "none",
                }}
              >
                <span
                  className="absolute top-0 right-0 text-[8px] font-bold tracking-[1.5px] uppercase px-2 py-[3px] text-white"
                  style={{ fontFamily: "'Montserrat',sans-serif", background: "#b89a6a" }}
                >
                  Combo
                </span>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span
                    className="text-[14px] font-semibold leading-snug pr-10"
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      color: isActive ? "#b89a6a" : "#1e1510",
                    }}
                  >
                    {combo.title}
                  </span>
                  <div
                    className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-[1px]"
                    style={{
                      borderColor: isActive ? "#b89a6a" : "#d6cec4",
                      background: isActive ? "#b89a6a" : "transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    {isActive && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M2 5l2.5 2.5L8 3"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <p
                  className="text-[11px] text-[#9e8060] mb-2 leading-relaxed line-clamp-2"
                  style={{ fontFamily: "'Montserrat',sans-serif" }}
                >
                  {combo.description}
                </p>
                <span
                  className="text-[15px] font-bold text-[#b89a6a]"
                  style={{ fontFamily: "'Montserrat',sans-serif" }}
                >
                  {combo.price}
                </span>
                <span
                  className="absolute bottom-0 left-0 h-[2px] bg-[#b89a6a]"
                  style={{
                    width: isActive ? "100%" : "0%",
                    transition: "width 0.35s ease",
                  }}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}