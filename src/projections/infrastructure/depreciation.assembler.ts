import { DepreciationProjection } from '../domain/depreciation-projection.entity'
import { YearlyDepreciation } from '../domain/yearly-depreciation.entity'
import type { DepreciationProjectionResource } from './depreciation-projection.resource'

/**
 * Assembler mapping HTTP DTO Resources to pure Domain Entities.
 */
export class DepreciationAssembler {
  public static toEntity(resource: DepreciationProjectionResource): DepreciationProjection {
    const initialValue = resource.initialValue || 0
    const projectedValues = resource.projectedValues || []
    const currentCalendarYear = new Date().getFullYear()

    let prevValue = initialValue
    const yearlyProjections: YearlyDepreciation[] = projectedValues.map((item) => {
      const yearNumber = item.year
      const calendarYear = currentCalendarYear + yearNumber
      const startValue = prevValue
      const endValue = item.value
      const depreciationAmount = Math.max(0, startValue - endValue)
      const accumulatedDepreciation = Math.max(0, initialValue - endValue)
      const remainingValuePercentage = initialValue > 0 ? Number(((endValue / initialValue) * 100).toFixed(2)) : 0

      prevValue = endValue

      return new YearlyDepreciation(
        yearNumber,
        calendarYear,
        startValue,
        depreciationAmount,
        endValue,
        accumulatedDepreciation,
        remainingValuePercentage
      )
    })

    const projectionYears = projectedValues.length
    const lastItem = projectedValues[projectedValues.length - 1]
    const projectedResidualValue = lastItem ? lastItem.value : initialValue
    const totalDepreciationAmount = Math.max(0, initialValue - projectedResidualValue)

    let annualRatePct = 10
    if (projectedValues.length > 0 && initialValue > 0 && projectedValues[0]?.value !== undefined) {
      const firstYearDep = initialValue - projectedValues[0].value
      annualRatePct = Number(((firstYearDep / initialValue) * 100).toFixed(1))
    }

    return new DepreciationProjection(
      resource.id,
      initialValue,
      'USD',
      currentCalendarYear,
      annualRatePct,
      projectionYears,
      projectedResidualValue,
      totalDepreciationAmount,
      yearlyProjections,
      new Date().toISOString(),
      resource.vehicleId
    )
  }
}
