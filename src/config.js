// Dados fixos da dupla. Edite aqui e o site inteiro acompanha.

export const INSTAGRAM = {
  handle: '@brenoramosemarcelo',
  url: 'https://instagram.com/brenoramosemarcelo',
}

const WHATSAPP_NUMBER = '5519992950888'

export const WHATSAPP = {
  display: '(19) 99295-0888',
  url: `https://wa.me/${WHATSAPP_NUMBER}?text=Oi!%20Vi%20o%20site%20e%20quero%20uma%20proposta%20para%20meu%20evento.`,
}

/** Link de WhatsApp com mensagem citando o formato escolhido. */
export function whatsappFormato(formato) {
  const text = `Oi! Vi o site e quero uma proposta do formato ${formato}.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export const DVD = {
  nome: 'Tá Tudo BR&M',
  // 02/11/2026, 14h, horário de Brasília (UTC-3, sem horário de verão)
  data: new Date('2026-11-02T14:00:00-03:00'),
  local: 'Arena Pontel Beach',
  endereco: 'R. Heleni de Araujo Lalier, 67, Pq. Universitário de Viracopos, Campinas/SP',
  ingressos:
    'https://x.byma.com.br/event/6ac3d56da0be8700046ef183?utm_source=site&utm_medium=landing&utm_campaign=dvd_ta_tudo_brm',
}

/** true enquanto a gravação do DVD ainda não começou. */
export function antesDoDvd(agora = new Date()) {
  return agora < DVD.data
}

export const CREDITO = {
  nome: 'Korvex',
  url: 'https://cvkorvex.vercel.app',
}
