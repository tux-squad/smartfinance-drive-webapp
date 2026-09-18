import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Profile } from '../domain/profile.entity'
import type { CreateProfileCommand } from '../domain/create-profile.command'
import type { UpdateProfileCommand } from '../domain/update-profile.command'
import { ProfilesApi } from '../infrastructure/profiles-api'
import { ProfileAssembler } from '../infrastructure/profile.assembler'

const profilesApi = new ProfilesApi()

export const useProfilesStore = defineStore('profiles', () => {
  const currentProfile = ref<Profile | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const hasProfile = computed(() => !!currentProfile.value && !!currentProfile.value.id)

  /**
   * Fetches the client profile corresponding to a specific userId (2.3).
   */
  const fetchProfileByUserId = async (userId: string | number): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await profilesApi.getProfileByUserId(userId)
      if (response.data) {
        currentProfile.value = ProfileAssembler.toEntityFromResource(response.data)
        return true
      }
      return false
    } catch (err: any) {
      if (err.response?.status === 404) {
        currentProfile.value = null
      } else {
        error.value = err.response?.data?.message || 'Error al obtener el perfil de usuario.'
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Creates a new client profile (2.1).
   */
  const createProfile = async (command: CreateProfileCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const payload = ProfileAssembler.toCreateResourceFromCommand(command)
      const response = await profilesApi.createProfile(payload)
      currentProfile.value = ProfileAssembler.toEntityFromResource(response.data)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear el perfil de cliente.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates an existing client profile (2.4).
   */
  const updateProfile = async (command: UpdateProfileCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const payload = ProfileAssembler.toUpdateResourceFromCommand(command)
      const response = await profilesApi.updateProfile(command.profileId, payload)
      currentProfile.value = ProfileAssembler.toEntityFromResource(response.data)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar el perfil de cliente.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deletes a client profile by profileId (2.5).
   */
  const deleteProfile = async (profileId: string | number): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      await profilesApi.deleteProfile(profileId)
      currentProfile.value = null
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar el perfil.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentProfile,
    isLoading,
    error,
    hasProfile,
    fetchProfileByUserId,
    createProfile,
    updateProfile,
    deleteProfile
  }
})
