/**
 * Query DTO parameters for searching and filtering vehicles in the catalog.
 */
export interface SearchVehiclesQuery {
  brand?: string
  model?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  condition?: string
  page?: number
  size?: number
  sort?: string
}
