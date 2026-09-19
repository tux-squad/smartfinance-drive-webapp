/**
 * Domain Entity representing a single year's technical depreciation step.
 */
export class YearlyDepreciation {
  constructor(
    public readonly yearNumber: number,
    public readonly calendarYear: number,
    public readonly startValue: number,
    public readonly depreciationAmount: number,
    public readonly endValue: number,
    public readonly accumulatedDepreciation: number,
    public readonly remainingValuePercentage: number
  ) {}
}
