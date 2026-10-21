import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Circle, Lightbulb, ListChecks, PenLine, Star, Timer, Trash2 } from 'lucide-react'
import {
  useActividadesProbadas,
  useActualizarActividad,
  useEliminarActividadProbada,
  useProbarActividad,
} from '@/hooks/queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label, Textarea } from '@/components/ui/input'
import { AvisoOrientativo, EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { fechaCorta } from '@/lib/utils'
import { moduleCardStyle, RUTA_COLOR } from '@/lib/moduleColors'
import { RUTAS } from '@/data/rutas'
import { ACTIVIDADES } from '@/data/actividades'
import type { ActividadCatalogo, ActividadProbada, NivelActividad } from '@/types'

const NIVEL_LABEL: Record<NivelActividad, string> = { 1: 'Principiante', 2: 'Medio', 3: 'Superior' }
const NIVEL_BADGE_VARIANT: Record<NivelActividad, 'default' | 'primario' | 'acento'> = { 1: 'default', 2: 'primario', 3: 'acento' }

type FiltroNivel = 'todos' | NivelActividad

export default function ActividadesPage() {
  const { data: probadas = [] } = useActividadesProbadas()
  const probar = useProbarActividad()
  const actualizar = useActualizarActividad()
  const [filtro, setFiltro] = useState<FiltroNivel>('todos')
  const [calificando, setCalificando] = useState<ActividadProbada | null>(null)
  const [detalle, setDetalle] = useState<ActividadCatalogo | null>(null)
  const [searchParams] = useSearchParams()
  const rutaDestacada = searchParams.get('ruta')
  const seccionesRef = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    if (!rutaDestacada) return
    const el = seccionesRef.current[rutaDestacada]
    if (el) {
      const id = window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
      return () => window.clearTimeout(id)
    }
  }, [rutaDestacada])

  function probadaDe(actividadId: string): ActividadProbada | undefined {
    const deEsta = probadas.filter((p) => p.actividadId === actividadId)
    return deEsta.find((p) => p.estado !== 'completada') ?? [...deEsta].sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio))[0]
  }

  async function probarActividad(actividad: ActividadCatalogo) {
    await probar.mutateAsync(actividad)
    toast.success(`Empezaste «${actividad.titulo}»`)
  }

  async function marcarTilde(actividad: ActividadCatalogo, probadaActual?: ActividadProbada) {
    if (!probadaActual) {
      const nueva = await probar.mutateAsync(actividad)
      await actualizar.mutateAsync({ id: nueva.id, estado: 'completada', fechaCompletada: new Date().toISOString() })
      toast.success(`«${actividad.titulo}» completada ✓`)
      return
    }
    if (probadaActual.estado === 'completada') {
      await actualizar.mutateAsync({ id: probadaActual.id, estado: 'en_curso', fechaCompletada: undefined })
    } else {
      await actualizar.mutateAsync({ id: probadaActual.id, estado: 'completada', fechaCompletada: new Date().toISOString() })
      toast.success(`«${actividad.titulo}» completada ✓`)
    }
  }

  return (
    <FadeIn className="space-y-5">
      <PageHeader title="Actividades" subtitle="Elegí qué probar y marcá tu progreso — así armás tu propio ranking de qué te funciona." />
      <AvisoOrientativo>
        No hay una técnica mejor que otra en abstracto — probá, calificá cómo te fue y quedate con lo que te sirve.
      </AvisoOrientativo>

      <MisActividades probadas={probadas} onAbrir={setDetalle} />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Catálogo</CardTitle>
            <div className="flex flex-wrap gap-1.5">
              {(['todos', 1, 2, 3] as FiltroNivel[]).map((n) => (
                <Button key={n} size="sm" variant={filtro === n ? 'default' : 'outline'} onClick={() => setFiltro(n)}>
                  {n === 'todos' ? 'Todos los niveles' : NIVEL_LABEL[n]}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          {RUTAS.map((ruta) => {
            const fichas = ACTIVIDADES.filter((a) => a.rutaId === ruta.id && (filtro === 'todos' || a.nivel === filtro))
            if (fichas.length === 0) return null
            const destacada = rutaDestacada === ruta.id
            return (
              <section
                key={ruta.id}
                id={`ruta-${ruta.id}`}
                ref={(el) => {
                  seccionesRef.current[ruta.id] = el
                }}
                className={destacada ? 'scroll-mt-4 rounded-xl p-2 ring-2 ring-accent ring-offset-4 ring-offset-background' : 'scroll-mt-4'}
              >
                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                  <h3 className="text-[13.5px] font-semibold tracking-tight">{ruta.nombre}</h3>
                  {destacada && <Badge variant="acento">Recomendada para vos</Badge>}
                </div>
                <div className="grid gap-2.5 lg:grid-cols-2">
                  {fichas.map((actividad) => {
                    const probadaActual = probadaDe(actividad.id)
                    const completada = probadaActual?.estado === 'completada'
                    const Icon = actividad.nivel === 1 ? actividad.icon : undefined
                    return (
                      <div
                        key={actividad.id}
                        className="rounded-xl border border-t-[3px] p-3.5 transition-transform hover:-translate-y-0.5 hover:shadow-md"
                        style={moduleCardStyle(ruta.id)}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <button onClick={() => setDetalle(actividad)} className="flex min-w-0 flex-1 items-start gap-2.5 text-left">
                            {Icon && (
                              <span
                                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                                style={{ background: RUTA_COLOR[ruta.id]?.color }}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="text-[13.5px] font-medium">{actividad.titulo}</p>
                              <p className="mt-1 text-[12.5px] text-muted-foreground">{actividad.descripcion}</p>
                            </div>
                          </button>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <button
                              onClick={() => marcarTilde(actividad, probadaActual)}
                              aria-label={completada ? 'Marcar como no completada' : 'Marcar como completada'}
                              title={completada ? 'Marcar como no completada' : 'Marcar como completada'}
                            >
                              {completada ? (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                              ) : (
                                <Circle className="h-5 w-5 text-faint hover:text-primary" />
                              )}
                            </button>
                            <Badge variant={NIVEL_BADGE_VARIANT[actividad.nivel]}>{NIVEL_LABEL[actividad.nivel]}</Badge>
                          </div>
                        </div>
                        {probadaActual && !completada && (
                          <div className="mt-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[10.5px] font-medium text-primary">
                              En curso
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </CardContent>
      </Card>

      <DetalleActividad
        actividad={detalle}
        probada={detalle ? probadaDe(detalle.id) : undefined}
        onClose={() => setDetalle(null)}
        onProbar={probarActividad}
        onCalificar={(p) => {
          setDetalle(null)
          setCalificando(p)
        }}
      />

      <DialogoCalificar actividad={calificando} onClose={() => setCalificando(null)} />
    </FadeIn>
  )
}

function DetalleActividad({
  actividad,
  probada,
  onClose,
  onProbar,
  onCalificar,
}: {
  actividad: ActividadCatalogo | null
  probada?: ActividadProbada
  onClose: () => void
  onProbar: (a: ActividadCatalogo) => void
  onCalificar: (p: ActividadProbada) => void
}) {
  const [respuestaRevelada, setRespuestaRevelada] = useState(false)

  useEffect(() => {
    setRespuestaRevelada(probada?.estado === 'completada')
  }, [actividad?.id, probada?.estado])

  if (!actividad) return null

  const hayEjemplo = !!actividad.ejemplo
  const mostrarEjemplo = respuestaRevelada || !hayEjemplo

  return (
    <Dialog open={!!actividad} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{actividad.titulo}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={NIVEL_BADGE_VARIANT[actividad.nivel]}>{NIVEL_LABEL[actividad.nivel]}</Badge>
            {probada?.estado === 'completada' && <Badge variant="primario">Completada ✓</Badge>}
          </div>
          <p className="text-[13.5px] leading-relaxed text-muted-foreground">{actividad.descripcion}</p>

          {actividad.ejercicio && (
            <div className="rounded-lg border border-accent/30 bg-accent-soft/40 p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent-strong">
                <PenLine className="h-3.5 w-3.5" /> Ejercicio para practicar
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed">{actividad.ejercicio}</p>
              {!mostrarEjemplo && <p className="mt-2 text-[11.5px] text-faint">Pensalo o hacelo en voz alta — después revisá tu respuesta.</p>}
            </div>
          )}

          {!mostrarEjemplo ? (
            <Button variant="outline" size="sm" className="w-fit" onClick={() => setRespuestaRevelada(true)}>
              Revisá tu respuesta
            </Button>
          ) : (
            actividad.ejemplo && (
              <div className="rounded-lg border bg-surface-2 p-3.5">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  <Lightbulb className="h-3.5 w-3.5" /> Ejemplo
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed">{actividad.ejemplo}</p>
              </div>
            )
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3.5">
            <Button variant="outline" size="sm" asChild>
              <a href="#/herramientas/cronometro">
                <Timer className="h-3.5 w-3.5" /> Empezar con Pomodoro
              </a>
            </Button>
            {!probada || probada.estado === 'completada' ? (
              <Button size="sm" onClick={() => onProbar(actividad)}>
                {probada ? 'Probarla de nuevo' : 'Empezar a probarla'}
              </Button>
            ) : (
              <Button size="sm" onClick={() => onCalificar(probada)}>
                Marcar como completada
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MisActividades({
  probadas,
  onAbrir,
}: {
  probadas: ActividadProbada[]
  onAbrir: (a: ActividadCatalogo) => void
}) {
  const actualizar = useActualizarActividad()
  const eliminar = useEliminarActividadProbada()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis actividades</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {probadas.length === 0 ? (
          <EmptyState icon={ListChecks} title="Todavía no probaste ninguna" description="Elegí una del catálogo, más abajo." />
        ) : (
          <div className="space-y-2">
            {probadas.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-xl border border-l-[3px] bg-surface p-3.5"
                style={{ borderLeftColor: RUTA_COLOR[a.rutaId]?.color }}
              >
                <button
                  onClick={() =>
                    actualizar.mutate(
                      a.estado === 'completada'
                        ? { id: a.id, estado: 'en_curso', fechaCompletada: undefined }
                        : { id: a.id, estado: 'completada', fechaCompletada: new Date().toISOString() },
                    )
                  }
                  aria-label={a.estado === 'completada' ? 'Marcar en curso' : 'Marcar completada'}
                >
                  {a.estado === 'completada' ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-faint" />
                  )}
                </button>
                <button className="min-w-0 flex-1 text-left" onClick={() => { const cat = ACTIVIDADES.find((c) => c.id === a.actividadId); if (cat) onAbrir(cat) }}>
                  <p className={`text-[13.5px] font-medium ${a.estado === 'completada' ? 'text-faint line-through' : ''}`}>{a.titulo}</p>
                  <p className="text-[11.5px] text-faint">
                    Empezada {fechaCorta(a.fechaInicio)}
                    {a.calificacion && (
                      <span className="ml-1.5 inline-flex items-center gap-0.5 text-warning">
                        {Array.from({ length: a.calificacion }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </span>
                    )}
                  </p>
                  {a.aplicacionPropia && <p className="mt-0.5 text-[11.5px] text-primary">Tu aplicación: {a.aplicacionPropia}</p>}
                  {a.nota && <p className="mt-0.5 text-[11.5px] text-muted-foreground">{a.nota}</p>}
                </button>
                <Button variant="ghost" size="iconSm" onClick={() => eliminar.mutate(a.id)} aria-label="Quitar">
                  <Trash2 className="text-danger" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DialogoCalificar({ actividad, onClose }: { actividad: ActividadProbada | null; onClose: () => void }) {
  const actualizar = useActualizarActividad()
  const navigate = useNavigate()
  const [calificacion, setCalificacion] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [nota, setNota] = useState('')
  const [guardada, setGuardada] = useState<ActividadProbada | null>(null)

  useEffect(() => {
    if (actividad) {
      setCalificacion(3)
      setNota('')
      setGuardada(null)
    }
  }, [actividad])

  async function guardar() {
    if (!actividad) return
    await actualizar.mutateAsync({
      id: actividad.id,
      estado: 'completada',
      fechaCompletada: new Date().toISOString(),
      calificacion,
      nota: nota.trim() || undefined,
    })
    toast.success('¡Completada! Quedó guardada en tu progreso.')
    setGuardada(actividad)
  }

  function cerrarTodo() {
    setGuardada(null)
    onClose()
  }

  if (guardada) {
    const ruta = RUTAS.find((r) => r.id === guardada.rutaId)
    return (
      <Dialog open onOpenChange={(o) => !o && cerrarTodo()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Creamos una ficha de repaso sobre esto?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-[13px] text-muted-foreground">
              Así la tenés lista para repasar más adelante con «{guardada.titulo}».
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={cerrarTodo}>
                No, gracias
              </Button>
              <Button
                onClick={() => {
                  cerrarTodo()
                  navigate(
                    `/herramientas/fichas?tema=${encodeURIComponent(ruta?.nombre ?? 'General')}&pregunta=${encodeURIComponent(`¿Qué aprendí con "${guardada.titulo}"?`)}`,
                  )
                }}
              >
                Sí, crear ficha
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={!!actividad} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Cómo te fue con «{actividad?.titulo}»?</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex gap-1.5">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button key={n} onClick={() => setCalificacion(n)} aria-label={`${n} estrellas`}>
                <Star className={`h-6 w-6 ${n <= calificacion ? 'fill-warning text-warning' : 'text-faint'}`} />
              </button>
            ))}
          </div>
          <Textarea placeholder="¿Qué te funcionó o no te funcionó? (opcional)" value={nota} onChange={(e) => setNota(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={actualizar.isPending}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
