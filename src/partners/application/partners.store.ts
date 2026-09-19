import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { FinancialEntity } from '../domain/financial-entity.entity'
import { SunatRuc } from '../domain/sunat-ruc.entity'
import { Dealership } from '../domain/dealership.entity'
import type { UpdateDealershipResource } from '../infrastructure/dealership.resource'
import { PartnersApi } from '../infrastructure/partners-api'

const partnersApi = new PartnersApi()

export const usePartnersStore = defineStore('partners', () => {
  const financialEntities = ref<FinancialEntity[]>([])
  const selectedEntity = ref<FinancialEntity | null>(null)
  const sunatResult = ref<SunatRuc | null>(null)
  const dealerships = ref<Dealership[]>([])
  const currentDealership = ref<Dealership | null>(null)

  const isLoading = ref<boolean>(false)
  const isSunatLoading = ref<boolean>(false)

  const error = ref<string | null>(null)
  const sunatError = ref<string | null>(null)

  const hasEntities = computed(() => financialEntities.value.length > 0)
  const hasSunatResult = computed(() => !!sunatResult.value && !!sunatResult.value.ruc)
  const hasDealerships = computed(() => dealerships.value.length > 0)

  /**
   * Fetches the complete list of financial entities and benchmarks (4.1).
   */
  const fetchFinancialEntities = async (): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      financialEntities.value = await partnersApi.getFinancialEntities()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener el listado de entidades financieras.'
      financialEntities.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches details of a specific financial entity by UUID (4.3).
   */
  const fetchFinancialEntityById = async (id: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      selectedEntity.value = await partnersApi.getFinancialEntityById(id)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener la entidad financiera.'
      selectedEntity.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Synchronously looks up tax status for a RUC against SUNAT (4.6).
   */
  const lookupSunatRuc = async (ruc: string): Promise<boolean> => {
    isSunatLoading.value = true
    sunatError.value = null
    sunatResult.value = null
    try {
      const cleanRuc = ruc.trim()
      if (!cleanRuc || cleanRuc.length !== 11) {
        sunatError.value = 'El número de RUC debe contener exactamente 11 dígitos numéricos.'
        return false
      }

      sunatResult.value = await partnersApi.lookupSunatRuc(cleanRuc)
      return true
    } catch (err: any) {
      if (err.response?.status === 404) {
        sunatError.value = 'El RUC ingresado no existe en los registros de SUNAT.'
      } else {
        sunatError.value = err.response?.data?.message || 'Error al consultar la validez del RUC en SUNAT.'
      }
      sunatResult.value = null
      return false
    } finally {
      isSunatLoading.value = false
    }
  }

  /**
   * Fetches public directory of certified dealerships (4.7).
   */
  const fetchDealerships = async (params?: { search?: string, location?: string }): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      dealerships.value = await partnersApi.getDealerships(params)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener el directorio de concesionarias.'
      dealerships.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches the logged-in dealer's B2B profile (4.8).
   */
  const fetchMyDealership = async (): Promise<Dealership | null> => {
    isLoading.value = true
    error.value = null
    try {
      const result = await partnersApi.getMyDealership()
      currentDealership.value = result
      return result
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener la información de la concesionaria.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates establishment details for my dealership (4.9).
   */
  const updateMyDealership = async (resource: UpdateDealershipResource): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      currentDealership.value = await partnersApi.updateMyDealership(resource)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar la concesionaria.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Uploads dealership logo (4.10).
   */
  const uploadDealershipLogo = async (file: File): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      currentDealership.value = await partnersApi.uploadMyDealershipLogo(file)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al subir el logotipo.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Uploads dealership banner (4.11).
   */
  const uploadDealershipBanner = async (file: File): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      currentDealership.value = await partnersApi.uploadMyDealershipBanner(file)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al subir el banner publicitario.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches single dealership by ID (4.12).
   */
  const fetchDealershipById = async (id: string): Promise<Dealership | null> => {
    isLoading.value = true
    error.value = null
    try {
      return await partnersApi.getDealershipById(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener los detalles de la concesionaria.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const clearSunatResult = () => {
    sunatResult.value = null
    sunatError.value = null
  }

  return {
    financialEntities,
    selectedEntity,
    sunatResult,
    dealerships,
    currentDealership,
    isLoading,
    isSunatLoading,
    error,
    sunatError,
    hasEntities,
    hasSunatResult,
    hasDealerships,
    fetchFinancialEntities,
    fetchFinancialEntityById,
    lookupSunatRuc,
    fetchDealerships,
    fetchMyDealership,
    updateMyDealership,
    uploadDealershipLogo,
    uploadDealershipBanner,
    fetchDealershipById,
    clearSunatResult
  }
})

