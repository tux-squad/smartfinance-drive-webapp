import { CreditScore } from '../domain/credit-score.entity'
import { CreditScorePage } from '../domain/credit-score-page.entity'
import type { EvaluateScoreCommand } from '../domain/evaluate-score.command'
import type {
  CreditScoreResource,
  CreditScorePageResource,
  EvaluateCreditScoreRequestResource
} from './credit-score.resource'

/**
 * Static assembler mapping infrastructure resources to domain entities for Scoring.
 */
export class CreditScoreAssembler {
  /**
   * Maps a CreditScoreResource to a CreditScore domain entity.
   */
  static toEntity(resource: CreditScoreResource): CreditScore {
    return new CreditScore(
      resource.id,
      resource.profileId || '',
      resource.score || 300,
      resource.riskTier || 'MEDIUM_RISK',
      resource.maxRecommendedLoanAmount || 0,
      resource.currency || 'USD'
    )
  }

  /**
   * Maps a CreditScorePageResource to a CreditScorePage domain entity.
   */
  static toPageEntity(resource: CreditScorePageResource): CreditScorePage {
    const content = (resource.content || []).map((item) => CreditScoreAssembler.toEntity(item))
    return new CreditScorePage(content, resource.totalElements || 0, resource.totalPages || 0)
  }

  /**
   * Maps an EvaluateScoreCommand to an EvaluateCreditScoreRequestResource payload.
   */
  static toEvaluateRequestResource(command: EvaluateScoreCommand): EvaluateCreditScoreRequestResource {
    return {
      profileId: command.profileId
    }
  }
}
