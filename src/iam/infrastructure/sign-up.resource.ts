/**
 * DTO Payload interfaces for user registrations API (/api/v1/auth/registrations).
 */
export interface SignUpRequestResource {
  username?: string
  email?: string
  password: string
  firstName?: string
  lastName?: string
  roles: string[]
}

export interface SignUpResponseResource {
  id: number | string
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  roles: string[]
}
