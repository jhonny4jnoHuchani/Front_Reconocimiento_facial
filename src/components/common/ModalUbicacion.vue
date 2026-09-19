<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm"
  >
    <div
      class="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl sm:rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 overflow-hidden"
    >
      <!-- Header -->
      <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0">
        <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          {{ editando ? 'Editar Ubicación' : 'Nueva Ubicación' }}
        </h3>
        <button
          @click="cerrar"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg transition-colors"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 sm:p-6 overflow-y-auto space-y-4">
        <form id="modalUbicacionForm" @submit.prevent="guardar" class="space-y-4">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre
              </label>
              <input
                v-model="form.nombre_lugar"
                type="text"
                required
                class="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo
              </label>
              <select
                v-model="form.tipo"
                class="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="aula">Aula</option>
                <option value="laboratorio">Laboratorio</option>
                <option value="auditorio">Auditorio</option>
                <option value="exterior">Exterior</option>
                <option value="clinica">Clínica</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Edificio / Campus
              </label>
              <input
                v-model="form.edificio_campus"
                type="text"
                class="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Tolerancia (metros)
              </label>
              <input
                v-model.number="form.tolerancia_metros"
                type="number"
                min="10"
                max="500"
                class="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Piso
              </label>
              <input
                v-model.number="form.piso"
                type="number"
                min="0"
                max="20"
                class="h-10 w-full rounded-xl border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div v-if="carreraNombre">
              <label class="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Carrera
              </label>
              <input
                :value="carreraNombre"
                type="text"
                disabled
                class="h-10 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label class="mb-2 block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              Dibujar polígono en el mapa
            </label>
            <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <MapaPoligono v-if="modelValue" v-model="coordenadas" />
            </div>
          </div>

          <p v-if="errorMsg" class="text-sm font-medium text-red-500">
            {{ errorMsg }}
          </p>
        </form>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          @click="cerrar"
          class="w-full sm:w-auto rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="modalUbicacionForm"
          :disabled="saving"
          class="w-full sm:w-auto rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 disabled:opacity-50"
        >
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { createUbicacion, updateUbicacion } from '@/api/endpoints'
import MapaPoligono from '@/components/common/MapaPoligono.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  ubicacion: { type: Object, default: null },
  prefill: { type: Object, default: null },
  carreraId: { type: [Number, String], default: null },
  carreraNombre: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'saved'])

const form = ref({
  nombre_lugar: '',
  tipo: 'aula',
  edificio_campus: '',
  tolerancia_metros: 50,
  piso: 0,
})

const coordenadas = ref([])
const saving = ref(false)
const errorMsg = ref('')

const editando = ref(false)

const cerrar = () => {
  emit('update:modelValue', false)
}

const inicializar = () => {
  errorMsg.value = ''
  coordenadas.value = []

  if (props.ubicacion) {
    // Modo edición
    editando.value = true
    form.value = {
      nombre_lugar: props.ubicacion.nombre_lugar || '',
      tipo: props.ubicacion.tipo || 'aula',
      edificio_campus: props.ubicacion.edificio_campus || '',
      tolerancia_metros: props.ubicacion.tolerancia_metros || 50,
      piso: props.ubicacion.piso || 0,
    }

    try {
      if (Array.isArray(props.ubicacion.coordenadas)) {
        coordenadas.value = JSON.parse(JSON.stringify(props.ubicacion.coordenadas))
      } else if (typeof props.ubicacion.coordenadas === 'string') {
        coordenadas.value = JSON.parse(props.ubicacion.coordenadas)
      }
    } catch (err) {
      coordenadas.value = []
    }
  } else {
    // Modo creación (con prefill opcional)
    editando.value = false
    form.value = {
      nombre_lugar: props.prefill?.nombre_lugar || '',
      tipo: props.prefill?.tipo || 'aula',
      edificio_campus: props.prefill?.edificio_campus || '',
      tolerancia_metros: props.prefill?.tolerancia_metros || 50,
      piso: props.prefill?.piso || 0,
    }
  }
}

watch(() => props.modelValue, (abierto) => {
  if (abierto) inicializar()
})

const guardar = async () => {
  saving.value = true
  errorMsg.value = ''

  try {
    if (coordenadas.value.length < 3) {
      errorMsg.value = 'El polígono debe tener al menos 3 puntos'
      saving.value = false
      return
    }

    const payload = {
      ...form.value,
      coordenadas: coordenadas.value,
    }

    if (props.carreraId) {
      payload.carrera_id = props.carreraId
    }

    let respuesta
    if (props.ubicacion) {
      respuesta = await updateUbicacion(props.ubicacion.id, payload)
    } else {
      respuesta = await createUbicacion(payload)
    }

    emit('saved', respuesta.data.data || respuesta.data)
    cerrar()
  } catch (e) {
    console.error('Error guardando ubicación:', e)
    errorMsg.value = e.response?.data?.message || 'Error al guardar la ubicación'
  } finally {
    saving.value = false
  }
}
</script>