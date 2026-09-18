/**
 * DTO Interfaces for User Management and Role Request endpoints (1.8 - 1.12).
 */
export interface UserResource {
  id: number | string
  username: string
  roles: string[]
}

export interface UserPaginatedResponseResource {
  content: UserResource[]
  totalElements: number
  totalPages: number
}

export interface UpdateUserRoleRequestResource {
  role: string
}

export interface RucRoleRequestResource {
  ruc: string
}
