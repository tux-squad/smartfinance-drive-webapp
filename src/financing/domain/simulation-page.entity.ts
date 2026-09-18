import type { Simulation } from './simulation.entity'

/**
 * SimulationPage Domain Entity wrapping paginated simulation history results.
 */
export class SimulationPage {
  constructor(
    public readonly content: Simulation[],
    public readonly totalElements: number,
    public readonly totalPages: number
  ) {}
}
