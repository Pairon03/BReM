<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { DVD, DVD_GUIA, INSTAGRAM, antesDoDvd } from '../config.js'

const antes = antesDoDvd()

const abas = [
  { id: 'evento', rotulo: 'O DVD' },
  { id: 'guia', rotulo: 'Guia do DVD' },
  ...(antes ? [{ id: 'ingressos', rotulo: 'Ingressos' }] : []),
]
const atual = ref('evento')
const abaEls = ref([])

function escolher(id, focar = false) {
  atual.value = id
  if (focar) nextTick(() => abaEls.value[abas.findIndex((a) => a.id === id)]?.focus())
}

// Teclado do padrão de abas: setas, Home e End
function aoTeclar(e, i) {
  const n = abas.length
  const destino = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key]
  if (destino === undefined) return
  e.preventDefault()
  escolher(abas[destino].id, true)
}

// Data e hora saem de DVD.data, então mudar a data em config.js atualiza todos os textos
const fuso = { timeZone: 'America/Sao_Paulo' }
const dataCurta = DVD.data.toLocaleDateString('pt-BR', { ...fuso, day: '2-digit', month: '2-digit', year: 'numeric' })
const dataLonga = DVD.data.toLocaleDateString('pt-BR', { ...fuso, day: '2-digit', month: 'long', year: 'numeric' })
const hora = `${Number(DVD.data.toLocaleTimeString('pt-BR', { ...fuso, hour: '2-digit' }))}h`

const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${DVD.local}, ${DVD.endereco}`,
)}`

// Contagem regressiva até a gravação; só atualiza com a seção na tela
const agora = ref(Date.now())
const falta = computed(() => {
  const ms = Math.max(0, DVD.data.getTime() - agora.value)
  const s = Math.floor(ms / 1000)
  return [
    { valor: Math.floor(s / 86400), rotulo: 'dias' },
    { valor: Math.floor((s % 86400) / 3600), rotulo: 'horas' },
    { valor: Math.floor((s % 3600) / 60), rotulo: 'min' },
    { valor: s % 60, rotulo: 'seg' },
  ]
})

const secao = ref(null)
let timer = 0
let observer = null

onMounted(() => {
  if (!antes) return
  observer = new IntersectionObserver(([e]) => {
    window.clearInterval(timer)
    if (e.isIntersecting) {
      agora.value = Date.now()
      timer = window.setInterval(() => (agora.value = Date.now()), 1000)
    }
  })
  observer.observe(secao.value)
})

onBeforeUnmount(() => {
  window.clearInterval(timer)
  observer?.disconnect()
})
</script>

<template>
  <section id="dvd" ref="secao" class="section dvd" aria-labelledby="dvd-titulo">
    <div class="container">
      <h2 id="dvd-titulo" class="dvd__titulo">
        <span class="dvd__script">Tá Tudo</span>
        <span class="dvd__marca">BR&amp;M</span>
        <span class="sr-only">: o DVD de Breno Ramos &amp; Marcelo</span>
      </h2>
      <p class="dvd__linha">
        {{ antes ? 'Gravação ao vivo do DVD' : 'DVD gravado ao vivo' }} em {{ dataCurta }}, às {{ hora }},
        na {{ DVD.local }}.
      </p>

      <div class="dvd__painel">
        <div class="dvd__abas" role="tablist" aria-label="Informações do DVD">
          <button
            v-for="(a, i) in abas"
            :id="`aba-${a.id}`"
            :key="a.id"
            ref="abaEls"
            class="dvd__aba"
            type="button"
            role="tab"
            :aria-selected="atual === a.id"
            :aria-controls="`painel-${a.id}`"
            :tabindex="atual === a.id ? 0 : -1"
            @click="escolher(a.id)"
            @keydown="aoTeclar($event, i)"
          >
            {{ a.rotulo }}
          </button>
        </div>

        <div
          v-show="atual === 'evento'"
          id="painel-evento"
          class="dvd__conteudo dvd__conteudo--evento"
          role="tabpanel"
          aria-labelledby="aba-evento"
          tabindex="0"
        >
          <div v-if="antes" class="contagem" role="timer" aria-label="Tempo até a gravação do DVD">
            <div v-for="u in falta" :key="u.rotulo" class="contagem__bloco">
              <span class="contagem__valor">{{ String(u.valor).padStart(2, '0') }}</span>
              <span class="contagem__rotulo">{{ u.rotulo }}</span>
            </div>
          </div>
          <p v-else class="dvd__gravado">Gravado! Obrigado a quem cantou junto.</p>

          <dl class="dvd__dados">
            <div>
              <dt>Quando</dt>
              <dd>{{ dataLonga }}, às {{ hora }} (horário de Brasília)</dd>
            </div>
            <div>
              <dt>Onde</dt>
              <dd>
                {{ DVD.local }}, {{ DVD.endereco }}
                <a :href="mapa" target="_blank" rel="noopener">Ver no mapa</a>
              </dd>
            </div>
          </dl>

          <a v-if="antes" class="btn btn--grande" :href="DVD.ingressos" target="_blank" rel="noopener">
            Garantir meu ingresso
          </a>
        </div>

        <div
          v-show="atual === 'guia'"
          id="painel-guia"
          class="dvd__conteudo"
          role="tabpanel"
          aria-labelledby="aba-guia"
          tabindex="0"
        >
          <ul v-if="DVD_GUIA" class="guia" role="list">
            <li v-for="item in DVD_GUIA" :key="item.titulo">
              <strong>{{ item.titulo }}</strong>
              <span>{{ item.texto }}</span>
            </li>
          </ul>
          <div v-else class="guia__aviso">
            <p class="guia__aviso-titulo">O guia do DVD sai em breve.</p>
            <p>
              Horário dos portões, classificação, como chegar e o que levar: tudo vai estar aqui.
              Enquanto isso, as novidades saem primeiro no
              <a :href="INSTAGRAM.url" target="_blank" rel="noopener">{{ INSTAGRAM.handle }}</a>.
            </p>
          </div>
        </div>

        <div
          v-if="antes"
          v-show="atual === 'ingressos'"
          id="painel-ingressos"
          class="dvd__conteudo"
          role="tabpanel"
          aria-labelledby="aba-ingressos"
          tabindex="0"
        >
          <p class="dvd__ingresso-texto">
            Os ingressos são vendidos pela Byma. Garanta o seu e venha cantar junto na gravação.
          </p>
          <a class="btn btn--grande" :href="DVD.ingressos" target="_blank" rel="noopener">
            Comprar na Byma
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dvd {
  position: relative;
  overflow: hidden;
  background: var(--gradiente-sol);
  border-block: 2px solid var(--escuro);
}

