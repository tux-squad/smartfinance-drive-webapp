import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import { Consultation } from '../domain/consultation.entity'

export interface AskConsultationCommand {
  prompt: string
  monthlyIncome?: number
  currency?: string
}

/**
 * Infrastructure API Gateway for Gemini AI Financial Consultations (API Section 10).
 * Features dual-path resolution (/api/v1/consultations and /api/v1/ai/consultations).
 */
export class ConsultationsApi extends BaseApi {
  /**
   * 10.1 Get AI-recommended vehicles.
   * GET /api/v1/consultations/recommendations (alias /api/v1/ai/consultations/recommendations)
   */
  public async getRecommendations(): Promise<any[]> {
    try {
      const res = await this.http.get('/api/v1/consultations/recommendations')
      return res.data || []
    } catch {
      try {
        const fallback = await this.http.get('/api/v1/ai/consultations/recommendations')
        return fallback.data || []
      } catch {
        return []
      }
    }
  }

  /**
   * 10.2 Send interactive prompt to Gemini AI Advisor.
   * POST /api/v1/consultations/chat (alias /api/v1/consultations and /api/v1/ai/consultations)
   */
  public async askConsultation(command: AskConsultationCommand): Promise<Consultation> {
    let res: AxiosResponse<any>
    try {
      res = await this.http.post('/api/v1/consultations/chat', command)
    } catch {
      try {
        res = await this.http.post('/api/v1/consultations', command)
      } catch {
        res = await this.http.post('/api/v1/ai/consultations/chat', command)
      }
    }

    const c = res.data
    return new Consultation(
      c.id || String(Date.now()),
      c.userId || '',
      c.prompt || command.prompt,
      c.recommendationText || c.response || c.content || '',
      c.recommendedCategory || null,
      Number(c.estimatedMaxMonthlyFee) || 0,
      c.createdAt || new Date().toISOString()
    )
  }

  /**
   * 10.3 Get user consultation history.
   * GET /api/v1/consultations/history (alias /api/v1/ai/consultations/history)
   */
  public async getHistory(): Promise<Consultation[]> {
    let res: AxiosResponse<any>
    try {
      res = await this.http.get('/api/v1/consultations/history')
    } catch {
      try {
        res = await this.http.get('/api/v1/ai/consultations/history')
      } catch {
        return []
      }
    }

    const list = Array.isArray(res.data) ? res.data : []
    return list.map((c: any) => new Consultation(
      c.id || String(Date.now()),
      c.userId || '',
      c.prompt || '',
      c.recommendationText || c.response || '',
      c.recommendedCategory || null,
      Number(c.estimatedMaxMonthlyFee) || 0,
      c.createdAt || new Date().toISOString()
    ))
  }
}
