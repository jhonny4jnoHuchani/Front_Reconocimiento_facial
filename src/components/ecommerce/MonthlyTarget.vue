<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
    <!-- Cabecera -->
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          Actividad en Tiempo Real
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Sincronización directa por marcados pendientes de hoy
        </p>
      </div>
      <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        En vivo
      </span>
    </div>

    <!-- SECCIÓN SUPERIOR: Clases con marcaciones (Suben automáticamente al marcar) -->
    <div class="space-y-3 max-h-[280px] overflow-y-auto pr-1 mb-6">
      <TransitionGroup name="list">
        <div
          v-for="registro in marcacionesUnificadas"
          :key="registro.key"
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
              <p class="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                {{ registro.materia }} <span class="text-gray-400">({{ registro.horario }})</span>
              </p>
              <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span>Entrada: <strong class="text-gray-700 dark:text-gray-300">{{ registro.entrada || '--:--' }}</strong></span>
                <span>•</span>
                <span>Salida: <strong class="text-gray-700 dark:text-gray-300">{{ registro.salida || '--:--' }}</strong></span>
              </div>
            </div>
          </div>

          <!-- Badges de Estado Independientes -->
          <div class="flex items-center gap-1.5">
            <span
              :class="registro.entrada ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'"
              class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold"
            >
              ↓ Entrada
            </span>
            <span
              :class="registro.salida ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'"
              class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold"
            >
              ↑ Salida
            </span>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="marcacionesUnificadas.length === 0" class="py-6 text-center text-sm text-gray-400">
        Esperando marcaciones de entrada...
      </div>
    </div>

    <!-- SECCIÓN INFERIOR: Clases programadas que aún faltan marcar -->
    <div class="border-t border-gray-100 pt-4 dark:border-gray-800">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
        <span>Faltan marcar hoy (Con clases programadas)</span>
        <span class="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700 dark:bg-rose-950 dark:text-rose-300">
          {{ clasesFaltantesHoy.length }}
        </span>
      </h4>

      <div class="max-h-[160px] overflow-y-auto pr-1 space-y-2">
        <div
          v-for="clase in clasesFaltantesHoy"
          :key="clase.id"
          class="flex items-center justify-between rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-2.5 dark:border-gray-800 dark:bg-gray-800/20"
        >
          <div class="flex items-center gap-2.5">
            <div class="h-8 w-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <img
                v-if="clase.foto"
                :src="clase.foto"
                :alt="clase.nombre"
                class="h-full w-full object-cover"
                @error="clase.foto = null"
              />
              <div v-else class="flex h-full w-full items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                {{ obtenerIniciales(clase.nombre) }}
              </div>
            </div>
            <div>
              <span class="text-xs font-medium text-gray-700 dark:text-gray-200 block">
                {{ clase.nombre }} <span class="text-[11px] text-gray-400 font-normal">({{ clase.materia }})</span>
              </span>
              <span class="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                Horario: {{ clase.horario }}
              </span>
            </div>
          </div>
          <span class="text-[11px] font-medium text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded">
            Sin marcar
          </span>
        </div>

        <div v-if="clasesFaltantesHoy.length === 0" class="py-3 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          ¡Todas las clases programadas para hoy ya tienen marcación! 🎉
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getDocentes, getHorarios, getMarcadosPendientesAdmin } from '@/api/endpoints'

const marcacionesRaw = ref([])
const mapaDocentes = ref(new Map())
const docentesConClaseHoy = ref([])
let timerPolling = null

const TOLERANCIA_ANTES_MIN = 20
const TOLERANCIA_DESPUES_MIN = 20

