<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Validar Marcados" />

    <div class="space-y-6">
      <!-- Filtros -->
      <ComponentCard title="Filtros">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-400">Fecha</label>
            <input
              v-model="fecha"
              @change="cargar"
              type="date"
              class="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-400">CI Docente</label>
            <input
              v-model="ci"
              @input="cargar"
              type="text"
              placeholder="Buscar por CI..."
              class="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>
      </ComponentCard>

      <!-- Tabs -->
      <div class="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          @click="tab = 'pendiente'"
          :class="[
            'px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px',
            tab === 'pendiente'
              ? 'text-brand-600 border-brand-500 dark:text-brand-400'
              : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          Pendientes
        </button>
        <button
          @click="tab = 'invalido'"
          :class="[
            'px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px',
            tab === 'invalido'
              ? 'text-brand-600 border-brand-500 dark:text-brand-400'
              : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          Inválidos
        </button>
      </div>

      <!-- Tabla -->
      <ComponentCard :title="tab === 'pendiente' ? 'Marcados Pendientes' : 'Marcados Inválidos'">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700 dark:text-gray-400">
            <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3">Docente</th>
                <th class="px-4 py-3">CI</th>
                <th class="px-4 py-3">Fecha</th>
                <th class="px-4 py-3">Hora</th>
                <th class="px-4 py-3">Tipo</th>
                <th class="px-4 py-3">Materia</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="8" class="px-4 py-4 text-center">Cargando...</td>
              </tr>
              <tr v-else-if="items.length === 0">
                <td colspan="8" class="px-4 py-4 text-center">No hay marcados en esta categoría</td>
              </tr>
              <tr
                v-for="item in items"
                :key="item.id"
                class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td class="px-4 py-3">{{ item.docente_nombre }}</td>
                <td class="px-4 py-3">{{ item.docente_ci }}</td>
                <td class="px-4 py-3">{{ item.fecha }}</td>
                <td class="px-4 py-3">{{ item.hora_marcado }}</td>
                <td class="px-4 py-3 capitalize">{{ item.tipo_marcado }}</td>
                <td class="px-4 py-3">{{ item.materia }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                    :class="{
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': item.estado === 'pendiente',
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400': item.estado === 'servicio_no_responde',
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': item.estado === 'invalido',
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': item.estado === 'valido'
                    }"
                  >
                    {{ item.estado }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button
                    @click="abrirModal(item)"
                    class="p-2 text-blue-600 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 rounded-lg transition flex items-center gap-1.5"
                    title="Revisar"
                  >
                    <Eye :size="18" />
                    <span>Revisar</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl p-6 my-auto dark:text-gray-300 border border-gray-200 dark:border-gray-800">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Revisar Marcado</h3>
            <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X :size="22" />
            </button>
          </div>

          <!-- Datos -->
          <div class="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div>
              <span class="text-gray-400">Docente:</span>
              <span class="font-semibold ml-2">{{ marcadoSeleccionado?.docente_nombre }}</span>
            </div>
            <div>
              <span class="text-gray-400">CI:</span>
              <span class="font-semibold ml-2">{{ marcadoSeleccionado?.docente_ci }}</span>
            </div>
            <div>
              <span class="text-gray-400">Fecha:</span>
              <span class="font-semibold ml-2">{{ marcadoSeleccionado?.fecha }} {{ marcadoSeleccionado?.hora_marcado }}</span>
            </div>
            <div>
              <span class="text-gray-400">Tipo:</span>
              <span class="font-semibold ml-2 capitalize">{{ marcadoSeleccionado?.tipo_marcado }}</span>
            </div>
            <div>
              <span class="text-gray-400">Materia:</span>
              <span class="font-semibold ml-2">{{ marcadoSeleccionado?.materia }}</span>
            </div>
            <div>
              <span class="text-gray-400">Ubicación:</span>
              <span class="font-semibold ml-2">{{ marcadoSeleccionado?.ubicacion }}</span>
            </div>
          </div>

          <!-- Imágenes: dos pestañas -->
          <div class="mb-4">
            <div class="flex gap-2 border-b border-gray-200 dark:border-gray-800 mb-3">
              <button
                @click="imgTab = 'facial'"
                :class="[
                  'px-4 py-2 text-sm font-semibold border-b-2 -mb-px',
                  imgTab === 'facial'
                    ? 'text-brand-600 border-brand-500'
                    : 'text-gray-500 border-transparent'
                ]"
              >
                Imagen Facial
              </button>
              <button
                @click="imgTab = 'constancia'"
                :class="[
                  'px-4 py-2 text-sm font-semibold border-b-2 -mb-px',
                  imgTab === 'constancia'
                    ? 'text-brand-600 border-brand-500'
                    : 'text-gray-500 border-transparent'
                ]"
              >
                Foto Constancia
              </button>
            </div>

            <div class="bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center min-h-[350px] p-4">
              <div v-if="cargandoImagen" class="text-gray-400">Cargando imagen...</div>
              <div v-else-if="!imagenActual" class="text-gray-400 italic">Imagen no disponible</div>
              <img
                v-else
                :src="imagenActual"
                alt="Imagen del marcado"
                class="max-h-[500px] max-w-full rounded-lg shadow-md"
              />
            </div>
          </div>

          <!-- Observación -->
          <div v-if="puedeValidar" class="mb-4">
            <label class="block text-sm font-medium mb-1">Observación (opcional)</label>
            <textarea
              v-model="observacion"
              rows="2"
              placeholder="Ej: Docente llegó tarde por causas justificadas..."
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            ></textarea>
          </div>

          <!-- Acciones -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              @click="cerrarModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cerrar
            </button>
            <template v-if="puedeValidar">
              <button
                @click="validar('invalido')"
                :disabled="procesando"
                class="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle :size="18" />
                Invalidar
              </button>
              <button
                @click="validar('valido')"
                :disabled="procesando"
                class="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle :size="18" />
                Validar
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { Eye, X, XCircle, CheckCircle } from 'lucide-vue-next'
import { getMarcadosPendientesAdmin, validarMarcadoAdmin } from '@/api/endpoints'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const items = ref([])
const fecha = ref('')
const ci = ref('')
const tab = ref('pendiente')
const loading = ref(false)

