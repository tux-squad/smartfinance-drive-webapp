import { User } from '../domain/user.entity'
import type { SignInCommand } from '../domain/sign-in.command'
import type { SignUpCommand } from '../domain/sign-up.command'
import type { SignInRequestResource, SignInResponseResource } from './sign-in.resource'
import type { SignUpRequestResource, SignUpResponseResource } from './sign-up.resource'

/**
 * Assembler / Mapper responsible for transforming between API DTO Resources
 * and client Domain Entities & Commands.
 */
export class UserAssembler {
  /**
   * Transforms a SignInCommand to a SignInRequestResource DTO.
   */
  public static toSignInRequestFromCommand(command: SignInCommand): SignInRequestResource {
    return {
      username: command.username,
      password: command.password
    }
  }

  /**
   * Transforms a SignUpCommand to a SignUpRequestResource DTO.
   */
  public static toSignUpRequestFromCommand(command: SignUpCommand): SignUpRequestResource {
    return {
      username: command.username,
      password: command.password,
      roles: command.roles
    }
  }

  /**
   * Transforms a SignInResponseResource DTO to a User Domain Entity.
   */
  public static toUserEntityFromSignInResponse(resource: SignInResponseResource): User {
    return new User({
      id: resource.id,
      username: resource.username,
      roles: ['ROLE_USER'],
      token: resource.token,
      refreshToken: resource.refreshToken
    })
  }

  /**
   * Transforms a SignUpResponseResource DTO to a User Domain Entity.
   */
  public static toUserEntityFromSignUpResponse(resource: SignUpResponseResource): User {
    return new User({
      id: resource.id,
      username: resource.username,
      roles: resource.roles
    })
  }
}
