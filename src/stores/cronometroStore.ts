import { create } from 'zustand'
import { toast } from '@/components/ui/toast'
import type { TecnicaCronometro } from '@/types'

// Cronómetro global: antes vivía como estado local de CronometroPage, así
// que al navegar a otra pantalla el componente se desmontaba y el conteo
// se perdía. Ahora el intervalo corre acá, fuera del ciclo de vida de
// cualquier página — sigue contando (y suena) mientras la pestaña del
// navegador siga abierta, sin importar por dónde navegues dentro de la app.

function beep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 660
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start()
    osc.stop(ctx.currentTime + 0.6)
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
  setTecnica: (t: TecnicaCronometro) => void
  setMinutosFoco: (m: number) => void
  setMinutosDescanso: (m: number) => void
  alternar: () => void
  reiniciar: () => void
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

  setTecnica: (tecnica) => {
    get().reiniciar()
    set({ tecnica })
  },
  setMinutosFoco: (minutosFoco) => set({ minutosFoco, segundosRestantes: minutosFoco * 60 }),
  setMinutosDescanso: (minutosDescanso) => set({ minutosDescanso }),

  alternar: () => {
    const s = get()
    if (s.corriendo) {
      if (s.intervalId) clearInterval(s.intervalId)
      set({ corriendo: false, intervalId: null })
      return
    }
    const id = window.setInterval(() => {
      const cur = get()
      if (cur.tecnica === 'libre') {
        set({ segundosLibres: cur.segundosLibres + 1 })
        return
      }
      if (cur.segundosRestantes > 1) {
        set({ segundosRestantes: cur.segundosRestantes - 1 })
        return
      }
      beep()
      if (!cur.enDescanso) {
        toast.info('¡Descanso! Te lo ganaste.')
        set({
          enDescanso: true,
          segundosRestantes: cur.minutosDescanso * 60,
          focoMinutosAcumulados: cur.focoMinutosAcumulados + cur.minutosFoco,
        })
      } else {
        toast.info('Descanso terminado, volvamos.')
        set({ enDescanso: false, segundosRestantes: cur.minutosFoco * 60 })
      }
    }, 1000)
    set({ corriendo: true, intervalId: id })
  },

  reiniciar: () => {
    const id = get().intervalId
    if (id) clearInterval(id)
    const { minutosFoco } = get()
    set({
      corriendo: false,
      intervalId: null,
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
