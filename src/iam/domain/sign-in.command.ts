/**
 * Command used by the IAM application layer to request authentication.
 */
export class SignInCommand {
  public username: string
  public password: string

  constructor(params: { username: string; password: string }) {
    this.username = params.username
    this.password = params.password
  }
}
