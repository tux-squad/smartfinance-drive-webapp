import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Vehicle } from '../domain/vehicle.entity'
import type { SearchVehiclesQuery } from '../domain/search-vehicles.query'
import { CatalogApi } from '../infrastructure/catalog-api'

const catalogApi = new CatalogApi()

export const useCatalogStore = defineStore('catalog', () => {
  const vehicles = ref<Vehicle[]>([])
  const selectedVehicle = ref<Vehicle | null>(null)
  const totalElements = ref<number>(0)
  const totalPages = ref<number>(0)
  const currentPage = ref<number>(0)
  const pageSize = ref<number>(12)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const filters = ref<SearchVehiclesQuery>({
    brand: '',
    model: '',
    minPrice: undefined,
    maxPrice: undefined,
    minYear: undefined,
    maxYear: undefined,
    condition: '',
    page: 0,
    size: 12
  })

  const hasVehicles = computed(() => vehicles.value.length > 0)
  const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.value.brand) count++
    if (filters.value.model) count++
    if (filters.value.minPrice !== undefined && filters.value.minPrice !== null) count++
    if (filters.value.maxPrice !== undefined && filters.value.maxPrice !== null) count++
    if (filters.value.minYear !== undefined && filters.value.minYear !== null) count++
    if (filters.value.maxYear !== undefined && filters.value.maxYear !== null) count++
    if (filters.value.condition) count++
    return count
  })

  /**
   * Fetches paginated vehicle list applying active filters (3.1).
   */
  const fetchVehicles = async (queryOverrides?: Partial<SearchVehiclesQuery>): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      if (queryOverrides) {
        filters.value = { ...filters.value, ...queryOverrides }
      }

      const pageResult = await catalogApi.getVehicles(filters.value)
      vehicles.value = pageResult.content || []
      totalElements.value = pageResult.totalElements || 0
      totalPages.value = pageResult.totalPages || 0
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar el catálogo de vehículos.'
      vehicles.value = []
      totalElements.value = 0
      totalPages.value = 0
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches full specs of a single vehicle by UUID (3.3).
   */
  const fetchVehicleById = async (vehicleId: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const vehicle = await catalogApi.getVehicleById(vehicleId)
      if (vehicle && vehicle.id) {
        selectedVehicle.value = vehicle
        return true
      }
      return false
    } catch (err: any) {
      error.value = err.response?.data?.message || 'No se encontró la información del vehículo.'
      selectedVehicle.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearSelectedVehicle = () => {
    selectedVehicle.value = null
  }

  const resetFilters = () => {
    filters.value = {
      brand: '',
      model: '',
      minPrice: undefined,
      maxPrice: undefined,
      minYear: undefined,
      maxYear: undefined,
      condition: '',
      page: 0,
      size: 12
    }
    fetchVehicles()
  }

  return {
    vehicles,
    selectedVehicle,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    error,
    filters,
    hasVehicles,
    activeFiltersCount,
    fetchVehicles,
    fetchVehicleById,
    clearSelectedVehicle,
    resetFilters
  }
})
