/**
 * DTO Interfaces for Password Recovery & Reset endpoints (1.5, 1.6).
 */
export interface PasswordRecoveryRequestResource {
  username: string
}

export interface PasswordRecoveryResponseResource {
  message: string
}

export interface PasswordResetRequestResource {
  resetToken: string
  newPassword: string
}

export interface PasswordResetResponseResource {
  message: string
}
