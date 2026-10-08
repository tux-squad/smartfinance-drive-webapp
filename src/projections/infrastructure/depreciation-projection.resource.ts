/**
 * Infrastructure DTO matching backend JSON response for a projected value item.
 */
export interface ProjectedValueResource {
  year: number
  value: number
}

/**
 * Infrastructure DTO matching backend JSON response for full vehicle depreciation projection (API Doc 2.33).
 */
export interface DepreciationProjectionResource {
  id: string
  vehicleId: string
  simulationId?: string
  currency?: string
  initialVehiclePriceAmount?: number
  initialValue?: number
  manufactureYear?: number
  motorizationType?: string
  annualDepreciationRate?: number
  projectedValue2YearsAmount?: number
  projectedValue3YearsAmount?: number
  projectedValue5YearsAmount?: number
  balloonPaymentAmount?: number
  recommendedAction?: string
  advisoryNotes?: string
  projectedValues?: ProjectedValueResource[]
}

/**
 * Infrastructure DTO for sending a depreciation calculation request (API Doc 2.33).
 */
export interface CalculateDepreciationResource {
  vehicleId: string
  simulationId?: string
  initialVehiclePriceAmount: number
  currency: string
  manufactureYear: number
  motorizationType?: string
  balloonPaymentAmount?: number
  years?: number
}
