import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import type { SimulationResource, SimulationPageResource } from './simulation.resource'
import type { CreateSimulationCommand } from '../domain/create-simulation.command'
import { SimulationAssembler } from './simulation.assembler'
import { Simulation } from '../domain/simulation.entity'
import { SimulationPage } from '../domain/simulation-page.entity'

/**
 * Infrastructure API Gateway for Financing endpoints (/api/v1/simulations).
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
}
