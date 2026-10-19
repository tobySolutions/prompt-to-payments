<script setup lang="ts">
// Hands-on timer. Starts when `run` turns true (tie it to a click). Click it to pause.
import { computed, onUnmounted, ref, watch } from 'vue'
import { useNav } from '@slidev/client'

const props = withDefaults(defineProps<{ minutes: number, run?: boolean }>(), { run: true })
const left = ref(props.minutes * 60)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | undefined
// Exports show the full time instead of whatever second the snapshot caught.
const { isPrintMode } = useNav()

watch(() => props.run, (r) => {
  clearInterval(timer)
  if (!r || isPrintMode.value) return
  timer = setInterval(() => { if (!paused.value && left.value > 0) left.value-- }, 1000)
}, { immediate: true })
onUnmounted(() => clearInterval(timer))

const mmss = computed(() => `${Math.floor(left.value / 60)}:${String(left.value % 60).padStart(2, '0')}`)
const tone = computed(() => (left.value === 0 ? 'done' : left.value <= 60 ? 'last' : ''))
const pct = computed(() => 100 - (left.value / (props.minutes * 60)) * 100)
</script>

<template>
  <button class="cd" :class="[tone, { paused }]" title="Click to pause" @click="paused = !paused">
    <span class="t mono">{{ left === 0 ? 'time' : mmss }}</span>
    <span class="bar"><i :style="{ width: `${pct}%` }" /></span>
  </button>
</template>

<style scoped>
.cd { all: unset; cursor: pointer; display: grid; gap: 0.4rem; width: 12rem; }
.t { font-size: var(--fs-3xl); font-weight: 700; color: var(--text); line-height: 1; }
.bar { height: 6px; background: var(--ground-3); border-radius: 3px; overflow: hidden; }
.bar i { display: block; height: 100%; background: var(--chain); transition: width 1s linear; }
.last .t { color: var(--ai); } .last .bar i { background: var(--ai); }
.done .t { color: var(--ok); }
.paused .t { opacity: 0.4; }
</style>
