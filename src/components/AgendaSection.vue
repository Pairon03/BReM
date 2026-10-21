<script setup>
import { WHATSAPP, antesDoDvd } from '../config.js'
import IconWhatsapp from './IconWhatsapp.vue'

const antes = antesDoDvd()
</script>

<template>
  <section class="section agenda" aria-labelledby="agenda-titulo">
    <div class="container">
      <h2 id="agenda-titulo" class="agenda__titulo">
        Agenda <span class="agenda__ano">2027</span>
      </h2>
      <p v-if="antes" class="agenda__texto">
        Em 2 de novembro, às 14h, na Arena Pontel Beach, gravamos o DVD
        <span class="script">Tá Tudo</span> BR&amp;M. Depois disso, a agenda de 2027 vai ficar
        mais disputada.
      </p>
      <p v-else class="agenda__texto">
        O DVD <span class="script">Tá Tudo</span> BR&amp;M está gravado. A agenda de 2027 já está
        aberta, e as melhores datas vão primeiro.
      </p>
      <a class="btn btn--grande btn--creme" :href="WHATSAPP.url" target="_blank" rel="noopener">
        <IconWhatsapp />
        Garantir minha data antes da agenda fechar
      </a>
    </div>
  </section>
</template>

<style scoped>
.agenda {
  background: var(--gradiente-sol);
  border-block: 2px solid var(--escuro);
}

.agenda__titulo { font-size: clamp(2.5rem, 9vw, 5.5rem); }
.agenda__ano { -webkit-text-stroke: 2px var(--escuro); color: transparent; }

.agenda__texto {
  margin-block: 24px 36px;
  max-width: 40ch;
  font-size: clamp(1.1875rem, 2.8vw, 1.5rem);
  line-height: 1.45;
  font-weight: 500;
}

.script { font-family: var(--font-script); font-size: 1.1em; line-height: 1; }
</style>
