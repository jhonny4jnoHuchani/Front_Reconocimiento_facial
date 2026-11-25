import { ref, computed } from 'vue'

export interface PermisoDef {
  id: string
  nombre: string
  descripcion: string
  modulo: string
}

export interface RolDef {
  id: string
  nombre: string
  descripcion: string
  baseRol: 'admin' | 'supervisor'
  isSystem: boolean
  permisos: string[]
}

// Catálogo maestro de permisos del sistema
export const CATALOGO_PERMISOS: PermisoDef[] = [
  // Módulo Asistencia y Monitoreo
  { id: 'dashboard.ver', nombre: 'Ver Dashboard', descripcion: 'Visualizar métricas en tiempo real y actividad diaria', modulo: 'Asistencia y Operación' },
  { id: 'asistencia.validar', nombre: 'Validar Marcados', descripcion: 'Aprobar o invalidar marcaciones con fotos faciales y de constancia', modulo: 'Asistencia y Operación' },
  { id: 'asistencia.justificar', nombre: 'Registro Administrativo / Justificación', descripcion: 'Registrar marcados manuales y justificaciones de asistencia', modulo: 'Asistencia y Operación' },
  { id: 'asistencia.monitoreo', nombre: 'Monitoreo Semanal', descripcion: 'Consultar asistencias y faltas por períodos semanales o diarios', modulo: 'Asistencia y Operación' },
  { id: 'asistencia.reportes', nombre: 'Reportes Mensuales y Excel', descripcion: 'Generar reportes consolidados mensuales y exportar planillas', modulo: 'Asistencia y Operación' },

  // Módulo Docentes
  { id: 'docentes.ver', nombre: 'Ver Docentes', descripcion: 'Acceso al directorio y búsqueda de docentes', modulo: 'Gestión Docente' },
  { id: 'docentes.crear_editar', nombre: 'Crear y Editar Docentes', descripcion: 'Alta, modificación y baja de perfiles docentes', modulo: 'Gestión Docente' },
  { id: 'docentes.importar_upea', nombre: 'Importar desde UPEA', descripcion: 'Importación masiva de carga horaria y docentes desde la base UPEA', modulo: 'Gestión Docente' },
  { id: 'docentes.seguridad', nombre: 'Seguridad y Dispositivos', descripcion: 'Desvincular teléfonos biométricos y resetear contraseñas', modulo: 'Gestión Docente' },

  // Módulo Planificación Académica
  { id: 'academica.horarios', nombre: 'Planificador de Horarios', descripcion: 'Ver y configurar la matriz semanal de horarios por aula', modulo: 'Planificación Académica' },
  { id: 'academica.tolerancias', nombre: 'Tolerancias y Ventanas de Marcado', descripcion: 'Configurar minutos de anticipación, tolerancia y salida de la carrera', modulo: 'Planificación Académica' },
  { id: 'academica.asignaciones', nombre: 'Asignaciones Académicas', descripcion: 'Vincular materias con paralelos y docentes', modulo: 'Planificación Académica' },
  { id: 'academica.materias', nombre: 'Catálogo de Materias', descripcion: 'Administrar asignaturas curriculares', modulo: 'Planificación Académica' },
  { id: 'academica.paralelos', nombre: 'Paralelos y Cursos', descripcion: 'Gestionar paralelos y capacidades', modulo: 'Planificación Académica' },
  { id: 'academica.ubicaciones', nombre: 'Aulas y Geocercas', descripcion: 'Trazado de geocercas satelitales en Leaflet y catálogo de aulas', modulo: 'Planificación Académica' },

  // Módulo Sistema y Seguridad
  { id: 'sistema.carreras', nombre: 'Gestión de Carreras', descripcion: 'Administrar carreras y catálogos institucionales', modulo: 'Sistema y Seguridad' },
  { id: 'sistema.usuarios', nombre: 'Gestión de Usuarios', descripcion: 'Crear y administrar cuentas de supervisores y operadores', modulo: 'Sistema y Seguridad' },
  { id: 'sistema.roles', nombre: 'Roles y Permisos', descripcion: 'Configurar perfiles de acceso y permisos del sistema', modulo: 'Sistema y Seguridad' },
  { id: 'sistema.auditoria', nombre: 'Bitácora de Auditoría', descripcion: 'Ver el historial y registro forense de acciones administrativas', modulo: 'Sistema y Seguridad' },
]

const ALL_PERMISSION_IDS = CATALOGO_PERMISOS.map(p => p.id)

