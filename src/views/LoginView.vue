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
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const formError = ref('')
const isSubmitting = ref(false)
const errors = reactive({
  email: '',
  password: '',
})

async function handleSubmit() {
  errors.email = ''
  errors.password = ''
  formError.value = ''

  const normalizedEmail = email.value.trim()

  if (!normalizedEmail) {
    errors.email = 'Email is required.'
  } else if (!isValidEmail(normalizedEmail)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password.value) {
    errors.password = 'Password is required.'
  }

  if (errors.email || errors.password) {
    return
  }

  isSubmitting.value = true

  try {
    await authStore.login({
      email: normalizedEmail,
      password: password.value,
    })
    await router.push('/editor')
  } catch (error) {
    formError.value = getApiErrorMessage(error, 'Unable to sign in with those credentials.')
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
      class="auth-card mx-auto flex w-full max-w-[440px] flex-col gap-[22px] rounded-lg border border-smart-border bg-smart-surface/95 px-6 py-7 sm:px-9 sm:pb-8 sm:pt-9"
    >
      <AppLogo icon-only large class="w-full justify-center" />
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <button
          type="button"
          class="flex h-12 items-center justify-center gap-2.5 rounded bg-smart-editor text-sm font-semibold text-smart-text shadow-[inset_0_0_0_1px_rgba(255,255,255,.04),0_1px_2px_rgba(0,0,0,.18)] transition hover:bg-smart-panel focus:outline-none focus:ring-2 focus:ring-smart-green/30"
          @click="handleGithubLogin"
        >
          <Github :size="20" :stroke-width="1.5" />
          Continue with GitHub
        </button>

        <div class="flex h-5 items-center justify-center">
          <span class="font-mono text-[10px] font-semibold text-smart-muted">
            or continue with email
          </span>
        </div>

        <AuthInput
          id="login-email"
          v-model="email"
          label="Email"
          type="email"
          autocomplete="email"
          placeholder="Email"
          :error="errors.email"
          hide-label
          borderless
        />
        <AuthInput
          id="login-password"
          v-model="password"
          label="Password"
          type="password"
          autocomplete="current-password"
          placeholder="Password"
          :error="errors.password"
          hide-label
          borderless
        />

        <p v-if="formError" class="auth-error rounded border px-3 py-2 text-sm">
          {{ formError }}
        </p>

        <div class="flex items-center justify-between gap-4">
          <label class="flex cursor-pointer items-center gap-[9px] text-[13px] text-smart-muted">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="size-4 rounded border border-smart-green bg-smart-editor accent-smart-green"
            />
            Remember me
          </label>
          <button
            type="button"
            class="text-[13px] font-semibold text-smart-green-bright hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <PrimaryButton type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
        </PrimaryButton>
      </form>

      <p class="text-center text-sm text-smart-muted">
        New to Smartmd?
        <RouterLink
          to="/register"
          class="ml-1 font-semibold text-smart-green-bright hover:underline"
        >
          Create an account
        </RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>
