"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface BookingContextValue {
  isOpen: boolean
  preselectedService?: string | number
  openBooking: (serviceId?: string | number) => void
  closeBooking: () => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [preselectedService, setPreselectedService] = useState<string | number | undefined>()

  const openBooking = useCallback((serviceId?: string | number) => {
    setPreselectedService(serviceId)
    setIsOpen(true)
    document.body.style.overflow = "hidden"
  }, [])

  const closeBooking = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = ""
    // slight delay to let animation finish before clearing
    setTimeout(() => setPreselectedService(undefined), 400)
  }, [])

  return (
    <BookingContext.Provider value={{ isOpen, preselectedService, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider")
  return ctx
}