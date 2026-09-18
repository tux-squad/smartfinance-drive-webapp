/**
 * Infrastructure DTO matching backend JSON for a Schedule Item.
 */
export interface ScheduleItemResource {
  periodNumber: number
  paymentDate: string
  initialBalance: number
  interestPayment: number
  principalAmortization: number
  creditLifeInsurance: number
  vehicleInsurance: number
  totalMonthlyPayment: number
  finalBalance: number
}

/**
 * Infrastructure DTO matching backend JSON for a Simulation.
 */
export interface SimulationResource {
  id: string
  title: string
  userId?: string
  vehicleId?: string
  financialEntityId?: string
  vehiclePriceAmount?: number
  currency?: string
  downPaymentPercentage?: number
  balloonPaymentPercentage?: number
  annualEffectiveRate?: number
  monthlyCreditLifeInsuranceRate?: number
  vehicleInsuranceFeeAmount?: number
  vehicleInsuranceType?: string
  loanTermMonths?: number
  gracePeriodType?: string
  gracePeriodMonths?: number
  initialFeesAmount?: number
  discountRate?: number
  startDate?: string
  loanAmount?: number
  monthlyPaymentAmount?: number
  tcea?: number
  npv?: number
  irr?: number
  schedule?: ScheduleItemResource[]
}

/**
 * Infrastructure DTO matching backend JSON for paginated Simulations response.
 */
export interface SimulationPageResource {
  content: SimulationResource[]
  totalElements: number
  totalPages: number
}

/**
 * Infrastructure DTO for creating a new Simulation request payload.
 */
export interface CreateSimulationRequestResource {
  title: string
  userId: string
  vehicleId: string
  financialEntityId: string
  vehiclePriceAmount: number
  currency: string
  downPaymentPercentage: number
  balloonPaymentPercentage: number
  annualEffectiveRate: number
  monthlyCreditLifeInsuranceRate: number
  vehicleInsuranceFeeAmount: number
  vehicleInsuranceType: string
  loanTermMonths: number
  gracePeriodType: string
  gracePeriodMonths: number
  initialFeesAmount: number
  discountRate: number
  startDate: string
}
