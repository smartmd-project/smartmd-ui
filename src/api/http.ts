import axios, { AxiosError, type AxiosRequestConfig } from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const requestUrl = originalRequest?.url ?? ''
    const canRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !requestUrl.includes('/auth/signin') &&
      !requestUrl.includes('/auth/signup') &&
      !requestUrl.includes('/auth/refresh-token')

    if (!canRefresh) {
      return Promise.reject(error)
    }

    originalRequest._retry = true
    await apiClient.post('/auth/refresh-token')
    return apiClient(originalRequest)
  },
)

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong.') {
  if (!axios.isAxiosError(error)) {
    return fallback
  }

  const responseData = error.response?.data

  if (typeof responseData === 'string') {
    return responseData
  }

  if (responseData && typeof responseData === 'object') {
    const message = (responseData as { message?: unknown }).message

    if (Array.isArray(message)) {
      return message.join(' ')
    }

    if (typeof message === 'string') {
      return message
    }
  }

  return fallback
}
