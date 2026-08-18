<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Ubicaciones" />
    
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <select v-model="estado" @change="cargar" class="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
          <option value="activo">Activas</option>
          <option value="inactivo">Inactivas</option>
        </select>
        <button @click="abrirModal()" class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          + Nueva Ubicación
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="item in items" :key="item.id" class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">{{ item.nombre_lugar }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ item.tipo }} - {{ item.edificio_campus || 'Sin edificio' }}</p>
          <p class="text-sm text-gray-500">Tolerancia: {{ item.tolerancia_metros }}m</p>
          <span :class="item.estado === 'activo' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-red-600 bg-red-100 dark:bg-red-900/30'" class="inline-block mt-2 px-2 py-0.5 rounded-full text-xs">{{ item.estado }}</span>
          <div class="mt-4 flex gap-2">
            <button @click="abrirModal(item)" class="text-sm text-blue-600 hover:underline">Editar</button>
            <button v-if="item.estado === 'activo'" @click="eliminar(item.id)" class="text-sm text-red-600 hover:underline">Desactivar</button>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">{{ editando ? 'Editar Ubicación' : 'Nueva Ubicación' }}</h3>
          <form @submit.prevent="guardar" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium mb-1">Nombre</label>
                <input v-model="form.nombre_lugar" type="text" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Tipo</label>
                <select v-model="form.tipo" class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700">
                  <option value="aula">Aula</option>
                  <option value="laboratorio">Laboratorio</option>
                  <option value="auditorio">Auditorio</option>
                  <option value="exterior">Exterior</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Edificio / Campus</label>
              <input v-model="form.edificio_campus" type="text" class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tolerancia (metros)</label>
              <input v-model.number="form.tolerancia_metros" type="number" min="10" max="500" class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Dibujar polígono en el mapa</label>
              <MapaPoligono v-model="coordenadas" />
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
import { getUbicaciones, createUbicacion, updateUbicacion, deleteUbicacion } from '@/api/endpoints'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import MapaPoligono from '@/components/common/MapaPoligono.vue'

const items = ref([])
const estado = ref('activo')
const showModal = ref(false)
const editando = ref(null)
const saving = ref(false)
const errorMsg = ref('')
const coordenadas = ref([])
const form = ref({ nombre_lugar: '', tipo: 'aula', edificio_campus: '', tolerancia_metros: 50 })

const cargar = async () => {
  try {
    const { data } = await getUbicaciones({ estado: estado.value })
    items.value = data.data.data
  } catch (e) { console.error(e) }
}

const abrirModal = (item = null) => {
  errorMsg.value = ''
  if (item) {
    editando.value = item
    form.value = { nombre_lugar: item.nombre_lugar, tipo: item.tipo, edificio_campus: item.edificio_campus || '', tolerancia_metros: item.tolerancia_metros }
    coordenadas.value = item.coordenadas || []
  } else {
    editando.value = null
    form.value = { nombre_lugar: '', tipo: 'aula', edificio_campus: '', tolerancia_metros: 50 }
    coordenadas.value = []
  }
  showModal.value = true
}

const guardar = async () => {
  saving.value = true
  errorMsg.value = ''
  try {
    if (coordenadas.value.length < 3) {
      errorMsg.value = 'El polígono debe tener al menos 3 puntos'
      saving.value = false
      return
    }
    const payload = { ...form.value, coordenadas: coordenadas.value }
    if (editando.value) {
      await updateUbicacion(editando.value.id, payload)
    } else {
      await createUbicacion(payload)
    }
    showModal.value = false
    cargar()
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Error al guardar'
  } finally { saving.value = false }
}

const eliminar = async (id) => {
  if (!confirm('¿Desactivar esta ubicación?')) return
  await deleteUbicacion(id)
  cargar()
}

onMounted(cargar)
</script>