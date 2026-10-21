<script setup>
import { CONTEUDO, WHATSAPP } from '../config.js'
import GuitarSvg from './GuitarSvg.vue'
import IconWhatsapp from './IconWhatsapp.vue'
</script>

<template>
  <section id="topo" class="hero" aria-labelledby="hero-titulo">
    <div class="container hero__grid">
      <div class="hero__texto">
        <h1 id="hero-titulo" class="hero__titulo">
          O show que seus convidados vão contar até a segunda-feira.
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
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding-block: 40px 72px;
  overflow: hidden;
}

.hero__grid {
  display: grid;
  gap: 48px;
  align-items: center;
}

.hero__titulo {
  font-size: clamp(2.375rem, 9vw, 4.75rem);
  line-height: 0.98;
  letter-spacing: -0.025em;
}

.hero__sub {
  margin-top: 24px;
  max-width: 50ch;
  font-size: clamp(1.0625rem, 2.4vw, 1.25rem);
  color: var(--texto-suave);
}

.hero__cta { margin-top: 32px; }

.hero__micro {
  margin-top: 18px;
  font-size: 0.9375rem;
  color: var(--texto-suave);
}

/* Composição: sol poente atrás, violão espiando por trás da foto em arco */
.hero__visual {
  position: relative;
  width: 100%;
  max-width: 440px;
  margin-inline: auto;
  aspect-ratio: 11 / 12;
}

.hero__sol {
  position: absolute;
  left: 50%;
  top: 4%;
  width: 96%;
  aspect-ratio: 1;
  translate: -50% 0;
  border-radius: 50%;
  background: var(--gradiente-sol);
  opacity: 0.9;
}

.hero__foto {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
  width: 72%;
  aspect-ratio: 4 / 5;
  margin: 0;
  border: 3px solid var(--escuro);
  border-radius: 999px 999px 18px 18px;
  box-shadow: var(--sombra-dura);
}

.hero__violao {
  position: absolute;
  right: -2%;
  top: 0;
  z-index: 0;
  width: 40%;
  rotate: 14deg;
}

@media (min-width: 960px) {
  .hero { padding-block: 72px 112px; }
  .hero__grid { grid-template-columns: 1.15fr 0.85fr; gap: 56px; }
  .hero__visual { max-width: none; }
}
</style>
