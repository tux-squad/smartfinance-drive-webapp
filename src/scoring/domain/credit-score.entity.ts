/**
 * CreditScore Domain Entity representing a credit risk assessment result.
 */
export class CreditScore {
  constructor(
    public readonly id: string,
    public readonly profileId: string,
    public readonly score: number,
    public readonly riskTier: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | string,
    public readonly maxRecommendedLoanAmount: number,
    public readonly currency: string = 'USD'
  ) {}

  /**
   * Human-readable label for Risk Tier.
   */
  get riskTierLabel(): string {
    switch (this.riskTier) {
      case 'LOW_RISK':
        return 'Bajo Riesgo (Apto)'
      case 'MEDIUM_RISK':
        return 'Riesgo Moderado (Sujeto a evaluación)'
      case 'HIGH_RISK':
        return 'Alto Riesgo (Requiere aval/garantía)'
      default:
        return this.riskTier
    }
  }

  /**
   * UI Severity level for PrimeVue tags ('success' | 'warn' | 'danger').
   */
  get riskTierSeverity(): 'success' | 'warn' | 'danger' {
    switch (this.riskTier) {
      case 'LOW_RISK':
        return 'success'
      case 'MEDIUM_RISK':
        return 'warn'
      case 'HIGH_RISK':
        return 'danger'
      default:
        return 'warn'
    }
  }

  /**
   * Formatted maximum recommended loan amount.
   */
  get formattedMaxLoan(): string {
    const symbol = this.currency === 'USD' ? '$' : 'S/'
    return `${symbol} ${this.maxRecommendedLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  /**
   * Normalized score percentage (0-100%) for gauge meter display on 300-850 scale.
   */
  get scorePercentage(): number {
    const minScore = 300
    const maxScore = 850
    const clamped = Math.min(maxScore, Math.max(minScore, this.score))
    return Math.round(((clamped - minScore) / (maxScore - minScore)) * 100)
  }
}
