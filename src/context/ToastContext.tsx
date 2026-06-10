// src/context/ToastContext.tsx
"use client"

import React, { createContext, useState, useCallback } from "react"

export type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])

    // Tự động xóa toast sau 3.5 giây (3s hiển thị + 0.5s hiệu ứng ẩn)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  // Cấu hình màu sắc & icon phù hợp với giao diện Barber cao cấp của bạn
  const getToastStyle = (type: ToastType) => {
    switch (type) {
      case "success":
        return { border: "1px solid #e2f5e9", bg: "#f4fbf7", text: "#16a34a", icon: "✓" }
      case "error":
        return { border: "1px solid #fce8e6", bg: "#fdf3f2", text: "#ef4444", icon: "✗" }
      case "warning":
        return { border: "1px solid #fef3c7", bg: "#fffbeb", text: "#d97706", icon: "!" }
      default:
        return { border: "1px solid #f0ebe3", bg: "#fffaf4", text: "#b89a6a", icon: "i" }
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Giao diện danh sách các Toast nổi lên */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          .toast-item {
            animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards,
                       fadeOut 0.4s ease 3.1s forwards;
          }
        `}</style>
        
        {toasts.map((t) => {
          const style = getToastStyle(t.type)
          return (
            <div
              key={t.id}
              className="toast-item pointer-events-auto flex items-center gap-3 px-4 py-3 bg-white shadow-lg rounded-sm"
              style={{
                border: style.border,
                background: style.bg,
                fontFamily: "'Montserrat', sans-serif",
                boxShadow: "0 12px 32px rgba(30,21,16,0.05)"
              }}
            >
              {/* Icon vòng tròn nhỏ */}
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{ background: `${style.text}15`, color: style.text }}
              >
                {style.icon}
              </div>
              
              {/* Nội dung tin nhắn */}
              <p className="text-[12px] font-medium leading-normal" style={{ color: "#1e1510" }}>
                {t.message}
              </p>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}