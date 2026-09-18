/**
 * DTO Payload interfaces for user registrations API (/api/v1/auth/registrations).
 */
export interface SignUpRequestResource {
  username: string
  password: string
  roles: string[]
}

export interface SignUpResponseResource {
  id: number | string
  username: string
  roles: string[]
}
