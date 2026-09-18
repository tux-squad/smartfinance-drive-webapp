import { ScheduleItem } from '../domain/schedule-item.value-object'
import { Simulation } from '../domain/simulation.entity'
import { SimulationPage } from '../domain/simulation-page.entity'
import type { CreateSimulationCommand } from '../domain/create-simulation.command'
import type {
  ScheduleItemResource,
  SimulationResource,
  SimulationPageResource,
  CreateSimulationRequestResource
} from './simulation.resource'

/**
 * Static assembler mapping infrastructure resources to domain entities for Financing.
 */
export class SimulationAssembler {
  /**
   * Maps a ScheduleItemResource to a ScheduleItem value object.
   */
  static toScheduleItemValueObject(resource: ScheduleItemResource): ScheduleItem {
    return new ScheduleItem(
      resource.periodNumber || 0,
      resource.paymentDate || '',
      resource.initialBalance || 0,
      resource.interestPayment || 0,
      resource.principalAmortization || 0,
      resource.creditLifeInsurance || 0,
      resource.vehicleInsurance || 0,
      resource.totalMonthlyPayment || 0,
      resource.finalBalance || 0
    )
  }

  /**
   * Maps a SimulationResource to a Simulation domain entity.
   */
  static toEntity(resource: SimulationResource): Simulation {
    const schedule = (resource.schedule || []).map((s) => SimulationAssembler.toScheduleItemValueObject(s))
    return new Simulation(
      resource.id,
      resource.title || 'Simulación de Crédito',
      resource.userId || '',
      resource.vehicleId || '',
      resource.financialEntityId || '',
      resource.vehiclePriceAmount || 0,
      resource.currency || 'USD',
      resource.downPaymentPercentage || 20,
      resource.balloonPaymentPercentage || 0,
      resource.annualEffectiveRate || 9.5,
      resource.monthlyCreditLifeInsuranceRate || 0.05,
      resource.vehicleInsuranceFeeAmount || 0,
      resource.vehicleInsuranceType || 'FULL_COVERAGE',
      resource.loanTermMonths || 36,
      resource.gracePeriodType || 'NONE',
      resource.gracePeriodMonths || 0,
      resource.initialFeesAmount || 0,
      resource.discountRate || 8.0,
      resource.startDate || (new Date().toISOString().split('T')[0] as string),
      resource.loanAmount || 0,
      resource.monthlyPaymentAmount || 0,
      resource.tcea || 0,
      resource.npv || 0,
      resource.irr || 0,
      schedule
    )
  }

  /**
   * Maps a SimulationPageResource to a SimulationPage domain entity.
   */
  static toPageEntity(resource: SimulationPageResource): SimulationPage {
    const content = (resource.content || []).map((item) => SimulationAssembler.toEntity(item))
    return new SimulationPage(content, resource.totalElements || 0, resource.totalPages || 0)
  }

  /**
   * Maps a CreateSimulationCommand to CreateSimulationRequestResource payload.
   */
  static toCreateRequestResource(command: CreateSimulationCommand): CreateSimulationRequestResource {
    return {
      title: command.title,
      userId: command.userId,
      vehicleId: command.vehicleId,
      financialEntityId: command.financialEntityId,
      vehiclePriceAmount: command.vehiclePriceAmount,
      currency: command.currency,
      downPaymentPercentage: command.downPaymentPercentage,
      balloonPaymentPercentage: command.balloonPaymentPercentage,
      annualEffectiveRate: command.annualEffectiveRate,
      monthlyCreditLifeInsuranceRate: command.monthlyCreditLifeInsuranceRate,
      vehicleInsuranceFeeAmount: command.vehicleInsuranceFeeAmount,
      vehicleInsuranceType: command.vehicleInsuranceType,
      loanTermMonths: command.loanTermMonths,
      gracePeriodType: command.gracePeriodType,
      gracePeriodMonths: command.gracePeriodMonths,
      initialFeesAmount: command.initialFeesAmount,
      discountRate: command.discountRate,
      startDate: command.startDate
    }
  }
}
