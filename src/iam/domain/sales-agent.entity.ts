/**
 * Domain entity representing a Dealership Sales Agent (Asesor Comercial de Ventas).
 */
export class SalesAgent {
  constructor(
    public readonly id: string,
    public readonly dealershipId: string | null,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly active: boolean = true,
    public readonly assignedLeadsCount: number = 0,
    public readonly createdAt: string = new Date().toISOString()
  ) {}

  get initials(): string {
    const parts = this.fullName.trim().split(' ')
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
    }
    return this.fullName.substring(0, 2).toUpperCase()
  }
}
