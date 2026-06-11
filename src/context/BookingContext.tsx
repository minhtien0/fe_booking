"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Thêm type để phân biệt preselect là service hay combo
export interface PreselectedItem {
  id:   string | number
  type: 'service' | 'combo'
}

interface BookingContextValue {
  isOpen:              boolean
  preselectedItem?:    PreselectedItem
  openBooking:         (item?: PreselectedItem) => void
  closeBooking:        () => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen,           setIsOpen]           = useState(false)
  const [preselectedItem,  setPreselectedItem]  = useState<PreselectedItem | undefined>()

  const openBooking = useCallback((item?: PreselectedItem) => {
    setPreselectedItem(item)
    setIsOpen(true)
    document.body.style.overflow = "hidden"
  }, [])

  const closeBooking = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = ""
    setTimeout(() => setPreselectedItem(undefined), 400)
  }, [])

  return (
    <BookingContext.Provider value={{ isOpen, preselectedItem, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider")
  return ctx
}