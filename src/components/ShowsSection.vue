<script setup>
import { INSTAGRAM, proximosShows } from '../config.js'

const shows = proximosShows()

const fmt = (d, opts) => d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', ...opts })
</script>

<template>
  <section id="shows" class="section section--escura shows" aria-labelledby="shows-titulo">
    <div class="container">
      <h2 id="shows-titulo">Próximos shows</h2>

      <p v-if="!shows.length" class="shows__vazio">
        A agenda pública está sendo fechada. Acompanhe as novas datas no
        <a :href="INSTAGRAM.url" target="_blank" rel="noopener">{{ INSTAGRAM.handle }}</a>.
      </p>
      <ol v-else class="shows__lista" role="list">
        <li v-for="(s, i) in shows" :key="i" class="show" :class="{ 'show--dvd': s.dvd }">
          <p class="show__data">
            <span class="show__dia">{{ fmt(s.data, { day: '2-digit' }) }}</span>
            <span class="show__mes">{{ fmt(s.data, { month: 'short' }).replace('.', '') }}</span>
          </p>

          <div class="show__info">
            <p v-if="i === 0" class="show__selo">Próximo</p>
            <h3 class="show__titulo">{{ s.titulo }}</h3>
            <p class="show__local">{{ s.local }}, {{ s.cidade }}</p>
          </div>

          <a
            v-if="s.link"
            class="btn show__acao"
            :href="s.link"
            target="_blank"
            rel="noopener"
            :aria-label="`${s.acao}: ${s.titulo}`"
          >
            {{ s.acao }}
          </a>
          <p v-else class="show__fechado">Evento fechado</p>
        </li>
      </ol>

      <p class="shows__rodape">
        Quer a dupla no seu evento? <a href="#agenda">Veja como garantir sua data.</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.shows__lista {
  display: grid;
  gap: 14px;
  margin: 40px 0 0;
  padding: 0;
  list-style: none;
}

.show {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px 20px;
  align-items: center;
  padding: 18px;
  border: 1.5px solid rgb(255 243 227 / 0.25);
  border-radius: var(--raio);
}

.show--dvd {
  border: 2px solid var(--turquesa);
  background: rgb(63 201 184 / 0.08);
}

.show__data {
  display: grid;
  justify-items: center;
  min-width: 72px;
  padding: 10px 8px;
  border-radius: 12px;
  background: var(--creme);
  color: var(--escuro);
  line-height: 1;
}
.show__dia { font-family: var(--font-titulo); font-size: 2rem; }
.show__mes { margin-top: 4px; font-weight: 700; text-transform: lowercase; }

.show__selo {
  display: inline-block;
  margin-bottom: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--turquesa);
  color: var(--escuro);
  font-size: 0.8125rem;
  font-weight: 700;
}

.show__titulo { font-size: clamp(1.125rem, 2.6vw, 1.5rem); }
.show__local { margin-top: 4px; color: rgb(255 243 227 / 0.8); }

.show__acao,
.show__fechado { grid-column: 1 / -1; justify-self: start; }
.show__fechado { color: rgb(255 243 227 / 0.7); font-weight: 700; }

.shows__vazio { margin-top: 32px; max-width: 52ch; font-size: 1.125rem; }
.shows__vazio a { color: var(--turquesa); font-weight: 700; }

.shows__rodape { margin-top: 32px; }
.shows__rodape a { color: var(--turquesa); font-weight: 700; text-underline-offset: 3px; }

@media (min-width: 760px) {
  .show { grid-template-columns: auto 1fr auto; padding: 20px 24px; }
  .show__acao,
  .show__fechado { grid-column: auto; justify-self: end; }
}
</style>
