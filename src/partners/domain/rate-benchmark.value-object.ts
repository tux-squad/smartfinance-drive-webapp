/**
 * Value Object representing an annual effective rate (TEA) benchmark for a loan term.
 */
export class RateBenchmark {
  constructor(
    public readonly loanTermMonths: number,
    public readonly annualEffectiveRate: number,
    public readonly monthlyCreditLifeInsuranceRate: number = 0.05
  ) {}

  get formattedTea(): string {
    return `${this.annualEffectiveRate.toFixed(2)}%`
  }

  get formattedInsuranceRate(): string {
    return `${this.monthlyCreditLifeInsuranceRate.toFixed(2)}%`
  }
}
