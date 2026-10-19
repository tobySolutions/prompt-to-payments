<script setup lang="ts">
// Title slide: the prompt on the left turns into a paid receipt on the right.
</script>

<template>
  <div class="slidev-layout cover">
    <div class="left">
      <slot />
    </div>
    <div class="right" v-motion :initial="{ y: -40, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 500, duration: 700 } }">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.cover { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 2.5rem; align-items: center; padding: 2.4rem 3.2rem; }
.left :deep(h1) { font-size: var(--fs-display); font-weight: 900; font-stretch: 72%; line-height: 0.88; letter-spacing: -0.02em; margin: 0 0 0.25em; }
.left :deep(h1 .to) { display: block; color: var(--muted); font-weight: 400; font-stretch: 100%; font-size: var(--fs-2xl); line-height: 1.1; margin: 0.12em 0; }
.left :deep(p:not([class*="chain"])) { color: var(--text-2); font-size: var(--fs-md); margin: 0.2em 0; }
</style>
