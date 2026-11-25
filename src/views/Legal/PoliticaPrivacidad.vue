<template>
  <FullScreenLayout>
    <div class="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div class="max-w-4xl w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
        
        <!-- Header Institucional -->
        <header class="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 border-b border-slate-700 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-3">
              <span>Documento Oficial</span>
              <span>•</span>
              <span>Vigente 2026</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Política de Privacidad</h1>
            <p class="text-sm text-slate-300 mt-1">Aplicación Móvil "Mi Control UPEA" | Universidad Pública de El Alto</p>
          </div>
          <div class="flex items-center gap-3">
            <router-link
              to="/signin"
              class="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/solicitud-eliminacion-datos"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition"
            >
              Eliminación de Datos
            </router-link>
          </div>
        </header>

        <!-- Contenido Legal -->
        <main class="p-6 sm:p-10 space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <section>
            <p class="text-justify">
              La <strong class="text-white">Universidad Pública de El Alto (UPEA)</strong>, a través de su Unidad de Tecnologías de Información y Comunicación (UTIC), pone a disposición de su comunidad docente la aplicación móvil oficial <strong class="text-white">"Mi Control UPEA"</strong>. La presente Política de Privacidad describe cómo se recopila, utiliza, protege y procesa la información de los usuarios en estricto cumplimiento con la normativa universitaria y las directivas de seguridad de Google Play Store.
            </p>
          </section>

          <!-- 1. Datos Recopilados -->
          <section class="space-y-3">
            <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700/60 pb-2">
              <span class="text-blue-400 font-mono text-base">01.</span> Datos Personales Recopilados
            </h2>
            <p>Para la gestión operativa de asistencia docente, la aplicación procesa los siguientes datos:</p>
            <ul class="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong class="text-slate-100">Datos de Identidad:</strong> Cédula de Identidad (CI), Nombres y Apellidos, Correo Institucional y Carrera Universitaria asignada.</li>
              <li><strong class="text-slate-100">Identificador de Dispositivo:</strong> Identificador único del dispositivo móvil (Device ID) para asegurar que el docente marque únicamente desde su terminal autorizado y evitar suplantaciones.</li>
            </ul>
          </section>

          <!-- 2. Permisos Sensibles y Biometría -->
          <section class="space-y-4">
            <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700/60 pb-2">
              <span class="text-blue-400 font-mono text-base">02.</span> Uso de Permisos Sensibles y Datos Biométricos
            </h2>
            <p>La aplicación requiere el uso de permisos especiales en el dispositivo móvil con finalidades estrictamente académicas y laborales:</p>

            <div class="bg-slate-900/60 border border-slate-700/60 rounded-xl p-5 space-y-3">
              <h3 class="text-base font-semibold text-blue-400 flex items-center gap-2">
                <span>📷</span> Acceso a la Cámara y Biometría Facial
              </h3>
              <ul class="list-disc pl-6 space-y-2 text-xs sm:text-sm">
                <li><strong class="text-slate-100">Verificación Facial y Liveness:</strong> Al momento de marcar entrada o salida, se captura el rostro en tiempo real para verificar la presencia del titular y evitar fraudes con fotos impresas o pantallas.</li>
                <li><strong class="text-slate-100">Vectores Biométricos (Embeddings):</strong> Las imágenes se procesan para generar vectores matemáticos unidireccionales que se almacenan de manera cifrada en la infraestructura interna de la UPEA. La institución no comercializa ni transfiere estos datos a terceras partes.</li>
                <li><strong class="text-slate-100">Fotografía de Constancia:</strong> Se almacena de forma privada para el respaldo de asistencia ante las Direcciones de Carrera.</li>
              </ul>
            </div>

            <div class="bg-slate-900/60 border border-slate-700/60 rounded-xl p-5 space-y-3">
              <h3 class="text-base font-semibold text-blue-400 flex items-center gap-2">
                <span>📍</span> Ubicación Geográfica (GPS en Primer Plano)
              </h3>
              <ul class="list-disc pl-6 space-y-2 text-xs sm:text-sm">
                <li><strong class="text-slate-100">Geocerca Institucional:</strong> Las coordenadas GPS se consultan <strong>únicamente en el segundo exacto en que se presiona el botón de marcar</strong>, validando que el docente esté dentro del perímetro del aula o campus universitario.</li>
                <li><strong class="text-slate-100">Sin Rastreo en Segundo Plano:</strong> La aplicación <strong>NUNCA</strong> rastrea ni almacena la ubicación en segundo plano (background) ni fuera de los horarios de clase.</li>
              </ul>
            </div>
          </section>

          <!-- Compromiso -->
          <div class="bg-blue-950/40 border border-blue-500/30 rounded-xl p-5 text-blue-200 text-xs sm:text-sm leading-relaxed">
            <strong class="text-white block mb-1">🛡️ Compromiso Institucional de No Comercialización:</strong>
            La UPEA no vende, no comercializa ni comparte datos personales, biométricos o de geolocalización con terceros, empresas de publicidad ni redes de monetización.
          </div>

          <!-- 3. Retención y Derechos -->
          <section class="space-y-3">
            <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700/60 pb-2">
              <span class="text-blue-400 font-mono text-base">03.</span> Retención de Datos y Derechos de los Docentes
            </h2>
            <p class="text-justify">
              Los registros históricos de asistencia se conservan conforme a la normativa laboral y reglamentos universitarios de Bolivia para fines de auditoría y pago de haberes. Los docentes tienen el derecho de solicitar la desvinculación de su dispositivo y la supresión de sus datos biométricos cuando dejen de ejercer funciones en la institución.
            </p>
            <p>
              Para conocer el procedimiento de baja o solicitar la supresión de datos, visite nuestra página de 
              <router-link to="/solicitud-eliminacion-datos" class="text-blue-400 underline font-medium hover:text-blue-300">
                Solicitud de Eliminación de Cuenta y Datos
              </router-link>.
            </p>
          </section>

          <!-- 4. Contacto -->
          <section class="space-y-3">
            <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700/60 pb-2">
              <span class="text-blue-400 font-mono text-base">04.</span> Contacto Institucional
            </h2>
            <p>Para consultas o requerimientos sobre privacidad y protección de datos:</p>
            <div class="bg-slate-900/40 border border-slate-700/40 rounded-xl p-4 text-xs sm:text-sm space-y-1">
              <p><strong class="text-white">Unidad de Tecnologías de Información y Comunicación (UTIC - UPEA)</strong></p>
              <p>Av. Sucre A s/n, Villa Esperanza, El Alto - Bolivia</p>
              <p>Portal web: <a href="https://upea.bo" target="_blank" class="text-blue-400 hover:underline">https://upea.bo</a></p>
              <p>Correo de soporte: <a href="mailto:soporte.micontrol@upea.bo" class="text-blue-400 hover:underline">soporte.micontrol@upea.bo</a></p>
            </div>
          </section>
        </main>

        <!-- Footer -->
        <footer class="bg-slate-900 p-6 border-t border-slate-700 text-center text-xs text-slate-400">
          <p>&copy; 2026 Universidad Pública de El Alto (UPEA). Todos los derechos reservados.</p>
        </footer>

      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import FullScreenLayout from '../../components/layout/FullScreenLayout.vue'
</script>

