import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import type { CalculateDepreciationCommand } from '../domain/calculate-depreciation.command'
import type { CalculateDepreciationResource, DepreciationProjectionResource } from './depreciation-projection.resource'
import { DepreciationAssembler } from './depreciation.assembler'
import { DepreciationProjection } from '../domain/depreciation-projection.entity'

/**
 * Infrastructure API Gateway for Depreciation Projections endpoint (/api/v1/depreciation-projections).
 * API Doc 7.1.
 */
export class ProjectionsApi extends BaseApi {
  /**
   * 7.1 Calculate vehicle technical depreciation projection (API Doc 2.33).
   * POST /api/v1/depreciation-projections
   * Body: { vehicleId, initialVehiclePriceAmount, currency, manufactureYear, motorizationType, balloonPaymentAmount }
   */
  public async calculateDepreciation(command: CalculateDepreciationCommand): Promise<DepreciationProjection> {
    const payload: CalculateDepreciationResource = {
      vehicleId: command.vehicleId,
      initialVehiclePriceAmount: command.initialVehiclePriceAmount || 25000,
      currency: command.currency || 'USD',
      manufactureYear: command.manufactureYear || new Date().getFullYear(),
      motorizationType: command.motorizationType || 'GASOLINE',
      balloonPaymentAmount: command.balloonPaymentAmount ?? 0,
      ...(command.simulationId ? { simulationId: command.simulationId } : {})
    }

    const response: AxiosResponse<DepreciationProjectionResource> = await this.http.post<DepreciationProjectionResource>(
      '/api/v1/depreciation-projections',
      payload
    )

    return DepreciationAssembler.toEntity(response.data)
  }

  /**
   * 7.2 List historical depreciation projections with pagination.
   * GET /api/v1/depreciation-projections
   */
  public async getProjections(page: number = 0, size: number = 10, sort: string = 'createdAt,desc'): Promise<DepreciationProjection[]> {
    try {
      const response: AxiosResponse<any> = await this.http.get('/api/v1/depreciation-projections', {
        params: { page, size, sort }
      })
      const items = Array.isArray(response.data) ? response.data : (response.data?.content || [])
      return items.map((item: DepreciationProjectionResource) => DepreciationAssembler.toEntity(item))
    } catch {
      return []
    }
  }

  /**
   * 7.3 Get depreciation projection by ID.
   * GET /api/v1/depreciation-projections/{id}
   */
  public async getProjectionById(id: string): Promise<DepreciationProjection> {
    const response: AxiosResponse<DepreciationProjectionResource> = await this.http.get(
      `/api/v1/depreciation-projections/${id}`
    )
    return DepreciationAssembler.toEntity(response.data)
  }

  /**
   * 7.4 Fetches existing depreciation projection by vehicle ID.
   */
  public async getDepreciationByVehicleId(vehicleId: string): Promise<DepreciationProjection> {
    const response: AxiosResponse<DepreciationProjectionResource> = await this.http.get<DepreciationProjectionResource>(
      `/api/v1/depreciation-projections/vehicle/${vehicleId}`
    )
    return DepreciationAssembler.toEntity(response.data)
  }

  /**
   * 7.5 Delete historical depreciation projection by ID.
   * DELETE /api/v1/depreciation-projections/{id}
   */
  public async deleteProjection(id: string): Promise<boolean> {
    await this.http.delete(`/api/v1/depreciation-projections/${id}`)
    return true
  }
}
