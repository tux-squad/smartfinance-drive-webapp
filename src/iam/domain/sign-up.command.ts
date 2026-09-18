/**
 * Command used by the IAM application layer to register a new account.
 */
export class SignUpCommand {
  public username: string
  public password: string
  public roles: string[]

  constructor(params: { username: string; password: string; roles?: string[] }) {
    this.username = params.username
    this.password = params.password
    this.roles = params.roles || ['ROLE_USER']
  }
}
