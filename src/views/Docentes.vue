<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Docentes" />
    
    <div class="space-y-6">
      <!-- Filtros y botón -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <input
            v-model="buscar"
            @input="cargarDocentes"
            type="text"
            placeholder="Buscar por nombre, CI o email..."
            class="h-11 w-64 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <select
            v-model="estado"
            @change="cargarDocentes"
            class="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
        <button
          @click="abrirModal()"
          class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          + Nuevo Docente
        </button>
      </div>

      <!-- Tabla -->
      <ComponentCard title="Lista de Docentes">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700 dark:text-gray-400">
            <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3">Nombre</th>
                <th class="px-4 py-3">Email</th>
                <th class="px-4 py-3">CI</th>
                <th class="px-4 py-3">Departamento</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="px-4 py-4 text-center">Cargando...</td>
              </tr>
              <tr v-else-if="docentes.length === 0">
                <td colspan="6" class="px-4 py-4 text-center">No se encontraron docentes</td>
              </tr>
              <tr v-for="docente in docentes" :key="docente.id" class="border-t border-gray-100 dark:border-gray-800">
                <td class="px-4 py-3">{{ docente.user?.nombre_completo }}</td>
                <td class="px-4 py-3">{{ docente.user?.email }}</td>
                <td class="px-4 py-3">{{ docente.user?.ci }}</td>
                <td class="px-4 py-3">{{ docente.departamento }}</td>
                <td class="px-4 py-3">
                  <span :class="docente.estado === 'activo' ? 'text-green-600' : 'text-red-600'">
                    {{ docente.estado }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button @click="abrirModal(docente)" class="text-blue-600 hover:underline">Editar</button>
                    <button
                      v-if="docente.estado === 'activo'"
                      @click="desactivar(docente.id)"
                      class="text-red-600 hover:underline"
                    >
                      Desactivar
                    </button>
                    <button
                      v-else
                      @click="reactivar(docente.id)"
                      class="text-green-600 hover:underline"
                    >
                      Reactivar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-lg p-6">
          <h3 class="text-lg font-semibold mb-4">{{ editando ? 'Editar Docente' : 'Nuevo Docente' }}</h3>
          <form @submit.prevent="guardar" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombre completo</label>
              <input v-model="form.nombre_completo" type="text" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input v-model="form.email" type="email" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">CI</label>
              <input v-model="form.ci" type="text" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Departamento</label>
              <input v-model="form.departamento" type="text" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div v-if="!editando">
              <label class="block text-sm font-medium mb-1">Contraseña</label>
              <input v-model="form.password" type="password" required class="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700" />
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
import { getDocentes, createDocente, updateDocente, deleteDocente, reactivarDocente } from '@/api/endpoints'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const docentes = ref([])
const buscar = ref('')
const estado = ref('activo')
const loading = ref(false)
const showModal = ref(false)
const editando = ref(null)
const saving = ref(false)
const errorMsg = ref('')

const form = ref({
  nombre_completo: '',
  email: '',
  ci: '',
  departamento: '',
  password: ''
})

const cargarDocentes = async () => {
  loading.value = true
  try {
    const { data } = await getDocentes({ estado: estado.value, buscar: buscar.value })
    docentes.value = data.data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const abrirModal = (docente = null) => {
  errorMsg.value = ''
  if (docente) {
    editando.value = docente
    form.value = {
      nombre_completo: docente.user?.nombre_completo || '',
      email: docente.user?.email || '',
      ci: docente.user?.ci || '',
      departamento: docente.departamento || '',
      password: ''
    }
  } else {
    editando.value = null
    form.value = { nombre_completo: '', email: '', ci: '', departamento: '', password: '' }
  }
  showModal.value = true
}

const guardar = async () => {
  saving.value = true
  errorMsg.value = ''
  try {
    if (editando.value) {
      await updateDocente(editando.value.id, {
        nombre_completo: form.value.nombre_completo,
        email: form.value.email,
        ci: form.value.ci,
        departamento: form.value.departamento
      })
    } else {
      await createDocente(form.value)
    }
    showModal.value = false
    cargarDocentes()
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'Error al guardar'
  } finally {
    saving.value = false
  }
}

const desactivar = async (id) => {
  if (!confirm('¿Desactivar este docente?')) return
  await deleteDocente(id)
  cargarDocentes()
}

const reactivar = async (id) => {
  await reactivarDocente(id)
  cargarDocentes()
}

onMounted(cargarDocentes)
</script>