/**
 * Domain Command representing the request to calculate technical vehicle depreciation (API Doc 7.1).
 */
export class CalculateDepreciationCommand {
  constructor(
    public readonly vehicleId: string,
    public readonly years: number = 5
  ) {}
}
