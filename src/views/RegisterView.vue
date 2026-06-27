<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Github } from 'lucide-vue-next'

import AppLogo from '@/components/AppLogo.vue'
import AuthInput from '@/components/AuthInput.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import { getApiErrorMessage } from '@/api/http'
import { useAuthStore } from '@/stores/auth'
import { isValidEmail } from '@/utils/validation'

const router = useRouter()
const authStore = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const formError = ref('')
const isSubmitting = ref(false)
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

async function handleSubmit() {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  formError.value = ''

  const normalizedName = name.value.trim()
  const normalizedEmail = email.value.trim()

  if (!normalizedName) {
    errors.name = 'Name is required.'
  }

  if (!normalizedEmail) {
    errors.email = 'Email is required.'
  } else if (!isValidEmail(normalizedEmail)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password.value) {
    errors.password = 'Password is required.'
  } else if (password.value.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  } else if (password.value.length > 20) {
    errors.password = 'Password must be 20 characters or fewer.'
  }

  if (!confirmPassword.value) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (confirmPassword.value !== password.value) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  if (errors.name || errors.email || errors.password || errors.confirmPassword) {
    return
  }

  isSubmitting.value = true

  try {
    await authStore.register({
      name: normalizedName,
      email: normalizedEmail,
      password: password.value,
    })
    await router.push('/editor')
  } catch (error) {
    formError.value = getApiErrorMessage(error, 'Unable to create your account.')
  } finally {
    isSubmitting.value = false
  }
}

function handleGithubLogin() {
  authStore.startGithubLogin()
}
</script>

<template>
  <AuthLayout>
    <div
      class="auth-card mx-auto flex w-full max-w-[480px] flex-col gap-[18px] rounded-lg border border-smart-border bg-smart-surface/95 px-6 py-7 sm:px-9 sm:pb-[30px] sm:pt-[34px]"
    >
      <AppLogo icon-only large class="w-full justify-center" />

      <form class="flex flex-col gap-3.5" @submit.prevent="handleSubmit">
        <button
          type="button"
          class="flex h-12 items-center justify-center gap-2.5 rounded bg-smart-editor text-sm font-semibold text-smart-text shadow-[inset_0_0_0_1px_rgba(255,255,255,.04),0_1px_2px_rgba(0,0,0,.18)] transition hover:bg-smart-panel focus:outline-none focus:ring-2 focus:ring-smart-green/30"
          @click="handleGithubLogin"
        >
          <Github :size="20" :stroke-width="1.5" />
          Sign up with GitHub
        </button>

        <div class="flex h-5 items-center justify-center">
          <span class="font-mono text-[10px] font-semibold text-smart-muted">or use email</span>
        </div>

        <AuthInput
          id="register-name"
          v-model="name"
          compact
          label="Name"
          autocomplete="name"
          placeholder="Name"
          :error="errors.name"
          hide-label
          borderless
        />
        <AuthInput
          id="register-email"
          v-model="email"
          compact
          label="Email"
          type="email"
          autocomplete="email"
          placeholder="Email"
          :error="errors.email"
          hide-label
          borderless
        />
        <AuthInput
          id="register-password"
          v-model="password"
          compact
          label="Password"
          type="password"
          autocomplete="new-password"
          placeholder="Password"
          :error="errors.password"
          hide-label
          borderless
        />
        <AuthInput
          id="register-confirm-password"
          v-model="confirmPassword"
          compact
          label="Confirm password"
          type="password"
          autocomplete="new-password"
          placeholder="Confirm password"
          :error="errors.confirmPassword"
          hide-label
          borderless
        />

        <p v-if="formError" class="auth-error rounded border px-3 py-2 text-sm">
          {{ formError }}
        </p>

        <PrimaryButton type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating account...' : 'Create account' }}
        </PrimaryButton>
      </form>

      <p class="text-center text-sm text-smart-muted">
        Already have an account?
        <RouterLink to="/login" class="ml-1 font-semibold text-smart-green-bright hover:underline">
          Sign in
        </RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>
