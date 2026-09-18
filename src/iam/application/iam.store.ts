import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { User } from '../domain/user.entity'
import type { SignInCommand } from '../domain/sign-in.command'
import type { SignUpCommand } from '../domain/sign-up.command'
import type { PasswordRecoveryCommand } from '../domain/password-recovery.command'
import type { PasswordResetCommand } from '../domain/password-reset.command'
import type { RoleRequestCommand } from '../domain/role-request.command'
import { IamApi } from '../infrastructure/iam-api'
import { UserAssembler } from '../infrastructure/user.assembler'

const iamApi = new IamApi()

export const useIamStore = defineStore('iam', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const refreshTokenValue = ref<string | null>(localStorage.getItem('refresh_token'))
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!currentUser.value)
  const username = computed(() => currentUser.value?.username || 'Invitado')
  const roles = computed(() => currentUser.value?.roles || [])

  /**
   * Restores user session from stored localStorage tokens.
   */
  const restoreSession = async () => {
    const savedToken = localStorage.getItem('access_token')
    const savedRefreshToken = localStorage.getItem('refresh_token')
    const savedUsername = localStorage.getItem('user_name')
    const savedUserId = localStorage.getItem('user_id')
    const savedRoles = localStorage.getItem('user_roles')

    if (savedToken && savedUserId) {
      token.value = savedToken
      refreshTokenValue.value = savedRefreshToken
      currentUser.value = new User({
        id: savedUserId,
        username: savedUsername || '',
        roles: savedRoles ? JSON.parse(savedRoles) : ['ROLE_USER'],
        token: savedToken,
        refreshToken: savedRefreshToken || undefined
      })

      // Fetch fresh profile & roles from API
      try {
        const userRes = await iamApi.getUserById(savedUserId)
        if (userRes.data) {
          currentUser.value.roles = userRes.data.roles
          localStorage.setItem('user_roles', JSON.stringify(userRes.data.roles))
        }
      } catch {
        // Fallback to cached roles
      }
    }
  }

  /**
   * Executes sign-in use case via IAM API (1.2), then fetches user profile & roles (1.9).
   */
  const signIn = async (command: SignInCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const resourcePayload = UserAssembler.toSignInRequestFromCommand(command)
      const response = await iamApi.signIn(resourcePayload)
      const data = response.data

      token.value = data.token
      refreshTokenValue.value = data.refreshToken

      localStorage.setItem('access_token', data.token)
      localStorage.setItem('refresh_token', data.refreshToken)
      localStorage.setItem('user_name', data.username)
      localStorage.setItem('user_id', String(data.id))

      // Fetch user profile to get actual roles (1.9)
      let userRoles = ['ROLE_USER']
      try {
        const userDetailsRes = await iamApi.getUserById(data.id)
        if (userDetailsRes.data && userDetailsRes.data.roles) {
          userRoles = userDetailsRes.data.roles
        }
      } catch {
        // Fallback if role endpoint is offline
      }

      const user = UserAssembler.toUserEntityFromSignInResponse(data, userRoles)
      currentUser.value = user
      localStorage.setItem('user_roles', JSON.stringify(userRoles))

      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Executes sign-up use case via IAM API (1.1).
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
   * Executes Google OAuth2 authentication (1.7).
   */
  const signInWithGoogle = async (idToken: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await iamApi.signInWithGoogle({ idToken })
      const data = response.data

      token.value = data.token
      refreshTokenValue.value = data.refreshToken

      localStorage.setItem('access_token', data.token)
      localStorage.setItem('refresh_token', data.refreshToken)
      localStorage.setItem('user_name', data.username)
      localStorage.setItem('user_id', String(data.id))

      let userRoles = ['ROLE_USER']
      try {
        const userDetailsRes = await iamApi.getUserById(data.id)
        if (userDetailsRes.data && userDetailsRes.data.roles) {
          userRoles = userDetailsRes.data.roles
        }
      } catch {
        // Fallback
      }

      currentUser.value = UserAssembler.toUserEntityFromSignInResponse(data, userRoles)
      localStorage.setItem('user_roles', JSON.stringify(userRoles))

      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al autenticar con Google.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Executes password recovery request (1.5).
   */
  const requestPasswordRecovery = async (command: PasswordRecoveryCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    successMessage.value = null
    try {
      const res = await iamApi.requestPasswordRecovery({ username: command.username })
      successMessage.value = res.data.message
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al solicitar recuperación de contraseña.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Executes password reset with token (1.6).
   */
  const resetPassword = async (command: PasswordResetCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    successMessage.value = null
    try {
      const res = await iamApi.resetPassword({
        resetToken: command.resetToken,
        newPassword: command.newPassword
      })
      successMessage.value = res.data.message
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al restablecer contraseña.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Executes Dealer role request via SUNAT RUC validation (1.11).
   */
  const requestDealerRole = async (command: RoleRequestCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const res = await iamApi.requestDealerRole(command.userId, { ruc: command.ruc })
      if (currentUser.value && res.data.roles) {
        currentUser.value.roles = res.data.roles
        currentUser.value.ruc = command.ruc
        localStorage.setItem('user_roles', JSON.stringify(res.data.roles))
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al solicitar el rol de Concesionario.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Executes Financial Institution role request via SUNAT RUC validation (1.12).
   */
  const requestFinancialInstitutionRole = async (command: RoleRequestCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const res = await iamApi.requestFinancialInstitutionRole(command.userId, { ruc: command.ruc })
      if (currentUser.value && res.data.roles) {
        currentUser.value.roles = res.data.roles
        currentUser.value.ruc = command.ruc
        localStorage.setItem('user_roles', JSON.stringify(res.data.roles))
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al solicitar el rol de Entidad Financiera.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Auto refreshes access token using stored refresh token (1.3).
   */
  const refreshSession = async (): Promise<boolean> => {
    if (!refreshTokenValue.value) return false
    try {
      const res = await iamApi.refreshToken({ refreshToken: refreshTokenValue.value })
      token.value = res.data.token
      refreshTokenValue.value = res.data.refreshToken

      localStorage.setItem('access_token', res.data.token)
      localStorage.setItem('refresh_token', res.data.refreshToken)

      return true
    } catch {
      await signOut()
      return false
    }
  }

  /**
   * Executes sign-out use case (1.4) and clears local storage.
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
    successMessage,
    isAuthenticated,
    username,
    roles,
    restoreSession,
    signIn,
    signUp,
    signInWithGoogle,
    requestPasswordRecovery,
    resetPassword,
    requestDealerRole,
    requestFinancialInstitutionRole,
    refreshSession,
    signOut
  }
})
