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
            <label class="block text-xs font-medium text-gray-500 mb-1">Hora de Marcado Simulada</label>
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
              <!-- Estado actual -->
              <div class="flex items-center gap-3 pt-1 text-xs">
                <span class="flex items-center gap-1 font-medium" :class="h.tiene_entrada ? 'text-emerald-600' : 'text-gray-400'">
                  <CheckCircle v-if="h.tiene_entrada" :size="14" />
                  <span v-else>○</span>
                  Entrada: {{ h.tiene_entrada ? h.hora_entrada : 'Sin marcar' }}
                </span>
                <span class="flex items-center gap-1 font-medium" :class="h.tiene_salida ? 'text-blue-600' : 'text-gray-400'">
                  <CheckCircle v-if="h.tiene_salida" :size="14" />
                  <span v-else>○</span>
                  Salida: {{ h.tiene_salida ? h.hora_salida : 'Sin marcar' }}
                </span>
              </div>
            </div>

            <!-- Botones de Acción (Libre para Entrada o Salida según solicitud) -->
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
import { Search, CheckCircle, LogIn, LogOut } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { getDocenteHorariosPorCi, registrarMarcadoManual } from '@/api/endpoints'

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

onMounted(() => {
  horaSimulada.value = obtenerHoraActual()
  fechaSimulada.value = obtenerFechaActual()
})
</script>
