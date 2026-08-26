<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Horarios" />

    <div class="flex gap-6 h-[calc(100vh-200px)]">
      <!-- Sidebar izquierdo: Ubicaciones -->
      <div class="w-64 flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
        <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">Ubicaciones</h3>
        <div class="space-y-1">
          <button
            v-for="ubi in ubicaciones"
            :key="ubi.id"
            @click="seleccionarUbicacion(ubi)"
            :class="[
              'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
              ubicacionSeleccionada?.id === ubi.id
                ? 'bg-brand-50 text-brand-600 font-medium dark:bg-brand-900/20 dark:text-brand-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
            ]"
          >
            <div class="flex items-center gap-2">
              <span>📍</span>
              <span>{{ ubi.nombre_lugar }}</span>
            </div>
            <span class="text-xs text-gray-400 ml-6">{{ ubi.tipo }}</span>
          </button>
        </div>
      </div>

      <!-- Panel derecho: Horario semanal -->
      <div class="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 overflow-auto">
        <div v-if="!ubicacionSeleccionada" class="flex items-center justify-center h-full text-gray-400">
          <p>Seleccioná una ubicación para ver su horario</p>
        </div>
        <div v-else class="overflow-x-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">{{ ubicacionSeleccionada?.nombre_lugar }}</h3>
            <!-- Botón "Nuevo Horario": solo visible con ubicación seleccionada (garantizado por v-else) -->
            <button
              type="button"
              @click="abrirModal()"
              class="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 shrink-0"
            >
              + Nuevo Horario
            </button>
          </div>
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th class="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 w-20">Hora</th>
                <th v-for="dia in diasSemana" :key="dia" class="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 capitalize">{{ dia }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="hora in horasGrid" :key="hora">
                <td class="border border-gray-200 dark:border-gray-700 p-2 text-xs text-center text-gray-500">{{ hora }}:00</td>
                <td
                  v-for="dia in diasSemana"
                  :key="dia"
                  @click="abrirModalCelda(dia, hora)"
                  class="group relative border border-gray-200 dark:border-gray-700 p-1 min-w-[130px] h-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <div
                    v-for="h in horariosEnCelda(dia, hora)"
                    :key="h.id"
                    @click.stop="abrirModal(h)"
                    class="rounded p-1.5 mb-0.5 text-xs cursor-pointer transition-colors"
                    :class="h.paralelo_materia?.docente ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300'"
                  >
                    <div class="font-medium truncate">{{ h.paralelo_materia?.materia?.nombre_materia }}</div>
                    <div class="truncate">{{ h.paralelo_materia?.paralelo?.grado }}°"{{ h.paralelo_materia?.paralelo?.paralelo }}"</div>
                  </div>
                  <div
                    v-if="horariosEnCelda(dia, hora).length === 0"
                    class="hidden group-hover:flex items-center justify-center h-full min-h-[28px] text-gray-300 dark:text-gray-600 group-hover:text-brand-500 pointer-events-none"
                  >
                    <span class="text-lg leading-none">+</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal: fuera del panel derecho, no depende de ubicacionSeleccionada -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-lg p-6">
        <h3 class="text-lg font-semibold mb-4">{{ editando ? 'Editar Horario' : 'Nuevo Horario' }}</h3>
        <form @submit.prevent="guardar" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Asignación</label>
            <select v-model="form.paralelo_materia_id" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700">
              <option value="">Seleccionar</option>
              <option v-for="a in asignaciones" :key="a.id" :value="a.id">
                {{ a.materia?.nombre_materia }} - {{ a.paralelo?.grado }}°"{{ a.paralelo?.paralelo }}" - {{ a.docente?.user?.nombre_completo || 'Sin docente' }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1">Día</label>
              <select v-model="form.dia_semana" class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700">
                <option v-for="d in diasSemana" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Hora inicio</label>
              <input v-model="form.hora_inicio" type="time" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Hora fin</label>
              <input v-model="form.hora_fin" type="time" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Tipo</label>
            <select v-model="form.tipo_actividad" class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700">
              <option value="clase">Clase</option>
              <option value="laboratorio">Laboratorio</option>
              <option value="tutoria">Tutoría</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
          <div class="flex justify-end gap-3">
            <button v-if="editando" @click="eliminarHorario" type="button" class="px-4 py-2 text-sm rounded-lg bg-red-100 text-red-700 hover:bg-red-200">Eliminar</button>
            <button type="button" @click="showModal = false" class="px-4 py-2 text-sm rounded-lg border border-gray-300">Cancelar</button>
            <button type="submit" :disabled="saving" class="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600">
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getHorarios, createHorario, updateHorario, deleteHorario, getAsignaciones, getUbicaciones } from '@/api/endpoints'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const horarios = ref<any[]>([])
const asignaciones = ref<any[]>([])
const ubicaciones = ref<any[]>([])
const ubicacionSeleccionada = ref<any>(null)
const showModal = ref(false)
const editando = ref<any>(null)
const saving = ref(false)
const errorMsg = ref('')
const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const form = ref<any>({ paralelo_materia_id: '', dia_semana: 'lunes', hora_inicio: '08:00', hora_fin: '10:00', tipo_actividad: 'clase' })

const horasGrid = Array.from({ length: 14 }, (_, i) => i + 7)

const seleccionarUbicacion = (ubi: any) => {
  ubicacionSeleccionada.value = ubi
}

const horariosEnCelda = (dia: string, hora: number) => {
  return horarios.value.filter((h: any) => {
    if (h.ubicacion_id !== ubicacionSeleccionada.value?.id) return false
    if (h.dia_semana !== dia) return false
    const hInicio = parseInt(h.hora_inicio?.split(':')[0])
    const hFin = parseInt(h.hora_fin?.split(':')[0])
    return hora >= hInicio && hora <= hFin
  })
}

const cargarHorarios = async () => {
  try {
    const { data } = await getHorarios()
    horarios.value = data.data.data
  } catch (e: any) { console.error(e) }
}

const cargarCatalogos = async () => {
  try {
    const [a, u] = await Promise.all([getAsignaciones(), getUbicaciones({ estado: 'activo' })])
    asignaciones.value = a.data.data.data
    ubicaciones.value = u.data.data.data
  } catch (e: any) { console.error(e) }
}

const abrirModal = (item: any = null) => {
  errorMsg.value = ''
  if (item) {
    editando.value = item
    form.value = { paralelo_materia_id: item.paralelo_materia_id, dia_semana: item.dia_semana, hora_inicio: item.hora_inicio, hora_fin: item.hora_fin, tipo_actividad: item.tipo_actividad }
  } else {
    editando.value = null
    form.value = { paralelo_materia_id: '', dia_semana: 'lunes', hora_inicio: '08:00', hora_fin: '10:00', tipo_actividad: 'clase' }
  }
  showModal.value = true
}

const abrirModalCelda = (dia: string, hora: number) => {
  errorMsg.value = ''
  editando.value = null
  form.value = {
    paralelo_materia_id: '',
    dia_semana: dia,
    hora_inicio: `${String(hora).padStart(2, '0')}:00`,
    hora_fin: `${String(hora + 1).padStart(2, '0')}:00`,
    tipo_actividad: 'clase'
  }
  showModal.value = true
}

const guardar = async () => {
  saving.value = true
  try {
    const payload = { ...form.value, ubicacion_id: ubicacionSeleccionada.value.id }
    if (editando.value) await updateHorario(editando.value.id, payload)
    else await createHorario(payload)
    showModal.value = false
    cargarHorarios()
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message || 'Error al guardar'
  } finally { saving.value = false }
}

const eliminarHorario = async () => {
  if (!confirm('¿Eliminar este horario?')) return
  await deleteHorario(editando.value.id)
  showModal.value = false
  cargarHorarios()
}

onMounted(() => { cargarCatalogos(); cargarHorarios() })
</script>