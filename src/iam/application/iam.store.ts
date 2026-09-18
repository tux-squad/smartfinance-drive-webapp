import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { User } from '../domain/user.entity'
import type { SignInCommand } from '../domain/sign-in.command'
import type { SignUpCommand } from '../domain/sign-up.command'
import { IamApi } from '../infrastructure/iam-api'
import { UserAssembler } from '../infrastructure/user.assembler'

const iamApi = new IamApi()

export const useIamStore = defineStore('iam', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const refreshTokenValue = ref<string | null>(localStorage.getItem('refresh_token'))
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!currentUser.value)
  const username = computed(() => currentUser.value?.username || 'Invitado')
  const roles = computed(() => currentUser.value?.roles || [])

  /**
   * Restores user session from stored localStorage tokens.
   */
  const restoreSession = () => {
    const savedToken = localStorage.getItem('access_token')
    const savedRefreshToken = localStorage.getItem('refresh_token')
    const savedUsername = localStorage.getItem('user_name')
    const savedUserId = localStorage.getItem('user_id')
    const savedRoles = localStorage.getItem('user_roles')

    if (savedToken && savedUsername && savedUserId) {
      token.value = savedToken
      refreshTokenValue.value = savedRefreshToken
      currentUser.value = new User({
        id: savedUserId,
        username: savedUsername,
        roles: savedRoles ? JSON.parse(savedRoles) : ['ROLE_USER'],
        token: savedToken,
        refreshToken: savedRefreshToken || undefined
      })
    }
  }

  /**
   * Executes sign-in use case via IAM API.
   */
  const signIn = async (command: SignInCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const resourcePayload = UserAssembler.toSignInRequestFromCommand(command)
      const response = await iamApi.signIn(resourcePayload)
      const data = response.data

      const user = UserAssembler.toUserEntityFromSignInResponse(data)
      currentUser.value = user
      token.value = data.token
      refreshTokenValue.value = data.refreshToken

      // Persist session tokens locally
      localStorage.setItem('access_token', data.token)
      localStorage.setItem('refresh_token', data.refreshToken)
      localStorage.setItem('user_name', data.username)
      localStorage.setItem('user_id', String(data.id))
      localStorage.setItem('user_roles', JSON.stringify(user.roles))

      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Executes sign-up use case via IAM API.
   */
  const signUp = async (command: SignUpCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const resourcePayload = UserAssembler.toSignUpRequestFromCommand(command)
      await iamApi.signUp(resourcePayload)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al registrar usuario.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Executes sign-out use case and clears tokens.
   */
  const signOut = async () => {
    try {
      if (token.value) {
        await iamApi.signOut()
      }
    } catch {
      // Ignore API errors on logout
    } finally {
      currentUser.value = null
      token.value = null
      refreshTokenValue.value = null

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_name')
      localStorage.removeItem('user_id')
      localStorage.removeItem('user_roles')
    }
  }

  return {
    currentUser,
    token,
    refreshTokenValue,
    isLoading,
    error,
    isAuthenticated,
    username,
    roles,
    restoreSession,
    signIn,
    signUp,
    signOut
  }
})
