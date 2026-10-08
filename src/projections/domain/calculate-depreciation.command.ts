/**
 * Domain Command representing the request to calculate technical vehicle depreciation (API Doc 2.33).
 */
export class CalculateDepreciationCommand {
  constructor(
    public readonly vehicleId: string,
    public readonly years: number = 5,
    public readonly initialVehiclePriceAmount?: number,
    public readonly currency?: string,
    public readonly manufactureYear?: number,
    public readonly motorizationType?: string,
    public readonly simulationId?: string,
    public readonly balloonPaymentAmount?: number
  ) {}
}
