<template>
  <section class="section esforco" aria-labelledby="esforco-titulo">
    <div class="container">
      <h2 id="esforco-titulo">Esforço quase zero</h2>
      <ul class="esforco__lista" role="list">
        <li>
          <strong>Briefing de 10 minutos:</strong>
          você nos conta o clima, a gente monta o set.
        </li>
        <li>
          <strong>Lista do “toca” e do “não toca”:</strong>
          você escolhe e nós seguimos.
        </li>
        <li>
          <strong>Cuidamos do resto:</strong>
          <span class="placeholder">[passagem de som, horário, estrutura]</span>.
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.esforco { padding-top: 0; }

.esforco__lista {
  display: grid;
  gap: 0;
  margin: 40px 0 0;
  padding: 0;
  list-style: none;
  border-top: 2px solid var(--escuro);
}

.esforco__lista li {
  padding: 24px 0 24px 44px;
  border-bottom: 2px solid var(--escuro);
  font-size: clamp(1.125rem, 2.4vw, 1.375rem);
  position: relative;
}

/* Marcador: um "check" turquesa desenhado em CSS */
.esforco__lista li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 30px;
  width: 26px;
  height: 26px;
  border: 2px solid var(--escuro);
  border-radius: 50%;
  background: var(--turquesa)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2314121C' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 12.5l4 4 8-9'/%3E%3C/svg%3E")
    center / 16px no-repeat;
}

.esforco__lista strong { display: block; font-family: var(--font-titulo); font-weight: 400; }

@media (min-width: 900px) {
  .esforco__lista { grid-template-columns: repeat(3, 1fr); gap: 32px; border-top: 0; }
  .esforco__lista li { border-top: 2px solid var(--escuro); border-bottom: 0; }
}
</style>
