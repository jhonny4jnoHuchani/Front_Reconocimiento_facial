<template >
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:py-5 sm:my-10 "
  >
    <div class="flex items-center justify-between py-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Capacidad por Paralelo</h3>
    </div>
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartOne" class="-ml-5 min-w-[650px] xl:min-w-full pl-2">
        <VueApexCharts type="bar" height="180" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import {getParalelos } from '@/api/endpoints'

const series = ref([
  {
    name: 'Capacidad',
    data: [],
  },
])

const chartOptions = ref({
  colors: ['#465fff'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '39%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 4,
    colors: ['transparent'],
  },
  xaxis: {
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Outfit',
    markers: {
      radius: 99,
    },
  },
  yaxis: {
    title: false,
  },
  grid: {
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      formatter: function (val) {
        return val.toString()
      },
    },
  },
})

async function cargarParalelos() {
  try {
    const { data } = await getParalelos()
    const paralelosData = data.data.data
    const capacidades = paralelosData.map(item => item.capacidad)    
    const paralelos = paralelosData.map(item => item.paralelo)
    series.value = [
      {
        name: 'Capacidad',
        data: capacidades
      }
    ]

    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: paralelos
      }
    }
  } catch (error) {
    console.error('Error cargando paralelos:', error)
  }
}

// Ejecutar al montar el componente
onMounted(() => {
  cargarParalelos()
})
</script>
