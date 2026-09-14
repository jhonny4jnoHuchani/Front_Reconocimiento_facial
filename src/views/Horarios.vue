<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Horarios" />

    <div class="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-200px)]">
      <!-- VISTA MÓVIL: Selector desplegable de Ubicación -->
      <div class="block lg:hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
          Seleccionar Ubicación
        </label>
        <select
          :value="ubicacionSeleccionada?.id"
          @change="onUbicacionSelectMobile"
          class="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="" disabled>-- Elige una ubicación --</option>
          <option v-for="ubi in ubicaciones" :key="ubi.id" :value="ubi.id">
            📍 {{ ubi.nombre_lugar }} ({{ ubi.tipo }})
          </option>
        </select>
      </div>

      <!-- VISTA ESCRITORIO: Sidebar izquierdo de Ubicaciones -->
      <div
        class="hidden lg:block w-64 flex-shrink-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 overflow-y-auto shadow-sm"
      >
        <h3 class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">
          Ubicaciones
        </h3>
        <div class="space-y-1">
          <button
            v-for="ubi in ubicaciones"
            :key="ubi.id"
            @click="seleccionarUbicacion(ubi)"
            :class="[
              'w-full text-left px-3 py-2 rounded-2xl text-sm transition-all duration-200 border',
              ubicacionSeleccionada?.id === ubi.id
                ? 'bg-rose-50 text-rose-600 font-semibold border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50 border-transparent'
            ]"
          >
            <div class="flex items-center gap-2">
              <span>📍</span>
              <span>{{ ubi.nombre_lugar }}</span>
            </div>
            <span class="text-xs text-slate-400 dark:text-slate-500 ml-6">{{ ubi.tipo }}</span>
          </button>
        </div>
      </div>

      <!-- Panel derecho: Horario semanal -->
      <div
        class="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 overflow-auto shadow-sm flex flex-col"
      >
        <div
          v-if="!ubicacionSeleccionada"
          class="flex items-center justify-center min-h-[250px] lg:h-full text-slate-400 dark:text-slate-500 text-center"
        >
          <p>Seleccioná una ubicación para ver su horario</p>
        </div>

        <div v-else class="space-y-4">
          <!-- Encabezado del Panel -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
              {{ ubicacionSeleccionada?.nombre_lugar }}
            </h3>
            <button
              type="button"
              @click="abrirModal()"
              class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all"
            >
              + Nuevo Horario
            </button>
          </div>

          <!-- VISTA MÓVIL: Pestañas de días y lista vertical de eventos -->
          <div class="block lg:hidden space-y-4">
            <!-- Tabs horizontales con scroll -->
            <div class="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
              <button
                v-for="dia in diasSemana"
                :key="'tab-' + dia"
                @click="diaSeleccionadoMobile = dia"
                :class="[
                  'px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all',
                  diaSeleccionadoMobile === dia
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                ]"
              >
                {{ dia }}
              </button>
            </div>

            <!-- Lista de bloques del día seleccionado en Móvil -->
            <div class="space-y-2">
              <div 
                v-if="horariosEnDiaMobile(diaSeleccionadoMobile).length === 0" 
                class="py-8 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl"
              >
                No hay clases registradas este día
              </div>
              <div
                v-for="h in horariosEnDiaMobile(diaSeleccionadoMobile)"
                :key="'mob-' + h.id"
                @click="abrirModal(h)"
                class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between"
                :class="
                  h.paralelo_materia?.docente
                    ? 'bg-blue-50/70 border-blue-200 dark:bg-blue-900/20 dark:border-blue-500/30'
                    : 'bg-amber-50/70 border-amber-200 dark:bg-amber-900/20 dark:border-amber-500/30'
                "
              >
                <div class="space-y-1">
                  <div class="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {{ h.paralelo_materia?.materia?.nombre_materia }}
                  </div>
                  <div class="text-xs text-slate-600 dark:text-slate-400">
                    Grado: {{ h.paralelo_materia?.paralelo?.grado }}° "{{ h.paralelo_materia?.paralelo?.paralelo }}"
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    👨‍🏫 {{ h.paralelo_materia?.docente?.user?.nombre_completo || 'Sin docente asignado' }}
                  </div>
                </div>

                <div class="text-right shrink-0">
                  <span class="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
                    {{ h.hora_inicio }} - {{ h.hora_fin }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- VISTA ESCRITORIO: Grilla Semanal Tradicional -->
          <div class="hidden lg:block overflow-x-auto">
            <table
              class="w-full border-collapse border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
            >
              <thead>
                <tr>
                  <th
                    class="border border-slate-200 dark:border-slate-800 p-2 bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs w-20"
                  >
                    Hora
                  </th>
                  <th
                    v-for="dia in diasSemana"
                    :key="dia"
                    class="border border-slate-200 dark:border-slate-800 p-2 bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs capitalize"
                  >
                    {{ dia }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hora in horasGrid" :key="hora">
                  <td
                    class="border border-slate-200 dark:border-slate-800 p-2 text-xs text-center font-medium text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    {{ hora }}:00
                  </td>
                  <td
                    v-for="dia in diasSemana"
                    :key="dia"
                    @click="abrirModalCelda(dia, hora)"
                    class="group relative border border-slate-200 dark:border-slate-800 p-1 min-w-[130px] h-12 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div
                      v-for="h in horariosEnCelda(dia, hora)"
                      :key="h.id"
                      @click.stop="abrirModal(h)"
                      class="rounded-xl p-1.5 mb-0.5 text-xs cursor-pointer transition-all duration-200 border shadow-sm"
                      :class="
                        h.paralelo_materia?.docente
                          ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-500/20'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-500/20'
                      "
                    >
                      <div class="font-bold truncate">
                        {{ h.paralelo_materia?.materia?.nombre_materia }}
                      </div>
                      <div class="truncate text-[11px] opacity-90">
                        {{ h.paralelo_materia?.paralelo?.grado }}°"{{
                          h.paralelo_materia?.paralelo?.paralelo
                        }}"
                      </div>
                    </div>
                    <div
                      v-if="horariosEnCelda(dia, hora).length === 0"
                      class="hidden group-hover:flex items-center justify-center h-full min-h-[28px] text-slate-400 dark:text-slate-600 group-hover:text-indigo-600 pointer-events-none"
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
    </div>

    <!-- Modal Formulario -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto"
    >
      <div
        class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 my-auto"
      >
        <h3 class="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
          {{ editando ? 'Editar Horario' : 'Nuevo Horario' }}
        </h3>
        <form @submit.prevent="guardar" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
              Asignación
            </label>
            <select
              v-model="form.paralelo_materia_id"
              required
              class="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 text-sm dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Seleccionar</option>
              <option v-for="a in asignaciones" :key="a.id" :value="a.id">
                {{ a.materia?.nombre_materia }} - {{ a.paralelo?.grado }}°"{{
                  a.paralelo?.paralelo
                }}" - {{ a.docente?.user?.nombre_completo || 'Sin docente' }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                Día
              </label>
              <select
                v-model="form.dia_semana"
                class="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 text-sm dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 capitalize"
              >
                <option v-for="d in diasSemana" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                Hora inicio
              </label>
              <input
                v-model="form.hora_inicio"
                type="time"
                required
                class="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 text-sm dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                Hora fin
              </label>
              <input
                v-model="form.hora_fin"
                type="time"
                required
                class="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 text-sm dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
              Tipo
            </label>
            <select
              v-model="form.tipo_actividad"
              class="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 text-sm dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="clase">Clase</option>
              <option value="laboratorio">Laboratorio</option>
              <option value="tutoria">Tutoría</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
          <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <button
              v-if="editando"
              @click="confirmarEliminarHorario"
              type="button"
              class="w-full sm:w-auto px-4 py-2.5 text-sm rounded-xl bg-red-100 text-red-700 hover:bg-red-200 font-semibold transition"
            >
              Eliminar
            </button>
            <button
              type="button"
              @click="showModal = false"
              class="w-full sm:w-auto px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all"
            >
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { getHorarios, createHorario, updateHorario, deleteHorario, getAsignaciones, getUbicaciones } from '@/api/endpoints.js'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const horarios = ref([])
const asignaciones = ref([])
const ubicaciones = ref([])
const ubicacionSeleccionada = ref(null)
const diaSeleccionadoMobile = ref('lunes')
const showModal = ref(false)
const editando = ref(null)
const saving = ref(false)
const errorMsg = ref('')
const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const form = ref({ paralelo_materia_id: '', dia_semana: 'lunes', hora_inicio: '08:00', hora_fin: '10:00', tipo_actividad: 'clase' })

