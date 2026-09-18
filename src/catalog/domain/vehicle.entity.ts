/**
 * Vehicle Domain Entity representing a vehicle in the catalog.
 */
export class Vehicle {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly financialEntityId: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly manufactureYear: number,
    public readonly condition: 'NEW' | 'USED' | string,
    public readonly priceAmount: number,
    public readonly currency: string,
    public readonly imagePath?: string
  ) {}

  /**
   * Returns formatted price with currency symbol.
   */
  get formattedPrice(): string {
    const symbol = this.currency === 'USD' ? '$' : 'S/';
    return `${symbol} ${this.priceAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  /**
   * Returns full displayName (Brand + Model + Year).
   */
  get displayName(): string {
    return `${this.brand} ${this.model} (${this.manufactureYear})`;
  }
}
