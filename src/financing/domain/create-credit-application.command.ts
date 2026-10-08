export interface CreateCreditApplicationCommand {
  simulationId?: string
  financialEntityId?: string
  vehicleId?: string
  requestedAmount: number
  currency: string
  monthlyIncome: number
  employmentStatus: string
  notes?: string
}

export interface UpdateCreditApplicationStatusCommand {
  status: 'PENDING' | 'IN_REVIEW' | 'PRE_APPROVED' | 'REJECTED' | 'DISBURSED' | string
  notes?: string
  reviewerNotes?: string
}
