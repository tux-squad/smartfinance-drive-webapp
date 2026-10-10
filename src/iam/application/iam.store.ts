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
import { SalesAgent } from '../domain/sales-agent.entity'
import { SalesAgentAssembler } from '../infrastructure/sales-agent.assembler'
import type { CreateSalesAgentResource, UpdateSalesAgentResource } from '../infrastructure/sales-agent.resource'
import type { SignUpResponseResource } from '../infrastructure/sign-up.resource'
import type { UserPaginatedResponseResource, UserResource } from '../infrastructure/user-management.resource'
import { firebasePhoneAuthService } from '../infrastructure/firebase-phone-auth.service'


const iamApi = new IamApi()

const formatIamErrorMessage = (errOrMsg: any): string => {
  if (!errOrMsg) return ''

  const status = errOrMsg.response?.status
  if (status === 403 || status === 401) {
    return 'Credenciales incorrectas. Verifique su correo electrónico y contraseña.'
  }

  let rawMsg = ''
  if (typeof errOrMsg === 'string') {
    rawMsg = errOrMsg
  } else if (errOrMsg.response?.data?.message) {
    rawMsg = String(errOrMsg.response.data.message)
  } else if (errOrMsg.response?.data?.error) {
    rawMsg = String(errOrMsg.response.data.error)
  } else if (errOrMsg.message) {
    rawMsg = String(errOrMsg.message)
  } else {
    rawMsg = JSON.stringify(errOrMsg)
  }

  if (rawMsg.includes('missingUppercase')) {
    return 'La contraseña debe incluir al menos una letra mayúscula (ejemplo: Password123!).'
  }
  if (rawMsg.includes('alreadyExists') || rawMsg.includes('duplicate') || rawMsg.includes('exists')) {
    return 'El correo electrónico ya se encuentra registrado. Por favor, haz clic en "Inicia sesión" abajo.'
  }
  if (rawMsg.includes('Invalid credentials') || rawMsg.includes('invalidCredentials') || rawMsg.includes('Bad credentials') || rawMsg.includes('401') || rawMsg.includes('403')) {
    return 'Credenciales incorrectas. Verifique su correo electrónico y contraseña.'
  }
  if (rawMsg.includes('Network Error') || rawMsg.includes('ERR_NETWORK') || rawMsg.includes('timeout') || rawMsg.includes('ECONNABORTED')) {
    return 'El servidor backend está despertando (cold start de Render). Por favor, intenta de nuevo en unos segundos.'
  }
  if (rawMsg.includes('api-key-not-valid') || rawMsg.includes('auth/api-key') || rawMsg.includes('auth/invalid-api-key')) {
    return 'El servicio de SMS de Firebase requiere una API Key activa. La verificación telefónica es opcional; puedes presionar "Registrarse" directamente.'
  }
  if (rawMsg.includes('undeliverable') || rawMsg.includes('email.undeliverable')) {
    return 'No se pudo enviar el correo de verificación. Puedes continuar con el registro directamente.'
  }
  if (rawMsg.includes('rucNotFound')) {
    return 'El RUC ingresado no existe en el padrón oficial de SUNAT.'
  }
  if (rawMsg.includes('rucNotActiveOrHabido')) {
    return 'El RUC ingresado no se encuentra en estado ACTIVO y condición HABIDO ante SUNAT.'
  }
  if (rawMsg.includes('notFinancialInstitution')) {
    return 'El RUC consultado ante SUNAT no registra actividad económica de intermediación financiera (CIIU 64 o 66) en los registros del padrón tributario.'
  }
  if (rawMsg.includes('notAutomotive') || rawMsg.includes('notDealer')) {
    return 'El RUC consultado ante SUNAT no registra actividad económica automotriz (CIIU 451).'
  }
  if (rawMsg.includes('invalidCiiu') || rawMsg.includes('ciiu') || rawMsg.includes('economicActivity')) {
    return 'La actividad económica (CIIU) registrada en SUNAT para este RUC no corresponde a la categoría requerida (Automotriz CIIU 451 o Financiera CIIU 64/66).'
  }
  if (rawMsg.includes('notFound')) {
    return 'Usuario no encontrado. Registre una cuenta antes de iniciar sesión.'
  }
  return rawMsg
}

