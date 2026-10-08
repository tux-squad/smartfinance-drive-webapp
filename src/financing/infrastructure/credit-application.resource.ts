export interface CreditApplicationResource {
  id: string
  userId?: string
  applicantUserId?: string
  simulationId?: string
  financialEntityId?: string
  vehicleId?: string
  requestedAmount: number
  downPayment?: number
  termMonths?: number
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
  vehicleId?: string
  financialEntityId?: string
  simulationId?: string
  requestedAmount: number
  downPayment?: number
  termMonths: number
  monthlyIncome: number
  currency: string
  employmentStatus: string
  notes?: string
}

export interface UpdateCreditApplicationStatusResource {
  status: string
  reviewerNotes?: string
}
