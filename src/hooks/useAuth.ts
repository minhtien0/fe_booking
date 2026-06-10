// src/hooks/useAuth.ts
import { useState }      from 'react'
import { useRouter }     from 'next/navigation'
import { useAuthStore }  from '../stores/auth'

interface LoginPayload {
  email:    string
  password: string
}
interface LoginError {
  status:     number
  message:    string
  retryAfter?: number
}
interface UseAuthReturn {
  login:     (payload: LoginPayload) => Promise<LoginError | undefined>
  isLoading: boolean
  error:     string | null
}
export function useAuth(): UseAuthReturn {
  const router  = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState<string | null>(null)

  async function login({ email, password }: LoginPayload): Promise<LoginError | undefined> {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        const msg = data.message ?? 'Đăng nhập thất bại.'
        setError(msg)
        // Trả lỗi về cho page để xử lý thêm (vd: 429 → bật countdown)
        return {
          status:     res.status,
          message:    msg,
          retryAfter: data.retryAfter,
        }
      }

      // Thành công: lưu user vào store (token đã nằm trong HttpOnly cookie)
      setAuth(data.user)

      // Redirect về trang được yêu cầu hoặc /admin
      const params = new URLSearchParams(window.location.search)
      const from   = params.get('from') ?? '/admin'
      router.replace(from)

      return undefined  

    } catch {
      const msg = 'Lỗi kết nối. Vui lòng thử lại.'
      setError(msg)
      return { status: 0, message: msg }
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}