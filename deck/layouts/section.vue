<script setup lang="ts">
// Section divider. `tone` is the meaning colour; `num` is the part of the session.
withDefaults(defineProps<{ tone?: 'ai' | 'chain' | 'bug' | 'ok' | 'http', num?: string | number }>(), { tone: 'chain' })
</script>

<template>
  <div class="slidev-layout section" :class="[tone, { solo: !num }]">
    <div class="num" v-if="num" v-motion :initial="{ x: -30, opacity: 0 }" :enter="{ x: 0, opacity: 1, transition: { duration: 500 } }">{{ num }}</div>
    <div class="inner">
      <div class="bar" v-motion :initial="{ scaleX: 0 }" :enter="{ scaleX: 1, transition: { delay: 150, duration: 500 } }" />
      <slot />
    </div>
  </div>
</template>

<style scoped>
.section { display: grid; grid-template-columns: 180px minmax(0, 1fr); align-items: center; padding: 0 3.2rem; }
.solo { grid-template-columns: minmax(0, 1fr); padding-left: 120px; }
.num { font-size: var(--fs-mega); font-weight: 900; font-stretch: 62%; line-height: 0.8; color: currentColor; }
.ai { color: var(--ai); } .chain { color: var(--chain); } .bug { color: var(--bug); } .ok { color: var(--ok); } .http { color: var(--http); }
.bar { height: 8px; width: 120px; transform-origin: left; margin-bottom: 1.1rem; background: currentColor; }
.inner :deep(h1) { font-size: var(--fs-3xl); font-stretch: 115%; font-weight: 800; color: var(--text); margin: 0 0 0.3em; line-height: 1.02; }
.inner :deep(p) { font-size: var(--fs-md); color: var(--text-2); max-width: 40ch; }
</style>
