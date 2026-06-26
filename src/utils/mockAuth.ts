export interface MockUser {
  name: string
  email: string
}

const mockUserKey = 'smartmd.mock-user'

export function getMockUser(): MockUser | null {
  const storedUser = localStorage.getItem(mockUserKey)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as MockUser
  } catch {
    localStorage.removeItem(mockUserKey)
    return null
  }
}

export function saveMockUser(user: MockUser) {
  localStorage.setItem(mockUserKey, JSON.stringify(user))
}

export function removeMockUser() {
  localStorage.removeItem(mockUserKey)
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
