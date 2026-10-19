<script setup lang="ts">
// What changed on Solana in the weeks before this workshop. One per click.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })
const items = [
  { when: 'Jul', what: "Solana Foundation's AI dev skill: don't start new apps on framework-kit or wallet-adapter", old: 'Our AI first draft still used wallet-adapter' },
  { when: 'Sep', what: 'Rent cut, first 2 of 5 steps', old: 'A token account now costs 0.00148844 SOL, not the 0.00203928 in older code and docs' },
  { when: '15 Sep', what: 'v1 transactions on mainnet', old: 'getTransaction without maxSupportedTransactionVersion: 1 errors on them' },
  { when: '9 Oct', what: 'Slots 400 ms → 200 ms', old: 'A blockhash now expires in ~30 s, not ~60 s' },
  { when: '21 Oct', what: 'Alpenglow on mainnet', old: 'Finality target ~150 ms. "confirmed" and "finalized" become the same thing' },
]
</script>

<template>
  <ol class="cc">
    <li v-for="(it, i) in items" :key="i" :class="{ on: step > i }">
      <span class="when mono">{{ it.when }}</span>
      <b>{{ it.what }}</b>
      <span class="old">{{ it.old }}</span>
    </li>
  </ol>
</template>

<style scoped>
.cc { list-style: none; padding: 0 !important; margin: 1rem 0 0; display: grid; gap: 0.15rem; }
.cc li { display: grid; grid-template-columns: 5.5em minmax(0, 1fr) minmax(0, 1.25fr); gap: 1rem; align-items: baseline; padding: 0.55rem 0; border-bottom: 1px solid var(--line); opacity: 0.12; transition: opacity .4s; margin: 0 !important; }
.cc li.on { opacity: 1; }
.when { color: var(--chain); font-size: var(--fs-sm); }
.cc b { font-size: var(--fs-md); font-weight: 700; }
.old { font-size: var(--fs-sm); color: var(--ai); }
</style>
