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
}
