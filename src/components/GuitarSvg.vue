<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ACORDES, tocarCorda as somDaCorda } from '../som.js'

const props = defineProps({
  // Acorde + giro de entrada ao carregar (hero). O palco controla tudo pela rolagem.
  intro: { type: Boolean, default: true },
  // Notinhas decorativas subindo em loop
  notas: { type: Boolean, default: true },
  // Palheta sobre as cordas, movida pelo palco
  palheta: { type: Boolean, default: false },
  // Frequências das 6 cordas (som só toca se o visitante ligar)
  acorde: { type: Array, default: () => ACORDES.G },
})

// Ids únicos: o violão aparece mais de uma vez na página
const uid = `v${Math.random().toString(36).slice(2, 7)}`
const id = (nome) => `${uid}-${nome}`
const url = (nome) => `url(#${id(nome)})`

// Escala: do capotraste (NUT_Y) ao rastilho (BRIDGE_Y), trastes na proporção real de 2^(n/12)
const NUT_Y = 64
const BRIDGE_Y = 447
const ESCALA = BRIDGE_Y - NUT_Y
const FIM_ESCALA = 306
const trastes = Array.from({ length: 17 }, (_, i) => NUT_Y + ESCALA * (1 - 2 ** (-(i + 1) / 12)))
const meio = (n) => ((n === 1 ? NUT_Y : trastes[n - 2]) + trastes[n - 1]) / 2
const marcadores = [3, 5, 7, 9, 15].map(meio)
const marcador12 = meio(12)

// Cordas: x no capotraste e no rastilho. 0 = Mi grave (encapada), 5 = Mi agudo.
const cordas = Array.from({ length: 6 }, (_, i) => ({
  x1: 112.5 + i * 3,
  x2: 108 + i * 4.8,
  largura: [1.9, 1.6, 1.35, 1.05, 0.85, 0.7][i],
  encapada: i < 3,
  // Tarraxas: três de cada lado da mão
  px: i < 3 ? 104 : 136,
  py: 46 - (i % 3) * 15,
}))
const xNaAltura = (c, y) => c.x1 + ((c.x2 - c.x1) * (y - NUT_Y)) / ESCALA

const corpo =
  'M120 225 C165 225 192 255 190 300 C188 335 172 350 175 368 C178 385 215 400 215 450 C215 510 170 540 120 540 C70 540 25 510 25 450 C25 400 62 385 65 368 C68 350 52 335 50 300 C48 255 75 225 120 225 Z'

function lente({ x1, x2 }) {
  const mx = (x1 + x2) / 2
  const my = (NUT_Y + BRIDGE_Y) / 2
  return `M${x1} ${NUT_Y} Q${mx + 3.2} ${my} ${x2} ${BRIDGE_Y} Q${mx - 3.2} ${my} ${x1} ${NUT_Y} Z`
}

// Palheta: altura onde se toca, logo abaixo da boca
const PALHETA_Y = 384
const palhetaX0 = xNaAltura(cordas[0], PALHETA_Y)
const palhetaX5 = xNaAltura(cordas[5], PALHETA_Y)

const root = ref(null)
const boca = ref(null)
const cordaEls = ref([])
const lenteEls = ref([])
const ondaEls = ref([])
const palhetaEl = ref(null)
const pausado = ref(false)

let reduzMovimento = false
let timer = 0
let observer = null
const sons = []

// Oscilação que vai morrendo, como uma corda solta
const OSCILACAO = [0, 1.6, -1.5, 1.25, -1.05, 0.85, -0.62, 0.42, -0.24, 0.1, 0]
const vibracao = (forca) => OSCILACAO.map((x) => ({ transform: `translateX(${x * forca}px)` }))
const ONDA = [
  { opacity: 0.6, transform: 'scale(1)' },
  { opacity: 0, transform: 'scale(3.2)' },
]
const BRILHO = [
  { opacity: 0, transform: 'scaleX(1)' },
  { opacity: 0.5, transform: 'scaleX(1)', offset: 0.06 },
  { opacity: 0, transform: 'scaleX(0.15)' },
]

