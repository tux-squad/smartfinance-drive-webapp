/**
 * Domain Command representing the request to calculate technical vehicle depreciation.
 */
export class CalculateDepreciationCommand {
  constructor(
    public readonly initialValueAmount: number,
    public readonly currency: string,
    public readonly manufactureYear: number,
    public readonly annualDepreciationRatePct: number = 10,
    public readonly projectionYears: number = 5,
    public readonly vehicleId?: string
  ) {}
}
