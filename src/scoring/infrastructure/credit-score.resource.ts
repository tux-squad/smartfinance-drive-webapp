/**
 * Infrastructure DTO matching backend JSON for a Credit Score evaluation (API Doc 2.28).
 */
export interface CreditScoreResource {
  id: string
  profileId: string
  simulationId?: string
  currency?: string
  monthlyIncomeAmount?: number
  projectedMonthlyInstallmentAmount?: number
  dtiRatio?: number
  riskTier: string
  rateAdjustment?: number
  status?: string
  assessmentNotes?: string
  score?: number
  maxRecommendedLoanAmount?: number
}

/**
 * Infrastructure DTO matching backend JSON for paginated Credit Scores response.
 */
export interface CreditScorePageResource {
  content: CreditScoreResource[]
  totalElements: number
  totalPages: number
}

/**
 * Infrastructure DTO for triggering a Credit Score evaluation request (API Doc 2.28).
 */
export interface EvaluateCreditScoreRequestResource {
  profileId: string
  simulationId: string
  monthlyIncomeAmount: number
  projectedMonthlyInstallmentAmount: number
  currency: string
}
