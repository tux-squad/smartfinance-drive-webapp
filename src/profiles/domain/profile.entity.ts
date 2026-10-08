/**
 * Client Profile aggregate root representation used by the client domain model (API Doc 2.1 - 2.4).
 */
export class Profile {
  public id: string
  public userId: string
  public email: string
  public nationalId: string
  public fullLegalNames: string
  public dateOfBirth: string
  public phoneCountryCode: string
  public mobilePhone: string
  public monthlyIncomeAmount: number
  public monthlyIncomeCurrency: string
  public employmentStatus: string

  private _legacyFirstName?: string
  private _legacyLastName?: string

  constructor(params: {
    id: string
    userId: string
    email: string
    nationalId?: string
    fullLegalNames?: string
    dateOfBirth?: string
    phoneCountryCode?: string
    mobilePhone?: string
    monthlyIncomeAmount?: number
    monthlyIncomeCurrency?: string
    employmentStatus?: string
    // Legacy compatibility fields
    firstName?: string
    lastName?: string
    dni?: string
    phoneNumber?: string
    currency?: string
  }) {
    this.id = params.id
    this.userId = params.userId
    this.email = params.email
    this.nationalId = params.nationalId || params.dni || ''
    this.fullLegalNames = params.fullLegalNames || `${params.firstName || ''} ${params.lastName || ''}`.trim()
    this.dateOfBirth = params.dateOfBirth || '1995-01-01'
    this.phoneCountryCode = params.phoneCountryCode || '+51'
    this.mobilePhone = params.mobilePhone || (params.phoneNumber ? params.phoneNumber.replace(/\D/g, '').slice(-9) : '')
    this.monthlyIncomeAmount = params.monthlyIncomeAmount || 0.0
    this.monthlyIncomeCurrency = params.monthlyIncomeCurrency || params.currency || 'PEN'
    this.employmentStatus = params.employmentStatus || 'EMPLOYED'

    this._legacyFirstName = params.firstName
    this._legacyLastName = params.lastName
  }

  public get firstName(): string {
    if (this._legacyFirstName) return this._legacyFirstName
    const parts = this.fullLegalNames.split(' ').filter(Boolean)
    return parts[0] || ''
  }

  public get lastName(): string {
    if (this._legacyLastName) return this._legacyLastName
    const parts = this.fullLegalNames.split(' ').filter(Boolean)
    return parts.slice(1).join(' ') || ''
  }

  public get dni(): string {
    return this.nationalId
  }

  public get phoneNumber(): string {
    if (!this.mobilePhone) return ''
    return `${this.phoneCountryCode} ${this.mobilePhone}`.trim()
  }

  public get currency(): string {
    return this.monthlyIncomeCurrency
  }

  public get fullName(): string {
    return this.fullLegalNames || `${this.firstName} ${this.lastName}`.trim()
  }
}
