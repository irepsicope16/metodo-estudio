import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, Timer as TimerIcon } from 'lucide-react'
import { useRegistrarSesionEstudio, useSesionesEstudio } from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/input'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { fechaCorta } from '@/lib/utils'
import type { TecnicaCronometro } from '@/types'

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

export default function CronometroPage() {
  const { data: sesiones = [] } = useSesionesEstudio()
  const registrar = useRegistrarSesionEstudio()

  const [tecnica, setTecnica] = useState<TecnicaCronometro>('pomodoro')
  const [minutosFoco, setMinutosFoco] = useState(25)
  const [minutosDescanso, setMinutosDescanso] = useState(5)
  const [enDescanso, setEnDescanso] = useState(false)
  const [segundosRestantes, setSegundosRestantes] = useState(25 * 60)
  const [segundosLibres, setSegundosLibres] = useState(0)
  const [corriendo, setCorriendo] = useState(false)
  const focoMinutosAcumulados = useRef(0)

  useEffect(() => {
    if (!corriendo) return
    const id = setInterval(() => {
      if (tecnica === 'libre') {
        setSegundosLibres((s) => s + 1)
        return
      }
      setSegundosRestantes((s) => {
        if (s > 1) return s - 1
        beep()
        if (!enDescanso) {
          focoMinutosAcumulados.current += minutosFoco
          setEnDescanso(true)
          toast.info('¡Descanso! Te lo ganaste.')
          return minutosDescanso * 60
        }
        setEnDescanso(false)
        toast.info('Descanso terminado, volvamos.')
        return minutosFoco * 60
      })
    }, 1000)
    return () => clearInterval(id)
  }, [corriendo, tecnica, enDescanso, minutosFoco, minutosDescanso])

  function reiniciar() {
    setCorriendo(false)
    setEnDescanso(false)
    setSegundosRestantes(minutosFoco * 60)
    setSegundosLibres(0)
    focoMinutosAcumulados.current = 0
  }

  async function detenerYGuardar() {
    setCorriendo(false)
    const duracionMin = tecnica === 'libre' ? Math.round(segundosLibres / 60) : focoMinutosAcumulados.current + (enDescanso ? minutosFoco : 0)
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

  return (
    <FadeIn className="space-y-5">
      <PageHeader title="Cronómetro de estudio" subtitle="Elegí una técnica y empezá — el tiempo queda registrado en tu progreso." />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-1.5">
              <Button size="sm" variant={tecnica === 'pomodoro' ? 'default' : 'outline'} disabled={corriendo} onClick={() => { setTecnica('pomodoro'); reiniciar() }}>
                Pomodoro
              </Button>
              <Button size="sm" variant={tecnica === 'libre' ? 'default' : 'outline'} disabled={corriendo} onClick={() => { setTecnica('libre'); reiniciar() }}>
                Tiempo libre
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 pt-0 pb-10">
            {tecnica === 'pomodoro' && !corriendo && (
              <div className="flex gap-4">
                <div>
                  <Label>Minutos de foco</Label>
                  <Input type="number" min={5} max={90} value={minutosFoco} onChange={(e) => { setMinutosFoco(Number(e.target.value) || 25); setSegundosRestantes((Number(e.target.value) || 25) * 60) }} className="w-24" />
                </div>
                <div>
                  <Label>Minutos de descanso</Label>
                  <Input type="number" min={1} max={30} value={minutosDescanso} onChange={(e) => setMinutosDescanso(Number(e.target.value) || 5)} className="w-24" />
                </div>
              </div>
            )}

            {tecnica === 'pomodoro' && (
              <p className="text-[13px] font-medium text-muted-foreground">{enDescanso ? 'Descanso' : 'Foco'}</p>
            )}

            <div className="font-display text-[72px] font-semibold tracking-tight tabular-nums">
              {mm}:{ss}
            </div>

            <div className="flex gap-2">
              <Button size="lg" onClick={() => setCorriendo((c) => !c)}>
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
              <div className="space-y-2">
                {sesiones.slice(0, 8).map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-[12.5px]">
                    <span className="capitalize">{s.tecnica}</span>
                    <span className="text-muted-foreground">{s.duracionMin} min · {fechaCorta(s.fecha)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  )
}
