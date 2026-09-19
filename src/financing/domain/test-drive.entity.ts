export type TestDriveStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | string

/**
 * Domain entity representing a vehicle test drive appointment (Prueba de Manejo).
 */
export class TestDrive {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly dealershipId: string,
    public readonly vehicleId: string,
    public readonly scheduledDateTime: string,
    public readonly status: TestDriveStatus = 'SCHEDULED',
    public readonly notes: string | null = null,
    public readonly createdAt: string = new Date().toISOString(),
    public readonly vehicleTitle?: string,
    public readonly dealershipName?: string
  ) {}

  get formattedDateTime(): string {
    try {
      const d = new Date(this.scheduledDateTime)
      return d.toLocaleString('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    } catch {
      return this.scheduledDateTime
    }
  }

  get statusLabel(): string {
    switch (this.status) {
      case 'SCHEDULED':
        return 'Programado'
      case 'COMPLETED':
        return 'Completado'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return this.status
    }
  }
}
