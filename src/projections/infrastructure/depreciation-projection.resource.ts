/**
 * Infrastructure DTO matching backend JSON response for a yearly depreciation step.
 */
export interface YearlyDepreciationResource {
  yearNumber: number
  calendarYear: number
  startValue: number
  depreciationAmount: number
  endValue: number
  accumulatedDepreciation: number
  remainingValuePercentage: number
}

/**
 * Infrastructure DTO matching backend JSON response for full vehicle depreciation projection.
 */
export interface DepreciationProjectionResource {
  id: string
  vehicleId?: string
  initialValueAmount: number
  currency: string
  manufactureYear: number
  annualDepreciationRatePct: number
  projectionYears: number
  projectedResidualValue: number
  totalDepreciationAmount: number
  yearlyProjections: YearlyDepreciationResource[]
  calculatedAt: string
}

/**
 * Infrastructure DTO for sending a depreciation calculation request.
 */
export interface CalculateDepreciationResource {
  vehicleId?: string
  initialValueAmount: number
  currency: string
  manufactureYear: number
  annualDepreciationRatePct: number
  projectionYears: number
}
