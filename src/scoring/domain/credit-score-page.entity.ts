import type { CreditScore } from './credit-score.entity'

/**
 * CreditScorePage Domain Entity wrapping paginated credit evaluation results.
 */
export class CreditScorePage {
  constructor(
    public readonly content: CreditScore[],
    public readonly totalElements: number,
    public readonly totalPages: number
  ) {}
}
