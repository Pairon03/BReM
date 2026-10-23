<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { DVD, antesDoDvd } from '../config.js'
import { ACORDES, alternarSom, somLigado } from '../som.js'
import GuitarSvg from './GuitarSvg.vue'

// Cada nota que desce do violão apresenta um pedaço do site, num acorde da progressão G D Em C G.
const capitulos = [
  {
    acorde: 'G',
    titulo: 'Voz trocada',
    texto: 'Primeira e segunda voz mudam de lugar no meio da música. A dupla brinca, provoca e puxa o público.',
  },
  {
    acorde: 'D',
    titulo: 'Bate-papo cantado',
    texto: 'Um show de conversa e cantoria, não um recital. Seus convidados viram parte do repertório.',
  },
  {
    acorde: 'Em',
    titulo: `DVD ${DVD.nome}`,
    texto: antesDoDvd()
      ? `Gravação ao vivo em 2 de novembro, às 14h, na ${DVD.local}. Você pode estar na plateia.`
      : `Gravado ao vivo na ${DVD.local}. Agora a agenda de 2027 está aberta.`,
    link: '#dvd',
    linkTexto: 'Ver o DVD',
  },
  {
    acorde: 'C',
    titulo: 'Próximos shows',
    texto: 'Veja onde a dupla toca e garanta a sua data antes que a agenda feche.',
    link: '#shows',
    linkTexto: 'Ver agenda',
  },
  {
    acorde: 'G',
    titulo: 'No seu evento',
    texto: 'Casamentos, formaturas e festas em Campinas e região. Do acústico ao showzão.',
    link: '#formatos',
    linkTexto: 'Ver formatos',
  },
]

// Linha do tempo da rolagem (0 → 1): entrada do violão, depois uma janela por capítulo
const ENTRADA = 0.1
const PASSO = (0.97 - ENTRADA) / capitulos.length
// Dentro da janela: a nota desce até QUEDA, o texto fica até SAIDA
const QUEDA = 0.28
const SAIDA = 0.9
// Rolagem que leva a palheta de um lado ao outro das cordas
const PX_POR_BATIDA = 170

const atual = ref(0)
const acorde = computed(() => ACORDES[capitulos[atual.value].acorde])
const estados = ref(capitulos.map(() => 'antes'))

const secao = ref(null)
const quadro = ref(null)
const violaoBox = ref(null)
const violaoMove = ref(null)
const violao = ref(null)
const pautaCentro = ref(null)
const pautaEls = ref([])
const fluxoEls = ref([])
const notaEls = ref([])
const capsBox = ref(null)
const marcaEls = ref([])
const dica = ref(null)
const letreiro = ref(null)
const particulas = ref(null)

const pautaD = ref(Array(5).fill(''))
const pautaCentroD = ref('')

let ativo = false
let raf = 0
let ultimoY = 0
let ultimoT = null
let comprimento = 1
let boca = { x: 0, y: 0 }
let pose = { giro: -58 }
let observer = null
let reduz = false

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
// Onda triangular: vai e volta entre 0 e 1
const tri = (x) => {
  const f = ((x % 2) + 2) % 2
  return f < 1 ? f : 2 - f
}

/*
 * Layout calculado em JS: a boca do violão é o ponto fixo de tudo (giro, notas e pauta saem dela).
 */
function medir() {
  const W = quadro.value.clientWidth
  const H = quadro.value.clientHeight
  const largo = W >= 900
  const altura = largo ? Math.min(H * 0.92, 980) : Math.min(H * 0.6, W * 1.45)
  const largura = altura * (240 / 560)
  boca = largo ? { x: Math.min(W * 0.27, W / 2 - 200), y: H * 0.36 } : { x: W * 0.5, y: H * 0.3 }
  pose = { giro: largo ? -58 : -62 }

  const box = violaoBox.value
  box.style.width = `${largura}px`
  box.style.left = `${boca.x - largura / 2}px`
  box.style.top = `${boca.y - altura * (345 / 560)}px`

  // Pauta: cai da boca e faz a curva até o começo do texto
  const caps = capsBox.value
  const fim = largo
    ? { x: caps.offsetLeft - 44, y: caps.offsetTop + 30 }
    : { x: caps.offsetLeft + 18, y: caps.offsetTop - 26 }
  const c1 = largo ? { x: boca.x + 40, y: boca.y + H * 0.36 } : { x: boca.x - 20, y: boca.y + H * 0.2 }
  const c2 = largo ? { x: fim.x - W * 0.14, y: fim.y - H * 0.02 } : { x: fim.x + W * 0.1, y: fim.y - H * 0.1 }
  const pontos = [boca, c1, c2, fim]
  pautaCentroD.value = curva(pontos, 0)
  const gap = largo ? 9 : 7
  pautaD.value = [-2, -1, 0, 1, 2].map((k) => curva(pontos, k * gap))
  requestAnimationFrame(() => {
    comprimento = pautaCentro.value?.getTotalLength() || 1
    atualizar()
  })
}

