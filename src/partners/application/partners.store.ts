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
  const myFinancialEntity = ref<FinancialEntity | null>(null)
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
   * Fetches the logged-in dealer's B2B profile (4.8 / 3.13).
   */
  const fetchMyDealership = async (): Promise<Dealership | null> => {
    isLoading.value = true
    error.value = null
    try {
      const result = await partnersApi.getMyDealership()
      currentDealership.value = result
      return result
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 401) {
        currentDealership.value = null
        return null
      }
      error.value = err.response?.data?.message || 'Error al obtener la información de la concesionaria.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates establishment details for my dealership (4.9 / 3.14).
   */
  const updateMyDealership = async (resource: UpdateDealershipResource): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await partnersApi.updateMyDealership(resource)
      currentDealership.value = updated
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || err.response?.data?.error || 'Error al actualizar la concesionaria.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Uploads dealership logo (4.10 / 3.15).
   */
  const uploadDealershipLogo = async (file: File): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      if (!currentDealership.value) {
        await updateMyDealership({
          name: 'Concesionaria Oficial',
          address: 'Av. Javier Prado Este 4520, Surco, Lima'
        })
      }
      const updated = await partnersApi.uploadMyDealershipLogo(file)
      currentDealership.value = updated
      return true
    } catch (err: any) {
      console.warn('Backend logo upload warning (fallback to preview):', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Uploads dealership banner (4.11 / 3.16).
   */
  const uploadDealershipBanner = async (file: File): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      if (!currentDealership.value) {
        await updateMyDealership({
          name: 'Concesionaria Oficial',
          address: 'Av. Javier Prado Este 4520, Surco, Lima'
        })
      }
      const updated = await partnersApi.uploadMyDealershipBanner(file)
      currentDealership.value = updated
      return true
    } catch (err: any) {
      console.warn('Backend banner upload warning (fallback to preview):', err)
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

  // --- Phase 2: Corporate Verification Actions ---
  const corporateLookup = ref<import('../infrastructure/corporate-verification.resource').CorporateVerificationLookupResource | null>(null)
  const corporateLoading = ref<boolean>(false)
  const corporateError = ref<string | null>(null)
  const corporateSuccess = ref<string | null>(null)

  const lookupCorporateRuc = async (ruc: string): Promise<import('../infrastructure/corporate-verification.resource').CorporateVerificationLookupResource | null> => {
    corporateLoading.value = true
    corporateError.value = null
    corporateLookup.value = null
    try {
      const res = await partnersApi.lookupCorporateVerification(ruc)
      corporateLookup.value = res
      return res
    } catch (err: any) {
      corporateError.value = err.response?.data?.message || 'Error al consultar verificación corporativa por RUC.'
      return null
    } finally {
      corporateLoading.value = false
    }
  }

  const initiateCorporateVerification = async (ruc: string, corporateEmail: string, userId?: string | number): Promise<boolean> => {
    corporateLoading.value = true
    corporateError.value = null
    try {
      const res = userId
        ? await partnersApi.initiateCorporateVerificationForUser(userId, { ruc, corporateEmail })
        : await partnersApi.initiateCorporateVerification({ ruc, corporateEmail })
      corporateSuccess.value = res.message || 'Código OTP enviado al correo corporativo.'
      return true
    } catch (err: any) {
      corporateError.value = err.response?.data?.message || 'Error al iniciar la verificación corporativa.'
      return false
    } finally {
      corporateLoading.value = false
    }
  }

  const confirmCorporateVerification = async (ruc: string, verificationCode: string, userId?: string | number): Promise<boolean> => {
    corporateLoading.value = true
    corporateError.value = null
    try {
      const payload = { ruc, code: verificationCode, verificationCode }
      const res = userId
        ? await partnersApi.confirmCorporateVerificationForUser(userId, payload)
        : await partnersApi.confirmCorporateVerification(payload)
      corporateSuccess.value = res.message || 'Verificación corporativa confirmada con éxito.'
      return true
    } catch (err: any) {
      corporateError.value = err.response?.data?.message || 'Código OTP corporativo inválido.'
      return false
    } finally {
      corporateLoading.value = false
    }
  }

  // --- Phase 4: Institutional Financial Entity Actions ---
  const fetchMyFinancialEntity = async (): Promise<FinancialEntity | null> => {
    isLoading.value = true
    error.value = null
    try {
      const entity = await partnersApi.getMyFinancialEntity()
      myFinancialEntity.value = entity
      return entity
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener la entidad financiera institucional.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const addBenchmarkToEntity = async (id: string, resource: {
    rateType: string
    annualRate: number
    currency: string
    sourceLabel?: string
    sourceUrl?: string
    effectiveFrom?: string
  }): Promise<FinancialEntity | null> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await partnersApi.addRateBenchmark(id, resource)
      const idx = financialEntities.value.findIndex(e => e.id === id)
      if (idx !== -1) financialEntities.value[idx] = updated
      if (selectedEntity.value?.id === id) selectedEntity.value = updated
      if (myFinancialEntity.value?.id === id) myFinancialEntity.value = updated
      return updated
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al agregar benchmark de tasa de interés.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const uploadFinancialEntityLogo = async (id: string, file: File): Promise<FinancialEntity | null> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await partnersApi.uploadFinancialEntityLogo(id, file)
      const idx = financialEntities.value.findIndex(e => e.id === id)
      if (idx !== -1) financialEntities.value[idx] = updated
      if (selectedEntity.value?.id === id) selectedEntity.value = updated
      if (myFinancialEntity.value?.id === id) myFinancialEntity.value = updated
      return updated
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al subir el logo de la entidad financiera.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const uploadMyFinancialEntityLogo = async (file: File): Promise<FinancialEntity | null> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await partnersApi.uploadMyFinancialEntityLogo(file)
      myFinancialEntity.value = updated
      const idx = financialEntities.value.findIndex(e => e.id === updated.id)
      if (idx !== -1) financialEntities.value[idx] = updated
      return updated
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al subir el logo institucional.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const uploadFinancialEntityBanner = async (id: string, file: File): Promise<FinancialEntity | null> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await partnersApi.uploadFinancialEntityBanner(id, file)
      const idx = financialEntities.value.findIndex(e => e.id === id)
      if (idx !== -1) financialEntities.value[idx] = updated
      if (selectedEntity.value?.id === id) selectedEntity.value = updated
      if (myFinancialEntity.value?.id === id) myFinancialEntity.value = updated
      return updated
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al subir el banner de la entidad financiera.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const uploadMyFinancialEntityBanner = async (file: File): Promise<FinancialEntity | null> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await partnersApi.uploadMyFinancialEntityBanner(file)
      myFinancialEntity.value = updated
      const idx = financialEntities.value.findIndex(e => e.id === updated.id)
      if (idx !== -1) financialEntities.value[idx] = updated
      return updated
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al subir el banner institucional.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const dealershipVehicles = ref<any[]>([])

  /**
   * Registers a new Financial Entity in the catalog (4.1 / 4.2).
   */
  const createFinancialEntity = async (resource: Partial<import('../infrastructure/financial-entity.resource').FinancialEntityResource>): Promise<FinancialEntity | null> => {
    isLoading.value = true
    error.value = null
    try {
      const entity = await partnersApi.createFinancialEntity(resource)
      financialEntities.value.push(entity)
      return entity
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al registrar la entidad financiera.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates an existing Financial Entity (4.3 / 4.4).
   */
  const updateFinancialEntity = async (id: string, resource: Partial<import('../infrastructure/financial-entity.resource').FinancialEntityResource>): Promise<FinancialEntity | null> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await partnersApi.updateFinancialEntity(id, resource)
      const idx = financialEntities.value.findIndex(e => e.id === id)
      if (idx !== -1) financialEntities.value[idx] = updated
      if (selectedEntity.value?.id === id) selectedEntity.value = updated
      if (myFinancialEntity.value?.id === id) myFinancialEntity.value = updated
      return updated
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar la entidad financiera.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deletes a Financial Entity by UUID (6.4 / 4.5).
   */
  const deleteFinancialEntity = async (id: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      await partnersApi.deleteFinancialEntity(id)
      financialEntities.value = financialEntities.value.filter(e => e.id !== id)
      if (selectedEntity.value?.id === id) selectedEntity.value = null
      if (myFinancialEntity.value?.id === id) myFinancialEntity.value = null
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar la entidad financiera.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches vehicles assigned to a specific dealership (3.18 / 4.13).
   */
  const fetchDealershipVehicles = async (dealershipId: string): Promise<any[]> => {
    isLoading.value = true
    error.value = null
    try {
      const list = await partnersApi.getDealershipVehicles(dealershipId)
      dealershipVehicles.value = list || []
      return dealershipVehicles.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar los vehículos de la concesionaria.'
      dealershipVehicles.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    financialEntities,
    selectedEntity,
    myFinancialEntity,
    sunatResult,
    dealerships,
    currentDealership,
    dealershipVehicles,
    isLoading,
    isSunatLoading,
    error,
    sunatError,
    corporateLookup,
    corporateLoading,
    corporateError,
    corporateSuccess,
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
    clearSunatResult,
    lookupCorporateRuc,
    initiateCorporateVerification,
    confirmCorporateVerification,
    fetchMyFinancialEntity,
    createFinancialEntity,
    updateFinancialEntity,
    deleteFinancialEntity,
    fetchDealershipVehicles,
    addBenchmarkToEntity,
    uploadFinancialEntityLogo,
    uploadMyFinancialEntityLogo,
    uploadFinancialEntityBanner,
    uploadMyFinancialEntityBanner
  }
})

