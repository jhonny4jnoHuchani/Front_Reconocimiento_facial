<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Encabezado del Panel -->
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white/90">
            Panel de Control
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Monitoreo en tiempo real de asistencia docente y gestión académica
          </p>
        </div>
      </div>

      <!-- Tarjetas de Métricas -->
      <MetricasResumen />

      <!-- Grilla Principal: Marcaciones en Vivo y Capacidad -->
      <div class="grid grid-cols-12 gap-4 md:gap-6">
        <div class="col-span-12 xl:col-span-7">
          <MarcacionesHoy />
        </div>
        <div class="col-span-12 xl:col-span-5">
          <GraficaParalelos />
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import MetricasResumen from '@/components/dashboard/MetricasResumen.vue'
import MarcacionesHoy from '@/components/dashboard/MarcacionesHoy.vue'
import GraficaParalelos from '@/components/dashboard/GraficaParalelos.vue'
</script>
