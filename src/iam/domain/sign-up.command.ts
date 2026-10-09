/**
 * Command used by the IAM application layer to register a new account.
 */
export class SignUpCommand {
  public username: string
  public email?: string
  public password: string
  public firstName?: string
  public lastName?: string
  public roles: string[]

  constructor(params: {
    username?: string
    email?: string
    password: string
    firstName?: string
    lastName?: string
    roles?: string[]
  }) {
    this.username = (params.username || params.email || '').trim()
    this.email = (params.email || params.username || '').trim()
    this.password = (params.password || '').trim()
    this.firstName = params.firstName?.trim() || ''
    this.lastName = params.lastName?.trim() || ''
    this.roles = params.roles || ['ROLE_USER']
  }
}
