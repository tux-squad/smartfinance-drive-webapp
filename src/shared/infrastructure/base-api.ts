import axios, { type AxiosInstance } from 'axios'

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

    // Add JWT authorization header interceptor
    this._http.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    }, (error) => {
      return Promise.reject(error)
    })
  }

  /**
   * Low-level Axios HTTP client instance used by infrastructure endpoints.
   */
  public get http(): AxiosInstance {
    return this._http
  }
}
