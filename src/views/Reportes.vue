<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Reporte Mensual de Asistencia" />

    <div class="space-y-6">
      <!-- Filtros -->
      <ComponentCard title="Parámetros del Reporte">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Mes</label>
            <select
              v-model="mesSeleccionado"
              class="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option v-for="(nombre, idx) in meses" :key="idx" :value="idx + 1">
                {{ nombre }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Año</label>
            <select
              v-model="anioSeleccionado"
              class="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option v-for="y in anios" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Buscar Docente (CI / Nombre)</label>
            <input
              v-model="filtroTexto"
              type="text"
              placeholder="Filtrar por texto..."
              class="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div class="flex items-end gap-2">
            <button
              @click="consultar"
              :disabled="loading"
              class="flex-1 h-11 flex items-center justify-center gap-2 rounded-lg bg-brand-500 text-white font-medium text-sm hover:bg-brand-600 disabled:opacity-50"
            >
              <Search :size="18" />
              <span>Consultar</span>
            </button>
            <button
              @click="exportarExcel"
              :disabled="loading || listaFiltrada.length === 0"
              class="h-11 px-4 flex items-center gap-2 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 disabled:opacity-50"
              title="Descargar Planilla Excel (CSV)"
            >
              <Download :size="18" />
              <span class="hidden sm:inline">Excel</span>
            </button>
          </div>
        </div>
      </ComponentCard>

      <!-- Métricas Resumen General -->
      <div v-if="resumen" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Docentes</span>
          <p class="text-xl font-bold text-gray-800 dark:text-white">{{ resumen.total_docentes }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Clases Programadas</span>
          <p class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ resumen.clases_programadas }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Clases Asistidas</span>
          <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ resumen.clases_asistidas }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Faltas</span>
          <p class="text-xl font-bold text-red-600 dark:text-red-400">{{ resumen.total_faltas }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Minutos Retraso</span>
          <p class="text-xl font-bold text-amber-600 dark:text-amber-400">{{ resumen.minutos_retraso_total }} min</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Cumplimiento General</span>
          <p class="text-xl font-bold" :class="resumen.porcentaje_cumplimiento >= 80 ? 'text-emerald-600' : 'text-red-600'">
            {{ resumen.porcentaje_cumplimiento }}%
          </p>
        </div>
      </div>

      <!-- Tabla de Reporte -->
      <ComponentCard title="Detalle por Docente">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
              <tr>
                <th class="px-4 py-3">Docente</th>
                <th class="px-4 py-3">CI</th>
                <th class="px-4 py-3 text-center">Programadas</th>
                <th class="px-4 py-3 text-center">Asistidas</th>
                <th class="px-4 py-3 text-center">Faltas</th>
                <th class="px-4 py-3 text-center">Retrasos</th>
                <th class="px-4 py-3 text-center">Min. Retraso</th>
                <th class="px-4 py-3 text-center">% Asistencia</th>
                <th class="px-4 py-3 text-center">Detalle</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="9" class="px-4 py-8 text-center text-gray-500">
                  Calculando sábanas y asistencia mensual...
                </td>
              </tr>
              <tr v-else-if="listaFiltrada.length === 0">
                <td colspan="9" class="px-4 py-8 text-center text-gray-500">
                  No se encontraron registros para los filtros seleccionados.
                </td>
              </tr>
              <template v-else v-for="item in listaFiltrada" :key="item.docente_id">
                <tr class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td class="px-4 py-3 font-medium">{{ item.nombre_completo }}</td>
                  <td class="px-4 py-3">{{ item.ci }}</td>
                  <td class="px-4 py-3 text-center font-semibold">{{ item.clases_programadas }}</td>
                  <td class="px-4 py-3 text-center text-emerald-600 dark:text-emerald-400 font-semibold">{{ item.clases_asistidas }}</td>
                  <td class="px-4 py-3 text-center text-red-600 dark:text-red-400 font-semibold">{{ item.faltas }}</td>
                  <td class="px-4 py-3 text-center text-amber-600 dark:text-amber-400">{{ item.retrasos }}</td>
                  <td class="px-4 py-3 text-center">{{ item.minutos_retraso_total }} m</td>
                  <td class="px-4 py-3 text-center">
                    <span
                      class="px-2.5 py-1 rounded-full text-xs font-semibold"
                      :class="item.porcentaje_asistencia >= 85 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : (item.porcentaje_asistencia >= 70 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400')"
                    >
                      {{ item.porcentaje_asistencia }}%
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button
                      @click="toggleDetalle(item.docente_id)"
                      class="text-xs text-brand-600 hover:underline dark:text-brand-400"
                    >
                      {{ docenteExpandido === item.docente_id ? 'Ocultar' : 'Materias (' + item.materias.length + ')' }}
                    </button>
                  </td>
                </tr>

                <tr v-if="docenteExpandido === item.docente_id" class="bg-gray-50 dark:bg-gray-800/40">
                  <td colspan="9" class="px-6 py-3">
                    <div class="text-xs space-y-1">
                      <span class="font-semibold text-gray-700 dark:text-gray-300">Materias Asignadas en el Mes:</span>
                      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                        <div
                          v-for="(m, mIdx) in item.materias"
                          :key="mIdx"
                          class="bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                        >
                          <div>
                            <span class="font-medium text-gray-800 dark:text-gray-200">{{ m.materia }}</span>
                            <span v-if="m.paralelo" class="ml-1 text-gray-400">({{ m.paralelo }})</span>
                          </div>
                          <span class="text-brand-600 font-semibold">{{ m.clases_programadas }} clases</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Download } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { getReporteMensual } from '@/api/endpoints'

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
const anios = [2025, 2026, 2027]

