/**
 * Infrastructure DTO matching backend JSON response for a Vehicle.
 */
export interface VehicleResource {
  id: string
  userId?: string
  financialEntityId?: string
  brand: string
  model: string
  manufactureYear: number
  condition: string
  priceAmount: number
  currency: string
  imagePath?: string
}

/**
 * Infrastructure DTO matching backend JSON response for paginated Vehicles.
 */
export interface VehiclePageResource {
  content: VehicleResource[]
  totalElements: number
  totalPages: number
}

/**
 * Infrastructure DTO for creating a new Vehicle.
 */
export interface CreateVehicleResource {
  userId: string
  financialEntityId?: string
  brand: string
  model: string
  manufactureYear: number
  condition: string
  priceAmount: number
  currency: string
}

/**
 * Infrastructure DTO for updating an existing Vehicle.
 */
export interface UpdateVehicleResource {
  brand?: string
  model?: string
  manufactureYear?: number
  condition?: string
  priceAmount?: number
  currency?: string
}
