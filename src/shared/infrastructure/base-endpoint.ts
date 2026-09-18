import type { AxiosResponse } from 'axios'
import type { BaseApi } from './base-api'

/**
 * Generic infrastructure endpoint abstraction for CRUD operations across bounded contexts.
 */
export class BaseEndpoint<TResource = any> {
  protected http: BaseApi['http']
  protected endpointPath: string

  constructor(baseApi: BaseApi, endpointPath: string) {
    this.http = baseApi.http
    this.endpointPath = endpointPath
  }

  /**
   * Fetches all resources from the endpoint.
   */
  public getAll(): Promise<AxiosResponse<TResource[] | any>> {
    return this.http.get(this.endpointPath)
  }

  /**
   * Fetches a single resource by identifier.
   */
  public getById(id: string | number): Promise<AxiosResponse<TResource>> {
    return this.http.get(`${this.endpointPath}/${id}`)
  }

  /**
   * Persists a new resource payload.
   */
  public create(resource: Partial<TResource> | any): Promise<AxiosResponse<TResource>> {
    return this.http.post(this.endpointPath, resource)
  }

  /**
   * Updates an existing resource by identifier.
   */
  public update(id: string | number, resource: Partial<TResource> | any): Promise<AxiosResponse<TResource>> {
    return this.http.put(`${this.endpointPath}/${id}`, resource)
  }

  /**
   * Deletes a resource by identifier.
   */
  public delete(id: string | number): Promise<AxiosResponse<void>> {
    return this.http.delete(`${this.endpointPath}/${id}`)
  }
}