const horasGrid = Array.from({ length: 14 }, (_, i) => i + 7)

// Normalizar formato de hora a "HH:mm" (ej: 08:00) evitando segundos extra ("08:00:00") o faltantes
const formatearHora = (hora) => {
  if (!hora) return '08:00'
  const partes = hora.split(':')
  if (partes.length >= 2) {
    const hh = partes[0].padStart(2, '0')
    const mm = partes[1].padStart(2, '0')
    return `${hh}:${mm}`
  }
  return hora
}

const seleccionarUbicacion = (ubi) => {
  ubicacionSeleccionada.value = ubi
}

const onUbicacionSelectMobile = (event) => {
  const selectedId = Number(event.target.value)
  const ubi = ubicaciones.value.find(u => u.id === selectedId)
  if (ubi) seleccionarUbicacion(ubi)
}

const horariosEnCelda = (dia, hora) => {
  return horarios.value.filter((h) => {
    if (h.ubicacion_id !== ubicacionSeleccionada.value?.id) return false
    if (h.dia_semana !== dia) return false
    const hInicio = parseInt(h.hora_inicio?.split(':')[0])
    const hFin = parseInt(h.hora_fin?.split(':')[0])
    return hora >= hInicio && hora <= hFin
  })
}

const horariosEnDiaMobile = (dia) => {
  return horarios.value.filter((h) => {
    if (h.ubicacion_id !== ubicacionSeleccionada.value?.id) return false
    return h.dia_semana === dia
  }).sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
}

