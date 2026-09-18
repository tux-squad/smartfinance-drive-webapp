/**
 * Command used to reset a password with a recovery token.
 */
export class PasswordResetCommand {
  public resetToken: string
  public newPassword: string

  constructor(params: { resetToken: string; newPassword: string }) {
    this.resetToken = params.resetToken
    this.newPassword = params.newPassword
  }
}
