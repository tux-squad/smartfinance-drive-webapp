/**
 * DTO Payload interfaces for authentication sessions API (/api/v1/auth/sessions).
 */
export interface SignInRequestResource {
  username: string
  password: string
}

export interface SignInResponseResource {
  id: number | string
  username: string
  token: string
  refreshToken: string
}

export interface RefreshTokenRequestResource {
  refreshToken: string
}
