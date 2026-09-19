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

    // High-resolution automotive fallback if no image path exists on the backend
    if (!resolvedImage) {
      const brand = (resource.brand || '').toLowerCase()
      if (brand.includes('toyota')) {
        resolvedImage = 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80'
      } else if (brand.includes('honda')) {
        resolvedImage = 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80'
      } else if (brand.includes('mazda')) {
        resolvedImage = 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80'
      } else if (brand.includes('hyundai')) {
        resolvedImage = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
      } else if (brand.includes('kia')) {
        resolvedImage = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
      } else if (brand.includes('nissan')) {
        resolvedImage = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80'
      } else {
        resolvedImage = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
      }
    }

    // Populate gallery images
    const gallery = rawImages.length > 0 ? rawImages.map(img => img.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL || 'https://smartfinance-drive-platform.onrender.com'}${img}` : img) : [resolvedImage]

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
      gallery
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
