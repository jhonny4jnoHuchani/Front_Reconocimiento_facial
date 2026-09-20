<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Usuarios" />

    <div class="space-y-6">
      <!-- Filtros -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3 flex-wrap">
          <input
            v-model="buscar"
            @input="cargar"
            type="text"
            placeholder="Buscar por nombre, CI o email..."
            class="h-11 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 transition-colors hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <select
            v-model="rol"
            @change="cargar"
            class="h-11 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">Todos los roles</option>
            <option value="admin">Admins</option>
            <option value="supervisor">Supervisores</option>
          </select>
          <select
            v-model="estado"
            @change="cargar"
            class="h-11 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
        <button
          @click="abrirModal()"
          class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          <UserPlus :size="18" />
          Nuevo Usuario
        </button>
      </div>

      <!-- Tabla -->
      <ComponentCard title="Lista de Usuarios">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700 dark:text-gray-400">
            <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3">Nombre</th>
                <th class="px-4 py-3">Email</th>
                <th class="px-4 py-3">CI</th>
                <th class="px-4 py-3">Rol</th>
                <th class="px-4 py-3">Carrera</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="7" class="px-4 py-4 text-center">Cargando...</td>
              </tr>
              <tr v-else-if="items.length === 0">
                <td colspan="7" class="px-4 py-4 text-center">No se encontraron usuarios</td>
              </tr>
              <tr v-for="item in items" :key="item.id" class="border-t border-gray-100 dark:border-gray-800">
                <td class="px-4 py-3">{{ item.nombre_completo }}</td>
                <td class="px-4 py-3">{{ item.email }}</td>
                <td class="px-4 py-3">{{ item.ci }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                    :class="{
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400': item.rol === 'admin',
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': item.rol === 'supervisor'
                    }"
                  >
                    {{ item.rol }}
                  </span>
                </td>
                <td class="px-4 py-3">{{ item.carrera?.nombre || '—' }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                    :class="{
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': item.estado === 'activo',
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': item.estado !== 'activo'
                    }"
                  >
                    {{ item.estado }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2 flex-wrap">
                    <button
                      @click="abrirModal(item)"
                      class="p-2 text-blue-600 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 rounded-lg transition flex items-center gap-1.5"
                    >
                      <Pencil :size="18" />
                      <span>Editar</span>
                    </button>
                    <button
                      @click="resetPassword(item)"
                      class="p-2 text-yellow-600 border-b-2 border-transparent hover:border-yellow-600 dark:hover:border-yellow-400 rounded-lg transition flex items-center gap-1.5"
                    >
                      <KeyRound :size="18" />
                      <span>Reset password</span>
                    </button>
                    <button
                      v-if="item.estado === 'activo'"
                      @click="desactivar(item.id)"
                      class="p-2 text-red-600 border-b-2 border-transparent hover:border-red-600 dark:hover:border-red-400 rounded-lg transition flex items-center gap-1.5"
                    >
                      <Ban :size="18" />
                      <span>Desactivar</span>
                    </button>
                    <button
                      v-else
                      @click="reactivar(item.id)"
                      class="p-2 text-green-600 border-b-2 border-transparent hover:border-green-600 dark:hover:border-green-400 rounded-lg transition flex items-center gap-1.5"
                    >
                      <RotateCcw :size="18" />
                      <span>Reactivar</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <!-- Modal Crear/Editar -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
        <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-lg w-full max-w-lg p-6 dark:text-gray-300 border border-gray-200 dark:border-gray-800 my-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ editando ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h3>
          <form @submit.prevent="guardar" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombre completo</label>
              <input
                v-model="form.nombre_completo"
                type="text"
                required
                class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">CI</label>
              <input
                v-model="form.ci"
                type="text"
                required
                class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div v-if="!editando">
              <label class="block text-sm font-medium mb-1">Contraseña</label>
              <input
                v-model="form.password"
                type="password"
                required
                minlength="8"
                class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div v-if="!editando">
              <label class="block text-sm font-medium mb-1">Rol</label>
              <select
                v-model="form.rol"
                required
                class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="admin">Admin</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            <div v-if="!editando && form.rol === 'supervisor' || editando && editando.rol === 'supervisor'">
              <label class="block text-sm font-medium mb-1">Carrera (obligatoria para supervisor)</label>
              <select
                v-model="form.carrera_id"
                :required="(!editando && form.rol === 'supervisor') || (editando && editando.rol === 'supervisor')"
                class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700"
              >
                <option :value="null">Seleccione una carrera</option>
                <option v-for="c in carreras" :key="c.id" :value="c.id">{{ c.nombre }}</option>
              </select>
            </div>

            <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>

            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="showModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {{ saving ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { Pencil, Ban, RotateCcw, UserPlus, KeyRound } from 'lucide-vue-next'
import {
  getUsuarios, createUsuario, updateUsuario,
  deleteUsuario, reactivarUsuario, resetPasswordUsuario, getCarreras
} from '@/api/endpoints'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const items = ref([])
const carreras = ref([])
const buscar = ref('')
const rol = ref('')
const estado = ref('activo')
const loading = ref(false)
const showModal = ref(false)
const editando = ref(null)
const saving = ref(false)
const errorMsg = ref('')

const form = ref({
  nombre_completo: '',
  email: '',
  ci: '',
  password: '',
  rol: 'admin',
  carrera_id: null,
})

const cargar = async () => {
  loading.value = true
  try {
    const { data } = await getUsuarios({
      buscar: buscar.value || undefined,
      rol: rol.value || undefined,
      estado: estado.value,
    })
    items.value = data.data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const cargarCarreras = async () => {
  try {
    const { data } = await getCarreras({ estado: 'activo' })
    carreras.value = data.data.data
  } catch (e) {
    console.error('Error cargando carreras', e)
  }
}

const abrirModal = (item = null) => {
  errorMsg.value = ''
  if (item) {
    editando.value = item
    form.value = {
      nombre_completo: item.nombre_completo || '',
      email: item.email || '',
      ci: item.ci || '',
      password: '',
      rol: item.rol || 'admin',
      carrera_id: item.carrera_id || null,
    }
  } else {
    editando.value = null
    form.value = {
      nombre_completo: '',
      email: '',
      ci: '',
      password: '',
      rol: 'admin',
      carrera_id: null,
    }
  }
  showModal.value = true
}

const guardar = async () => {
  saving.value = true
  errorMsg.value = ''
  try {
    if (editando.value) {
      const payload = {
        nombre_completo: form.value.nombre_completo,
        email: form.value.email,
        ci: form.value.ci,
      }
      if (editando.value.rol === 'supervisor') {
        payload.carrera_id = form.value.carrera_id
      }
      await updateUsuario(editando.value.id, payload)
    } else {
      await createUsuario(form.value)
    }
    showModal.value = false
    cargar()
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Error al guardar'
  } finally {
    saving.value = false
  }
}

const resetPassword = async (item) => {
  const isDark = document.documentElement.classList.contains('dark')
  const result = await Swal.fire({
    title: '¿Resetear contraseña?',
    html: `Se generará una contraseña nueva para <b>${item.nombre_completo}</b>.<br/>Se cerrarán todas sus sesiones activas.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, resetear',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',
    buttonsStyling: false,
    customClass: {
      popup: 'font-sans rounded-[3rem] border border-yellow-500/20 dark:border-slate-700/60 p-8 shadow-2xl',
      title: 'text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100',
      htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-2',
      confirmButton: 'px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-sm ml-3 tracking-wide',
      cancelButton: 'px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-600 font-bold text-sm tracking-wide',
    },
  })

  if (result.isConfirmed) {
    try {
      const { data } = await resetPasswordUsuario(item.id)

      await Swal.fire({
        title: 'Contraseña generada',
        html: `
          <p class="mb-3">Nueva contraseña para <b>${item.nombre_completo}</b>:</p>
          <div style="background:#f3f4f6;padding:12px;border-radius:8px;font-family:monospace;font-size:1.2rem;font-weight:bold;">
            ${data.password}
          </div>
          <p class="mt-3 text-xs text-gray-500">Copiala y compartila con el usuario.</p>
        `,
        icon: 'success',
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#f8fafc' : '#1e293b',
        confirmButtonText: 'Copiar',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        confirmButtonColor: '#10b981',
      }).then((res) => {
        if (res.isConfirmed) {
          navigator.clipboard.writeText(data.password)
          Swal.fire({
            title: 'Copiada',
            text: 'La contraseña fue copiada al portapapeles.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#f8fafc' : '#1e293b',
          })
        }
      })

      cargar()
    } catch (e) {
      Swal.fire({
        title: 'Error',
        text: e.response?.data?.message || 'No se pudo resetear.',
        icon: 'error',
      })
    }
  }
}

const desactivar = async (id) => {
  const isDark = document.documentElement.classList.contains('dark')
  const result = await Swal.fire({
    title: '¿Desactivar usuario?',
    text: 'Esta acción desactivará al usuario seleccionado.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',
  })

  if (result.isConfirmed) {
    try {
      await deleteUsuario(id)
      cargar()
      Swal.fire({
        title: '¡Desactivado!',
        text: 'El usuario ha sido desactivado.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#f8fafc' : '#1e293b',
      })
    } catch (e) {
      Swal.fire({
        title: 'Error',
        text: e.response?.data?.message || 'No se pudo desactivar.',
        icon: 'error',
      })
    }
  }
}

const reactivar = async (id) => {
  const isDark = document.documentElement.classList.contains('dark')
  const result = await Swal.fire({
    title: '¿Reactivar usuario?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, reactivar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',
  })

  if (result.isConfirmed) {
    try {
      await reactivarUsuario(id)
      cargar()
      Swal.fire({
        title: 'Reactivado',
        text: 'El usuario ha sido reactivado.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#f8fafc' : '#1e293b',
      })
    } catch (e) {
      Swal.fire({
        title: 'Error',
        text: e.response?.data?.message || 'No se pudo reactivar.',
        icon: 'error',
      })
    }
  }
}

onMounted(() => {
  cargar()
  cargarCarreras()
})
</script>