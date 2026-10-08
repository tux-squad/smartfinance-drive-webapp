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
    let derivedScore = Number(resource.score) || 0
    if (derivedScore < 300) {
      const dti = resource.dtiRatio !== undefined && !isNaN(Number(resource.dtiRatio)) ? Number(resource.dtiRatio) : 0.25
      switch (resource.riskTier) {
        case 'LOW_RISK':
          derivedScore = Math.max(720, Math.min(850, Math.round(820 - dti * 200)))
          break
        case 'MEDIUM_RISK':
          derivedScore = Math.max(580, Math.min(699, Math.round(660 - dti * 200)))
          break
        case 'HIGH_RISK':
          derivedScore = Math.max(350, Math.min(570, Math.round(520 - dti * 200)))
          break
        default:
          derivedScore = Math.max(350, Math.min(850, Math.round(850 - dti * 600)))
      }
    }

    const income = Number(resource.monthlyIncomeAmount) || 0
    const maxLoan = resource.maxRecommendedLoanAmount !== undefined && Number(resource.maxRecommendedLoanAmount) > 0
      ? Number(resource.maxRecommendedLoanAmount)
      : (income > 0 ? Math.round(income * 0.4 * 36) : 25000)

    return new CreditScore(
      resource.id,
      resource.profileId || '',
      derivedScore,
      resource.riskTier || 'MEDIUM_RISK',
      maxLoan,
      resource.currency || 'USD',
      resource.simulationId,
      resource.monthlyIncomeAmount,
      resource.projectedMonthlyInstallmentAmount,
      resource.dtiRatio,
      resource.rateAdjustment,
      resource.status,
      resource.assessmentNotes
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
   * Maps an EvaluateScoreCommand to an EvaluateCreditScoreRequestResource payload (API Doc 2.28).
   */
  static toEvaluateRequestResource(command: EvaluateScoreCommand): EvaluateCreditScoreRequestResource {
    return {
      profileId: command.profileId,
      simulationId: command.simulationId || '00000000-0000-0000-0000-000000000000',
      monthlyIncomeAmount: Number(command.monthlyIncomeAmount) || 3000,
      projectedMonthlyInstallmentAmount: Number(command.projectedMonthlyInstallmentAmount) || 500,
      currency: command.currency || 'USD'
    }
  }
}
