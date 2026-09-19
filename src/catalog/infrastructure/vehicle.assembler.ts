import { Vehicle } from '../domain/vehicle.entity'
import { VehiclePage } from '../domain/vehicle-page.entity'
import type { VehicleResource, VehiclePageResource } from './vehicle.resource'

/**
 * Assembler mapping infrastructure resources to domain entities for Catalog.
 */
export class VehicleAssembler {
  /**
   * Maps a VehicleResource to a Vehicle domain entity.
   */
  static toEntity(resource: VehicleResource): Vehicle {
    return new Vehicle(
      resource.id,
      resource.userId || '',
      resource.financialEntityId || '',
      resource.brand || '',
      resource.model || '',
      resource.manufactureYear || new Date().getFullYear(),
      resource.condition || 'NEW',
      resource.priceAmount || 0,
      resource.currency || 'USD',
      resource.imagePath || '',
      resource.status || 'ACTIVE',
      Array.isArray(resource.images) ? resource.images : []
    )
  }

  /**
   * Maps a VehiclePageResource to a VehiclePage domain entity.
   */
  static toPageEntity(resource: VehiclePageResource): VehiclePage {
    const content = (resource.content || []).map((item) => VehicleAssembler.toEntity(item))
    return new VehiclePage(content, resource.totalElements || 0, resource.totalPages || 0)
  }
}
