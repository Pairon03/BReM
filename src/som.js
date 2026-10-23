// Som do violão sintetizado no navegador (Karplus-Strong): nenhum arquivo de áudio para baixar.
// Começa desligado; o navegador só libera áudio depois de um clique, então quem liga é o visitante.

import { ref } from 'vue'

export const somLigado = ref(false)

// Acordes de cima para baixo no braço: corda 0 = Mi grave ... corda 5 = Mi agudo. null = corda abafada.
export const ACORDES = {
  G: [98.0, 123.47, 146.83, 196.0, 246.94, 392.0],
  D: [null, null, 146.83, 220.0, 293.66, 369.99],
  Em: [82.41, 123.47, 164.81, 196.0, 246.94, 329.63],
  C: [null, 130.81, 164.81, 196.0, 261.63, 329.63],
}

let ctx = null
let saida = null
const buffers = new Map()
const vozes = []

function corda(freq) {
  if (buffers.has(freq)) return buffers.get(freq)
  const sr = ctx.sampleRate
  const tamanho = Math.floor(sr * 2.4)
  const buf = ctx.createBuffer(1, tamanho, sr)
  const dados = buf.getChannelData(0)
  const n = Math.round(sr / freq)
  const anel = new Float32Array(n)
  // Ruído já suavizado: ataque de palheta macia, sem chiado
  let anterior = 0
  for (let i = 0; i < n; i++) {
    anterior = anterior * 0.5 + (Math.random() * 2 - 1) * 0.5
    anel[i] = anterior
  }
  // Cordas graves sustentam mais, como no violão de verdade
  const perda = freq < 150 ? 0.9975 : 0.996
  let idx = 0
  let pico = 0
  for (let i = 0; i < tamanho; i++) {
    const a = anel[idx]
    const b = anel[(idx + 1) % n]
    dados[i] = a
    anel[idx] = (a + b) * 0.5 * perda
    idx = (idx + 1) % n
    pico = Math.max(pico, Math.abs(a))
  }
  for (let i = 0; i < tamanho; i++) dados[i] /= pico || 1
  buffers.set(freq, buf)
  return buf
}

export async function alternarSom() {
  if (somLigado.value) {
    somLigado.value = false
    await ctx?.suspend()
    return
  }
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    ctx = new Ctx()
    // Corpo do violão: corta o brilho metálico e dá calor
    const filtro = ctx.createBiquadFilter()
    filtro.type = 'lowpass'
    filtro.frequency.value = 3200
    const corpo = ctx.createBiquadFilter()
    corpo.type = 'peaking'
    corpo.frequency.value = 110
    corpo.gain.value = 5
    saida = ctx.createGain()
    saida.gain.value = 0.5
    saida.connect(corpo).connect(filtro).connect(ctx.destination)
  }
  await ctx.resume()
  somLigado.value = true
}

/** Toca a corda `i` do acorde. `forca` de 0 a 2. */
export function tocarCorda(acorde, i, forca = 1) {
  if (!somLigado.value || !ctx) return
  const freq = acorde?.[i]
  if (!freq) return
  const fonte = ctx.createBufferSource()
  fonte.buffer = corda(freq)
  const ganho = ctx.createGain()
  ganho.gain.value = 0.16 * Math.min(2, Math.max(0.35, forca))
  const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null
  if (pan) pan.pan.value = (i - 2.5) * 0.08
  fonte.connect(ganho)
  ;(pan ? ganho.connect(pan) : ganho).connect(saida)
  fonte.start()
  // Teto de vozes para não embolar quando a rolagem é muito rápida
  vozes.push(fonte)
  fonte.onended = () => {
    const k = vozes.indexOf(fonte)
    if (k >= 0) vozes.splice(k, 1)
  }
  if (vozes.length > 14) vozes.shift().stop()
}
