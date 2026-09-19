import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import type { FinancialEntityResource, SunatRucResource } from './financial-entity.resource'
import { PartnersAssembler } from './partners.assembler'
import { FinancialEntity } from '../domain/financial-entity.entity'
import { SunatRuc } from '../domain/sunat-ruc.entity'
import { Dealership } from '../domain/dealership.entity'
import type { DealershipResource, UpdateDealershipResource } from './dealership.resource'
import { DealershipAssembler } from './dealership.assembler'

/**
 * Infrastructure API Gateway for Partners & Dealerships endpoints.
 */
export class PartnersApi extends BaseApi {
  /**
   * 4.1 List Financial Entities with rate benchmarks.
   */
  public async getFinancialEntities(): Promise<FinancialEntity[]> {
    const response: AxiosResponse<FinancialEntityResource[]> = await this.http.get<FinancialEntityResource[]>('/api/v1/financial-entities')
    const list = response.data || []
    return list.map((item) => PartnersAssembler.toFinancialEntity(item))
  }

  /**
   * 4.2 Create Financial Entity (Admin / Financial Institution).
   */
  public async createFinancialEntity(resource: Partial<FinancialEntityResource>): Promise<FinancialEntity> {
    const response: AxiosResponse<FinancialEntityResource> = await this.http.post<FinancialEntityResource>(
      '/api/v1/financial-entities',
      resource
    )
    return PartnersAssembler.toFinancialEntity(response.data)
  }

  /**
   * 4.3 Get Financial Entity details by UUID.
   */
  public async getFinancialEntityById(id: string): Promise<FinancialEntity> {
    const response: AxiosResponse<FinancialEntityResource> = await this.http.get<FinancialEntityResource>(`/api/v1/financial-entities/${id}`)
    return PartnersAssembler.toFinancialEntity(response.data)
  }

  /**
   * 4.4 Update Financial Entity (Admin / Financial Institution).
   */
  public async updateFinancialEntity(id: string, resource: Partial<FinancialEntityResource>): Promise<FinancialEntity> {
    const response: AxiosResponse<FinancialEntityResource> = await this.http.put<FinancialEntityResource>(
      `/api/v1/financial-entities/${id}`,
      resource
    )
    return PartnersAssembler.toFinancialEntity(response.data)
  }

  /**
   * 4.5 Delete Financial Entity (Admin).
   */
  public async deleteFinancialEntity(id: string): Promise<void> {
    await this.http.delete(`/api/v1/financial-entities/${id}`)
  }

  /**
   * 4.6 Lookup SUNAT RUC validation.
   */
  public async lookupSunatRuc(ruc: string): Promise<SunatRuc> {
    const response: AxiosResponse<SunatRucResource> = await this.http.get<SunatRucResource>(`/api/v1/partners/sunat/ruc/${ruc}`)
    return PartnersAssembler.toSunatRucEntity(response.data)
  }

  /**
   * 4.7 Public directory of certified dealerships (paginated & search).
   * GET /api/v1/dealerships
   */
  public async getDealerships(params?: { search?: string, location?: string, page?: number, size?: number }): Promise<Dealership[]> {
    const response: AxiosResponse<any> = await this.http.get('/api/v1/dealerships', { params })
    const data = response.data
    const list = Array.isArray(data) ? data : (data?.content || [])
    return list.map((item: DealershipResource) => DealershipAssembler.toEntity(item))
  }

  /**
   * 4.8 Get my dealership B2B profile.
   * GET /api/v1/dealerships/me
   */
  public async getMyDealership(): Promise<Dealership | null> {
    try {
      const response: AxiosResponse<DealershipResource> = await this.http.get<DealershipResource>('/api/v1/dealerships/me')
      return response.data ? DealershipAssembler.toEntity(response.data) : null
    } catch {
      return null
    }
  }

  /**
   * 4.9 Create or update my dealership B2B profile.
   * PUT /api/v1/dealerships/me
   */
  public async updateMyDealership(resource: UpdateDealershipResource): Promise<Dealership> {
    const response: AxiosResponse<DealershipResource> = await this.http.put<DealershipResource>(
      '/api/v1/dealerships/me',
      resource
    )
    return DealershipAssembler.toEntity(response.data)
  }

  /**
   * 4.10 Upload dealership logo (multipart/form-data).
   * POST /api/v1/dealerships/me/logo
   */
  public async uploadMyDealershipLogo(file: File): Promise<Dealership> {
    const formData = new FormData()
    formData.append('file', file)
    const response: AxiosResponse<DealershipResource> = await this.http.post<DealershipResource>(
      '/api/v1/dealerships/me/logo',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return DealershipAssembler.toEntity(response.data)
  }

  /**
   * 4.11 Upload dealership banner (multipart/form-data).
   * POST /api/v1/dealerships/me/banner
   */
  public async uploadMyDealershipBanner(file: File): Promise<Dealership> {
    const formData = new FormData()
    formData.append('file', file)
    const response: AxiosResponse<DealershipResource> = await this.http.post<DealershipResource>(
      '/api/v1/dealerships/me/banner',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return DealershipAssembler.toEntity(response.data)
  }

  /**
   * 4.12 Get dealership by ID.
   * GET /api/v1/dealerships/{id}
   */
  public async getDealershipById(id: string): Promise<Dealership> {
    const response: AxiosResponse<DealershipResource> = await this.http.get<DealershipResource>(
      `/api/v1/dealerships/${id}`
    )
    return DealershipAssembler.toEntity(response.data)
  }

  /**
   * 4.13 Get vehicles of a specific dealership.
   * GET /api/v1/dealerships/{id}/vehicles
   */
  public async getDealershipVehicles(id: string): Promise<any[]> {
    const response: AxiosResponse<any> = await this.http.get(`/api/v1/dealerships/${id}/vehicles`)
    return response.data || []
  }
}

