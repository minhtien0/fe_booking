// src/app/lookup/hooks/useBookingManager.ts
// Quản lý danh sách lịch hẹn: lọc, phân trang, chỉnh sửa, hủy lịch

import { useState, useMemo, useEffect, useCallback } from 'react'
import { apiFetch } from '../../lib/api'
import { BookingItem, FilterTab, NotificationState } from '../../types/booking'

const STORAGE_KEY_BOOKINGS = 'lk_mgmt_bookings'

interface UseBookingManagerReturn {
  // State
  bookings: BookingItem[]
  filterTab: FilterTab
  visibleCount: number
  filteredBookings: BookingItem[]
  displayedBookings: BookingItem[]

  // Edit state
  editingBooking: BookingItem | null
  editName: string
  editPhone: string
  editDate: string
  editTime: string
  editNote: string
  editReason: string
  isSavingEdit: boolean

  // Cancel state
  cancellingBookingId: number | null
  isCancelling: boolean

  // Notification
  notification: NotificationState | null

  // Setters
  setBookings: (bookings: BookingItem[]) => void
  setFilterTab: (tab: FilterTab) => void
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>
  setEditName: (v: string) => void
  setEditPhone: (v: string) => void
  setEditDate: (v: string) => void
  setEditTime: (v: string) => void
  setEditNote: (v: string) => void
  setEditReason: (v: string) => void
  setNotification: (n: NotificationState | null) => void

  // Actions
  openEditModal: (booking: BookingItem) => void
  closeEditModal: () => void
  handleSaveEdit: (managementToken: string, onLogout: () => void) => Promise<void>
  openCancelConfirmation: (id: number) => void
  closeCancelConfirmation: () => void
  handleExecuteCancel: (managementToken: string, onLogout: () => void) => Promise<void>
}

