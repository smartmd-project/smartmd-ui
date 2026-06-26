<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    disabled: false,
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex h-[50px] w-full items-center justify-center gap-2.5 rounded bg-smart-green px-5 text-[15px] font-semibold text-smart-bg transition hover:bg-smart-green-bright focus:outline-none focus:ring-2 focus:ring-smart-green/45 focus:ring-offset-2 focus:ring-offset-smart-bg disabled:cursor-not-allowed disabled:opacity-60"
  >
    <slot />
  </button>
</template>
