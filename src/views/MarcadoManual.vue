<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Simulador de Marcado Manual (DEV)" />

    <div class="space-y-6">
      <!-- Tarjeta de Búsqueda y Parámetros -->
      <ComponentCard title="Buscar Docente por Cédula de Identidad (CI)">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div class="md:col-span-4">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Número de CI o Email del Docente
            </label>
            <div class="relative">
              <input
                v-model="ciBuscado"
                @keyup.enter="buscarDocente"
                type="text"
                placeholder="Ej: 8492031..."
                class="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div class="md:col-span-2">
            <button
              @click="buscarDocente"
              :disabled="loadingBusqueda || !ciBuscado.trim()"
              class="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-brand-500 text-white font-medium text-sm hover:bg-brand-600 disabled:opacity-50"
            >
              <Search :size="18" />
              <span>{{ loadingBusqueda ? 'Buscando...' : 'Buscar' }}</span>
            </button>
          </div>

          <!-- Switch Puntuales -->
          <div class="md:col-span-6 flex flex-col justify-end p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-bold text-gray-800 dark:text-gray-100">
                  Sincronizar con Servicio de Puntuales
                </span>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ enviarPuntuales ? 'Activado: Se enviará la asistencia al sistema externo.' : 'Desactivado (DEV): Solo se guardará localmente.' }}
                </p>
              </div>

              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="enviarPuntuales" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>
      </ComponentCard>

      <!-- Ficha del Docente Encontrado -->
      <div v-if="docente" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xl overflow-hidden border border-brand-200">
            <img v-if="docente.foto_perfil_url" :src="docente.foto_perfil_url" class="w-full h-full object-cover" />
            <span v-else>{{ docente.nombre_completo.charAt(0) }}</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ docente.nombre_completo }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">CI: <span class="font-semibold text-gray-700 dark:text-gray-200">{{ docente.ci }}</span> | Finger ID: <span class="font-semibold text-emerald-600">{{ docente.finger_id || 'Sin ID' }}</span></p>
            <p class="text-xs text-gray-400">Carrera: {{ docente.carrera }}</p>
          </div>
        </div>

        <div class="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-medium text-gray-500">Hora de Marcado Simulada</label>
              <button
                type="button"
                @click="horaSimulada = obtenerHoraActual()"
                title="Poner hora actual del sistema"
                class="text-[11px] text-brand-600 hover:text-brand-700 flex items-center gap-0.5 ml-2 font-medium"
              >
                <Clock :size="12" />
                <span>Ahora</span>
              </button>
            </div>
            <input
              v-model="horaSimulada"
              type="time"
              step="1"
              class="h-9 rounded-lg border border-gray-300 bg-white px-2 text-xs font-mono dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Fecha</label>
            <input
              v-model="fechaSimulada"
              type="date"
              class="h-9 rounded-lg border border-gray-300 bg-white px-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Horarios de Hoy del Docente -->
      <ComponentCard v-if="docente" :title="'Horarios Programados para Hoy (' + diaNombre + ')'">
        <div v-if="horarios.length === 0" class="text-center py-8 text-gray-500">
          El docente no tiene horarios programados para el día de hoy ({{ diaNombre }}).
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="h in horarios"
            :key="h.horario_id"
            class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-900 dark:text-white">{{ h.materia }}</span>
                <span v-if="h.paralelo" class="px-2 py-0.5 rounded text-xs bg-gray-200 dark:bg-gray-700 font-medium">
                  {{ h.paralelo }}
                </span>
                <span class="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                  {{ h.aula }}
                </span>
              </div>
              <p class="text-xs font-mono text-gray-500 dark:text-gray-400">
                Horario: <span class="font-semibold text-gray-700 dark:text-gray-300">{{ h.hora_inicio }} - {{ h.hora_fin }}</span>
              </p>
              
              <!-- Estado actual con acciones para editar / borrar -->
              <div class="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <!-- Entrada -->
                <div class="flex items-center gap-1.5" :class="h.tiene_entrada ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-400'">
                  <CheckCircle v-if="h.tiene_entrada" :size="15" />
                  <span v-else class="text-sm">○</span>
                  <span>Entrada: <b class="font-mono">{{ h.tiene_entrada ? h.hora_entrada : 'Sin marcar' }}</b></span>
                  
                  <!-- Botón Editar / Eliminar Entrada -->
                  <div v-if="h.tiene_entrada" class="flex items-center gap-0.5 ml-1">
                    <button
                      type="button"
                      @click="abrirModalEditarHora(h, 'entrada')"
                      title="Editar hora de entrada"
                      class="p-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 transition-colors"
                    >
                      <Pencil :size="13" />
                    </button>
                    <button
                      type="button"
                      @click="confirmarEliminarMarcado(h, 'entrada')"
                      title="Eliminar marcado de entrada"
                      class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <Trash2 :size="13" />
                    </button>
                  </div>
                </div>

                <span class="text-gray-300 dark:text-gray-700">|</span>

                <!-- Salida -->
                <div class="flex items-center gap-1.5" :class="h.tiene_salida ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-400'">
                  <CheckCircle v-if="h.tiene_salida" :size="15" />
                  <span v-else class="text-sm">○</span>
                  <span>Salida: <b class="font-mono">{{ h.tiene_salida ? h.hora_salida : 'Sin marcar' }}</b></span>

                  <!-- Botón Editar / Eliminar Salida -->
                  <div v-if="h.tiene_salida" class="flex items-center gap-0.5 ml-1">
                    <button
                      type="button"
                      @click="abrirModalEditarHora(h, 'salida')"
                      title="Editar hora de salida"
                      class="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-950/60 text-blue-700 dark:text-blue-300 transition-colors"
                    >
                      <Pencil :size="13" />
                    </button>
                    <button
                      type="button"
                      @click="confirmarEliminarMarcado(h, 'salida')"
                      title="Eliminar marcado de salida"
                      class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <Trash2 :size="13" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones de Acción (Libre para Entrada o Salida) -->
            <div class="flex items-center gap-2">
              <button
                @click="ejecutarMarcado(h, 'entrada')"
                :disabled="procesandoMarcado"
                class="px-4 py-2 flex items-center gap-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-sm"
                :class="h.tiene_entrada ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700'"
              >
                <LogIn :size="16" />
                <span>{{ h.tiene_entrada ? 'Remarcar Entrada' : 'Marcar Entrada' }}</span>
              </button>

              <button
                @click="ejecutarMarcado(h, 'salida')"
                :disabled="procesandoMarcado"
                class="px-4 py-2 flex items-center gap-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-sm"
                :class="h.tiene_salida ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'"
              >
                <LogOut :size="16" />
                <span>{{ h.tiene_salida ? 'Remarcar Salida' : 'Marcar Salida' }}</span>
              </button>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, CheckCircle, LogIn, LogOut, Pencil, Trash2, Clock } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import {
  getDocenteHorariosPorCi,
  registrarMarcadoManual,
  editarMarcadoManual,
  eliminarMarcadoManual,
} from '@/api/endpoints'

