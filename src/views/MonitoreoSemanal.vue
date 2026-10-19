<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Monitoreo Semanal de Asistencia" />

    <div class="space-y-6">
      <!-- Filtros Rápidos -->
      <ComponentCard title="Selección de Periodo">
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="setPeriodo('hoy')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              filtroActivo === 'hoy'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            ]"
          >
            Hoy
          </button>
          <button
            @click="setPeriodo('ayer')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              filtroActivo === 'ayer'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            ]"
          >
            Ayer
          </button>
          <button
            @click="setPeriodo('anteayer')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              filtroActivo === 'anteayer'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            ]"
          >
            Anteayer
          </button>
          <button
            @click="setPeriodo('semana')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              filtroActivo === 'semana'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            ]"
          >
            Esta Semana
          </button>
        </div>
      </ComponentCard>

      <!-- Resumen Semanal -->
      <div v-if="resumen" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Clases Evaluadas</span>
          <p class="text-xl font-bold text-gray-800 dark:text-white">{{ resumen.total_clases_evaluadas }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Marcadas por APK</span>
          <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ resumen.clases_marcadas }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Con Retraso</span>
          <p class="text-xl font-bold text-amber-600 dark:text-amber-400">{{ resumen.clases_con_retraso }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Sin Marcar (Faltas)</span>
          <p class="text-xl font-bold text-red-600 dark:text-red-400">{{ resumen.clases_sin_marcar }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Docentes con Asistencia</span>
          <p class="text-xl font-bold text-brand-600 dark:text-brand-400">{{ resumen.docentes_marcaron }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Tasa de Cumplimiento</span>
          <p class="text-xl font-bold" :class="resumen.porcentaje_cumplimiento >= 80 ? 'text-emerald-600' : 'text-red-600'">
            {{ resumen.porcentaje_cumplimiento }}%
          </p>
        </div>
      </div>

      <!-- Desglose por Día -->
      <div v-if="loading" class="text-center py-12 text-gray-500">
        Consultando marcaciones del periodo...
      </div>
      <div v-else-if="dias.length === 0" class="text-center py-12 text-gray-500">
        No hay clases programadas en el periodo seleccionado.
      </div>
      <div v-else class="space-y-6">
        <div v-for="d in dias" :key="d.fecha" class="space-y-3">
          <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
            <h3 class="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span>{{ d.dia_semana }} ({{ d.fecha }})</span>
              <span v-if="d.es_hoy" class="px-2 py-0.5 text-xs rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                Hoy
              </span>
            </h3>
            <span class="text-xs text-gray-500 font-medium">
              {{ d.total_clases }} clases programadas
            </span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <table class="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                <tr>
                  <th class="px-4 py-3">Docente</th>
                  <th class="px-4 py-3">CI</th>
                  <th class="px-4 py-3">Materia</th>
                  <th class="px-4 py-3">Aula</th>
                  <th class="px-4 py-3 text-center">Horario</th>
                  <th class="px-4 py-3 text-center">Entrada</th>
                  <th class="px-4 py-3 text-center">Salida</th>
                  <th class="px-4 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="d.clases.length === 0">
                  <td colspan="8" class="px-4 py-4 text-center text-gray-400">
                    Sin clases programadas este día.
                  </td>
                </tr>
                <tr
                  v-for="c in d.clases"
                  :key="c.horario_id + '_' + c.docente_id"
                  class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td class="px-4 py-3 font-medium">{{ c.docente_nombre }}</td>
                  <td class="px-4 py-3">{{ c.docente_ci }}</td>
                  <td class="px-4 py-3">
                    {{ c.materia }} <span v-if="c.paralelo" class="text-xs text-gray-400">({{ c.paralelo }})</span>
                  </td>
                  <td class="px-4 py-3">{{ c.aula }}</td>
                  <td class="px-4 py-3 text-center font-mono text-xs">{{ c.horario }}</td>
                  <td class="px-4 py-3 text-center font-mono text-xs">
                    {{ c.hora_entrada || '--:--' }}
                  </td>
                  <td class="px-4 py-3 text-center font-mono text-xs">
                    {{ c.hora_salida || '--:--' }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span
                      class="px-2.5 py-1 rounded-full text-xs font-semibold"
                      :class="{
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': c.estado === 'puntual',
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': c.estado === 'retraso',
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': c.estado === 'sin_marcar',
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': c.estado === 'pendiente'
                      }"
                    >
                      {{ c.estado === 'puntual' ? 'Puntual' : (c.estado === 'retraso' ? 'Con Retraso (' + c.minutos_retraso + 'm)' : (c.estado === 'sin_marcar' ? 'Sin Marcar' : 'Pendiente')) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { getMonitoreoSemanal } from '@/api/endpoints'

const filtroActivo = ref('hoy')
const loading = ref(false)
const resumen = ref(null)
const dias = ref([])

const setPeriodo = (tipo) => {
  filtroActivo.value = tipo
  const ahora = new Date()

  let inicio = new Date()
  let fin = new Date()

  if (tipo === 'hoy') {
    // mismo día
  } else if (tipo === 'ayer') {
    inicio.setDate(ahora.getDate() - 1)
    fin.setDate(ahora.getDate() - 1)
  } else if (tipo === 'anteayer') {
    inicio.setDate(ahora.getDate() - 2)
    fin.setDate(ahora.getDate() - 2)
  } else if (tipo === 'semana') {
    const day = ahora.getDay()
    const diff = ahora.getDate() - day + (day === 0 ? -6 : 1) // Lunes
    inicio = new Date(ahora.setDate(diff))
    fin = new Date()
  }

  consultar(formatearFecha(inicio), formatearFecha(fin))
}

const formatearFecha = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const consultar = async (fechaInicio = null, fechaFin = null) => {
  loading.value = true
  try {
    const params = {}
    if (fechaInicio) params.fecha_inicio = fechaInicio
    if (fechaFin) params.fecha_fin = fechaFin

    const { data } = await getMonitoreoSemanal(params)
    resumen.value = data.resumen || null
    dias.value = data.dias || []
  } catch (e) {
    console.error('Error al consultar monitoreo:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  setPeriodo('hoy')
})
</script>
