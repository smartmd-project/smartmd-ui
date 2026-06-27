<script setup lang="ts">
import { computed } from 'vue'

import { useAppTheme } from '@/composables/useAppTheme'

const { theme } = useAppTheme()
const isDark = computed(() => theme.value === 'dark')
</script>

<template>
  <main
    class="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 text-smart-text"
    :class="[
      isDark ? 'theme-dark' : 'theme-light',
      isDark
        ? 'bg-[linear-gradient(180deg,#061016_0%,#071923_44%,#041015_100%)]'
        : 'bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fa_48%,#f1f5f9_100%)]',
    ]"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-100 [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_18%,transparent_76%)]"
      :class="
        isDark
          ? '[background-image:linear-gradient(rgba(143,165,179,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(143,165,179,0.14)_1px,transparent_1px)]'
          : '[background-image:linear-gradient(rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.07)_1px,transparent_1px)]'
      "
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0"
      :class="
        isDark
          ? 'bg-[radial-gradient(circle_at_50%_24%,rgba(69,193,134,0.12),transparent_34%),radial-gradient(circle_at_18%_72%,rgba(32,56,76,0.28),transparent_28%)]'
          : 'bg-[radial-gradient(circle_at_50%_24%,rgba(16,185,129,0.08),transparent_34%),radial-gradient(circle_at_18%_72%,rgba(100,116,139,0.08),transparent_28%)]'
      "
      aria-hidden="true"
    />
    <section class="relative z-10 w-full">
      <slot />
    </section>
  </main>
</template>
