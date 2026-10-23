# TODO: conteúdo pendente

O site já pode ir ao ar sem nenhum `[placeholder]` visível. O que falta é confirmar
com a dupla e trocar a mídia provisória.

## Confirmar com a dupla (tudo em `src/config.js`, objeto `CONTEUDO`)
- [ ] `prazoProposta`: hoje "24 horas" (hero). Eles conseguem responder nesse prazo?
- [ ] `antecedencia`: hoje "3 a 6 meses" (FAQ).
- [ ] `garantiaExtra`: vazio = item escondido na seção de garantias.
- [ ] `depoimentos`: lista vazia = bloco escondido. Adicionar 3 frases reais com nome e tipo de evento.
- [ ] `videosProntos`: `false` = mostra botão para os Reels no Instagram no lugar da grade.
      Troque para `true` depois de colocar os vídeos reais em `public/videos/`.

## DVD e agenda (`src/config.js`)
- [x] `DVD_GUIA_VIDEOS`: Reel do 1º guia do DVD já está na aba "Guia do DVD". Novos vídeos = nova linha na lista.
- [ ] `DVD_GUIA`: guia em texto (portões, classificação...). Enquanto for `null`, a aba mostra só os vídeos.
- [ ] `SHOWS`: adicionar os próximos shows (data, título, local, cidade, link). Hoje só tem a
      gravação do DVD. Shows com data passada somem sozinhos; lista vazia = mensagem de agenda aberta.

## Confirmar textos escritos sem briefing
- [ ] "Quem somos" (`src/components/AboutSection.vue`)
- [ ] "Cuidamos do resto" (`src/components/EffortSection.vue`): passagem de som, horário, cerimonial
- [ ] Mecanismo "Voz Trocada" (1º capítulo do palco do violão, `src/components/GuitarStage.vue`): a troca de vozes é mesmo marca deles?
- [ ] Textos dos 5 capítulos do palco (`capitulos` em `GuitarStage.vue`) e a progressão de acordes G D Em C G
- [ ] Formato "Festa": tem sanfona?

## Mídia
As fotos de `hero.jpg`, `dupla.jpg` e `og.jpg` foram recortadas da arte do DVD postada
no Instagram (resolução de print). Trocar pelos arquivos originais em alta quando a dupla mandar.

| Arquivo | Uso | Tamanho sugerido | Situação |
|---|---|---|---|
| `public/img/hero.jpg` | Foto do hero | 800×1000, retrato | provisória (print) |
| `public/img/dupla.jpg` | "Quem somos" | 800×800 | provisória (print) |
| `public/img/og.jpg` | Compartilhamento (Open Graph) | 1200×630 | provisória (print) |
| `public/img/poster-*.jpg` | Capas dos vídeos | 540×960 (9:16) | placeholder |
| `public/videos/*.mp4` | Casamento, formatura, casa de show | H.264 vertical, até ~3 MB | placeholder |
