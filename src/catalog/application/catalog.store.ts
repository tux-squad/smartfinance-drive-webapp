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
   * Helper to convert File to Data URL string (Base64).
   */
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Uploads an image for a vehicle (3.4).
   * Tries POST /vehicles/{id}/image (Cloudinary). If backend throws Cloudinary signature error (500),
   * falls back to saving the image directly via PUT /vehicles/{id} with imagePath.
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
      // Robust Fallback: If backend Cloudinary signature on Render fails (HTTP 500)
      try {
        const base64Data = await fileToDataUrl(command.file)
        const current = selectedVehicle.value?.id === command.vehicleId
          ? selectedVehicle.value
          : vehicles.value.find((v) => v.id === command.vehicleId) || await catalogApi.getVehicleById(command.vehicleId)

        if (current) {
          const updatedVehicle = await catalogApi.updateVehicle(command.vehicleId, {
            financialEntityId: current.financialEntityId,
            brand: current.brand,
            model: current.model,
            manufactureYear: current.manufactureYear,
            condition: current.condition,
            priceAmount: current.priceAmount,
            currency: current.currency,
            imagePath: base64Data
          })
          if (selectedVehicle.value && selectedVehicle.value.id === updatedVehicle.id) {
            selectedVehicle.value = updatedVehicle
          }
          const index = vehicles.value.findIndex((v) => v.id === updatedVehicle.id)
          if (index !== -1) {
            vehicles.value[index] = updatedVehicle
          }
          return true
        }
      } catch (fallbackErr) {
        console.warn('Fallback direct image update failed:', fallbackErr)
      }
      error.value = err.response?.data?.message || 'Error al subir la imagen del vehículo.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches vehicles belonging to authenticated user or specific user (2.16 / 2.17).
   */
  const fetchVehiclesByUserId = async (userId?: string): Promise<Vehicle[]> => {
    isLoading.value = true
    error.value = null
    try {
      return await catalogApi.getVehiclesByUserId(userId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar los vehículos del concesionario.'
      throw err
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
   * Tries POST /vehicles/{id}/images. If backend Cloudinary fails, falls back to PUT /vehicles/{id} with images array.
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
      // Robust Fallback: If Cloudinary fails on Render backend
      try {
        const base64Data = await fileToDataUrl(file)
        const current = selectedVehicle.value?.id === vehicleId
          ? selectedVehicle.value
          : vehicles.value.find(v => v.id === vehicleId) || await catalogApi.getVehicleById(vehicleId)

        if (current) {
          const currentImages = Array.isArray(current.images) ? [...current.images] : []
          currentImages.push(base64Data)
          const updated = await catalogApi.updateVehicle(vehicleId, {
            financialEntityId: current.financialEntityId,
            brand: current.brand,
            model: current.model,
            manufactureYear: current.manufactureYear,
            condition: current.condition,
            priceAmount: current.priceAmount,
            currency: current.currency,
            imagePath: current.imagePath,
            images: currentImages
          })
          if (selectedVehicle.value?.id === updated.id) {
            selectedVehicle.value = updated
          }
          const index = vehicles.value.findIndex(v => v.id === updated.id)
          if (index !== -1) {
            vehicles.value[index] = updated
          }
          return true
        }
      } catch (fallbackErr) {
        console.warn('Fallback gallery upload failed:', fallbackErr)
      }
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
      // Fallback: update images array via PUT
      try {
        const current = selectedVehicle.value?.id === vehicleId
          ? selectedVehicle.value
          : vehicles.value.find(v => v.id === vehicleId)
        if (current && Array.isArray(current.images)) {
          const updatedImages = current.images.filter((_, idx) => idx !== imageIndex)
          const updated = await catalogApi.updateVehicle(vehicleId, {
            financialEntityId: current.financialEntityId,
            brand: current.brand,
            model: current.model,
            manufactureYear: current.manufactureYear,
            condition: current.condition,
            priceAmount: current.priceAmount,
            currency: current.currency,
            imagePath: current.imagePath,
            images: updatedImages
          })
          if (selectedVehicle.value?.id === updated.id) {
            selectedVehicle.value = updated
          }
          const index = vehicles.value.findIndex(v => v.id === updated.id)
          if (index !== -1) {
            vehicles.value[index] = updated
          }
          return true
        }
      } catch (fallbackErr) {
        console.warn('Fallback gallery delete failed:', fallbackErr)
      }
      error.value = err.response?.data?.message || 'Error al eliminar foto de la galería.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates vehicle specifications by UUID (3.5 / 3.2).
   */
  const updateVehicle = async (vehicleId: string, resource: import('../infrastructure/vehicle.resource').UpdateVehicleResource): Promise<Vehicle | null> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await catalogApi.updateVehicle(vehicleId, resource)
      const index = vehicles.value.findIndex(v => v.id === vehicleId)
      if (index !== -1) {
        vehicles.value[index] = updated
      }
      if (selectedVehicle.value?.id === vehicleId) {
        selectedVehicle.value = updated
      }
      return updated
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar las especificaciones del vehículo.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deletes a vehicle listing by UUID (3.8 / 3.4).
   */
  const deleteVehicle = async (vehicleId: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      await catalogApi.deleteVehicle(vehicleId)
      vehicles.value = vehicles.value.filter(v => v.id !== vehicleId)
      if (selectedVehicle.value?.id === vehicleId) {
        selectedVehicle.value = null
      }
      totalElements.value = Math.max(0, totalElements.value - 1)
      return true
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message
      if (err.response?.status === 403) {
        error.value = 'No tienes permisos para eliminar este vehículo (solo el concesionario propietario que lo publicó puede eliminarlo).'
      } else if (err.response?.status === 404) {
        error.value = 'El vehículo no fue encontrado en la base de datos.'
      } else {
        error.value = serverMsg ? `${serverMsg} [HTTP ${err.response?.status || 'ERR'}]` : 'Error al eliminar el vehículo del catálogo.'
      }
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
    updateVehicle,
    deleteVehicle,
    fetchVehicleById,
    updateVehicleStatus,
    uploadVehicleImage,
    uploadGalleryImage,
    deleteGalleryImage,
    clearSelectedVehicle,
    resetFilters
  }
})

