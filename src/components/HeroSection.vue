<script setup>
import { CONTEUDO, WHATSAPP } from '../config.js'
import GuitarSvg from './GuitarSvg.vue'
import IconWhatsapp from './IconWhatsapp.vue'

const faixa = ['Tá Tudo BR&M', 'Voz trocada', 'Casamentos', 'Formaturas', 'Resenha', 'Pista cheia']
</script>

<template>
  <section id="topo" class="hero" aria-labelledby="hero-titulo">
    <div class="hero__luz" aria-hidden="true"></div>

    <div class="container hero__grid">
      <div class="hero__texto">
        <p class="hero__eyebrow">Dupla sertaneja · Campinas/SP</p>
        <h1 id="hero-titulo" class="hero__titulo">
          O show que seus convidados vão contar até a
          <span class="hero__script">segunda-feira.</span>
        </h1>
        <p class="hero__sub">
          Breno Ramos &amp; Marcelo: voz que troca, violão que arrepia e uma plateia que não
          consegue ficar sentada. Casamentos, formaturas e eventos em Campinas e região.
        </p>
        <div class="hero__cta">
          <a class="btn btn--grande" :href="WHATSAPP.url" target="_blank" rel="noopener">
            <IconWhatsapp />
            Quero esse clima no meu evento
          </a>
          <p class="hero__micro">
            Proposta com valores em até {{ CONTEUDO.prazoProposta }}, sem compromisso.
          </p>
        </div>
      </div>

      <div class="hero__visual">
        <div class="hero__sol" aria-hidden="true"></div>
        <GuitarSvg class="hero__violao" />
        <p class="hero__dica" aria-hidden="true">
          passe nas cordas <span class="hero__dica-seta">↙</span>
        </p>
        <figure class="hero__foto duotone">
          <img
            src="/img/hero.jpg"
            alt="Breno Ramos e Marcelo abraçados, sorrindo e mostrando a língua"
            width="800"
            height="1000"
            fetchpriority="high"
            decoding="async"
          />
        </figure>
      </div>
    </div>

    <div class="hero__faixa" aria-hidden="true">
      <div class="hero__faixa-trilho">
        <template v-for="volta in 2" :key="volta">
          <span v-for="item in faixa" :key="`${volta}-${item}`" class="hero__faixa-item">
            {{ item }}<span class="hero__faixa-ponto">✦</span>
          </span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Palco à noite: fundo escuro, refletor quente atrás do violão, violão como protagonista */
.hero {
  position: relative;
  padding-block: 40px 0;
  overflow: hidden;
  background: var(--escuro);
  color: var(--creme);
  isolation: isolate;
}

/* Feixes de refletor vindos do alto + brilho quente atrás do violão */
.hero__luz {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(ellipse 46% 54% at 74% 46%, rgb(245 138 58 / 0.34), transparent 70%),
    radial-gradient(ellipse 30% 40% at 14% 92%, rgb(232 69 107 / 0.22), transparent 70%),
    conic-gradient(from 168deg at 76% -8%, transparent 0deg, rgb(255 243 227 / 0.09) 7deg, transparent 15deg,
      transparent 22deg, rgb(255 243 227 / 0.06) 27deg, transparent 34deg);
}

.hero__grid {
  display: grid;
  gap: 40px;
  align-items: center;
}

