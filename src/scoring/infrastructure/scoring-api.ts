import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import type { CreditScoreResource, CreditScorePageResource } from './credit-score.resource'
import type { EvaluateScoreCommand } from '../domain/evaluate-score.command'
import { CreditScoreAssembler } from './scoring.assembler'
import { CreditScore } from '../domain/credit-score.entity'
import { CreditScorePage } from '../domain/credit-score-page.entity'

/**
 * Infrastructure API Gateway for Scoring endpoints (/api/v1/credit-scores).
 */
export class ScoringApi extends BaseApi {
  /**
   * 6.1 Evaluate credit score for a client profile.
   */
  public async evaluateCreditScore(command: EvaluateScoreCommand): Promise<CreditScore> {
    const payload = CreditScoreAssembler.toEvaluateRequestResource(command)
    const response: AxiosResponse<CreditScoreResource> = await this.http.post<CreditScoreResource>('/api/v1/credit-scores', payload)
    return CreditScoreAssembler.toEntity(response.data)
  }

  /**
   * 6.2 List all credit scores (paginated).
   */
  public async getCreditScores(page: number = 0, size: number = 10): Promise<CreditScorePage> {
    const response: AxiosResponse<CreditScorePageResource> = await this.http.get<CreditScorePageResource>('/api/v1/credit-scores', {
      params: { page, size }
    })
    return CreditScoreAssembler.toPageEntity(response.data)
  }

  /**
   * 6.3 Get credit score by UUID.
   */
  public async getCreditScoreById(id: string): Promise<CreditScore> {
    const response: AxiosResponse<CreditScoreResource> = await this.http.get<CreditScoreResource>(`/api/v1/credit-scores/${id}`)
    return CreditScoreAssembler.toEntity(response.data)
  }

  /**
   * 6.4 Get credit scores list by Profile ID.
   */
  public async getCreditScoresByProfileId(profileId: string): Promise<CreditScore[]> {
    const response: AxiosResponse<CreditScoreResource[]> = await this.http.get<CreditScoreResource[]>(`/api/v1/credit-scores/profile/${profileId}`)
    const list = response.data || []
    return list.map((item) => CreditScoreAssembler.toEntity(item))
  }

  /**
   * 6.5 Delete credit score record by UUID.
   */
  public async deleteCreditScore(id: string): Promise<void> {
    await this.http.delete<void>(`/api/v1/credit-scores/${id}`)
  }
}