const showModal = ref(false)
const marcadoSeleccionado = ref(null)
const imgTab = ref('facial')
const imagenActual = ref(null)
const cargandoImagen = ref(false)
const observacion = ref('')
const procesando = ref(false)

const puedeValidar = ref(false)

const cargar = async () => {
  loading.value = true
  try {
    const { data } = await getMarcadosPendientesAdmin({
      fecha: fecha.value || undefined,
      ci: ci.value || undefined,
      estado: tab.value,
    })
    items.value = data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const abrirModal = async (item) => {
  marcadoSeleccionado.value = item
  imgTab.value = 'facial'
  observacion.value = item.observacion || ''
  showModal.value = true
  puedeValidar.value = ['pendiente', 'servicio_no_responde', 'invalido'].includes(item.estado)
  await cargarImagen()
}

const cerrarModal = () => {
  showModal.value = false
  marcadoSeleccionado.value = null
  imagenActual.value = null
}

const cargarImagen = async () => {
  if (!marcadoSeleccionado.value) return
  cargandoImagen.value = true
  imagenActual.value = null

  try {
    const token = localStorage.getItem('token')
    const baseURL = 'http://186.121.212.87:1011/api'
    const endpoint = imgTab.value === 'facial'
      ? `/admin/marcados/${marcadoSeleccionado.value.id}/imagen-facial`
      : `/admin/marcados/${marcadoSeleccionado.value.id}/imagen-constancia`

    const res = await fetch(baseURL + endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) {
      imagenActual.value = null
      return
    }

    const blob = await res.blob()
    imagenActual.value = URL.createObjectURL(blob)
  } catch (e) {
    imagenActual.value = null
  } finally {
    cargandoImagen.value = false
  }
}

watch(imgTab, cargarImagen)

const validar = async (decision) => {
  procesando.value = true
  try {
    await validarMarcadoAdmin(marcadoSeleccionado.value.id, {
      decision,
      observacion: observacion.value,
    })

    const isDark = document.documentElement.classList.contains('dark')
    cerrarModal()
    cargar()

    Swal.fire({
      title: decision === 'valido' ? '¡Validado!' : '¡Invalidado!',
      text: decision === 'valido'
        ? 'El marcado fue validado correctamente.'
        : 'El marcado fue invalidado.',
      icon: 'success',
      timer: 1800,
      timerProgressBar: true,
      showConfirmButton: false,
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
      customClass: {
        popup: 'font-sans rounded-[2.5rem] border border-emerald-500/20 dark:border-slate-700/60 p-6 shadow-2xl',
        title: 'text-xl font-extrabold text-slate-900 dark:text-slate-100',
        htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-1',
      },
    })
  } catch (e) {
    Swal.fire({
      title: 'Error',
      text: e.response?.data?.message || 'No se pudo procesar la acción.',
      icon: 'error',
    })
  } finally {
    procesando.value = false
  }
}

watch(tab, cargar)

onMounted(cargar)
</script>