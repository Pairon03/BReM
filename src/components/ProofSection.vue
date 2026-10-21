<script setup>
import { CONTEUDO, INSTAGRAM } from '../config.js'
import IconInstagram from './IconInstagram.vue'
import ProofVideo from './ProofVideo.vue'

const videos = [
  { src: '/videos/casamento.mp4', poster: '/img/poster-casamento.jpg', legenda: 'Casamento' },
  { src: '/videos/formatura.mp4', poster: '/img/poster-formatura.jpg', legenda: 'Formatura' },
  { src: '/videos/casa-de-show.mp4', poster: '/img/poster-casa-de-show.jpg', legenda: 'Casa de show' },
]

const depoimentos = CONTEUDO.depoimentos
const reelsUrl = `${INSTAGRAM.url}/reels/`
</script>

<template>
  <section class="section section--escura prova" aria-labelledby="prova-titulo">
    <div class="container">
      <div class="prova__dvd">
        <p class="prova__selo" aria-hidden="true"><span>Tá Tudo</span> BR&amp;M</p>
        <h2 id="prova-titulo">Gravamos um DVD.</h2>
        <p class="prova__texto texto-largo">
          Quem contrata uma dupla que grava DVD sabe que o show é de verdade.
        </p>
      </div>

      <div v-if="CONTEUDO.videosProntos" class="prova__videos">
        <ProofVideo v-for="v in videos" :key="v.src" v-bind="v" />
      </div>
      <div v-else class="prova__reels">
        <p>Veja a dupla ao vivo: trechos de shows, resenhas e bastidores nos Reels.</p>
        <a class="btn btn--grande" :href="reelsUrl" target="_blank" rel="noopener">
          <IconInstagram />
          Assistir no Instagram
        </a>
      </div>

      <template v-if="depoimentos.length">
        <h3 class="sr-only">Depoimentos</h3>
        <ul class="prova__depoimentos" role="list">
          <li v-for="d in depoimentos" :key="d.nome">
            <blockquote>
              <p>“{{ d.frase }}”</p>
            </blockquote>
            <p class="autor">{{ d.nome }}, {{ d.evento }}</p>
          </li>
        </ul>
      </template>
    </div>
  </section>
</template>

<style scoped>
.prova__dvd { position: relative; }

.prova__selo {
  display: inline-block;
  margin-bottom: 16px;
  padding: 4px 16px 8px;
  background: var(--turquesa);
  color: var(--escuro);
  border-radius: 999px;
  font-family: var(--font-titulo);
  font-size: 1.125rem;
  rotate: -3deg;
}
.prova__selo span { font-family: var(--font-script); font-size: 1.25rem; }

.prova h2 {
  font-size: clamp(2.75rem, 10vw, 6rem);
  color: var(--laranja);
}

.prova__texto {
  margin-top: 20px;
  font-size: clamp(1.125rem, 2.4vw, 1.375rem);
}

.prova__videos {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(220px, 72%);
  gap: 20px;
  margin-top: 56px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 12px;
  overscroll-behavior-x: contain;
}
.prova__videos > * { scroll-snap-align: start; }

.prova__depoimentos {
  display: grid;
  gap: 20px;
  margin: 56px 0 0;
  padding: 0;
  list-style: none;
}

.prova__depoimentos li {
  padding: 24px;
  border: 2px solid var(--creme);
  border-radius: var(--raio);
}

blockquote {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.4;
}

.autor { margin-top: 14px; color: var(--turquesa); font-weight: 700; }

.prova__reels {
  display: grid;
  gap: 24px;
  justify-items: start;
  margin-top: 48px;
  padding: 28px;
  border: 2px solid var(--creme);
  border-radius: var(--raio);
}
.prova__reels p { font-size: 1.25rem; line-height: 1.4; max-width: 40ch; }

@media (min-width: 820px) {
  .prova__videos {
    grid-auto-flow: row;
    grid-template-columns: repeat(3, 1fr);
    overflow: visible;
  }
  .prova__depoimentos { grid-template-columns: repeat(3, 1fr); }
}
</style>
