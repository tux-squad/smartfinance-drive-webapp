import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

/**
 * Request Interceptor: Attaches Authorization Bearer token to HTTP requests.
 */
export const iamRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const url = config.url || ''
  const isPublicAuthEndpoint =
    url.includes('/api/v1/auth/sessions') ||
    url.includes('/api/v1/auth/registrations') ||
    url.includes('/api/v1/auth/tokens') ||
    url.includes('/api/v1/auth/password-recoveries') ||
    url.includes('/api/v1/auth/password-resets') ||
    url.includes('/api/v1/auth/google') ||
    url.includes('/api/v1/auth/email-verification')

  if (isPublicAuthEndpoint) {
    if (config.headers && config.headers.Authorization) {
      delete config.headers.Authorization
    }
    return config
  }

  const token = localStorage.getItem('access_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

/**
 * Response Interceptor: Handles 401 Unauthorized errors for automatic session cleanup.
 */
export const iamResponseErrorInterceptor = async (error: AxiosError) => {
  if (error.response?.status === 401) {
    // Session token expired or invalid
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_roles')
    localStorage.removeItem('user_first_name')
    localStorage.removeItem('user_last_name')
  }
  return Promise.reject(error)
}
