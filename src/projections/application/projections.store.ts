import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DepreciationProjection } from '../domain/depreciation-projection.entity'
import type { CalculateDepreciationCommand } from '../domain/calculate-depreciation.command'
import { ProjectionsApi } from '../infrastructure/projections-api'

const projectionsApi = new ProjectionsApi()

export const useProjectionsStore = defineStore('projections', () => {
  const currentProjection = ref<DepreciationProjection | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const hasProjection = computed(() => !!currentProjection.value)

  /**
   * Calculates 5-year technical vehicle depreciation projection (REST API).
   */
  const calculateDepreciation = async (command: CalculateDepreciationCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const projection = await projectionsApi.calculateDepreciation(command)
      currentProjection.value = projection
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
   * Fetches existing depreciation projection by vehicle ID.
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

  const clearCurrentProjection = () => {
    currentProjection.value = null
    error.value = null
  }

  return {
    currentProjection,
    isLoading,
    error,
    hasProjection,
    calculateDepreciation,
    fetchDepreciationByVehicleId,
    clearCurrentProjection
  }
})
