/**
 * Domain Command representing the request to create a new Vehicle in the catalog.
 */
export class CreateVehicleCommand {
  constructor(
    public readonly brand: string,
    public readonly model: string,
    public readonly manufactureYear: number,
    public readonly condition: 'NEW' | 'USED' | string,
    public readonly priceAmount: number,
    public readonly currency: string,
    public readonly financialEntityId?: string
  ) {}
}