export function useBookingManager(): UseBookingManagerReturn {
  const [bookings, setBookingsState]       = useState<BookingItem[]>([])
  const [filterTab, setFilterTab]           = useState<FilterTab>('today')
  const [visibleCount, setVisibleCount]     = useState(5)

  const [editingBooking, setEditingBooking] = useState<BookingItem | null>(null)
  const [editName, setEditName]             = useState('')
  const [editPhone, setEditPhone]           = useState('')
  const [editDate, setEditDate]             = useState('')
  const [editTime, setEditTime]             = useState('')
  const [editNote, setEditNote]             = useState('')
  const [editReason, setEditReason]         = useState('')
  const [isSavingEdit, setIsSavingEdit]     = useState(false)

  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null)
  const [isCancelling, setIsCancelling]     = useState(false)

  const [notification, setNotification]     = useState<NotificationState | null>(null)

  // Reset visible count khi đổi tab
  useEffect(() => { setVisibleCount(5) }, [filterTab])

  // Cập nhật bookings và đồng bộ LocalStorage
  const setBookings = useCallback((next: BookingItem[]) => {
    setBookingsState(next)
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(next))
  }, [])

  // Bộ lọc chuẩn múi giờ địa phương
  const filteredBookings = useMemo(() => {
    const todayStr = new Date().toLocaleDateString('en-CA')
    return bookings.filter(item => {
      if (filterTab === 'today') return item.bookingDate === todayStr
      if (filterTab === 'upcoming') {
        return (
          (item.status === 'confirmed' || item.status === 'pending') &&
          item.bookingDate >= todayStr
        )
      }
      return true
    })
  }, [bookings, filterTab])

  const displayedBookings = useMemo(
    () => filteredBookings.slice(0, visibleCount),
    [filteredBookings, visibleCount]
  )

  const openEditModal = (booking: BookingItem) => {
    setEditingBooking(booking)
    setEditName(booking.customerName)
    setEditPhone(booking.customerPhone)
    setEditDate(booking.bookingDate)
    setEditTime(booking.slotStartTime)
    setEditNote(booking.note || '')
    setEditReason('')
  }

  const closeEditModal = () => setEditingBooking(null)

  const handleSaveEdit = async (managementToken: string, onLogout: () => void) => {
    if (!editingBooking) return
    if (!editReason.trim()) {
      setNotification({
        type: 'error',
        title: 'Thiếu thông tin bắt buộc',
        message: 'Vui lòng cung cấp lý do chỉnh sửa để phục vụ việc lưu vết lịch sử hệ thống.',
      })
      return
    }

    setIsSavingEdit(true)
    try {
      const responseData = await apiFetch<any>(
        `/bookings/gateway/update/${editingBooking.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${managementToken}`,
          },
          body: JSON.stringify({
            customerName: editName,
            customerPhone: editPhone,
            bookingDate: editDate,
            slotStartTime: editTime,
            note: editNote,
            editReason,
          }),
        }
      )

      const updatedObj = responseData?.data || responseData
      const updatedBookings = bookings.map(b =>
        b.id === editingBooking.id
          ? {
              ...b,
              customerName: editName,
              customerPhone: editPhone,
              bookingDate: editDate,
              slotStartTime: editTime,
              note: editNote,
              ...(typeof updatedObj === 'object' ? updatedObj : {}),
            }
          : b
      )
      setBookings(updatedBookings)
      setEditingBooking(null)
      setNotification({
        type: 'success',
        title: 'Cập nhật thành công',
        message: `Lịch hẹn mã ${editingBooking.bookingCode || ''} đã được điều chỉnh thành công.`,
      })
    } catch (err: any) {
      if (err?.message?.includes('hết hạn') || err?.status === 401) onLogout()
      setNotification({
        type: 'error',
        title: 'Cập nhật thất bại',
        message: err?.message || 'Phiên làm việc đã hết hạn. Vui lòng thử lại.',
      })
    } finally {
      setIsSavingEdit(false)
    }
  }

  const openCancelConfirmation  = (id: number) => setCancellingBookingId(id)
  const closeCancelConfirmation = () => setCancellingBookingId(null)

  const handleExecuteCancel = async (managementToken: string, onLogout: () => void) => {
    if (!cancellingBookingId) return
    setIsCancelling(true)
    try {
      const responseData = await apiFetch<any>(
        `/bookings/${cancellingBookingId}/cancel`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${managementToken}`,
          },
          body: JSON.stringify({
            reason: 'Khách hàng chủ động hủy qua trang tra cứu trực tuyến.',
          }),
        }
      )

      const updatedObj = responseData?.data || responseData
      const updatedBookings = bookings.map(b =>
        b.id === cancellingBookingId
          ? { ...b, status: 'cancelled' as const, ...(typeof updatedObj === 'object' ? updatedObj : {}) }
          : b
      )
      setBookings(updatedBookings)
      setCancellingBookingId(null)
      setNotification({
        type: 'success',
        title: 'Hủy lịch thành công',
        message: 'Hệ thống đã giải phóng slot trống của bạn thành công!',
      })
    } catch (err: any) {
      if (err?.message?.includes('hết hạn') || err?.status === 401) onLogout()
      setCancellingBookingId(null)
      setNotification({
        type: 'error',
        title: 'Hủy lịch thất bại',
        message: err?.message || 'Hệ thống gặp trục trặc, phiên quản lý lịch hẹn có thể đã hết hạn.',
      })
    } finally {
      setIsCancelling(false)
    }
  }

  return {
    bookings,
    filterTab,
    visibleCount,
    filteredBookings,
    displayedBookings,
    editingBooking,
    editName,
    editPhone,
    editDate,
    editTime,
    editNote,
    editReason,
    isSavingEdit,
    cancellingBookingId,
    isCancelling,
    notification,
    setBookings,
    setFilterTab,
    setVisibleCount,
    setEditName,
    setEditPhone,
    setEditDate,
    setEditTime,
    setEditNote,
    setEditReason,
    setNotification,
    openEditModal,
    closeEditModal,
    handleSaveEdit,
    openCancelConfirmation,
    closeCancelConfirmation,
    handleExecuteCancel,
  }
}