import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AnalyticsApi } from '../infrastructure/analytics-api'
import {
  DealerAnalytics,
  FinancialInstitutionAnalytics,
  AdminAnalytics
} from '../domain/analytics.entity'

const analyticsApi = new AnalyticsApi()

export const useAnalyticsStore = defineStore('analytics', () => {
  const dealerAnalytics = ref<DealerAnalytics | null>(null)
  const financialInstitutionAnalytics = ref<FinancialInstitutionAnalytics | null>(null)
  const adminAnalytics = ref<AdminAnalytics | null>(null)

  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchDealerAnalytics = async (params?: {
    dealerUserId?: string
    period?: 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'ALL_TIME' | string
  }): Promise<DealerAnalytics | null> => {
    isLoading.value = true
    error.value = null
    try {
      dealerAnalytics.value = await analyticsApi.getDealerAnalytics(params)
      return dealerAnalytics.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener analíticas de concesionario.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const fetchFinancialInstitutionAnalytics = async (financialEntityId?: string): Promise<FinancialInstitutionAnalytics | null> => {
    isLoading.value = true
    error.value = null
    try {
      financialInstitutionAnalytics.value = await analyticsApi.getFinancialInstitutionAnalytics(financialEntityId)
      return financialInstitutionAnalytics.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener analíticas de entidad financiera.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const fetchAdminAnalytics = async (): Promise<AdminAnalytics | null> => {
    isLoading.value = true
    error.value = null
    try {
      adminAnalytics.value = await analyticsApi.getAdminAnalytics()
      return adminAnalytics.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener analíticas globales de administración.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    dealerAnalytics,
    financialInstitutionAnalytics,
    adminAnalytics,
    isLoading,
    error,
    fetchDealerAnalytics,
    fetchFinancialInstitutionAnalytics,
    fetchAdminAnalytics
  }
})
