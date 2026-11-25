<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Ventanas de Marcado de Asistencia" />

    <div class="space-y-6">
      <!-- Header y Badge de Perfil -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-brand-50 text-brand-600 rounded-xl dark:bg-brand-900/30 dark:text-brand-400">
            <Clock class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Reglas y Tolerancias de Marcado</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Control dinámico de minutos de anticipación, tolerancia y salida para el APK móvil "Mi Control UPEA"
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            :class="isAdmin ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'"
          >
            <Shield class="w-3.5 h-3.5" />
            {{ isAdmin ? 'Administrador General (Control Global)' : 'Supervisor de Carrera' }}
          </span>
        </div>
      </div>

      <!-- Pestañas para Admin -->
      <div v-if="isAdmin" class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-6">
          <button
            @click="activeTab = 'config'"
            :class="[
              activeTab === 'config'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 dark:border-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
            ]"
          >
            <Sliders class="w-4 h-4" />
            Configurar por Carrera
          </button>
          <button
            @click="activeTab = 'tabla'"
            :class="[
              activeTab === 'tabla'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400 dark:border-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
            ]"
          >
            <Building2 class="w-4 h-4" />
            Vista General de Todas las Carreras ({{ totalCarreras }})
          </button>
        </nav>
      </div>

      <!-- VISTA TAB 1: FORMULARIO Y SIMULADOR -->
      <div v-show="!isAdmin || activeTab === 'config'" class="space-y-6">
        <!-- Selector de Carrera (Admin) o Tarjeta Informativa (Supervisor) -->
        <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div v-if="isAdmin" class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Seleccionar Carrera a Configurar:
            </label>
            <div class="flex flex-col sm:flex-row gap-3">
              <select
                v-model="carreraSeleccionadaId"
                @change="onCambiarCarrera"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              >
                <option :value="null" disabled>-- Selecciona una carrera --</option>
                <option v-for="c in listaCarreras" :key="c.id" :value="c.id">
                  {{ c.nombre }} ({{ c.sede || 'Sede Central' }})
                </option>
              </select>
              <button
                type="button"
                @click="recargarDatos"
                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg text-sm flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': cargando }" />
                Actualizar
              </button>
            </div>
          </div>

          <div v-else class="flex items-center justify-between">
            <div>
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tu Carrera Asignada</span>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
                <Building2 class="w-5 h-5 text-brand-500" />
                {{ carreraNombre || 'Cargando carrera...' }}
              </h2>
            </div>
            <button
              type="button"
              @click="recargarDatos"
              class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': cargando }" />
              Refrescar
            </button>
          </div>
        </div>

        <!-- Indicador de Carga -->
        <div v-if="cargando" class="flex items-center justify-center py-16">
          <Loader2 class="w-8 h-8 text-brand-500 animate-spin" />
          <span class="ml-3 text-sm text-gray-600 dark:text-gray-300">Cargando datos de la carrera...</span>
        </div>

        <!-- Panel Principal Formulario + Timeline -->
        <div v-else-if="carreraSeleccionadaId || !isAdmin" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Columna Formulario (2 columnas en pantallas grandes) -->
          <div class="lg:col-span-2 space-y-6">
            <form @submit.prevent="guardarTolerancias" class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
              <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sliders class="w-5 h-5 text-brand-500" />
                  Parámetros para: <span class="text-brand-600 dark:text-brand-400">{{ carreraNombre }}</span>
                </h3>
                <button
                  type="button"
                  @click="restablecerValoresDefault"
                  class="text-xs text-brand-600 hover:text-brand-800 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw class="w-3.5 h-3.5" />
                  Valores estándar
                </button>
              </div>

              <!-- SECCIÓN ENTRADA -->
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    1. Ventana de Entrada al Horario
                  </h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Anticipación -->
                  <div class="p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Anticipación (minutos)
                    </label>
                    <div class="flex items-center gap-2">
                      <input
                        v-model.number="form.entrada_anticipacion_min"
                        type="number"
                        min="0"
                        max="240"
                        required
                        class="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                      <span class="text-xs text-gray-500">min</span>
                    </div>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
                      Desbloquea el botón de entrada en el APK antes del inicio de la clase.
                    </p>
                  </div>

                  <!-- Tolerancia Puntual -->
                  <div class="p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Tolerancia Puntual (minutos)
                    </label>
                    <div class="flex items-center gap-2">
                      <input
                        v-model.number="form.tolerancia_puntual_min"
                        type="number"
                        min="0"
                        max="60"
                        required
                        class="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                      <span class="text-xs text-gray-500">min</span>
                    </div>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
                      Margen de gracia donde la asistencia se califica como <strong>Puntual</strong>.
                    </p>
                  </div>

                  <!-- Retraso Máximo -->
                  <div class="p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Tolerancia Retraso (minutos)
                    </label>
                    <div class="flex items-center gap-2">
                      <input
                        v-model.number="form.entrada_tolerancia_min"
                        type="number"
                        min="0"
                        max="300"
                        required
                        class="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                      />
                      <span class="text-xs text-gray-500">min</span>
                    </div>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
                      Límite máximo para marcar con <strong>Retraso</strong> antes del cierre de entrada.
                    </p>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN SALIDA -->
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    2. Ventana de Salida del Horario
                  </h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Alerta Previa -->
                  <div class="p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Alerta Recordatoria Previa (minutos)
                    </label>
                    <div class="flex items-center gap-2">
                      <input
                        v-model.number="form.alerta_salida_min"
                        type="number"
                        min="0"
                        max="60"
                        required
                        class="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <span class="text-xs text-gray-500">min</span>
                    </div>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
                      Minutos antes del final de clase para activar la notificación local del APK.
                    </p>
                  </div>

                  <!-- Margen Posterior -->
                  <div class="p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Margen Posterior de Salida (minutos)
                    </label>
                    <div class="flex items-center gap-2">
                      <input
                        v-model.number="form.salida_margen_min"
                        type="number"
                        min="0"
                        max="240"
                        required
                        class="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <span class="text-xs text-gray-500">min</span>
                    </div>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
                      Tiempo tras concluir la clase en el que el botón de salida sigue disponible.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div v-if="isAdmin" class="w-full sm:w-auto">
                  <button
                    type="button"
                    @click="confirmarAplicacionMasiva"
                    :disabled="guardando"
                    class="w-full sm:w-auto px-4 py-2 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Zap class="w-4 h-4 text-purple-500" />
                    Aplicar estos valores a TODAS las Carreras
                  </button>
                </div>
                <div v-else></div>

                <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="submit"
                    :disabled="guardando"
                    class="w-full sm:w-auto px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
                  >
                    <Save class="w-4 h-4" />
                    {{ guardando ? 'Guardando...' : 'Guardar Configuración' }}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Columna Derecha: Simulación Visual en Vivo -->
          <div class="space-y-6">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                <Eye class="w-4 h-4 text-brand-500" />
                Simulación en Tiempo Real
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Comportamiento resultante para una clase ejemplo <strong>08:00 a 10:15</strong>:
              </p>

              <!-- Timeline de Eventos -->
              <div class="space-y-3.5">
                <!-- 1: Apertura Entrada -->
                <div class="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                  <div class="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-xs font-bold">
                    {{ calcularHora('08:00', -form.entrada_anticipacion_min) }}
                  </div>
                  <div>
                    <p class="text-xs font-bold text-emerald-800 dark:text-emerald-300">Botón Entrada Activo</p>
                    <p class="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Se activa {{ form.entrada_anticipacion_min }} min antes de las 08:00.
                    </p>
                  </div>
                </div>

                <!-- 2: Hora Programada e Inicio -->
                <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700">
                  <div class="px-2 py-0.5 rounded bg-gray-700 text-white font-mono text-xs font-bold">
                    08:00
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-800 dark:text-gray-200">Hora de Inicio Oficial</p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">
                      Puntual hasta las <strong>{{ calcularHora('08:00', form.tolerancia_puntual_min) }}</strong> ({{ form.tolerancia_puntual_min }} min gracia).
                    </p>
                  </div>
                </div>

                <!-- 3: Fin de Retraso -->
                <div class="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                  <div class="px-2 py-0.5 rounded bg-amber-600 text-white font-mono text-xs font-bold">
                    {{ calcularHora('08:00', form.entrada_tolerancia_min) }}
                  </div>
                  <div>
                    <p class="text-xs font-bold text-amber-800 dark:text-amber-300">Cierre Ventana Entrada</p>
                    <p class="text-[11px] text-amber-700 dark:text-amber-400">
                      Tras las {{ calcularHora('08:00', form.entrada_tolerancia_min) }} ya no se permite marcar entrada.
                    </p>
                  </div>
                </div>

                <!-- 4: Alerta Salida -->
                <div class="flex items-start gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40">
                  <div class="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-xs font-bold">
                    {{ calcularHora('10:15', -form.alerta_salida_min) }}
                  </div>
                  <div>
                    <p class="text-xs font-bold text-indigo-800 dark:text-indigo-300">Alerta Notificación Salida</p>
                    <p class="text-[11px] text-indigo-700 dark:text-indigo-400">
                      Notificación en el teléfono {{ form.alerta_salida_min }} min antes de las 10:15.
                    </p>
                  </div>
                </div>

                <!-- 5: Cierre Salida -->
                <div class="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
                  <div class="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-xs font-bold">
                    {{ calcularHora('10:15', form.salida_margen_min) }}
                  </div>
                  <div>
                    <p class="text-xs font-bold text-blue-800 dark:text-blue-300">Cierre Botón de Salida</p>
                    <p class="text-[11px] text-blue-700 dark:text-blue-400">
                      Se inhabilita la salida {{ form.salida_margen_min }} min tras terminar la clase.
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl text-xs text-gray-600 dark:text-gray-300">
                <span class="font-semibold text-gray-800 dark:text-gray-200">✨ Efecto Inmediato:</span>
                Los cambios se aplican al instante sin necesidad de reinstalar ni actualizar el APK de los docentes.
              </div>
            </div>
          </div>
        </div>

        <!-- Estado cuando no hay carrera seleccionada -->
        <div v-else class="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-8">
          <Building2 class="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200">Selecciona una carrera</h3>
          <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Elige una carrera en la lista superior para inspeccionar o editar sus parámetros.
          </p>
        </div>
      </div>

      <!-- VISTA TAB 2: TABLA GENERAL DE TODAS LAS CARRERAS (Solo Admin) -->
      <div v-show="isAdmin && activeTab === 'tabla'" class="space-y-4">
        <!-- Buscador y contador -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="relative w-full sm:w-80">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              v-model="filtroBusqueda"
              type="text"
              placeholder="Buscar por carrera o sede..."
              class="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Mostrando <strong>{{ carrerasFiltradas.length }}</strong> de <strong>{{ totalCarreras }}</strong> carreras
            </span>
            <button
              type="button"
              @click="recargarDatos"
              class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': cargando }" />
              Refrescar
            </button>
          </div>
        </div>

        <!-- Tabla Comparativa -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th class="py-3 px-4">Carrera / Sede</th>
                  <th class="py-3 px-3 text-center">Anticipación Ent.</th>
                  <th class="py-3 px-3 text-center">Tolerancia Puntual</th>
                  <th class="py-3 px-3 text-center">Tolerancia Retraso</th>
                  <th class="py-3 px-3 text-center">Alerta Salida</th>
                  <th class="py-3 px-3 text-center">Margen Salida</th>
                  <th class="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
                <tr
                  v-for="c in carrerasFiltradas"
                  :key="c.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td class="py-3 px-4">
                    <div class="font-semibold text-gray-900 dark:text-white">{{ c.nombre }}</div>
                    <div class="text-[11px] text-gray-500">{{ c.sede || 'Sede Central' }} (ID: {{ c.id }})</div>
                  </td>
                  <td class="py-3 px-3 text-center font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {{ c.entrada_anticipacion_min ?? 30 }} min
                  </td>
                  <td class="py-3 px-3 text-center font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {{ c.tolerancia_puntual_min ?? 5 }} min
                  </td>
                  <td class="py-3 px-3 text-center font-mono font-medium text-amber-600 dark:text-amber-400">
                    {{ c.entrada_tolerancia_min ?? 150 }} min
                  </td>
                  <td class="py-3 px-3 text-center font-mono font-medium text-indigo-600 dark:text-indigo-400">
                    {{ c.alerta_salida_min ?? 5 }} min
                  </td>
                  <td class="py-3 px-3 text-center font-mono font-medium text-blue-600 dark:text-blue-400">
                    {{ c.salida_margen_min ?? 30 }} min
                  </td>
                  <td class="py-3 px-4 text-right">
                    <button
                      @click="seleccionarParaEditar(c)"
                      class="px-2.5 py-1 text-xs font-semibold text-brand-600 hover:text-brand-800 dark:text-brand-400 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 rounded-lg transition-colors"
                    >
                      Configurar
                    </button>
                  </td>
                </tr>
                <tr v-if="carrerasFiltradas.length === 0">
                  <td colspan="7" class="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No se encontraron carreras con el término "{{ filtroBusqueda }}".
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import {
  getCarreras,
  getToleranciasMiCarrera,
  updateToleranciasMiCarrera,
  getToleranciasCarrera,
  updateToleranciasCarrera,
  updateToleranciasMasivo
} from '@/api/endpoints'
import {
  Clock,
  Building2,
  Shield,
  Sliders,
  Save,
  RotateCcw,
  RefreshCw,
  Loader2,
  Eye,
  Zap,
  Search
} from 'lucide-vue-next'

