<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowRight, Github, Lock, LockKeyhole, Mail, User } from 'lucide-vue-next'

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
      class="mx-auto flex w-full max-w-[480px] flex-col gap-[18px] rounded-lg border border-smart-navy bg-smart-surface/95 px-6 py-7 shadow-[0_12px_24px_rgba(0,0,0,.7)] sm:px-9 sm:pb-[30px] sm:pt-[34px]"
    >
      <AppLogo />

      <div>
        <h1 class="text-[34px] font-semibold leading-[1.05] text-smart-text sm:text-[40px]">
          Create account
        </h1>
        <p class="mt-2 text-[15px] leading-[1.45] text-smart-muted">
          Start a secure markdown workspace for clinical drafts, templates, and review notes.
        </p>
      </div>

      <form class="flex flex-col gap-3.5" @submit.prevent="handleSubmit">
        <button
          type="button"
          class="flex h-12 items-center justify-center gap-2.5 rounded border border-[#2c4150] bg-smart-editor text-sm font-semibold text-smart-text transition hover:border-smart-green/50 hover:bg-smart-panel"
          @click="handleGithubLogin"
        >
          <Github :size="20" :stroke-width="1.5" />
          Sign up with GitHub
        </button>

        <div class="flex h-5 items-center gap-3">
          <span class="h-px flex-1 bg-smart-border" />
          <span class="font-mono text-[10px] font-semibold text-smart-muted">or use email</span>
          <span class="h-px flex-1 bg-smart-border" />
        </div>

        <AuthInput
          id="register-name"
          v-model="name"
          compact
          label="Name"
          autocomplete="name"
          placeholder="Dr. Lena Ortiz"
          :error="errors.name"
        >
          <template #icon>
            <User :size="20" class="text-smart-muted" :stroke-width="1.5" />
          </template>
        </AuthInput>
        <AuthInput
          id="register-email"
          v-model="email"
          compact
          label="Email"
          type="email"
          autocomplete="email"
          placeholder="lena@clinic.org"
          :error="errors.email"
        >
          <template #icon>
            <Mail :size="20" class="text-smart-muted" :stroke-width="1.5" />
          </template>
        </AuthInput>
        <AuthInput
          id="register-password"
          v-model="password"
          compact
          label="Password"
          type="password"
          autocomplete="new-password"
          placeholder="Create a password"
          :error="errors.password"
        >
          <template #icon>
            <Lock :size="20" class="text-smart-muted" :stroke-width="1.5" />
          </template>
        </AuthInput>
        <AuthInput
          id="register-confirm-password"
          v-model="confirmPassword"
          compact
          label="Confirm password"
          type="password"
          autocomplete="new-password"
          placeholder="Confirm password"
          :error="errors.confirmPassword"
        >
          <template #icon>
            <LockKeyhole :size="20" class="text-smart-muted" :stroke-width="1.5" />
          </template>
        </AuthInput>

        <p
          v-if="formError"
          class="rounded border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
        >
          {{ formError }}
        </p>

        <PrimaryButton type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating account...' : 'Create account' }}
          <ArrowRight v-if="!isSubmitting" :size="20" :stroke-width="1.5" />
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
