/**
 * Infrastructure DTO matching backend JSON response for a Rate Benchmark.
 */
export interface RateBenchmarkResource {
  id?: string
  loanTermMonths: number
  annualEffectiveRate: number
  monthlyCreditLifeInsuranceRate?: number
}

/**
 * Infrastructure DTO matching backend JSON response for a Financial Entity.
 */
export interface FinancialEntityResource {
  id: string
  name: string
  ruc?: string
  rateBenchmarks?: RateBenchmarkResource[]
}

/**
 * Infrastructure DTO matching backend JSON response for SUNAT RUC validation.
 */
export interface SunatRucResource {
  ruc: string
  businessName: string
  status: string
  condition: string
}

/**
 * Infrastructure DTO for creating/updating a Financial Entity.
 */
export interface CreateFinancialEntityResource {
  name: string
  ruc: string
}
