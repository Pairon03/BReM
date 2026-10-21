<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  src: { type: String, required: true },
  poster: { type: String, required: true },
  legenda: { type: String, required: true },
})

const video = ref(null)
let observer = null

// Toca mudo só enquanto estiver na tela; com movimento reduzido, nunca toca sozinho
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  observer = new IntersectionObserver(
    ([entry]) => {
      const el = video.value
      if (!el) return
      if (entry.isIntersecting) el.play().catch(() => {})
      else el.pause()
    },
    { threshold: 0.6 },
  )
  observer.observe(video.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <figure class="video">
    <video
      ref="video"
      :src="src"
      :poster="poster"
      preload="none"
      muted
      loop
      playsinline
      controls
      :aria-label="`Vídeo: ${legenda}`"
    ></video>
    <figcaption>{{ legenda }}</figcaption>
  </figure>
</template>

<style scoped>
.video { margin: 0; }

video {
  width: 100%;
  aspect-ratio: 9 / 16;
  object-fit: cover;
  background: #2A2433;
  border: 2.5px solid var(--creme);
  border-radius: var(--raio);
}

figcaption {
  margin-top: 12px;
  font-weight: 700;
}
</style>
