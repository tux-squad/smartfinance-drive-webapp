export interface CorporateVerificationLookupResource {
  ruc: string
  entityType: string
  targetRole: string
  suggestedName: string
  fiscalAddress: string
  ubigeo?: string
  allowedEmailDomains: string[]
  logoUrl?: string
  eligibleForVerification: boolean
}

export interface InitiateCorporateVerificationResource {
  ruc: string
  corporateEmail: string
}

export interface ConfirmCorporateVerificationResource {
  ruc: string
  code?: string
  verificationCode?: string
}

export interface CorporateVerificationStatusResource {
  verified: boolean
  entityType?: string
  assignedRole?: string
  roleGranted?: string
  profileId?: string
  profileName?: string
  ruc?: string
  verifiedAt?: string
  message: string
}
