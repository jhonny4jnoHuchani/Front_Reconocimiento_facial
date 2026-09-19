<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Resetear Dispositivo" />

    <div class="space-y-6">
      <!-- Búsqueda por CI -->
      <ComponentCard title="Buscar Docente">
        <div class="flex flex-wrap items-center gap-3">
          <input
            v-model="ci"
            @keyup.enter="buscarDocente"
            type="text"
            placeholder="Ingrese el CI del docente..."
            class="h-11 flex-1 min-w-[250px] rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 transition-colors hover:border-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <button
            @click="buscarDocente"
            :disabled="buscando || !ci"
            class="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search :size="18" />
            {{ buscando ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>
      </ComponentCard>

      <!-- Resultado -->
      <ComponentCard v-if="docente" title="Docente Encontrado">
        <div class="space-y-4">
          <!-- Datos del docente -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <p class="text-xs text-gray-400 uppercase">Nombre</p>
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {{ docente.user?.nombre_completo || 'Sin nombre' }}
              </p>
            </div>
            <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <p class="text-xs text-gray-400 uppercase">Email</p>
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {{ docente.user?.email || 'Sin email' }}
              </p>
            </div>
            <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <p class="text-xs text-gray-400 uppercase">CI</p>
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {{ docente.user?.ci || 'Sin CI' }}
              </p>
            </div>
            <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <p class="text-xs text-gray-400 uppercase">Departamento</p>
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {{ docente.departamento || 'Sin departamento' }}
              </p>
            </div>
            <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <p class="text-xs text-gray-400 uppercase">Estado</p>
              <span
                class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                :class="{
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                    docente.estado === 'activo',
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400':
                    docente.estado !== 'activo'
                }"
              >
                {{ docente.estado }}
              </span>
            </div>
            <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <p class="text-xs text-gray-400 uppercase">Dispositivo</p>
              <span
                class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                :class="{
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400':
                    docente.user?.device_id,
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400':
                    !docente.user?.device_id
                }"
              >
                {{ docente.user?.device_id ? 'Registrado' : 'Sin registrar' }}
              </span>
            </div>

            <!-- Registro facial -->
            <div class="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <p class="text-xs text-gray-400 uppercase">Registro Facial</p>
              <div class="flex items-center gap-2 mt-1">
                <ScanFace
                  :size="18"
                  :class="{
                    'text-green-600 dark:text-green-400': estadoFacial?.total_embeddings >= 50,
                    'text-yellow-600 dark:text-yellow-400': estadoFacial && estadoFacial.total_embeddings < 50,
                    'text-gray-400': !estadoFacial
                  }"
                />
                <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <template v-if="!estadoFacial">Sin información</template>
                  <template v-else-if="estadoFacial.total_embeddings >= 50">
                    Completo ({{ estadoFacial.total_embeddings }} embeddings)
                  </template>
                  <template v-else>
                    Incompleto ({{ estadoFacial.total_embeddings || 0 }}/50)
                  </template>
                </span>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              @click="limpiar"
              class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Limpiar
            </button>
            <button
              v-if="docente.user?.device_id"
              @click="resetearDispositivo"
              :disabled="reseteando"
              class="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              <Smartphone :size="18" />
              {{ reseteando ? 'Reseteando...' : 'Resetear Dispositivo' }}
            </button>
            <div
              v-else
              class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 italic"
            >
              <Info :size="18" />
              Este docente no tiene dispositivo registrado.
            </div>
          </div>
        </div>
      </ComponentCard>

      <!-- Sin resultados -->
      <ComponentCard v-if="buscado && !docente && !buscando" title="Sin resultados">
        <div class="flex flex-col items-center justify-center py-8 text-center">
          <div class="rounded-full bg-red-100 p-4 dark:bg-red-900/30 mb-4">
            <SearchX :size="32" class="text-red-600 dark:text-red-400" />
          </div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
            No se encontró ningún docente con ese CI.
          </p>
          <p class="text-xs text-gray-400 mt-1">
            Verifique el número e intente nuevamente.
          </p>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { Search, SearchX, Smartphone, Info, ScanFace } from 'lucide-vue-next'
import { buscarDocentePorCi, resetDispositivo, getReconocimientoEstado } from '@/api/endpoints'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'

const ci = ref('')
const docente = ref(null)
const estadoFacial = ref(null)
const buscando = ref(false)
const buscado = ref(false)
const reseteando = ref(false)

const buscarDocente = async () => {
  if (!ci.value) return

  buscando.value = true
  buscado.value = false
  docente.value = null
  estadoFacial.value = null

  try {
    const { data } = await buscarDocentePorCi(ci.value)
    docente.value = data.data

    // Consultar estado facial (tolerante a fallos)
    if (docente.value?.id) {
      try {
        const { data: facial } = await getReconocimientoEstado(docente.value.id)
        estadoFacial.value = facial
      } catch (err) {
        estadoFacial.value = null
      }
    }
  } catch (e) {
    // 404 = no encontrado, no es error real
    docente.value = null
  } finally {
    buscado.value = true
    buscando.value = false
  }
}

const limpiar = () => {
  ci.value = ''
  docente.value = null
  estadoFacial.value = null
  buscado.value = false
}

const resetearDispositivo = async () => {
  const isDark = document.documentElement.classList.contains('dark')
  const result = await Swal.fire({
    title: '¿Resetear dispositivo?',
    html: `El docente <b>${docente.value.user?.nombre_completo}</b> deberá iniciar sesión desde un nuevo dispositivo.<br/><br/>Se cerrarán todas sus sesiones activas.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, resetear',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',
    showClass: { popup: 'animate__animated animate__fadeInUp animate__faster' },
    hideClass: { popup: 'animate__animated animate__fadeOutDown animate__faster' },
    customClass: {
      popup: 'font-sans rounded-[3rem] border border-purple-500/20 dark:border-slate-700/60 p-8 shadow-2xl backdrop-blur-xl',
      title: 'text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100',
      htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-2',
      confirmButton: 'px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 active:scale-95 text-white font-bold text-sm transition-all duration-200 shadow-lg ml-3 tracking-wide',
      cancelButton: 'px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 active:scale-95 text-slate-600 font-bold text-sm transition-all duration-200 tracking-wide',
      icon: 'border-0 scale-90 -mb-1',
    },
    buttonsStyling: false,
  })

  if (result.isConfirmed) {
    reseteando.value = true
    try {
      await resetDispositivo(docente.value.user.id)
      // Refrescar datos del docente
      await buscarDocente()

      Swal.fire({
        title: '¡Reseteado!',
        text: 'El dispositivo fue reseteado correctamente.',
        icon: 'success',
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#f8fafc' : '#1e293b',
        showClass: { popup: 'animate__animated animate__fadeInUp animate__faster' },
        hideClass: { popup: 'animate__animated animate__fadeOutDown animate__faster' },
        customClass: {
          popup: 'font-sans rounded-[2.5rem] border border-emerald-500/20 dark:border-slate-700/60 p-6 shadow-2xl',
          title: 'text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight',
          htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-1',
        },
      })
    } catch (e) {
      Swal.fire({
        title: 'Error',
        text: e.response?.data?.message || 'No se pudo resetear el dispositivo.',
        icon: 'error',
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#f8fafc' : '#1e293b',
      })
    } finally {
      reseteando.value = false
    }
  }
}
</script>