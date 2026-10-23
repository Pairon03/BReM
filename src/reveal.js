// Revelação suave das seções ao rolar: títulos, cartões e blocos sobem com um leve desfoque,
// em cascata curta. Só entra em ação com JS e sem preferência por menos movimento.

const ALVOS = [
  'main > section.section .container > h2',
  'main > section.section .container > p',
  'main > section.section .container > ul > li',
  'main > section.section .container > ol > li',
  'main > section.section .container > div',
  'main > section.section .container > figure',
].join(',')

export function revelarAoRolar() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!('IntersectionObserver' in window)) return

  const els = [...document.querySelectorAll(ALVOS)]
  // Cascata por grupo de irmãos: 60 ms entre cada um, no máximo 5 passos
  els.forEach((el) => {
    const irmaos = [...el.parentElement.children]
    el.style.setProperty('--revela-i', String(Math.min(irmaos.indexOf(el), 5)))
    el.classList.add('revela')
  })

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.classList.add('is-visivel')
        observer.unobserve(e.target)
      })
    },
    { rootMargin: '0px 0px -12% 0px' },
  )
  els.forEach((el) => observer.observe(el))
}
