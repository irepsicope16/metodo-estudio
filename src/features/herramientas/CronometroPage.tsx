import type { ReactNode } from 'react'
import { Pause, Play, RotateCcw, Timer as TimerIcon } from 'lucide-react'
import { useRegistrarSesionEstudio, useSesionesEstudio } from '@/hooks/queries'
import { useCronometroStore } from '@/stores/cronometroStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/input'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { fechaCorta } from '@/lib/utils'

const RADIO = 100
const CIRCUNFERENCIA = 2 * Math.PI * RADIO

/** Anillo circular que se va vaciando a medida que pasa el tiempo — muestra de un vistazo cuánto resta. */
function AnilloProgreso({
  fraccionRestante,
  color,
  colorFondo,
  children,
}: {
  fraccionRestante: number
  color: string
  colorFondo: string
  children: ReactNode
}) {
  const offset = CIRCUNFERENCIA * (1 - Math.min(1, Math.max(0, fraccionRestante)))
  return (
    <div className="relative h-[240px] w-[240px] shrink-0">
      <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
        <circle cx="110" cy="110" r={RADIO} fill="none" stroke={colorFondo} strokeWidth="16" />
        <circle
          cx="110"
          cy="110"
          r={RADIO}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={CIRCUNFERENCIA}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

export default function CronometroPage() {
  const { data: sesiones = [] } = useSesionesEstudio()
  const registrar = useRegistrarSesionEstudio()

  const tecnica = useCronometroStore((s) => s.tecnica)
  const minutosFoco = useCronometroStore((s) => s.minutosFoco)
  const minutosDescanso = useCronometroStore((s) => s.minutosDescanso)
  const enDescanso = useCronometroStore((s) => s.enDescanso)
  const segundosRestantes = useCronometroStore((s) => s.segundosRestantes)
  const segundosLibres = useCronometroStore((s) => s.segundosLibres)
  const corriendo = useCronometroStore((s) => s.corriendo)
  const setTecnica = useCronometroStore((s) => s.setTecnica)
  const setMinutosFoco = useCronometroStore((s) => s.setMinutosFoco)
  const setMinutosDescanso = useCronometroStore((s) => s.setMinutosDescanso)
  const alternar = useCronometroStore((s) => s.alternar)
  const reiniciar = useCronometroStore((s) => s.reiniciar)
  const duracionActual = useCronometroStore((s) => s.duracionActual)

  async function detenerYGuardar() {
    if (corriendo) alternar()
    const duracionMin = duracionActual()
    if (duracionMin < 1) {
      reiniciar()
      return
    }
    await registrar.mutateAsync({ tecnica, duracionMin, fecha: new Date().toISOString() })
    toast.success(`Sesión guardada: ${duracionMin} min`)
    reiniciar()
  }

  const mostrar = tecnica === 'libre' ? segundosLibres : segundosRestantes
  const mm = String(Math.floor(mostrar / 60)).padStart(2, '0')
  const ss = String(mostrar % 60).padStart(2, '0')

  const duracionFaseSegundos = (enDescanso ? minutosDescanso : minutosFoco) * 60
  const fraccionRestante = duracionFaseSegundos > 0 ? segundosRestantes / duracionFaseSegundos : 0
  const colorFase = enDescanso ? 'var(--color-mod-regular)' : 'var(--color-primary)'
  const colorFaseFondo = enDescanso ? 'var(--color-mod-regular-soft)' : 'var(--color-primary-soft)'

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Cronómetro de estudio"
        subtitle="Elegí una técnica y empezá — sigue corriendo aunque navegues a otra sección de la app."
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant={tecnica === 'pomodoro' ? 'default' : 'outline'} disabled={corriendo} onClick={() => setTecnica('pomodoro')}>
              Pomodoro
            </Button>
            <Button size="sm" variant={tecnica === 'libre' ? 'default' : 'outline'} disabled={corriendo} onClick={() => setTecnica('libre')}>
              Tiempo libre
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5 pt-0 pb-10">
          {tecnica === 'pomodoro' && !corriendo && (
            <div className="flex gap-4">
              <div>
                <Label>Minutos de foco</Label>
                <Input type="number" min={5} max={90} value={minutosFoco} onChange={(e) => setMinutosFoco(Number(e.target.value) || 25)} className="w-24" />
              </div>
              <div>
                <Label>Minutos de descanso</Label>
                <Input type="number" min={1} max={30} value={minutosDescanso} onChange={(e) => setMinutosDescanso(Number(e.target.value) || 5)} className="w-24" />
              </div>
            </div>
          )}

          {tecnica === 'pomodoro' ? (
            <AnilloProgreso fraccionRestante={fraccionRestante} color={colorFase} colorFondo={colorFaseFondo}>
              <p className="text-[13px] font-medium text-muted-foreground">{enDescanso ? 'Descanso' : 'Foco'}</p>
              <div className="font-display text-[52px] font-semibold tracking-tight tabular-nums">
                {mm}:{ss}
              </div>
              <p className="text-[11.5px] text-faint">de {enDescanso ? minutosDescanso : minutosFoco} min</p>
            </AnilloProgreso>
          ) : (
            <div className="font-display text-[72px] font-semibold tracking-tight tabular-nums">
              {mm}:{ss}
            </div>
          )}

          <div className="flex gap-2">
            <Button size="lg" onClick={alternar}>
              {corriendo ? <Pause /> : <Play />} {corriendo ? 'Pausar' : 'Empezar'}
            </Button>
            <Button size="lg" variant="outline" onClick={detenerYGuardar} disabled={mostrar === (tecnica === 'pomodoro' ? minutosFoco * 60 : 0) && segundosLibres === 0}>
              <RotateCcw /> Terminar y guardar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[14px]">Últimas sesiones</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {sesiones.length === 0 ? (
            <EmptyState icon={TimerIcon} title="Todavía no registraste ninguna" />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {sesiones.slice(0, 9).map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-[12.5px]">
                  <span className="capitalize">{s.tecnica}</span>
                  <span className="text-muted-foreground">{s.duracionMin} min · {fechaCorta(s.fecha)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  )
}
