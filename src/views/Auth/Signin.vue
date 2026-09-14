<template>
  <FullScreenLayout>
    <div
      class="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50
             flex items-center justify-center p-4"
    >

      <div class="w-full max-w-md">

        <!-- Encabezado -->
        <div class="text-center mb-7">

          <div
            class="mx-auto flex h-24 w-24 items-center justify-center
                   rounded-2xl bg-white border border-slate-200
                   shadow-md"
          >
            <img
              src="/public/images/logo/mi-control-upea.png"
              alt="Mi Control UPEA"
              class="h-20 w-auto object-contain"
            />
          </div>

          <h1 class="mt-4 text-2xl font-bold tracking-tight text-slate-800">
            Mi Control UPEA
          </h1>

          <div class="mx-auto mt-2 flex items-center justify-center gap-2">
            <span class="h-1 w-8 rounded-full bg-blue-800"></span>
            <span class="h-1 w-3 rounded-full bg-red-600"></span>
          </div>

          <p class="mt-2 text-sm font-medium text-slate-500">
            Carrera de Medicina
          </p>
        </div>


        <!-- Card -->
        <div
          class="rounded-xl border border-slate-200 bg-white
                 shadow-[0_8px_30px_rgb(15,23,42,0.08)]
                 overflow-hidden"
        >

          <!-- Barra superior -->
          <div class="h-1.5 bg-blue-800"></div>

          <div class="p-7 sm:p-8">

            <!-- Título -->
            <div class="mb-7">
              <h2 class="text-xl font-semibold text-slate-800">
                Iniciar sesión
              </h2>

              <p class="mt-1.5 text-sm text-slate-500">
                Ingrese sus datos para acceder al sistema.
              </p>
            </div>


            <!-- Formulario -->
            <form
              @submit.prevent="handleSubmit"
              class="space-y-5"
            >

              <!-- Correo -->
              <div>
                <label
                  for="email"
                  class="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Correo electrónico
                </label>

                <div class="relative">

                  <div
                    class="pointer-events-none absolute inset-y-0 left-0
                           flex items-center pl-3.5 text-slate-400"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.8"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <input
                    v-model="email"
                    id="email"
                    type="email"
                    required
                    autocomplete="email"
                    placeholder="correo@upea.edu.bo"
                    class="h-11 w-full rounded-lg border border-slate-300
                           bg-slate-50 pl-11 pr-3 text-sm text-slate-800
                           placeholder:text-slate-400
                           transition-all duration-150
                           hover:border-slate-400
                           focus:border-blue-700
                           focus:bg-white
                           focus:outline-none
                           focus:ring-3 focus:ring-blue-700/10"
                  />

                </div>
              </div>


              <!-- Contraseña -->
              <div>
                <div class="mb-2 flex items-center justify-between">

                  <label
                    for="password"
                    class="block text-sm font-semibold text-slate-700"
                  >
                    Contraseña
                  </label>

                </div>

                <div class="relative">

                  <div
                    class="pointer-events-none absolute inset-y-0 left-0
                           flex items-center pl-3.5 text-slate-400"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.8"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>


                  <input
                    v-model="password"
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    autocomplete="current-password"
                    placeholder="Ingrese su contraseña"
                    class="h-11 w-full rounded-lg border border-slate-300
                           bg-slate-50 pl-11 pr-11 text-sm text-slate-800
                           placeholder:text-slate-400
                           transition-all duration-150
                           hover:border-slate-400
                           focus:border-blue-700
                           focus:bg-white
                           focus:outline-none
                           focus:ring-3 focus:ring-blue-700/10"
                  />


                  <!-- Mostrar contraseña -->
                  <button
                    type="button"
                    @click="togglePasswordVisibility"
                    class="absolute right-3.5 top-1/2
                           -translate-y-1/2
                           text-slate-400
                           transition-colors
                           hover:text-blue-700
                           focus:outline-none"
                  >

                    <svg
                      v-if="!showPassword"
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.8"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke-width="1.8"
                      />
                    </svg>

                    <svg
                      v-else
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.8"
                        d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 5.09A9.7 9.7 0 0112 5c4.48 0 8.27 2.94 9.54 7a9.7 9.7 0 01-2.04 3.34M6.61 6.61A9.7 9.7 0 002.46 12C3.73 16.06 7.52 19 12 19a9.7 9.7 0 005.39-1.61"
                      />
                    </svg>

                  </button>

                </div>
              </div>


              <!-- Error -->
              <div
                v-if="error"
                class="flex items-start gap-2 rounded-lg
                       border border-red-200 bg-red-50
                       px-3.5 py-3 text-sm text-red-600"
              >

                <svg
                  class="mt-0.5 h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14a2 2 0 001.73 3h16.32a2 2 0 001.73-3l-8.18-14a2 2 0 00-3.46 0z"
                  />
                </svg>

                <span>
                  {{ error }}
                </span>

              </div>


              <!-- Botón -->
              <button
                type="submit"
                :disabled="loading"
                class="mt-2 flex h-11 w-full items-center
                       justify-center rounded-lg
                       bg-blue-800
                       text-sm font-semibold text-white
                       shadow-sm
                       transition-all duration-150
                       hover:bg-blue-900
                       hover:shadow-md
                       focus:outline-none
                       focus:ring-3 focus:ring-blue-800/20
                       active:scale-[0.99]
                       disabled:cursor-not-allowed
                       disabled:opacity-60"
              >
                <span v-if="!loading">
                  Iniciar sesión
                </span>

                <span
                  v-else
                  class="flex items-center gap-2"
                >
                  <svg
                    class="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-30"
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      stroke-width="3"
                    />

                    <path
                      d="M21 12a9 9 0 00-9-9"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                    />
                  </svg>

                  Ingresando...
                </span>
              </button>

            </form>

          </div>


          <!-- Footer de la tarjeta -->
          <div
            class="border-t border-slate-100 bg-slate-50
                   px-7 py-4 text-center"
          >
            <p class="text-xs text-slate-500">
              Acceso exclusivo para personal autorizado
            </p>
          </div>

        </div>


        <!-- Pie -->
        <div class="mt-5 text-center">
          <p class="text-xs text-slate-400">
            Universidad Pública de El Alto · Carrera de Medicina
          </p>
        </div>

      </div>

    </div>
  </FullScreenLayout>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/config'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
      device_id: '1',
    })

    localStorage.setItem('token', response.data.token)
    localStorage.setItem(
      'user',
      JSON.stringify(response.data.user)
    )

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
      axiosError.response?.data?.message ||
      'Correo o contraseña incorrectos'

  } finally {
    loading.value = false
  }
}
</script>