// Roles base iniciales
export const ROLES_PREDETERMINADOS: RolDef[] = [
  {
    id: 'admin',
    nombre: 'Administrador General',
    descripcion: 'Acceso total y sin restricciones a todos los módulos y configuraciones.',
    baseRol: 'admin',
    isSystem: true,
    permisos: [...ALL_PERMISSION_IDS],
  },
  {
    id: 'supervisor',
    nombre: 'Supervisor de Carrera',
    descripcion: 'Control operativo de asistencia, horarios y seguimiento docente en su carrera.',
    baseRol: 'supervisor',
    isSystem: true,
    permisos: [
      'dashboard.ver',
      'asistencia.validar',
      'asistencia.justificar',
      'asistencia.monitoreo',
      'asistencia.reportes',
      'docentes.ver',
      'docentes.importar_upea',
      'academica.horarios',
      'academica.tolerancias',
      'academica.asignaciones',
      'academica.materias',
      'academica.paralelos',
      'academica.ubicaciones',
    ],
  },
  {
    id: 'kardex',
    nombre: 'Kardex / Control de Asistencia',
    descripcion: 'Enfocado en la verificación diaria de marcados, justificaciones y exportación de reportes.',
    baseRol: 'supervisor',
    isSystem: false,
    permisos: [
      'dashboard.ver',
      'asistencia.validar',
      'asistencia.justificar',
      'asistencia.monitoreo',
      'asistencia.reportes',
      'docentes.ver',
      'academica.horarios',
    ],
  },
  {
    id: 'auditor',
    nombre: 'Auditor / Decanatura',
    descripcion: 'Acceso en modo consulta a métricas, monitoreo semanal, auditoría y reportes consolidados.',
    baseRol: 'supervisor',
    isSystem: false,
    permisos: [
      'dashboard.ver',
      'asistencia.monitoreo',
      'asistencia.reportes',
      'docentes.ver',
      'academica.horarios',
      'sistema.auditoria',
    ],
  },
]

const STORAGE_KEY = 'sistema_roles_permisos_v1'

const cargarRolesGuardados = (): RolDef[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Error al cargar roles de localStorage:', e)
  }
  return ROLES_PREDETERMINADOS
}

const rolesRef = ref<RolDef[]>(cargarRolesGuardados())

const guardarRoles = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rolesRef.value))
  } catch (e) {
    console.error('Error al guardar roles en localStorage:', e)
  }
}

export function usePermissions() {
  const userRaw = localStorage.getItem('user')
  const user = userRaw ? JSON.parse(userRaw) : null
  const rolActualId = user?.rol || 'supervisor'

  const rolActualDef = computed(() => {
    return rolesRef.value.find(r => r.id === rolActualId) ||
      rolesRef.value.find(r => r.id === 'supervisor') ||
      rolesRef.value[0]
  })

  const permisosUsuario = computed<string[]>(() => {
    if (rolActualId === 'admin') {
      return ALL_PERMISSION_IDS
    }
    return rolActualDef.value?.permisos || []
  })

  const hasPermission = (permisoId: string): boolean => {
    if (rolActualId === 'admin') return true
    return permisosUsuario.value.includes(permisoId)
  }

  const hasAnyPermission = (permisosList: string[]): boolean => {
    if (rolActualId === 'admin') return true
    return permisosList.some(p => hasPermission(p))
  }

  const updateRolePermissions = (rolId: string, nuevosPermisos: string[]) => {
    const idx = rolesRef.value.findIndex(r => r.id === rolId)
    if (idx !== -1) {
      rolesRef.value[idx].permisos = [...nuevosPermisos]
      guardarRoles()
    }
  }

  const addCustomRole = (nuevoRol: Omit<RolDef, 'isSystem'>) => {
    const rolCompleto: RolDef = {
      ...nuevoRol,
      isSystem: false,
    }
    rolesRef.value.push(rolCompleto)
    guardarRoles()
  }

  const deleteCustomRole = (rolId: string): boolean => {
    const idx = rolesRef.value.findIndex(r => r.id === rolId)
    if (idx !== -1 && !rolesRef.value[idx].isSystem) {
      rolesRef.value.splice(idx, 1)
      guardarRoles()
      return true
    }
    return false
  }

  const resetToDefaults = () => {
    rolesRef.value = JSON.parse(JSON.stringify(ROLES_PREDETERMINADOS))
    guardarRoles()
  }

  return {
    catalogoPermisos: CATALOGO_PERMISOS,
    roles: rolesRef,
    rolActualId,
    rolActualDef,
    permisosUsuario,
    hasPermission,
    hasAnyPermission,
    updateRolePermissions,
    addCustomRole,
    deleteCustomRole,
    resetToDefaults,
  }
}
