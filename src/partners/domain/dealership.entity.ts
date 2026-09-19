/**
 * Domain entity representing a certified automotive dealership (Concesionaria B2B).
 */
export class Dealership {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly ruc: string,
    public readonly address: string,
    public readonly phone: string | null = null,
    public readonly email: string | null = null,
    public readonly logoUrl: string | null = null,
    public readonly bannerUrl: string | null = null,
    public readonly hours: string | null = null,
    public readonly description: string | null = null,
    public readonly active: boolean = true,
    public readonly createdAt: string = new Date().toISOString(),
    public readonly updatedAt: string = new Date().toISOString(),
    public readonly vehicleCount: number = 0
  ) {}

  get displayName(): string {
    return this.name
  }

  get formattedLocation(): string {
    if (this.address) {
      return this.address
    }
    return this.ruc ? `RUC: ${this.ruc} · Perú` : 'Lima, Perú'
  }

  get initials(): string {
    const parts = this.name.trim().split(' ')
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
    }
    return this.name.substring(0, 2).toUpperCase()
  }
}
