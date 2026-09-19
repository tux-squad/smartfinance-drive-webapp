import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smartfinance-drive-platform.onrender.com'

/**
 * Shared infrastructure API client base factory.
 * Decoupled from specific bounded contexts and equipped with automatic Bearer JWT injection.
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

    // Automatically inject Bearer JWT from localStorage for authenticated requests
    this._http.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error: AxiosError) => Promise.reject(error)
    )

    // Automatically handle 401 Unauthorized for expired tokens
    this._http.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_name')
          localStorage.removeItem('user_id')
          localStorage.removeItem('user_roles')
        }
        return Promise.reject(error)
      }
    )
  }

  /**
   * Low-level Axios HTTP client instance used by infrastructure endpoints.
   */
  public get http(): AxiosInstance {
    return this._http
  }

  /**
   * Allows bounded contexts to register request interceptors dynamically.
   */
  public addRequestInterceptor(
    onFulfilled?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
    onRejected?: (error: AxiosError) => any
  ): void {
    this._http.interceptors.request.use(onFulfilled, onRejected)
  }

  /**
   * Allows bounded contexts to register response interceptors dynamically.
   */
  public addResponseInterceptor(
    onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onRejected?: (error: AxiosError) => any
  ): void {
    this._http.interceptors.response.use(onFulfilled, onRejected)
  }
}
