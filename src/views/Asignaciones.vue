<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Asignaciones" />
    
    <div class="space-y-6">
      <!-- Filtros -->
      <ComponentCard title="Filtros">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px] relative">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-400">Paralelo</label>
            <div class="relative">
              <select 
                v-model="paraleloId" 
                @change="cargar" 
                class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Todos los paralelos</option>
                <option v-for="p in paralelos" :key="p.id" :value="p.id">{{ p.grado }}° "{{ p.paralelo }}"</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div class="flex-1 min-w-[200px] relative">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-400">Materia</label>
            <div class="relative">
              <select 
                v-model="materiaId" 
                @change="cargar" 
                class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Todas las materias</option>
                <option v-for="m in materias" :key="m.id" :value="m.id">{{m.nombre_materia}}</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div class="flex-1 min-w-[200px] relative">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-400">Docente</label>
            <div class="relative">
              <select 
                v-model="docenteFilter" 
                @change="cargar" 
                class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Todos los docentes</option>
                <option v-for="d in docentes" :key="d.id" :value="d.id">{{d.user?.nombre_completo}}</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div class="flex items-end gap-2">
            <button @click="abrirModalAsignar" class="mt-5.5 h-11 flex items-center gap-2 rounded-lg bg-brand-500 px-4  text-sm font-medium text-white hover:bg-brand-600">
              + Nueva Asignación
            </button>
          </div>
        </div>
      </ComponentCard>

      <!-- Tabla -->
      <ComponentCard title="Lista de Asignaciones">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700 dark:text-gray-400">
            <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3">Materia</th>
                <th class="px-4 py-3">Código</th>
                <th class="px-4 py-3">Paralelo</th>
                <th class="px-4 py-3">Docente Asignado</th>
                <th class="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading"><td colspan="5" class="px-4 py-4 text-center">Cargando...</td></tr>
              <tr v-else-if="items.length === 0"><td colspan="5" class="px-4 py-4 text-center text-gray-500">No hay asignaciones</td></tr>
              <tr v-for="item in items" :key="item.id" class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-4 py-3 font-medium">{{ item.materia?.nombre_materia }}</td>
                <td class="px-4 py-3 text-gray-500">{{ item.materia?.codigo }}</td>
                <td class="px-4 py-3">{{ item.paralelo?.grado }}° "{{ item.paralelo?.paralelo }}"</td>
                <td class="px-4 py-3">
                  <span v-if="item.docente" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {{ item.docente.user?.nombre_completo }}
                  </span>
                  <span v-else class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Sin asignar
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                       <button
                          @click="abrirModalDocente(item)"
                          class="p-2 text-blue-600 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 rounded-lg transition flex items-center justify-between gap-2 "
                          title="Cambiar"
                        >
                          <Pencil :size="18" />
                          <span>{{ item.docente ? 'Cambiar' : 'Asignar' }}</span>
                        </button>
                         <button
                         v-if="item.docente"
                          @click="quitarDocenteHandler(item.id)"
                          class="p-2 text-orange-600 dark:text-orange-400 border-b-2 border-transparent hover:border-orange-600 dark:hover:border-orange-400 rounded-lg transition flex items-center justify-between gap-2" title="Quitar"
                        >
                          <CopyX :size="18" />
                          <span>Quitar</span>
                        </button>
                        <button
                          @click="eliminar(item.id)"
                          class="p-2 text-red-600 border-b-2 border-transparent hover:border-red-600 dark:hover:border-red-400 rounded-lg transition flex items-center justify-between gap-2"
                          title="Eliminar"
                        >
                          <Ban :size="18" />
                          <span>Eliminar</span>
                        </button>
                    </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <!-- Modal: Asignar materia a paralelo -->
      <div v-if="showModalAsignar" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-lg w-full max-w-md p-6 border dark:text-gray-300  ">
          <h3 class="text-lg font-semibold mb-4"> 📚 Asignar Materia a Paralelo</h3>
          <form @submit.prevent="guardarAsignacion" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Materia</label>
              <select v-model="nuevaAsignacion.materia_id" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700">
                <option value="">Seleccionar materia</option>
                <option v-for="m in materias" :key="m.id" :value="m.id">{{ m.nombre_materia }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Paralelo</label>
              <select v-model="nuevaAsignacion.paralelo_id" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700">
                <option value="">Seleccionar paralelo</option>
                <option v-for="p in paralelos" :key="p.id" :value="p.id">{{ p.grado }}° "{{ p.paralelo }}"</option>
              </select>
            </div>
            <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
            <div class="flex justify-end gap-3">
              <button type="button" @click="showModalAsignar = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors focus:outline-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">Cancelar</button>
              <button type="submit" :disabled="saving" class="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600">
                {{ saving ? 'Guardando...' : 'Asignar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Asignar docente -->
      <div v-if="showModalDocente" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6 border dark:text-gray-300">
          <h3 class="text-lg font-semibold mb-4">Asignar Docente</h3>
          <p class="text-sm text-purple-700 dark:text-green-300 mb-4">{{ asignacionSeleccionada?.materia?.nombre_materia }} - {{ asignacionSeleccionada?.paralelo?.grado }}° "{{ asignacionSeleccionada?.paralelo?.paralelo }}"</p>
          <form @submit.prevent="guardarDocente" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Docente</label>
              <select v-model="docenteSeleccionado" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700">
                <option value="">Seleccionar docente</option>
                <option v-for="d in docentesActivos" :key="d.id" :value="d.id">{{ d.user?.nombre_completo }} ({{ d.departamento }})</option>
              </select>
            </div>
            <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
            <div class="flex justify-end gap-3">
              <button type="button" @click="showModalDocente = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors focus:outline-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">Cancelar</button>
              <button type="submit" :disabled="saving" class="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600">
                {{ saving ? 'Guardando...' : 'Asignar Docente' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { Pencil, Ban ,CopyX } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { ref, onMounted, computed } from 'vue'
import { getAsignaciones, createAsignacion, asignarDocente, quitarDocente, deleteAsignacion } from '@/api/endpoints'
import { getDocentes } from '@/api/endpoints'
import { getMaterias } from '@/api/endpoints'
import { getParalelos } from '@/api/endpoints'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const items = ref([])
const paralelos = ref([])
const materias = ref([])
const docentes = ref([])
const paraleloId = ref('')
const materiaId = ref('')
const docenteFilter = ref('')
const loading = ref(false)
const saving = ref(false)
const errorMsg = ref('')
const showModalAsignar = ref(false)
const showModalDocente = ref(false)
const asignacionSeleccionada = ref(null)
const docenteSeleccionado = ref('')
const nuevaAsignacion = ref({ materia_id: '', paralelo_id: '' })

const docentesActivos = computed(() => docentes.value.filter(d => d.estado === 'activo'))

const cargar = async () => {
  loading.value = true
  try {
    const { data } = await getAsignaciones({
      paralelo_id: paraleloId.value || undefined,
      materia_id: materiaId.value || undefined,
      docente_id: docenteFilter.value || undefined
    })
    items.value = data.data.data
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const cargarCatalogos = async () => {
  try {
    const [p, m, d] = await Promise.all([
      getParalelos({ estado: 'activo' }),
      getMaterias({ estado: 'activo' }),
      getDocentes({ estado: 'activo' })
    ])
    paralelos.value = p.data.data.data
    materias.value = m.data.data.data
    docentes.value = d.data.data.data
  } catch (e) { console.error(e) }
}

const abrirModalAsignar = () => {
  errorMsg.value = ''
  nuevaAsignacion.value = { materia_id: '', paralelo_id: '' }
  showModalAsignar.value = true
}

const guardarAsignacion = async () => {
  saving.value = true
  try {
    await createAsignacion(nuevaAsignacion.value)
    showModalAsignar.value = false
    cargar()
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Error al asignar'
  } finally { saving.value = false }
}

const abrirModalDocente = (item) => {
  errorMsg.value = ''
  asignacionSeleccionada.value = item
  docenteSeleccionado.value = item.docente?.id || ''
  showModalDocente.value = true
}

const guardarDocente = async () => {
  saving.value = true
  try {
    await asignarDocente(asignacionSeleccionada.value.id, docenteSeleccionado.value)
    showModalDocente.value = false
    cargar()
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Error al asignar docente'
  } finally { saving.value = false }
}


// Eliminar
const eliminar = async (id) => {
  const isDark = document.documentElement.classList.contains('dark')
  const result = await Swal.fire({
    title: '¿Eliminar asignación?',
    text: 'Esta acción desactivará la asignación seleccionada.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,  
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',

    showClass: {
      popup: 'animate__animated animate__fadeInUp animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutDown animate__faster'
    },
    customClass: {     
      popup: 'font-sans rounded-[3rem] border border-rose-500/20 dark:border-slate-700/60 p-8 shadow-2xl shadow-rose-500/5 backdrop-blur-xl',      
      title: 'text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100',
      htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-2',     
      confirmButton: 'px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-rose-500/25 focus:ring-4 focus:ring-rose-500/20 focus:outline-none ml-3 tracking-wide',
      cancelButton: 'px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 active:scale-95 text-slate-600 font-bold text-sm transition-all duration-200 border border-slate-200/60 dark:border-slate-700/60 focus:outline-none tracking-wide',
      icon: 'border-0 scale-90 -mb-1'
    },
    buttonsStyling: false
  })

  if (result.isConfirmed) {
    try {
      await deleteAsignacion(id)
      await cargar()

      Swal.fire({
        title: '¡Eliminado!',
        text: 'La asignación ha sido desactivada con éxito.',
        icon: 'success',
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#f8fafc' : '#1e293b',
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        },
        customClass: {
          popup: 'font-sans rounded-[2.5rem] border border-emerald-500/20 dark:border-slate-700/60 p-6 shadow-2xl shadow-emerald-500/5',
          title: 'text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight',
          htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-1'
        }
      })
    } catch (error) {
      console.error('Error al eliminar asignación:', error)
    }
  }
}
const quitarDocenteHandler = async (id) => {
  const isDark = document.documentElement.classList.contains('dark')
  const result = await Swal.fire({
    title: '¿Desea quitar la Asignacion?',
    text: 'Esta acción desactivará la asignación seleccionada.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, Quitar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,  
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',

    showClass: {
      popup: 'animate__animated animate__fadeInUp animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutDown animate__faster'
    },
    customClass: {     
      popup: 'font-sans rounded-[3rem] border border-rose-500/20 dark:border-slate-700/60 p-8 shadow-2xl shadow-rose-500/5 backdrop-blur-xl',      
      title: 'text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100',
      htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-2',     
      confirmButton: 'px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-rose-500/25 focus:ring-4 focus:ring-rose-500/20 focus:outline-none ml-3 tracking-wide',
      cancelButton: 'px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 active:scale-95 text-slate-600 font-bold text-sm transition-all duration-200 border border-slate-200/60 dark:border-slate-700/60 focus:outline-none tracking-wide',
      icon: 'border-0 scale-90 -mb-1'
    },
    buttonsStyling: false
  })

  if (result.isConfirmed) {
    try {
      await quitarDocente(id)
      await cargar()

      Swal.fire({
        title: 'Sin Asignacion',
        text: 'Asignacion eliminada con exito',
        icon: 'success',
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#f8fafc' : '#1e293b',
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        },
        customClass: {
          popup: 'font-sans rounded-[2.5rem] border border-emerald-500/20 dark:border-slate-700/60 p-6 shadow-2xl shadow-emerald-500/5',
          title: 'text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight',
          htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-1'
        }
      })
    } catch (error) {
      console.error('Error al eliminar asignación:', error)
    }
  }
}
//Quitar






onMounted(() => {
  cargarCatalogos()
  cargar()
})
</script>