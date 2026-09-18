import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import type { FinancialEntityResource, SunatRucResource } from './financial-entity.resource'
import { PartnersAssembler } from './partners.assembler'
import { FinancialEntity } from '../domain/financial-entity.entity'
import { SunatRuc } from '../domain/sunat-ruc.entity'

/**
 * Infrastructure API Gateway for Partners endpoints (/api/v1/financial-entities and /api/v1/partners/sunat/ruc/{ruc}).
 */
export class PartnersApi extends BaseApi {
  /**
   * 4.2 List Financial Entities with rate benchmarks.
   */
  public async getFinancialEntities(): Promise<FinancialEntity[]> {
    const response: AxiosResponse<FinancialEntityResource[]> = await this.http.get<FinancialEntityResource[]>('/api/v1/financial-entities')
    const list = response.data || []
    return list.map((item) => PartnersAssembler.toFinancialEntity(item))
  }

  /**
   * 4.3 Get Financial Entity details by UUID.
   */
  public async getFinancialEntityById(id: string): Promise<FinancialEntity> {
    const response: AxiosResponse<FinancialEntityResource> = await this.http.get<FinancialEntityResource>(`/api/v1/financial-entities/${id}`)
    return PartnersAssembler.toFinancialEntity(response.data)
  }

  /**
   * 4.7 Lookup SUNAT RUC validation.
   */
  public async lookupSunatRuc(ruc: string): Promise<SunatRuc> {
    const response: AxiosResponse<SunatRucResource> = await this.http.get<SunatRucResource>(`/api/v1/partners/sunat/ruc/${ruc}`)
    return PartnersAssembler.toSunatRucEntity(response.data)
  }
}
