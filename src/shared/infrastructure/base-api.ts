import axios, { type AxiosInstance } from 'axios'
import { iamRequestInterceptor, iamResponseErrorInterceptor } from '@/iam/infrastructure/iam.interceptor'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smartfinance-drive-platform.onrender.com'

/**
 * Shared infrastructure API client base factory for all bounded contexts.
 */
export class BaseApi {
  private readonly _http: AxiosInstance

  constructor() {
    this._http = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Attach IAM request and response interceptors
    this._http.interceptors.request.use(iamRequestInterceptor, (error) => Promise.reject(error))
    this._http.interceptors.response.use((response) => response, iamResponseErrorInterceptor)
  }

  /**
   * Low-level Axios HTTP client instance used by infrastructure endpoints.
   */
  public get http(): AxiosInstance {
    return this._http
  }
}
