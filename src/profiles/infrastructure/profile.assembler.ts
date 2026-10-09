import { Profile } from '../domain/profile.entity'
import type { CreateProfileCommand } from '../domain/create-profile.command'
import type { UpdateProfileCommand } from '../domain/update-profile.command'
import type {
  CreateProfileRequestResource,
  UpdateProfileRequestResource,
  ProfileResponseResource
} from './profile.resource'

function normalizeEmploymentStatus(status?: string): string {
  if (!status) return 'EMPLOYED'
  const lower = status.toLowerCase()
  if (lower === 'dependent' || lower === 'employed') return 'EMPLOYED'
  if (lower === 'independent' || lower === 'self_employed') return 'SELF_EMPLOYED'
  if (lower === 'business' || lower === 'business_owner') return 'BUSINESS_OWNER'
  return status.toUpperCase()
}

function extractPhoneParts(rawPhone?: string): { code: string, mobile: string } {
  if (!rawPhone) return { code: '+51', mobile: '999999999' }
  const clean = rawPhone.trim()
  if (clean.startsWith('+')) {
    const spaceIdx = clean.indexOf(' ')
    if (spaceIdx > 0) {
      const code = clean.substring(0, spaceIdx)
      const mobile = clean.substring(spaceIdx + 1).replace(/\D/g, '')
      return { code: code || '+51', mobile: mobile || '999999999' }
    }
  }
  const digits = clean.replace(/\D/g, '')
  return { code: '+51', mobile: digits || '999999999' }
}

/**
 * Assembler / Mapper responsible for transforming between Profiles API DTO Resources
 * and client Domain Entities & Commands (API Doc 2.1 - 2.4).
 */
export class ProfileAssembler {
  /**
   * Transforms a CreateProfileCommand to a CreateProfileRequestResource DTO (API Doc 2.1).
   */
  public static toCreateResourceFromCommand(command: CreateProfileCommand): CreateProfileRequestResource {
    const legalNames = (command.fullLegalNames || `${command.firstName || ''} ${command.lastName || ''}`).trim() || 'Usuario SmartFinance'
    const phone = extractPhoneParts(command.mobilePhone || command.phoneNumber)
    const phoneCountryCode = command.phoneCountryCode || phone.code
    const mobilePhone = command.mobilePhone || phone.mobile
    const userId = String(command.userId || localStorage.getItem('user_id') || '1')

    return {
      userId,
      email: command.email,
      nationalId: command.nationalId || command.dni || '',
      fullLegalNames: legalNames,
      dateOfBirth: command.dateOfBirth || '',
      phoneCountryCode,
      mobilePhone,
      monthlyIncomeAmount: Number(command.monthlyIncomeAmount) || 0,
      monthlyIncomeCurrency: command.monthlyIncomeCurrency || command.currency || 'PEN',
      employmentStatus: normalizeEmploymentStatus(command.employmentStatus)
    }
  }

  /**
   * Transforms an UpdateProfileCommand to an UpdateProfileRequestResource DTO (API Doc 2.4).
   * Note: userId is excluded in PUT /profiles/{profileId}.
   */
  public static toUpdateResourceFromCommand(command: UpdateProfileCommand): UpdateProfileRequestResource {
    const legalNames = (command.fullLegalNames || `${command.firstName || ''} ${command.lastName || ''}`).trim() || 'Usuario SmartFinance'
    const phone = extractPhoneParts(command.mobilePhone || command.phoneNumber)
    const phoneCountryCode = command.phoneCountryCode || phone.code
    const mobilePhone = command.mobilePhone || phone.mobile

    return {
      email: command.email,
      nationalId: command.nationalId || command.dni || '',
      fullLegalNames: legalNames,
      dateOfBirth: command.dateOfBirth || '',
      phoneCountryCode,
      mobilePhone,
      monthlyIncomeAmount: Number(command.monthlyIncomeAmount) || 0,
      monthlyIncomeCurrency: command.monthlyIncomeCurrency || command.currency || 'PEN',
      employmentStatus: normalizeEmploymentStatus(command.employmentStatus)
    }
  }

  /**
   * Transforms a ProfileResponseResource DTO to a Profile Domain Entity.
   */
  public static toEntityFromResource(resource: ProfileResponseResource): Profile {
    const nationalId = resource.nationalId || resource.dni || ''
    const fullLegalNames = (resource.fullLegalNames || `${resource.firstName || ''} ${resource.lastName || ''}`).trim()
    const currency = resource.monthlyIncomeCurrency || resource.currency || 'PEN'
    const phone = resource.phoneNumber ? extractPhoneParts(resource.phoneNumber) : { code: '+51', mobile: '' }
    const phoneCountryCode = resource.phoneCountryCode || phone.code
    const mobilePhone = resource.mobilePhone || phone.mobile

    let firstName = resource.firstName || ''
    let lastName = resource.lastName || ''
    if (!firstName && fullLegalNames) {
      const parts = fullLegalNames.split(/\s+/)
      if (parts.length === 1) {
        firstName = parts[0]
      } else if (parts.length === 2) {
        firstName = parts[0]
        lastName = parts[1]
      } else {
        firstName = parts.slice(0, parts.length - 2).join(' ') || parts[0]
        lastName = parts.slice(-2).join(' ')
      }
    }

    return new Profile({
      id: String(resource.id),
      userId: String(resource.userId),
      email: resource.email,
      nationalId,
      fullLegalNames,
      dateOfBirth: resource.dateOfBirth || '',
      phoneCountryCode,
      mobilePhone,
      monthlyIncomeAmount: Number(resource.monthlyIncomeAmount) || 0,
      monthlyIncomeCurrency: currency,
      employmentStatus: resource.employmentStatus || 'EMPLOYED',
      firstName,
      lastName,
      dni: nationalId,
      phoneNumber: resource.phoneNumber || `${phoneCountryCode} ${mobilePhone}`.trim(),
      currency
    })
  }
}
