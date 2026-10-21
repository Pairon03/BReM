<template>
  <section class="section risco" aria-labelledby="risco-titulo">
    <div class="container">
      <h2 id="risco-titulo" class="sr-only">Garantias</h2>
      <ul class="risco__lista" role="list">
        <li>Data reservada com sinal e contrato.</li>
        <li>Pontualidade garantida.</li>
        <li><span class="placeholder">[Garantia extra, se houver.]</span></li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.risco__lista {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.risco__lista li {
  font-family: var(--font-titulo);
  font-size: clamp(1.625rem, 5vw, 3rem);
  line-height: 1.08;
}

.risco__lista li:nth-child(2) { padding-left: clamp(0px, 8vw, 120px); }
.risco__lista li:nth-child(3) { padding-left: clamp(0px, 16vw, 240px); }
</style>
