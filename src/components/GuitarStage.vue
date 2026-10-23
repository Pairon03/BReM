<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { DVD, antesDoDvd } from '../config.js'
import GuitarSvg from './GuitarSvg.vue'

// Cada nota que sai do violão carrega uma informação. Poucas, uma de cada vez.
const notas = [
  {
    titulo: 'Voz Trocada',
    texto:
      'Primeira e segunda voz mudam de lugar no meio da música, e a dupla brinca, provoca e puxa o público.',
  },
  {
    titulo: 'Bate-papo cantado',
    texto: 'O resultado é um show de bate-papo cantado, não um recital.',
  },
  antesDoDvd()
    ? {
        titulo: `DVD ${DVD.nome}`,
        texto: `Em 2 de novembro, às 14h, na ${DVD.local}. Você pode estar na plateia.`,
        link: '#dvd',
        linkTexto: 'Ver o DVD',
      }
    : {
        titulo: `DVD ${DVD.nome}`,
        texto: `Gravado na ${DVD.local}. Agora a agenda de 2027 está aberta.`,
        link: '#dvd',
        linkTexto: 'Ver o DVD',
      },
  {
    titulo: 'Próximos shows',
    texto: 'Veja onde a dupla toca e garanta a sua data antes que a agenda feche.',
    link: '#shows',
    linkTexto: 'Ver agenda',
  },
]

// Janela de cada nota no progresso da rolagem (0 → 1)
const INICIO = 0.14
const PASSO = (0.96 - INICIO) / notas.length

const secao = ref(null)
const palco = ref(null)
const violaoBox = ref(null)
const violaoMove = ref(null)
const violao = ref(null)
const cartaoEls = ref([])
const marcaEls = ref([])
const dica = ref(null)
const ondas = ref(null)
const particulas = ref(null)

let ativo = false
let raf = 0
let ultimoY = 0
let acumulado = 0
let origem = []
let observer = null
let reduz = false

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

// Ponto de partida de cada cartão: a boca do violão (medido sem transformações)
function medir() {
  const box = violaoBox.value
  const bocaX = box.offsetLeft + box.offsetWidth * 0.5
  const bocaY = box.offsetTop + box.offsetHeight * 0.62
  origem = cartaoEls.value.map((el) => ({
    dx: bocaX - (el.offsetLeft + el.offsetWidth / 2),
    dy: bocaY - (el.offsetTop + el.offsetHeight / 2),
  }))
}

