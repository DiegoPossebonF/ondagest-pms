export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  createdAt?: Date
  updatedAt?: Date
}

export interface UserResponse {
  id: string
  name: string
  email: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

export interface Guest {
  id: string
  name: string
  email: string
  phone?: string
  bookings: Booking[]
  createdAt: Date
  updatedAt: Date
}

export interface AccommodationType {
  id: string
  name: string
  description: string | null
  units?: AccommodationUnit[]
  rates?: Rate[]
  createdAt?: Date
  updatedAt?: Date
}

export interface AccommodationUnit {
  id: string
  number: string
  type: AccommodationType
  typeId: string
  bookings?: Booking[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Rate {
  id: string
  typeId: string
  name: string
  value: number
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  guest: Guest
  guestId: string
  unit: AccommodationUnit
  unitId: string
  startDate: Date
  endDate: Date
  status: BookingStatus
  payment?: Payment
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  booking: Booking
  bookingId: string
  amount: number
  status: PaymentStatus
  createdAt: Date
  updatedAt: Date
}

export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
