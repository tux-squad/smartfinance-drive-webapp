import { RateBenchmark } from './rate-benchmark.value-object'

/**
 * FinancialEntity Domain Entity representing a bank or credit institution.
 */
export class FinancialEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly ruc?: string,
    public readonly rateBenchmarks: RateBenchmark[] = []
  ) {}

  /**
   * Returns benchmark rate for a given loan term if defined.
   */
  getBenchmarkForTerm(termMonths: number): RateBenchmark | undefined {
    return this.rateBenchmarks.find((b) => b.loanTermMonths === termMonths)
  }
}
