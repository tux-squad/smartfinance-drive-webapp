import { DepreciationProjection } from '../domain/depreciation-projection.entity'
import { YearlyDepreciation } from '../domain/yearly-depreciation.entity'
import type { DepreciationProjectionResource } from './depreciation-projection.resource'

/**
 * Assembler mapping HTTP DTO Resources to pure Domain Entities.
 */
export class DepreciationAssembler {
  public static toEntity(resource: DepreciationProjectionResource): DepreciationProjection {
    const initialValue = resource.initialVehiclePriceAmount ?? resource.initialValue ?? 25000
    const currency = resource.currency || 'USD'
    const manufactureYear = resource.manufactureYear || new Date().getFullYear()
    const ratePct = resource.annualDepreciationRate !== undefined
      ? Number((resource.annualDepreciationRate * 100).toFixed(1))
      : 12

    let yearlyProjections: YearlyDepreciation[] = []

    if (Array.isArray(resource.projectedValues) && resource.projectedValues.length > 0) {
      let prevValue = initialValue
      yearlyProjections = resource.projectedValues.map((item) => {
        const yearNumber = item.year
        const calendarYear = manufactureYear + yearNumber
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
    } else {
      // Synthesize 5-year table using backend 2, 3, 5 year projections
      const val2 = resource.projectedValue2YearsAmount ?? Math.round(initialValue * 0.78)
      const val3 = resource.projectedValue3YearsAmount ?? Math.round(initialValue * 0.68)
      const val5 = resource.projectedValue5YearsAmount ?? Math.round(initialValue * 0.53)
      const val1 = Math.round(initialValue * (1 - (ratePct / 100)))
      const val4 = Math.round((val3 + val5) / 2)

      const values = [
        { year: 1, value: val1 },
        { year: 2, value: val2 },
        { year: 3, value: val3 },
        { year: 4, value: val4 },
        { year: 5, value: val5 }
      ]

      let prevValue = initialValue
      yearlyProjections = values.map((item) => {
        const calendarYear = manufactureYear + item.year
        const startValue = prevValue
        const endValue = item.value
        const depreciationAmount = Math.max(0, startValue - endValue)
        const accumulatedDepreciation = Math.max(0, initialValue - endValue)
        const remainingValuePercentage = initialValue > 0 ? Number(((endValue / initialValue) * 100).toFixed(2)) : 0
        prevValue = endValue

        return new YearlyDepreciation(
          item.year,
          calendarYear,
          startValue,
          depreciationAmount,
          endValue,
          accumulatedDepreciation,
          remainingValuePercentage
        )
      })
    }

    const projectionYears = yearlyProjections.length || 5
    const projectedResidualValue = resource.projectedValue5YearsAmount
      ?? (yearlyProjections[yearlyProjections.length - 1]?.endValue ?? Math.round(initialValue * 0.53))
    const totalDepreciationAmount = Math.max(0, initialValue - projectedResidualValue)

    return new DepreciationProjection(
      resource.id,
      initialValue,
      currency,
      manufactureYear,
      ratePct,
      projectionYears,
      projectedResidualValue,
      totalDepreciationAmount,
      yearlyProjections,
      new Date().toISOString(),
      resource.vehicleId,
      resource.recommendedAction,
      resource.advisoryNotes,
      resource.balloonPaymentAmount
    )
  }
}
