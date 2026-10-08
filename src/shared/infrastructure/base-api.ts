import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smartfinance-drive-platform.onrender.com'

// Mutex queue state for concurrent 401 handling
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

function processQueue(error: any, token: string | null = null): void {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

function clearLocalSession(): void {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_name')
  localStorage.removeItem('user_id')
  localStorage.removeItem('user_roles')
}

/**
 * Shared infrastructure API client base factory.
 * Decoupled from specific bounded contexts and equipped with automatic Bearer JWT injection
 * and transparent 401 token refresh queue (API Doc 1.3).
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

    // Handle 401 Unauthorized via Token Refresh (API Doc 1.3)
    this._http.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined

        if (error.response?.status === 401 && originalRequest) {
          const requestUrl = originalRequest.url || ''

          // Never retry authentication endpoints to prevent endless loops
          const isAuthEndpoint =
            requestUrl.includes('/api/v1/auth/tokens') ||
            requestUrl.includes('/api/v1/auth/sign-in') ||
            requestUrl.includes('/api/v1/auth/sign-up') ||
            requestUrl.includes('/api/v1/auth/sessions') ||
            requestUrl.includes('/api/v1/auth/password-')

          if (isAuthEndpoint || originalRequest._retry) {
            if (isAuthEndpoint && requestUrl.includes('/api/v1/auth/tokens')) {
              clearLocalSession()
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('session-expired'))
              }
            }
            return Promise.reject(error)
          }

          const storedRefreshToken = localStorage.getItem('refresh_token')
          if (!storedRefreshToken) {
            clearLocalSession()
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('session-expired'))
            }
            return Promise.reject(error)
          }

          if (isRefreshing) {
            return new Promise<AxiosResponse>((resolve, reject) => {
              failedQueue.push({
                resolve: (newToken: string) => {
                  if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                  }
                  resolve(this._http(originalRequest))
                },
                reject: (err: any) => reject(err)
              })
            })
          }

          originalRequest._retry = true
          isRefreshing = true

          try {
            // Direct call to refresh endpoint using unintercepted axios instance
            const refreshRes = await axios.post(
              `${API_BASE_URL}/api/v1/auth/tokens`,
              { refreshToken: storedRefreshToken },
              { headers: { 'Content-Type': 'application/json' } }
            )

            const newToken = refreshRes.data?.token
            const newRefreshToken = refreshRes.data?.refreshToken

            if (!newToken) {
              throw new Error('No access token returned')
            }

            localStorage.setItem('access_token', newToken)
            if (newRefreshToken) {
              localStorage.setItem('refresh_token', newRefreshToken)
            }

            if (typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent('session-refreshed', {
                  detail: { token: newToken, refreshToken: newRefreshToken || storedRefreshToken }
                })
              )
            }

            processQueue(null, newToken)

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            return this._http(originalRequest)
          } catch (refreshErr) {
            processQueue(refreshErr, null)
            clearLocalSession()
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('session-expired'))
            }
            return Promise.reject(refreshErr)
          } finally {
            isRefreshing = false
          }
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
