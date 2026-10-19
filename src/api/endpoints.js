import api from './config'

// ── Auth ─────────────────────────────────────────────
export const login = (email, password) =>
  api.post('/admin/auth/login', { email, password })

export const logout = () => api.post('/admin/auth/logout')

export const perfil = () => api.get('/auth/perfil')

// ── Docentes ─────────────────────────────────────────
export const getDocentes = (params) => api.get('/docentes', { params })
export const createDocente = (data) => api.post('/docentes', data)
export const updateDocente = (id, data) => api.put(`/docentes/${id}`, data)
export const deleteDocente = (id) => api.delete(`/docentes/${id}`)
export const reactivarDocente = (id) => api.patch(`/docentes/${id}/reactivar`)
export const resetPasswordDocente = (id) => api.patch(`/docentes/${id}/reset-password`)

// ── Materias ─────────────────────────────────────────
export const getMaterias = (params) => api.get('/materias', { params })
export const createMateria = (data) => api.post('/materias', data)
export const updateMateria = (id, data) => api.put(`/materias/${id}`, data)
export const deleteMateria = (id) => api.delete(`/materias/${id}`)

// ── Paralelos ────────────────────────────────────────
export const getParalelos = (params) => api.get('/paralelos', { params })
export const createParalelo = (data) => api.post('/paralelos', data)
export const updateParalelo = (id, data) => api.put(`/paralelos/${id}`, data)
export const deleteParalelo = (id) => api.delete(`/paralelos/${id}`)

// ── Asignaciones ─────────────────────────────────────
export const getAsignaciones = (params) => api.get('/asignaciones', { params })
export const createAsignacion = (data) => api.post('/asignaciones', data)
export const asignarDocente = (id, docenteId) => api.put(`/asignaciones/${id}/asignar-docente`, { docente_id: docenteId })
export const quitarDocente = (id) => api.delete(`/asignaciones/${id}/quitar-docente`)
export const deleteAsignacion = (id) => api.delete(`/asignaciones/${id}`)

// ── Ubicaciones ──────────────────────────────────────
export const getUbicaciones = (params) => api.get('/ubicaciones', { params })
export const createUbicacion = (data) => api.post('/ubicaciones/crear', data)
export const updateUbicacion = (id, data) => api.put(`/ubicaciones/${id}/actualizar`, data)
export const deleteUbicacion = (id) => api.delete(`/ubicaciones/${id}/eliminar`)

// ── Horarios ─────────────────────────────────────────
export const getHorarios = (params) => api.get('/horarios', { params })
export const createHorario = (data) => api.post('/horarios/crear', data)
export const updateHorario = (id, data) => api.put(`/horarios/${id}/actualizar`, data)
export const deleteHorario = (id) => api.delete(`/horarios/${id}/eliminar`)

// ── Marcados ─────────────────────────────────────────
export const getHistorial = (params) => api.get('/marcados/historial', { params })
export const getMarcadosHoy = () => api.get('/marcados/hoy')
export const marcarEntrada = (data) => api.post('/marcados/entrada', data)
export const marcarSalida = (data) => api.post('/marcados/salida', data)

// ── Admin Marcados ───────────────────────────────────

export const getMarcadosPendientesAdmin = (params) => api.get('/admin/marcados/pendientes', { params })
export const getMarcadosHoyAdmin = (params) => api.get('/admin/marcados/pendientes', { params })
export const validarMarcadoAdmin = (id, data) => api.post(`/admin/marcados/${id}/validar`, data)

// ── Carreras ─────────────────────────────────────────
export const getCarreras = (params) => api.get('/carreras', { params })
export const createCarrera = (data) => api.post('/carreras', data)
export const updateCarrera = (id, data) => api.put(`/carreras/${id}/actualizar`, data)
export const deleteCarrera = (id) => api.delete(`/carreras/${id}/eliminar`)
export const importarCarreras = (data) => api.post('/carreras/importar', data)

// ── Reset dispositivo (admin) ────────────────────────
export const buscarDocentePorCi = (ci) => api.get(`/docentes/buscar-por-ci/${ci}`)
export const resetDispositivo = (userId) => api.patch(`/auth/reset-dispositivo/${userId}`)

// ── Reconocimiento facial ────────────────────────────
export const getReconocimientoEstado = (docenteId) => api.get(`/reconocimiento/estado/${docenteId}`)
// ── Importar horarios ────────────────────────────────
export const getImportarPreview = (params) => api.get('/importar/preview', { params })
export const confirmarImportacion = (data) => api.post('/importar/confirmar', data)

// ── Usuarios (admin) ────────────────────────────────
export const getUsuarios = (params) => api.get('/usuarios', { params })
export const createUsuario = (data) => api.post('/usuarios', data)
export const updateUsuario = (id, data) => api.put(`/usuarios/${id}`, data)
export const deleteUsuario = (id) => api.delete(`/usuarios/${id}`)
export const reactivarUsuario = (id) => api.patch(`/usuarios/${id}/reactivar`)
export const resetPasswordUsuario = (id) => api.patch(`/usuarios/${id}/reset-password`)

// ── Auth ─────────────────────────────────────────────
export const cambiarPassword = (data) => api.post('/auth/cambiar-password', data)

// ── Reportes y Monitoreo ─────────────────────────────────────────────
export const getReporteMensual = (params) => api.get('/admin/reportes/mensual', { params })
export const getMonitoreoSemanal = (params) => api.get('/admin/reportes/monitoreo-semanal', { params })
export const getAuditoria = (params) => api.get('/admin/auditoria', { params })

// ── Herramienta Marcado Manual (DEV / Administrativo) ──────────────────
export const getDocenteHorariosPorCi = (ci) => api.get(`/admin/dev/docente-horarios/${ci}`)
export const registrarMarcadoManual = (data) => api.post('/admin/dev/marcar-manual', data)

export const editarMarcadoManual = (id, data) => api.put(`/admin/dev/marcado/${id}`, data)
export const eliminarMarcadoManual = (id) => api.delete(`/admin/dev/marcado/${id}`)
