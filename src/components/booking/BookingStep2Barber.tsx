"use client"

import { useEffect, useState } from "react"
import { type BookingBarber } from "../../types/booking"
import { apiFetch } from "../../lib/api"

// ── Module-level cache ──────────────────────────────────────────────
const ANY_BARBER: BookingBarber = {
  id: 2, name: "Barber bất kỳ", role: "Phù hợp nhất lịch trống", avatar: undefined,
}

let _cachedBarbers: BookingBarber[] | null = null
let _fetchingPromise: Promise<void> | null = null

async function fetchBarbersData() {
  if (_cachedBarbers) return
  if (_fetchingPromise) return _fetchingPromise

  _fetchingPromise = apiFetch<{ data: any[] }>("/barbers/list")
    .then(res => {
      const apiBarbers: BookingBarber[] = res.data.map(b => ({
        id:     b.id,
        name:   b.name,
        role:   b.role,
        avatar: b.avatar,
      }))
      _cachedBarbers = [ANY_BARBER, ...apiBarbers]
    })
    .finally(() => { _fetchingPromise = null })

  return _fetchingPromise
}

export function clearBarbersCache() {
  _cachedBarbers = null
}

// ── Props ───────────────────────────────────────────────────────────
interface Props {
  selected: string | number | null
  onSelect: (id: string | number) => void
  onBarberMeta?: (meta: BookingBarber) => void  // ← truyền ngược lên modal
}

// ── Avatar fallback ─────────────────────────────────────────────────
function AvatarFallback({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#b89a6a] text-white text-[18px] font-bold"
      style={{ fontFamily: "'Playfair Display',serif" }}>
      {name.charAt(0)}
    </div>
  )
}

// ── Component ───────────────────────────────────────────────────────
export default function BookingStep2Barber({ selected, onSelect, onBarberMeta }: Props) {
  const [barbersList, setBarbersList] = useState<BookingBarber[]>(
    _cachedBarbers ?? [ANY_BARBER]   // render ngay từ cache nếu có
  )
  const [loading, setLoading] = useState(!_cachedBarbers)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    if (_cachedBarbers) {
      setBarbersList(_cachedBarbers)
      setLoading(false)
      return
    }

    setLoading(true)
    fetchBarbersData()
      .then(() => { setBarbersList(_cachedBarbers!) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h3 className="text-[18px] font-light text-[#1e1510] mb-1"
        style={{ fontFamily: "'Playfair Display',serif" }}>
        Chọn barber
      </h3>
      <p className="text-[12px] text-[#9e8060] mb-6 italic"
        style={{ fontFamily: "'Montserrat',sans-serif" }}>
        Chọn "Barber bất kỳ" để được xếp lịch nhanh nhất ✦
      </p>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 p-4 border border-[#ede8e0] animate-pulse">
              <div className="w-12 h-12 rounded-full bg-[#e0d4c3] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-[#e0d4c3] rounded w-24" />
                <div className="h-3 bg-[#ede6db] rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-[13px] text-red-400 italic"
          style={{ fontFamily: "'Montserrat',sans-serif" }}>
          Không thể tải danh sách barber. Vui lòng thử lại.
        </p>
      )}

      {/* List */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {barbersList.map(b => {
            const isActive = selected === b.id
            const isAny    = b.id === "any"

            return (
              <button
                key={b.id}
                onClick={() => {
                  onSelect(b.id)
                  onBarberMeta?.(b)  
                }}
                className="flex items-center gap-4 p-4 border text-left transition-all duration-200"
                style={{
                  borderColor: isActive ? "#b89a6a" : "#ede8e0",
                  background:  isActive ? "#fffaf4" : "#fff",
                  boxShadow:   isActive ? "0 2px 16px rgba(184,154,106,0.15)" : "none",
                }}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2"
                  style={{ borderColor: isActive ? "#b89a6a" : "transparent" }}>
                  {isAny ? (
                    <div className="w-full h-full bg-[#f0ebe3] flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="#b89a6a" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                  ) : b.avatar ? (
                    <img src={b.avatar} alt={b.name} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback name={b.name} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold leading-tight"
                    style={{ fontFamily: "'Montserrat',sans-serif", color: isActive ? "#b89a6a" : "#1e1510" }}>
                    {b.name}
                  </p>
                  <p className="text-[11px] text-[#9e8060] mt-[2px]"
                    style={{ fontFamily: "'Montserrat',sans-serif" }}>
                    {b.role}
                  </p>
                </div>

                {/* Check */}
                <div className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: isActive ? "#b89a6a" : "#d6cec4", background: isActive ? "#b89a6a" : "transparent", transition: "all 0.2s" }}>
                  {isActive && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}