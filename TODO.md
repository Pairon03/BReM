# TODO: conteúdo pendente

## Textos (placeholders [entre colchetes] visíveis no site)
- [ ] Hero, microtexto: `[X horas]` → `src/components/HeroSection.vue`
- [ ] Quem somos: `[2 a 3 frases sobre a história da dupla]` → `src/components/AboutSection.vue`
- [ ] Esforço quase zero: `[passagem de som, horário, estrutura]` → `src/components/EffortSection.vue`
- [ ] Depoimentos (3x): `[frase]`, `[nome]`, `[tipo de evento]` → `src/components/ProofSection.vue`
- [ ] Redução de risco: `[Garantia extra, se houver.]` → `src/components/RiskSection.vue`
- [ ] FAQ: `[prazo ideal]` → `src/components/FaqSection.vue`

Depois de preencher, remova o `<span class="placeholder">` em volta do texto.

## Mídia (substituir os placeholders gerados em /public)
| Arquivo | Uso | Tamanho sugerido |
|---|---|---|
| `public/img/hero.jpg` | Foto da dupla no hero (vira duotone) | 800×1000, retrato |
| `public/img/dupla.jpg` | Foto da seção "Quem somos" | 800×800 |
| `public/img/og.jpg` | Imagem de compartilhamento (Open Graph) | 1200×630 |
| `public/img/poster-casamento.jpg` | Capa do vídeo de casamento | 540×960 (9:16) |
| `public/img/poster-formatura.jpg` | Capa do vídeo de formatura | 540×960 (9:16) |
| `public/img/poster-casa-de-show.jpg` | Capa do vídeo de casa de show | 540×960 (9:16) |
| `public/videos/casamento.mp4` | Vídeo curto vertical, sem depender de áudio | H.264, até ~3 MB |
| `public/videos/formatura.mp4` | idem | idem |
| `public/videos/casa-de-show.mp4` | idem | idem |
