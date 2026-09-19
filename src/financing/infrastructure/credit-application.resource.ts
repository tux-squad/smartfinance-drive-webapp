export interface CreditApplicationResource {
  id: string
  userId: string
  simulationId?: string
  financialEntityId?: string
  vehicleId?: string
  requestedAmount: number
  currency: string
  monthlyIncome: number
  employmentStatus: string
  status: string
  notes?: string
  reviewerNotes?: string
  createdAt?: string
  updatedAt?: string
  vehicleTitle?: string
  financialEntityName?: string
}

export interface CreateCreditApplicationResource {
  simulationId?: string
  financialEntityId?: string
  vehicleId?: string
  requestedAmount: number
  currency: string
  monthlyIncome: number
  employmentStatus: string
  notes?: string
}

export interface UpdateCreditApplicationStatusResource {
  status: string
  reviewerNotes?: string
}
