"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import type { Booking, BookingStatus, ApiStatsResponse } from "../../../types/admin/booking"
import { TODAY, PAGE_SIZE } from "../../../constants/admin/bookingConfig"

interface UseBookingFilterReturn {
  // filter state
  search:        string
  filterStatus:  "all" | BookingStatus
  filterBarber:  string
  filterService: string
  selectedDate:  string
  activeTab:     "all" | BookingStatus | "today"
  page:          number

  // setters
  setSearch:        (v: string) => void
  setFilterStatus:  (v: "all" | BookingStatus) => void
  setFilterBarber:  (v: string) => void
  setFilterService: (v: string) => void
  setSelectedDate:  (v: string) => void
  setActiveTab:     (v: "all" | BookingStatus | "today") => void
  setPage:          (v: number | ((p: number) => number)) => void
  handleReset:      () => void

  // derived
  filtered:      Booking[]
  paginated:     Booking[]
  totalPages:    number
  bookingDates:  Set<string>
  serviceOptions: string[]
  barberOptions:  string[]
  counts: {
    all:       number
    today:     number
    pending:   number
    confirmed: number
    completed: number
    cancelled: number
  }
}

export function useBookingFilter(
  bookings: Booking[],
  dashboardStats: ApiStatsResponse | null,
): UseBookingFilterReturn {
  const [search,        setSearch]        = useState("")
  const [filterStatus,  setFilterStatus]  = useState<"all" | BookingStatus>("all")
  const [filterBarber,  setFilterBarber]  = useState("all")
  const [filterService, setFilterService] = useState("all")
  const [selectedDate,  setSelectedDate]  = useState("")
  const [activeTab,     setActiveTab]     = useState<"all" | BookingStatus | "today">("all")
  const [page,          setPage]          = useState(1)

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setPage(1)
  }, [search, filterStatus, filterBarber, filterService, activeTab, selectedDate])

  const handleReset = useCallback(() => {
    setSearch(""); setFilterStatus("all"); setFilterBarber("all")
    setFilterService("all"); setSelectedDate("")
  }, [])

  const bookingDates = useMemo(
    () => new Set(bookings.map(b => b.date)),
    [bookings],
  )

  const serviceOptions = useMemo(
    () => [...new Set(bookings.map(b => b.service))].sort((a, b) => a.localeCompare(b)),
    [bookings],
  )

  const barberOptions = useMemo(
    () => [...new Set(bookings.map(b => b.barber))].sort((a, b) => a.localeCompare(b)),
    [bookings],
  )

  const filtered = useMemo(() => {
    let list = bookings
    if (selectedDate)          list = list.filter(b => b.date === selectedDate)
    if (search)                list = list.filter(b =>
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.code.toLowerCase().includes(search.toLowerCase()),
    )
    if (filterStatus  !== "all") list = list.filter(b => b.status === filterStatus)
    if (filterBarber  !== "all") list = list.filter(b => b.barber === filterBarber)
    if (filterService !== "all") list = list.filter(b => b.service === filterService)

    if (activeTab === "today")     list = list.filter(b => b.date === TODAY)
    else if (activeTab !== "all")  list = list.filter(b => b.status === activeTab)

    return list
  }, [bookings, selectedDate, search, filterStatus, filterBarber, filterService, activeTab])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  const counts = useMemo(() => ({
    all:       dashboardStats?.counts.all       ?? bookings.length,
    today:     dashboardStats?.counts.today     ?? bookings.filter(b => b.date === TODAY).length,
    pending:   dashboardStats?.counts.pending   ?? bookings.filter(b => b.status === "pending").length,
    confirmed: dashboardStats?.counts.confirmed ?? bookings.filter(b => b.status === "confirmed").length,
    completed: dashboardStats?.counts.done      ?? bookings.filter(b => b.status === "completed").length,
    cancelled: dashboardStats?.counts.cancelled ?? bookings.filter(b => b.status === "cancelled").length,
  }), [bookings, dashboardStats])

  return {
    search, filterStatus, filterBarber, filterService,
    selectedDate, activeTab, page,
    setSearch, setFilterStatus, setFilterBarber, setFilterService,
    setSelectedDate, setActiveTab, setPage, handleReset,
    filtered, paginated, totalPages,
    bookingDates, serviceOptions, barberOptions, counts,
  }
}