const obtenerFechaHoy = () => {
  const hoy = new Date()
  const year = hoy.getFullYear()
  const month = String(hoy.getMonth() + 1).padStart(2, '0')
  const day = String(hoy.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const obtenerNombreDiaActual = () => {
  const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  return dias[new Date().getDay()]
}

const obtenerIniciales = (nombre) => {
  if (!nombre || nombre === 'Sin nombre' || nombre === 'Docente') return 'D'
  return nombre
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const construirUrlFoto = (pathFoto) => {
  if (!pathFoto) return null
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

const horaAMinutos = (horaStr) => {
  if (!horaStr || typeof horaStr !== 'string') return null
  const partes = horaStr.split(':')
  if (partes.length < 2) return null
  const horas = Number(partes[0])
  const minutos = Number(partes[1])
  if (Number.isNaN(horas) || Number.isNaN(minutos)) return null
  return horas * 60 + minutos
}

const cargarMapaDocentes = async () => {
  try {
    const { data } = await getDocentes()
    const lista = data?.data?.data || data?.data || []
    const mapa = new Map()

    lista.forEach(docente => {
      if (docente.estado && docente.estado !== 'activo') return
      if (docente.user?.estado && docente.user?.estado !== 'activo') return

      const nombre = docente.user?.name || docente.user?.nombre_completo || docente.nombre || 'Docente'
      const rawFoto = docente.user?.foto_perfil || docente.user?.fotos_perfil || docente.user?.foto || docente.foto_perfil || docente.foto
      const fotoUrl = construirUrlFoto(rawFoto)
      const infoDocente = { id: String(docente.id), user_id: String(docente.user_id || ''), nombre, foto: fotoUrl }

      if (docente.id) mapa.set(String(docente.id), infoDocente)
      if (docente.user_id) mapa.set(String(docente.user_id), infoDocente)
    })

    mapaDocentes.value = mapa
  } catch (error) {
    console.error('Error al cargar docentes:', error)
  }
}

const cargarDocentesConClaseHoy = async () => {
  try {
    const diaHoy = obtenerNombreDiaActual()
    const { data } = await getHorarios({ dia_semana: diaHoy })

    const listaHorarios = data?.data?.data || data?.data || []

    const horariosFiltrados = listaHorarios.filter(item => {
      const horarioActivo = item.estado === 'activo'
      const ubicacionActiva = item.ubicacion ? (item.ubicacion.estado === 'activo' && item.ubicacion.activo !== false) : true
      return horarioActivo && ubicacionActiva
    })

    const listaConClase = []

    horariosFiltrados.forEach(horario => {
      const paraleloMateria = horario.paralelo_materia
      const docenteRelacion = paraleloMateria?.docente
      const docenteId = String(docenteRelacion?.id || horario.docente_id || '')

      if (docenteId && docenteId !== 'undefined' && docenteId !== 'null') {
        const infoMap = mapaDocentes.value.get(docenteId) || {}

        const nombreResuelto =
          docenteRelacion?.user?.name ||
          docenteRelacion?.user?.nombre_completo ||
          infoMap.nombre ||
          'Docente'

        const fotoResuelta = construirUrlFoto(
          docenteRelacion?.user?.foto_perfil ||
          docenteRelacion?.user?.foto
        ) || infoMap.foto

        const materiaResuelta =
          paraleloMateria?.materia?.nombre_materia ||
          paraleloMateria?.materia?.nombre ||
          horario.materia?.nombre ||
          'Materia no especificada'

        const horaInicio = horario.hora_inicio || '00:00'
        const horaFin = horario.hora_fin || '00:00'

        listaConClase.push({
          id: String(horario.id),
          docente_id: docenteId,
          nombre: nombreResuelto,
          foto: fotoResuelta,
          materia: materiaResuelta,
          horario: `${horaInicio} - ${horaFin}`,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
        })
      }
    })

    docentesConClaseHoy.value = listaConClase
  } catch (error) {
    console.error('Error al consultar horarios:', error)
  }
}

const resolverHorarioParaMarcado = (docenteId, horaMarcado) => {
  const minMarca = horaAMinutos(horaMarcado)
  if (minMarca === null) return null

  const horariosDelDocente = docentesConClaseHoy.value.filter(c => c.docente_id === docenteId)
  if (horariosDelDocente.length === 0) return null

  let mejor = null
  let mejorDiferencia = Infinity

  horariosDelDocente.forEach(h => {
    const inicio = horaAMinutos(h.hora_inicio)
    const fin = horaAMinutos(h.hora_fin)
    if (inicio === null || fin === null) return

    const rangoInicio = inicio - TOLERANCIA_ANTES_MIN
    const rangoFin = fin + TOLERANCIA_DESPUES_MIN

    if (minMarca >= rangoInicio && minMarca <= rangoFin) {
      const diferencia = Math.min(Math.abs(minMarca - inicio), Math.abs(minMarca - fin))
      if (diferencia < mejorDiferencia) {
        mejorDiferencia = diferencia
        mejor = h
      }
    }
  })

  return mejor
}

const cargarMarcacionesPendientes = async () => {
  try {
    const { data } = await getMarcadosPendientesAdmin({ fecha: obtenerFechaHoy() })
    const lista = Array.isArray(data?.data) ? data.data : []

    marcacionesRaw.value = lista.map(item => {
      const docenteIdItem = String(item.docente_id || '')
      const datosDocente = mapaDocentes.value.get(docenteIdItem)
      const horaMarcado = item.hora_marcado || '--:--'

      const horarioResuelto = resolverHorarioParaMarcado(docenteIdItem, horaMarcado)

      return {
        horario_id: horarioResuelto ? horarioResuelto.id : null,
        docente_id: docenteIdItem,
        docente_nombre: item.docente_nombre || datosDocente?.nombre || 'Docente',
        docente_foto: datosDocente?.foto || null,
        materia: horarioResuelto?.materia || item.materia || 'Materia',
        horario: horarioResuelto ? horarioResuelto.horario : '',
        hora: horaMarcado,
        tipo: String(item.tipo_marcado || '').toLowerCase().trim()
      }
    })
  } catch (error) {
    console.error('Error al consultar marcados pendientes:', error)
  }
}

// UNIFICACIÓN Y ORDENAMIENTO (Sube arriba automáticamente al registrar entrada)
const marcacionesUnificadas = computed(() => {
  const mapaResultados = new Map()

  docentesConClaseHoy.value.forEach(clase => {
    mapaResultados.set(clase.id, {
      key: clase.id,
      docente_id: clase.docente_id,
      docente_nombre: clase.nombre,
      docente_foto: clase.foto,
      materia: clase.materia,
      horario: clase.horario,
      entrada: null,
      salida: null,
      haMarcado: false
    })
  })

  marcacionesRaw.value.forEach(m => {
    if (!m.horario_id) return

    if (!mapaResultados.has(m.horario_id)) {
      mapaResultados.set(m.horario_id, {
        key: m.horario_id,
        docente_id: m.docente_id,
        docente_nombre: m.docente_nombre,
        docente_foto: m.docente_foto,
        materia: m.materia,
        horario: m.horario,
        entrada: null,
        salida: null,
        haMarcado: false
      })
    }

    const registro = mapaResultados.get(m.horario_id)
    const tipo = m.tipo

    if (tipo.includes('entrada') && !tipo.includes('salida')) {
      registro.entrada = m.hora
      registro.haMarcado = true
    } else if (tipo.includes('salida')) {
      registro.salida = m.hora
      registro.haMarcado = true
    }
  })

  return Array.from(mapaResultados.values()).filter(item => item.haMarcado)
})

const clasesFaltantesHoy = computed(() => {
  return docentesConClaseHoy.value.filter(clase => {
    const estaArriba = marcacionesUnificadas.value.some(m => m.key === clase.id)
    return !estaArriba
  })
})

const cargarTodo = async () => {
  await cargarMapaDocentes()
  await cargarDocentesConClaseHoy()
  await cargarMarcacionesPendientes()
}

onMounted(async () => {
  await cargarTodo()
  timerPolling = setInterval(cargarTodo, 5000)
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