.dvd__titulo {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 clamp(12px, 2.4vw, 32px);
  line-height: 0.95;
}

.dvd__script {
  font-family: var(--font-script);
  font-size: clamp(3rem, 12vw, 7.5rem);
  color: var(--creme);
  text-shadow: 4px 4px 0 var(--escuro);
}

.dvd__marca {
  font-size: clamp(3.25rem, 13vw, 8.5rem);
  letter-spacing: -0.03em;
}

.dvd__linha {
  margin-top: 16px;
  max-width: 44ch;
  font-size: clamp(1.125rem, 2.6vw, 1.375rem);
  font-weight: 500;
}

.dvd__painel {
  margin-top: 40px;
  background: var(--escuro);
  color: var(--creme);
  border: 2.5px solid var(--escuro);
  border-radius: calc(var(--raio) + 6px);
  box-shadow: 8px 8px 0 var(--creme);
  overflow: hidden;
}

.dvd__abas {
  display: flex;
  overflow-x: auto;
  border-bottom: 2px solid rgb(255 243 227 / 0.2);
  scrollbar-width: none;
}

.dvd__aba {
  flex: 1 0 auto;
  min-height: 56px;
  padding: 0 12px;
  border: 0;
  border-bottom: 3px solid transparent;
  background: none;
  color: rgb(255 243 227 / 0.75);
  font: 700 1rem var(--font-texto);
  cursor: pointer;
  transition: color 160ms ease, border-color 160ms ease;
}

.dvd__aba[aria-selected='true'] {
  color: var(--creme);
  border-bottom-color: var(--turquesa);
}

.dvd__aba:focus-visible { outline-offset: -4px; }

@media (hover: hover) and (pointer: fine) {
  .dvd__aba:hover { color: var(--creme); }
}

.dvd__conteudo {
  display: grid;
  gap: 28px;
  justify-items: start;
  padding: 28px 20px 32px;
  animation: painel-in 220ms var(--ease-out);
}

.dvd__conteudo:focus-visible { outline-offset: -6px; }

@keyframes painel-in {
  from { opacity: 0; transform: translateY(6px); }
}

.contagem {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 560px;
}

.contagem__bloco {
  display: grid;
  justify-items: center;
  padding: 14px 4px 10px;
  border: 1.5px solid rgb(63 201 184 / 0.5);
  border-radius: 12px;
  background: rgb(63 201 184 / 0.08);
}

.contagem__valor {
  font-family: var(--font-titulo);
  font-size: clamp(1.75rem, 7vw, 3.25rem);
  line-height: 1;
  color: var(--turquesa);
  font-variant-numeric: tabular-nums;
}

.contagem__rotulo { margin-top: 6px; font-size: 0.875rem; }

.dvd__gravado { font-family: var(--font-titulo); font-size: 1.75rem; color: var(--turquesa); }

.dvd__dados { display: grid; gap: 16px; margin: 0; }
.dvd__dados dt { font-weight: 700; color: var(--laranja); }
.dvd__dados dd { margin: 2px 0 0; max-width: 52ch; }
.dvd__dados a { display: inline-block; margin-left: 4px; color: var(--turquesa); font-weight: 700; }

.dvd .btn { border-color: var(--creme); box-shadow: 6px 6px 0 var(--creme); }

.guia {
  display: grid;
  gap: 12px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}
.guia li {
  display: grid;
  gap: 2px;
  padding: 14px 16px;
  border: 1.5px solid rgb(255 243 227 / 0.25);
  border-radius: 12px;
}
.guia strong { color: var(--laranja); }
.guia__aviso { display: grid; gap: 10px; max-width: 56ch; font-size: 1.0625rem; }
.guia__aviso-titulo { font-family: var(--font-titulo); font-size: 1.5rem; color: var(--laranja); }
.guia__aviso a { color: var(--turquesa); font-weight: 700; }

.dvd__ingresso-texto { max-width: 48ch; font-size: 1.125rem; }

@media (min-width: 760px) {
  .dvd__aba { flex: none; padding: 0 22px; }
  .dvd__conteudo { padding: 40px; }
  .guia { grid-template-columns: repeat(2, 1fr); }
}

/* No desktop a contagem e os dados ficam lado a lado, sem sobrar painel vazio */
@media (min-width: 1000px) {
  .dvd__conteudo--evento {
    grid-template-columns: minmax(0, 560px) minmax(0, 1fr);
    gap: 32px 56px;
    align-items: center;
  }
  .dvd__conteudo--evento .dvd__dados { grid-row: span 2; }
}

@media (prefers-reduced-motion: reduce) {
  .dvd__conteudo { animation: none; }
  .dvd__aba { transition: none; }
}
</style>
