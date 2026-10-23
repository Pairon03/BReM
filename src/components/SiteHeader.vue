<script setup>
import { INSTAGRAM, WHATSAPP } from '../config.js'
import IconInstagram from './IconInstagram.vue'
import IconWhatsapp from './IconWhatsapp.vue'
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <a href="#topo" class="logo" aria-label="BR&M, Breno Ramos e Marcelo: voltar ao início">
        BR<span class="logo__amp">&amp;</span>M
      </a>

      <nav class="header__acoes" aria-label="Principal">
        <a class="header__link" href="#dvd">DVD</a>
        <a class="header__link" href="#shows">Shows</a>
        <a
          class="insta"
          :href="INSTAGRAM.url"
          target="_blank"
          rel="noopener"
          :aria-label="`Instagram ${INSTAGRAM.handle}`"
        >
          <IconInstagram />
          <span class="insta__handle">{{ INSTAGRAM.handle }}</span>
        </a>
        <a class="btn btn--whats" :href="WHATSAPP.url" target="_blank" rel="noopener">
          <IconWhatsapp />
          <span>WhatsApp</span>
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgb(20 18 28 / 0.92);
  color: var(--creme);
  border-bottom: 1px solid rgb(255 243 227 / 0.14);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 68px;
}

.logo {
  font-family: var(--font-titulo);
  font-size: 1.5rem;
  text-decoration: none;
  letter-spacing: -0.02em;
}
.logo__amp { color: var(--rosa); }

.header__acoes {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header__link {
  display: none;
  align-items: center;
  min-height: 44px;
  padding-inline: 8px;
  font-weight: 700;
  font-size: 0.9375rem;
  text-decoration: none;
}

@media (hover: hover) and (pointer: fine) {
  .header__link:hover { text-decoration: underline; text-underline-offset: 3px; }
}

@media (min-width: 900px) {
  .header__link { display: inline-flex; }
}

.insta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 44px;
  min-height: 44px;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9375rem;
  text-decoration: none;
  border-radius: 999px;
}
.insta svg { width: 24px; height: 24px; }
.insta__handle { display: none; }

@media (hover: hover) and (pointer: fine) {
  .insta:hover .insta__handle { text-decoration: underline; text-underline-offset: 3px; }
}

.btn--whats {
  min-height: 44px;
  padding: 8px 16px;
  font-size: 0.9375rem;
  border-color: var(--creme);
  box-shadow: 4px 4px 0 var(--creme);
}
.btn--whats svg { width: 20px; height: 20px; }

@media (min-width: 760px) {
  .insta__handle { display: inline; }
  .insta { padding-inline: 8px; }
}
</style>
