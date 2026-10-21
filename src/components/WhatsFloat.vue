<script setup>
import { WHATSAPP } from '../config.js'
import IconWhatsapp from './IconWhatsapp.vue'
</script>

<template>
  <a
    class="whats-float"
    :href="WHATSAPP.url"
    target="_blank"
    rel="noopener"
    aria-label="Pedir proposta pelo WhatsApp"
  >
    <IconWhatsapp />
  </a>
</template>

<style scoped>
.whats-float {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 60;
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border: 2.5px solid var(--escuro);
  border-radius: 50%;
  background: var(--rosa);
  color: var(--escuro);
  box-shadow: 4px 4px 0 var(--escuro);
  transition: transform 160ms var(--ease-out), box-shadow 160ms var(--ease-out);
}
.whats-float svg { width: 30px; height: 30px; }

@media (hover: hover) and (pointer: fine) {
  .whats-float:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--escuro); }
}
.whats-float:active { transform: translate(3px, 3px); box-shadow: 1px 1px 0 var(--escuro); }

@media (min-width: 768px) {
  .whats-float { right: 28px; bottom: 28px; }
}

@media (prefers-reduced-motion: reduce) {
  .whats-float { transition: none; }
}
</style>
