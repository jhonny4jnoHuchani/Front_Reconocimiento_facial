<template>
  <div>
    <div class="flex gap-2 mb-3">
      <input
        v-model="busqueda"
        @keyup.enter="buscarLugar"
        type="text"
        placeholder="Buscar lugar (ej: La Paz, Bolivia)..."
        class="flex-1 h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:bg-gray-800 dark:border-gray-700"
      />
      <button @click="buscarLugar" class="h-10 px-4 rounded-lg bg-brand-500 text-white text-sm hover:bg-brand-600">Buscar</button>
      <button @click="ubicacionActual" class="h-10 px-4 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 dark:border-gray-700">📍 Mi ubicación</button>
    </div>
    <div ref="mapContainer" class="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700"></div>
    <div class="flex items-center justify-between mt-3">
      <p class="text-sm text-gray-500">{{ puntos.length }} puntos {{ puntos.length >= 3 ? '✓ Polígono válido' : '⚠ Mínimo 3 puntos' }}</p>
      <div class="flex gap-2">
        <button type="button" @click="deshacer" :disabled="puntos.length === 0" class="px-3 py-1.5 text-xs rounded-lg border border-gray-300 disabled:opacity-50">Deshacer</button>
        <button type="button" @click="limpiar" :disabled="puntos.length === 0" class="px-3 py-1.5 text-xs rounded-lg bg-red-100 text-red-700 disabled:opacity-50">Limpiar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'

const props = defineProps({ modelValue: { type: Array, default: () => [] } })
const emit = defineEmits(['update:modelValue'])
const mapContainer = ref(null)
const busqueda = ref('')
let map = null
let polygon = null
const puntos = ref([])
const markers = ref([])

const initMap = () => {
  map = L.map(mapContainer.value).setView([-16.5, -68.15], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)
  map.on('click', (e) => {
    puntos.value = [...puntos.value, [e.latlng.lat, e.latlng.lng]]
    dibujar()
  })
}

const buscarLugar = async () => {
  if (!busqueda.value.trim()) return
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
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      map.setView([pos.coords.latitude, pos.coords.longitude], 16)
    })
  }
}

const dibujar = () => {
  markers.value.forEach(m => map.removeLayer(m))
  markers.value = []
  puntos.value.forEach(([lat, lon], i) => {
    const marker = L.marker([lat, lon], { draggable: true })
      .addTo(map).bindTooltip(String(i + 1))
      .on('dragend', (e) => {
        puntos.value[i] = [e.target.getLatLng().lat, e.target.getLatLng().lng]
        dibujar()
      })
    markers.value.push(marker)
  })
  if (polygon) map.removeLayer(polygon)
  if (puntos.value.length >= 3) {
    polygon = L.polygon(puntos.value, { color: '#3b82f6', fillOpacity: 0.2 }).addTo(map)
  }
  emit('update:modelValue', puntos.value.map(([lat, lon]) => ({ lat, lon })))
}

const deshacer = () => { puntos.value = puntos.value.slice(0, -1); dibujar() }
const limpiar = () => { puntos.value = []; dibujar() }

watch(() => props.modelValue, (val) => {
  if (val.length && puntos.value.length === 0) {
    puntos.value = val.map(p => [p.lat, p.lon])
    dibujar()
  }
}, { immediate: true })

onMounted(() => {
  initMap()
  if (props.modelValue.length) {
    puntos.value = props.modelValue.map(p => [p.lat, p.lon])
    dibujar()
  }
})
</script>

<style>
.leaflet-container { height: 400px !important; width: 100% !important; z-index: 0 !important; }
</style>