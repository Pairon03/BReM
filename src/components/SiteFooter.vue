<script setup>
import { CREDITO, DVD, INSTAGRAM, WHATSAPP } from '../config.js'
import IconInstagram from './IconInstagram.vue'
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div>
        <p class="footer__nome">Breno Ramos &amp; Marcelo</p>
        <p>Dupla sertaneja de Campinas/SP</p>
      </div>
      <ul class="footer__links" role="list">
        <li>
          <a :href="INSTAGRAM.url" target="_blank" rel="noopener">
            <IconInstagram />
            {{ INSTAGRAM.handle }}
          </a>
        </li>
        <li>
          <a :href="WHATSAPP.url" target="_blank" rel="noopener">WhatsApp {{ WHATSAPP.display }}</a>
        </li>
        <li>
          <a :href="DVD.ingressos" target="_blank" rel="noopener">DVD {{ DVD.nome }}</a>
        </li>
      </ul>
      <p class="footer__credito">
        Desenvolvido por
        <a :href="CREDITO.url" target="_blank" rel="noopener">{{ CREDITO.nome }}</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--escuro);
  color: var(--creme);
  border-top: 2px solid var(--creme);
  padding-block: 48px 112px;
  font-size: 0.9375rem;
}

.footer__inner {
  display: grid;
  gap: 28px;
}

.footer__nome { font-family: var(--font-titulo); font-size: 1.25rem; }

.footer__links {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer__links a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  font-weight: 700;
  text-underline-offset: 3px;
}
.footer__links svg { width: 20px; height: 20px; }

.footer__credito a { color: var(--turquesa); font-weight: 700; }

@media (min-width: 860px) {
  .footer__inner { grid-template-columns: 1fr auto auto; align-items: center; gap: 48px; }
  .footer { padding-bottom: 48px; }
}
</style>
