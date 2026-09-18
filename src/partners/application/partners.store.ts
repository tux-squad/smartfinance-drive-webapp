import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { FinancialEntity } from '../domain/financial-entity.entity'
import { SunatRuc } from '../domain/sunat-ruc.entity'
import { PartnersApi } from '../infrastructure/partners-api'

const partnersApi = new PartnersApi()

export const usePartnersStore = defineStore('partners', () => {
  const financialEntities = ref<FinancialEntity[]>([])
  const selectedEntity = ref<FinancialEntity | null>(null)
  const sunatResult = ref<SunatRuc | null>(null)

  const isLoading = ref<boolean>(false)
  const isSunatLoading = ref<boolean>(false)

  const error = ref<string | null>(null)
  const sunatError = ref<string | null>(null)

  const hasEntities = computed(() => financialEntities.value.length > 0)
  const hasSunatResult = computed(() => !!sunatResult.value && !!sunatResult.value.ruc)

  /**
   * Fetches the complete list of financial entities and benchmarks (4.2).
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
   * Synchronously looks up tax status for a RUC against SUNAT (4.7).
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

  const clearSunatResult = () => {
    sunatResult.value = null
    sunatError.value = null
  }

  return {
    financialEntities,
    selectedEntity,
    sunatResult,
    isLoading,
    isSunatLoading,
    error,
    sunatError,
    hasEntities,
    hasSunatResult,
    fetchFinancialEntities,
    fetchFinancialEntityById,
    lookupSunatRuc,
    clearSunatResult
  }
})
