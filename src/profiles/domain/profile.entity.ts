/**
 * Client Profile aggregate root representation used by the client domain model.
 */
export class Profile {
  public id: string
  public userId: string
  public firstName: string
  public lastName: string
  public email: string
  public dni: string
  public phoneNumber: string
  public monthlyIncomeAmount: number
  public currency: string

  constructor(params: {
    id: string
    userId: string
    firstName: string
    lastName: string
    email: string
    dni: string
    phoneNumber?: string
    monthlyIncomeAmount?: number
    currency?: string
  }) {
    this.id = params.id
    this.userId = params.userId
    this.firstName = params.firstName
    this.lastName = params.lastName
    this.email = params.email
    this.dni = params.dni
    this.phoneNumber = params.phoneNumber || ''
    this.monthlyIncomeAmount = params.monthlyIncomeAmount || 0.0
    this.currency = params.currency || 'PEN'
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim()
  }
}
