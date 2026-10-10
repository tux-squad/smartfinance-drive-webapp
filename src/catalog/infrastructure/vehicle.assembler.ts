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
    const rawImages = Array.isArray(resource.images) ? resource.images : []
    let resolvedImage = resource.imagePath || (resource as any).imageUrl || (rawImages.length > 0 ? rawImages[0] : '')

    // Prefix relative paths with API Base URL
    if (resolvedImage && resolvedImage.startsWith('/')) {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://smartfinance-drive-platform.onrender.com'
      resolvedImage = `${apiBase}${resolvedImage}`
    }

    // Use imagePath or first image from gallery as returned by backend
    if (!resolvedImage) {
      resolvedImage = ''
    }

    // Populate gallery images strictly from endpoint
    const gallery = rawImages.length > 0 
      ? rawImages.map(img => img.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL || 'https://smartfinance-drive-platform.onrender.com'}${img}` : img) 
      : (resolvedImage ? [resolvedImage] : [])

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
      resolvedImage,
      resource.status || 'ACTIVE',
      gallery,
      resource.mileage,
      resource.transmission,
      resource.engine,
      resource.traction
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