// Obtener usuario actual del localStorage
const userRaw = localStorage.getItem('user')
const user = userRaw ? JSON.parse(userRaw) : null
const isAdmin = computed(() => (user?.rol || 'admin') === 'admin')

const activeTab = ref('config')
const cargando = ref(false)
const guardando = ref(false)

const carreraNombre = ref('')
const carreraSeleccionadaId = ref(null)
const listaCarreras = ref([])
const filtroBusqueda = ref('')

// Formulario de los 5 parámetros
const form = ref({
  entrada_anticipacion_min: 30,
  entrada_tolerancia_min: 150,
  salida_margen_min: 30,
  alerta_salida_min: 5,
  tolerancia_puntual_min: 5
})

const totalCarreras = computed(() => listaCarreras.value.length)

const carrerasFiltradas = computed(() => {
  if (!filtroBusqueda.value.trim()) return listaCarreras.value
  const q = filtroBusqueda.value.toLowerCase()
  return listaCarreras.value.filter(
    (c) =>
      c.nombre.toLowerCase().includes(q) ||
      (c.sede && c.sede.toLowerCase().includes(q))
  )
})

onMounted(async () => {
  await inicializar()
})

const inicializar = async () => {
  cargando.value = true
  try {
    if (isAdmin.value) {
      await cargarTodasLasCarreras()
      if (listaCarreras.value.length > 0 && !carreraSeleccionadaId.value) {
        carreraSeleccionadaId.value = listaCarreras.value[0].id
        carreraNombre.value = listaCarreras.value[0].nombre
        await cargarToleranciasPorId(carreraSeleccionadaId.value)
      }
    } else {
      await cargarToleranciasSupervisor()
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de Carga',
      text: error?.response?.data?.message || 'No se pudieron obtener las tolerancias de la carrera.'
    })
  } finally {
    cargando.value = false
  }
}

