<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Docentes" />
    
    <div class="space-y-6">
      <!-- Filtros y botón -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <input
            v-model="buscar"
            @input="cargarDocentes"
            type="text"
            placeholder="Buscar por nombre, CI o email..."
            class="h-11 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 transition-colors hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:border-gray-600 dark:focus:border-brand-400 dark:focus:ring-brand-400/20"
          />
          <select
            v-model="estado"
            @change="cargarDocentes"
            class="h-11 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 transition-colors hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:border-gray-600 dark:focus:border-brand-400 dark:focus:ring-brand-400/20"
          >
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
        <button
          @click="abrirModal()"
          class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          + Nuevo Docente
        </button>
      </div>

      <!-- Tabla -->
      <ComponentCard title="Lista de Docentes">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700 dark:text-gray-400">
            <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3">Nombre</th>
                <th class="px-4 py-3">Email</th>
                <th class="px-4 py-3">CI</th>
                <th class="px-4 py-3">Departamento</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="px-4 py-4 text-center">Cargando...</td>
              </tr>
              <tr v-else-if="docentes.length === 0">
                <td colspan="6" class="px-4 py-4 text-center">No se encontraron docentes</td>
              </tr>
              <tr v-for="docente in docentes" :key="docente.id" class="border-t border-gray-100 dark:border-gray-800">
                <td class="px-4 py-3">{{ docente.user?.nombre_completo }}</td>
                <td class="px-4 py-3">{{ docente.user?.email }}</td>
                <td class="px-4 py-3">{{ docente.user?.ci }}</td>
                <td class="px-4 py-3">{{ docente.departamento }}</td>
                <td class="px-4 py-3">
                  <span
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                      :class="{
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                          docente.estado === 'activo',
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400':
                          docente.estado !== 'activo'
                      }"
                    >
                      {{ docente.estado }}
                    </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                       <button
                      @click="abrirModal(docente)"
                      class="p-2 text-blue-600 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 rounded-lg transition flex items-center justify-between gap-1.5"
                      title="Editar"
                    >
                      <Pencil :size="18" />
                      <span>Editar</span>
                    </button>
                    <button
                      v-if="docente.estado === 'activo'"
                      @click="desactivar(docente.id)"
                      class="p-2 text-red-600 border-b-2 border-transparent hover:border-red-600 dark:hover:border-red-400 rounded-lg transition flex items-center justify-between gap-1.5"
                      title="Desactivar"
                    >
                      <Ban :size="18" />
                      <span>Desactivar</span>
                    </button>

                    <button
                      v-else
                      @click="reactivar(docente.id)"
                      class="p-2 text-green-600 border-b-2 border-transparent hover:border-green-600 dark:hover:border-green-400 rounded-lg transition flex items-center justify-between gap-1.5"
                      title="Reactivar"
                    >
                      <RotateCcw :size="18" />
                      <span>Activar</span>
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white dark:bg-gray-900 rounded-4xl shadow-lg w-full max-w-lg p-6 dark:text-gray-300 border border-gray-300">
          <h3 class="text-lg font-semibold mb-4">{{ editando ? 'Editar Docente' : '👨‍⚕️Nuevo Docente' }}</h3>
          <form @submit.prevent="guardar" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombre completo</label>
              <input v-model="form.nombre_completo" type="text" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input v-model="form.email" type="email" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">CI</label>
              <input v-model="form.ci" type="text" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Departamento</label>
              <input v-model="form.departamento" type="text" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div v-if="!editando">
              <label class="block text-sm font-medium mb-1">Contraseña</label>
              <input v-model="form.password" type="password" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
            <div class="flex justify-end gap-3">
              <button type="button" @click="showModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors focus:outline-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">Cancelar</button>
              <button type="submit" :disabled="saving" class="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600">
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
// -----
//sweet alert
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
// -----------
import { Pencil, Ban, RotateCcw } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { getDocentes, createDocente, updateDocente, deleteDocente, reactivarDocente } from '@/api/endpoints'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const docentes = ref([])
const buscar = ref('')
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
  departamento: '',
  password: ''
})

