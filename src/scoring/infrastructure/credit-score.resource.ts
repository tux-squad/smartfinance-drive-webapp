/**
 * Infrastructure DTO matching backend JSON for a Credit Score evaluation.
 */
export interface CreditScoreResource {
  id: string
  profileId: string
  score: number
  riskTier: string
  maxRecommendedLoanAmount?: number
  currency?: string
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
 * Infrastructure DTO for triggering a Credit Score evaluation request.
 */
export interface EvaluateCreditScoreRequestResource {
  profileId: string
}
