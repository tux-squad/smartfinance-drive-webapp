import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import type { SearchVehiclesQuery } from '../domain/search-vehicles.query'
import type { CreateVehicleCommand } from '../domain/create-vehicle.command'
import type { UploadVehicleImageCommand } from '../domain/upload-vehicle-image.command'
import type { VehicleResource, VehiclePageResource, CreateVehicleResource } from './vehicle.resource'
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
   * 3.2 Register / Create a new Vehicle.
   */
  public async createVehicle(command: CreateVehicleCommand): Promise<Vehicle> {
    const payload: CreateVehicleResource = {
      userId: command.userId,
      financialEntityId: command.financialEntityId,
      brand: command.brand,
      model: command.model,
      manufactureYear: command.manufactureYear,
      condition: command.condition,
      priceAmount: command.priceAmount,
      currency: command.currency
    }

    const response: AxiosResponse<VehicleResource> = await this.http.post<VehicleResource>('/api/v1/vehicles', payload)
    return VehicleAssembler.toEntity(response.data)
  }

  /**
   * 3.3 Get Vehicle details by UUID.
   */
  public async getVehicleById(vehicleId: string): Promise<Vehicle> {
    const response: AxiosResponse<VehicleResource> = await this.http.get<VehicleResource>(`/api/v1/vehicles/${vehicleId}`)
    return VehicleAssembler.toEntity(response.data)
  }

  /**
   * 3.4 Get Vehicles by User ID.
   */
  public async getVehiclesByUserId(userId: string): Promise<Vehicle[]> {
    const response: AxiosResponse<VehicleResource[]> = await this.http.get<VehicleResource[]>(`/api/v1/vehicles/users/${userId}`)
    return Array.isArray(response.data) ? response.data.map(r => VehicleAssembler.toEntity(r)) : []
  }

  /**
   * 3.5 Update Vehicle specifications by UUID.
   */
  public async updateVehicle(vehicleId: string, resource: import('./vehicle.resource').UpdateVehicleResource): Promise<Vehicle> {
    const response: AxiosResponse<VehicleResource> = await this.http.put<VehicleResource>(`/api/v1/vehicles/${vehicleId}`, resource)
    return VehicleAssembler.toEntity(response.data)
  }

  /**
   * 3.6 Delete Vehicle by UUID.
   */
  public async deleteVehicle(vehicleId: string): Promise<void> {
    await this.http.delete(`/api/v1/vehicles/${vehicleId}`)
  }

  /**
   * 3.7 Upload image for a Vehicle (multipart/form-data).
   */
  public async uploadVehicleImage(command: UploadVehicleImageCommand): Promise<Vehicle> {
    const formData = new FormData()
    formData.append('file', command.file)

    const response: AxiosResponse<VehicleResource> = await this.http.post<VehicleResource>(
      `/api/v1/vehicles/${command.vehicleId}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return VehicleAssembler.toEntity(response.data)
  }
}
