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
    if (!localStorage.getItem('access_token')) {
      return []
    }
    try {
      const response: AxiosResponse<FinancialEntityResource[]> = await this.http.get<FinancialEntityResource[]>('/api/v1/financial-entities')
      const list = response.data || []
      return list.map((item) => PartnersAssembler.toFinancialEntity(item))
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return []
      }
      throw err
    }
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
   * 4.6 Get my Financial Entity (for ROLE_FINANCIAL_INSTITUTION).
   * GET /api/v1/financial-entities/me
   */
  public async getMyFinancialEntity(): Promise<FinancialEntity | null> {
    try {
      const response: AxiosResponse<FinancialEntityResource> = await this.http.get<FinancialEntityResource>(
        '/api/v1/financial-entities/me'
      )
      return response.data ? PartnersAssembler.toFinancialEntity(response.data) : null
    } catch {
      return null
    }
  }

  /**
   * 4.7 Add Rate Benchmark to Financial Entity.
   * POST /api/v1/financial-entities/{id}/rate-benchmarks
   */
  public async addRateBenchmark(id: string, resource: {
    rateType: string
    annualRate: number
    currency: string
    sourceLabel?: string
    sourceUrl?: string
    effectiveFrom?: string
  }): Promise<FinancialEntity> {
    const response: AxiosResponse<FinancialEntityResource> = await this.http.post<FinancialEntityResource>(
      `/api/v1/financial-entities/${id}/rate-benchmarks`,
      resource
    )
    return PartnersAssembler.toFinancialEntity(response.data)
  }

  /**
   * 4.8 Upload Financial Entity Logo.
   * POST /api/v1/financial-entities/{id}/logo
   */
  public async uploadFinancialEntityLogo(id: string, file: File): Promise<FinancialEntity> {
    const formData = new FormData()
    formData.append('file', file)
    const response: AxiosResponse<FinancialEntityResource> = await this.http.post<FinancialEntityResource>(
      `/api/v1/financial-entities/${id}/logo`,
      formData
    )
    return PartnersAssembler.toFinancialEntity(response.data)
  }

  /**
   * 4.9 Upload my Financial Entity Logo.
   * POST /api/v1/financial-entities/me/logo
   */
  public async uploadMyFinancialEntityLogo(file: File): Promise<FinancialEntity> {
    const formData = new FormData()
    formData.append('file', file)
    const response: AxiosResponse<FinancialEntityResource> = await this.http.post<FinancialEntityResource>(
      '/api/v1/financial-entities/me/logo',
      formData
    )
    return PartnersAssembler.toFinancialEntity(response.data)
  }

  /**
   * 4.10 Upload Financial Entity Banner.
   * POST /api/v1/financial-entities/{id}/banner
   */
  public async uploadFinancialEntityBanner(id: string, file: File): Promise<FinancialEntity> {
    const formData = new FormData()
    formData.append('file', file)
    const response: AxiosResponse<FinancialEntityResource> = await this.http.post<FinancialEntityResource>(
      `/api/v1/financial-entities/${id}/banner`,
      formData
    )
    return PartnersAssembler.toFinancialEntity(response.data)
  }

  /**
   * 4.11 Upload my Financial Entity Banner.
   * POST /api/v1/financial-entities/me/banner
   */
  public async uploadMyFinancialEntityBanner(file: File): Promise<FinancialEntity> {
    const formData = new FormData()
    formData.append('file', file)
    const response: AxiosResponse<FinancialEntityResource> = await this.http.post<FinancialEntityResource>(
      '/api/v1/financial-entities/me/banner',
      formData
    )
    return PartnersAssembler.toFinancialEntity(response.data)
  }

  /**
   * 4.10 Lookup SUNAT RUC validation.
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
    if (!localStorage.getItem('access_token')) {
      return []
    }
    try {
      const response: AxiosResponse<any> = await this.http.get('/api/v1/dealerships', { params })
      const data = response.data
      const list = Array.isArray(data) ? data : (data?.content || [])
      return list.map((item: DealershipResource) => DealershipAssembler.toEntity(item))
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return []
      }
      throw err
    }
  }

  /**
   * 4.8 Get my dealership B2B profile.
   * GET /api/v1/dealerships/me
   */
  public async getMyDealership(): Promise<Dealership | null> {
    try {
      const response: AxiosResponse<DealershipResource> = await this.http.get<DealershipResource>('/api/v1/dealerships/me')
      return response.data ? DealershipAssembler.toEntity(response.data) : null
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 401) {
        return null
      }
      throw err
    }
  }

  /**
   * 4.9 Create or update my dealership B2B profile.
   * PUT /api/v1/dealerships/me
   */
  public async updateMyDealership(resource: UpdateDealershipResource): Promise<Dealership> {
    const savedRuc = resource.ruc ||
      localStorage.getItem('dealer_ruc') ||
      localStorage.getItem('user_ruc') ||
      localStorage.getItem('corporate_ruc') ||
      '20100138019'

    const payload: any = {
      ruc: savedRuc,
      name: resource.name?.trim() || 'Concesionaria Oficial',
      address: resource.address?.trim() || 'Av. Javier Prado Este 4520, Surco, Lima',
      phone: resource.phone?.trim() || '+51 987654321',
      email: resource.email?.trim() || localStorage.getItem('user_email') || 'contacto@concesionaria.pe',
      website: resource.website?.trim() || 'https://smartfinance-drive.pe',
      description: resource.description?.trim() || '',
      operatingHours: resource.operatingHours?.trim() || resource.hours?.trim() || 'Lunes a Sábado: 9:00 AM - 7:00 PM'
    }

    if (resource.logoUrl && resource.logoUrl.startsWith('http')) {
      payload.logoUrl = resource.logoUrl
    }
    if (resource.bannerUrl && resource.bannerUrl.startsWith('http')) {
      payload.bannerUrl = resource.bannerUrl
    }

    const response: AxiosResponse<DealershipResource> = await this.http.put<DealershipResource>(
      '/api/v1/dealerships/me',
      payload
    )
    if (response.data?.ruc) {
      localStorage.setItem('dealer_ruc', response.data.ruc)
    }
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
      formData
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
      formData
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

  /**
   * 4.14 Corporate Verification Lookup by RUC.
   * GET /api/v1/partners/corporate-verification/lookup/{ruc}
   */
  public async lookupCorporateVerification(ruc: string): Promise<import('./corporate-verification.resource').CorporateVerificationLookupResource> {
    const response = await this.http.get<import('./corporate-verification.resource').CorporateVerificationLookupResource>(
      `/api/v1/partners/corporate-verification/lookup/${ruc}`
    )
    return response.data
  }

  /**
   * 4.15 Initiate Corporate Verification (Current User).
   * POST /api/v1/users/me/corporate-verification/initiate
   */
  public async initiateCorporateVerification(resource: import('./corporate-verification.resource').InitiateCorporateVerificationResource): Promise<{ message: string, corporateEmail: string, expiresInSeconds: number }> {
    const response = await this.http.post<{ message: string, corporateEmail: string, expiresInSeconds: number }>(
      '/api/v1/users/me/corporate-verification/initiate',
      resource
    )
    return response.data
  }

  /**
   * 4.16 Confirm Corporate Verification (Current User) (2.13).
   * POST /api/v1/users/me/corporate-verification/confirm
   * Body requires { ruc, code }
   */
  public async confirmCorporateVerification(resource: import('./corporate-verification.resource').ConfirmCorporateVerificationResource): Promise<import('./corporate-verification.resource').CorporateVerificationStatusResource> {
    const payload = {
      ruc: resource.ruc,
      code: resource.code || resource.verificationCode
    }
    const response = await this.http.post<import('./corporate-verification.resource').CorporateVerificationStatusResource>(
      '/api/v1/users/me/corporate-verification/confirm',
      payload
    )
    return response.data
  }

  /**
   * 4.17 Initiate Corporate Verification by User ID (Admin / Self) (#34).
   * POST /api/v1/users/{userId}/corporate-verification/initiate
   */
  public async initiateCorporateVerificationForUser(
    userId: string | number,
    resource: import('./corporate-verification.resource').InitiateCorporateVerificationResource
  ): Promise<{ message: string, corporateEmail: string, expiresInSeconds: number }> {
    const response = await this.http.post<{ message: string, corporateEmail: string, expiresInSeconds: number }>(
      `/api/v1/users/${userId}/corporate-verification/initiate`,
      resource
    )
    return response.data
  }

  /**
   * 4.18 Confirm Corporate Verification by User ID (Admin / Self) (#35 / 2.15).
   * POST /api/v1/users/{userId}/corporate-verification/confirm
   * Body requires { ruc, code }
   */
  public async confirmCorporateVerificationForUser(
    userId: string | number,
    resource: import('./corporate-verification.resource').ConfirmCorporateVerificationResource
  ): Promise<import('./corporate-verification.resource').CorporateVerificationStatusResource> {
    const payload = {
      ruc: resource.ruc,
      code: resource.code || resource.verificationCode
    }
    const response = await this.http.post<import('./corporate-verification.resource').CorporateVerificationStatusResource>(
      `/api/v1/users/${userId}/corporate-verification/confirm`,
      payload
    )
    return response.data
  }
}