const recargarDatos = async () => {
  await inicializar()
  Swal.fire({
    icon: 'info',
    title: 'Actualizado',
    text: 'Datos actualizados desde el servidor.',
    timer: 1500,
    showConfirmButton: false
  })
}

const cargarTodasLasCarreras = async () => {
  try {
    const res = await getCarreras({ per_page: 200 })
    const data = res.data?.data || res.data || []
    listaCarreras.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Error al listar carreras:', e)
  }
}

const cargarToleranciasSupervisor = async () => {
  const res = await getToleranciasMiCarrera()
  const data = res.data?.data || res.data
  carreraNombre.value = data.nombre || 'Mi Carrera'
  asignarFormulario(data)
}

const cargarToleranciasPorId = async (id) => {
  cargando.value = true
  try {
    const res = await getToleranciasCarrera(id)
    const data = res.data?.data || res.data
    const match = listaCarreras.value.find((c) => c.id === id)
    carreraNombre.value = data.nombre || match?.nombre || `Carrera #${id}`
    asignarFormulario(data)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error?.response?.data?.message || 'No se pudo cargar la carrera seleccionada.'
    })
  } finally {
    cargando.value = false
  }
}

const onCambiarCarrera = async () => {
  if (carreraSeleccionadaId.value) {
    await cargarToleranciasPorId(carreraSeleccionadaId.value)
  }
}

