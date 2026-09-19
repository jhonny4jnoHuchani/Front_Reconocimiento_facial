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
            class="h-11 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 transition-colors hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <select
            v-model="estado"
            @change="cargarDocentes"
            class="h-11 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 transition-colors hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="abrirModalImportar"
            class="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <UploadCloud :size="18" />
            Importar Docente
          </button>
          <button
            @click="abrirModal()"
            class="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            + Nuevo Docente
          </button>
        </div>
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
                  <span
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                    :class="{
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': docente.estado === 'activo',
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': docente.estado !== 'activo'
                    }"
                  >
                    {{ docente.estado }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button
                      @click="abrirModal(docente)"
                      class="p-2 text-blue-600 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 rounded-lg transition flex items-center gap-1.5"
                    >
                      <Pencil :size="18" />
                      <span>Editar</span>
                    </button>
                    <button
                      v-if="docente.estado === 'activo'"
                      @click="desactivar(docente.id)"
                      class="p-2 text-red-600 border-b-2 border-transparent hover:border-red-600 dark:hover:border-red-400 rounded-lg transition flex items-center gap-1.5"
                    >
                      <Ban :size="18" />
                      <span>Desactivar</span>
                    </button>
                    <button
                      v-else
                      @click="reactivar(docente.id)"
                      class="p-2 text-green-600 border-b-2 border-transparent hover:border-green-600 dark:hover:border-green-400 rounded-lg transition flex items-center gap-1.5"
                    >
                      <RotateCcw :size="18" />
                      <span>Activar</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <!-- Modal crear/editar docente -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white dark:bg-gray-900 rounded-4xl shadow-lg w-full max-w-lg p-6 dark:text-gray-300 border border-gray-300">
          <h3 class="text-lg font-semibold mb-4">{{ editando ? 'Editar Docente' : '👨‍⚕️Nuevo Docente' }}</h3>
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
              <button type="button" @click="showModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancelar</button>
              <button type="submit" :disabled="saving" class="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600">
                {{ saving ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL IMPORTAR DOCENTE -->
      <div v-if="showImportar" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
        <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-6xl p-6 my-auto dark:text-gray-300 border border-gray-200 dark:border-gray-800">
          
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
              <UploadCloud class="inline-block mr-2" :size="22" />
              Importar Docente desde UPEA
            </h3>
            <button @click="cerrarImportar" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X :size="24" />
            </button>
          </div>

          <!-- PASO 1: Formulario -->
          <div v-if="pasoImportar === 1" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">CI del Docente</label>
                <input
                  v-model="importForm.ci"
                  @keyup.enter="previsualizar"
                  type="text"
                  placeholder="Ej: 7078703"
                  class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Carrera</label>
                <select
                  v-model="importForm.carrera_id_externo"
                  class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700"
                >
                  <option :value="null" disabled>Seleccione una carrera</option>
                  <option v-for="c in carreras" :key="c.id" :value="c.carrera_id_externo">
                    {{ c.nombre }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Gestión</label>
                <input
                  v-model.number="importForm.gestion"
                  type="number"
                  class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
            <p v-if="importError" class="text-sm text-red-500">{{ importError }}</p>
            <div class="flex justify-end gap-3 pt-2">
              <button
                @click="cerrarImportar"
                class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
              <button
                @click="previsualizar"
                :disabled="previsualizando || !importForm.ci || !importForm.carrera_id_externo"
                class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                <Search :size="18" />
                {{ previsualizando ? 'Buscando...' : 'Previsualizar' }}
              </button>
            </div>
          </div>

          <!-- PASO 2: Preview -->
          <div v-if="pasoImportar === 2 && preview" class="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
            
            <!-- Avisos -->
            <div class="rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/40 p-4 text-sm text-blue-800 dark:text-blue-200">
              <p class="font-semibold mb-1">{{ preview.docente.nombre_completo }} — CI: {{ preview.docente.ci }}</p>
              <p>
                <template v-if="preview.docente.existe_en_bd">
                  ✅ Este docente <b>ya existe</b> en el sistema. Se actualizarán sus datos.
                </template>
                <template v-else>
                  🆕 Docente <b>nuevo</b>. Se creará al confirmar la importación.
                </template>
              </p>
              <p class="mt-1">
                Carrera: <b>{{ preview.carrera.nombre }}</b> · Gestión: <b>{{ preview.gestion || 'Todas' }}</b>
              </p>
              <p class="mt-2 font-semibold">
                Total: {{ preview.total_filas }} horarios —
                <span class="text-green-700 dark:text-green-400">{{ filasImportadas.length }} ya importados</span> ·
                <span class="text-amber-700 dark:text-amber-400">{{ filasNuevas.length }} nuevos</span>
              </p>
            </div>

            <!-- Tabla: Ya importados -->
            <div v-if="filasImportadas.length > 0">
              <h4 class="text-sm font-bold mb-2 text-green-700 dark:text-green-400 uppercase">
                ✅ Horarios ya importados (solo lectura)
              </h4>
              <div class="overflow-x-auto border border-green-200 dark:border-green-900/40 rounded-xl">
                <table class="w-full text-xs text-left text-gray-700 dark:text-gray-400">
                  <thead class="bg-green-50 dark:bg-green-900/20">
                    <tr>
                      <th class="px-3 py-2">Materia</th>
                      <th class="px-3 py-2">Sigla</th>
                      <th class="px-3 py-2">Día</th>
                      <th class="px-3 py-2">Hora</th>
                      <th class="px-3 py-2">Paralelo</th>
                      <th class="px-3 py-2">Aula</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="fila in filasImportadas"
                      :key="'imp-' + fila.index"
                      class="border-t border-green-100 dark:border-green-900/30"
                    >
                      <td class="px-3 py-2">{{ fila.materia }}</td>
                      <td class="px-3 py-2">{{ fila.sigla }}</td>
                      <td class="px-3 py-2 capitalize">{{ fila.dia }}</td>
                      <td class="px-3 py-2">{{ fila.hora_inicio }} - {{ fila.hora_fin }}</td>
                      <td class="px-3 py-2">{{ fila.nivel }}° "{{ fila.paralelo }}"</td>
                      <td class="px-3 py-2">{{ fila.ambiente }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Tabla: Nuevos -->
            <div v-if="filasNuevas.length > 0">
              <h4 class="text-sm font-bold mb-2 text-amber-700 dark:text-amber-400 uppercase">
                🆕 Horarios nuevos por importar
              </h4>
              <div class="overflow-x-auto border border-amber-200 dark:border-amber-900/40 rounded-xl">
                <table class="w-full text-xs text-left text-gray-700 dark:text-gray-400">
                  <thead class="bg-amber-50 dark:bg-amber-900/20">
                    <tr>
                      <th class="px-3 py-2 w-12">Incluir</th>
                      <th class="px-3 py-2">Materia</th>
                      <th class="px-3 py-2">Sigla</th>
                      <th class="px-3 py-2">Día</th>
                      <th class="px-3 py-2">Hora</th>
                      <th class="px-3 py-2">Paralelo</th>
                      <th class="px-3 py-2">Aula</th>
                      <th class="px-3 py-2 min-w-[220px]">Ubicación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="fila in filasNuevas"
                      :key="'new-' + fila.index"
                      class="border-t border-amber-100 dark:border-amber-900/30"
                      :class="{ 'bg-amber-50/50 dark:bg-amber-900/10': !fila.incluir }"
                    >
                      <td class="px-3 py-2 text-center">
                        <input type="checkbox" v-model="fila.incluir" class="rounded border-gray-300" />
                      </td>
                      <td class="px-3 py-2">{{ fila.materia }}</td>
                      <td class="px-3 py-2">{{ fila.sigla }}</td>
                      <td class="px-3 py-2 capitalize">{{ fila.dia }}</td>
                      <td class="px-3 py-2">{{ fila.hora_inicio }} - {{ fila.hora_fin }}</td>
                      <td class="px-3 py-2">{{ fila.nivel }}° "{{ fila.paralelo }}"</td>
                      <td class="px-3 py-2">
                        {{ fila.ambiente }}
                        <span
                          v-if="fila.ubicacion_match?.existe && !fila.ubicacion_match.tiene_coordenadas"
                          class="ml-1 inline-block px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        >Sin geocerca</span>
                      </td>


                      <td class="px-3 py-2">
                        <div class="flex gap-1">
                          <select
                            v-model="fila.ubicacion_id"
                            class="h-9 flex-1 rounded-lg border border-gray-300 px-2 text-xs dark:bg-gray-800 dark:border-gray-700"
                          >
                            <option :value="null">-- Seleccionar --</option>
                            <option v-for="u in ubicaciones" :key="u.id" :value="u.id">
                              {{ u.nombre_lugar }} ({{ u.tipo }})
                            </option>
                          </select>
                          <button
                            @click="abrirCrearUbicacion(fila)"
                            class="h-9 px-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 flex items-center"
                            title="Crear ubicación"
                          >
                            <Plus :size="14" />
                          </button>
                        </div>
                      </td>



                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="filasNuevas.length === 0" class="text-center py-6 text-gray-500 italic">
              No hay horarios nuevos para importar en esta carrera.
            </div>

            <div class="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                @click="pasoImportar = 1"
                class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Volver
              </button>
              <button
                @click="confirmarImportar"
                :disabled="confirmando || seleccionadas.length === 0"
                class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle :size="18" />
                {{ confirmando ? 'Importando...' : `Importar ${seleccionadas.length} horarios` }}
              </button>
            </div>
          </div>
        </div>
      </div>
<ModalUbicacion
  v-model="showCrearUbicacion"
  :prefill="{
    nombre_lugar: filaParaUbicacion?.ambiente || '',
    tipo: filaParaUbicacion?.tipo_ambiente || 'aula',
    edificio_campus: filaParaUbicacion?.edificio || '',
    piso: filaParaUbicacion?.piso || 0,
    tolerancia_metros: 50,
  }"
  :carrera-id="preview?.carrera?.carrera_id"
  :carrera-nombre="preview?.carrera?.nombre || ''"
  @saved="onUbicacionCreada"
/>
    </div>

    
  </AdminLayout>
</template>

<script setup>
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { Pencil, Ban, RotateCcw, UploadCloud, Search, X, CheckCircle, Plus } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
import {
  getDocentes, createDocente, updateDocente, deleteDocente, reactivarDocente,
  getCarreras, getUbicaciones, getImportarPreview, confirmarImportacion
} from '@/api/endpoints'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ModalUbicacion from '@/components/common/ModalUbicacion.vue'

/* ============================================================
   CRUD DOCENTES
   ============================================================ */
const docentes = ref([])
const buscar = ref('')
const estado = ref('activo')
const loading = ref(false)
const showModal = ref(false)
const editando = ref(null)
const saving = ref(false)
const errorMsg = ref('')
const showCrearUbicacion = ref(false)
const filaParaUbicacion = ref(null)

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
  const isDark = document.documentElement.classList.contains('dark')
  const result = await Swal.fire({
    title: '¿Desactivar docente?',
    text: 'Esta acción desactivará al docente seleccionado.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',
    confirmButtonColor: '#ef4444',
  })

  if (result.isConfirmed) {
    await deleteDocente(id)
    cargarDocentes()
    Swal.fire({
      title: '¡Desactivado!',
      text: 'El docente ha sido desactivado.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
    })
  }
}

const reactivar = async (id) => {
  const isDark = document.documentElement.classList.contains('dark')
  const result = await Swal.fire({
    title: '¿Reactivar este docente?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, reactivar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',
  })

  if (result.isConfirmed) {
    await reactivarDocente(id)
    cargarDocentes()
    Swal.fire({
      title: 'Reactivado',
      text: 'El docente ha sido reactivado.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
    })
  }
}

/* ============================================================
   MODAL IMPORTAR DOCENTE
   ============================================================ */
const showImportar = ref(false)
const pasoImportar = ref(1)
const previsualizando = ref(false)
const confirmando = ref(false)
const importError = ref('')
const preview = ref(null)
const carreras = ref([])
const ubicaciones = ref([])

const importForm = ref({
  ci: '',
  carrera_id_externo: null,
  gestion: null,
})

const abrirModalImportar = async () => {
  showImportar.value = true
  pasoImportar.value = 1
  previsualizando.value = false
  confirmando.value = false
  importError.value = ''
  preview.value = null
  importForm.value = { ci: '', carrera_id_externo: null, gestion: null }

  try {
    const { data } = await getCarreras({ estado: 'activo' })
    carreras.value = data.data.data
  } catch (e) {
    console.error('Error cargando carreras', e)
  }
}

const cerrarImportar = () => {
  showImportar.value = false
  preview.value = null
}

const previsualizar = async () => {
  previsualizando.value = true
  importError.value = ''
  try {
    const { data } = await getImportarPreview({
      ci: importForm.value.ci,
      carrera_id: importForm.value.carrera_id_externo,
      gestion: importForm.value.gestion,
    })

    if (!data.success) {
      importError.value = data.message || 'No se encontraron horarios.'
      return
    }

    // Separar filas
    data.filas = data.filas.map(f => ({
      ...f,
      incluir: !f.ya_importado,
      ubicacion_id: f.ubicacion_match?.existe ? f.ubicacion_match.ubicacion_id : null,
    }))

    preview.value = data

    // Cargar ubicaciones de la carrera (id interno)
    if (data.carrera.carrera_id) {
      const { data: ub } = await getUbicaciones({ estado: 'activo', carrera_id: data.carrera.carrera_id })
      ubicaciones.value = ub.data.data
    } else {
      ubicaciones.value = []
    }

    pasoImportar.value = 2
  } catch (e) {
    importError.value = e.response?.data?.message || 'Error al previsualizar.'
  } finally {
    previsualizando.value = false
  }
}

const filasImportadas = computed(() => preview.value?.filas.filter(f => f.ya_importado) || [])
const filasNuevas = computed(() => preview.value?.filas.filter(f => !f.ya_importado) || [])
const seleccionadas = computed(() => filasNuevas.value.filter(f => f.incluir))

const abrirCrearUbicacion = (fila) => {
  filaParaUbicacion.value = fila
  showCrearUbicacion.value = true
}

const onUbicacionCreada = (ubicacion) => {
  // Agregar al listado de ubicaciones
  ubicaciones.value.push(ubicacion)

  // Asignar a la fila que la invocó
  if (filaParaUbicacion.value) {
    filaParaUbicacion.value.ubicacion_id = ubicacion.id
  }

  filaParaUbicacion.value = null
}

const confirmarImportar = async () => {
  confirmando.value = true
  try {
    const payload = {
      ci: parseInt(importForm.value.ci),
      carrera_id: importForm.value.carrera_id_externo,
      gestion: importForm.value.gestion,
      filas: seleccionadas.value.map(f => ({
        index: f.index,
        incluir: true,
        ubicacion_id: f.ubicacion_id,
      })),
    }

    // Validar ubicación antes de enviar
    const sinUbicacion = payload.filas.filter(f => !f.ubicacion_id)
    if (sinUbicacion.length > 0) {
      Swal.fire({
        title: 'Faltan ubicaciones',
        text: `Debes asignar ubicación a ${sinUbicacion.length} horario(s) antes de importar.`,
        icon: 'warning',
      })
      confirmando.value = false
      return
    }

    const { data } = await confirmarImportacion(payload)

    if (!data.success) {
      Swal.fire({ title: 'Error', text: data.message, icon: 'error' })
      return
    }

    const r = data.resumen
    const isDark = document.documentElement.classList.contains('dark')

    await Swal.fire({
      title: '¡Importación completada!',
      html: `
        <div style="text-align:left; font-size: 0.9rem;">
          <p><b>${r.horarios}</b> horarios importados/actualizados</p>
          <p>Carrera: ${r.carrera ? 'creada' : 'existente'}</p>
          <p>Docente: ${r.docente ? 'creado' : 'existente'}</p>
          <p>Materias: ${r.materia}</p>
          <p>Paralelos: ${r.paralelos}</p>
        </div>
      `,
      icon: 'success',
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
    })

    cerrarImportar()
    cargarDocentes()
  } catch (e) {
    Swal.fire({
      title: 'Error',
      text: e.response?.data?.message || 'No se pudo importar.',
      icon: 'error',
    })
  } finally {
    confirmando.value = false
  }
}

onMounted(cargarDocentes)
</script>