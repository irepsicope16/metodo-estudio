import { Pause, Play, RotateCcw, Timer as TimerIcon } from 'lucide-react'
import { useRegistrarSesionEstudio, useSesionesEstudio } from '@/hooks/queries'
import { useCronometroStore } from '@/stores/cronometroStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/input'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { fechaCorta } from '@/lib/utils'

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

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Cronómetro de estudio"
        subtitle="Elegí una técnica y empezá — sigue corriendo aunque navegues a otra sección de la app."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
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

            {tecnica === 'pomodoro' && (
              <p className="text-[13px] font-medium text-muted-foreground">{enDescanso ? 'Descanso' : 'Foco'}</p>
            )}

            <div className="font-display text-[72px] font-semibold tracking-tight tabular-nums">
              {mm}:{ss}
            </div>

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
