import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import type { SimulationResource, SimulationPageResource } from './simulation.resource'
import type { CreateSimulationCommand } from '../domain/create-simulation.command'
import { SimulationAssembler } from './simulation.assembler'
import { Simulation } from '../domain/simulation.entity'
import { SimulationPage } from '../domain/simulation-page.entity'
import type { CreditApplicationResource } from './credit-application.resource'
import { CreditApplicationAssembler } from './credit-application.assembler'
import { CreditApplication } from '../domain/credit-application.entity'
import type { CreateCreditApplicationCommand, UpdateCreditApplicationStatusCommand } from '../domain/create-credit-application.command'

/**
 * Infrastructure API Gateway for Financing endpoints (/api/v1/simulations and /api/v1/credit-applications).
 */
export class FinancingApi extends BaseApi {
  /**
   * 5.1 Create a new credit simulation.
   */
  public async createSimulation(command: CreateSimulationCommand): Promise<Simulation> {
    const payload = SimulationAssembler.toCreateRequestResource(command)
    const response: AxiosResponse<SimulationResource> = await this.http.post<SimulationResource>('/api/v1/simulations', payload)
    return SimulationAssembler.toEntity(response.data)
  }

  /**
   * 5.2 List user credit simulations (paginated).
   */
  public async getSimulations(page: number = 0, size: number = 10): Promise<SimulationPage> {
    const response: AxiosResponse<SimulationPageResource> = await this.http.get<SimulationPageResource>('/api/v1/simulations', {
      params: { page, size }
    })
    return SimulationAssembler.toPageEntity(response.data)
  }

  /**
   * 5.3 Get simulation details by UUID.
   */
  public async getSimulationById(id: string): Promise<Simulation> {
    const response: AxiosResponse<SimulationResource> = await this.http.get<SimulationResource>(`/api/v1/simulations/${id}`)
    return SimulationAssembler.toEntity(response.data)
  }

  /**
   * 5.4 Delete a credit simulation by UUID.
   */
  public async deleteSimulation(id: string): Promise<void> {
    await this.http.delete<void>(`/api/v1/simulations/${id}`)
  }

  /**
   * 5.5 Convert a simulation directly into a credit application.
   * POST /api/v1/simulations/{id}/apply
   */
  public async applySimulation(simulationId: string): Promise<CreditApplication> {
    const response: AxiosResponse<CreditApplicationResource> = await this.http.post<CreditApplicationResource>(
      `/api/v1/simulations/${simulationId}/apply`
    )
    return CreditApplicationAssembler.toEntity(response.data)
  }

  /**
   * 5.6 Submit formal credit application to bank.
   * POST /api/v1/credit-applications
   */
  public async createCreditApplication(command: CreateCreditApplicationCommand): Promise<CreditApplication> {
    const payload = CreditApplicationAssembler.toCreateRequestResource(command)
    const response: AxiosResponse<CreditApplicationResource> = await this.http.post<CreditApplicationResource>(
      '/api/v1/credit-applications',
      payload
    )
    return CreditApplicationAssembler.toEntity(response.data)
  }

  /**
   * 5.7 List current user credit applications.
   * GET /api/v1/credit-applications/me
   */
  public async getMyCreditApplications(): Promise<CreditApplication[]> {
    const response: AxiosResponse<CreditApplicationResource[]> = await this.http.get<CreditApplicationResource[]>(
      '/api/v1/credit-applications/me'
    )
    return Array.isArray(response.data) ? response.data.map(r => CreditApplicationAssembler.toEntity(r)) : []
  }

  /**
   * 5.8 Get credit application by ID.
   * GET /api/v1/credit-applications/{id}
   */
  public async getCreditApplicationById(id: string): Promise<CreditApplication> {
    const response: AxiosResponse<CreditApplicationResource> = await this.http.get<CreditApplicationResource>(
      `/api/v1/credit-applications/${id}`
    )
    return CreditApplicationAssembler.toEntity(response.data)
  }

  /**
   * 5.9 Update credit application status (Financial Institution / Admin).
   * PATCH /api/v1/credit-applications/{id}/status
   */
  public async updateCreditApplicationStatus(
    id: string,
    command: UpdateCreditApplicationStatusCommand
  ): Promise<CreditApplication> {
    const response: AxiosResponse<CreditApplicationResource> = await this.http.patch<CreditApplicationResource>(
      `/api/v1/credit-applications/${id}/status`,
      command
    )
    return CreditApplicationAssembler.toEntity(response.data)
  }
}

