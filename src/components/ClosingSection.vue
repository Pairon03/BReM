<script setup>
import { WHATSAPP } from '../config.js'
import IconWhatsapp from './IconWhatsapp.vue'
</script>

<template>
  <section class="section section--escura fechamento" aria-labelledby="fechamento-titulo">
    <div class="fechamento__sol" aria-hidden="true"></div>
    <div class="container fechamento__inner">
      <h2 id="fechamento-titulo">Seu evento só acontece uma vez. A trilha dele também.</h2>
      <a class="btn btn--grande" :href="WHATSAPP.url" target="_blank" rel="noopener">
        <IconWhatsapp />
        Chamar a dupla no WhatsApp
      </a>
    </div>
  </section>
</template>

<style scoped>
.fechamento {
  position: relative;
  overflow: hidden;
  text-align: center;
}

.fechamento__sol {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: min(720px, 120vw);
  aspect-ratio: 1;
  translate: -50% 62%;
  border-radius: 50%;
  background: var(--gradiente-sol);
  opacity: 0.85;
}

.fechamento__inner {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 40px;
  padding-bottom: clamp(40px, 8vw, 96px);
}

.fechamento h2 {
  max-width: 18ch;
  font-size: clamp(2.25rem, 7vw, 4.5rem);
}
</style>
