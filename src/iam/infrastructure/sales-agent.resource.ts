export interface SalesAgentResource {
  id: string
  dealershipId?: string
  fullName: string
  email: string
  phone: string
  active?: boolean
  assignedLeadsCount?: number
  createdAt?: string
}

export interface CreateSalesAgentResource {
  fullName: string
  email: string
  phone: string
}

export interface UpdateSalesAgentResource {
  fullName?: string
  email?: string
  phone?: string
  active?: boolean
}

export interface ReassignLeadsResource {
  targetAgentId: string
}
