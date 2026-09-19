export interface DealershipResource {
  id: string
  userId: string
  name: string
  ruc: string
  address: string
  phone?: string
  email?: string
  logoUrl?: string
  bannerUrl?: string
  hours?: string
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
  hours?: string
  description?: string
}
