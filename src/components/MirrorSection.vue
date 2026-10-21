<template>
  <section class="section espelho" aria-label="Seu evento merece mais">
    <div class="container">
      <p class="espelho__pergunta">
        Você já viu aquele show em que a pista esvazia, o pessoal olha o celular e o cantor só
        “cumpre a lista”?
      </p>
      <p class="espelho__golpe">
        Seu evento não merece ser só o fundo musical de uma noite que custou caro.
      </p>
    </div>
  </section>
</template>

<style scoped>
.espelho {
  background: var(--creme-2);
  border-block: 2px solid var(--escuro);
}

.espelho__pergunta {
  max-width: 34ch;
  font-size: clamp(1.375rem, 3.6vw, 2.125rem);
  line-height: 1.3;
  color: var(--texto-suave);
}

.espelho__golpe {
  margin-top: 28px;
  max-width: 22ch;
  margin-left: auto;
  font-family: var(--font-titulo);
  font-size: clamp(1.75rem, 5.4vw, 3.25rem);
  line-height: 1.04;
  text-align: right;
  text-wrap: balance;
}
</style>
