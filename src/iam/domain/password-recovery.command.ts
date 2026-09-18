/**
 * Command used to request a password recovery token by email.
 */
export class PasswordRecoveryCommand {
  public username: string

  constructor(params: { username: string }) {
    this.username = params.username
  }
}
