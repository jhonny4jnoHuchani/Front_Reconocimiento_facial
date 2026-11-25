<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Roles y Permisos del Sistema" />

    <div class="space-y-6">
      <!-- Encabezado Informativo -->
      <div class="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-blue-50/70 p-5 dark:border-gray-800 dark:bg-none dark:bg-gray-900 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-start gap-3">
            <div class="rounded-xl bg-indigo-600 p-2.5 text-white shadow-md shadow-indigo-600/20">
              <ShieldCheck :size="24" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                Control de Acceso y Perfiles (RBAC)
              </h2>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-2xl leading-relaxed">
                Define qué acciones y pantallas puede visualizar y operar cada perfil institucional. Si asignas este sistema a un nuevo encargado (ej: Kardex o Decanatura), ajusta sus permisos aquí sin necesidad de reprogramar el sistema.
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="confirmarRestablecer"
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition"
              title="Restablecer roles y permisos predeterminados"
            >
              <RotateCcw :size="14" />
              <span>Predeterminados</span>
            </button>
            <button
              @click="abrirModalNuevoRol"
              class="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition shadow-sm"
            >
              <Plus :size="16" />
              <span>Nuevo Rol</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Selector de Roles (Tarjetas) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="r in roles"
          :key="r.id"
          @click="rolSeleccionadoId = r.id"
          :class="[
            'cursor-pointer rounded-2xl border p-4 transition-all duration-200 relative',
            rolSeleccionadoId === r.id
              ? 'border-brand-500 bg-brand-50/20 ring-2 ring-brand-500/20 dark:bg-brand-900/10 dark:border-brand-500 shadow-sm'
              : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900'
          ]"
        >
          <div class="flex items-center justify-between mb-2">
            <span
              :class="[
                'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                r.id === 'admin'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : r.id === 'supervisor'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
              ]"
            >
              {{ r.isSystem ? 'Sistema' : 'Personalizado' }}
            </span>
            <span class="text-xs font-semibold text-gray-400">
              {{ r.permisos.length }} permisos
            </span>
          </div>

          <h3 class="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
            <span>{{ r.nombre }}</span>
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {{ r.descripcion }}
          </p>

          <div class="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px]">
            <span class="text-gray-400">Rol base: <strong class="text-gray-600 dark:text-gray-300">{{ r.baseRol }}</strong></span>
            <button
              v-if="!r.isSystem"
              @click.stop="confirmarEliminarRol(r)"
              class="text-red-500 hover:text-red-700 p-1 rounded"
              title="Eliminar rol personalizado"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>

      <!-- Editor de Permisos para el Rol Seleccionado -->
      <ComponentCard v-if="rolActualObj" :title="`Configurar Permisos: ${rolActualObj.nombre}`">
        <div class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ rolActualObj.descripcion }}
              </p>
              <p v-if="rolActualObj.id === 'admin'" class="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center gap-1">
                <Lock :size="12" /> El Administrador General cuenta con todos los permisos por defecto para garantizar el soporte del sistema.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-if="rolActualObj.id !== 'admin'"
                @click="seleccionarTodos(true)"
                class="px-2.5 py-1.5 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-lg font-medium transition"
              >
                Marcar Todos
              </button>
              <button
                v-if="rolActualObj.id !== 'admin'"
                @click="seleccionarTodos(false)"
                class="px-2.5 py-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 rounded-lg font-medium transition"
              >
                Desmarcar Todos
              </button>
              <button
                @click="guardarPermisosRol"
                class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold text-xs hover:bg-green-700 transition shadow-sm"
              >
                <Save :size="15" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>

          <!-- Agrupación por Módulos -->
          <div class="space-y-6">
            <div
              v-for="(permisosGrupo, modulo) in permisosAgrupados"
              :key="modulo"
              class="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/20"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                  {{ modulo }}
                </h4>
                <span class="text-xs text-gray-400">
                  {{ contarActivosEnGrupo(permisosGrupo) }} / {{ permisosGrupo.length }} activos
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="p in permisosGrupo"
                  :key="p.id"
                  @click="togglePermiso(p.id)"
                  :class="[
                    'flex items-start gap-3 p-3 rounded-lg border transition cursor-pointer select-none',
                    permisosTemporales.includes(p.id)
                      ? 'bg-white border-brand-200 dark:bg-gray-900 dark:border-brand-500/30 shadow-2xs'
                      : 'bg-white/60 border-gray-200 opacity-60 dark:bg-gray-900/40 dark:border-gray-800'
                  ]"
                >
                  <input
                    type="checkbox"
                    :checked="permisosTemporales.includes(p.id)"
                    :disabled="rolActualObj.id === 'admin'"
                    class="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                  <div class="flex-1">
                    <p class="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {{ p.nombre }}
                    </p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-snug mt-0.5">
                      {{ p.descripcion }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      <!-- Modal para Crear Nuevo Rol Personalizado -->
      <div v-if="showModalNuevo" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl w-full max-w-md p-6 dark:text-gray-200 border border-gray-200 dark:border-gray-800">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus :size="18" class="text-brand-500" />
              Crear Nuevo Perfil / Rol
            </h3>
            <button @click="showModalNuevo = false" class="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <form @submit.prevent="guardarNuevoRol" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Identificador (sin espacios) *
              </label>
              <input
                v-model="formNuevoRol.id"
                type="text"
                required
                placeholder="ej: kardex_asistencia"
                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-white font-mono"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Nombre Visible *
              </label>
              <input
                v-model="formNuevoRol.nombre"
                type="text"
                required
                placeholder="ej: Encargado de Kardex y Asistencia"
                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Descripción
              </label>
              <textarea
                v-model="formNuevoRol.descripcion"
                rows="2"
                placeholder="Propósito o funciones de este rol..."
                class="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Nivel Base en Backend *
              </label>
              <select
                v-model="formNuevoRol.baseRol"
                required
                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="supervisor">Supervisor (Acceso delimitado a su carrera)</option>
                <option value="admin">Administrador (Acceso global)</option>
              </select>
              <p class="text-[10px] text-gray-400 mt-1">
                Define cómo responderá el backend de Laravel ante peticiones de este rol.
              </p>
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                @click="showModalNuevo = false"
                class="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-600"
              >
                Crear Perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import {
  ShieldCheck,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Lock,
} from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { usePermissions } from '@/composables/usePermissions'

const {
  catalogoPermisos,
  roles,
  updateRolePermissions,
  addCustomRole,
  deleteCustomRole,
  resetToDefaults,
} = usePermissions()

const rolSeleccionadoId = ref('supervisor')
const permisosTemporales = ref([])

const rolActualObj = computed(() => {
  return roles.value.find(r => r.id === rolSeleccionadoId.value) || roles.value[0]
})

// Sincronizar permisos temporales al cambiar de rol
watch(
  () => rolSeleccionadoId.value,
  () => {
    if (rolActualObj.value) {
      permisosTemporales.value = [...rolActualObj.value.permisos]
    }
  },
  { immediate: true }
)

// Agrupar catálogo de permisos por módulo
const permisosAgrupados = computed(() => {
  const grupos = {}
  catalogoPermisos.forEach(p => {
    if (!grupos[p.modulo]) {
      grupos[p.modulo] = []
    }
    grupos[p.modulo].push(p)
  })
  return grupos
})

const contarActivosEnGrupo = (grupo) => {
  return grupo.filter(p => permisosTemporales.value.includes(p.id)).length
}

const togglePermiso = (permisoId) => {
  if (rolActualObj.value?.id === 'admin') return // Admin siempre tiene todo

  const idx = permisosTemporales.value.indexOf(permisoId)
  if (idx === -1) {
    permisosTemporales.value.push(permisoId)
  } else {
    permisosTemporales.value.splice(idx, 1)
  }
}

const seleccionarTodos = (marcar) => {
  if (marcar) {
    permisosTemporales.value = catalogoPermisos.map(p => p.id)
  } else {
    permisosTemporales.value = []
  }
}

const guardarPermisosRol = () => {
  if (!rolActualObj.value) return
  updateRolePermissions(rolActualObj.value.id, permisosTemporales.value)
  Swal.fire({
    icon: 'success',
    title: 'Permisos Actualizados',
    text: `Los permisos para "${rolActualObj.value.nombre}" se guardaron correctamente.`,
    confirmButtonColor: '#4f46e5',
    timer: 2000,
  })
}

// Modal nuevo rol
const showModalNuevo = ref(false)
const formNuevoRol = ref({
  id: '',
  nombre: '',
  descripcion: '',
  baseRol: 'supervisor',
})

const abrirModalNuevoRol = () => {
  formNuevoRol.value = {
    id: '',
    nombre: '',
    descripcion: '',
    baseRol: 'supervisor',
  }
  showModalNuevo.value = true
}

const guardarNuevoRol = () => {
  const idLimpio = formNuevoRol.value.id.trim().toLowerCase().replace(/\s+/g, '_')
  if (!idLimpio) return

  // Verificar si ya existe
  if (roles.value.some(r => r.id === idLimpio)) {
    Swal.fire({
      icon: 'error',
      title: 'Identificador Duplicado',
      text: 'Ya existe un rol con ese identificador. Elige otro.',
    })
    return
  }

  // Copiar permisos por defecto de supervisor
  const permisosIniciales = catalogoPermisos
    .filter(p => p.modulo !== 'Sistema y Seguridad')
    .map(p => p.id)

  addCustomRole({
    id: idLimpio,
    nombre: formNuevoRol.value.nombre.trim(),
    descripcion: formNuevoRol.value.descripcion.trim() || 'Rol personalizado del sistema',
    baseRol: formNuevoRol.value.baseRol,
    permisos: permisosIniciales,
  })

  showModalNuevo.value = false
  rolSeleccionadoId.value = idLimpio

  Swal.fire({
    icon: 'success',
    title: 'Rol Creado',
    text: `El rol "${formNuevoRol.value.nombre}" ha sido creado. Ahora puedes personalizar sus permisos.`,
    confirmButtonColor: '#4f46e5',
  })
}

const confirmarEliminarRol = (rol) => {
  Swal.fire({
    title: `¿Eliminar rol "${rol.nombre}"?`,
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((res) => {
    if (res.isConfirmed) {
      deleteCustomRole(rol.id)
      rolSeleccionadoId.value = 'supervisor'
      Swal.fire({
        icon: 'success',
        title: 'Rol eliminado',
        timer: 1500,
      })
    }
  })
}

const confirmarRestablecer = () => {
  Swal.fire({
    title: '¿Restablecer a valores de fábrica?',
    text: 'Se restaurarán los roles y permisos predeterminados del sistema.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, restablecer',
    cancelButtonText: 'Cancelar',
  }).then((res) => {
    if (res.isConfirmed) {
      resetToDefaults()
      rolSeleccionadoId.value = 'supervisor'
      Swal.fire({
        icon: 'success',
        title: 'Roles Restablecidos',
        timer: 1500,
      })
    }
  })
}
</script>
