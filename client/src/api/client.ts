/**
 * API Client - Axios instance with interceptors
 * Handles authentication, error handling, and base URL configuration
 */

import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 30000,
})

// Request interceptor: Add authorization token
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: Handle errors
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth 
      useAuthStore.getState().logout()
      
      // Only redirect if not already on login page to avoid refresh loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client
