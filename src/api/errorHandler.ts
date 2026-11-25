import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export interface ParsedHttpError {
  title: string
  message: string
  statusCode: number
  isNetworkOrDb: boolean
  isClientError: boolean
}

// Control de throttling para evitar saturar al usuario con múltiples alertas idénticas en ráfaga
const recentAlerts = new Map<string, number>()
const THROTTLE_MS = 3000

/**
 * Detecta si la aplicación está en modo oscuro (Tailwind / TailAdmin)
 */
export function isDarkMode(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
}

/**
 * Instancia de Toast no invasivo para notificaciones en la esquina superior derecha
 */
export const HttpToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

/**
 * Mapa de traducción para nombres de campos comunes en español
 */
const CAMPO_TRADUCCIONES: Record<string, string> = {
  email: 'correo electrónico',
  ci: 'documento de identidad (CI)',
  password: 'contraseña',
  password_confirmation: 'confirmación de contraseña',
  nombre: 'nombre',
  nombre_completo: 'nombre completo',
  departamento: 'departamento',
  carrera_id: 'carrera',
  carreras: 'carreras asignadas',
  materia_id: 'materia',
  paralelo_id: 'paralelo',
  ubicacion_id: 'aula o ubicación',
  dia_semana: 'día de la semana',
  hora_inicio: 'hora de inicio',
  hora_fin: 'hora de finalización',
  latitud: 'latitud de geocerca',
  longitud: 'longitud de geocerca',
  radio: 'radio de geocerca',
  device_id: 'identificador de dispositivo',
}

/**
 * Traduce expresiones técnicas en inglés de Laravel y errores de infraestructura
 */
export function translateTechnicalMessage(rawMsg: string): string {
  if (!rawMsg || typeof rawMsg !== 'string') return ''
  const trimmed = rawMsg.trim()
  const lower = trimmed.toLowerCase()

  // 1. Fallos de Base de Datos y Postgres/MySQL/SQL
  if (
    lower.includes('sqlstate') ||
    lower.includes('pdoexception') ||
    lower.includes('connection refused') ||
    lower.includes('access denied for user') ||
    lower.includes('base table or view not found') ||
    lower.includes('syntax error or access violation') ||
    lower.includes('deadlock found') ||
    lower.includes('queryexception')
  ) {
    return 'Fallo de conexión con la base de datos institucional. El servidor no pudo completar la consulta.'
  }

  // 2. Errores genéricos de servidor
  if (lower === 'server error' || lower.includes('internal server error')) {
    return 'Error interno en el servidor central. La base de datos o el servicio no pudieron procesar la solicitud.'
  }

  // 3. Fallas de red y conexión
  if (
    lower.includes('network error') ||
    lower.includes('failed to fetch') ||
    lower.includes('err_connection_refused') ||
    lower.includes('err_network') ||
    lower.includes('econnrefused')
  ) {
    return 'No se pudo conectar con el servidor central. Verifique su conexión de red o que el servidor esté activo.'
  }

  if (lower.includes('timeout') || lower.includes('timed out') || lower.includes('econnaborted')) {
    return 'El servidor tardó demasiado tiempo en responder. La conexión es lenta o el servidor está ocupado.'
  }

  // 4. Autenticación y permisos
  if (lower === 'unauthenticated.' || lower === 'unauthenticated') {
    return 'Su sesión de trabajo ha vencido o no cuenta con autorización. Inicie sesión nuevamente.'
  }
  if (lower.includes('this action is unauthorized') || lower === 'unauthorized') {
    return 'Acceso denegado: No cuenta con los permisos requeridos para realizar esta operación.'
  }

  // 5. Traducciones de validaciones de formularios en Laravel
  const yaRegistradoMatch = trimmed.match(/The ([\w_]+) has already been taken/i)
  if (yaRegistradoMatch) {
    const campo = yaRegistradoMatch[1].toLowerCase()
    const nombreCampo = CAMPO_TRADUCCIONES[campo] || `"${campo}"`
    return `El ${nombreCampo} ingresado ya se encuentra registrado en el sistema.`
  }

  const requeridoMatch = trimmed.match(/The ([\w_]+) field is required/i)
  if (requeridoMatch) {
    const campo = requeridoMatch[1].toLowerCase()
    const nombreCampo = CAMPO_TRADUCCIONES[campo] || `"${campo}"`
    return `El campo ${nombreCampo} es obligatorio.`
  }

  const minCharsMatch = trimmed.match(/The ([\w_]+) must be at least (\d+) characters/i)
  if (minCharsMatch) {
    const campo = minCharsMatch[1].toLowerCase()
    const min = minCharsMatch[2]
    const nombreCampo = CAMPO_TRADUCCIONES[campo] || `"${campo}"`
    return `El campo ${nombreCampo} debe contener al menos ${min} caracteres.`
  }

  if (lower.includes('the given data was invalid')) {
    return 'Los datos ingresados no son válidos o están incompletos.'
  }

  if (lower.includes('payload too large') || lower.includes('maximum allowed size')) {
    return 'El archivo seleccionado supera el tamaño máximo permitido por el servidor.'
  }

  return trimmed
}

/**
 * Parsea un error de Axios para estructurar título, mensaje en español y clasificación
 */
