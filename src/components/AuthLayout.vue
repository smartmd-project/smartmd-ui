<template>
  <main
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#061016_0%,#071923_42%,#041015_100%)] px-5 py-10"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(143,165,179,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(143,165,179,0.14)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_78%)]"
      aria-hidden="true"
    />
    <section class="relative z-10 w-full">
      <slot />
    </section>
  </main>
</template>