const cargarHorarios = async () => {
  try {
    const { data } = await getHorarios({estado:'activo'})
    horarios.value = data.data.data
  } catch (e) { console.error(e) }
}

const cargarCatalogos = async () => {
  try {
    const [a, u] = await Promise.all([getAsignaciones(), getUbicaciones({ estado: 'activo' })])
    asignaciones.value = a.data.data.data
    ubicaciones.value = u.data.data.data
  } catch (e) { console.error(e) }
}

const abrirModal = (item = null) => {
  errorMsg.value = ''
  if (item) {
    editando.value = item
    form.value = { 
      paralelo_materia_id: item.paralelo_materia_id, 
      dia_semana: item.dia_semana, 
      hora_inicio: formatearHora(item.hora_inicio), 
      hora_fin: formatearHora(item.hora_fin), 
      tipo_actividad: item.tipo_actividad 
    }
  } else {
    editando.value = null
    form.value = { 
      paralelo_materia_id: '', 
      dia_semana: diaSeleccionadoMobile.value || 'lunes', 
      hora_inicio: '08:00', 
      hora_fin: '10:00', 
      tipo_actividad: 'clase' 
    }
  }
  showModal.value = true
}

const abrirModalCelda = (dia, hora) => {
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
  errorMsg.value = ''
  try {
    const payload = { 
      ...form.value, 
      hora_inicio: formatearHora(form.value.hora_inicio),
      hora_fin: formatearHora(form.value.hora_fin),
      ubicacion_id: ubicacionSeleccionada.value.id 
    }
    if (editando.value) await updateHorario(editando.value.id, payload)
    else await createHorario(payload)
    
    showModal.value = false
    cargarHorarios()
  } catch (e) {
    if (e.response?.data?.errors) {
      errorMsg.value = Object.values(e.response.data.errors).flat().join(' ')
    } else {
      errorMsg.value = e.response?.data?.message || 'Error al guardar'
    }
  } finally { 
    saving.value = false 
  }
}

const confirmarEliminarHorario = async () => {
  const isDark = document.documentElement.classList.contains('dark')

  const result = await Swal.fire({
    title: '¿Eliminar horario?',
    text: 'Esta acción removerá el bloque de la grilla semanal.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
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
      popup: 'font-sans rounded-[3rem] border border-slate-200 dark:border-slate-700/60 p-8 shadow-2xl',
      title: 'text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100',
      htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-2',
      confirmButton: 'px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm transition-all duration-200 shadow-md shadow-indigo-600/20 focus:outline-none ml-3 tracking-wide',
      cancelButton: 'px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 active:scale-95 text-slate-600 font-bold text-sm transition-all duration-200 border border-slate-200/60 dark:border-slate-700/60 focus:outline-none tracking-wide',
      icon: 'border-0 scale-90 -mb-1'
    },
    buttonsStyling: false
  })

  if (result.isConfirmed) {
    try {
      await deleteHorario(editando.value.id)
      showModal.value = false
      await cargarHorarios()

      Swal.fire({
        title: '¡Eliminado!',
        text: 'El horario ha sido removido con éxito.',
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
          popup: 'font-sans rounded-[2.5rem] border border-emerald-500/20 dark:border-slate-700/60 p-6 shadow-2xl',
          title: 'text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight',
          htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-1'
        }
      })
    } catch (e) {
      console.error('Error al eliminar el horario:', e)
    }
  }
}


// const confirmarEliminarHorario =async()=>{
//   console.log(editando.value.id)
// }

onMounted(() => { cargarCatalogos(); cargarHorarios() })
</script>