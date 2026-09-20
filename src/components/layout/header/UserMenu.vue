<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img src="/images/user/owner.jpg" alt="User" />
      </span>

      <span class="hidden sm:inline mr-1 font-medium text-theme-sm">{{ userName }}</span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ userName }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ userEmail }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li>
          <button
            @click="abrirCambiarPassword"
            class="w-full flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <KeyRound :size="18" class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            Cambiar contraseña
          </button>
        </li>
      </ul>
      <button
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Cerrar Sesión
      </button>
    </div>

    <!-- Modal Cambiar Contraseña -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Cambiar contraseña
          </h3>
          <button
            @click="cerrarCambiarPassword"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X :size="22" />
          </button>
        </div>

        <form @submit.prevent="guardarPassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Contraseña actual
            </label>
            <input
              v-model="passwordForm.password_actual"
              type="password"
              required
              class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Nueva contraseña
            </label>
            <input
              v-model="passwordForm.password_nueva"
              type="password"
              required
              minlength="8"
              class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Mínimo 8 caracteres.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Confirmar nueva contraseña
            </label>
            <input
              v-model="passwordForm.password_nueva_confirmation"
              type="password"
              required
              minlength="8"
              class="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              @click="cerrarCambiarPassword"
              class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-5 py-2.5 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {{ saving ? 'Cambiando...' : 'Cambiar contraseña' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronDownIcon, LogoutIcon } from '@/icons'
import { KeyRound, X } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { logout, cambiarPassword } from '@/api/endpoints'

const router = useRouter()
const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const userName = ref('Admin')
const userEmail = ref('')

// Cambiar contraseña
const showPasswordModal = ref(false)
const passwordForm = ref({
  password_actual: '',
  password_nueva: '',
  password_nueva_confirmation: '',
})
const saving = ref(false)
const errorMsg = ref('')

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  userName.value = user.nombre_completo || 'Admin'
  userEmail.value = user.email || ''
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const abrirCambiarPassword = () => {
  closeDropdown()
  errorMsg.value = ''
  passwordForm.value = {
    password_actual: '',
    password_nueva: '',
    password_nueva_confirmation: '',
  }
  showPasswordModal.value = true
}

const cerrarCambiarPassword = () => {
  showPasswordModal.value = false
  errorMsg.value = ''
}

const guardarPassword = async () => {
  errorMsg.value = ''

  if (passwordForm.value.password_nueva !== passwordForm.value.password_nueva_confirmation) {
    errorMsg.value = 'Las contraseñas nuevas no coinciden.'
    return
  }

  if (passwordForm.value.password_nueva.length < 8) {
    errorMsg.value = 'La nueva contraseña debe tener al menos 8 caracteres.'
    return
  }

  saving.value = true
  try {
    await cambiarPassword({
      password_actual: passwordForm.value.password_actual,
      password_nueva: passwordForm.value.password_nueva,
      password_nueva_confirmation: passwordForm.value.password_nueva_confirmation,
    })

    const isDark = document.documentElement.classList.contains('dark')
    cerrarCambiarPassword()

    Swal.fire({
      title: '¡Contraseña actualizada!',
      text: 'Tu contraseña fue cambiada. Las demás sesiones se cerraron.',
      icon: 'success',
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
      customClass: {
        popup: 'font-sans rounded-[2.5rem] border border-emerald-500/20 dark:border-slate-700/60 p-6 shadow-2xl',
        title: 'text-xl font-extrabold text-slate-900 dark:text-slate-100',
        htmlContainer: 'text-sm font-medium text-slate-500 dark:text-slate-400 mt-1',
      },
    })
  } catch (e) {
    errorMsg.value = e.response?.data?.message || 'No se pudo cambiar la contraseña.'
  } finally {
    saving.value = false
  }
}

const signOut = async () => {
  try { await logout() } catch (e) {}
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/signin')
  closeDropdown()
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}
</script>