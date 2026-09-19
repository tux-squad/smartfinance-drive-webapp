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
   * 7.1 Calculate vehicle technical depreciation projection.
   * POST /api/v1/depreciation-projections
   * Body: { vehicleId: string, years: number }
   */
  public async calculateDepreciation(command: CalculateDepreciationCommand): Promise<DepreciationProjection> {
    const payload: CalculateDepreciationResource = {
      vehicleId: command.vehicleId,
      years: command.years
    }

    const response: AxiosResponse<DepreciationProjectionResource> = await this.http.post<DepreciationProjectionResource>(
      '/api/v1/depreciation-projections',
      payload
    )

    return DepreciationAssembler.toEntity(response.data)
  }

  /**
   * Fetches existing depreciation projection by vehicle ID.
   */
  public async getDepreciationByVehicleId(vehicleId: string): Promise<DepreciationProjection> {
    const response: AxiosResponse<DepreciationProjectionResource> = await this.http.get<DepreciationProjectionResource>(
      `/api/v1/depreciation-projections/vehicle/${vehicleId}`
    )
    return DepreciationAssembler.toEntity(response.data)
  }
}
