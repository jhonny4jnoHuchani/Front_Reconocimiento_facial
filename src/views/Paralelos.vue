<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Paralelos" />
    
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <select v-model="estado" @change="cargar" class="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
        <button @click="abrirModal()" class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          + Nuevo Paralelo
        </button>
      </div>

      <ComponentCard title="Lista de Paralelos">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700 dark:text-gray-400">
            <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3">Grado</th>
                <th class="px-4 py-3">Paralelo</th>
                <th class="px-4 py-3">Capacidad</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading"><td colspan="5" class="px-4 py-4 text-center">Cargando...</td></tr>
              <tr v-else-if="items.length === 0"><td colspan="5" class="px-4 py-4 text-center">No se encontraron paralelos</td></tr>
              <tr v-for="item in items" :key="item.id" class="border-t border-gray-100 dark:border-gray-800">
                <td class="px-4 py-3">{{ item.grado }}</td>
                <td class="px-4 py-3">{{ item.paralelo }}</td>
                <td class="px-4 py-3">{{ item.capacidad }}</td>
                <td class="px-4 py-3">
                  <span :class="item.estado === 'activo' ? 'text-green-600' : 'text-red-600'">{{ item.estado }}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button @click="abrirModal(item)" class="text-blue-600 hover:underline">Editar</button>
                    <button v-if="item.estado === 'activo'" @click="eliminar(item.id)" class="text-red-600 hover:underline">Desactivar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6">
          <h3 class="text-lg font-semibold mb-4">{{ editando ? 'Editar Paralelo' : 'Nuevo Paralelo' }}</h3>
          <form @submit.prevent="guardar" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Grado</label>
              <input v-model.number="form.grado" type="number" min="1" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Paralelo</label>
              <input v-model="form.paralelo" type="text" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Capacidad</label>
              <input v-model.number="form.capacidad" type="number" min="1" class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
            <div class="flex justify-end gap-3">
              <button type="button" @click="showModal = false" class="px-4 py-2 text-sm rounded-lg border border-gray-300">Cancelar</button>
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
import { ref, onMounted } from 'vue'
import { getParalelos, createParalelo, updateParalelo, deleteParalelo } from '@/api/endpoints'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const items = ref([])
const estado = ref('activo')
const loading = ref(false)
const showModal = ref(false)
const editando = ref(null)
const saving = ref(false)
const errorMsg = ref('')
const form = ref({ grado: 1, paralelo: '', capacidad: 30 })

const cargar = async () => {
  loading.value = true
  try {
    const { data } = await getParalelos({ estado: estado.value })
    items.value = data.data.data
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const abrirModal = (item = null) => {
  errorMsg.value = ''
  if (item) {
    editando.value = item
    form.value = { grado: item.grado, paralelo: item.paralelo, capacidad: item.capacidad }
  } else {
    editando.value = null
    form.value = { grado: 1, paralelo: '', capacidad: 30 }
  }
  showModal.value = true
}

const guardar = async () => {
  saving.value = true
  try {
    if (editando.value) await updateParalelo(editando.value.id, form.value)
    else await createParalelo(form.value)
    showModal.value = false
    cargar()
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Error al guardar'
  } finally { saving.value = false }
}

const eliminar = async (id) => {
  if (!confirm('¿Desactivar este paralelo?')) return
  await deleteParalelo(id)
  cargar()
}

onMounted(cargar)
</script>