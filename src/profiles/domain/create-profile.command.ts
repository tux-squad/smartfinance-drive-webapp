/**
 * Command used by the Profiles application layer to create a new client profile.
 */
export class CreateProfileCommand {
  public firstName: string
  public lastName: string
  public email: string
  public dni: string
  public phoneNumber: string
  public monthlyIncomeAmount: number
  public currency: string

  constructor(params: {
    firstName: string
    lastName: string
    email: string
    dni: string
    phoneNumber?: string
    monthlyIncomeAmount?: number
    currency?: string
  }) {
    this.firstName = params.firstName
    this.lastName = params.lastName
    this.email = params.email
    this.dni = params.dni
    this.phoneNumber = params.phoneNumber || ''
    this.monthlyIncomeAmount = params.monthlyIncomeAmount || 0.0
    this.currency = params.currency || 'PEN'
  }
}