const asignarFormulario = (data) => {
  form.value = {
    entrada_anticipacion_min: Number(data.entrada_anticipacion_min ?? 30),
    entrada_tolerancia_min: Number(data.entrada_tolerancia_min ?? 150),
    salida_margen_min: Number(data.salida_margen_min ?? 30),
    alerta_salida_min: Number(data.alerta_salida_min ?? 5),
    tolerancia_puntual_min: Number(data.tolerancia_puntual_min ?? 5)
  }
}

const seleccionarParaEditar = async (carrera) => {
  carreraSeleccionadaId.value = carrera.id
  activeTab.value = 'config'
  await cargarToleranciasPorId(carrera.id)
}

const restablecerValoresDefault = () => {
  form.value = {
    entrada_anticipacion_min: 30,
    entrada_tolerancia_min: 150,
    salida_margen_min: 30,
    alerta_salida_min: 5,
    tolerancia_puntual_min: 5
  }
}

const guardarTolerancias = async () => {
  guardando.value = true
  try {
    if (isAdmin.value) {
      if (!carreraSeleccionadaId.value) return
      await updateToleranciasCarrera(carreraSeleccionadaId.value, form.value)
      const idx = listaCarreras.value.findIndex((c) => c.id === carreraSeleccionadaId.value)
      if (idx !== -1) {
        listaCarreras.value[idx] = { ...listaCarreras.value[idx], ...form.value }
      }
    } else {
      await updateToleranciasMiCarrera(form.value)
    }

    Swal.fire({
      icon: 'success',
      title: 'Configuración Guardada',
      text: `Ventanas de marcado actualizadas exitosamente para ${carreraNombre.value}.`,
      timer: 2000,
      showConfirmButton: false
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error al Guardar',
      text: error?.response?.data?.message || 'Ocurrió un error al guardar los cambios.'
    })
  } finally {
    guardando.value = false
  }
}

