import { SalesAgent } from '../domain/sales-agent.entity'
import type { SalesAgentResource } from './sales-agent.resource'

export class SalesAgentAssembler {
  public static toEntity(resource: SalesAgentResource): SalesAgent {
    return new SalesAgent(
      resource.id,
      resource.dealershipId || null,
      resource.fullName || 'Asesor Comercial',
      resource.email || '',
      resource.phone || '',
      resource.active ?? true,
      Number(resource.assignedLeadsCount) || 0,
      resource.createdAt || new Date().toISOString()
    )
  }
}
