<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  // Acorde + giro de entrada ao carregar (hero). O palco controla tudo pela rolagem.
  intro: { type: Boolean, default: true },
  // Notinhas decorativas subindo em loop
  notas: { type: Boolean, default: true },
})

// Cordas: x no capotraste (topo) e no cavalete (base)
const NUT_Y = 64
const BRIDGE_Y = 447
const cordas = Array.from({ length: 6 }, (_, i) => ({
  x1: 112.5 + i * 3,
  x2: 108 + i * 4.8,
}))

// Silhueta do corpo, usada duas vezes (sombra rosa "fora de registro" e corpo)
const corpo =
  'M120 225 C165 225 192 255 190 300 C188 335 172 350 175 368 C178 385 215 400 215 450 C215 510 170 540 120 540 C70 540 25 510 25 450 C25 400 62 385 65 368 C68 350 52 335 50 300 C48 255 75 225 120 225 Z'

function lente({ x1, x2 }) {
  const mx = (x1 + x2) / 2
  const my = (NUT_Y + BRIDGE_Y) / 2
  return `M${x1} ${NUT_Y} Q${mx + 3.5} ${my} ${x2} ${BRIDGE_Y} Q${mx - 3.5} ${my} ${x1} ${NUT_Y} Z`
}

const root = ref(null)
const cordaEls = ref([])
const lenteEls = ref([])
const ondaEls = ref([])
const pausado = ref(false)

let reduzMovimento = false
let timer = 0
let observer = null

// Oscilação que vai morrendo, como uma corda solta depois do acorde
const OSCILACAO = [0, 2.2, -2, 1.7, -1.4, 1.1, -0.8, 0.5, -0.3, 0]
const vibracao = (forca) => OSCILACAO.map((x) => ({ transform: `translateX(${x * forca}px)` }))
const ONDA = [
  { opacity: 0.75, transform: 'scale(1)' },
  { opacity: 0, transform: 'scale(3.4)' },
]
const BRILHO = [
  { opacity: 0, transform: 'scaleX(1)' },
  { opacity: 0.6, transform: 'scaleX(1)', offset: 0.08 },
  { opacity: 0, transform: 'scaleX(0.2)' },
]

