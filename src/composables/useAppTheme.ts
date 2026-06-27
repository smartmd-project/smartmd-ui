import { ref, watch } from 'vue'

export type AppTheme = 'dark' | 'light'

const storageKey = 'smartmd.theme'

function getInitialTheme(): AppTheme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = window.localStorage.getItem(storageKey)

  return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light'
}

const theme = ref<AppTheme>(getInitialTheme())

if (typeof window !== 'undefined') {
  watch(
    theme,
    (value) => {
      window.localStorage.setItem(storageKey, value)
    },
    { immediate: true },
  )
}

export function useAppTheme() {
  function setTheme(value: AppTheme) {
    theme.value = value
  }

  return {
    theme,
    setTheme,
  }
}
