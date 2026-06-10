This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Auth Setup — Hướng dẫn tích hợp

## Cấu trúc file cần thêm/thay thế

```
ROOT/
├── middleware.ts                         
└── src/
    ├── stores/
    │   └── auth.ts                    
    ├── hooks/
    │   ├── useAdminGuard.ts              
    │   └── useAuth.ts                    
    ├── lib/
    │   └── api.ts                        
    └── app/
        ├── admin/
        │   └── layout.tsx                
        └── api/
            └── auth/
                ├── login/route.ts         
                ├── refresh/route.ts       
                └── logout/route.ts        
```

---

## Bước 1: Cài dependencies

npm install zustand jose

---

## Bước 2: Cập nhật .env

```env
# .env.local (frontend)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Phải GIỐNG với JWT_ADMIN_SECRET bên NestJS
JWT_ADMIN_SECRET=your-admin-secret-here
JWT_SECRET=your-secret-here

# URL nội bộ gọi NestJS (không expose ra client)
API_URL=http://localhost:3001
```

---

## Bước 3: Cập nhật trang /login

```tsx
// src/app/login/page.tsx (hoặc pages/login.tsx)
'use client'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { login, isLoading, error } = useAuth()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    await login({
      email:    form.get('email') as string,
      password: form.get('password') as string,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email"    type="email"    required />
      <input name="password" type="password" required />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  )
}
```

---

## Bước 4: Dùng useAdminGuard trong admin pages (nếu cần)

```tsx
// src/app/admin/page.tsx (hoặc bất kỳ admin page nào)
'use client'
import { useAdminGuard } from '@/hooks/useAdminGuard'

export default function AdminDashboard() {
  const { isReady } = useAdminGuard()

  if (!isReady) return <div>Đang kiểm tra quyền truy cập...</div>

  return <div>Admin Dashboard</div>
}
```

---

## Bước 5: Logout

```tsx
import { useLogout } from '@/hooks/useAdminGuard'

export function LogoutButton() {
  const logout = useLogout()
  return <button onClick={logout}>Đăng xuất</button>
}
```

---

## Luồng hoạt động

```
User truy cập /admin
  ↓
[1] middleware.ts (Edge)
    → Đọc cookie admin_access_token
    → Verify JWT với jose
    → Kiểm tra role=Admin && scope=admin
    → Nếu sai/hết hạn → redirect /login
    → Nếu OK → inject x-user-* headers
  ↓
[2] src/app/admin/layout.tsx (Server Component)
    → Đọc x-user-role từ headers()
    → Double-check role
  ↓
[3] useAdminGuard() (Client)
    → Kiểm tra isAuthenticated trong Zustand store
    → Nếu store empty (F5) → middleware đã chặn rồi, đây chỉ là fallback
  ↓
Page render ✓
```

---

## Lưu ý quan trọng

- **Token KHÔNG lưu trong localStorage** — nằm trong HttpOnly cookie
- **HttpOnly cookie** không đọc được từ JavaScript → an toàn khỏi XSS
- **`credentials: 'include'`** trong apiFetch → cookie tự đính vào mọi request
- **Auto-refresh**: khi API trả 401, apiFetch tự gọi `/api/auth/refresh` rồi retry
- **Zustand sessionStorage**: tự xoá khi đóng tab, không persist qua session


