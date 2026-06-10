// src/app/admin/layout.tsx — SERVER COMPONENT
// Lớp 2: double-check sau middleware

import { headers }             from 'next/headers'
import { redirect }            from 'next/navigation'
import AdminLayoutClient       from '../../components/admin/layout/AdminLayout'
import { AdminSocketProvider } from '../../components/admin/AdminSocketProvider'

export default async function AdminRootLayout({
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