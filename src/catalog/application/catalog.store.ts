import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Vehicle } from '../domain/vehicle.entity'
import type { SearchVehiclesQuery } from '../domain/search-vehicles.query'
import type { CreateVehicleCommand } from '../domain/create-vehicle.command'
import type { UploadVehicleImageCommand } from '../domain/upload-vehicle-image.command'
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
   * Registers a new vehicle in the catalog (3.2).
   */
  const createVehicle = async (command: CreateVehicleCommand): Promise<Vehicle | null> => {
    isLoading.value = true
    error.value = null
    try {
      const newVehicle = await catalogApi.createVehicle(command)
      vehicles.value.unshift(newVehicle)
      totalElements.value++
      return newVehicle
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message
      const status = err.response?.status ? ` [HTTP ${err.response.status}]` : ''
      error.value = serverMsg ? `${serverMsg}${status}` : 'Error al registrar el vehículo.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches full specs of a single vehicle by UUID (3.3).
   */
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
      const local = vehicles.value.find((v) => v.id === vehicleId)
      if (local) {
        selectedVehicle.value = local
        return true
      }
      return false
    } catch (err: any) {
      // Resilient fallback to vehicle in memory if backend endpoint returns 403 or error
      const local = vehicles.value.find((v) => v.id === vehicleId)
      if (local) {
        selectedVehicle.value = local
        error.value = null
        return true
      }
      // If vehicles were not loaded yet, try loading public catalog
      if (vehicles.value.length === 0) {
        await fetchVehicles()
        const found = vehicles.value.find((v) => v.id === vehicleId)
        if (found) {
          selectedVehicle.value = found
          error.value = null
          return true
        }
      }
      error.value = err.response?.data?.message || 'No se encontró la información del vehículo.'
      selectedVehicle.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Uploads an image for a vehicle (3.4).
   */
  const uploadVehicleImage = async (command: UploadVehicleImageCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const updatedVehicle = await catalogApi.uploadVehicleImage(command)
      if (selectedVehicle.value && selectedVehicle.value.id === updatedVehicle.id) {
        selectedVehicle.value = updatedVehicle
      }
      const index = vehicles.value.findIndex((v) => v.id === updatedVehicle.id)
      if (index !== -1) {
        vehicles.value[index] = updatedVehicle
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al subir la imagen del vehículo.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches vehicles belonging to a specific user/dealer (3.4).
   */
  const fetchVehiclesByUserId = async (userId: string): Promise<Vehicle[]> => {
    isLoading.value = true
    error.value = null
    try {
      return await catalogApi.getVehiclesByUserId(userId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar los vehículos del concesionario.'
      return []
    } finally {
      isLoading.value = false
    }
  }

  const brands = ref<string[]>([])

  /**
   * Fetches available brands from the backend (3.3).
   */
  const fetchBrands = async (): Promise<void> => {
    try {
      brands.value = await catalogApi.getBrands()
    } catch {
      brands.value = []
    }
  }

  /**
   * Updates vehicle status (3.7).
   */
  const updateVehicleStatus = async (vehicleId: string, status: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await catalogApi.updateVehicleStatus(vehicleId, status)
      const index = vehicles.value.findIndex(v => v.id === vehicleId)
      if (index !== -1) {
        vehicles.value[index] = updated
      }
      if (selectedVehicle.value?.id === vehicleId) {
        selectedVehicle.value = updated
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar el estado del vehículo.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Uploads an additional image to vehicle gallery (3.10).
   */
  const uploadGalleryImage = async (vehicleId: string, file: File): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await catalogApi.uploadVehicleGalleryImage(vehicleId, file)
      if (selectedVehicle.value?.id === vehicleId) {
        selectedVehicle.value = updated
      }
      const index = vehicles.value.findIndex(v => v.id === vehicleId)
      if (index !== -1) {
        vehicles.value[index] = updated
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar imagen adicional a la galería.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deletes an image from gallery by index (3.11).
   */
  const deleteGalleryImage = async (vehicleId: string, imageIndex: number): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await catalogApi.deleteVehicleGalleryImage(vehicleId, imageIndex)
      if (selectedVehicle.value?.id === vehicleId) {
        selectedVehicle.value = updated
      }
      const index = vehicles.value.findIndex(v => v.id === vehicleId)
      if (index !== -1) {
        vehicles.value[index] = updated
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar foto de la galería.'
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
    brands,
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
    fetchVehiclesByUserId,
    fetchBrands,
    createVehicle,
    fetchVehicleById,
    updateVehicleStatus,
    uploadVehicleImage,
    uploadGalleryImage,
    deleteGalleryImage,
    clearSelectedVehicle,
    resetFilters
  }
})

