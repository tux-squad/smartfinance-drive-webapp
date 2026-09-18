import { ScheduleItem } from './schedule-item.value-object'

/**
 * Simulation Domain Entity representing a vehicle loan simulation and its calculated metrics.
 */
export class Simulation {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly userId: string,
    public readonly vehicleId: string,
    public readonly financialEntityId: string,
    public readonly vehiclePriceAmount: number,
    public readonly currency: string,
    public readonly downPaymentPercentage: number,
    public readonly balloonPaymentPercentage: number,
    public readonly annualEffectiveRate: number,
    public readonly monthlyCreditLifeInsuranceRate: number,
    public readonly vehicleInsuranceFeeAmount: number,
    public readonly vehicleInsuranceType: string,
    public readonly loanTermMonths: number,
    public readonly gracePeriodType: string,
    public readonly gracePeriodMonths: number,
    public readonly initialFeesAmount: number,
    public readonly discountRate: number,
    public readonly startDate: string,
    public readonly loanAmount: number,
    public readonly monthlyPaymentAmount: number,
    public readonly tcea: number,
    public readonly npv: number = 0,
    public readonly irr: number = 0,
    public readonly schedule: ScheduleItem[] = []
  ) {}

  /**
   * Calculated down payment amount.
   */
  get downPaymentAmount(): number {
    return this.vehiclePriceAmount * (this.downPaymentPercentage / 100)
  }

  /**
   * Formatted currency symbol ($ or S/).
   */
  get currencySymbol(): string {
    return this.currency === 'USD' ? '$' : 'S/'
  }

  /**
   * Formatted loan amount string.
   */
  get formattedLoanAmount(): string {
    return `${this.currencySymbol} ${this.loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  /**
   * Formatted monthly payment string.
   */
  get formattedMonthlyPayment(): string {
    return `${this.currencySymbol} ${this.monthlyPaymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  /**
   * Formatted TCEA percentage.
   */
  get formattedTcea(): string {
    return `${this.tcea.toFixed(2)}%`
  }
}
