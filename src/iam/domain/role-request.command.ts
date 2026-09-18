/**
 * Command used to request Dealer or Financial Institution role via RUC.
 */
export class RoleRequestCommand {
  public userId: number | string
  public ruc: string

  constructor(params: { userId: number | string; ruc: string }) {
    this.userId = params.userId
    this.ruc = params.ruc
  }
}