// Bézier deslocada pela normal (aproximação de Tiller-Hanson): cinco linhas paralelas
function curva([p0, p1, p2, p3], d) {
  const normal = (a, b) => {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy) || 1
    return { x: (-dy / len) * d, y: (dx / len) * d }
  }
  const n0 = normal(p0, p1)
  const n1 = normal(p2, p3)
  const f = (p, n) => `${(p.x + n.x).toFixed(1)} ${(p.y + n.y).toFixed(1)}`
  return `M${f(p0, n0)} C${f(p1, n0)} ${f(p2, n1)} ${f(p3, n1)}`
}

const pontoNa = (k) => pautaCentro.value.getPointAtLength(clamp(k) * comprimento)

function atualizar() {
  raf = 0
  const r = secao.value.getBoundingClientRect()
  const total = r.height - window.innerHeight
  const p = clamp(-r.top / total)

  // Entrada: o violão gira de frente para a posição de tocar, com profundidade
  const e = easeInOut(clamp(p / ENTRADA))
  const giro = -14 + (pose.giro + 14) * e
  violaoMove.value.style.transform = `rotateY(${32 * (1 - e)}deg) rotate(${giro}deg) scale(${0.66 + 0.34 * e})`
  violaoMove.value.style.opacity = String(clamp(0.35 + e))
  dica.value.style.opacity = String(1 - clamp(p / 0.05))
  letreiro.value.style.transform = `translateX(${-p * 60}%)`

  // Pauta: desenha ao chegar no primeiro capítulo e o fluxo corre com a rolagem
  const desenho = easeOut(clamp((p - ENTRADA * 0.6) / (PASSO * QUEDA + ENTRADA * 0.4)))
  pautaEls.value.forEach((el) => (el.style.strokeDashoffset = String(1 - desenho)))
  fluxoEls.value.forEach((el) => {
    el.style.strokeDashoffset = String(-window.scrollY / 900)
    el.style.opacity = String(0.55 * desenho)
  })

  let indice = 0
  capitulos.forEach((_, i) => {
    const t = (p - (ENTRADA + i * PASSO)) / PASSO
    const ultimo = i === capitulos.length - 1
    if (t >= 0) indice = i

    // Nota desce pela pauta até pousar no título
    const nota = notaEls.value[i]
    if (t > 0 && t < 1.05) {
      const k = easeInOut(clamp(t / QUEDA))
      const pt = pontoNa(k)
      const balanço = Math.sin(t * 18) * 12 * (1 - k)
      const some = !ultimo && t > SAIDA ? 1 - clamp((t - SAIDA) / 0.1) : 1
      nota.style.opacity = String(clamp(k * 6) * some)
      nota.style.transform = `translate(${pt.x}px, ${pt.y}px) rotate(${balanço}deg) scale(${0.55 + 0.45 * k})`
      nota.classList.toggle('is-pousada', t >= QUEDA)
    } else if (!(ultimo && t >= 1)) {
      nota.style.opacity = '0'
      nota.classList.remove('is-pousada')
    }

    // Texto entra por transição quando a nota pousa e sai antes da próxima
    let estado = 'antes'
    if (t >= QUEDA) estado = !ultimo && t >= SAIDA ? 'depois' : 'dentro'
    if (estados.value[i] !== estado) estados.value[i] = estado
    marcaEls.value[i]?.classList.toggle('is-on', t >= 0)
  })
  if (atual.value !== indice) atual.value = indice
}

