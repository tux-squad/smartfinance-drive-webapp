/**
 * DTO Payload interfaces for Profiles API endpoints (/api/v1/profiles).
 */
export interface CreateProfileRequestResource {
  firstName: string
  lastName: string
  email: string
  dni: string
  phoneNumber?: string
  monthlyIncomeAmount?: number
  currency?: string
}

export interface UpdateProfileRequestResource {
  firstName: string
  lastName: string
  email: string
  dni: string
  phoneNumber?: string
  monthlyIncomeAmount?: number
  currency?: string
}

export interface ProfileResponseResource {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  dni: string
  phoneNumber?: string
  monthlyIncomeAmount?: number
  currency?: string
}
