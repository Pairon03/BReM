<script setup>
import { INSTAGRAM } from '../config.js'
import IconInstagram from './IconInstagram.vue'
</script>

<template>
  <section class="section insta" aria-labelledby="insta-titulo">
    <div class="container">
      <h2 id="insta-titulo" class="insta__titulo">Siga a dupla</h2>
      <p class="insta__texto">Bastidores, agenda e vídeos de show no Instagram</p>
      <a class="insta__handle" :href="INSTAGRAM.url" target="_blank" rel="noopener">
        {{ INSTAGRAM.handle }}
      </a>
      <a class="btn btn--grande" :href="INSTAGRAM.url" target="_blank" rel="noopener">
        <IconInstagram />
        Seguir {{ INSTAGRAM.handle }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.insta {
  background: var(--turquesa);
  border-block: 2px solid var(--escuro);
}

.insta__titulo { font-size: clamp(1.5rem, 4vw, 2.25rem); }

.insta__texto {
  margin-top: 12px;
  font-size: clamp(1.125rem, 2.4vw, 1.375rem);
  font-weight: 500;
}

.insta__handle {
  display: block;
  margin-block: 28px 36px;
  font-family: var(--font-titulo);
  font-size: clamp(1.375rem, 6.4vw, 5rem);
  line-height: 1;
  letter-spacing: -0.03em;
  text-decoration: none;
  overflow-wrap: anywhere;
}

@media (hover: hover) and (pointer: fine) {
  .insta__handle:hover { text-decoration: underline; text-decoration-thickness: 4px; text-underline-offset: 8px; }
}
</style>
