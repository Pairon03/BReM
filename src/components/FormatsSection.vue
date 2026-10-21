<script setup>
import { whatsappFormato } from '../config.js'
import IconWhatsapp from './IconWhatsapp.vue'

const formatos = [
  {
    nome: 'Resenha',
    texto: 'Voz e dois violões. Para jantares e cerimônias que pedem proximidade.',
  },
  {
    nome: 'Festa',
    texto: 'Voz, violões e sanfona. A pista enche e o clima sobe.',
    destaque: true,
  },
  {
    nome: 'Showzão',
    texto: 'Formação sob medida, com cada músico extra incluído conforme o evento.',
  },
]
</script>

<template>
  <section id="formatos" class="section formatos" aria-labelledby="formatos-titulo">
    <div class="container">
      <h2 id="formatos-titulo">Formatos</h2>
      <ul class="formatos__grid" role="list">
        <li
          v-for="f in formatos"
          :key="f.nome"
          class="card"
          :class="{ 'card--destaque': f.destaque }"
        >
          <p v-if="f.destaque" class="card__selo">Mais escolhido</p>
          <h3 class="card__nome">{{ f.nome }}</h3>
          <p class="card__texto">{{ f.texto }}</p>
          <a
            class="btn"
            :class="{ 'btn--creme': !f.destaque }"
            :href="whatsappFormato(f.nome)"
            target="_blank"
            rel="noopener"
          >
            <IconWhatsapp />
            Pedir proposta {{ f.nome }}
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.formatos { background: var(--creme-2); border-block: 2px solid var(--escuro); }

.formatos__grid {
  display: grid;
  gap: 28px;
  margin: 48px 0 0;
  padding: 0;
  list-style: none;
  align-items: center;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px 24px;
  background: var(--creme);
  border: 2.5px solid var(--escuro);
  border-radius: var(--raio);
  box-shadow: var(--sombra-dura);
}

.card__nome { font-size: clamp(1.75rem, 4vw, 2.25rem); }
.card__texto { flex: 1; color: var(--texto-suave); }
.card .btn { align-self: flex-start; margin-top: 8px; }

.card--destaque {
  padding: 40px 28px 32px;
  background: var(--escuro);
  color: var(--creme);
}
.card--destaque .card__nome { font-size: clamp(2.25rem, 5vw, 3rem); color: var(--laranja); }
.card--destaque .card__texto { color: var(--creme); font-size: 1.125rem; }
.card--destaque .btn { border-color: var(--creme); box-shadow: 5px 5px 0 var(--creme); }

.card__selo {
  position: absolute;
  top: -18px;
  right: 20px;
  padding: 6px 14px;
  background: var(--turquesa);
  color: var(--escuro);
  border: 2px solid var(--escuro);
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9375rem;
  rotate: 3deg;
}

@media (min-width: 900px) {
  .formatos__grid { grid-template-columns: 1fr 1.18fr 1fr; gap: 24px; }
  .card--destaque { padding-block: 56px 44px; }
}
</style>
