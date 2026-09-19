import { CreditApplication } from '../domain/credit-application.entity'
import type { CreateCreditApplicationCommand } from '../domain/create-credit-application.command'
import type { CreditApplicationResource, CreateCreditApplicationResource } from './credit-application.resource'

export class CreditApplicationAssembler {
  public static toEntity(resource: CreditApplicationResource): CreditApplication {
    return new CreditApplication(
      resource.id,
      resource.userId,
      resource.simulationId || null,
      resource.financialEntityId || null,
      resource.vehicleId || null,
      Number(resource.requestedAmount) || 0,
      resource.currency || 'USD',
      Number(resource.monthlyIncome) || 0,
      resource.employmentStatus || 'EMPLOYED',
      resource.status || 'PENDING',
      resource.notes || null,
      resource.reviewerNotes || null,
      resource.createdAt || new Date().toISOString(),
      resource.updatedAt || new Date().toISOString(),
      resource.vehicleTitle,
      resource.financialEntityName
    )
  }

  public static toCreateRequestResource(command: CreateCreditApplicationCommand): CreateCreditApplicationResource {
    return {
      simulationId: command.simulationId,
      financialEntityId: command.financialEntityId,
      vehicleId: command.vehicleId,
      requestedAmount: command.requestedAmount,
      currency: command.currency,
      monthlyIncome: command.monthlyIncome,
      employmentStatus: command.employmentStatus,
      notes: command.notes
    }
  }
}