/** Toca um acorde. `forca` escala a amplitude; `intervalo` é o atraso entre cordas (ms). */
function tocar(forca = 1, intervalo = 70) {
  if (reduzMovimento) return
  const quadros = vibracao(forca)
  // Cordas em sequência (grave → aguda): ~1,15 s no total com o intervalo padrão
  cordaEls.value.forEach((el, i) => {
    el.getAnimations().forEach((a) => a.cancel())
    el.animate(quadros, { duration: 800, delay: i * intervalo, easing: 'linear' })
  })
  ondaEls.value.forEach((el, i) => {
    el.getAnimations().forEach((a) => a.cancel())
    el.animate(ONDA, { duration: 1400, delay: 120 + i * 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' })
  })
  lenteEls.value.forEach((el, i) => {
    el.getAnimations().forEach((a) => a.cancel())
    el.animate(BRILHO, { duration: 800, delay: i * intervalo, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' })
  })
}

defineExpose({ tocar })

function aoPassarMouse(e) {
  if (e.pointerType === 'mouse') tocar()
}

function aoTocar(e) {
  if (e.pointerType !== 'mouse') tocar()
}

onMounted(() => {
  reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduzMovimento || !props.intro) return

  // O acorde de entrada começa quando o violão termina de girar para o lugar
  timer = window.setTimeout(tocar, 520)

  // Pausa o respiro e as notas quando o hero sai da tela
  observer = new IntersectionObserver(([entry]) => {
    pausado.value = !entry.isIntersecting
  })
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  window.clearTimeout(timer)
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="root"
    class="guitar"
    :class="{ 'is-paused': pausado, 'sem-intro': !intro }"
    aria-hidden="true"
    @pointerenter="aoPassarMouse"
    @pointerdown="aoTocar"
  >
    <div class="guitar__enter">
      <svg class="guitar__breathe" viewBox="0 0 240 560" focusable="false">
        <defs>
          <linearGradient id="gv-corpo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#FFB26B" />
            <stop offset="0.45" stop-color="var(--laranja)" />
            <stop offset="1" stop-color="#D8452F" />
          </linearGradient>
          <radialGradient id="gv-brilho" cx="0.32" cy="0.3" r="0.6">
            <stop offset="0" stop-color="#FFF3E3" stop-opacity="0.55" />
            <stop offset="1" stop-color="#FFF3E3" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Corpo com sombra rosa deslocada (efeito de risografia fora de registro) -->
        <path :d="corpo" fill="var(--rosa)" transform="translate(10 8)" />
        <path :d="corpo" fill="url(#gv-corpo)" stroke="var(--creme)" stroke-width="3.5" />
        <path :d="corpo" fill="url(#gv-brilho)" />
        <path
          :d="corpo"
          fill="none"
          stroke="var(--escuro)"
          stroke-width="2"
          stroke-dasharray="2 5"
          opacity="0.35"
          transform="translate(120 382) scale(0.9) translate(-120 -382)"
        />

        <!-- Escudo -->
        <path
          d="M150 360 C172 362 182 382 176 402 C170 420 150 424 140 412 C132 402 134 380 150 360 Z"
          fill="var(--rosa)"
          stroke="var(--escuro)"
          stroke-width="3"
        />

        <!-- Boca e roseta -->
        <circle cx="120" cy="345" r="34" fill="none" stroke="var(--turquesa)" stroke-width="5" />
        <circle cx="120" cy="345" r="28.5" fill="none" stroke="var(--creme)" stroke-width="1.5" />
        <circle cx="120" cy="345" r="24" fill="var(--escuro)" />
        <circle
          v-for="n in 3"
          :key="`o${n}`"
          ref="ondaEls"
          class="guitar__onda"
          cx="120"
          cy="345"
          r="36"
        />

        <!-- Mão e braço -->
        <path
          d="M101 8 L139 8 C143 8 146 11 145 15 L140 62 L100 62 L95 15 C94 11 97 8 101 8 Z"
          fill="#3A2433"
          stroke="var(--creme)"
          stroke-width="2.5"
        />
        <g fill="var(--creme)" stroke="var(--escuro)" stroke-width="2.5">
          <circle cx="90" cy="22" r="5" />
          <circle cx="90" cy="37" r="5" />
          <circle cx="90" cy="52" r="5" />
          <circle cx="150" cy="22" r="5" />
          <circle cx="150" cy="37" r="5" />
          <circle cx="150" cy="52" r="5" />
        </g>
        <rect x="107" y="60" width="26" height="256" rx="3" fill="#3A2433" stroke="var(--creme)" stroke-width="2" />
        <rect x="105" y="60" width="30" height="6" rx="2" fill="var(--creme)" />
        <g stroke="var(--laranja)" stroke-width="2" opacity="0.7">
          <line x1="107" x2="133" y1="98" y2="98" />
          <line x1="107" x2="133" y1="132" y2="132" />
          <line x1="107" x2="133" y1="163" y2="163" />
          <line x1="107" x2="133" y1="191" y2="191" />
          <line x1="107" x2="133" y1="217" y2="217" />
          <line x1="107" x2="133" y1="241" y2="241" />
          <line x1="107" x2="133" y1="263" y2="263" />
          <line x1="107" x2="133" y1="283" y2="283" />
        </g>
        <g fill="var(--turquesa)">
          <circle cx="120" cy="148" r="3" />
          <circle cx="120" cy="204" r="3" />
          <circle cx="120" cy="252" r="3" />
        </g>

        <!-- Cavalete -->
        <rect x="86" y="438" width="68" height="16" rx="5" fill="#3A2433" stroke="var(--creme)" stroke-width="2" />

        <!-- Brilho de vibração (lente) e cordas -->
        <path
          v-for="(c, i) in cordas"
          :key="`l${i}`"
          ref="lenteEls"
          class="guitar__lente"
          :d="lente(c)"
        />
        <line
          v-for="(c, i) in cordas"
          :key="`c${i}`"
          ref="cordaEls"
          class="guitar__corda"
          :x1="c.x1"
          :y1="NUT_Y"
          :x2="c.x2"
          :y2="BRIDGE_Y"
          :stroke-width="1.8 - i * 0.18"
        />
      </svg>
    </div>

    <div v-if="notas" class="guitar__notas">
      <svg v-for="n in 3" :key="n" class="nota" viewBox="0 0 24 32" focusable="false">
        <path
          d="M9 25a5 5 0 1 1-2-4V3l13-3v19a5 5 0 1 1-2-4V5L9 7Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.guitar {
  position: relative;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.guitar__enter {
  animation: guitar-in 640ms var(--ease-out) 80ms both;
  transform-origin: 50% 80%;
}

.guitar__breathe {
  width: 100%;
  height: auto;
  overflow: visible;
  transform-origin: 50% 90%;
  animation: guitar-breathe 3.6s ease-in-out 1.4s infinite alternate;
}

.guitar__corda { stroke: var(--creme); }

.guitar__onda {
  fill: none;
  stroke: var(--turquesa);
  stroke-width: 2;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

.guitar__lente {
  fill: var(--creme);
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

.guitar__notas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.nota {
  position: absolute;
  width: 14%;
  color: var(--creme);
  opacity: 0;
  animation: nota-sobe 4.2s var(--ease-out) infinite;
}
.nota:nth-child(1) { left: 66%; top: 46%; animation-delay: 1.6s; }
.nota:nth-child(2) { left: 6%; top: 54%; width: 11%; animation-delay: 3s; }
.nota:nth-child(3) { left: 74%; top: 64%; width: 10%; animation-delay: 4.4s; }

.sem-intro .guitar__enter,
.sem-intro .guitar__breathe { animation: none; }

.is-paused .guitar__breathe,
.is-paused .nota { animation-play-state: paused; }

@keyframes guitar-in {
  from {
    opacity: 0;
    transform: translateY(28px) rotate(-16deg) scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes guitar-breathe {
  from { transform: scale(1) rotate(0deg); }
  to { transform: scale(1.018) rotate(1.2deg); }
}

@keyframes nota-sobe {
  0% { opacity: 0; transform: translateY(0) rotate(-8deg); }
  20% { opacity: 0.55; }
  70% { opacity: 0; transform: translateY(-90px) rotate(10deg); }
  100% { opacity: 0; transform: translateY(-90px) rotate(10deg); }
}

@media (prefers-reduced-motion: reduce) {
  .guitar__enter,
  .guitar__breathe { animation: none; }
  .guitar__notas { display: none; }
}
</style>
