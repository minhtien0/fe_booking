// src/app/admin/layout.tsx — SERVER COMPONENT

import AdminLayoutClient       from '../../components/admin/layout/AdminLayout'
import { AdminSocketProvider } from '../../components/admin/AdminSocketProvider'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminSocketProvider>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </AdminSocketProvider>
  )
}