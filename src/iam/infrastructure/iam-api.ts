import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import type { SignInRequestResource, SignInResponseResource, RefreshTokenRequestResource } from './sign-in.resource'
import type { SignUpRequestResource, SignUpResponseResource } from './sign-up.resource'

/**
 * Infrastructure API Gateway for IAM authentication endpoints.
 */
export class IamApi extends BaseApi {
  /**
   * Submits user credentials for sign-in and JWT token generation.
   */
  public signIn(resource: SignInRequestResource): Promise<AxiosResponse<SignInResponseResource>> {
    return this.http.post<SignInResponseResource>('/api/v1/auth/sessions', resource)
  }

  /**
   * Registers a new user account with specified roles.
   */
  public signUp(resource: SignUpRequestResource): Promise<AxiosResponse<SignUpResponseResource>> {
    return this.http.post<SignUpResponseResource>('/api/v1/auth/registrations', resource)
  }

  /**
   * Refreshes an expired access token using a refresh token.
   */
  public refreshToken(resource: RefreshTokenRequestResource): Promise<AxiosResponse<SignInResponseResource>> {
    return this.http.post<SignInResponseResource>('/api/v1/auth/tokens', resource)
  }

  /**
   * Revokes current user session token.
   */
  public signOut(): Promise<AxiosResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>('/api/v1/auth/sessions/current')
  }
}
