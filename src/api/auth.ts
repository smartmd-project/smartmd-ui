import { apiClient } from '@/api/http'

export interface AuthUser {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserDto {
  name: string
  email: string
  password: string
}

export type SignupResDto = AuthUser

export interface SigninDto {
  email: string
  password: string
}

export interface SigninResDto {
  message: string
}

export type SignoutResDto = SigninResDto

export async function signup(payload: CreateUserDto) {
  const { data } = await apiClient.post<SignupResDto>('/auth/signup', payload)
  return data
}

export async function signin(payload: SigninDto) {
  const { data } = await apiClient.post<SigninResDto>('/auth/signin', payload)
  return data
}

export async function signout() {
  const { data } = await apiClient.post<SignoutResDto>('/auth/signout')
  return data
}

export async function getCurrentUser() {
  const { data } = await apiClient.get<AuthUser>('/user/me')
  return data
}

export function getGithubAuthUrl() {
  const baseURL = apiClient.defaults.baseURL ?? ''
  return `${baseURL.replace(/\/$/, '')}/auth/github`
}
