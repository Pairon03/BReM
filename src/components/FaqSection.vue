<script setup>
const perguntas = [
  {
    p: 'É caro?',
    r: 'O valor muda com o formato, o local e a duração. Montamos uma proposta no seu orçamento.',
  },
  { p: 'E se meu evento for pequeno?', r: 'O formato Resenha foi feito para isso.' },
  { p: 'Com quanto tempo contratar?', r: null },
]
</script>

<template>
  <section class="section faq" aria-labelledby="faq-titulo">
    <div class="container">
      <h2 id="faq-titulo">Perguntas frequentes</h2>
      <div class="faq__lista">
        <details v-for="item in perguntas" :key="item.p">
          <summary>
            <span>{{ item.p }}</span>
            <span class="faq__icone" aria-hidden="true"></span>
          </summary>
          <p v-if="item.r">{{ item.r }}</p>
          <p v-else>
            <span class="placeholder">[prazo ideal]</span> para garantir sua data.
          </p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq__lista {
  margin-top: 40px;
  max-width: 820px;
  border-top: 2px solid var(--escuro);
}

details { border-bottom: 2px solid var(--escuro); }

summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 64px;
  padding-block: 18px;
  font-family: var(--font-titulo);
  font-size: clamp(1.25rem, 3vw, 1.625rem);
  line-height: 1.15;
  cursor: pointer;
  list-style: none;
}
summary::-webkit-details-marker { display: none; }

.faq__icone {
  position: relative;
  flex: none;
  width: 36px;
  height: 36px;
  border: 2px solid var(--escuro);
  border-radius: 50%;
  background: var(--turquesa);
}
.faq__icone::before,
.faq__icone::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 14px;
  height: 2.5px;
  margin: -1.25px 0 0 -7px;
  background: var(--escuro);
  transition: transform 200ms var(--ease-out);
}
.faq__icone::after { transform: rotate(90deg); }
details[open] .faq__icone::after { transform: rotate(0deg); }

details p {
  padding-bottom: 24px;
  max-width: 60ch;
  font-size: 1.125rem;
}

@media (prefers-reduced-motion: reduce) {
  .faq__icone::after { transition: none; }
}
</style>
