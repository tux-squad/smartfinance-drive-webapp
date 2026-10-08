/**
 * Value Object representing a single period item in a loan payment schedule.
 */
export class ScheduleItem {
  constructor(
    public readonly periodNumber: number,
    public readonly paymentDate: string,
    public readonly initialBalance: number,
    public readonly interestPayment: number,
    public readonly principalAmortization: number,
    public readonly creditLifeInsurance: number,
    public readonly vehicleInsurance: number,
    public readonly totalMonthlyPayment: number,
    public readonly finalBalance: number
  ) {}

  get dueDate(): string {
    return this.paymentDate
  }

  get initialBalanceAmount(): number {
    return this.initialBalance
  }

  get interestPaymentAmount(): number {
    return this.interestPayment
  }

  get principalAmortizationAmount(): number {
    return this.principalAmortization
  }

  get creditLifeInsuranceAmount(): number {
    return this.creditLifeInsurance
  }

  get vehicleInsuranceAmount(): number {
    return this.vehicleInsurance
  }

  get totalInstallmentAmount(): number {
    return this.totalMonthlyPayment
  }

  get finalBalanceAmount(): number {
    return this.finalBalance
  }
}
