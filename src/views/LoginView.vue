<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowRight, Github, Lock, Mail } from 'lucide-vue-next'

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
      class="mx-auto flex w-full max-w-[440px] flex-col gap-[22px] rounded-lg border border-smart-navy bg-smart-surface/95 px-6 py-7 shadow-[0_12px_24px_rgba(0,0,0,.7)] sm:px-9 sm:pb-8 sm:pt-9"
    >
      <AppLogo />

      <div>
        <h1 class="text-[36px] font-semibold leading-[1.05] text-smart-text sm:text-[42px]">
          Welcome back
        </h1>
        <p class="mt-2 text-[15px] leading-[1.45] text-smart-muted">
          Sign in to continue editing clinical markdown with structured AI assistance.
        </p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <button
          type="button"
          class="flex h-12 items-center justify-center gap-2.5 rounded border border-[#2c4150] bg-smart-editor text-sm font-semibold text-smart-text transition hover:border-smart-green/50 hover:bg-smart-panel"
          @click="handleGithubLogin"
        >
          <Github :size="20" :stroke-width="1.5" />
          Continue with GitHub
        </button>

        <div class="flex h-5 items-center gap-3">
          <span class="h-px flex-1 bg-smart-border" />
          <span class="font-mono text-[10px] font-semibold text-smart-muted">
            or continue with email
          </span>
          <span class="h-px flex-1 bg-smart-border" />
        </div>

        <AuthInput
          id="login-email"
          v-model="email"
          label="Email"
          type="email"
          autocomplete="email"
          placeholder="doctor@smartmd.ai"
          :error="errors.email"
        >
          <template #icon>
            <Mail :size="20" class="text-smart-muted" :stroke-width="1.5" />
          </template>
        </AuthInput>
        <AuthInput
          id="login-password"
          v-model="password"
          label="Password"
          type="password"
          autocomplete="current-password"
          placeholder="••••••••••••"
          :error="errors.password"
        >
          <template #icon>
            <Lock :size="20" class="text-smart-muted" :stroke-width="1.5" />
          </template>
        </AuthInput>

        <p
          v-if="formError"
          class="rounded border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
        >
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
          <ArrowRight v-if="!isSubmitting" :size="20" :stroke-width="1.5" />
        </PrimaryButton>
      </form>

      <p class="text-center text-sm text-smart-muted">
        New to SmartMD?
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
