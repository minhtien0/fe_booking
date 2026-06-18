// src/app/lookup/hooks/useLookupAuth.ts
import { useState, useEffect } from 'react'
import { apiFetch } from '../../lib/api'
import { BookingItem, LookupOtpVerifyResponse } from '../../types/booking'
import { getLookupBookings } from './../../lib/bookingApi';

const STORAGE_KEYS = {
  TOKEN: 'lk_mgmt_token',
  PHONE: 'lk_mgmt_phone',
  CODE: 'lk_mgmt_code',
  BOOKINGS: 'lk_mgmt_bookings',
} as const

interface UseLookupAuthReturn {
  // State
  isAuthenticated: boolean
  phoneInput: string
  codeInput: string
  isLoading: boolean
  errorMsg: string | null
  showOtpModal: boolean
  otpInput: string
  isVerifyingOtp: boolean
  managementToken: string | null

  // Setters
  setPhoneInput: (v: string) => void
  setCodeInput: (v: string) => void
  setOtpInput: (v: string) => void
  setShowOtpModal: (v: boolean) => void

  // Actions
  handleLookupSubmit: (e: React.FormEvent) => Promise<void>
  handleVerifyOtpSubmit: (e: React.FormEvent) => Promise<void>
  handleLogout: () => void

  // Callback khi xác thực OTP thành công để page nhận bookings
  onAuthSuccess: (bookings: BookingItem[], token: string) => void
}

export function useLookupAuth(
  onAuthSuccess: (bookings: BookingItem[], token: string) => void
): Omit<UseLookupAuthReturn, 'onAuthSuccess'> {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [phoneInput, setPhoneInput] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [managementToken, setManagementToken] = useState<string | null>(null)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpInput, setOtpInput] = useState('')
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  // Khôi phục phiên làm việc từ LocalStorage khi khởi chạy trang
  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const savedPhone = localStorage.getItem(STORAGE_KEYS.PHONE)
    const savedCode = localStorage.getItem(STORAGE_KEYS.CODE)
    const cachedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
    if (savedToken && savedPhone && cachedBookings) {
      const bookings: BookingItem[] = JSON.parse(cachedBookings)
      setManagementToken(savedToken)
      setPhoneInput(savedPhone)
      setCodeInput(savedCode || '')
      setIsAuthenticated(true)
      onAuthSuccess(bookings, savedToken)
    }
  }, [])

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneInput) {
      setErrorMsg('Vui lòng điền số điện thoại đặt lịch.')
      return
    }
    setErrorMsg(null)

    // Bypass OTP nếu token cũ còn hợp lệ và thông tin khớp
    const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const savedPhone = localStorage.getItem(STORAGE_KEYS.PHONE)
    const cachedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS)

    if (
      savedToken &&
      savedPhone === phoneInput &&
      cachedBookings
    ) {
      const bookings: BookingItem[] = JSON.parse(cachedBookings)
      setManagementToken(savedToken)
      setIsAuthenticated(true)
      onAuthSuccess(bookings, savedToken)
      return;
    }

    setIsLoading(true)
    try {
      await apiFetch('/bookings/lookup/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone: phoneInput, code: codeInput || undefined }),
      })
      setShowOtpModal(true)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Không thể yêu cầu mã OTP. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpInput || otpInput.length < 4) return

    setIsVerifyingOtp(true)
    try {
      const response = await apiFetch<LookupOtpVerifyResponse>(
        '/bookings/lookup/verifylookup-otp',
        {
          method: 'POST',
          body: JSON.stringify({
            phone: phoneInput,
            code: codeInput || undefined,
            otpCode: otpInput,
          }),
        }
      )

      const token = response.managementToken;
      const fetchedBookings = await getLookupBookings(token);
      if (fetchedBookings.length === 0) {
        setErrorMsg('Không tìm thấy dữ liệu đặt lịch phù hợp.');
        setShowOtpModal(false)
        return
      }

      // Lưu phiên ngắn hạn xuống LocalStorage
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.managementToken)
      localStorage.setItem(STORAGE_KEYS.PHONE, phoneInput)
      localStorage.setItem(STORAGE_KEYS.CODE, codeInput || '')
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(fetchedBookings))

      setManagementToken(response.managementToken)
      setIsAuthenticated(true)
      setShowOtpModal(false)
      setOtpInput('')
      onAuthSuccess(fetchedBookings, response.managementToken)
    } catch (err: any) {
      throw err
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleLogout = () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
    setManagementToken(null)
    setIsAuthenticated(false)
    setCodeInput('')
    onAuthSuccess([], '')
  }

  return {
    isAuthenticated,
    phoneInput,
    codeInput,
    isLoading,
    errorMsg,
    showOtpModal,
    otpInput,
    isVerifyingOtp,
    managementToken,
    setPhoneInput,
    setCodeInput,
    setOtpInput,
    setShowOtpModal,
    handleLookupSubmit,
    handleVerifyOtpSubmit,
    handleLogout,
  }
}