/**
 * IAM User aggregate root representation used by the client domain model.
 */
export class User {
  public id: number | string
  public username: string
  public roles: string[]
  public token?: string
  public refreshToken?: string

  constructor(params: {
    id: number | string
    username: string
    roles?: string[]
    token?: string
    refreshToken?: string
  }) {
    this.id = params.id
    this.username = params.username
    this.roles = params.roles || ['ROLE_USER']
    this.token = params.token
    this.refreshToken = params.refreshToken
  }

  public hasRole(role: string): boolean {
    return this.roles.includes(role)
  }
}