/** Uma corda: vibra, brilha e (com o som ligado) soa. */
function tocarCorda(i, forca = 1) {
  if (reduzMovimento) return
  const el = cordaEls.value[i]
  const brilho = lenteEls.value[i]
  if (!el) return
  el.getAnimations().forEach((a) => a.cancel())
  el.animate(vibracao(forca * (1.2 - i * 0.08)), { duration: 900, easing: 'linear' })
  brilho.getAnimations().forEach((a) => a.cancel())
  brilho.animate(BRILHO, { duration: 900, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' })
  somDaCorda(props.acorde, i, forca)
}

/** Acorde inteiro, corda por corda. `intervalo` é o atraso entre cordas (ms). */
function tocar(forca = 1, intervalo = 55) {
  if (reduzMovimento) return
  sons.forEach(window.clearTimeout)
  sons.length = 0
  for (let i = 0; i < 6; i++) {
    if (i === 0) tocarCorda(0, forca)
    else sons.push(window.setTimeout(() => tocarCorda(i, forca), i * intervalo))
  }
  ondas()
}

/** Ondas de som saindo da boca. */
function ondas() {
  if (reduzMovimento) return
  ondaEls.value.forEach((el, i) => {
    el.getAnimations().forEach((a) => a.cancel())
    el.animate(ONDA, { duration: 1400, delay: 80 + i * 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' })
  })
}

/** Leva a palheta para `t` (0 = Mi grave, 1 = Mi agudo), inclinada no sentido da batida. */
function moverPalheta(t, sentido = 1) {
  const x = palhetaX0 + (palhetaX5 - palhetaX0) * t
  palhetaEl.value?.setAttribute('transform', `translate(${x} ${PALHETA_Y}) rotate(${-18 * sentido})`)
}

/** Posição da corda `i` na mesma escala de `moverPalheta`. */
const posicaoCorda = (i) => i / 5

defineExpose({ tocar, tocarCorda, ondas, moverPalheta, posicaoCorda, boca })

function aoPassarMouse(e) {
  if (e.pointerType === 'mouse') tocar(0.9)
}

function aoTocar(e) {
  if (e.pointerType !== 'mouse') tocar(0.9)
}

onMounted(() => {
  reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  moverPalheta(-0.2)
  if (reduzMovimento || !props.intro) return

  // O acorde de entrada começa quando o violão termina de girar para o lugar
  timer = window.setTimeout(() => tocar(), 620)

  // Pausa o respiro e as notas quando o hero sai da tela
  observer = new IntersectionObserver(([entry]) => {
    pausado.value = !entry.isIntersecting
  })
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  window.clearTimeout(timer)
  sons.forEach(window.clearTimeout)
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
      <div class="guitar__breathe">
        <!-- Camada parada: madeira, verniz e ferragens. Nunca repinta durante a animação. -->
        <svg class="guitar__base" viewBox="0 0 240 560" focusable="false">
          <defs>
            <!-- Tampo sunburst: mel no centro, laranja e rosa da marca nas bordas -->
            <radialGradient :id="id('tampo')" cx="0.5" cy="0.58" r="0.62">
              <stop offset="0" stop-color="#F8D29A" />
              <stop offset="0.38" stop-color="#F3AE62" />
              <stop offset="0.66" stop-color="#E9772F" />
              <stop offset="0.86" stop-color="#C23A4E" />
              <stop offset="1" stop-color="#3A1220" />
            </radialGradient>
            <linearGradient :id="id('lateral')" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#1A0B0E" />
              <stop offset="0.5" stop-color="#4A1C22" />
              <stop offset="1" stop-color="#1A0B0E" />
            </linearGradient>
            <linearGradient :id="id('escala')" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#1B1012" />
              <stop offset="0.5" stop-color="#33201F" />
              <stop offset="1" stop-color="#1B1012" />
            </linearGradient>
            <linearGradient :id="id('mao')" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#4A2A24" />
              <stop offset="1" stop-color="#1E1012" />
            </linearGradient>
            <linearGradient :id="id('metal')" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#8E8A84" />
              <stop offset="0.45" stop-color="#F4F1EA" />
              <stop offset="1" stop-color="#7C7770" />
            </linearGradient>
            <radialGradient :id="id('botao')" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stop-color="#FFFFFF" />
              <stop offset="0.5" stop-color="#C9C4BB" />
              <stop offset="1" stop-color="#6F6A63" />
            </radialGradient>
            <radialGradient :id="id('furo')" cx="0.5" cy="0.42" r="0.6">
              <stop offset="0" stop-color="#050304" />
              <stop offset="0.75" stop-color="#140A0C" />
              <stop offset="1" stop-color="#2A1416" />
            </radialGradient>
            <linearGradient :id="id('escudo')" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#3A0E18" />
              <stop offset="0.5" stop-color="#8A2440" />
              <stop offset="1" stop-color="#2A0A12" />
            </linearGradient>
            <linearGradient :id="id('verniz')" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.42" />
              <stop offset="0.35" stop-color="#FFFFFF" stop-opacity="0.06" />
              <stop offset="1" stop-color="#FFFFFF" stop-opacity="0" />
            </linearGradient>
            <clipPath :id="id('clip-corpo')">
              <path :d="corpo" />
            </clipPath>
            <!-- Veios do abeto: ruído esticado na vertical -->
            <filter :id="id('veio')" x="0" y="0" width="1" height="1">
              <feTurbulence type="fractalNoise" baseFrequency="0.85 0.012" numOctaves="2" seed="7" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.32  0 0 0 0 0.14  0 0 0 0 0.06  0 0 0 1.4 -0.55"
              />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
            <filter :id="id('veio-escuro')" x="0" y="0" width="1" height="1">
              <feTurbulence type="fractalNoise" baseFrequency="0.6 0.02" numOctaves="2" seed="3" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.2 -0.45"
              />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          <!-- Lateral: dá espessura ao corpo -->
          <path :d="corpo" :fill="url('lateral')" transform="translate(0 7)" />

          <!-- Tampo, veios e verniz -->
          <path :d="corpo" :fill="url('tampo')" />
          <path :d="corpo" fill="#000" :filter="url('veio')" opacity="0.55" />
          <g :clip-path="url('clip-corpo')">
            <ellipse cx="78" cy="430" rx="34" ry="120" :fill="url('verniz')" transform="rotate(-14 78 430)" />
            <ellipse cx="88" cy="270" rx="22" ry="48" :fill="url('verniz')" transform="rotate(-22 88 270)" />
          </g>

          <!-- Friso e filete -->
          <path :d="corpo" fill="none" stroke="#F3E4CB" stroke-width="3.2" />
          <path :d="corpo" fill="none" stroke="#1A0B0E" stroke-width="0.8" />
          <path
            :d="corpo"
            fill="none"
            stroke="#F3E4CB"
            stroke-width="0.7"
            opacity="0.7"
            transform="translate(120 382) scale(0.965) translate(-120 -382)"
          />

          <!-- Escudo em casco de tartaruga -->
          <path
            d="M150 362 C172 364 183 384 177 404 C171 422 151 426 141 414 C133 404 135 382 150 362 Z"
            :fill="url('escudo')"
            fill-opacity="0.88"
            stroke="#2A0E14"
            stroke-width="0.8"
          />
          <path
            d="M150 362 C172 364 183 384 177 404 C171 422 151 426 141 414 C133 404 135 382 150 362 Z"
            fill="#000"
            :filter="url('veio-escuro')"
            opacity="0.5"
          />

          <!-- Roseta em mosaico turquesa e boca -->
          <circle cx="120" cy="345" r="35.5" fill="none" stroke="#1A0B0E" stroke-width="0.8" />
          <circle cx="120" cy="345" r="34" fill="none" stroke="#F3E4CB" stroke-width="1.2" />
          <circle cx="120" cy="345" r="30.6" fill="none" stroke="#1D1215" stroke-width="5" />
          <circle cx="120" cy="345" r="30.6" fill="none" stroke="var(--turquesa)" stroke-width="3.6" stroke-dasharray="1.6 1.1" />
          <circle cx="120" cy="345" r="27.4" fill="none" stroke="#F3E4CB" stroke-width="1" />
          <circle ref="boca" cx="120" cy="345" r="24.5" :fill="url('furo')" />
          <!-- Interior iluminado e travessa -->
          <path d="M98 352 A24.5 24.5 0 0 0 142 352 C134 360 106 360 98 352 Z" fill="#4A2320" opacity="0.55" />
          <rect x="96" y="364" width="48" height="2.4" fill="#2B1517" opacity="0.6" />

          <!-- Cavalete bigode, rastilho de osso e pinos -->
          <path
            d="M76 450 Q83 438 98 440 L142 440 Q157 438 164 450 Q157 460 142 457 L98 457 Q83 460 76 450 Z"
            fill="#1E1012"
            stroke="#3B2422"
            stroke-width="0.8"
          />
          <path d="M76 450 Q83 438 98 440 L142 440 Q157 438 164 450" fill="none" stroke="#5A3A33" stroke-width="0.8" />
          <rect x="102" y="445.6" width="36" height="2.6" rx="1" fill="#F1E6D2" />
          <circle
            v-for="(c, i) in cordas"
            :key="`p${i}`"
            :cx="c.x2"
            cy="453"
            r="1.9"
            fill="#F1E6D2"
            stroke="#1A0B0E"
            stroke-width="0.5"
          />

          <!-- Braço: escala de jacarandá, trastes de metal, marcações de madrepérola -->
          <path :d="`M106 ${NUT_Y - 2} L134 ${NUT_Y - 2} L136 ${FIM_ESCALA} L104 ${FIM_ESCALA} Z`" :fill="url('escala')" />
          <path
            :d="`M106 ${NUT_Y - 2} L134 ${NUT_Y - 2} L136 ${FIM_ESCALA} L104 ${FIM_ESCALA} Z`"
            fill="#000"
            :filter="url('veio-escuro')"
            opacity="0.35"
          />
          <path
            :d="`M106 ${NUT_Y - 2} L104 ${FIM_ESCALA} M134 ${NUT_Y - 2} L136 ${FIM_ESCALA}`"
            stroke="#F3E4CB"
            stroke-width="0.7"
            opacity="0.6"
          />
          <g>
            <template v-for="(y, n) in trastes" :key="`t${n}`">
              <line :x1="106 - (2 * (y - NUT_Y)) / (FIM_ESCALA - NUT_Y)" :x2="134 + (2 * (y - NUT_Y)) / (FIM_ESCALA - NUT_Y)" :y1="y + 0.9" :y2="y + 0.9" stroke="#000" stroke-width="1" opacity="0.45" />
              <line :x1="106 - (2 * (y - NUT_Y)) / (FIM_ESCALA - NUT_Y)" :x2="134 + (2 * (y - NUT_Y)) / (FIM_ESCALA - NUT_Y)" :y1="y" :y2="y" :stroke="url('metal')" stroke-width="1.3" />
            </template>
          </g>
          <g fill="#EDE6F0" opacity="0.9">
            <circle v-for="y in marcadores" :key="`m${y}`" cx="120" :cy="y" r="2.2" />
            <circle cx="114" :cy="marcador12" r="2.2" />
            <circle cx="126" :cy="marcador12" r="2.2" />
          </g>

          <!-- Mão com a marca da dupla, tarraxas cromadas -->
          <path d="M100 63 L95 12 Q95.5 3 104 3 L136 3 Q144.5 3 145 12 L140 63 Z" :fill="url('mao')" />
          <path d="M100 63 L95 12 Q95.5 3 104 3 L136 3 Q144.5 3 145 12 L140 63 Z" fill="#000" :filter="url('veio-escuro')" opacity="0.4" />
          <path d="M100 63 L95 12 Q95.5 3 104 3 L136 3 Q144.5 3 145 12 L140 63 Z" fill="none" stroke="#F3E4CB" stroke-width="0.7" opacity="0.5" />
          <text x="120" y="13.5" text-anchor="middle" class="guitar__logo">BR&amp;M</text>
          <g v-for="(c, i) in cordas" :key="`k${i}`">
            <rect
              :x="i < 3 ? 84 : 145"
              :y="c.py - 1.4"
              width="11"
              height="2.8"
              :fill="url('metal')"
            />
            <ellipse :cx="i < 3 ? 85 : 155" :cy="c.py" rx="4.6" ry="3.6" :fill="url('botao')" stroke="#3A3631" stroke-width="0.5" />
            <circle :cx="c.px" :cy="c.py" r="2.4" :fill="url('botao')" stroke="#2A2622" stroke-width="0.5" />
          </g>
          <!-- Capotraste de osso -->
          <rect x="105.5" :y="NUT_Y - 4" width="29" height="4.4" rx="1" fill="#F1E6D2" />
        </svg>

        <!-- Camada viva: cordas, brilho de vibração, ondas e palheta -->
        <svg class="guitar__vivo" viewBox="0 0 240 560" focusable="false">
          <defs>
            <linearGradient :id="id('bronze')" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#8A6638" />
              <stop offset="0.5" stop-color="#E8C48A" />
              <stop offset="1" stop-color="#8A6638" />
            </linearGradient>
            <linearGradient :id="id('aco')" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#9A968F" />
              <stop offset="0.5" stop-color="#FFFFFF" />
              <stop offset="1" stop-color="#9A968F" />
            </linearGradient>
            <linearGradient :id="id('palheta')" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#FF7A97" />
              <stop offset="0.55" stop-color="var(--rosa)" />
              <stop offset="1" stop-color="#A3203F" />
            </linearGradient>
          </defs>

          <circle
            v-for="n in 3"
            :key="`o${n}`"
            ref="ondaEls"
            class="guitar__onda"
            cx="120"
            cy="345"
            r="36"
          />

          <!-- Trecho até as tarraxas (fica parado) -->
          <line
            v-for="(c, i) in cordas"
            :key="`r${i}`"
            :x1="c.x1"
            :y1="NUT_Y - 3"
            :x2="c.px"
            :y2="c.py"
            :stroke="c.encapada ? '#C8A067' : '#E8E4DC'"
            :stroke-width="c.largura * 0.85"
          />

          <path
            v-for="(c, i) in cordas"
            :key="`l${i}`"
            ref="lenteEls"
            class="guitar__lente"
            :d="lente(c)"
            :fill="c.encapada ? '#E8C48A' : '#FFFFFF'"
          />
          <g v-for="(c, i) in cordas" :key="`c${i}`" ref="cordaEls">
            <line :x1="c.x1 + 1.3" :y1="NUT_Y" :x2="c.x2 + 1.6" :y2="BRIDGE_Y" stroke="#000" :stroke-width="c.largura" opacity="0.32" />
            <line :x1="c.x1" :y1="NUT_Y - 2" :x2="c.x2" :y2="BRIDGE_Y" :stroke="url(c.encapada ? 'bronze' : 'aco')" :stroke-width="c.largura" />
            <line
              v-if="c.encapada"
              :x1="c.x1"
              :y1="NUT_Y - 2"
              :x2="c.x2"
              :y2="BRIDGE_Y"
              stroke="#3A2A1A"
              :stroke-width="c.largura"
              stroke-dasharray="0.45 0.55"
              opacity="0.45"
            />
          </g>
          <line
            v-for="(c, i) in cordas"
            :key="`f${i}`"
            :x1="c.x2"
            :y1="BRIDGE_Y"
            :x2="c.x2"
            y2="453"
            :stroke="c.encapada ? '#C8A067' : '#E8E4DC'"
            :stroke-width="c.largura"
          />

          <g v-if="palheta" ref="palhetaEl" class="guitar__palheta">
            <path
              d="M0 -12 C7.5 -12 11 -9 11 -4.5 C11 2 3.5 9.5 0 13 C-3.5 9.5 -11 2 -11 -4.5 C-11 -9 -7.5 -12 0 -12 Z"
              fill="#000"
              opacity="0.35"
              transform="translate(2.5 3)"
            />
            <path
              d="M0 -12 C7.5 -12 11 -9 11 -4.5 C11 2 3.5 9.5 0 13 C-3.5 9.5 -11 2 -11 -4.5 C-11 -9 -7.5 -12 0 -12 Z"
              :fill="url('palheta')"
              stroke="#7A1830"
              stroke-width="0.6"
            />
            <path d="M-6 -8.5 C-3 -10 3 -10 6 -8.5" fill="none" stroke="#FFFFFF" stroke-width="1.2" opacity="0.55" stroke-linecap="round" />
            <text y="1.6" text-anchor="middle" class="guitar__palheta-marca">BR&amp;M</text>
          </g>
        </svg>
      </div>
    </div>

    <div v-if="notas" class="guitar__notas">
      <svg v-for="n in 3" :key="n" class="nota" viewBox="0 0 24 32" focusable="false">
        <path d="M9 25a5 5 0 1 1-2-4V3l13-3v19a5 5 0 1 1-2-4V5L9 7Z" fill="currentColor" />
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
  animation: guitar-in 760ms var(--ease-out) 80ms both;
  transform-origin: 50% 80%;
}

.guitar__breathe {
  position: relative;
  transform-origin: 50% 90%;
  animation: guitar-breathe 3.6s ease-in-out 1.4s infinite alternate;
}

.guitar__base,
.guitar__vivo {
  width: 100%;
  height: auto;
  overflow: visible;
}

.guitar__vivo {
  position: absolute;
  inset: 0;
}

.guitar__logo {
  font-family: var(--font-titulo);
  font-size: 6.4px;
  letter-spacing: 0.02em;
  fill: #F3E4CB;
}

.guitar__palheta-marca {
  font-family: var(--font-titulo);
  font-size: 3.4px;
  fill: #FFE3EA;
  opacity: 0.85;
}

.guitar__onda {
  fill: none;
  stroke: var(--turquesa);
  stroke-width: 1.6;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

.guitar__lente {
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
