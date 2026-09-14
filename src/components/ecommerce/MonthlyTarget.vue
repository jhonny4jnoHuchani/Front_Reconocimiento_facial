<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          Actividad en Tiempo Real
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Últimas marcaciones registradas hoy
        </p>
      </div>
      <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        En vivo
      </span>
    </div>

    <div class="space-y-3 max-h-[350px] overflow-y-auto pr-1">
      <TransitionGroup name="list">
        <div 
          v-for="registro in marcaciones" 
          :key="registro.id"
          class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 transition-all dark:border-gray-800 dark:bg-gray-800/50"
        >
          <div class="flex items-center gap-3">
          
            <div class="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <img 
                v-if="registro.docente_foto" 
                :src="registro.docente_foto" 
                :alt="registro.docente_nombre"
                class="h-full w-full object-cover"
                @error="registro.docente_foto = null"
              />
              <div 
                v-else 
                class="flex h-full w-full items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200"
              >
                {{ obtenerIniciales(registro.docente_nombre) }}
              </div>
            </div>

            <div>
              <p class="text-sm font-semibold text-gray-800 dark:text-white">
                {{ registro.docente_nombre }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ registro.hora }}
              </p>
            </div>
          </div>

          <div>
            <span 
              v-if="registro.tipo === 'entrada'"
              class="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            >
              ↓ Entrada
            </span>
            <span 
              v-else
              class="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
            >
              ↑ Salida
            </span>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="marcaciones.length === 0" class="py-8 text-center text-sm text-gray-400">
        Esperando marcaciones del día...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getMarcadosPendientesAdmin, getDocentes } from '@/api/endpoints' 

const marcaciones = ref([])
const mapaDocentes = ref(new Map())
let timerPolling = null

const obtenerFechaHoy = () => {
  const hoy = new Date()
  const year = hoy.getFullYear()
  const month = String(hoy.getMonth() + 1).padStart(2, '0')
  const day = String(hoy.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const obtenerIniciales = (nombre) => {
  if (!nombre || nombre === 'Sin nombre') return 'D'
  return nombre
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Genera la URL completa de la foto de perfil
const construirUrlFoto = (pathFoto) => {
  if (!pathFoto) return null

  // Si viene un objeto o array por error en la propiedad, intentamos extraer el string de la ruta
  if (typeof pathFoto === 'object') {
    pathFoto = pathFoto.url || pathFoto.path || pathFoto[0]?.url || pathFoto[0]?.path || null
  }

  if (!pathFoto || typeof pathFoto !== 'string') return null

  if (pathFoto.startsWith('http://') || pathFoto.startsWith('https://')) {
    return pathFoto
  }

  const baseURL = 'http://186.121.212.87:1011/storage/' 
  return `${baseURL}${pathFoto.replace(/^\/+/, '')}`
}

const cargarMapaDocentes = async () => {
  try {
    const { data } = await getDocentes()
    const lista = data?.data?.data || data?.data || []
    
    const mapa = new Map()
    
    lista.forEach(docente => {
      const nombre = docente.user?.nombre_completo || docente.user?.name || 'Docente'
      
      // Extrae la propiedad correcta de la foto (string o primer ítem de array)
      const rawFoto = docente.user?.foto_perfil || 
                      docente.user?.fotos_perfil || 
                      docente.user?.foto || 
                      docente.foto_perfil || 
                      docente.foto

      const fotoUrl = construirUrlFoto(rawFoto)

      const infoDocente = { nombre, foto: fotoUrl }

      // Mapeamos tanto por ID de docente como por ID de usuario para asegurar la coincidencia
      if (docente.id) mapa.set(docente.id, infoDocente)
      if (docente.user_id) mapa.set(docente.user_id, infoDocente)
    })

    mapaDocentes.value = mapa
  } catch (error) {
    console.error('Error al obtener la lista de docentes:', error)
  }
}

const cargarMarcaciones = async () => {
  try {
    const response = await getMarcadosPendientesAdmin({
      fecha: obtenerFechaHoy()
    })

    if (response.data?.success || Array.isArray(response.data?.data)) {
      const lista = response.data.data || []

      marcaciones.value = lista.map(item => {
        const datosDocente = mapaDocentes.value.get(item.docente_id) || mapaDocentes.value.get(item.user_id)
        
        const nombreResuelto = item.docente_nombre !== 'Sin nombre' && item.docente_nombre
          ? item.docente_nombre 
          : (datosDocente?.nombre || 'Docente')
        const fotoResuelta = datosDocente?.foto 

        return {
          id: item.id,
          docente_nombre: nombreResuelto,
          docente_foto: fotoResuelta,
          hora: item.hora_marcado || item.hora,
          tipo: item.tipo_marcado || item.tipo
        }
      })
    }
  } catch (error) {
    console.error('Error al consultar marcaciones:', error)
  }
}

onMounted(async () => {
  await cargarMapaDocentes()
  await cargarMarcaciones()

  timerPolling = setInterval(cargarMarcaciones, 3000)
})

onUnmounted(() => {
  if (timerPolling) clearInterval(timerPolling)
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-15px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>