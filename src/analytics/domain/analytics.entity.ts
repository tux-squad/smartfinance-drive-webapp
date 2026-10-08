/**
 * Domain entities for Role-Based Analytics (Dealer, Financial Institution, Admin).
 */

export interface DealerInventoryMetrics {
  totalVehicles: number
  availableVehicles: number
  reservedVehicles: number
  soldVehicles: number
  totalInventoryValuePen: number
  totalInventoryValueUsd: number
}

export interface DealerCrmMetrics {
  totalLeads: number
  newLeads: number
  contactedLeads: number
  qualifiedLeads: number
  inNegotiationLeads: number
  closedWonLeads: number
  closedLostLeads: number
  conversionRate: number
}

export interface DealerTestDriveMetrics {
  totalTestDrives: number
  pendingTestDrives: number
  confirmedTestDrives: number
  completedTestDrives: number
  cancelledTestDrives: number
}

export interface DealerFinancingMetrics {
  totalApplicationsReceived: number
  pendingApplications: number
  approvedApplications: number
  rejectedApplications: number
}

export class DealerAnalytics {
  constructor(
    public readonly dealerUserId: string,
    public readonly inventory: DealerInventoryMetrics,
    public readonly crm: DealerCrmMetrics,
    public readonly testDrives: DealerTestDriveMetrics,
    public readonly financing: DealerFinancingMetrics,
    public readonly period: string = 'ALL_TIME'
  ) {}
}

export class FinancialInstitutionAnalytics {
  constructor(
    public readonly financialEntityId: string,
    public readonly financialEntityName: string,
    public readonly totalApplicationsReceived: number,
    public readonly underReviewApplications: number,
    public readonly approvedApplications: number,
    public readonly rejectedApplications: number,
    public readonly disbursedApplications: number,
    public readonly approvalRate: number,
    public readonly totalRequestedVolumePen: number,
    public readonly totalDisbursedVolumePen: number,
    public readonly averageTea: number,
    public readonly activeRateBenchmarksCount: number,
    public readonly totalSimulationsCount: number
  ) {}

  get formattedApprovalRate(): string {
    return `${(this.approvalRate * 100).toFixed(1)}%`
  }

  get formattedAverageTea(): string {
    return `${this.averageTea.toFixed(2)}%`
  }

  get formattedRequestedVolumePen(): string {
    return `S/ ${this.totalRequestedVolumePen.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  get formattedDisbursedVolumePen(): string {
    return `S/ ${this.totalDisbursedVolumePen.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
}

export class AdminAnalytics {
  constructor(
    public readonly totalDealerships: number,
    public readonly activeDealerships: number,
    public readonly totalFinancialEntities: number,
    public readonly totalRegisteredUsers: number,
    public readonly totalVehiclesListed: number,
    public readonly totalCreditApplications: number,
    public readonly totalSimulationsRun: number,
    public readonly totalActiveSubscriptions: number,
    public readonly estimatedMonthlyRecurringRevenueUsd: number
  ) {}

  get formattedMrrUsd(): string {
    return `$ ${this.estimatedMonthlyRecurringRevenueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
}