export function parseHttpError(error: any): ParsedHttpError {
  // 1. Sin respuesta del servidor (Network Error / Servidor apagado / DNS / Timeout)
  if (!error?.response) {
    const isTimeout = error?.code === 'ECONNABORTED' || error?.message?.toLowerCase().includes('timeout')
    return {
      title: isTimeout ? 'Tiempo de espera agotado' : 'Sin conexión al servidor',
      message: isTimeout
        ? 'El servidor tardó demasiado tiempo en responder. Verifique su red o que el servicio no esté saturado.'
        : 'No se pudo conectar con el servidor central. Verifique que el servicio esté en línea o revise su conexión a internet.',
      statusCode: 0,
      isNetworkOrDb: true,
      isClientError: false,
    }
  }

  const status: number = error.response.status || 0
  const data = error.response.data
  const rawMessage = data?.message || data?.error || (typeof data === 'string' ? data : '')

  // 2. Errores 500, 502, 503, 504 (Servidor o Base de Datos)
  if (status >= 500) {
    const translated = translateTechnicalMessage(rawMessage)
    const isDb =
      rawMessage.toLowerCase().includes('sql') ||
      rawMessage.toLowerCase().includes('database') ||
      rawMessage.toLowerCase().includes('pdo') ||
      rawMessage.toLowerCase().includes('connection refused')

    return {
      title: isDb ? 'Error en Base de Datos' : status === 503 ? 'Servicio no disponible' : 'Error en el Servidor',
      message:
        translated ||
        (isDb
          ? 'La base de datos central no responde en este momento. Por favor contacte con soporte técnico.'
          : 'Ocurrió un error interno en el servidor al procesar la solicitud.'),
      statusCode: status,
      isNetworkOrDb: true,
      isClientError: false,
    }
  }

  // 3. Error 401 (No autenticado / Token vencido / Credenciales erróneas)
  if (status === 401) {
    const isLoginEndpoint =
      error.config?.url?.includes('/login') ||
      error.config?.url?.includes('/signin') ||
      error.config?.url?.includes('/auth')

    return {
      title: isLoginEndpoint ? 'Credenciales incorrectas' : 'Sesión expirada',
      message: isLoginEndpoint
        ? 'El correo electrónico o la contraseña ingresada no son válidos.'
        : 'Su sesión de trabajo ha vencido por inactividad o seguridad. Por favor inicie sesión de nuevo.',
      statusCode: 401,
      isNetworkOrDb: false,
      isClientError: true,
    }
  }

  // 4. Error 403 (Acceso denegado / Sin permisos)
  if (status === 403) {
    return {
      title: 'Acceso no autorizado',
      message: data?.message
        ? translateTechnicalMessage(data.message)
        : 'No cuenta con los permisos necesarios para realizar esta operación.',
      statusCode: 403,
      isNetworkOrDb: false,
      isClientError: true,
    }
  }

  // 5. Error 404 (No encontrado)
  if (status === 404) {
    return {
      title: 'Registro no encontrado',
      message: 'El registro o servicio solicitado no existe o fue retirado del sistema.',
      statusCode: 404,
      isNetworkOrDb: false,
      isClientError: true,
    }
  }

  // 6. Error 422 (Validación de formulario)
  if (status === 422) {
    const fieldErrors: string[] = []
    if (data?.errors && typeof data.errors === 'object') {
      for (const key of Object.keys(data.errors)) {
        const val = data.errors[key]
        if (Array.isArray(val) && val.length > 0) {
          fieldErrors.push(translateTechnicalMessage(val[0]))
        } else if (typeof val === 'string') {
          fieldErrors.push(translateTechnicalMessage(val))
        }
      }
    }

    const compiledMessage = fieldErrors.length > 0
      ? fieldErrors.join(' ')
      : translateTechnicalMessage(rawMessage) || 'Los datos enviados no son válidos o están incompletos.'

    return {
      title: 'Datos no válidos',
      message: compiledMessage,
      statusCode: 422,
      isNetworkOrDb: false,
      isClientError: true,
    }
  }

  // 7. Error 429 (Demasiados intentos)
  if (status === 429) {
    return {
      title: 'Demasiadas solicitudes',
      message:
        translateTechnicalMessage(rawMessage) ||
        'Ha alcanzado el límite de intentos permitidos. Por favor espere unos momentos antes de reintentar.',
      statusCode: 429,
      isNetworkOrDb: false,
      isClientError: true,
    }
  }

  // Otros errores (400, 409, etc.)
  return {
    title: 'Operación no completada',
    message: translateTechnicalMessage(rawMessage) || 'No fue posible completar la operación en el sistema.',
    statusCode: status,
    isNetworkOrDb: false,
    isClientError: true,
  }
}

/**
 * Notifica al usuario de forma visual y estilizada con SweetAlert2
 */
export function notificarError(parsed: ParsedHttpError, opciones?: { asModal?: boolean }) {
  const isDark = isDarkMode()
  const key = `${parsed.statusCode}_${parsed.title}_${parsed.message}`
  const now = Date.now()
  const lastTime = recentAlerts.get(key) || 0

  // Evitar alertas repetidas dentro del lapso de throttle
  if (now - lastTime < THROTTLE_MS) {
    return
  }
  recentAlerts.set(key, now)

  if (opciones?.asModal || parsed.isNetworkOrDb || parsed.statusCode === 403) {
    Swal.fire({
      title: parsed.title,
      text: parsed.message,
      icon: parsed.isNetworkOrDb ? 'warning' : 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#4f46e5',
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
    })
  } else {
    HttpToast.fire({
      icon: 'error',
      title: parsed.title,
      text: parsed.message,
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
    })
  }
}
