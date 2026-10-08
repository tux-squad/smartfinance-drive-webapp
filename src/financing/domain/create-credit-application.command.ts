export interface CreateCreditApplicationCommand {
  vehicleId?: string
  financialEntityId?: string
  simulationId?: string
  requestedAmount: number
  downPayment?: number
  termMonths?: number
  monthlyIncome: number
  currency: string
  employmentStatus: string
  notes?: string
}

export interface UpdateCreditApplicationStatusCommand {
  status: 'PENDING' | 'IN_REVIEW' | 'PRE_APPROVED' | 'REJECTED' | 'DISBURSED' | string
  notes?: string
  reviewerNotes?: string
}
