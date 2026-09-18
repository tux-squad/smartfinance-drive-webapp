import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import type { SearchVehiclesQuery } from '../domain/search-vehicles.query'
import type { VehicleResource, VehiclePageResource } from './vehicle.resource'
import { VehicleAssembler } from './vehicle.assembler'
import { Vehicle } from '../domain/vehicle.entity'
import { VehiclePage } from '../domain/vehicle-page.entity'

/**
 * Infrastructure API Gateway for Catalog endpoints (/api/v1/vehicles).
 */
export class CatalogApi extends BaseApi {
  /**
   * 3.1 List & Search Vehicles with pagination and fuzzy search filters.
   */
  public async getVehicles(query?: SearchVehiclesQuery): Promise<VehiclePage> {
    // Filter out undefined or empty query params
    const params: Record<string, any> = {}
    if (query) {
      if (query.brand) params.brand = query.brand
      if (query.model) params.model = query.model
      if (query.minPrice !== undefined && query.minPrice !== null) params.minPrice = query.minPrice
      if (query.maxPrice !== undefined && query.maxPrice !== null) params.maxPrice = query.maxPrice
      if (query.minYear !== undefined && query.minYear !== null) params.minYear = query.minYear
      if (query.maxYear !== undefined && query.maxYear !== null) params.maxYear = query.maxYear
      if (query.condition) params.condition = query.condition
      if (query.page !== undefined) params.page = query.page
      if (query.size !== undefined) params.size = query.size
      if (query.sort) params.sort = query.sort
    }

    const response: AxiosResponse<VehiclePageResource> = await this.http.get<VehiclePageResource>('/api/v1/vehicles', {
      params
    })

    return VehicleAssembler.toPageEntity(response.data)
  }

  /**
   * 3.3 Get Vehicle details by UUID.
   */
  public async getVehicleById(vehicleId: string): Promise<Vehicle> {
    const response: AxiosResponse<VehicleResource> = await this.http.get<VehicleResource>(`/api/v1/vehicles/${vehicleId}`)
    return VehicleAssembler.toEntity(response.data)
  }
}
