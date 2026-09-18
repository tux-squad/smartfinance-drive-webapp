import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import type {
  CreateProfileRequestResource,
  UpdateProfileRequestResource,
  ProfileResponseResource
} from './profile.resource'

/**
 * Infrastructure API Gateway for Profiles endpoints (/api/v1/profiles).
 */
export class ProfilesApi extends BaseApi {
  /** 2.1 Crear Perfil de Cliente */
  public createProfile(resource: CreateProfileRequestResource): Promise<AxiosResponse<ProfileResponseResource>> {
    return this.http.post<ProfileResponseResource>('/api/v1/profiles', resource)
  }

  /** 2.2 Obtener Perfil por ID */
  public getProfileById(profileId: string | number): Promise<AxiosResponse<ProfileResponseResource>> {
    return this.http.get<ProfileResponseResource>(`/api/v1/profiles/${profileId}`)
  }

  /** 2.3 Obtener Perfil por User ID */
  public getProfileByUserId(userId: string | number): Promise<AxiosResponse<ProfileResponseResource>> {
    return this.http.get<ProfileResponseResource>(`/api/v1/profiles/users/${userId}`)
  }

  /** 2.4 Actualizar Perfil */
  public updateProfile(
    profileId: string | number,
    resource: UpdateProfileRequestResource
  ): Promise<AxiosResponse<ProfileResponseResource>> {
    return this.http.put<ProfileResponseResource>(`/api/v1/profiles/${profileId}`, resource)
  }

  /** 2.5 Eliminar Perfil */
  public deleteProfile(profileId: string | number): Promise<AxiosResponse<void>> {
    return this.http.delete<void>(`/api/v1/profiles/${profileId}`)
  }
}