const cargarDocentes = async () => {
  loading.value = true
  try {
    const { data } = await getDocentes({ estado: estado.value, buscar: buscar.value })
    docentes.value = data.data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const abrirModal = (docente = null) => {
  errorMsg.value = ''
  if (docente) {
    editando.value = docente
    form.value = {
      nombre_completo: docente.user?.nombre_completo || '',
      email: docente.user?.email || '',
      ci: docente.user?.ci || '',
      departamento: docente.departamento || '',
      password: ''
    }
  } else {
    editando.value = null
    form.value = { nombre_completo: '', email: '', ci: '', departamento: '', password: '' }
  }
  showModal.value = true
}

const guardar = async () => {
  saving.value = true
  errorMsg.value = ''
  try {
    if (editando.value) {
      await updateDocente(editando.value.id, {
        nombre_completo: form.value.nombre_completo,
        email: form.value.email,
        ci: form.value.ci,
        departamento: form.value.departamento
      })
    } else {
      await createDocente(form.value)
    }
    showModal.value = false
    cargarDocentes()
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Error al guardar'
  } finally {
    saving.value = false
  }
}


onMounted(cargarDocentes)

const desactivar = async (id) => {
  const isDark = document.documentElement.classList.contains('dark')
 const result = await Swal.fire({
    title: '¿Desactivar docente?',
    text: 'Esta acción desactivará al docente seleccionada.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',

    showClass: {
      popup: 'animate__animated animate__fadeInUp animate__faster',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutDown animate__faster',
    },
    customClass: {
      popup:
        'font-sans rounded-[3rem] border border-rose-500/20 dark:border-slate-700/60 p-8 shadow-2xl shadow-rose-500/5 backdrop-blur-xl',
      title: 'text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100',
      htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-2',
      confirmButton:
        'px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-rose-500/25 focus:ring-4 focus:ring-rose-500/20 focus:outline-none ml-3 tracking-wide',
      cancelButton:
        'px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 active:scale-95 text-slate-600 font-bold text-sm transition-all duration-200 border border-slate-200/60 dark:border-slate-700/60 focus:outline-none tracking-wide',
      icon: 'border-0 scale-90 -mb-1',
    },
    buttonsStyling: false,
  })

  if (result.isConfirmed) {
    await deleteDocente(id)
    cargarDocentes()

        Swal.fire({
        title: 'Desactivada!',
        text: 'El docente ha sido desactivada con éxito.',
        icon: 'success',
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#f8fafc' : '#1e293b',
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster',
        },
        customClass: {
          popup:
            'font-sans rounded-[2.5rem] border border-emerald-500/20 dark:border-slate-700/60 p-6 shadow-2xl shadow-emerald-500/5',
          title: 'text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight',
          htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-1',
        },
      })
  }
}
const reactivar = async (id) => {
  const isDark = document.documentElement.classList.contains('dark')
 const result = await Swal.fire({
    title: '¿Reactivar este docente?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',

    showClass: {
      popup: 'animate__animated animate__fadeInUp animate__faster',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutDown animate__faster',
    },
    customClass: {
      popup:
        'font-sans rounded-[3rem] border border-rose-500/20 dark:border-slate-700/60 p-8 shadow-2xl shadow-rose-500/5 backdrop-blur-xl',
      title: 'text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100',
      htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-2',
      confirmButton:
        'px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-rose-500/25 focus:ring-4 focus:ring-rose-500/20 focus:outline-none ml-3 tracking-wide',
      cancelButton:
        'px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 active:scale-95 text-slate-600 font-bold text-sm transition-all duration-200 border border-slate-200/60 dark:border-slate-700/60 focus:outline-none tracking-wide',
      icon: 'border-0 scale-90 -mb-1',
    },
    buttonsStyling: false,
  })


  if (result.isConfirmed) {
    await reactivarDocente(id) 
    cargarDocentes()

    Swal.fire({
        title: 'Reactivado',
      text: 'El docente ha sido reactivado exitosamente.',
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#f9fafb' : '#1f2937',
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster',
        },
        customClass: {
          popup:
            'font-sans rounded-[2.5rem] border border-emerald-500/20 dark:border-slate-700/60 p-6 shadow-2xl shadow-emerald-500/5',
          title: 'text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight',
          htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-1',
        },
      })
  }
}







</script>