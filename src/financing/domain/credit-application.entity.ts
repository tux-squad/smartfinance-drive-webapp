export type CreditApplicationStatus =
  | 'PENDING'
  | 'IN_REVIEW'
  | 'PRE_APPROVED'
  | 'APPROVED'
  | 'REJECTED'
  | 'DISBURSED'

/**
 * Domain entity representing a formal credit application submitted to a financial entity.
 */
export class CreditApplication {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly simulationId: string | null,
    public readonly financialEntityId: string | null,
    public readonly vehicleId: string | null,
    public readonly requestedAmount: number,
    public readonly currency: string,
    public readonly monthlyIncome: number,
    public readonly employmentStatus: string,
    public readonly status: CreditApplicationStatus | string,
    public readonly notes: string | null = null,
    public readonly reviewerNotes: string | null = null,
    public readonly createdAt: string = new Date().toISOString(),
    public readonly updatedAt: string = new Date().toISOString(),
    // Optional enriched fields for UI display
    public readonly vehicleTitle?: string,
    public readonly financialEntityName?: string
  ) {}

  get currencySymbol(): string {
    return this.currency === 'PEN' ? 'S/' : '$'
  }

  get formattedRequestedAmount(): string {
    return `${this.currencySymbol} ${this.requestedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  get formattedMonthlyIncome(): string {
    return `${this.currencySymbol} ${this.monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  get formattedDate(): string {
    try {
      const d = new Date(this.createdAt)
      return d.toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return this.createdAt
    }
  }

  get statusLabel(): string {
    switch (this.status) {
      case 'PENDING':
        return 'Pendiente'
      case 'IN_REVIEW':
        return 'En Evaluación'
      case 'PRE_APPROVED':
        return 'Pre-Aprobado'
      case 'APPROVED':
        return 'Aprobado'
      case 'REJECTED':
        return 'Rechazado'
      case 'DISBURSED':
        return 'Desembolsado'
      default:
        return this.status
    }
  }

  get statusBadgeClass(): string {
    switch (this.status) {
      case 'APPROVED':
      case 'DISBURSED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'PRE_APPROVED':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'IN_REVIEW':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }
}
