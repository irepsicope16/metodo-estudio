import { create } from 'zustand'
import { toast } from '@/components/ui/toast'
import type { TecnicaCronometro } from '@/types'

// Cronómetro global: antes vivía como estado local de CronometroPage, así
// que al navegar a otra pantalla el componente se desmontaba y el conteo
// se perdía. Ahora el intervalo corre acá, fuera del ciclo de vida de
// cualquier página — sigue contando (y suena) mientras la pestaña del
// navegador siga abierta, sin importar por dónde navegues dentro de la app.

// Un solo AudioContext reutilizado para todos los beeps. Si se crea uno
// nuevo recién cuando suena la alarma (minutos después, sin click del
// usuario de por medio), los navegadores lo crean "suspendido" por su
// política de autoplay y el sonido nunca se escucha. Por eso este contexto
// se crea/desbloquea en alternar(), que sí corre dentro de un click real.
let audioCtx: AudioContext | null = null

function asegurarAudioCtx() {
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    if (audioCtx.state === 'suspended') void audioCtx.resume()
  } catch {
    /* sin soporte de audio, no interrumpe el flujo */
  }
}

function tocarTono(ctx: AudioContext) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = 660
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
  osc.start()
  osc.stop(ctx.currentTime + 0.6)
}

function beep() {
  try {
    if (!audioCtx) return
    const ctx = audioCtx
    // Chrome (y otros) suspenden automáticamente un AudioContext que
    // estuvo mucho tiempo sin sonar, para ahorrar batería — así que aunque
    // se haya desbloqueado al tocar "Iniciar", 25 minutos después puede
    // estar "suspended" otra vez. Por eso se revisa y se reactiva acá,
    // justo antes de sonar, no solo al principio.
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => tocarTono(ctx)).catch(() => {})
    } else {
      tocarTono(ctx)
    }
  } catch {
    /* sin soporte de audio, no interrumpe el flujo */
  }
}

interface CronometroState {
  tecnica: TecnicaCronometro
  minutosFoco: number
  minutosDescanso: number
  enDescanso: boolean
  segundosRestantes: number
  segundosLibres: number
  corriendo: boolean
  focoMinutosAcumulados: number
  intervalId: number | null
  /** Marca de tiempo (Date.now()) a la que corresponde el estado actual — el
   *  avance se calcula contra el reloj real, no contando ticks de
   *  setInterval, porque el navegador frena o directamente pausa esos
   *  ticks cuando la pestaña queda en segundo plano o el dispositivo se
   *  bloquea. Así, aunque los ticks se atrasen o se corten, en cuanto
   *  vuelve a ejecutar código (un tick tardío, o al volver a la pestaña)
   *  se pone al día de una sola vez en lugar de quedarse corriendo de más. */
  referencia: number | null
  setTecnica: (t: TecnicaCronometro) => void
  setMinutosFoco: (m: number) => void
  setMinutosDescanso: (m: number) => void
  alternar: () => void
  reiniciar: () => void
  /** Pone el estado al día contra el reloj real. Se llama desde el
   *  intervalo y también al volver a la pestaña. */
  ponerseAlDia: () => void
  /** Duración a registrar si se guarda la sesión ahora mismo. */
  duracionActual: () => number
}

export const useCronometroStore = create<CronometroState>()((set, get) => ({
  tecnica: 'pomodoro',
  minutosFoco: 25,
  minutosDescanso: 5,
  enDescanso: false,
  segundosRestantes: 25 * 60,
  segundosLibres: 0,
  corriendo: false,
  focoMinutosAcumulados: 0,
  intervalId: null,
  referencia: null,

  setTecnica: (tecnica) => {
    get().reiniciar()
    set({ tecnica })
  },
  setMinutosFoco: (minutosFoco) => set({ minutosFoco, segundosRestantes: minutosFoco * 60 }),
  setMinutosDescanso: (minutosDescanso) => set({ minutosDescanso }),

  ponerseAlDia: () => {
    const s = get()
    if (!s.corriendo || s.referencia == null) return
    const ahora = Date.now()
    const transcurrido = Math.floor((ahora - s.referencia) / 1000)
    if (transcurrido < 1) return
    const nuevaReferencia = s.referencia + transcurrido * 1000

    if (s.tecnica === 'libre') {
      set({ segundosLibres: s.segundosLibres + transcurrido, referencia: nuevaReferencia })
      return
    }

    let restante = s.segundosRestantes - transcurrido
    let enDescanso = s.enDescanso
    let focoMinutosAcumulados = s.focoMinutosAcumulados
    let huboTransicion = false
    let resguardo = 0
    // Normalmente es una sola vuelta; el while solo importa si pasó MUCHO
    // tiempo real sin que corriera ningún tick (pestaña en segundo plano
    // mucho rato) y hay que "saltar" más de un ciclo foco/descanso.
    while (restante <= 0 && resguardo < 1000) {
      resguardo++
      huboTransicion = true
      if (!enDescanso) {
        enDescanso = true
        focoMinutosAcumulados += s.minutosFoco
        restante += s.minutosDescanso * 60
      } else {
        enDescanso = false
        restante += s.minutosFoco * 60
      }
    }

    if (huboTransicion) {
      beep()
      toast.info(enDescanso ? '¡Descanso! Te lo ganaste.' : 'Descanso terminado, volvamos.')
    }
    set({ segundosRestantes: restante, enDescanso, focoMinutosAcumulados, referencia: nuevaReferencia })
  },

  alternar: () => {
    const s = get()
    if (s.corriendo) {
      get().ponerseAlDia()
      if (s.intervalId) clearInterval(s.intervalId)
      set({ corriendo: false, intervalId: null, referencia: null })
      return
    }
    asegurarAudioCtx()
    const id = window.setInterval(() => get().ponerseAlDia(), 1000)
    set({ corriendo: true, intervalId: id, referencia: Date.now() })
  },

  reiniciar: () => {
    const id = get().intervalId
    if (id) clearInterval(id)
    const { minutosFoco } = get()
    set({
      corriendo: false,
      intervalId: null,
      referencia: null,
      enDescanso: false,
      segundosRestantes: minutosFoco * 60,
      segundosLibres: 0,
      focoMinutosAcumulados: 0,
    })
  },

  duracionActual: () => {
    const s = get()
    return s.tecnica === 'libre' ? Math.round(s.segundosLibres / 60) : s.focoMinutosAcumulados + (s.enDescanso ? s.minutosFoco : 0)
  },
}))

// Los navegadores retrasan mucho (o directamente congelan) el setInterval
// de una pestaña en segundo plano. Al volver a primer plano, nos ponemos
// al día enseguida en vez de esperar al próximo tick (que puede tardar).
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      useCronometroStore.getState().ponerseAlDia()
    }
  })
}