function batida(forca) {
  violao.value?.tocar(forca, 38)

  // Onda sonora saindo da boca do violão
  const onda = document.createElement('span')
  onda.className = 'onda'
  ondas.value.append(onda)
  onda
    .animate(
      [
        { transform: 'scale(0.4)', opacity: 0.55 },
        { transform: 'scale(2.6)', opacity: 0 },
      ],
      { duration: 1100, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
    )
    .finished.then(() => onda.remove())

  // Notinha decorativa (no máximo 5 ao mesmo tempo)
  if (particulas.value.childElementCount < 5) {
    const n = document.createElement('span')
    n.className = 'particula'
    n.textContent = Math.random() > 0.5 ? '♪' : '♫'
    const lado = Math.random() > 0.5 ? 1 : -1
    const x = lado * (40 + Math.random() * 90)
    particulas.value.append(n)
    n.animate(
      [
        { transform: 'translate(0, 0) scale(0.6)', opacity: 0 },
        { opacity: 0.5, offset: 0.2 },
        { transform: `translate(${x}px, -${160 + Math.random() * 80}px) scale(1)`, opacity: 0 },
      ],
      { duration: 1600, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
    ).finished.then(() => n.remove())
  }
}

function atualizar() {
  raf = 0
  const r = secao.value.getBoundingClientRect()
  const total = r.height - window.innerHeight
  const p = clamp(-r.top / total)

  // Violão cresce até ficar amplo e se inclina como se estivesse sendo tocado
  const g = easeOut(clamp(p / INICIO))
  violaoMove.value.style.transform = `scale(${0.55 + 0.45 * g}) rotate(${14 - 20 * g}deg)`
  dica.value.style.opacity = String(1 - clamp(p / 0.06))

  notas.forEach((_, i) => {
    const el = cartaoEls.value[i]
    const t = (p - (INICIO + i * PASSO)) / PASSO
    const o = origem[i] || { dx: 0, dy: 0 }
    let op = 0
    let tr = `translate(${o.dx}px, ${o.dy}px) scale(0.4)`
    if (t >= 0 && (t < 1 || i === notas.length - 1)) {
      if (t < 0.3) {
        // Sai da boca do violão até o lugar
        const k = easeOut(t / 0.3)
        op = k
        tr = `translate(${o.dx * (1 - k)}px, ${o.dy * (1 - k)}px) scale(${0.4 + 0.6 * k})`
      } else if (t < 0.8 || i === notas.length - 1) {
        // A última nota fica na tela até o palco acabar
        op = 1
        tr = 'none'
      } else {
        // Sobe e some, como nota que se dissipa
        const k = (t - 0.8) / 0.2
        op = 1 - k
        tr = `translateY(${-48 * k}px)`
      }
    }
    el.style.opacity = String(op)
    el.style.transform = tr
    el.style.visibility = op > 0.01 ? 'visible' : 'hidden'
    marcaEls.value[i].classList.toggle('is-on', p >= INICIO + i * PASSO)
  })
}

function aoRolar() {
  if (!ativo) return
  const y = window.scrollY
  const delta = Math.abs(y - ultimoY)
  ultimoY = y
  acumulado += delta
  // Rolar é tocar: a cada ~140px uma batida, mais forte quanto mais rápido
  if (acumulado > 140) {
    acumulado = 0
    batida(clamp(delta / 40, 0.6, 1.8))
  }
  if (!raf) raf = requestAnimationFrame(atualizar)
}

function aoRedimensionar() {
  if (reduz) return
  medir()
  atualizar()
}

onMounted(() => {
  reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduz) return
  ultimoY = window.scrollY
  medir()
  atualizar()
  observer = new IntersectionObserver(([e]) => {
    ativo = e.isIntersecting
    if (ativo) {
      ultimoY = window.scrollY
      atualizar()
    }
  })
  observer.observe(secao.value)
  window.addEventListener('scroll', aoRolar, { passive: true })
  window.addEventListener('resize', aoRedimensionar)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(raf)
  window.removeEventListener('scroll', aoRolar)
  window.removeEventListener('resize', aoRedimensionar)
})
</script>

<template>
  <section ref="secao" class="stage" aria-labelledby="stage-titulo">
    <div ref="palco" class="stage__sticky">
      <h2 id="stage-titulo" class="sr-only">O show em notas</h2>

      <div ref="violaoBox" class="stage__violao">
        <div ref="ondas" class="stage__ondas" aria-hidden="true"></div>
        <div ref="violaoMove" class="stage__violao-move">
          <GuitarSvg ref="violao" :intro="false" :notas="false" />
        </div>
        <div ref="particulas" class="stage__particulas" aria-hidden="true"></div>
      </div>

      <p ref="dica" class="stage__dica" aria-hidden="true">
        <span class="stage__palheta"></span>
        Role para tocar
      </p>

      <!-- Versão para leitores de tela: os cartões visuais aparecem e somem com a rolagem -->
      <ul class="sr-only">
        <li v-for="n in notas" :key="n.titulo">
          {{ n.titulo }}: {{ n.texto }}
          <a v-if="n.link" :href="n.link">{{ n.linkTexto }}</a>
        </li>
      </ul>

      <ol class="stage__cartoes" role="list" aria-hidden="true">
        <li
          v-for="(n, i) in notas"
          :key="n.titulo"
          ref="cartaoEls"
          class="cartao"
          :class="i % 2 ? 'cartao--dir' : 'cartao--esq'"
        >
          <span class="cartao__nota" aria-hidden="true">♪</span>
          <h3 class="cartao__titulo">{{ n.titulo }}</h3>
          <p class="cartao__texto">{{ n.texto }}</p>
          <a v-if="n.link" class="cartao__link" :href="n.link" tabindex="-1">{{ n.linkTexto }}</a>
        </li>
      </ol>

      <ol class="stage__braco" aria-hidden="true">
        <li v-for="(n, i) in notas" :key="n.titulo" ref="marcaEls"></li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.stage {
  position: relative;
  height: 460vh;
  background: var(--escuro);
  color: var(--creme);
}

.stage__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  /* Grade de palco e brilho de refletor: estático, sem custo de animação */
  background:
    radial-gradient(60% 55% at 50% 58%, rgb(232 69 107 / 0.28), transparent 70%),
    radial-gradient(40% 40% at 50% 62%, rgb(245 138 58 / 0.22), transparent 70%),
    repeating-linear-gradient(0deg, rgb(255 243 227 / 0.05) 0 1px, transparent 1px 56px),
    repeating-linear-gradient(90deg, rgb(255 243 227 / 0.05) 0 1px, transparent 1px 56px),
    var(--escuro);
}

