export type ProspectStatus = 'CONTACTED' | 'NEGOTIATING' | 'WON' | 'LOST' | string

export interface ProspectNote {
  id: string
  prospectId: string
  authorName?: string
  content: string
  createdAt: string
}

/**
 * Domain entity representing a CRM Commercial Prospect for a dealership.
 */
export class Prospect {
  constructor(
    public readonly id: string,
    public readonly dealershipId: string | null,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly interestedVehicleId: string | null,
    public readonly salesAgentId: string | null,
    public readonly status: ProspectStatus = 'CONTACTED',
    public readonly monthlyIncome: number = 0,
    public readonly downPayment: number = 0,
    public readonly notes: string | null = null,
    public readonly createdAt: string = new Date().toISOString(),
    public readonly updatedAt: string = new Date().toISOString(),
    public readonly vehicleName?: string
  ) {}

  get statusLabel(): string {
    switch (this.status) {
      case 'CONTACTED':
        return 'Contactado'
      case 'NEGOTIATING':
        return 'En Negociación'
      case 'WON':
        return 'Ganado'
      case 'LOST':
        return 'Perdido'
      default:
        return this.status
    }
  }

  get statusBadgeClass(): string {
    switch (this.status) {
      case 'WON':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'NEGOTIATING':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'LOST':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200'
    }
  }
}