const confirmarAplicacionMasiva = async () => {
  const result = await Swal.fire({
    title: '¿Aplicar a TODAS las Carreras?',
    html: `
      <div class="text-left text-xs text-gray-600 dark:text-gray-300 space-y-2 mt-2">
        <p>Se sobreescribirán las tolerancias de <b>${totalCarreras.value} carreras</b> con los siguientes valores:</p>
        <ul class="list-disc pl-5 font-mono">
          <li>Anticipación Entrada: <b>${form.value.entrada_anticipacion_min} min</b></li>
          <li>Tolerancia Puntual: <b>${form.value.tolerancia_puntual_min} min</b></li>
          <li>Tolerancia Retraso: <b>${form.value.entrada_tolerancia_min} min</b></li>
          <li>Alerta Salida: <b>${form.value.alerta_salida_min} min</b></li>
          <li>Margen Salida: <b>${form.value.salida_margen_min} min</b></li>
        </ul>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#7c3aed',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, aplicar a todas',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    guardando.value = true
    try {
      const res = await updateToleranciasMasivo(form.value)
      Swal.fire({
        icon: 'success',
        title: 'Aplicación Masiva Completada',
        text: res.data?.message || 'Configuración aplicada a todas las carreras exitosamente.'
      })
      await cargarTodasLasCarreras()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Masivo',
        text: error?.response?.data?.message || 'No se pudo aplicar a todas las carreras.'
      })
    } finally {
      guardando.value = false
    }
  }
}

// Cálculo visual para la simulación
const calcularHora = (horaBase, offsetMinutos) => {
  const [hh, mm] = horaBase.split(':').map(Number)
  const totalMin = hh * 60 + mm + offsetMinutos
  const hFinal = Math.floor((totalMin + 1440) / 60) % 24
  const mFinal = Math.abs((totalMin + 1440) % 60)
  return `${String(hFinal).padStart(2, '0')}:${String(mFinal).padStart(2, '0')}`
}
</script>