.stage__violao {
  position: absolute;
  left: 50%;
  top: 76px;
  width: min(44vw, 34svh);
  aspect-ratio: 240 / 560;
  translate: -50% 0;
}

.stage__violao-move {
  transform-origin: 50% 62%;
  transform: scale(0.55) rotate(14deg);
}

.stage__ondas,
.stage__particulas {
  position: absolute;
  left: 50%;
  top: 62%;
  width: 0;
  height: 0;
  pointer-events: none;
}

.stage__ondas :deep(.onda) {
  position: absolute;
  left: -90px;
  top: -90px;
  width: 180px;
  height: 180px;
  border: 2px solid var(--turquesa);
  border-radius: 50%;
  opacity: 0;
}

.stage__particulas :deep(.particula) {
  position: absolute;
  left: -10px;
  top: -14px;
  font-size: 26px;
  line-height: 1;
  color: var(--turquesa);
  opacity: 0;
}

.stage__dica {
  position: absolute;
  left: 50%;
  bottom: 28px;
  translate: -50% 0;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-weight: 700;
  white-space: nowrap;
}

.stage__palheta {
  width: 18px;
  height: 22px;
  background: var(--rosa);
  border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
  animation: palheta 1.6s var(--ease-in-out) infinite;
}

@keyframes palheta {
  0%, 100% { transform: translateY(-3px); }
  50% { transform: translateY(5px); }
}

/* Cartões-nota: no mobile, um por vez na parte de baixo */
.stage__cartoes {
  margin: 0;
  padding: 0;
  list-style: none;
}

.cartao {
  position: absolute;
  left: var(--gutter);
  right: var(--gutter);
  /* Acima do botão flutuante de WhatsApp */
  bottom: 96px;
  padding: 20px 20px 22px 64px;
  background: #1E1A28;
  border: 2px solid var(--creme);
  border-radius: var(--raio);
  box-shadow: 6px 6px 0 var(--rosa);
  opacity: 0;
  visibility: hidden;
}

.cartao__nota {
  position: absolute;
  left: 14px;
  top: 16px;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--turquesa);
  color: var(--escuro);
  font-size: 22px;
  line-height: 1;
}

.cartao__titulo { font-size: clamp(1.25rem, 2.6vw, 1.75rem); color: var(--laranja); }
.cartao__texto { margin-top: 8px; font-size: 1rem; }

.cartao__link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: 4px;
  color: var(--turquesa);
  font-weight: 700;
  text-underline-offset: 3px;
}

/* Braço com as marcações de progresso */
.stage__braco {
  position: absolute;
  right: 14px;
  top: 50%;
  translate: 0 -50%;
  display: grid;
  gap: 18px;
  margin: 0;
  padding: 14px 6px;
  list-style: none;
  border-left: 2px solid rgb(255 243 227 / 0.25);
}

.stage__braco li {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid rgb(255 243 227 / 0.5);
  transition: background-color 200ms ease, border-color 200ms ease;
}

.stage__braco li.is-on { background: var(--turquesa); border-color: var(--turquesa); }

@media (min-width: 900px) {
  .stage__violao { top: 84px; width: min(26vw, 36svh); }

  .cartao {
    left: auto;
    right: auto;
    bottom: auto;
    top: 50%;
    width: min(380px, 30vw);
    margin-top: -90px;
  }
  .cartao--esq { left: max(var(--gutter), calc(50% - 560px)); }
  .cartao--dir { right: max(64px, calc(50% - 560px)); }

  .stage__braco { right: 28px; }
}

/* Sem animação: vira uma seção comum, com o violão parado e as notas listadas */
@media (prefers-reduced-motion: reduce) {
  .stage { height: auto; }
  .stage__sticky {
    position: relative;
    height: auto;
    padding: 72px var(--gutter);
    display: grid;
    gap: 32px;
    justify-items: center;
  }
  .stage__violao { position: relative; left: auto; top: auto; translate: none; width: 160px; }
  .stage__violao-move { transform: rotate(-6deg); }
  .stage__dica,
  .stage__braco { display: none; }
  .stage__cartoes { display: grid; gap: 24px; width: 100%; max-width: 820px; }
  .cartao { position: relative; inset: auto; width: auto; margin: 0; opacity: 1; visibility: visible; }
}
</style>
