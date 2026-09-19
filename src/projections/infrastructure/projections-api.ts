import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import type { CalculateDepreciationCommand } from '../domain/calculate-depreciation.command'
import type { CalculateDepreciationResource, DepreciationProjectionResource } from './depreciation-projection.resource'
import { DepreciationAssembler } from './depreciation.assembler'
import { DepreciationProjection } from '../domain/depreciation-projection.entity'

/**
 * Infrastructure API Gateway for Projections endpoints (/api/v1/projections).
 */
export class ProjectionsApi extends BaseApi {
  /**
   * Calculates vehicle technical 5-year depreciation projection.
   */
  public async calculateDepreciation(command: CalculateDepreciationCommand): Promise<DepreciationProjection> {
    const payload: CalculateDepreciationResource = {
      vehicleId: command.vehicleId,
      initialValueAmount: command.initialValueAmount,
      currency: command.currency,
      manufactureYear: command.manufactureYear,
      annualDepreciationRatePct: command.annualDepreciationRatePct,
      projectionYears: command.projectionYears
    }

    const response: AxiosResponse<DepreciationProjectionResource> = await this.http.post<DepreciationProjectionResource>(
      '/api/v1/projections/depreciation',
      payload
    )

    return DepreciationAssembler.toEntity(response.data)
  }

  /**
   * Fetches existing depreciation projection by vehicle ID.
   */
  public async getDepreciationByVehicleId(vehicleId: string): Promise<DepreciationProjection> {
    const response: AxiosResponse<DepreciationProjectionResource> = await this.http.get<DepreciationProjectionResource>(
      `/api/v1/projections/depreciation/vehicle/${vehicleId}`
    )
    return DepreciationAssembler.toEntity(response.data)
  }
}
