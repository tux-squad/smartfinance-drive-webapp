/**
 * Infrastructure DTO matching backend JSON for a Schedule Item (supports both paymentSchedule and legacy schedule).
 */
export interface ScheduleItemResource {
  id?: string
  periodNumber: number
  dueDate?: string
  paymentDate?: string
  daysInPeriod?: number
  currency?: string
  initialBalanceAmount?: number
  initialBalance?: number
  interestPaymentAmount?: number
  interestPayment?: number
  principalAmortizationAmount?: number
  principalAmortization?: number
  creditLifeInsuranceAmount?: number
  creditLifeInsurance?: number
  vehicleInsuranceAmount?: number
  vehicleInsurance?: number
  totalInstallmentAmount?: number
  totalMonthlyPayment?: number
  finalBalanceAmount?: number
  finalBalance?: number
  graceType?: string
}

export interface SimulationMetricsResource {
  financedAmount?: number
  downPaymentAmount?: number
  balloonPaymentAmount?: number
  tcea?: number
  tir?: number
  van?: number
  totalInterest?: number
  totalAmount?: number
}

/**
 * Infrastructure DTO matching backend JSON for a Simulation (API Doc 2.22).
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
  metrics?: SimulationMetricsResource
  paymentSchedule?: ScheduleItemResource[]
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
