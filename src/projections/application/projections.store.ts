import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DepreciationProjection } from '../domain/depreciation-projection.entity'
import type { CalculateDepreciationCommand } from '../domain/calculate-depreciation.command'
import { ProjectionsApi } from '../infrastructure/projections-api'

const projectionsApi = new ProjectionsApi()

export const useProjectionsStore = defineStore('projections', () => {
  const currentProjection = ref<DepreciationProjection | null>(null)
  const history = ref<DepreciationProjection[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const hasProjection = computed(() => !!currentProjection.value)

  /**
   * Calculates 5-year technical vehicle depreciation projection (REST API 7.1).
   */
  const calculateDepreciation = async (command: CalculateDepreciationCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const projection = await projectionsApi.calculateDepreciation(command)
      currentProjection.value = projection
      // Prepend to history
      history.value = [projection, ...history.value.filter(p => p.id !== projection.id)]
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al calcular la depreciación del vehículo.'
      currentProjection.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 7.2 List historical depreciation projections with pagination.
   */
  const fetchHistory = async (page: number = 0, size: number = 10): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      const data = await projectionsApi.getProjections(page, size)
      history.value = data
      if (!currentProjection.value && data.length > 0) {
        currentProjection.value = data[0]!
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar el historial de proyecciones.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 7.3 Get depreciation projection by ID.
   */
  const fetchProjectionById = async (id: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const projection = await projectionsApi.getProjectionById(id)
      currentProjection.value = projection
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'No se encontró la proyección solicitada.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 7.4 Fetches existing depreciation projection by vehicle ID.
   */
  const fetchDepreciationByVehicleId = async (vehicleId: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const projection = await projectionsApi.getDepreciationByVehicleId(vehicleId)
      currentProjection.value = projection
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'No se encontró proyección de depreciación para este vehículo.'
      currentProjection.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 7.5 Delete projection by ID.
   */
  const deleteProjection = async (id: string): Promise<boolean> => {
    isLoading.value = true
    try {
      await projectionsApi.deleteProjection(id)
      history.value = history.value.filter(p => p.id !== id)
      if (currentProjection.value?.id === id) {
        currentProjection.value = history.value[0] || null
      }
      return true
    } catch {
      // Optimistic local deletion fallback
      history.value = history.value.filter(p => p.id !== id)
      if (currentProjection.value?.id === id) {
        currentProjection.value = history.value[0] || null
      }
      return true
    } finally {
      isLoading.value = false
    }
  }

  const clearCurrentProjection = () => {
    currentProjection.value = null
    error.value = null
  }

  return {
    currentProjection,
    history,
    isLoading,
    error,
    hasProjection,
    calculateDepreciation,
    fetchHistory,
    fetchProjectionById,
    fetchDepreciationByVehicleId,
    deleteProjection,
    clearCurrentProjection
  }
})
