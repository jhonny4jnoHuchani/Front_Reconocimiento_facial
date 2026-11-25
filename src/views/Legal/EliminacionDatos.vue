<template>
  <FullScreenLayout>
    <div class="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div class="max-w-4xl w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
        
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 border-b border-slate-700 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-400/20 text-red-300 text-xs font-semibold mb-3">
              <span>Google Play Data Safety</span>
              <span>•</span>
              <span>Transparencia y Baja</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Solicitud de Eliminación de Cuenta y Datos</h1>
            <p class="text-sm text-slate-300 mt-1">Plataforma "Mi Control UPEA" | Universidad Pública de El Alto</p>
          </div>
          <div class="flex items-center gap-3">
            <router-link
              to="/politica-de-privacidad"
              class="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition"
            >
              Ver Privacidad
            </router-link>
            <router-link
              to="/signin"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition"
            >
              Iniciar Sesión
            </router-link>
          </div>
        </header>

        <!-- Contenido Principal -->
        <main class="p-6 sm:p-10 space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <section>
            <p class="text-justify">
              En cumplimiento estricto con las políticas obligatorias de seguridad de datos de <strong class="text-white">Google Play Store</strong>, la Universidad Pública de El Alto garantiza a todos los usuarios de la aplicación móvil <strong class="text-white">"Mi Control UPEA"</strong> el mecanismo formal para solicitar la supresión de sus cuentas y la revocación de sus datos biométricos y personales.
            </p>
          </section>

          <!-- Opciones de Solicitud -->
          <section class="space-y-4">
            <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700/60 pb-2">
              <span class="text-blue-400 font-mono text-base">01.</span> ¿Cómo Solicitar la Eliminación de su Cuenta?
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Opción 1 -->
              <div class="bg-slate-900/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div class="text-blue-400 font-semibold text-sm mb-1 flex items-center gap-2">
                    <span>📱</span> Opción 1: Desde la App Móvil (Inmediata)
                  </div>
                  <p class="text-xs sm:text-sm text-slate-300 mt-2">
                    1. Inicie sesión en la APK <strong>Mi Control UPEA</strong>.<br />
                    2. Diríjase a su pantalla de <strong>Perfil</strong>.<br />
                    3. Presione <strong>"Solicitar eliminación de cuenta"</strong>.<br />
                    4. Confirme la acción. Sus sesiones se cerrarán de inmediato y su dispositivo quedará desvinculado.
                  </p>
                </div>
              </div>

              <!-- Opción 2 -->
              <div class="bg-slate-900/70 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div class="text-blue-400 font-semibold text-sm mb-1 flex items-center gap-2">
                    <span>✉️</span> Opción 2: Solicitud vía Correo Oficial
                  </div>
                  <p class="text-xs sm:text-sm text-slate-300 mt-2">
                    Si desinstaló la aplicación o no tiene su teléfono a mano, envíe un correo a:
                  </p>
                  <p class="mt-2 text-xs font-mono bg-slate-800 p-2 rounded border border-slate-700 text-blue-300">
                    soporte.micontrol@upea.bo
                  </p>
                  <p class="text-xs text-slate-400 mt-2">
                    Adjunte: Nombres completos, Cédula de Identidad (CI) y Carrera asignada.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Qué se elimina y qué se conserva -->
          <section class="space-y-4">
            <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700/60 pb-2">
              <span class="text-blue-400 font-mono text-base">02.</span> Datos que se Suprimen y Plazo de Ejecución
            </h2>

            <div class="bg-slate-900/60 border border-slate-700/60 rounded-xl p-5 space-y-3">
              <h3 class="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                <span>✓</span> Datos Suprimidos Definitivamente
              </h3>
              <ul class="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
                <li><strong class="text-slate-100">Vectores Biométricos Faciales:</strong> Los embeddings generados a partir de su rostro son eliminados de los servidores biométricos para impedir futuros reconocimientos.</li>
                <li><strong class="text-slate-100">Tokens y Credenciales:</strong> Se invalidan todos los tokens de autenticación activos de inmediato.</li>
                <li><strong class="text-slate-100">Vinculación de Dispositivo:</strong> Se elimina el identificador de hardware (Device ID) registrado.</li>
                <li><strong class="text-slate-100">Fotografía de Perfil:</strong> Se elimina del repositorio de imágenes.</li>
              </ul>
            </div>

            <!-- Aviso Legal de Retención -->
            <div class="bg-amber-950/30 border border-amber-500/30 rounded-xl p-5 text-amber-200 text-xs sm:text-sm leading-relaxed">
              <strong class="text-white block mb-1">⚖️ Retención por Exigencia Legal e Institucional:</strong>
              Conforme a la legislación laboral boliviana y normativas de auditoría de la Universidad Pública de El Alto, las marcas históricas de asistencia y horas trabajadas registradas en el pasado deben permanecer archivadas de forma inactiva para efectos de fiscalización y respaldos de nómina. Dichos registros quedan desvinculados de cualquier acceso móvil operativo.
            </div>
          </section>

          <!-- Tiempos de Respuesta -->
          <section class="space-y-3">
            <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700/60 pb-2">
              <span class="text-blue-400 font-mono text-base">03.</span> Tiempo de Procesamiento
            </h2>
            <p>
              La inhabilitación de la cuenta y desvinculación de sesiones es <strong class="text-white">instantánea</strong>. La supresión definitiva de vectores biométricos en la base de datos se completa en un plazo de <strong class="text-white">5 a 10 días hábiles</strong> tras la validación de identidad por parte de la UTIC.
            </p>
          </section>
        </main>

        <!-- Footer -->
        <footer class="bg-slate-900 p-6 border-t border-slate-700 text-center text-xs text-slate-400">
          <p>&copy; 2026 Universidad Pública de El Alto (UPEA) - UTIC</p>
        </footer>

      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import FullScreenLayout from '../../components/layout/FullScreenLayout.vue'
</script>

