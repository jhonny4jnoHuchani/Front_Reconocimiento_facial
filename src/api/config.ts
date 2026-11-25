import axios from 'axios'
import { parseHttpError, notificarError } from './errorHandler'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://186.121.212.87:1011/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // 20 segundos máximo de espera
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor: agrega token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: captura fallos de red, base de datos y endpoints con alertas claras en español
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint =
      error.config?.url?.includes('/login') ||
      error.config?.url?.includes('/signin') ||
      error.config?.url?.includes('/auth')

    // Parsear el error a un formato claro y en español
    const parsed = parseHttpError(error)

    // Garantizar que error.response.data.message contenga siempre el mensaje claro en español
    if (!error.response) {
      error.response = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        config: error.config,
        data: { message: parsed.message }
      }
    } else {
      if (!error.response.data || typeof error.response.data !== 'object') {
        error.response.data = { message: parsed.message }
      } else {
        error.response.data.message = parsed.message
      }
    }

    // Agregar propiedades directas al objeto de error
    error.userTitle = parsed.title
    error.userMessage = parsed.message

    // Manejo de 401 (Sesión expirada) fuera del login
    if (parsed.statusCode === 401 && !isLoginEndpoint) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      notificarError(parsed, { asModal: true })
      setTimeout(() => {
        if (window.location.pathname !== '/signin') {
          window.location.href = '/signin'
        }
      }, 1600)
      return Promise.reject(error)
    }

    // Notificación automática si es un fallo de Red, Base de Datos, Servidor (500) o Permisos (403)
    const isSilent = (error.config as any)?.silentError === true
    if (!isSilent && (parsed.isNetworkOrDb || parsed.statusCode === 403 || parsed.statusCode === 429)) {
      notificarError(parsed)
    }

    return Promise.reject(error)
  }
)

export default api