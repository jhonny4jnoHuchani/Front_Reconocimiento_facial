
<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div class="flex items-center justify-between px-3">
        
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Docentes</span>
          <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
            {{ docentes }}
          </h4>
        </div>

        <div class="flex  items-center justify-center text-gray-600 dark:text-gray-300">
          <img  class="h-12 w-12" src="/public/images/profesor.png" alt="error">
        </div>
      </div>
    </div>

   <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div class="flex items-center justify-between  px-3">
        
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Materias</span>
          <h4 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
            {{ materias }}
          </h4>
        </div>

        <div class="flex items-center justify-center text-gray-600 dark:text-gray-300">
            <img  class="h-14 w-14" src="/public/images/libro.png" alt="error">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDocentes,getMaterias} from '@/api/endpoints'
const docentes = ref(0)
const materias = ref(0)
async function TraerDocentes() {
    const {data} = await getDocentes()
    const array = data.data.data
    docentes.value = Array.isArray(array) ? array.length : 0
  }
async function TraerMaterias() {
    const {data} = await getMaterias({estado:'activo'})
    const array = data.data.data
    materias.value = Array.isArray(array) ? array.length : 0
  }


onMounted(() => {
  TraerDocentes(),
  TraerMaterias()
})
</script>