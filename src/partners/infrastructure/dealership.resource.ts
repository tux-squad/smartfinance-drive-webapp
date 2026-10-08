export interface DealershipResource {
  id: string
  userId: string
  name: string
  ruc: string
  address: string
  phone?: string
  email?: string
  website?: string
  logoUrl?: string
  bannerUrl?: string
  operatingHours?: string
  hours?: string
  rating?: number
  description?: string
  active?: boolean
  createdAt?: string
  updatedAt?: string
  vehicleCount?: number
}

export interface UpdateDealershipResource {
  name: string
  address: string
  phone?: string
  email?: string
  website?: string
  operatingHours?: string
  hours?: string
  description?: string
  logoUrl?: string
  bannerUrl?: string
}
