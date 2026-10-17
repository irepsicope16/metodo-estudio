/**
 * Métricas de uso muy livianas (Google Analytics 4), solo para que Irene
 * pueda ver cuántas personas abren la app y en qué proporción son
 * profesionales vs. estudiantes/familias — no hay backend propio, así que
 * esto es lo único que realmente "le llega" a ella. Mientras no haya un
 * Measurement ID configurado, no se envía nada (no rompe en desarrollo ni
 * mientras no esté dado de alta la propiedad de Analytics).
 */

// Completar con el Measurement ID real (formato "G-XXXXXXXXXX") una vez
// creada la propiedad de GA4 para metodoestudio.ar.
const GA_MEASUREMENT_ID = ''

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let cargado = false

function cargarGtag() {
  if (cargado || !GA_MEASUREMENT_ID) return
  cargado = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true })
}

export function trackEvent(name: string, params?: Record<string, string>) {
  if (!GA_MEASUREMENT_ID) return
  cargarGtag()
  window.gtag?.('event', name, params)
}
