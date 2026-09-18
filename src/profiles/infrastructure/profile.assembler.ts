import { Profile } from '../domain/profile.entity'
import type { CreateProfileCommand } from '../domain/create-profile.command'
import type { UpdateProfileCommand } from '../domain/update-profile.command'
import type {
  CreateProfileRequestResource,
  UpdateProfileRequestResource,
  ProfileResponseResource
} from './profile.resource'

/**
 * Assembler / Mapper responsible for transforming between Profiles API DTO Resources
 * and client Domain Entities & Commands.
 */
export class ProfileAssembler {
  /**
   * Transforms a CreateProfileCommand to a CreateProfileRequestResource DTO.
   */
  public static toCreateResourceFromCommand(command: CreateProfileCommand): CreateProfileRequestResource {
    return {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      dni: command.dni,
      phoneNumber: command.phoneNumber,
      monthlyIncomeAmount: command.monthlyIncomeAmount,
      currency: command.currency
    }
  }

  /**
   * Transforms an UpdateProfileCommand to an UpdateProfileRequestResource DTO.
   */
  public static toUpdateResourceFromCommand(command: UpdateProfileCommand): UpdateProfileRequestResource {
    return {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      dni: command.dni,
      phoneNumber: command.phoneNumber,
      monthlyIncomeAmount: command.monthlyIncomeAmount,
      currency: command.currency
    }
  }

  /**
   * Transforms a ProfileResponseResource DTO to a Profile Domain Entity.
   */
  public static toEntityFromResource(resource: ProfileResponseResource): Profile {
    return new Profile({
      id: String(resource.id),
      userId: String(resource.userId),
      firstName: resource.firstName,
      lastName: resource.lastName,
      email: resource.email,
      dni: resource.dni,
      phoneNumber: resource.phoneNumber,
      monthlyIncomeAmount: resource.monthlyIncomeAmount,
      currency: resource.currency
    })
  }
}
