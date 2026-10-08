/**
 * Domain entity representing an AI Financial Advisory consultation (Gemini).
 */
export class Consultation {
  public readonly recommendedCategory: string | null
  public readonly recommendedVehicleCategory: string | null

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly prompt: string,
    public readonly recommendationText: string,
    recommendedCategory: string | null = null,
    public readonly estimatedMaxMonthlyFee: number = 0,
    public readonly createdAt: string = new Date().toISOString(),
    recommendedVehicleCategory?: string | null
  ) {
    const category = recommendedVehicleCategory || recommendedCategory || null
    this.recommendedCategory = category
    this.recommendedVehicleCategory = category
  }

  get formattedMaxFee(): string {
    return `S/ ${this.estimatedMaxMonthlyFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  get formattedTime(): string {
    try {
      const d = new Date(this.createdAt)
      return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return this.createdAt
    }
  }
}
