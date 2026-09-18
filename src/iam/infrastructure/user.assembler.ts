import { User } from '../domain/user.entity'
import type { SignInCommand } from '../domain/sign-in.command'
import type { SignUpCommand } from '../domain/sign-up.command'
import type { SignInRequestResource, SignInResponseResource } from './sign-in.resource'
import type { SignUpRequestResource, SignUpResponseResource } from './sign-up.resource'
import type { UserResource } from './user-management.resource'

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
   * If roles are provided (or fetched from user profile), maps them dynamically.
   */
  public static toUserEntityFromSignInResponse(
    resource: SignInResponseResource,
    roles: string[] = ['ROLE_USER']
  ): User {
    return new User({
      id: resource.id,
      username: resource.username,
      roles: roles,
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
      roles: resource.roles && resource.roles.length > 0 ? resource.roles : ['ROLE_USER']
    })
  }

  /**
   * Transforms a UserResource DTO (from GET /api/v1/users/{id}) to a User Domain Entity.
   */
  public static toUserEntityFromUserResource(resource: UserResource, token?: string, refreshToken?: string): User {
    return new User({
      id: resource.id,
      username: resource.username,
      roles: resource.roles || ['ROLE_USER'],
      token: token,
      refreshToken: refreshToken
    })
  }
}
