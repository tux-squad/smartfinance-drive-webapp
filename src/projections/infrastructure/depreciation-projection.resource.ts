/**
 * Infrastructure DTO matching backend JSON response for a projected value item.
 */
export interface ProjectedValueResource {
  year: number
  value: number
}

/**
 * Infrastructure DTO matching backend JSON response for full vehicle depreciation projection (API Doc 7.1).
 */
export interface DepreciationProjectionResource {
  id: string
  vehicleId: string
  initialValue: number
  projectedValues: ProjectedValueResource[]
}

/**
 * Infrastructure DTO for sending a depreciation calculation request (API Doc 7.1).
 */
export interface CalculateDepreciationResource {
  vehicleId: string
  years: number
}
