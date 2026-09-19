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
  status: string
  reviewerNotes?: string
}
