import { YearlyDepreciation } from './yearly-depreciation.entity'

/**
 * Domain Entity representing the full multi-year Vehicle Depreciation Projection.
 */
export class DepreciationProjection {
  constructor(
    public readonly id: string,
    public readonly initialValueAmount: number,
    public readonly currency: string,
    public readonly manufactureYear: number,
    public readonly annualDepreciationRatePct: number,
    public readonly projectionYears: number,
    public readonly projectedResidualValue: number,
    public readonly totalDepreciationAmount: number,
    public readonly yearlyProjections: YearlyDepreciation[],
    public readonly calculatedAt: string,
    public readonly vehicleId?: string
  ) {}

  /**
   * Returns formatted initial price with currency symbol.
   */
  get formattedInitialValue(): string {
    const symbol = this.currency === 'USD' ? '$' : 'S/';
    return `${symbol} ${this.initialValueAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  /**
   * Returns formatted projected residual value with currency symbol.
   */
  get formattedResidualValue(): string {
    const symbol = this.currency === 'USD' ? '$' : 'S/';
    return `${symbol} ${this.projectedResidualValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  /**
   * Returns percentage of value preserved after projection period.
   */
  get preservedValuePercentage(): number {
    if (!this.initialValueAmount) return 0;
    return Number(((this.projectedResidualValue / this.initialValueAmount) * 100).toFixed(2));
  }
}
