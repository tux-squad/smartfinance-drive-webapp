import { RateBenchmark } from '../domain/rate-benchmark.value-object'
import { FinancialEntity } from '../domain/financial-entity.entity'
import { SunatRuc } from '../domain/sunat-ruc.entity'
import type {
  RateBenchmarkResource,
  FinancialEntityResource,
  SunatRucResource
} from './financial-entity.resource'

/**
 * Static assembler mapping infrastructure resources to domain entities for Partners.
 */
export class PartnersAssembler {
  /**
   * Maps a RateBenchmarkResource to a RateBenchmark value object.
   */
  static toBenchmarkValueObject(resource: RateBenchmarkResource): RateBenchmark {
    return new RateBenchmark(
      resource.loanTermMonths || 36,
      resource.annualEffectiveRate || 0,
      resource.monthlyCreditLifeInsuranceRate || 0.05
    )
  }

  /**
   * Maps a FinancialEntityResource to a FinancialEntity domain entity.
   */
  static toFinancialEntity(resource: FinancialEntityResource): FinancialEntity {
    const benchmarks = (resource.rateBenchmarks || []).map((b) =>
      PartnersAssembler.toBenchmarkValueObject(b)
    )
    return new FinancialEntity(
      resource.id,
      resource.name || '',
      resource.ruc || '',
      benchmarks
    )
  }

  /**
   * Maps a SunatRucResource to a SunatRuc domain entity.
   */
  static toSunatRucEntity(resource: SunatRucResource): SunatRuc {
    return new SunatRuc(
      resource.ruc || '',
      resource.businessName || '',
      resource.status || 'INACTIVO',
      resource.condition || 'NO HABIDO'
    )
  }
}
