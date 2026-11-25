import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: { title: 'Iniciar Sesión' },
    },
    {
      path: '/politica-de-privacidad',
      name: 'PoliticaPrivacidad',
      component: () => import('../views/Legal/PoliticaPrivacidad.vue'),
      meta: { title: 'Política de Privacidad' },
    },
    {
      path: '/solicitud-eliminacion-datos',
      name: 'EliminacionDatos',
      component: () => import('../views/Legal/EliminacionDatos.vue'),
      meta: { title: 'Solicitud de Eliminación de Datos' },
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { title: 'Dashboard', requiresAuth: true },
    },
    {
      path: '/docentes',
      name: 'Docentes',
      component: () => import('../views/Docentes.vue'),
      meta: { title: 'Docentes', requiresAuth: true },
    },
    {
      path: '/materias',
      name: 'Materias',
      component: () => import('../views/Materias.vue'),
      meta: { title: 'Materias', requiresAuth: true },
    },
    {
      path: '/paralelos',
      name: 'Paralelos',
      component: () => import('../views/Paralelos.vue'),
      meta: { title: 'Paralelos', requiresAuth: true },
    },
    {
      path: '/asignaciones',
      name: 'Asignaciones',
      component: () => import('../views/Asignaciones.vue'),
      meta: { title: 'Asignaciones', requiresAuth: true },
    },
    {
      path: '/ubicaciones',
      name: 'Ubicaciones',
      component: () => import('../views/Ubicaciones.vue'),
      meta: { title: 'Ubicaciones', requiresAuth: true },
    },
    {
      path: '/horarios',
      name: 'Horarios',
      component: () => import('../views/Horarios.vue'),
      meta: { title: 'Horarios', requiresAuth: true },
    },
    {
      path: '/tolerancias-marcado',
      name: 'ToleranciasMarcado',
      component: () => import('../views/ToleranciasMarcado.vue'),
      meta: {
        title: 'Ventanas de Marcado',
        requiresAuth: true,
        roles: ['admin', 'supervisor'],
        permission: 'academica.tolerancias',
      },
    },
    {
      path: '/carreras',
      name: 'Carreras',
      component: () => import('../views/Carreras.vue'),
      meta: { title: 'Carreras', requiresAuth: true, roles: ['admin'] },
    },
    {
      path: '/reset-dispositivo',
      name: 'ResetDispositivo',
      component: () => import('../views/ResetDispositivo.vue'),
      meta: { title: 'Resetear Dispositivo', requiresAuth: true, roles: ['admin'] },
    },
    {
      path: '/marcados',
      name: 'MarcadosAdmin',
      component: () => import('../views/MarcadosAdmin.vue'),
      meta: { title: 'Validar Marcados', requiresAuth: true, roles: ['admin', 'supervisor'] },
    },
    {
      path: '/usuarios',
      name: 'Usuarios',
      component: () => import('../views/Usuarios.vue'),
      meta: { title: 'Usuarios', requiresAuth: true, roles: ['admin'] },
    },
    {
      path: '/reportes',
      name: 'Reportes',
      component: () => import('../views/Reportes.vue'),
      meta: { title: 'Reporte Mensual', requiresAuth: true, roles: ['admin', 'supervisor'] },
    },
    {
      path: '/monitoreo',
      name: 'Monitoreo',
      component: () => import('../views/MonitoreoSemanal.vue'),
      meta: { title: 'Monitoreo Semanal', requiresAuth: true, roles: ['admin', 'supervisor'] },
    },
    {
      path: '/auditoria',
      name: 'Auditoria',
      component: () => import('../views/Auditoria.vue'),
      meta: { title: 'Auditoría del Sistema', requiresAuth: true, roles: ['admin'] },
    },
    {
      path: '/marcado-manual',
      name: 'MarcadoManual',
      component: () => import('../views/MarcadoManual.vue'),
      meta: { title: 'Marcado Administrativo', requiresAuth: true, permission: 'asistencia.justificar', roles: ['admin', 'supervisor'] },
    },
    {
      path: '/roles-permisos',
      name: 'RolesPermisos',
      component: () => import('../views/RolesPermisos.vue'),
      meta: { title: 'Roles y Permisos', requiresAuth: true, permission: 'sistema.roles', roles: ['admin'] },
    },
  ],
})

// Proteger rutas y autorizar roles
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')
  const user = userRaw ? JSON.parse(userRaw) : null
  const userRol = user?.rol || null

  // Si ya tiene sesión activa e intenta ir a Signin, redirigir al Dashboard
  if (to.path === '/signin' && token) {
    return next('/')
  }

  // Si requiere autenticación y no hay token
  if (to.meta.requiresAuth && !token) {
    return next('/signin')
  }

  // Validación de permisos dinámicos (RBAC) o roles estáticos
  if (to.meta.permission) {
    // Si es admin siempre pasa
    if (userRol !== 'admin') {
      try {
        const rawRoles = localStorage.getItem('sistema_roles_permisos_v1')
        const rolesList = rawRoles ? JSON.parse(rawRoles) : []
        const rolDef = rolesList.find((r: any) => r.id === userRol)
        if (rolDef && !rolDef.permisos.includes(to.meta.permission)) {
          return next('/')
        }
      } catch (e) {
        console.error('Error al evaluar permiso de ruta:', e)
      }
    }
  } else if (to.meta.roles && Array.isArray(to.meta.roles)) {
    if (!userRol || !to.meta.roles.includes(userRol)) {
      // Si no tiene el rol permitido, redirigir al Dashboard principal
      return next('/')
    }
  }

  next()
  document.title = `${to.meta.title || 'Panel'} | Sistema de Asistencia`
})

export default router