// src/hooks/useToast.ts
import { useContext } from "react"
import { ToastContext } from ".././context/ToastContext"

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast phải được đặt bên trong ToastProvider")
  }

  return {
    success: (msg: string) => context.showToast(msg, "success"),
    error: (msg: string) => context.showToast(msg, "error"),
    warning: (msg: string) => context.showToast(msg, "warning"),
    info: (msg: string) => context.showToast(msg, "info"),
  }
}