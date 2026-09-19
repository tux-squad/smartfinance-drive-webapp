import { DepreciationProjection } from '../domain/depreciation-projection.entity'
import { YearlyDepreciation } from '../domain/yearly-depreciation.entity'
import type { DepreciationProjectionResource, YearlyDepreciationResource } from './depreciation-projection.resource'

/**
 * Assembler mapping HTTP DTO Resources to pure Domain Entities.
 */
export class DepreciationAssembler {
  public static toYearlyEntity(resource: YearlyDepreciationResource): YearlyDepreciation {
    return new YearlyDepreciation(
      resource.yearNumber,
      resource.calendarYear,
      resource.startValue,
      resource.depreciationAmount,
      resource.endValue,
      resource.accumulatedDepreciation,
      resource.remainingValuePercentage
    )
  }

  public static toEntity(resource: DepreciationProjectionResource): DepreciationProjection {
    const yearlyEntities = (resource.yearlyProjections || []).map((y) => this.toYearlyEntity(y))

    return new DepreciationProjection(
      resource.id,
      resource.initialValueAmount,
      resource.currency || 'USD',
      resource.manufactureYear,
      resource.annualDepreciationRatePct,
      resource.projectionYears,
      resource.projectedResidualValue,
      resource.totalDepreciationAmount,
      yearlyEntities,
      resource.calculatedAt || new Date().toISOString(),
      resource.vehicleId
    )
  }
}
