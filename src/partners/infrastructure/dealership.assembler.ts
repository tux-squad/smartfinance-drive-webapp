import { Dealership } from '../domain/dealership.entity'
import type { DealershipResource } from './dealership.resource'

export class DealershipAssembler {
  public static toEntity(resource: DealershipResource): Dealership {
    const hours = resource.operatingHours || resource.hours || null
    return new Dealership(
      resource.id,
      resource.userId,
      resource.name || 'Concesionaria Certificada',
      resource.ruc || '',
      resource.address || '',
      resource.phone || null,
      resource.email || null,
      resource.logoUrl || null,
      resource.bannerUrl || null,
      hours,
      resource.description || null,
      resource.active ?? true,
      resource.createdAt || new Date().toISOString(),
      resource.updatedAt || new Date().toISOString(),
      Number(resource.vehicleCount) || 0,
      hours
    )
  }
}
