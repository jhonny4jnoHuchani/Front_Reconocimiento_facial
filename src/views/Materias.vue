<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Materias" />
    
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <input
            v-model="buscar"
            @input="cargar"
            type="text"
            placeholder="Buscar por nombre o código..."
            class="h-11 w-64 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <select v-model="estado" @change="cargar" class="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            <option value="activo">Activas</option>
            <option value="inactivo">Inactivas</option>
          </select>
        </div>
        <button @click="abrirModal()" class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          + Nueva Materia
        </button>
      </div>

      <ComponentCard title="Lista de Materias">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700 dark:text-gray-400">
            <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3">Nombre</th>
                <th class="px-4 py-3">Código</th>
                <th class="px-4 py-3">Créditos</th>
                <th class="px-4 py-3">Nivel</th>
                <th class="px-4 py-3">Modalidad</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading"><td colspan="7" class="px-4 py-4 text-center">Cargando...</td></tr>
              <tr v-else-if="items.length === 0"><td colspan="7" class="px-4 py-4 text-center">No se encontraron materias</td></tr>
              <tr v-for="item in items" :key="item.id" class="border-t border-gray-100 dark:border-gray-800">
                <td class="px-4 py-3">{{ item.nombre_materia }}</td>
                <td class="px-4 py-3">{{ item.codigo }}</td>
                <td class="px-4 py-3">{{ item.creditos }}</td>
                <td class="px-4 py-3">{{ item.nivel }}</td>
                <td class="px-4 py-3">{{ item.modalidad }}</td>
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

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6">
          <h3 class="text-lg font-semibold mb-4">{{ editando ? 'Editar Materia' : 'Nueva Materia' }}</h3>
          <form @submit.prevent="guardar" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombre</label>
              <input v-model="form.nombre_materia" type="text" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Código</label>
              <input v-model="form.codigo" type="text" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium mb-1">Créditos</label>
                <input v-model.number="form.creditos" type="number" min="0" class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Nivel</label>
                <input v-model.number="form.nivel" type="number" min="1" class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Modalidad</label>
              <select v-model="form.modalidad" class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700">
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
              </select>
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
import { getMaterias, createMateria, updateMateria, deleteMateria } from '@/api/endpoints'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const items = ref([])
const buscar = ref('')
const estado = ref('activo')
const loading = ref(false)
const showModal = ref(false)
const editando = ref(null)
const saving = ref(false)
const errorMsg = ref('')

const form = ref({ nombre_materia: '', codigo: '', creditos: 0, nivel: 1, modalidad: 'semestral' })

const cargar = async () => {
  loading.value = true
  try {
    const { data } = await getMaterias({ estado: estado.value, buscar: buscar.value })
    items.value = data.data.data
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const abrirModal = (item = null) => {
  errorMsg.value = ''
  if (item) {
    editando.value = item
    form.value = { ...item }
  } else {
    editando.value = null
    form.value = { nombre_materia: '', codigo: '', creditos: 0, nivel: 1, modalidad: 'semestral' }
  }
  showModal.value = true
}

const guardar = async () => {
  saving.value = true
  errorMsg.value = ''
  try {
    if (editando.value) {
      await updateMateria(editando.value.id, form.value)
    } else {
      await createMateria(form.value)
    }
    showModal.value = false
    cargar()
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Error al guardar'
  } finally { saving.value = false }
}

const eliminar = async (id) => {
  if (!confirm('¿Desactivar esta materia?')) return
  await deleteMateria(id)
  cargar()
}

onMounted(cargar)
</script>