export const useIamStore = defineStore('iam', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const refreshTokenValue = ref<string | null>(localStorage.getItem('refresh_token'))
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const userList = ref<UserResource[]>([])
  const totalUsers = ref<number>(0)
  const totalPages = ref<number>(0)

  const isAuthenticated = computed(() => !!token.value && !!currentUser.value)
  const username = computed(() => currentUser.value?.username || 'Invitado')
  const roles = computed(() => currentUser.value?.roles || [])

  // Sync token state across browser tab and transparent 401 refresh interceptors
  if (typeof window !== 'undefined') {
    window.addEventListener('session-refreshed', ((e: CustomEvent<{ token: string; refreshToken: string }>) => {
      if (e.detail?.token) {
        token.value = e.detail.token
      }
      if (e.detail?.refreshToken) {
        refreshTokenValue.value = e.detail.refreshToken
      }
    }) as EventListener)

    window.addEventListener('session-expired', async () => {
      currentUser.value = null
      token.value = null
      refreshTokenValue.value = null
      try {
        const { default: router } = await import('@/router')
        if (router.currentRoute.value.path !== '/sign-in') {
          router.push({ path: '/sign-in', query: { expired: '1' } })
        }
      } catch {
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/sign-in')) {
          window.location.href = '/sign-in?expired=1'
        }
      }
    })
  }

  /**
   * Restores user session from stored localStorage tokens and fetches updated profile.
   */
  const restoreSession = async () => {
    const savedToken = localStorage.getItem('access_token')
    const savedRefreshToken = localStorage.getItem('refresh_token')
    const savedUsername = localStorage.getItem('user_name')
    const savedUserId = localStorage.getItem('user_id')
    const savedRoles = localStorage.getItem('user_roles')

    if (savedToken && savedUserId && savedUserId !== 'undefined' && savedUserId !== 'null') {
      token.value = savedToken
      refreshTokenValue.value = savedRefreshToken

      let initialRoles: string[] = ['ROLE_USER']
      if (savedRoles && savedRoles !== 'undefined') {
        try {
          initialRoles = JSON.parse(savedRoles)
        } catch {
          initialRoles = ['ROLE_USER']
        }
      }

      currentUser.value = new User({
        id: savedUserId,
        username: savedUsername || '',
        roles: initialRoles,
        token: savedToken,
        refreshToken: savedRefreshToken || undefined
      })

      // Fetch fresh user profile & roles from API
      try {
        const userRes = await iamApi.getUserById(savedUserId)
        if (userRes.data && userRes.data.roles) {
          currentUser.value.roles = userRes.data.roles
          localStorage.setItem('user_roles', JSON.stringify(userRes.data.roles))
        }
      } catch {
        // Fallback to cached roles
      }

      // Fetch fresh client profile (names, DNI, phone)
      try {
        const { ProfilesApi } = await import('@/profiles/infrastructure/profiles-api')
        const { ProfileAssembler } = await import('@/profiles/infrastructure/profile.assembler')
        const profilesApi = new ProfilesApi()
        const profRes = await profilesApi.getProfileByUserId(savedUserId)
        if (profRes.data) {
          const profile = ProfileAssembler.toEntityFromResource(profRes.data)
          if (profile.fullName) {
            localStorage.setItem('user_name', profile.fullName)
          }
          if (profile.firstName) {
            localStorage.setItem('user_first_name', profile.firstName)
          }
          if (profile.lastName) {
            localStorage.setItem('user_last_name', profile.lastName)
          }
        }
      } catch {
        // Fallback
      }
    } else {
      currentUser.value = null
      token.value = null
      refreshTokenValue.value = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_name')
      localStorage.removeItem('user_id')
      localStorage.removeItem('user_roles')
      localStorage.removeItem('user_first_name')
      localStorage.removeItem('user_last_name')
    }
  }

  /**
   * Executes sign-in use case via IAM API (1.2) and populates actual roles via (1.9).
   */
  const signIn = async (command: SignInCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    // Clear any previous stale tokens before initiating login
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
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

      let userRoles = ['ROLE_USER']
      if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
        userRoles = data.roles
      }

      try {
        const userDetailsRes = await iamApi.getUserById(data.id)
        if (userDetailsRes.data && userDetailsRes.data.roles && userDetailsRes.data.roles.length > 0) {
          userRoles = userDetailsRes.data.roles
        }
      } catch {
        // Fallback
      }

      // Fetch client profile (names, DNI, phone) and cache in localStorage
      try {
        const { ProfilesApi } = await import('@/profiles/infrastructure/profiles-api')
        const { ProfileAssembler } = await import('@/profiles/infrastructure/profile.assembler')
        const profilesApi = new ProfilesApi()
        const profRes = await profilesApi.getProfileByUserId(data.id)
        if (profRes.data) {
          const profile = ProfileAssembler.toEntityFromResource(profRes.data)
          if (profile.fullName) {
            localStorage.setItem('user_name', profile.fullName)
          }
          if (profile.firstName) {
            localStorage.setItem('user_first_name', profile.firstName)
          }
          if (profile.lastName) {
            localStorage.setItem('user_last_name', profile.lastName)
          }
        }
      } catch {
        // Fallback
      }

      const user = UserAssembler.toUserEntityFromSignInResponse(data, userRoles)
      currentUser.value = user
      localStorage.setItem('user_roles', JSON.stringify(userRoles))

      return true
    } catch (err: any) {
      error.value = formatIamErrorMessage(err) || 'Error al iniciar sesión. Verifique sus credenciales.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fast demo sign-in simulation for multiple roles (Buyer, Dealer, Bank, Admin).
   */
  const signInDemo = async (demoRole: 'ROLE_USER' | 'ROLE_DEALER' | 'ROLE_FINANCIAL_INSTITUTION' | 'ROLE_ADMIN' = 'ROLE_USER'): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const demoToken = 'demo_access_token_' + Date.now()
      const demoRefreshToken = 'demo_refresh_token_' + Date.now()
      token.value = demoToken
      refreshTokenValue.value = demoRefreshToken

      let demoUsername = 'comprador.demo@smartfinance.com'
      let demoDisplayName = 'Juan Carlos Pérez'
      let demoRoles = [demoRole]

      if (demoRole === 'ROLE_DEALER') {
        demoUsername = 'concesionaria.toyota@smartfinance.com'
        demoDisplayName = 'Carlos Alberto Gómez (Toyota del Perú)'
        demoRoles = ['ROLE_USER', 'ROLE_DEALER']
        localStorage.setItem('user_first_name', 'Carlos Alberto')
        localStorage.setItem('user_last_name', 'Gómez Salazar')
      } else if (demoRole === 'ROLE_FINANCIAL_INSTITUTION') {
        demoUsername = 'banco.bcp@smartfinance.com'
        demoDisplayName = 'Ana María Torres (BCP Créditos)'
        demoRoles = ['ROLE_USER', 'ROLE_FINANCIAL_INSTITUTION']
        localStorage.setItem('user_first_name', 'Ana María')
        localStorage.setItem('user_last_name', 'Torres Mendoza')
      } else if (demoRole === 'ROLE_ADMIN') {
        demoUsername = 'admin.sistema@smartfinance.com'
        demoDisplayName = 'Administrador Global'
        demoRoles = ['ROLE_ADMIN']
      } else {
        localStorage.setItem('user_first_name', 'Juan Carlos')
        localStorage.setItem('user_last_name', 'Pérez García')
      }

      localStorage.setItem('access_token', demoToken)
      localStorage.setItem('refresh_token', demoRefreshToken)
      localStorage.setItem('user_name', demoDisplayName)
      localStorage.setItem('user_id', '1')
      localStorage.setItem('user_roles', JSON.stringify(demoRoles))

      currentUser.value = new User({
        id: '1',
        username: demoUsername,
        roles: demoRoles,
        token: demoToken,
        refreshToken: demoRefreshToken
      })

      return true
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Executes sign-up use case (1.1) and returns the created user DTO (with real ID).
   */
  const signUp = async (command: SignUpCommand): Promise<SignUpResponseResource | null> => {
    isLoading.value = true
    error.value = null
    try {
      const resourcePayload = UserAssembler.toSignUpRequestFromCommand(command)
      const response = await iamApi.signUp(resourcePayload)
      return response.data
    } catch (err: any) {
      error.value = formatIamErrorMessage(err) || 'Error al registrar usuario.'
      return null
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
      await iamApi.requestPasswordRecovery({ username: command.username })
      successMessage.value = 'Si existe una cuenta asociada a este correo, hemos enviado las instrucciones para restablecer tu contraseña.'
      return true
    } catch (err: any) {
      error.value = formatIamErrorMessage(err) || 'Error al solicitar recuperación de contraseña.'
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
      await iamApi.resetPassword({
        resetToken: command.resetToken,
        newPassword: command.newPassword
      })
      successMessage.value = '¡Contraseña restablecida exitosamente! Redirigiendo a inicio de sesión...'
      return true
    } catch (err: any) {
      error.value = formatIamErrorMessage(err) || 'Error al restablecer contraseña.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Admin: Fetches paginated user list (1.8).
   */
  const fetchUsers = async (page: number = 0, size: number = 20): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const res = await iamApi.getUsers(page, size)
      userList.value = res.data.content
      totalUsers.value = res.data.totalElements
      totalPages.value = res.data.totalPages
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener la lista de usuarios.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Admin: Updates a user's security role (1.10).
   */
  const updateUserRole = async (userId: number | string, role: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      await iamApi.updateUserRole(userId, { role })
      await fetchUsers()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar el rol de usuario.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Executes Dealer role request via SUNAT RUC validation (1.11 / 2.8).
   */
  const requestDealerRole = async (command: RoleRequestCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const companyName = command.companyName || (command.ruc === '20100138019' ? 'Toyota del Perú S.A.' : undefined)
      const res = await iamApi.requestDealerRole(command.userId, {
        ruc: command.ruc,
        companyName
      })
      const newRoles = res.data?.roles || ['ROLE_USER', 'ROLE_DEALER']
      if (currentUser.value) {
        currentUser.value.roles = newRoles
        currentUser.value.ruc = command.ruc
      }
      localStorage.setItem('user_roles', JSON.stringify(newRoles))
      return true
    } catch (err: any) {
      const rawMsg = err.response?.data?.message
      error.value = formatIamErrorMessage(rawMsg) || 'Error al solicitar el rol de Concesionario.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Executes Financial Institution role request via SUNAT RUC validation (1.12 / 2.9).
   */
  const requestFinancialInstitutionRole = async (command: RoleRequestCommand): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const companyName = command.companyName || (command.ruc === '20100047218' ? 'Banco de Crédito del Perú BCP' : undefined)
      const res = await iamApi.requestFinancialInstitutionRole(command.userId, {
        ruc: command.ruc,
        companyName,
        institutionName: companyName
      })
      const newRoles = res.data?.roles || ['ROLE_USER', 'ROLE_FINANCIAL_INSTITUTION']
      if (currentUser.value) {
        currentUser.value.roles = newRoles
        currentUser.value.ruc = command.ruc
      }
      localStorage.setItem('user_roles', JSON.stringify(newRoles))
      return true
    } catch (err: any) {
      const rawMsg = err.response?.data?.message
      error.value = formatIamErrorMessage(rawMsg) || 'Error al solicitar el rol de Entidad Financiera.'
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

      if (res.data.roles && Array.isArray(res.data.roles) && res.data.roles.length > 0) {
        if (currentUser.value) {
          currentUser.value.roles = res.data.roles
          currentUser.value.token = res.data.token
          currentUser.value.refreshToken = res.data.refreshToken
        }
        localStorage.setItem('user_roles', JSON.stringify(res.data.roles))
      } else if (currentUser.value?.id) {
        try {
          const userDetailsRes = await iamApi.getUserById(currentUser.value.id)
          if (userDetailsRes.data?.roles && userDetailsRes.data.roles.length > 0) {
            currentUser.value.roles = userDetailsRes.data.roles
            localStorage.setItem('user_roles', JSON.stringify(userDetailsRes.data.roles))
          }
        } catch {
          // ignore
        }
      }

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
      localStorage.removeItem('user_first_name')
      localStorage.removeItem('user_last_name')
    }
  }

  const salesAgents = ref<SalesAgent[]>([])

  /**
   * Fetches sales agents of the dealership (1.13).
   */
  const fetchSalesAgents = async (): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await iamApi.getSalesAgents()
      salesAgents.value = (response.data || []).map(r => SalesAgentAssembler.toEntity(r))
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar los asesores de ventas.'
      salesAgents.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Creates a new sales agent (1.14).
   */
  const createSalesAgent = async (resource: CreateSalesAgentResource): Promise<SalesAgent | null> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await iamApi.createSalesAgent(resource)
      const newAgent = SalesAgentAssembler.toEntity(response.data)
      salesAgents.value.push(newAgent)
      return newAgent
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear el asesor de ventas.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Updates sales agent information (1.15).
   */
  const updateSalesAgent = async (id: string, resource: UpdateSalesAgentResource): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await iamApi.updateSalesAgent(id, resource)
      const updated = SalesAgentAssembler.toEntity(response.data)
      const idx = salesAgents.value.findIndex(a => a.id === id)
      if (idx !== -1) {
        salesAgents.value[idx] = updated
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar el asesor.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reassigns leads from one agent to another (1.16).
   */
  const reassignSalesAgentLeads = async (id: string, targetAgentId: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      await iamApi.reassignLeads(id, targetAgentId)
      await fetchSalesAgents()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al reasignar prospectos.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // --- Phase 1: OTP Email/Phone Verification & RENIEC DNI / SUNAT RUC Lookup ---
  const isVerifyingOtp = ref<boolean>(false)
  const isLookingUpDni = ref<boolean>(false)
  const isLookingUpRuc = ref<boolean>(false)
  const emailVerified = ref<boolean>(false)
  const emailVerificationToken = ref<string | null>(null)
  const phoneVerified = ref<boolean>(false)
  const phoneVerificationToken = ref<string | null>(null)
  const reniecData = ref<import('../infrastructure/verification.resource').ReniecDniResponse | null>(null)
  const sunatData = ref<import('../infrastructure/verification.resource').SunatRucResponse | null>(null)

  /**
   * Enviar código OTP de 6 dígitos al correo electrónico
   * POST /api/v1/auth/email-verification/send
   */
  const sendEmailOtp = async (emailToVerify: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const res = await iamApi.sendEmailVerificationOtp({ email: emailToVerify })
      successMessage.value = res.data.message || 'Código de verificación enviado a su correo.'
      return true
    } catch (err: any) {
      const rawMsg = String(err.response?.data?.message || err.message || '')
      if (
        rawMsg.includes('dailyLimitExceeded') ||
        rawMsg.includes('LimitExceeded') ||
        rawMsg.includes('emailVerification.dailyLimitExceeded') ||
        rawMsg.includes('undeliverable') ||
        err.response?.status === 429
      ) {
        // Cuota / límite diario alcanzado en el proveedor de correos: autovalidar correo para no bloquear al usuario
        emailVerified.value = true
        emailVerificationToken.value = 'auto_verified_limit_' + Date.now()
        successMessage.value = 'Límite de envíos alcanzado. Correo validado automáticamente para continuar con tu registro.'
        error.value = null
        return true
      }
      error.value = formatIamErrorMessage(err) || 'Error al enviar código de verificación.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Validar código OTP de 6 dígitos del correo electrónico
   * POST /api/v1/auth/email-verification/verify
   */
  const verifyEmailOtp = async (emailToVerify: string, code: string): Promise<boolean> => {
    isVerifyingOtp.value = true
    error.value = null
    try {
      const res = await iamApi.verifyEmailOtp({ email: emailToVerify, code })
      emailVerified.value = res.data.verified
      emailVerificationToken.value = res.data.verificationToken
      successMessage.value = res.data.message || 'Correo electrónico verificado con éxito.'
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Código de verificación inválido o expirado.'
      return false
    } finally {
      isVerifyingOtp.value = false
    }
  }

  /**
   * Validar token telefónico de Firebase
   * POST /api/v1/auth/phone-verification
   */
  const verifyPhoneToken = async (firebaseIdToken: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      const res = await iamApi.verifyPhone({ firebaseIdToken })
      phoneVerified.value = res.data.verified
      phoneVerificationToken.value = res.data.verificationToken
      successMessage.value = res.data.message || 'Teléfono verificado con éxito.'
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al verificar teléfono.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Enviar código SMS mediante Firebase Phone Authentication
   */
  const sendPhoneSms = async (phoneNumber: string, verifier?: any): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    try {
      await firebasePhoneAuthService.sendVerificationCode(phoneNumber, verifier)
      successMessage.value = 'Código de verificación SMS enviado exitosamente.'
      return true
    } catch (err: any) {
      error.value = formatIamErrorMessage(err.message) || 'Error al enviar código SMS de verificación.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Validar código recibido por SMS (6 dígitos) y enviar Firebase ID Token al backend
   */
  const verifyPhoneSmsCode = async (code: string): Promise<boolean> => {
    isVerifyingOtp.value = true
    error.value = null
    try {
      const idToken = await firebasePhoneAuthService.confirmSmsCode(code)
      return await verifyPhoneToken(idToken)
    } catch (err: any) {
      error.value = formatIamErrorMessage(err.message) || 'Código SMS inválido o expirado.'
      return false
    } finally {
      isVerifyingOtp.value = false
    }
  }

  /**
   * Consultar datos oficiales en SUNAT por número de RUC
   * GET /api/v1/partners/sunat/ruc/{ruc}
   */
  const lookupRuc = async (ruc: string): Promise<import('../infrastructure/verification.resource').SunatRucResponse | null> => {
    if (!ruc || ruc.length !== 11) return null
    isLookingUpRuc.value = true
    try {
      const res = await iamApi.lookupRucSunat(ruc)
      sunatData.value = res.data
      return res.data
    } catch {
      sunatData.value = null
      return null
    } finally {
      isLookingUpRuc.value = false
    }
  }

  /**
   * Consultar datos oficiales en RENIEC por número de DNI
   * GET /api/v1/profiles/reniec/dni/{dni}
   */
  const lookupDni = async (dni: string): Promise<import('../infrastructure/verification.resource').ReniecDniResponse | null> => {
    if (!dni || dni.length !== 8) return null
    isLookingUpDni.value = true
    try {
      const res = await iamApi.lookupDniReniec(dni)
      reniecData.value = res.data
      return res.data
    } catch {
      reniecData.value = null
      return null
    } finally {
      isLookingUpDni.value = false
    }
  }

  return {
    currentUser,
    token,
    refreshTokenValue,
    isLoading,
    error,
    successMessage,
    userList,
    totalUsers,
    totalPages,
    salesAgents,
    isAuthenticated,
    username,
    roles,
    isVerifyingOtp,
    isLookingUpDni,
    isLookingUpRuc,
    emailVerified,
    emailVerificationToken,
    phoneVerified,
    phoneVerificationToken,
    reniecData,
    sunatData,
    restoreSession,
    signIn,
    signInDemo,
    signUp,
    signInWithGoogle,
    requestPasswordRecovery,
    resetPassword,
    fetchUsers,
    updateUserRole,
    requestDealerRole,
    requestFinancialInstitutionRole,
    fetchSalesAgents,
    createSalesAgent,
    updateSalesAgent,
    reassignSalesAgentLeads,
    sendEmailOtp,
    verifyEmailOtp,
    verifyPhoneToken,
    sendPhoneSms,
    verifyPhoneSmsCode,
    lookupDni,
    lookupRuc,
    refreshSession,
    signOut
  }
})

