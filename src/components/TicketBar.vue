<script setup>
import { DVD, antesDoDvd } from '../config.js'

const visivel = antesDoDvd()
</script>

<template>
  <a
    v-if="visivel"
    class="ticket-bar"
    :href="DVD.ingressos"
    target="_blank"
    rel="noopener"
  >
    <span aria-hidden="true">🎟️</span>
    Ingressos do DVD Tá Tudo BR&amp;M, 02/11 na Arena Pontel Beach →
  </a>
</template>

<style scoped>
.ticket-bar {
  display: block;
  padding: 9px var(--gutter);
  background: var(--turquesa);
  color: var(--escuro);
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
  text-decoration: none;
  border-bottom: 2px solid var(--escuro);
}

@media (hover: hover) and (pointer: fine) {
  .ticket-bar:hover { text-decoration: underline; text-underline-offset: 3px; }
}

.ticket-bar:focus-visible { outline-offset: -4px; }
</style>