const mesSeleccionado = ref(new Date().getMonth() + 1)
const anioSeleccionado = ref(new Date().getFullYear())
const filtroTexto = ref('')
const loading = ref(false)
const docentes = ref([])
const resumen = ref(null)
const docenteExpandido = ref(null)

const consultar = async () => {
  loading.value = true
  try {
    const { data } = await getReporteMensual({
      mes: mesSeleccionado.value,
      anio: anioSeleccionado.value,
    })
    docentes.value = data.data || []
    resumen.value = data.resumen_general || null
  } catch (e) {
    console.error('Error al obtener reporte mensual:', e)
  } finally {
    loading.value = false
  }
}

const listaFiltrada = computed(() => {
  if (!filtroTexto.value.trim()) return docentes.value
  const term = filtroTexto.value.toLowerCase()
  return docentes.value.filter(
    (d) =>
      d.nombre_completo.toLowerCase().includes(term) ||
      d.ci.toLowerCase().includes(term)
  )
})

const toggleDetalle = (docenteId) => {
  docenteExpandido.value = docenteExpandido.value === docenteId ? null : docenteId
}

const exportarExcel = () => {
  if (listaFiltrada.value.length === 0) return

  const headers = [
    'Docente',
    'CI',
    'Carrera',
    'Clases Programadas',
    'Clases Asistidas',
    'Faltas',
    'Retrasos',
    'Minutos Retraso Total',
    'Porcentaje Asistencia',
  ]

  const rows = listaFiltrada.value.map((d) => [
    `"${d.nombre_completo}"`,
    `"${d.ci}"`,
    `"${d.carrera}"`,
    d.clases_programadas,
    d.clases_asistidas,
    d.faltas,
    d.retrasos,
    d.minutos_retraso_total,
    `"${d.porcentaje_asistencia}%"`,
  ])

  const csvContent =
    '\uFEFF' +
    [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  const mesNombre = meses[mesSeleccionado.value - 1]
  link.setAttribute(
    'download',
    `Planilla_Asistencia_${mesNombre}_${anioSeleccionado.value}.csv`
  )
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  consultar()
})
</script>