function batidas(y) {
  // Posição da palheta: vai e volta sobre as cordas conforme a rolagem
  const p = (y - secao.value.offsetTop) / PX_POR_BATIDA
  const t = -0.25 + tri(p) * 1.5
  const sentido = Math.sign(t - (ultimoT ?? t)) || 1
  violao.value.moverPalheta(t, sentido)
  if (ultimoT === null) {
    ultimoT = t
    return
  }
  const delta = Math.abs(y - ultimoY)
  // Saltos (clique em âncora, restauração de rolagem) não tocam
  if (delta > 0 && delta < 900) {
    const forca = clamp(delta / 28, 0.45, 1.7)
    const a = Math.min(ultimoT, t)
    const b = Math.max(ultimoT, t)
    const cruzadas = []
    for (let i = 0; i < 6; i++) {
      const pos = violao.value.posicaoCorda(i)
      if (pos > a && pos <= b) cruzadas.push(i)
    }
    if (sentido < 0) cruzadas.reverse()
    cruzadas.forEach((i, ordem) => {
      if (ordem === 0) violao.value.tocarCorda(i, forca)
      else window.setTimeout(() => violao.value?.tocarCorda(i, forca), ordem * 14)
    })
    if (cruzadas.length >= 4) {
      violao.value.ondas()
      soltarNota(forca)
    }
  }
  ultimoT = t
}

