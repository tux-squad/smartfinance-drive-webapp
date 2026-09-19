import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Consultation } from '../domain/consultation.entity'
import { ConsultationsApi, type AskConsultationCommand } from '../infrastructure/consultations-api'

const api = new ConsultationsApi()

export const useConsultationsStore = defineStore('consultations', () => {
  const history = ref<Consultation[]>([])
  const recommendations = ref<any[]>([])
  const isThinking = ref<boolean>(false)
  const error = ref<string | null>(null)

  const hasHistory = computed(() => history.value.length > 0)

  /**
   * Sends prompt to the Gemini AI advisor (10.2).
   */
  const askAdvisor = async (command: AskConsultationCommand): Promise<Consultation | null> => {
    isThinking.value = true
    error.value = null
    try {
      const consultation = await api.askConsultation(command)
      history.value.push(consultation)
      return consultation
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al comunicarse con el Asesor IA.'
      return null
    } finally {
      isThinking.value = false
    }
  }

  /**
   * Fetches history of previous consultations (10.3).
   */
  const fetchHistory = async (): Promise<void> => {
    try {
      history.value = await api.getHistory()
    } catch {
      history.value = []
    }
  }

  /**
   * Fetches AI-recommended vehicles (10.1).
   */
  const fetchRecommendations = async (): Promise<void> => {
    try {
      recommendations.value = await api.getRecommendations()
    } catch {
      recommendations.value = []
    }
  }

  return {
    history,
    recommendations,
    isThinking,
    error,
    hasHistory,
    askAdvisor,
    fetchHistory,
    fetchRecommendations
  }
})
