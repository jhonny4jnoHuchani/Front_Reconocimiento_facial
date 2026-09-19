<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Ubicaciones" />
    <div class="space-y-6">
      <!-- Filtros y Botón superior -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <select
          v-model="estado"
          @change="cargar"
          class="h-11 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        >
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>

        <button
          @click="abrirModal()"
          class="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nueva Ubicación
        </button>
      </div>

      <!-- Grid de tarjetas -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="item in items"
          :key="item.id"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
        >
          <div>
            <div class="flex items-center justify-between mb-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                :class="getTipoEstilo(item.tipo).bgClass"
              >
                <component
                  :is="getTipoEstilo(item.tipo).icon"
                  class="w-6 h-6"
                  :class="getTipoEstilo(item.tipo).textClass"
                />
              </div>

              <span
                :class="
                  item.estado === 'activo'
                    ? 'border-green-200 bg-green-200 text-green-700 dark:border-green-800/30 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800/30 bg-red-900/20 dark:text-red-400'
                "
                class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
              >
                {{ item.estado === 'activo' ? 'activo' : 'inactivo' }}
              </span>
            </div>

            <h3 class="text-lg font-bold text-gray-900 line-clamp-1 dark:text-white">
              {{ item.nombre_lugar }}
            </h3>

            <div class="mt-2 space-y-1.5">
              <div
                class="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3 dark:bg-white/[0.04]"
              >
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm dark:bg-gray-800 dark:text-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 21h18M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16M15 21V9a2 2 0 012-2h2a2 2 0 012 2v12M9 7h2M9 11h2M9 15h2M17 11h2M17 15h2"
                    />
                  </svg>
                </div>

                <div class="min-w-0">
                  <p class="text-xs text-gray-400">Edificio / Campus</p>
                  <p class="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                    {{ item.edificio_campus }}
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3 dark:bg-white/[0.04]"
              >
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm dark:bg-gray-800 dark:text-gray-400"
                >
                  <svg
                    class="w-3.5 h-3.5 text-brand-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-400">Tolerancia GPS</p>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {{ item.tolerancia_metros }} Metros
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex items-center justify-end border-t border-gray-100 pt-3 dark:border-gray-800 gap-2 text-sm mt-4"
          >
            <button
              @click="abrirModal(item)"
              class="p-2 text-blue-600 border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 rounded-lg transition flex items-center justify-between gap-1.5"
              title="Cambiar"
            >
              <Pencil :size="18" />
              <span>Editar</span>
            </button>
            <button
              v-if="item.estado === 'activo'"
              @click="eliminar(item.id)"
              class="p-2 text-red-600 border-b-2 border-transparent hover:border-red-600 dark:hover:border-red-400 rounded-lg transition flex items-center justify-between gap-1.5"
              title="Eliminar"
            >
              <Ban :size="18" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>


      <ModalUbicacion
        v-model="showModal"
        :ubicacion="editandoItem"
        @saved="onUbicacionGuardada"
      />



    </div>
  </AdminLayout>
</template>
<script setup>
import Swal from 'sweetalert2'
import { Pencil, Ban } from 'lucide-vue-next'
import { ref, onMounted, h } from 'vue'
import { getUbicaciones, deleteUbicacion } from '@/api/endpoints'

import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ModalUbicacion from '@/components/common/ModalUbicacion.vue'

const items = ref([])
const estado = ref('activo')
const showModal = ref(false)
const editandoItem = ref(null)

const IconAula = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 14l9-5-9-5-9 5 9 5z',
    }),
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    }),
  ])

const IconLaboratorio = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.605 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    }),
  ])

const IconAuditorio = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    }),
  ])

const IconExterior = () =>
  h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 5H10.5A2.5 2.5 0 008 7.5v-3.565z',
    }),
  ])

const getTipoEstilo = (tipo) => {
  switch (tipo?.toLowerCase()) {
    case 'laboratorio':
      return {
        icon: IconLaboratorio,
        bgClass: 'bg-purple-100 dark:bg-purple-900/30',
        textClass: 'text-purple-600 dark:text-purple-400',
      }
    case 'auditorio':
      return {
        icon: IconAuditorio,
        bgClass: 'bg-amber-100 dark:bg-amber-900/30',
        textClass: 'text-amber-600 dark:text-amber-400',
      }
    case 'exterior':
      return {
        icon: IconExterior,
        bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
        textClass: 'text-emerald-600 dark:text-emerald-400',
      }
    case 'aula':
    default:
      return {
        icon: IconAula,
        bgClass: 'bg-blue-100 dark:bg-blue-900/30',
        textClass: 'text-blue-600 dark:text-blue-400',
      }
  }
}

const cargar = async () => {
  try {
    const { data } = await getUbicaciones({ estado: estado.value })
    items.value = data.data.data
  } catch (e) {
    console.error('Error cargando ubicaciones:', e)
  }
}

const abrirModal = (item = null) => {
  editandoItem.value = item
  showModal.value = true
}

const onUbicacionGuardada = async () => {
  await cargar()
}

const eliminar = async (id) => {
  const isDark = document.documentElement.classList.contains('dark')
  const result = await Swal.fire({
    title: '¿Eliminar asignación?',
    text: 'Esta acción desactivará la asignación seleccionada.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#1e293b',
    showClass: { popup: 'animate__animated animate__fadeInUp animate__faster' },
    hideClass: { popup: 'animate__animated animate__fadeOutDown animate__faster' },
    customClass: {
      popup: 'font-sans rounded-[3rem] border border-rose-500/20 dark:border-slate-700/60 p-8 shadow-2xl shadow-rose-500/5 backdrop-blur-xl',
      title: 'text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100',
      htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-2',
      confirmButton: 'px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-rose-500/25 ml-3 tracking-wide',
      cancelButton: 'px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 active:scale-95 text-slate-600 font-bold text-sm transition-all duration-200 tracking-wide',
      icon: 'border-0 scale-90 -mb-1',
    },
    buttonsStyling: false,
  })

  if (result.isConfirmed) {
    try {
      await deleteUbicacion(id)
      await cargar()
      Swal.fire({
        title: '¡Eliminado!',
        text: 'La asignación ha sido desactivada con éxito.',
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
    } catch (error) {
      console.error('Error al eliminar asignación:', error)
    }
  }
}

onMounted(cargar)
</script>