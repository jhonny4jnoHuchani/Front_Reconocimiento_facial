<template>
  <FullScreenLayout>
    <div class="relative min-h-screen w-full overflow-x-hidden bg-[#020714] font-sans text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      
      <!-- ================= BACKGROUND LAYERS ================= -->
      <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <!-- Architectural background of UPEA Central Building -->
        <img
          src="/images/auth/upea-building-bg.jpg"
          alt="Edificio Central UPEA"
          class="h-full w-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
        />

        <!-- Deep Royal Cyber Blue Gradient Overlays -->
        <div class="absolute inset-0 bg-gradient-to-tr from-[#020714] via-[#041029]/90 to-[#02081a]/95"></div>
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/25 via-transparent to-[#020714]/90"></div>

        <!-- Ambient Cyber Glows and Lights -->
        <div class="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[130px]"></div>
        <div class="absolute top-1/3 -right-32 h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[150px]"></div>
        <div class="absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-500/15 blur-[140px]"></div>

        <!-- Futuristic Cyber Grid -->
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#06b6d40a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <!-- ================= TOP HEADER (NAVBAR) ================= -->
      <header class="relative z-10 w-full px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6">
        <div class="mx-auto flex max-w-7xl items-center justify-between border-b border-cyan-500/15 pb-4">
          
          <!-- Left: Institutional Branding (UPEA) -->
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-white/5 border border-cyan-400/20 backdrop-blur-md p-1 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <img
                src="/images/auth/upea-banner-logo.png"
                alt="Escudo UPEA"
                class="h-full w-full object-contain"
              />
            </div>
            <div>
              <h2 class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
                Universidad Pública de El Alto
              </h2>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="inline-block text-[10px] sm:text-xs font-semibold text-cyan-400">
                  Carrera de Medicina
                </span>
                <span class="h-1 w-1 rounded-full bg-slate-500"></span>
                <span class="hidden sm:inline-block text-[10px] text-slate-400">
                  Autónoma por Ley 2556 · XII - XI - MMIII
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Tech Unit Branding (UTIC) -->
          <div class="flex items-center gap-3">
            <div class="hidden md:block text-right">
              <div class="flex items-center justify-end gap-1.5">
                <span class="text-xs sm:text-sm font-extrabold tracking-widest text-white">TIC</span>
                <span class="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-400/40">
                  UTIC
                </span>
              </div>
              <p class="text-[10px] sm:text-[11px] text-cyan-200/70 max-w-[210px] leading-tight mt-0.5">
                UNIDAD DE TECNOLOGÍAS DE INFORMACIÓN Y COMUNICACIONES
              </p>
            </div>
            <div class="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-900/80 border border-cyan-400/40 p-1 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <img
                src="/images/auth/tic-upea-logo.png"
                alt="Logo TIC UPEA"
                class="h-full w-full object-contain rounded-full"
              />
            </div>
          </div>

        </div>
      </header>

      <!-- ================= MAIN CONTENT (SPLIT HERO & LOGIN) ================= -->
      <main class="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12 py-6 sm:py-10 flex-1 flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          
          <!-- LEFT COLUMN: 3D BIOMETRIC ROBOT & SYSTEM HERO (DESKTOP) -->
          <div class="lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            
            <!-- System Title & Badge -->
            <div class="mb-4 sm:mb-6">
              <div class="inline-flex items-center gap-2 rounded-full bg-cyan-950/60 border border-cyan-400/40 px-3.5 py-1 text-xs text-cyan-300 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)] mb-3">
                <span class="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span class="font-semibold tracking-wide">SISTEMA BIOMÉTRICO INSTITUCIONAL</span>
              </div>

              <h1 class="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md">
                MI CONTROL <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">UPEA</span>
              </h1>
              
              <div class="mt-2 flex items-center justify-center lg:justify-start gap-2">
                <span class="h-1 w-10 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
                <span class="h-1 w-3 rounded-full bg-blue-500"></span>
              </div>

              <p class="mt-3 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Plataforma tecnológica de reconocimiento facial, validación perimétrica y control de asistencia docente en tiempo real para la Carrera de Medicina.
              </p>
            </div>

            <!-- 3D Mascot Robot with Holographic Rings and Floating Badges -->
            <div class="relative w-full max-w-[460px] my-2 select-none">
              
              <!-- Floating Glass Badge 1: Biométrico Facial (Top-Left) -->
              <div class="hidden sm:flex absolute -top-3 left-2 z-20 items-center gap-2.5 rounded-xl border border-cyan-400/40 bg-[#091834]/85 px-3 py-2 text-left backdrop-blur-md shadow-[0_4px_20px_rgba(6,182,212,0.3)] animate-bounce-slow">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                    <circle cx="12" cy="12" r="3" stroke-width="1.8" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-white leading-tight">Biométrico Facial</p>
                  <p class="text-[10px] text-cyan-300">IA Tiempo Real</p>
                </div>
              </div>

              <!-- Floating Glass Badge 2: Geolocalización GPS (Top-Right) -->
              <div class="hidden sm:flex absolute -top-1 right-2 z-20 items-center gap-2.5 rounded-xl border border-cyan-400/40 bg-[#091834]/85 px-3 py-2 text-left backdrop-blur-md shadow-[0_4px_20px_rgba(6,182,212,0.3)] animate-float-delayed">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <circle cx="12" cy="11" r="2" stroke-width="1.8" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-white leading-tight">Geolocalización</p>
                  <p class="text-[10px] text-cyan-300">Perímetro UPEA</p>
                </div>
              </div>

              <!-- Floating Glass Badge 3: Control Docente (Bottom-Left) -->
              <div class="hidden sm:flex absolute bottom-8 -left-4 z-20 items-center gap-2.5 rounded-xl border border-cyan-400/40 bg-[#091834]/85 px-3 py-2 text-left backdrop-blur-md shadow-[0_4px_20px_rgba(6,182,212,0.3)] animate-float">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-white leading-tight">Control Docente</p>
                  <p class="text-[10px] text-cyan-300">Horarios y Aulas</p>
                </div>
              </div>

              <!-- Floating Glass Badge 4: Seguridad Cifrada (Bottom-Right) -->
              <div class="hidden sm:flex absolute bottom-8 -right-4 z-20 items-center gap-2.5 rounded-xl border border-cyan-400/40 bg-[#091834]/85 px-3 py-2 text-left backdrop-blur-md shadow-[0_4px_20px_rgba(6,182,212,0.3)] animate-bounce-slow">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-white leading-tight">Seguridad UTIC</p>
                  <p class="text-[10px] text-cyan-300">Acceso Cifrado</p>
                </div>
              </div>

              <!-- 3D Mascot Image with subtle mask to melt into background -->
              <div class="relative mx-auto flex items-center justify-center">
                <img
                  src="/images/auth/biometric-robot.png"
                  alt="Mascota Biometría IA UPEA"
                  class="h-64 sm:h-80 w-auto object-contain filter drop-shadow-[0_15px_30px_rgba(6,182,212,0.4)]"
                  style="mask-image: radial-gradient(circle at 50% 50%, black 70%, transparent 95%); -webkit-mask-image: radial-gradient(circle at 50% 50%, black 70%, transparent 95%);"
                />

                <!-- Holographic Base Rings under Robot Feet -->
                <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 h-14 rounded-[100%] bg-cyan-500/25 blur-md pointer-events-none"></div>
                <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-56 h-10 rounded-[100%] border border-cyan-400/70 shadow-[0_0_25px_rgba(6,182,212,0.9)] pointer-events-none"></div>
                <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-6 rounded-[100%] border border-cyan-200/90 shadow-[0_0_15px_rgba(34,211,238,1)] pointer-events-none"></div>
              </div>

            </div>

          </div>


          <!-- RIGHT COLUMN: HIGH-END GLASSMORPHIC LOGIN CARD -->
          <div class="lg:col-span-5 w-full flex justify-center order-1 lg:order-2">
            
            <div class="relative w-full max-w-md">
              
              <!-- Neon Cyan Ambient Card Aura -->
              <div class="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-cyan-500/35 via-blue-600/20 to-cyan-400/35 blur-xl opacity-75"></div>

              <!-- Main Glass Card Container -->
              <div class="relative rounded-[28px] border border-cyan-400/40 bg-[#071329]/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.25)] p-6 sm:p-9 overflow-hidden">
                
                <!-- Glowing Top Padlock Icon / Badge -->
                <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-cyan-500/25 to-blue-950/80 border-2 border-cyan-400/70 shadow-[0_0_30px_rgba(6,182,212,0.6)] relative group">
                  <div class="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping opacity-35 pointer-events-none"></div>
                  <svg class="h-10 w-10 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.85)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>

                <!-- Card Heading -->
                <div class="text-center mt-4 mb-6">
                  <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                    Iniciar Sesión
                  </h2>
                  <p class="text-xs sm:text-sm text-cyan-100/70 mt-1.5">
                    Accede al sistema con tu usuario y contraseña
                  </p>
                </div>

                <!-- Error Message Banner -->
                <div
                  v-if="error"
                  class="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/50 bg-red-950/70 p-3.5 text-xs sm:text-sm text-red-200 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-shake"
                >
                  <svg class="h-5 w-5 shrink-0 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{{ error }}</span>
                </div>

                <!-- Login Form -->
                <form @submit.prevent="handleSubmit" class="space-y-5">
                  
                  <!-- Field: Usuario / Correo -->
                  <div>
                    <label for="email" class="block text-xs font-semibold uppercase tracking-wider text-cyan-200/80 mb-2">
                      Usuario o Correo Electrónico
                    </label>

                    <div class="relative">
                      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-cyan-300/70">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>

                      <input
                        v-model="email"
                        id="email"
                        type="text"
                        required
                        autocomplete="username email"
                        placeholder="Ingrese su usuario o correo"
                        class="h-12 w-full rounded-xl border border-cyan-500/30 bg-[#050f24]/80 pl-12 pr-4 text-sm text-white placeholder-slate-400 transition-all duration-200 hover:border-cyan-400/60 focus:border-cyan-400 focus:bg-[#071530] focus:outline-none focus:ring-4 focus:ring-cyan-400/20 shadow-inner"
                      />
                    </div>
                  </div>

                  <!-- Field: Contraseña -->
                  <div>
                    <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-cyan-200/80 mb-2">
                      Contraseña
                    </label>

                    <div class="relative">
                      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-cyan-300/70">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>

                      <input
                        v-model="password"
                        id="password"
                        :type="showPassword ? 'text' : 'password'"
                        required
                        autocomplete="current-password"
                        placeholder="Ingrese su contraseña"
                        class="h-12 w-full rounded-xl border border-cyan-500/30 bg-[#050f24]/80 pl-12 pr-12 text-sm text-white placeholder-slate-400 transition-all duration-200 hover:border-cyan-400/60 focus:border-cyan-400 focus:bg-[#071530] focus:outline-none focus:ring-4 focus:ring-cyan-400/20 shadow-inner"
                      />

                      <!-- Toggle password visibility -->
                      <button
                        type="button"
                        @click="togglePasswordVisibility"
                        class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-cyan-300 transition-colors focus:outline-none"
                        title="Mostrar u ocultar contraseña"
                      >
                        <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          <circle cx="12" cy="12" r="3" stroke-width="1.8" />
                        </svg>
                        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 5.09A9.7 9.7 0 0112 5c4.48 0 8.27 2.94 9.54 7a9.7 9.7 0 01-2.04 3.34M6.61 6.61A9.7 9.7 0 002.46 12C3.73 16.06 7.52 19 12 19a9.7 9.7 0 005.39-1.61" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Options Row: Remember Me & Forgot Password -->
                  <div class="flex items-center justify-between text-xs pt-1">
                    <label class="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white transition-colors">
                      <input
                        v-model="rememberMe"
                        type="checkbox"
                        class="h-4 w-4 rounded border-cyan-500/40 bg-[#050f24] text-cyan-500 focus:ring-cyan-400/40 focus:ring-offset-0 cursor-pointer"
                      />
                      <span>Recordarme</span>
                    </label>

                    <button
                      type="button"
                      @click="handleForgotPassword"
                      class="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors focus:outline-none"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <!-- Submit Button with Gradient & Cyan Glow -->
                  <button
                    type="submit"
                    :disabled="loading"
                    class="group relative flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-sm font-bold text-white shadow-[0_4px_25px_rgba(6,182,212,0.45)] hover:shadow-[0_6px_35px_rgba(6,182,212,0.7)] hover:brightness-110 active:scale-[0.99] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span v-if="!loading" class="flex items-center gap-2">
                      <svg class="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Ingresar</span>
                    </span>

                    <span v-else class="flex items-center gap-2">
                      <svg class="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-30" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" />
                        <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                      </svg>
                      <span>Verificando credenciales...</span>
                    </span>
                  </button>

                </form>

                <!-- Sub-footer inside Card -->
                <div class="mt-6 pt-4 border-t border-cyan-500/20 text-center">
                  <div class="mx-auto mb-2.5 h-1 w-12 rounded-full bg-cyan-400/80 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                  <p class="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-cyan-200/60">
                    UNIDAD DE TECNOLOGÍAS DE INFORMACIÓN Y COMUNICACIONES
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </main>

      <!-- ================= PAGE FOOTER ================= -->
      <footer class="relative z-10 w-full px-4 sm:px-8 py-4 text-center text-[11px] text-slate-400 border-t border-cyan-500/10">
        <p>
          © 2026 Universidad Pública de El Alto — Carrera de Medicina · Sistema de Control Biométrico Facial (UTIC)
        </p>
      </footer>

    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '@/api/config'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleForgotPassword = () => {
  Swal.fire({
    title: 'Recuperación de Contraseña',
    text: 'Para restablecer su contraseña, por favor comuníquese con el administrador del sistema o la Unidad de Tecnologías de Información y Comunicación (UTIC).',
    icon: 'info',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#0284c7',
    background: '#071329',
    color: '#ffffff',
  })
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.post('/admin/auth/login', {
      email: email.value,
      password: password.value,
    })

    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    if (rememberMe.value) {
      localStorage.setItem('remembered_email', email.value)
    } else {
      localStorage.removeItem('remembered_email')
    }

    router.push('/')
  } catch (err: unknown) {
    const axiosError = err as {
      response?: {
        data?: {
          message?: string
        }
      }
    }

    error.value =
      axiosError.response?.data?.message || 'Correo o contraseña incorrectos'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes floatDelayed {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounceSlow {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

.animate-float-delayed {
  animation: floatDelayed 6s ease-in-out infinite 1.5s;
}

.animate-bounce-slow {
  animation: bounceSlow 4.5s ease-in-out infinite 0.75s;
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>