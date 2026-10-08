/**
 * DTO Payload interfaces for Profiles API endpoints (/api/v1/profiles).
 * API Doc 2.1 & 2.4.
 */
export interface CreateProfileRequestResource {
  userId: string
  email: string
  nationalId: string
  fullLegalNames: string
  dateOfBirth: string
  phoneCountryCode: string
  mobilePhone: string
  monthlyIncomeAmount: number
  monthlyIncomeCurrency: string
  employmentStatus: string
  // Optional legacy fields for resilience
  firstName?: string
  lastName?: string
  dni?: string
  phoneNumber?: string
  currency?: string
}

export interface UpdateProfileRequestResource {
  email: string
  nationalId: string
  fullLegalNames: string
  dateOfBirth: string
  phoneCountryCode: string
  mobilePhone: string
  monthlyIncomeAmount: number
  monthlyIncomeCurrency: string
  employmentStatus: string
  // Optional legacy fields for resilience
  firstName?: string
  lastName?: string
  dni?: string
  phoneNumber?: string
  currency?: string
}

export interface ProfileResponseResource {
  id: string
  userId: string
  email: string
  nationalId: string
  fullLegalNames: string
  dateOfBirth?: string
  phoneCountryCode?: string
  mobilePhone?: string
  monthlyIncomeAmount?: number
  monthlyIncomeCurrency?: string
  employmentStatus?: string
  // Optional legacy aliases for backwards compatibility
  firstName?: string
  lastName?: string
  dni?: string
  phoneNumber?: string
  currency?: string
}
