// src/stores/auth.ts
// Source of truth cho auth state trên client
// Token KHÔNG lưu ở đây — lưu trong HttpOnly cookie (server-side)
// Store chỉ giữ thông tin user để hiển thị UI

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface AdminUser {
  id:    number
  name:  string
  email: string
  role:  'Admin'
}

interface AuthState {
  user:  AdminUser | null
  // token KHÔNG lưu vào store / localStorage
  // chỉ dùng để biết "đã login chưa" — token thật nằm trong HttpOnly cookie
  isAuthenticated: boolean

  setAuth:   (user: AdminUser) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      isAuthenticated: false,

      setAuth: (user) =>
        set({ user, isAuthenticated: true }),

      clearAuth: () =>
        set({ user: null, isAuthenticated: false }),
    }),
    {
      name:    'admin-auth',           // key trong sessionStorage
      storage: createJSONStorage(() => sessionStorage), // sessionStorage: tự xoá khi đóng tab
    },
  ),
)