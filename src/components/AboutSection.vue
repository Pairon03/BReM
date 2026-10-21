<template>
  <section class="section sobre" aria-labelledby="sobre-titulo">
    <div class="container sobre__grid">
      <figure class="sobre__foto duotone">
        <img
          src="/img/dupla.jpg"
          alt="Retrato de Breno Ramos e Marcelo lado a lado"
          width="800"
          height="800"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div>
        <h2 id="sobre-titulo">Quem somos</h2>
        <p class="sobre__texto texto-largo">
          <span class="placeholder">[2 a 3 frases sobre a história da dupla]</span>
        </p>
        <p class="sobre__local">Campinas/SP</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sobre__grid {
  display: grid;
  gap: 40px;
  align-items: center;
}

.sobre__foto {
  margin: 0;
  aspect-ratio: 1;
  max-width: 460px;
  border: 3px solid var(--escuro);
  border-radius: var(--raio);
  box-shadow: var(--sombra-dura);
  rotate: -2deg;
}

.sobre__texto {
  margin-top: 20px;
  font-size: 1.1875rem;
}

.sobre__local {
  display: inline-block;
  margin-top: 24px;
  padding: 6px 14px;
  border: 2px solid var(--escuro);
  border-radius: 999px;
  background: var(--turquesa);
  font-weight: 700;
}

@media (min-width: 860px) {
  .sobre__grid { grid-template-columns: 0.9fr 1.1fr; gap: 72px; }
}
</style>