// Notinhas que caem da boca a cada batida forte
function soltarNota(forca) {
  if (particulas.value.childElementCount > 6) return
  const n = document.createElement('span')
  n.className = 'particula'
  n.textContent = ['♪', '♫', '♩'][Math.floor(Math.random() * 3)]
  n.style.left = `${boca.x}px`
  n.style.top = `${boca.y}px`
  particulas.value.append(n)
  const dx = (Math.random() - 0.3) * 160
  const dy = 140 + Math.random() * 140
  n.animate(
    [
      { transform: 'translate(-50%, -50%) scale(0.5) rotate(0deg)', opacity: 0 },
      { opacity: 0.85, offset: 0.15 },
      {
        transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${0.8 + forca * 0.3}) rotate(${dx / 4}deg)`,
        opacity: 0,
      },
    ],
    { duration: 1500, easing: 'cubic-bezier(0.33, 0, 0.67, 1)' },
  ).finished.then(() => n.remove())
}

function aoRolar() {
  if (!ativo) return
  const y = window.scrollY
  batidas(y)
  ultimoY = y
  if (!raf) raf = requestAnimationFrame(atualizar)
}

function aoRedimensionar() {
  if (reduz) return
  medir()
}

onMounted(() => {
  reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduz) {
    estados.value = capitulos.map(() => 'dentro')
    return
  }
  ultimoY = window.scrollY
  medir()
  observer = new IntersectionObserver(([e]) => {
    ativo = e.isIntersecting
    if (ativo) {
      ultimoY = window.scrollY
      ultimoT = null
      atualizar()
    }
  })
  observer.observe(secao.value)
  window.addEventListener('scroll', aoRolar, { passive: true })
  window.addEventListener('resize', aoRedimensionar)
  document.fonts?.ready.then(() => !reduz && medir())
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(raf)
  window.removeEventListener('scroll', aoRolar)
  window.removeEventListener('resize', aoRedimensionar)
})

const palavras = (s) => s.split(' ')
</script>

<template>
  <section ref="secao" class="palco" aria-labelledby="palco-titulo">
    <div ref="quadro" class="palco__quadro">
      <h2 id="palco-titulo" class="sr-only">O show em notas</h2>

      <div class="palco__luzes" aria-hidden="true"></div>
      <p class="palco__letreiro" aria-hidden="true">
        <span ref="letreiro">Tá Tudo BR&amp;M · Tá Tudo BR&amp;M · Tá Tudo BR&amp;M ·</span>
      </p>

      <div ref="violaoBox" class="palco__violao">
        <div ref="violaoMove" class="palco__violao-move">
          <GuitarSvg ref="violao" :intro="false" :notas="false" palheta :acorde="acorde" />
        </div>
      </div>

      <svg class="palco__pauta" aria-hidden="true">
        <path ref="pautaCentro" :d="pautaCentroD" fill="none" stroke="none" />
        <path
          v-for="(d, i) in pautaD"
          :key="`p${i}`"
          ref="pautaEls"
          :d="d"
          pathLength="1"
          class="pauta__linha"
        />
        <path
          v-for="(d, i) in pautaD"
          :key="`f${i}`"
          ref="fluxoEls"
          :d="d"
          pathLength="1"
          class="pauta__fluxo"
        />
      </svg>

      <div ref="particulas" class="palco__particulas" aria-hidden="true"></div>

      <!-- Notas que descem pela pauta: uma por capítulo -->
      <div
        v-for="(c, i) in capitulos"
        :key="`n${i}`"
        ref="notaEls"
        class="nota-grande"
        aria-hidden="true"
      >
        <span class="nota-grande__anel"></span>
        <svg viewBox="0 0 32 44" focusable="false">
          <ellipse cx="11" cy="35" rx="9.5" ry="6.8" transform="rotate(-22 11 35)" />
          <rect x="18.2" y="3" width="2.6" height="32" rx="1" />
          <path d="M20.8 3 C21 10 31 12 29 23 C28 16 24 13 20.8 12 Z" />
        </svg>
      </div>

      <p ref="dica" class="palco__dica" aria-hidden="true">
        <span class="palco__dica-linha"></span>
        Role para tocar
      </p>

      <button
        type="button"
        class="palco__som"
        :aria-pressed="somLigado"
        @click="alternarSom"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
          <template v-if="somLigado">
            <path d="M16 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 6a8.5 8.5 0 0 1 0 12" />
          </template>
          <path v-else d="M16.5 9.5l5 5m0-5l-5 5" />
        </svg>
        {{ somLigado ? 'Som ligado' : 'Ligar o som' }}
      </button>

      <!-- Versão para leitores de tela: os capítulos visuais entram e saem com a rolagem -->
      <ul class="sr-only">
        <li v-for="c in capitulos" :key="c.titulo">
          {{ c.titulo }}: {{ c.texto }}
          <a v-if="c.link" :href="c.link">{{ c.linkTexto }}</a>
        </li>
      </ul>

      <div ref="capsBox" class="palco__capitulos" aria-hidden="true">
        <article
          v-for="(c, i) in capitulos"
          :key="c.titulo"
          class="cap"
          :class="`is-${estados[i]}`"
        >
          <p class="cap__meta">
            <span class="cap__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="cap__traco"></span>
            <span class="cap__acorde">{{ c.acorde }}</span>
          </p>
          <h3 class="cap__titulo">
            <span v-for="(w, j) in palavras(c.titulo)" :key="j" class="cap__palavra">
              <span :style="{ '--i': j }">{{ w }}</span>
            </span>
          </h3>
          <p class="cap__texto">{{ c.texto }}</p>
          <a v-if="c.link" class="cap__link" :href="c.link" tabindex="-1">
            {{ c.linkTexto }}
            <span aria-hidden="true">→</span>
          </a>
        </article>
      </div>

      <ol class="palco__braco" aria-hidden="true">
        <li v-for="(c, i) in capitulos" :key="c.titulo" ref="marcaEls">
          <span>{{ c.acorde }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.palco {
  position: relative;
  height: 640vh;
  background: var(--escuro);
  color: var(--creme);
}

.palco__quadro {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  isolation: isolate;
  background: var(--escuro);
  perspective: 1400px;
}

/* Refletores na paleta: rosa e laranja vindos de cima, turquesa no chão. Estático. */
.palco__luzes {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(48% 42% at 30% 46%, rgb(245 138 58 / 0.24), transparent 70%),
    radial-gradient(40% 50% at 78% 70%, rgb(232 69 107 / 0.16), transparent 70%),
    radial-gradient(70% 30% at 50% 108%, rgb(63 201 184 / 0.14), transparent 70%),
    conic-gradient(from 160deg at 30% -10%, transparent 0deg, rgb(255 243 227 / 0.07) 8deg, transparent 18deg,
      transparent 26deg, rgb(255 243 227 / 0.05) 31deg, transparent 38deg),
    repeating-linear-gradient(90deg, rgb(255 243 227 / 0.035) 0 1px, transparent 1px 96px);
}

/* Letreiro vazado gigante no fundo, correndo com a rolagem */
.palco__letreiro {
  position: absolute;
  left: 0;
  bottom: 4%;
  z-index: -1;
  margin: 0;
  white-space: nowrap;
  pointer-events: none;
  font-family: var(--font-titulo);
  font-size: clamp(6rem, 22vw, 20rem);
  line-height: 1;
  letter-spacing: -0.03em;
  color: transparent;
  -webkit-text-stroke: 1px rgb(255 243 227 / 0.09);
}
.palco__letreiro span { display: inline-block; will-change: transform; }

.palco__pauta {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.pauta__linha {
  fill: none;
  stroke: rgb(255 243 227 / 0.4);
  stroke-width: 1.1;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

.pauta__fluxo {
  fill: none;
  stroke: var(--turquesa);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-dasharray: 0.004 0.06;
  opacity: 0;
}

.palco__violao {
  position: absolute;
  /* left, top e width vêm do JS */
  aspect-ratio: 240 / 560;
  filter: drop-shadow(0 40px 50px rgb(0 0 0 / 0.55));
}

.palco__violao-move {
  transform-origin: 50% 61.6%;
  transform: rotate(-14deg) scale(0.66);
  will-change: transform;
}

.palco__particulas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.palco__particulas :deep(.particula) {
  position: absolute;
  font-size: 28px;
  line-height: 1;
  color: var(--turquesa);
  text-shadow: 0 0 18px rgb(63 201 184 / 0.6);
  opacity: 0;
}

.nota-grande {
  position: absolute;
  left: 0;
  top: 0;
  width: 46px;
  height: 64px;
  margin: -54px 0 0 -16px;
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
}

.nota-grande svg {
  width: 100%;
  height: 100%;
  fill: var(--creme);
  filter: drop-shadow(0 0 14px rgb(63 201 184 / 0.55)) drop-shadow(0 6px 10px rgb(0 0 0 / 0.5));
}

.nota-grande__anel {
  position: absolute;
  left: 2px;
  top: 38px;
  width: 26px;
  height: 26px;
  border: 2px solid var(--turquesa);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.6);
}

/* Pouso: um anel que se abre uma vez */
.nota-grande.is-pousada .nota-grande__anel {
  animation: pouso 700ms var(--ease-out);
}

@keyframes pouso {
  from { opacity: 0.9; transform: scale(0.6); }
  to { opacity: 0; transform: scale(3.4); }
}

.palco__dica {
  position: absolute;
  left: 50%;
  bottom: 32px;
  translate: -50% 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  white-space: nowrap;
}

.palco__dica-linha {
  width: 1px;
  height: 40px;
  background: linear-gradient(var(--creme), transparent);
  transform-origin: top;
  animation: dica 1.8s var(--ease-in-out) infinite;
}

@keyframes dica {
  0% { transform: scaleY(0); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(1); opacity: 0; }
}

.palco__som {
  position: absolute;
  left: var(--gutter);
  top: 84px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px 0 12px;
  border: 1.5px solid rgb(255 243 227 / 0.3);
  border-radius: 999px;
  background: rgb(20 18 28 / 0.6);
  color: var(--creme);
  font: 700 0.875rem var(--font-texto);
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: border-color 160ms ease, transform 160ms var(--ease-out);
}
.palco__som svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
.palco__som[aria-pressed='true'] { border-color: var(--turquesa); color: var(--turquesa); }
.palco__som:active { transform: scale(0.97); }
@media (hover: hover) and (pointer: fine) {
  .palco__som:hover { border-color: var(--creme); }
}

/* Capítulos: no celular ficam embaixo, acima do botão flutuante de WhatsApp */
.palco__capitulos {
  position: absolute;
  left: var(--gutter);
  right: calc(var(--gutter) + 28px);
  bottom: 92px;
  height: 262px;
}

.cap {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}
.cap.is-dentro { pointer-events: auto; }

.cap__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--turquesa);
}
.cap__traco { width: 32px; height: 1px; background: currentColor; }
.cap__acorde {
  font-family: var(--font-script);
  font-size: 1.125rem;
  letter-spacing: 0;
  color: var(--laranja);
}

.cap__titulo {
  font-size: clamp(2.125rem, 9vw, 5rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
}

/* Palavras sobem de dentro de uma máscara, uma de cada vez */
.cap__palavra {
  display: inline-block;
  overflow: hidden;
  padding-bottom: 0.06em;
  margin-right: 0.22em;
  vertical-align: top;
}
.cap__palavra > span {
  display: inline-block;
  transform: translateY(105%);
  transition: transform 700ms var(--ease-out);
  transition-delay: calc(var(--i) * 70ms);
}

.cap__texto {
  max-width: 40ch;
  font-size: clamp(1rem, 1.6vw, 1.1875rem);
  color: rgb(255 243 227 / 0.78);
}

.cap__link {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  color: var(--turquesa);
  font-weight: 700;
  text-underline-offset: 4px;
}
.cap__link span { transition: transform 160ms var(--ease-out); }
@media (hover: hover) and (pointer: fine) {
  .cap__link:hover span { transform: translateX(4px); }
}

.cap__meta,
.cap__texto,
.cap__link {
  opacity: 0;
  transform: translateY(14px);
  filter: blur(6px);
  transition: opacity 500ms var(--ease-out), transform 600ms var(--ease-out), filter 500ms var(--ease-out);
}
.cap__texto { transition-delay: 180ms; }
.cap__link { transition-delay: 260ms; }

.cap.is-dentro .cap__palavra > span { transform: none; }
.cap.is-dentro .cap__meta,
.cap.is-dentro .cap__texto,
.cap.is-dentro .cap__link {
  opacity: 1;
  transform: none;
  filter: none;
}

/* Saída mais rápida que a entrada */
.cap.is-depois .cap__palavra > span {
  transform: translateY(-105%);
  transition-duration: 320ms;
  transition-delay: calc(var(--i) * 30ms);
}
.cap.is-depois .cap__meta,
.cap.is-depois .cap__texto,
.cap.is-depois .cap__link {
  opacity: 0;
  transform: translateY(-14px);
  filter: blur(6px);
  transition-duration: 260ms;
  transition-delay: 0ms;
}

/* Braço com as casas: um acorde por capítulo */
.palco__braco {
  position: absolute;
  right: 12px;
  top: 50%;
  translate: 0 -50%;
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.palco__braco li {
  display: grid;
  place-items: center;
  width: 26px;
  height: 34px;
  border-top: 1.5px solid rgb(255 243 227 / 0.25);
  font-size: 0.6875rem;
  font-weight: 700;
  color: rgb(255 243 227 / 0.4);
  transition: color 200ms ease;
}
.palco__braco li:last-child { border-bottom: 1.5px solid rgb(255 243 227 / 0.25); }
.palco__braco li span {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  transition: background-color 200ms ease, color 200ms ease;
}
.palco__braco li.is-on span { background: var(--turquesa); color: var(--escuro); }

@media (min-width: 900px) {
  .palco__capitulos {
    left: auto;
    right: max(88px, calc(50% - 600px));
    top: 54%;
    bottom: auto;
    width: min(520px, 38vw);
    height: 340px;
  }
  .cap { gap: 16px; }
  .cap__titulo { font-size: clamp(3rem, 5.2vw, 5rem); }
  .palco__som { top: auto; bottom: 28px; }
  .palco__braco { right: 28px; }
  .palco__braco li { width: 32px; height: 44px; }
}

/* Sem animação: vira uma seção comum, com o violão parado e os capítulos listados */
@media (prefers-reduced-motion: reduce) {
  .palco { height: auto; }
  .palco__quadro {
    position: relative;
    height: auto;
    padding: 72px var(--gutter);
    display: grid;
    gap: 40px;
    justify-items: center;
    perspective: none;
  }
  .palco__violao { position: relative; left: auto; top: auto; width: 150px; }
  .palco__violao-move { transform: rotate(-8deg); }
  .palco__dica,
  .palco__braco,
  .palco__pauta,
  .palco__som,
  .palco__letreiro,
  .nota-grande { display: none; }
  .palco__capitulos { position: relative; inset: auto; width: 100%; max-width: 760px; height: auto; margin: 0; display: grid; gap: 40px; }
  .cap { position: relative; }
}
</style>
