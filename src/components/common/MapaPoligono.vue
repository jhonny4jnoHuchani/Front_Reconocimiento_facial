<template>
  <div>
    <!-- Barra superior con flex-wrap y min-w-0 para evitar desbordamientos en móviles -->
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <input
        v-model="busqueda"
        @keyup.enter="buscarLugar"
        type="text"
        placeholder="Buscar lugar (ej: La Paz, Bolivia)..."
        class="h-10 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-800"
      />

      <div class="flex shrink-0 items-center gap-2">
        <button
          type="button"
          @click="buscarLugar"
          class="h-10 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-600"
        >
          Buscar
        </button>

        <button
          type="button"
          @click="ubicacionActual"
          class="flex h-10 items-center gap-1.5 rounded-lg border border-gray-300 px-3 text-sm font-medium transition-colors hover:bg-purple-300 dark:border-gray-700 hover:dark:text-black"
          title="Mi ubicación"
        >
          <span class="text-base">📍</span>
          <span class="hidden sm:inline">Mi ubicación</span>
        </button>
      </div>
    </div>
    
    <div ref="mapContainer" class="z-10 h-[350px] w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700"></div>
    
    <div class="mt-3 flex items-center justify-between">
      <p class="text-sm text-gray-500">{{ puntos.length }} puntos {{ puntos.length >= 3 ? '✓ Polígono válido' : '⚠ Mínimo 3 puntos' }}</p>
      <div class="flex gap-2">
        <button type="button" @click="deshacer" :disabled="puntos.length === 0" class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs disabled:opacity-50">Deshacer</button>
        <button type="button" @click="limpiar" :disabled="puntos.length === 0" class="rounded-lg bg-red-100 px-3 py-1.5 text-xs text-red-700 disabled:opacity-50">Limpiar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
})

// Icono personalizado para "Mi Ubicación" (Pin Rojo con efecto pulso)
const redIcon = L.divIcon({
  className: 'custom-red-pin',
  html: `
    <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
      <span style="position: absolute; width: 28px; height: 28px; background-color: rgba(239, 68, 68, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <svg width="26" height="34" viewBox="0 0 24 24" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.4));">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
      </svg>
    </div>
  `,
  iconSize: [30, 34],
  iconAnchor: [15, 34],
  popupAnchor: [0, -32]
})

const props = defineProps({ modelValue: { type: Array, default: () => [] } })
const emit = defineEmits(['update:modelValue'])

const mapContainer = ref(null)
const busqueda = ref('')
let map = null
let polygon = null
let userMarker = null
const puntos = ref([])
const markers = ref([])

const initMap = async () => {
  await nextTick()
  if (!mapContainer.value) return

  if (map) {
    map.remove()
    map = null
  }

  cargarPuntosDesdeProps()

  const centro = puntos.value.length > 0 ? puntos.value[0] : [-16.5, -68.15]
  map = L.map(mapContainer.value).setView(centro, 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  map.on('click', (e) => {
    puntos.value.push([e.latlng.lat, e.latlng.lng])
    dibujar()
  })

  setTimeout(() => {
    if (map) map.invalidateSize()
  }, 300)

  dibujar()
}

const cargarPuntosDesdeProps = () => {
  if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
    puntos.value = props.modelValue.map(p => {
      if (Array.isArray(p)) return [p[0], p[1]]
      return [p.lat, p.lon ?? p.lng]
    })
  } else {
    puntos.value = []
  }
}

const buscarLugar = async () => {
  if (!busqueda.value.trim() || !map) return
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(busqueda.value)}&limit=1`)
    const data = await res.json()
    if (data.length) {
      const { lat, lon } = data[0]
      map.setView([lat, lon], 16)
      L.marker([lat, lon]).addTo(map).bindPopup(busqueda.value).openPopup()
    }
  } catch (e) { console.error(e) }
}

const ubicacionActual = () => {
  if (navigator.geolocation && map) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude

        map.setView([lat, lng], 16)

        if (userMarker) {
          map.removeLayer(userMarker)
        }

        userMarker = L.marker([lat, lng], { icon: redIcon })
          .addTo(map)
          .bindPopup('📍 Estás aquí')
          .openPopup()
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error)
        alert('No se pudo obtener la ubicación actual. Revisa los permisos de ubicación.')
      }
    )
  } else {
    alert('Tu navegador no soporta geolocalización.')
  }
}

const dibujar = () => {
  if (!map) return

  markers.value.forEach(m => map.removeLayer(m))
  markers.value = []

  puntos.value.forEach(([lat, lng], i) => {
    const marker = L.marker([lat, lng], { draggable: true })
      .addTo(map)
      .bindTooltip(String(i + 1), { permanent: true, direction: 'top' })
      .on('dragend', (e) => {
        const newPos = e.target.getLatLng()
        puntos.value[i] = [newPos.lat, newPos.lng]
        dibujar()
      })
    markers.value.push(marker)
  })

  if (polygon) map.removeLayer(polygon)
  if (puntos.value.length >= 3) {
    polygon = L.polygon(puntos.value, { color: '#3b82f6', fillOpacity: 0.3 }).addTo(map)
  }

  emit('update:modelValue', puntos.value.map(([lat, lng]) => ({
    lat: Number(lat),
    lon: Number(lng),
    lng: Number(lng)
  })))
}

const deshacer = () => { puntos.value.pop(); dibujar() }
const limpiar = () => { puntos.value = []; dibujar() }

watch(() => props.modelValue, () => {
  if (props.modelValue && props.modelValue.length > 0 && puntos.value.length === 0) {
    cargarPuntosDesdeProps()
    dibujar()
  }
}, { deep: true })

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.leaflet-container { height: 350px !important; width: 100% !important; z-index: 10 !important; }

@keyframes ping {
  75%, 100% {
    transform: scale(1.8);
    opacity: 0;
  }
}
</style>