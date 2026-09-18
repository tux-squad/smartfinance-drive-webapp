import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CreditScore } from '../domain/credit-score.entity'
import type { EvaluateScoreCommand } from '../domain/evaluate-score.command'
import { ScoringApi } from '../infrastructure/scoring-api'

const scoringApi = new ScoringApi()

export const useScoringStore = defineStore('scoring', () => {
  const creditScores = ref<CreditScore[]>([])
  const currentScore = ref<CreditScore | null>(null)
  const totalElements = ref<number>(0)
  const totalPages = ref<number>(0)
  const currentPage = ref<number>(0)
  const pageSize = ref<number>(10)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const hasCreditScores = computed(() => creditScores.value.length > 0)
  const hasCurrentScore = computed(() => !!currentScore.value && !!currentScore.value.id)

  /**
   * Triggers an automated credit score evaluation for a client profile (6.1).
   */
  const evaluateCreditScore = async (command: EvaluateScoreCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      currentScore.value = await scoringApi.evaluateCreditScore(command)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al ejecutar la evaluación del score crediticio.'
      currentScore.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches paginated history of credit scores (6.2).
   */
  const fetchCreditScores = async (page: number = 0, size: number = 10): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      currentPage.value = page
      pageSize.value = size
      const pageResult = await scoringApi.getCreditScores(page, size)
      creditScores.value = pageResult.content || []
      totalElements.value = pageResult.totalElements || 0
      totalPages.value = pageResult.totalPages || 0
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener el historial de evaluaciones crediticias.'
      creditScores.value = []
      totalElements.value = 0
      totalPages.value = 0
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches full detail of a credit score evaluation by UUID (6.3).
   */
  const fetchCreditScoreById = async (id: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      currentScore.value = await scoringApi.getCreditScoreById(id)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener la evaluación crediticia.'
      currentScore.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches credit score history for a specific profileId (6.4).
   */
  const fetchScoresByProfileId = async (profileId: string): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      creditScores.value = await scoringApi.getCreditScoresByProfileId(profileId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener evaluaciones del perfil.'
      creditScores.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deletes a credit score evaluation by UUID (6.5).
   */
  const deleteCreditScore = async (id: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      await scoringApi.deleteCreditScore(id)
      if (currentScore.value?.id === id) {
        currentScore.value = null
      }
      await fetchCreditScores(currentPage.value, pageSize.value)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar el registro de score.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearCurrentScore = () => {
    currentScore.value = null
  }

  return {
    creditScores,
    currentScore,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    error,
    hasCreditScores,
    hasCurrentScore,
    evaluateCreditScore,
    fetchCreditScores,
    fetchCreditScoreById,
    fetchScoresByProfileId,
    deleteCreditScore,
    clearCurrentScore
  }
})
