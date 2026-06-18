"use client"
// src/app/lookup/page.tsx
import { useCallback } from 'react'
import { BookingItem } from '../../types/booking'
import { useLookupAuth } from '../../hooks/lookup/useLookupAuth'
import { useBookingManager } from '../../hooks/lookup/useBookingManager'
import { PageHeader }          from '../../sections/lookup/PageHeader'
import { LookupFormSection }   from '../../sections/lookup/LookupFormSection'
import { BookingListSection }  from '../../sections/lookup/BookingListSection'
import { OtpModal }            from '../../components/lookup/OtpModal'
import { EditBookingModal }    from '../../components/lookup/EditBookingModal'
import { CancelConfirmModal }  from '../../components/lookup/CancelConfirmModal'
import { NotificationModal }   from '../../components/lookup/NotificationModal'

export default function LookupPage() {
  const manager = useBookingManager()

  // Callback nhận bookings + token sau khi auth thành công
  const handleAuthSuccess = useCallback(
    (bookings: BookingItem[], _token: string) => {
      manager.setBookings(bookings)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const auth = useLookupAuth(handleAuthSuccess)

  // Wrap handleVerifyOtpSubmit để bắt lỗi và hiện notification
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    try {
      await auth.handleVerifyOtpSubmit(e)
    } catch (err: any) {
      manager.setNotification({
        type: 'error',
        title: 'Mã xác thực sai',
        message: err?.message || 'Mã OTP không chính xác hoặc đã hết hạn hiệu lực.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2520] pb-20 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader />
        {!auth.isAuthenticated ? (
          <LookupFormSection
            phoneInput={auth.phoneInput}
            isLoading={auth.isLoading}
            errorMsg={auth.errorMsg}
            onPhoneChange={auth.setPhoneInput}
            onSubmit={auth.handleLookupSubmit}
          />
        ) : (
          <BookingListSection
            phoneInput={auth.phoneInput}
            filterTab={manager.filterTab}
            filteredBookings={manager.filteredBookings}
            displayedBookings={manager.displayedBookings}
            visibleCount={manager.visibleCount}
            onFilterTabChange={manager.setFilterTab}
            onLoadMore={() => manager.setVisibleCount(prev => prev + 5)}
            onEdit={manager.openEditModal}
            onCancel={manager.openCancelConfirmation}
            onLogout={auth.handleLogout}
          />
        )}
        {/* ── Modals ── */}
        {auth.showOtpModal && (
          <OtpModal
            phoneInput={auth.phoneInput}
            otpInput={auth.otpInput}
            isVerifyingOtp={auth.isVerifyingOtp}
            onOtpChange={auth.setOtpInput}
            onSubmit={handleVerifyOtpSubmit}
            onClose={() => auth.setShowOtpModal(false)}
          />
        )}
        {manager.editingBooking && (
          <EditBookingModal
            booking={manager.editingBooking}
            editName={manager.editName}
            editPhone={manager.editPhone}
            editDate={manager.editDate}
            editTime={manager.editTime}
            editNote={manager.editNote}
            editReason={manager.editReason}
            isSavingEdit={manager.isSavingEdit}
            onNameChange={manager.setEditName}
            onPhoneChange={manager.setEditPhone}
            onDateChange={manager.setEditDate}
            onTimeChange={manager.setEditTime}
            onNoteChange={manager.setEditNote}
            onReasonChange={manager.setEditReason}
            onSave={() => manager.handleSaveEdit(auth.managementToken!, auth.handleLogout)}
            onClose={manager.closeEditModal}
          />
        )}
        {manager.cancellingBookingId && (
          <CancelConfirmModal
            isCancelling={manager.isCancelling}
            onConfirm={() => manager.handleExecuteCancel(auth.managementToken!, auth.handleLogout)}
            onClose={manager.closeCancelConfirmation}
          />
        )}
        {manager.notification && (
          <NotificationModal
            notification={manager.notification}
            onClose={() => manager.setNotification(null)}
          />
        )}
      </div>
    </div>
  )
}