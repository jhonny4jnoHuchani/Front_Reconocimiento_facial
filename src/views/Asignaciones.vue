<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Asignaciones" />
    
    <div class="space-y-6">
      <!-- Filtros -->
      <ComponentCard title="Filtros">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-400">Paralelo</label>
            <select v-model="paraleloId" @change="cargar" class="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <option value="">Todos los paralelos</option>
              <option v-for="p in paralelos" :key="p.id" :value="p.id">{{ p.grado }}° "{{ p.paralelo }}"</option>
            </select>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-400">Materia</label>
            <select v-model="materiaId" @change="cargar" class="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <option value="">Todas las materias</option>
              <option v-for="m in materias" :key="m.id" :value="m.id">{{ m.nombre_materia }}</option>
            </select>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-400">Docente</label>
            <select v-model="docenteFilter" @change="cargar" class="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <option value="">Todos los docentes</option>
              <option v-for="d in docentes" :key="d.id" :value="d.id">{{ d.user?.nombre_completo }}</option>
            </select>
          </div>
          <div class="flex items-end gap-2">
            <button @click="abrirModalAsignar" class="h-11 flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
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
                    <button @click="abrirModalDocente(item)" class="text-sm text-blue-600 hover:underline">
                      {{ item.docente ? 'Cambiar' : 'Asignar' }}
                    </button>
                    <button v-if="item.docente" @click="quitarDocente(item.id)" class="text-sm text-orange-600 hover:underline">Quitar</button>
                    <button @click="eliminar(item.id)" class="text-sm text-red-600 hover:underline">Eliminar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <!-- Modal: Asignar materia a paralelo -->
      <div v-if="showModalAsignar" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6">
          <h3 class="text-lg font-semibold mb-4">Asignar Materia a Paralelo</h3>
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
              <button type="button" @click="showModalAsignar = false" class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700">Cancelar</button>
              <button type="submit" :disabled="saving" class="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600">
                {{ saving ? 'Guardando...' : 'Asignar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Asignar docente -->
      <div v-if="showModalDocente" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6">
          <h3 class="text-lg font-semibold mb-4">Asignar Docente</h3>
          <p class="text-sm text-gray-500 mb-4">{{ asignacionSeleccionada?.materia?.nombre_materia }} - {{ asignacionSeleccionada?.paralelo?.grado }}° "{{ asignacionSeleccionada?.paralelo?.paralelo }}"</p>
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
              <button type="button" @click="showModalDocente = false" class="px-4 py-2 text-sm rounded-lg border border-gray-300">Cancelar</button>
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

const quitarDocenteHandler = async (id) => {
  if (!confirm('¿Quitar docente de esta asignación?')) return
  await quitarDocente(id)
  cargar()
}

const eliminar = async (id) => {
  if (!confirm('¿Eliminar esta asignación?')) return
  try {
    await deleteAsignacion(id)
    cargar()
  } catch (e) {
    alert(e.response?.data?.message || 'Error al eliminar')
  }
}

onMounted(() => {
  cargarCatalogos()
  cargar()
})
</script>