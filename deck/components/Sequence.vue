<script setup lang="ts">
// A sequence diagram that draws one message per click.
// actors: [{ id, label, tone }]; steps: [{ from, to, label, tone?, note? }]
// from === to draws a self-note on that lane (a check the actor does itself).
import { computed } from 'vue'

type Tone = 'ai' | 'chain' | 'bug' | 'ok' | 'http' | 'muted'
type Actor = { id: string, label: string, tone?: Tone }
type Step = { from: string, to: string, label: string, tone?: Tone }

const props = withDefaults(defineProps<{ actors: Actor[], steps: Step[], step?: number, rowH?: number, width?: number }>(), { step: 99, rowH: 44, width: 880 })

const top = 46
const x = (id: string) => {
  const i = props.actors.findIndex(a => a.id === id)
  const gap = props.width / props.actors.length
  return gap * i + gap / 2
}
const height = computed(() => top + props.steps.length * props.rowH + 16)
const rows = computed(() => props.steps.map((s, i) => {
  const y = top + 18 + i * props.rowH
  const x1 = x(s.from), x2 = x(s.to)
  const self = s.from === s.to
  const len = self ? 0 : Math.abs(x2 - x1)
  return { ...s, y, x1, x2, self, len, dir: Math.sign(x2 - x1), on: i < props.step, now: i === props.step - 1 }
}))
const color = (t?: Tone) => `var(--${t === 'muted' ? 'muted' : t ?? 'text-2'})`
</script>

<template>
  <svg class="seq" :viewBox="`0 0 ${width} ${height}`" role="img">
    <g v-for="a in actors" :key="a.id">
      <rect :x="x(a.id) - 80" y="2" width="160" height="32" rx="4" :stroke="color(a.tone)" fill="var(--ground-2)" />
      <text :x="x(a.id)" y="23" text-anchor="middle" class="actor" :fill="color(a.tone)">{{ a.label }}</text>
      <line :x1="x(a.id)" :x2="x(a.id)" y1="34" :y2="height" stroke="var(--line)" stroke-dasharray="3 5" />
    </g>
    <g v-for="(r, i) in rows" :key="i" class="msg" :class="{ on: r.on, now: r.now }">
      <template v-if="!r.self">
        <line :x1="r.x1" :x2="r.x2 - r.dir * 7" :y1="r.y" :y2="r.y" :stroke="color(r.tone)" stroke-width="2"
          :style="{ strokeDasharray: r.len, strokeDashoffset: r.on ? 0 : r.len }" class="draw" />
        <path :d="`M ${r.x2} ${r.y} l ${-r.dir * 9} -5 v 10 z`" :fill="color(r.tone)" class="head" />
        <text :x="(r.x1 + r.x2) / 2" :y="r.y - 7" text-anchor="middle" class="label" :fill="color(r.tone)">{{ r.label }}</text>
      </template>
      <template v-else>
        <rect :x="r.x1 - 8" :y="r.y - 11" width="16" height="22" rx="3" :fill="color(r.tone)" class="head" />
        <text :x="r.x1 + 16" :y="r.y + 5" class="label" :fill="color(r.tone)">{{ r.label }}</text>
      </template>
    </g>
  </svg>
</template>

<style scoped>
.seq { width: 100%; height: auto; overflow: visible; }
.actor { font-family: var(--font); font-size: var(--fs-base); font-weight: 700; }
.label { font-family: var(--mono); font-size: var(--fs-sm); font-weight: 600; paint-order: stroke; stroke: var(--ground); stroke-width: 4px; }
.msg { opacity: 0; transition: opacity .3s; }
.msg.on { opacity: 1; }
.msg .draw { transition: stroke-dashoffset .55s var(--ease); }
.msg .head { opacity: 0; transition: opacity .2s .45s; }
.msg.on .head { opacity: 1; }
.msg.on:not(.now) { opacity: 0.55; }
</style>
