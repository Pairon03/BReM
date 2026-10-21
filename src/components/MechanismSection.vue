<template>
  <section class="section section--escura mecanismo" aria-labelledby="mecanismo-titulo">
    <div class="container mecanismo__grid">
      <div>
        <h2 id="mecanismo-titulo">Voz Trocada</h2>
        <p class="mecanismo__texto texto-largo">
          Primeira e segunda voz mudam de lugar no meio da música, e a dupla brinca, provoca e
          puxa o público. O resultado é um show de bate-papo cantado, não um recital.
        </p>
      </div>

      <!-- Duas linhas de voz que se cruzam: a ideia do mecanismo em uma imagem -->
      <svg class="mecanismo__vozes" viewBox="0 0 520 260" aria-hidden="true" focusable="false">
        <path
          d="M10 70 C120 70 170 60 230 110 S330 200 400 196 S480 190 510 190"
          fill="none"
          stroke="var(--rosa)"
          stroke-width="10"
          stroke-linecap="round"
        />
        <path
          d="M10 190 C120 190 170 200 230 150 S330 60 400 64 S480 70 510 70"
          fill="none"
          stroke="var(--turquesa)"
          stroke-width="10"
          stroke-linecap="round"
        />
        <circle cx="262" cy="130" r="20" fill="var(--escuro)" stroke="var(--creme)" stroke-width="3" />
        <text x="10" y="48" class="rotulo" fill="var(--rosa)">1ª voz</text>
        <text x="10" y="236" class="rotulo" fill="var(--turquesa)">2ª voz</text>
        <text x="510" y="48" class="rotulo" fill="var(--turquesa)" text-anchor="end">1ª voz</text>
        <text x="510" y="236" class="rotulo" fill="var(--rosa)" text-anchor="end">2ª voz</text>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.mecanismo__grid {
  display: grid;
  gap: 48px;
  align-items: center;
}

.mecanismo h2 {
  font-size: clamp(2.75rem, 10vw, 6rem);
  color: var(--laranja);
}

.mecanismo__texto {
  margin-top: 24px;
  font-size: clamp(1.125rem, 2.4vw, 1.375rem);
}

.mecanismo__vozes { width: 100%; height: auto; }

.rotulo {
  font-family: var(--font-texto);
  font-weight: 700;
  font-size: 22px;
}

@media (min-width: 900px) {
  .mecanismo__grid { grid-template-columns: 1fr 1fr; gap: 64px; }
}
</style>
