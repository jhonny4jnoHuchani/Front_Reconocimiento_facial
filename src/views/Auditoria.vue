<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Auditoría y Bitácora del Sistema" />

    <div class="space-y-6">
      <ComponentCard title="Filtros de Búsqueda">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Fecha</label>
            <input
              v-model="fechaFiltro"
              @change="cargar(1)"
              type="date"
              class="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tipo de Acción</label>
            <input
              v-model="accionFiltro"
              @input="cargar(1)"
              type="text"
              placeholder="Ej: validar_marcado, marcado_manual..."
              class="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Registro de Operaciones Administrativas">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              <tr>
                <th class="px-4 py-3">Fecha y Hora</th>
                <th class="px-4 py-3">Usuario Responsable</th>
                <th class="px-4 py-3">Rol</th>
                <th class="px-4 py-3">Acción</th>
                <th class="px-4 py-3">Entidad</th>
                <th class="px-4 py-3">Detalles</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">Cargando bitácora de auditoría...</td>
              </tr>
              <tr v-else-if="items.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">No se encontraron registros de auditoría.</td>
              </tr>
              <tr
                v-for="item in items"
                :key="item.id"
                class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td class="px-4 py-3 font-mono text-xs whitespace-nowrap">{{ formatearFecha(item.created_at) }}</td>
                <td class="px-4 py-3 font-medium">{{ item.usuario?.nombre_completo || 'Sistema' }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-xs font-semibold capitalize bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {{ item.usuario?.rol || 'Admin' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="{
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': item.accion.includes('validar'),
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': item.accion.includes('manual'),
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400': item.accion.includes('reset'),
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': true
                    }"
                  >
                    {{ item.accion }}
                  </span>
                </td>
                <td class="px-4 py-3 capitalize text-xs text-gray-500">{{ item.entidad }} #{{ item.entidad_id || '-' }}</td>
                <td class="px-4 py-3 text-xs font-mono max-w-[300px] truncate" :title="JSON.stringify(item.datos)">
                  {{ JSON.stringify(item.datos) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
          <span class="text-xs text-gray-500">Página {{ paginaActual }} de {{ totalPages }}</span>
          <div class="flex gap-2">
            <button
              @click="cargar(paginaActual - 1)"
              :disabled="paginaActual <= 1"
              class="px-3 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-700 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              @click="cargar(paginaActual + 1)"
              :disabled="paginaActual >= totalPages"
              class="px-3 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-700 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { getAuditoria } from '@/api/endpoints'

const items = ref([])
const loading = ref(false)
const fechaFiltro = ref('')
const accionFiltro = ref('')
const paginaActual = ref(1)
const totalPages = ref(1)

const cargar = async (page = 1) => {
  loading.value = true
  paginaActual.value = page
  try {
    const { data } = await getAuditoria({
      page,
      fecha: fechaFiltro.value || undefined,
      accion: accionFiltro.value || undefined,
    })
    items.value = data.data?.data || []
    totalPages.value = data.data?.last_page || 1
  } catch (e) {
    console.error('Error al cargar auditoría:', e)
  } finally {
    loading.value = false
  }
}

const formatearFecha = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'medium' })
}

onMounted(() => {
  cargar(1)
})
</script>
