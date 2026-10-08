import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import {
  DealerAnalytics,
  FinancialInstitutionAnalytics,
  AdminAnalytics
} from '../domain/analytics.entity'

export class AnalyticsApi extends BaseApi {
  /**
   * 10.1 Dealer Analytics Dashboard.
   * GET /api/v1/analytics/dealer
   */
  public async getDealerAnalytics(params?: {
    dealerUserId?: string
    period?: 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'ALL_TIME' | string
  }): Promise<DealerAnalytics> {
    const response: AxiosResponse<any> = await this.http.get('/api/v1/analytics/dealer', { params })
    const d = response.data
    return new DealerAnalytics(
      d.dealerUserId || '',
      {
        totalVehicles: d.inventory?.totalVehicles ?? 0,
        availableVehicles: d.inventory?.availableVehicles ?? 0,
        reservedVehicles: d.inventory?.reservedVehicles ?? 0,
        soldVehicles: d.inventory?.soldVehicles ?? 0,
        totalInventoryValuePen: d.inventory?.totalInventoryValuePen ?? 0,
        totalInventoryValueUsd: d.inventory?.totalInventoryValueUsd ?? 0
      },
      {
        totalLeads: d.crm?.totalLeads ?? 0,
        newLeads: d.crm?.newLeads ?? 0,
        contactedLeads: d.crm?.contactedLeads ?? 0,
        qualifiedLeads: d.crm?.qualifiedLeads ?? 0,
        inNegotiationLeads: d.crm?.inNegotiationLeads ?? 0,
        closedWonLeads: d.crm?.closedWonLeads ?? 0,
        closedLostLeads: d.crm?.closedLostLeads ?? 0,
        conversionRate: d.crm?.conversionRate ?? 0
      },
      {
        totalTestDrives: d.testDrives?.totalTestDrives ?? 0,
        pendingTestDrives: d.testDrives?.pendingTestDrives ?? 0,
        confirmedTestDrives: d.testDrives?.confirmedTestDrives ?? 0,
        completedTestDrives: d.testDrives?.completedTestDrives ?? 0,
        cancelledTestDrives: d.testDrives?.cancelledTestDrives ?? 0
      },
      {
        totalApplicationsReceived: d.financing?.totalApplicationsReceived ?? 0,
        pendingApplications: d.financing?.pendingApplications ?? 0,
        approvedApplications: d.financing?.approvedApplications ?? 0,
        rejectedApplications: d.financing?.rejectedApplications ?? 0
      },
      d.period || 'ALL_TIME'
    )
  }

  /**
   * 10.2 Financial Institution Analytics Dashboard.
   * GET /api/v1/analytics/financial-institution
   */
  public async getFinancialInstitutionAnalytics(financialEntityId?: string): Promise<FinancialInstitutionAnalytics> {
    const params = financialEntityId ? { financialEntityId } : undefined
    const response: AxiosResponse<any> = await this.http.get('/api/v1/analytics/financial-institution', { params })
    const f = response.data
    return new FinancialInstitutionAnalytics(
      f.financialEntityId || '',
      f.financialEntityName || 'Entidad Financiera',
      f.totalApplicationsReceived ?? 0,
      f.underReviewApplications ?? 0,
      f.approvedApplications ?? 0,
      f.rejectedApplications ?? 0,
      f.disbursedApplications ?? 0,
      f.approvalRate ?? 0,
      f.totalRequestedVolumePen ?? 0,
      f.totalDisbursedVolumePen ?? 0,
      f.averageTea ?? 0,
      f.activeRateBenchmarksCount ?? 0,
      f.totalSimulationsCount ?? 0
    )
  }

  /**
   * 10.3 Consolidated Admin Analytics Dashboard.
   * GET /api/v1/analytics/admin
   */
  public async getAdminAnalytics(): Promise<AdminAnalytics> {
    const response: AxiosResponse<any> = await this.http.get('/api/v1/analytics/admin')
    const a = response.data
    return new AdminAnalytics(
      a.totalDealerships ?? 0,
      a.activeDealerships ?? 0,
      a.totalFinancialEntities ?? 0,
      a.totalRegisteredUsers ?? 0,
      a.totalVehiclesListed ?? 0,
      a.totalCreditApplications ?? 0,
      a.totalSimulationsRun ?? 0,
      a.totalActiveSubscriptions ?? 0,
      a.estimatedMonthlyRecurringRevenueUsd ?? 0
    )
  }
}