.hero__eyebrow {
  margin-bottom: 20px;
  color: var(--turquesa);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero__titulo {
  font-size: clamp(2.375rem, 8.4vw, 4.75rem);
  line-height: 0.98;
  letter-spacing: -0.025em;
  color: var(--creme);
}

.hero__script {
  display: inline-block;
  margin-top: 0.08em;
  font-family: var(--font-script);
  font-weight: 400;
  letter-spacing: 0;
  color: var(--laranja);
  rotate: -3deg;
  text-shadow: 3px 3px 0 var(--rosa);
}

.hero__sub {
  margin-top: 36px;
  max-width: 48ch;
  font-size: clamp(1.0625rem, 2.2vw, 1.25rem);
  color: rgb(255 243 227 / 0.78);
}

.hero__cta { margin-top: 36px; }
.hero .btn { border-color: var(--creme); box-shadow: 6px 6px 0 var(--creme); }

@media (hover: hover) and (pointer: fine) {
  .hero .btn:hover { box-shadow: 8px 8px 0 var(--creme); }
}
.hero .btn:active { box-shadow: 2px 2px 0 var(--creme); }

.hero__micro {
  margin-top: 18px;
  font-size: 0.9375rem;
  color: rgb(255 243 227 / 0.62);
}

/* Composição: sol poente, violão grande inclinado, foto da dupla como selo no canto */
.hero__visual {
  position: relative;
  width: 100%;
  max-width: 460px;
  margin-inline: auto;
  aspect-ratio: 1 / 1.04;
}

.hero__sol {
  position: absolute;
  left: 56%;
  top: 10%;
  width: 70%;
  aspect-ratio: 1;
  translate: -50% 0;
  border-radius: 50%;
  background: var(--gradiente-sol);
  box-shadow: 0 0 120px 20px rgb(245 138 58 / 0.35);
}

.hero__violao {
  position: absolute;
  left: 25%;
  top: -20%;
  z-index: 1;
  width: 58%;
  rotate: -34deg;
  filter: drop-shadow(0 28px 36px rgb(0 0 0 / 0.5));
}

.hero__foto {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
  width: 34%;
  aspect-ratio: 4 / 5;
  margin: 0;
  border: 3px solid var(--creme);
  border-radius: 999px 999px 16px 16px;
  box-shadow: 6px 6px 0 var(--rosa);
  rotate: -4deg;
}

.hero__dica {
  position: absolute;
  right: 2%;
  top: 2%;
  z-index: 2;
  font-family: var(--font-script);
  font-size: clamp(0.9375rem, 2.2vw, 1.125rem);
  color: var(--turquesa);
  rotate: 8deg;
  white-space: nowrap;
}
.hero__dica-seta { font-family: var(--font-texto); }

/* Faixa corrida de transição para a próxima seção */
.hero__faixa {
  margin-top: 64px;
  overflow: hidden;
  background: var(--rosa);
  color: var(--escuro);
  border-block: 2px solid var(--escuro);
}

.hero__faixa-trilho {
  display: flex;
  width: max-content;
  animation: faixa-corre 32s linear infinite;
}

.hero__faixa-item {
  display: inline-flex;
  align-items: center;
  gap: 28px;
  padding: 14px 0 14px 28px;
  font-family: var(--font-titulo);
  font-size: clamp(1.125rem, 2.4vw, 1.5rem);
  letter-spacing: -0.01em;
  white-space: nowrap;
}
.hero__faixa-ponto { color: var(--creme); font-size: 0.8em; }

@keyframes faixa-corre {
  to { transform: translateX(-50%); }
}

@media (min-width: 960px) {
  .hero { padding-block: 72px 0; }
  .hero__grid { grid-template-columns: 1.05fr 0.95fr; gap: 48px; }
  .hero__visual { max-width: 580px; }
  .hero__faixa { margin-top: 88px; }
}

/* Entrada do texto em cascata, uma vez ao abrir a página */
.hero__texto > * {
  animation: hero-in 900ms var(--ease-out) both;
}
.hero__eyebrow { animation-delay: 60ms; }
.hero__titulo { animation-delay: 140ms; }
.hero__sub { animation-delay: 260ms; }
.hero__cta { animation-delay: 360ms; }

.hero__sol { animation: sol-in 1400ms var(--ease-out) both; }
.hero__foto { animation: hero-in 900ms var(--ease-out) 420ms both; }

@keyframes hero-in {
  from { opacity: 0; translate: 0 24px; filter: blur(8px); }
}

@keyframes sol-in {
  from { opacity: 0; scale: 0.82; }
}

@media (prefers-reduced-motion: reduce) {
  .hero__faixa-trilho { animation: none; }
  .hero__texto > *,
  .hero__sol,
  .hero__foto { animation: none; }
}
</style>
