import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Simulation } from '../domain/simulation.entity'
import type { CreateSimulationCommand } from '../domain/create-simulation.command'
import { CreditApplication } from '../domain/credit-application.entity'
import type { CreateCreditApplicationCommand, UpdateCreditApplicationStatusCommand } from '../domain/create-credit-application.command'
import { FinancingApi } from '../infrastructure/financing-api'

const financingApi = new FinancingApi()

export const useFinancingStore = defineStore('financing', () => {
  const simulations = ref<Simulation[]>([])
  const currentSimulation = ref<Simulation | null>(null)
  const creditApplications = ref<CreditApplication[]>([])
  const currentApplication = ref<CreditApplication | null>(null)
  const totalElements = ref<number>(0)
  const totalPages = ref<number>(0)
  const currentPage = ref<number>(0)
  const pageSize = ref<number>(10)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const hasSimulations = computed(() => simulations.value.length > 0)
  const hasCurrentSimulation = computed(() => !!currentSimulation.value && !!currentSimulation.value.id)
  const hasCreditApplications = computed(() => creditApplications.value.length > 0)

  /**
   * Generates a new credit simulation (5.1).
   */
  const createSimulation = async (command: CreateSimulationCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      currentSimulation.value = await financingApi.createSimulation(command)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al generar la simulación de crédito.'
      currentSimulation.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches paginated history of credit simulations (5.2).
   */
  const fetchSimulations = async (page: number = 0, size: number = 10): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      currentPage.value = page
      pageSize.value = size
      const pageResult = await financingApi.getSimulations(page, size)
      simulations.value = pageResult.content || []
      totalElements.value = pageResult.totalElements || 0
      totalPages.value = pageResult.totalPages || 0
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener el historial de simulaciones.'
      simulations.value = []
      totalElements.value = 0
      totalPages.value = 0
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches full breakdown of a single simulation by UUID (5.3).
   */
  const fetchSimulationById = async (id: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      currentSimulation.value = await financingApi.getSimulationById(id)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener el detalle de la simulación.'
      currentSimulation.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deletes a credit simulation by UUID (5.4).
   */
  const deleteSimulation = async (id: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      await financingApi.deleteSimulation(id)
      if (currentSimulation.value?.id === id) {
        currentSimulation.value = null
      }
      await fetchSimulations(currentPage.value, pageSize.value)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar la simulación.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Converts a simulation directly into a formal credit application (5.5).
   */
  const applySimulation = async (simulationId: string): Promise<CreditApplication | null> => {
    isLoading.value = true
    error.value = null
    try {
      const app = await financingApi.applySimulation(simulationId)
      currentApplication.value = app
      await fetchMyCreditApplications()
      return app
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al promover la simulación a solicitud formal.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Creates a new formal credit application (5.6).
   */
  const createCreditApplication = async (command: CreateCreditApplicationCommand): Promise<CreditApplication | null> => {
    isLoading.value = true
    error.value = null
    try {
      const app = await financingApi.createCreditApplication(command)
      currentApplication.value = app
      await fetchMyCreditApplications()
      return app
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al enviar la solicitud de crédito al banco.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches user's formal credit applications (5.7).
   */
  const fetchMyCreditApplications = async (): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      creditApplications.value = await financingApi.getMyCreditApplications()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar las solicitudes de crédito.'
      creditApplications.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches single credit application by ID (5.8).
   */
  const fetchCreditApplicationById = async (id: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      currentApplication.value = await financingApi.getCreditApplicationById(id)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar el detalle de la solicitud.'
      currentApplication.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates application status (5.9).
   */
  const updateCreditApplicationStatus = async (
    id: string,
    command: UpdateCreditApplicationStatusCommand
  ): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await financingApi.updateCreditApplicationStatus(id, command)
      currentApplication.value = updated
      await fetchMyCreditApplications()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar el estado de la solicitud.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearCurrentSimulation = () => {
    currentSimulation.value = null
  }

  return {
    simulations,
    currentSimulation,
    creditApplications,
    currentApplication,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    error,
    hasSimulations,
    hasCurrentSimulation,
    hasCreditApplications,
    createSimulation,
    fetchSimulations,
    fetchSimulationById,
    deleteSimulation,
    applySimulation,
    createCreditApplication,
    fetchMyCreditApplications,
    fetchCreditApplicationById,
    updateCreditApplicationStatus,
    clearCurrentSimulation
  }
})

