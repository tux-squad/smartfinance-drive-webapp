import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Prospect, type ProspectNote } from '../domain/prospect.entity'
import { TestDrive } from '../domain/test-drive.entity'
import { CrmApi, type CreateProspectCommand, type ScheduleTestDriveCommand } from '../infrastructure/crm-api'

const crmApi = new CrmApi()

export const useCrmStore = defineStore('crm', () => {
  const prospects = ref<Prospect[]>([])
  const currentProspect = ref<Prospect | null>(null)
  const timelineNotes = ref<ProspectNote[]>([])
  const testDrives = ref<TestDrive[]>([])

  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const hasProspects = computed(() => prospects.value.length > 0)
  const hasTestDrives = computed(() => testDrives.value.length > 0)

  /**
   * Fetches all CRM prospects for the dealership (11.2).
   */
  const fetchDealerProspects = async (): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      prospects.value = await crmApi.getDealerProspects()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener los prospectos.'
      prospects.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches single prospect details (11.3).
   */
  const fetchProspectById = async (id: string): Promise<Prospect | null> => {
    isLoading.value = true
    error.value = null
    try {
      currentProspect.value = await crmApi.getDealerProspectById(id)
      return currentProspect.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar el prospecto.'
      currentProspect.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Adds a note to a prospect's timeline (11.4).
   */
  const addProspectNote = async (prospectId: string, content: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const note = await crmApi.addProspectNote(prospectId, content)
      timelineNotes.value.unshift(note)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al guardar la nota.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches timeline notes for a prospect (11.5).
   */
  const fetchProspectTimeline = async (prospectId: string): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      timelineNotes.value = await crmApi.getProspectTimeline(prospectId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar el historial de notas.'
      timelineNotes.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates prospect status (11.6).
   */
  const updateProspectStatus = async (prospectId: string, status: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await crmApi.updateProspectStatus(prospectId, status)
      currentProspect.value = updated
      const idx = prospects.value.findIndex(p => p.id === prospectId)
      if (idx !== -1) {
        prospects.value[idx] = updated
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar el estado del prospecto.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Schedules a new test drive (11.7).
   */
  const scheduleTestDrive = async (command: ScheduleTestDriveCommand): Promise<TestDrive | null> => {
    isLoading.value = true
    error.value = null
    try {
      const drive = await crmApi.scheduleTestDrive(command)
      testDrives.value.unshift(drive)
      return drive
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al agendar la prueba de manejo.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetches test drives for the current user (11.8).
   */
  const fetchMyTestDrives = async (): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      testDrives.value = await crmApi.getMyTestDrives()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar las pruebas de manejo.'
      testDrives.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates test drive status (11.10).
   */
  const updateTestDriveStatus = async (id: string, status: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const updated = await crmApi.updateTestDriveStatus(id, status)
      const idx = testDrives.value.findIndex(t => t.id === id)
      if (idx !== -1) {
        testDrives.value[idx] = updated
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar la prueba de manejo.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Cancels a test drive (11.11).
   */
  const cancelTestDrive = async (id: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      await crmApi.cancelTestDrive(id)
      testDrives.value = testDrives.value.filter(t => t.id !== id)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cancelar la prueba de manejo.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    prospects,
    currentProspect,
    timelineNotes,
    testDrives,
    isLoading,
    error,
    hasProspects,
    hasTestDrives,
    fetchDealerProspects,
    fetchProspectById,
    addProspectNote,
    fetchProspectTimeline,
    updateProspectStatus,
    scheduleTestDrive,
    fetchMyTestDrives,
    updateTestDriveStatus,
    cancelTestDrive
  }
})
