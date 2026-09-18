import type { Vehicle } from './vehicle.entity'

/**
 * VehiclePage Domain Entity wrapping paginated vehicle results.
 */
export class VehiclePage {
  constructor(
    public readonly content: Vehicle[],
    public readonly totalElements: number,
    public readonly totalPages: number
  ) {}
}
