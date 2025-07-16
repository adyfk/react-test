/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { ApiError, NetworkError, TimeoutError } from '@/core/errors/api.error'

/**
 * Base API client for making HTTP requests
 */
export interface ApiConfig {
  baseUrl: string
  timeout?: number
  headers?: Record<string, string>
  retry?: {
    attempts: number
    delay: number
  }
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

/**
 * Base API client class using axios
 */
export class BaseApiClient {
  private axiosInstance: ReturnType<typeof axios.create>
  private config: Required<ApiConfig>

  constructor(config: ApiConfig) {
    this.config = {
      baseUrl: config.baseUrl,
      timeout: config.timeout || 10000,
      headers: config.headers || {},
      retry: config.retry || { attempts: 3, delay: 1000 },
    }

    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })

    // Add request interceptor for retry logic
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // Only retry on 5xx errors and network errors
        const shouldRetry = (error.response?.status >= 500) ||
          (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') ||
          (!error.response && error.request)

        if (shouldRetry && !originalRequest._retry) {
          originalRequest._retry = true

          for (let i = 0; i < this.config.retry.attempts; i++) {
            try {
              await this.delay(this.config.retry.delay * (i + 1)) // Exponential backoff
              return await this.axiosInstance.request(originalRequest)
            } catch (retryError) {
              if (i === this.config.retry.attempts - 1) {
                throw retryError
              }
            }
          }
        }

        throw error
      },
    )
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Convert axios response to our ApiResponse format
   */
  private convertResponse<T>(axiosResponse: any): ApiResponse<T> {
    return {
      data: axiosResponse.data,
      status: axiosResponse.status,
      statusText: axiosResponse.statusText,
      headers: axiosResponse.headers as Record<string, string>,
    }
  }

  /**
   * Make HTTP request
   */
  async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      headers?: Record<string, string>
      body?: unknown
      timeout?: number
    } = {},
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.config.timeout,
    } = options

    const axiosConfig = {
      method,
      url: endpoint,
      headers: {
        ...this.config.headers,
        ...headers,
      },
      timeout,
      data: body,
    }

    try {
      const response = await this.axiosInstance.request(axiosConfig)
      return this.convertResponse(response)
    } catch (error) {
      // Convert axios errors to our custom error classes
      if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as any
        if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
          throw new TimeoutError(timeout)
        }

        if (axiosError.response) {
          // Server responded with error status
          throw await ApiError.fromResponse(axiosError.response, {
            url: endpoint,
            method,
          })
        } else if (axiosError.request) {
          // Network error (no response received)
          throw new NetworkError(
            `Network error: ${axiosError.message}`,
            axiosError,
          )
        }
      }

      // For any other errors, wrap in NetworkError
      throw new NetworkError(
        error instanceof Error ? error.message : 'Unknown network error',
        error instanceof Error ? error : undefined,
      )
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: { headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown, options?: { headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown, options?: { headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: { headers?: Record<string, string> }): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * Update base configuration
   */
  updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config }

    // Update axios instance with new config
    this.axiosInstance.defaults.baseURL = this.config.baseUrl
    this.axiosInstance.defaults.timeout = this.config.timeout
    this.axiosInstance.defaults.headers = {
      ...this.axiosInstance.defaults.headers,
      ...this.config.headers,
    }
  }
}
