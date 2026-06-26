import { defineStore } from 'pinia'

import {
  getCurrentUser,
  getGithubAuthUrl,
  signin,
  signout,
  signup,
  type AuthUser,
  type CreateUserDto,
  type SigninDto,
} from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },
  actions: {
    async initialize() {
      if (this.initialized) {
        return
      }

      try {
        this.user = await getCurrentUser()
      } catch {
        this.user = null
      } finally {
        this.initialized = true
      }
    },
    async login(payload: SigninDto) {
      await signin(payload)
      this.user = await getCurrentUser()
      this.initialized = true
    },
    async register(payload: CreateUserDto) {
      await signup(payload)
      await this.login({
        email: payload.email,
        password: payload.password,
      })
    },
    async logout() {
      try {
        await signout()
      } finally {
        this.user = null
        this.initialized = true
      }
    },
    startGithubLogin() {
      window.location.href = getGithubAuthUrl()
    },
  },
})
