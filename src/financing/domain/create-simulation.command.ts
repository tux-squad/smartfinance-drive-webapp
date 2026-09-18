/**
 * Command DTO encapsulating the payload for creating a vehicle credit simulation.
 */
export class CreateSimulationCommand {
  constructor(
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
    public readonly startDate: string
  ) {}
}
