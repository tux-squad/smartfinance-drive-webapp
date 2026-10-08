/**
 * Command used by the Profiles application layer to create a new client profile (API Doc 2.1).
 */
export class CreateProfileCommand {
  public userId?: string
  public email: string
  public nationalId: string
  public fullLegalNames: string
  public dateOfBirth: string
  public phoneCountryCode: string
  public mobilePhone: string
  public monthlyIncomeAmount: number
  public monthlyIncomeCurrency: string
  public employmentStatus: string

  // Legacy field support
  public firstName?: string
  public lastName?: string
  public dni?: string
  public phoneNumber?: string
  public currency?: string

  constructor(params: {
    userId?: string
    email: string
    nationalId?: string
    fullLegalNames?: string
    dateOfBirth?: string
    phoneCountryCode?: string
    mobilePhone?: string
    monthlyIncomeAmount?: number
    monthlyIncomeCurrency?: string
    employmentStatus?: string
    // Legacy support
    firstName?: string
    lastName?: string
    dni?: string
    phoneNumber?: string
    currency?: string
  }) {
    this.userId = params.userId
    this.email = params.email
    this.nationalId = params.nationalId || params.dni || ''
    this.fullLegalNames = params.fullLegalNames || `${params.firstName || ''} ${params.lastName || ''}`.trim()
    this.dateOfBirth = params.dateOfBirth || ''
    this.phoneCountryCode = params.phoneCountryCode || '+51'
    this.mobilePhone = params.mobilePhone || (params.phoneNumber ? params.phoneNumber.replace(/\D/g, '').slice(-9) : '')
    this.monthlyIncomeAmount = params.monthlyIncomeAmount || 0.0
    this.monthlyIncomeCurrency = params.monthlyIncomeCurrency || params.currency || 'PEN'
    this.employmentStatus = params.employmentStatus || 'EMPLOYED'

    this.firstName = params.firstName
    this.lastName = params.lastName
    this.dni = params.dni
    this.phoneNumber = params.phoneNumber
    this.currency = params.currency
  }
}
