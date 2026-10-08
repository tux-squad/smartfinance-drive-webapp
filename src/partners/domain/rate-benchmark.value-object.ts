/**
 * Value Object representing an annual effective rate (TEA) benchmark for a loan term.
 */
export class RateBenchmark {
  constructor(
    public readonly loanTermMonths: number,
    public readonly annualEffectiveRate: number,
    public readonly monthlyCreditLifeInsuranceRate: number = 0.05,
    public readonly id?: string,
    public readonly rateType?: string,
    public readonly currency?: string,
    public readonly sourceLabel?: string,
    public readonly sourceUrl?: string,
    public readonly effectiveFrom?: string
  ) {}

  get formattedTea(): string {
    return `${this.annualEffectiveRate.toFixed(2)}%`
  }

  get formattedInsuranceRate(): string {
    return `${this.monthlyCreditLifeInsuranceRate.toFixed(2)}%`
  }
}