const ciBuscado = ref('')
const loadingBusqueda = ref(false)
const docente = ref(null)
const horarios = ref([])
const diaNombre = ref('')
const enviarPuntuales = ref(false)
const horaSimulada = ref('')
const fechaSimulada = ref('')
const procesandoMarcado = ref(false)

const obtenerHoraActual = () => {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

const obtenerFechaActual = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const buscarDocente = async () => {
  if (!ciBuscado.value.trim()) return
  loadingBusqueda.value = true
  docente.value = null
  horarios.value = []

  try {
    const { data } = await getDocenteHorariosPorCi(ciBuscado.value.trim())
    docente.value = data.docente
    horarios.value = data.horarios
    diaNombre.value = data.dia
  } catch (e) {
    Swal.fire({
      title: 'Docente no encontrado',
      text: e.response?.data?.message || 'Verifica el número de CI ingresado.',
      icon: 'error',
    })
  } finally {
    loadingBusqueda.value = false
  }
}

const ejecutarMarcado = async (horarioItem, tipo) => {
  procesandoMarcado.value = true
  try {
    const { data } = await registrarMarcadoManual({
      docente_id: docente.value.id,
      horario_id: horarioItem.horario_id,
      tipo_marcado: tipo,
      fecha: fechaSimulada.value || undefined,
      hora_marcado: horaSimulada.value || undefined,
      enviar_puntuales: enviarPuntuales.value,
      observacion: `Marcado manual (${tipo}) registrado desde panel DEV.`,
    })

    const isDark = document.documentElement.classList.contains('dark')

    Swal.fire({
      title: `¡Marcado de ${tipo.toUpperCase()} exitoso!`,
      html: `
        <p class="text-sm">Docente: <b>${docente.value.nombre_completo}</b></p>
        <p class="text-sm">Materia: <b>${horarioItem.materia}</b></p>
        <p class="text-xs text-gray-500 mt-2">Puntuales: ${data.puntuales_despacho}</p>
      `,
      icon: 'success',
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
    })

    // Actualizar datos del docente
    await buscarDocente()
  } catch (e) {
    Swal.fire({
      title: 'Error al marcar',
      text: e.response?.data?.message || 'No se pudo registrar el marcado.',
      icon: 'error',
    })
  } finally {
    procesandoMarcado.value = false
  }
}

const abrirModalEditarHora = async (horarioItem, tipo) => {
  const isDark = document.documentElement.classList.contains('dark')
  const horaActual = tipo === 'entrada' ? horarioItem.hora_entrada : horarioItem.hora_salida
  const marcadoId = tipo === 'entrada' ? horarioItem.entrada_id : horarioItem.salida_id
  const nombreTipo = tipo === 'entrada' ? 'Entrada' : 'Salida'

  const { value: nuevaHora } = await Swal.fire({
    title: `Editar Hora de ${nombreTipo}`,
    html: `
      <div style="text-align: left; font-size: 14px; margin-top: 10px;">
        <p style="margin-bottom: 6px;"><b>Docente:</b> ${docente.value.nombre_completo}</p>
        <p style="margin-bottom: 12px;"><b>Materia:</b> ${horarioItem.materia}</p>
        <label style="display:block; font-size: 12px; margin-bottom: 4px; font-weight: 500; color: ${isDark ? '#cbd5e1' : '#475569'};">
          Nueva Hora (${nombreTipo}):
        </label>
        <input 
          id="swal-hora-input" 
          type="time" 
          step="1" 
          value="${horaActual || ''}" 
          style="width: 100%; height: 42px; padding: 0 10px; font-size: 16px; font-family: monospace; text-align: center; border-radius: 8px; border: 1px solid ${isDark ? '#334155' : '#cbd5e1'}; background: ${isDark ? '#1e293b' : '#ffffff'}; color: ${isDark ? '#ffffff' : '#0f172a'};"
        />
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar Hora',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3b82f6',
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',
    preConfirm: () => {
      const input = document.getElementById('swal-hora-input')
      const val = input ? input.value : ''
      if (!val) {
        Swal.showValidationMessage('Por favor ingresa una hora válida (HH:mm:ss)')
        return false
      }
      return val
    },
  })

  if (!nuevaHora) return

  procesandoMarcado.value = true
  try {
    if (marcadoId) {
      await editarMarcadoManual(marcadoId, {
        hora_marcado: nuevaHora,
        fecha: fechaSimulada.value || undefined,
      })
    } else {
      await registrarMarcadoManual({
        docente_id: docente.value.id,
        horario_id: horarioItem.horario_id,
        tipo_marcado: tipo,
        fecha: fechaSimulada.value || undefined,
        hora_marcado: nuevaHora,
        enviar_puntuales: false,
        observacion: `Marcado manual (${tipo}) corregido desde panel DEV`,
      })
    }

    Swal.fire({
      icon: 'success',
      title: '¡Hora corregida!',
      text: `Se actualizó la hora de ${nombreTipo} a ${nuevaHora}.`,
      timer: 2000,
      showConfirmButton: false,
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
    })

    await buscarDocente()
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'Error al actualizar',
      text: e.response?.data?.message || 'No se pudo actualizar la hora de marcado.',
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
    })
  } finally {
    procesandoMarcado.value = false
  }
}

const confirmarEliminarMarcado = async (horarioItem, tipo) => {
  const isDark = document.documentElement.classList.contains('dark')
  const marcadoId = tipo === 'entrada' ? horarioItem.entrada_id : horarioItem.salida_id
  const nombreTipo = tipo === 'entrada' ? 'Entrada' : 'Salida'

  if (!marcadoId) {
    Swal.fire({
      icon: 'info',
      title: 'Sin ID de marcado',
      text: 'Vuelve a buscar al docente para obtener la referencia del registro.',
    })
    return
  }

  const result = await Swal.fire({
    title: `¿Eliminar marcado de ${nombreTipo}?`,
    text: `El horario de ${horarioItem.materia} volverá a quedar como "Sin marcar".`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',
  })

  if (!result.isConfirmed) return

  procesandoMarcado.value = true
  try {
    await eliminarMarcadoManual(marcadoId)

    Swal.fire({
      icon: 'success',
      title: '¡Marcado eliminado!',
      text: `Se eliminó el marcado de ${nombreTipo}.`,
      timer: 1800,
      showConfirmButton: false,
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
    })

    await buscarDocente()
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: e.response?.data?.message || 'No se pudo eliminar el marcado.',
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
    })
  } finally {
    procesandoMarcado.value = false
  }
}

onMounted(() => {
  horaSimulada.value = obtenerHoraActual()
  fechaSimulada.value = obtenerFechaActual()
})
</script>
