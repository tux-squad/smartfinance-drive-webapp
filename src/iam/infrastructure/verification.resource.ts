export interface EmailVerificationSendRequest {
  email: string
}

export interface EmailVerificationSendResponse {
  email: string
  maskedEmail: string
  sessionActive: boolean
  expiresInSeconds: number
  message: string
}

export interface EmailVerificationVerifyRequest {
  email: string
  code: string
}

export interface EmailVerificationVerifyResponse {
  verified: boolean
  email: string
  status: string
  verifiedAt: string
  verificationToken: string
  message: string
}

export interface PhoneVerificationRequest {
  firebaseIdToken: string
}

export interface PhoneVerificationResponse {
  verified: boolean
  phoneNumber: string
  status: string
  verifiedAt: string
  verificationToken: string
  message: string
}

export interface ReniecDniResponse {
  dni: string
  verificationDigit?: string
  firstNames: string
  paternalSurname: string
  maternalSurname: string
  fullLegalName: string
  department?: string
  province?: string
  district?: string
  address?: string
  fullAddress?: string
}

export interface SunatRucResponse {
  ruc: string
  razonSocial: string
  estado: string
  condicion: string
  ciiu?: string
  actividadEconomica?: string
  direccion?: string
  departamento?: string
  provincia?: string
  distrito?: string
  esAgenteRetencion?: boolean
}

