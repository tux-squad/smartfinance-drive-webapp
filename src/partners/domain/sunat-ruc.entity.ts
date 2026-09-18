/**
 * SunatRuc Domain Entity representing the tax validation response from SUNAT.
 */
export class SunatRuc {
  constructor(
    public readonly ruc: string,
    public readonly businessName: string,
    public readonly status: string,
    public readonly condition: string
  ) {}

  get isActive(): boolean {
    return this.status.toUpperCase() === 'ACTIVO'
  }

  get isHabido(): boolean {
    return this.condition.toUpperCase() === 'HABIDO'
  }

  get isValidTaxpayer(): boolean {
    return this.isActive && this.isHabido
  }
}
