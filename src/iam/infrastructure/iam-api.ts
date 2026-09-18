import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import { iamRequestInterceptor, iamResponseErrorInterceptor } from './iam.interceptor'
import type { SignInRequestResource, SignInResponseResource, RefreshTokenRequestResource } from './sign-in.resource'
import type { SignUpRequestResource, SignUpResponseResource } from './sign-up.resource'
import type { PasswordRecoveryRequestResource, PasswordRecoveryResponseResource, PasswordResetRequestResource, PasswordResetResponseResource } from './password.resource'
import type { GoogleAuthRequestResource, GoogleAuthResponseResource } from './google-auth.resource'
import type { UserResource, UserPaginatedResponseResource, UpdateUserRoleRequestResource, RucRoleRequestResource } from './user-management.resource'

/**
 * Infrastructure API Gateway covering all 12 IAM endpoints of the SmartFinance Drive Platform.
 */
export class IamApi extends BaseApi {
  constructor() {
    super()
    // Register IAM specific HTTP interceptors
    this.addRequestInterceptor(iamRequestInterceptor, (error) => Promise.reject(error))
    this.addResponseInterceptor((response) => response, iamResponseErrorInterceptor)
  }

  /** 1.1 Registrar Nuevo Usuario */
  public signUp(resource: SignUpRequestResource): Promise<AxiosResponse<SignUpResponseResource>> {
    return this.http.post<SignUpResponseResource>('/api/v1/auth/registrations', resource)
  }

  /** 1.2 Iniciar Sesión (Obtener JWT) */
  public signIn(resource: SignInRequestResource): Promise<AxiosResponse<SignInResponseResource>> {
    return this.http.post<SignInResponseResource>('/api/v1/auth/sessions', resource)
  }

  /** 1.3 Renovar Token Access (Refresh Token) */
  public refreshToken(resource: RefreshTokenRequestResource): Promise<AxiosResponse<SignInResponseResource>> {
    return this.http.post<SignInResponseResource>('/api/v1/auth/tokens', resource)
  }

  /** 1.4 Cerrar Sesión (Revocar Token) */
  public signOut(): Promise<AxiosResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>('/api/v1/auth/sessions/current')
  }

  /** 1.5 Solicitar Recuperación de Contraseña */
  public requestPasswordRecovery(resource: PasswordRecoveryRequestResource): Promise<AxiosResponse<PasswordRecoveryResponseResource>> {
    return this.http.post<PasswordRecoveryResponseResource>('/api/v1/auth/password-recoveries', resource)
  }

  /** 1.6 Restablecer Contraseña con Token */
  public resetPassword(resource: PasswordResetRequestResource): Promise<AxiosResponse<PasswordResetResponseResource>> {
    return this.http.post<PasswordResetResponseResource>('/api/v1/auth/password-resets', resource)
  }

  /** 1.7 Autenticación con Google OAuth2 */
  public signInWithGoogle(resource: GoogleAuthRequestResource): Promise<AxiosResponse<GoogleAuthResponseResource>> {
    return this.http.post<GoogleAuthResponseResource>('/api/v1/auth/google', resource)
  }

  /** 1.8 Listar Todos los Usuarios (Paginado) - Admin */
  public getUsers(page: number = 0, size: number = 20): Promise<AxiosResponse<UserPaginatedResponseResource>> {
    return this.http.get<UserPaginatedResponseResource>(`/api/v1/users?page=${page}&size=${size}`)
  }

  /** 1.9 Obtener Usuario por ID */
  public getUserById(userId: number | string): Promise<AxiosResponse<UserResource>> {
    return this.http.get<UserResource>(`/api/v1/users/${userId}`)
  }

  /** 1.10 Actualizar Rol de Usuario - Admin */
  public updateUserRole(userId: number | string, resource: UpdateUserRoleRequestResource): Promise<AxiosResponse<UserResource>> {
    return this.http.put<UserResource>(`/api/v1/users/${userId}/roles`, resource)
  }

  /** 1.11 Solicitar Rol de Concesionario (DEALER) vía RUC */
  public requestDealerRole(userId: number | string, resource: RucRoleRequestResource): Promise<AxiosResponse<UserResource>> {
    return this.http.post<UserResource>(`/api/v1/users/${userId}/dealer-role-requests`, resource)
  }

  /** 1.12 Solicitar Rol de Entidad Financiera (FINANCIAL_INSTITUTION) vía RUC */
  public requestFinancialInstitutionRole(userId: number | string, resource: RucRoleRequestResource): Promise<AxiosResponse<UserResource>> {
    return this.http.post<UserResource>(`/api/v1/users/${userId}/financial-institution-role-requests`, resource)
  }
}
