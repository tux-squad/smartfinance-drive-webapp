/**
 * DTO Interfaces for Google OAuth2 Authentication endpoint (1.7).
 */
export interface GoogleAuthRequestResource {
  idToken: string
}

export interface GoogleAuthResponseResource {
  id: number | string
  username: string
  token: string
  refreshToken: string
}
