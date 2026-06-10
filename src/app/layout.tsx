// src/app/layout.tsx
"use client"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { BookingProvider } from "../context/BookingContext"
import BookingModal from "../components/booking/BookingModal"
import CanvasCursor from "../components/cursor/CanvasCursor"
import { ToastProvider } from ".././context/ToastContext"

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")
  const isLogin = pathname === "/login"

  if (isAdmin || isLogin) {
    return (
      <html lang="vi">
        <body>
          <ToastProvider>
            {children}
          </ToastProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="vi">
      <body>
        <BookingProvider>
          <CanvasCursor />
          <Header />
          <main>{children}</main>
          <Footer />
          <BookingModal />
        </BookingProvider>
      </body>
    </html>
  )
}