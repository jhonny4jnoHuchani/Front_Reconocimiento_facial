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
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Ecommerce.vue'),
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
  ],
})

// Proteger rutas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/signin')
  } else {
    next()
  }
  document.title = `${to.meta.title} | Sistema de Asistencia`
})

export default router