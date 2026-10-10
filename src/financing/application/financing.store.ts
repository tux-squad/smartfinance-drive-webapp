import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Simulation } from '../domain/simulation.entity'
import type { CreateSimulationCommand } from '../domain/create-simulation.command'
import { CreditApplication } from '../domain/credit-application.entity'
import type { CreateCreditApplicationCommand, UpdateCreditApplicationStatusCommand } from '../domain/create-credit-application.command'
import { CreditApplicationAssembler } from '../infrastructure/credit-application.assembler'
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
      const rawMsg = err.response?.data?.message || err.response?.data?.error || err.message || ''
      if (rawMsg.includes('userNotFound') || rawMsg.includes('User not found')) {
        error.value = 'Usuario no encontrado en la base de datos. Por favor cierra sesión y vuelve a iniciar para sincronizar tu cuenta.'
      } else if (rawMsg.includes('vehicleNotFound') || rawMsg.includes('Vehicle not found')) {
        error.value = 'El vehículo seleccionado no se encuentra disponible en el catálogo.'
      } else if (rawMsg.includes('entityNotFound') || rawMsg.includes('Financial entity not found')) {
        error.value = 'La entidad financiera seleccionada no está disponible.'
      } else {
        error.value = rawMsg || 'Error al generar la simulación de crédito.'
      }
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
      const apiApps = await financingApi.getMyCreditApplications()
      const storedRaw = localStorage.getItem('smartfinance_credit_applications')
      let localApps: CreditApplication[] = []
      if (storedRaw) {
        try {
          const parsed = JSON.parse(storedRaw)
          localApps = Array.isArray(parsed) ? parsed.map(r => CreditApplicationAssembler.toEntity(r)) : []
        } catch {
          // ignore
        }
      }

      // Merge unique by ID
      const map = new Map<string, CreditApplication>()
      localApps.forEach(a => { if (a?.id) map.set(a.id, a) })
      apiApps.forEach(a => { if (a?.id) map.set(a.id, a) })
      creditApplications.value = Array.from(map.values())
      localStorage.setItem('smartfinance_credit_applications', JSON.stringify(creditApplications.value))
    } catch (err: any) {
      // For bank or roles without GET /credit-applications/me, load stored applications
      const storedRaw = localStorage.getItem('smartfinance_credit_applications')
      if (storedRaw) {
        try {
          const parsed = JSON.parse(storedRaw)
          creditApplications.value = Array.isArray(parsed) ? parsed.map(r => CreditApplicationAssembler.toEntity(r)) : []
        } catch {
          creditApplications.value = []
        }
      } else {
        creditApplications.value = []
      }
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
      if (currentApplication.value) {
        const index = creditApplications.value.findIndex(a => a.id === id)
        if (index >= 0) {
          creditApplications.value[index] = currentApplication.value
        } else {
          creditApplications.value.push(currentApplication.value)
        }
        localStorage.setItem('smartfinance_credit_applications', JSON.stringify(creditApplications.value))
      }
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
      const index = creditApplications.value.findIndex(a => a.id === id)
      if (index >= 0) {
        creditApplications.value[index] = updated
      } else {
        creditApplications.value.push(updated)
      }
      localStorage.setItem('smartfinance_credit_applications', JSON.stringify(creditApplications.value))
      return true
    } catch (err: any) {
      // If backend updated or failed, update locally if needed
      const index = creditApplications.value.findIndex(a => a.id === id)
      if (index >= 0 && creditApplications.value[index]) {
        const existing = creditApplications.value[index]
        const modified = new CreditApplication(
          existing.id,
          existing.userId,
          existing.simulationId,
          existing.financialEntityId,
          existing.vehicleId,
          existing.requestedAmount,
          existing.currency,
          existing.monthlyIncome,
          existing.employmentStatus,
          command.status,
          existing.notes,
          command.notes,
          existing.createdAt,
          new Date().toISOString(),
          existing.vehicleTitle,
          existing.financialEntityName,
          existing.termMonths,
          existing.downPayment
        )
        creditApplications.value[index] = modified
        localStorage.setItem('smartfinance_credit_applications', JSON.stringify(creditApplications.value))
        currentApplication.value = modified
        return true
      }
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

