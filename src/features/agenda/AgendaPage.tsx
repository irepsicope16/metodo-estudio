import { useEffect, useState } from 'react'
import { addDays, addWeeks, format, isSameDay, isToday, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { Backpack, Cake, Check, ChevronLeft, ChevronRight, FileCheck2, Plus, StickyNote, Trash2, Users } from 'lucide-react'
import { useCrearEvento, useActualizarEvento, useEliminarEvento, useEventosAgenda } from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, Label, NativeSelect, Textarea } from '@/components/ui/input'
import { FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { cn, fechaLocal } from '@/lib/utils'
import type { EventoAgenda, TipoEvento } from '@/types'

/** Esta Agenda solo ofrece estos 5 tipos — los de los planificadores por nivel
 *  (tarea/tp/parcial/final) viven en `TipoEvento` pero no se usan acá. */
type TipoAgenda = Extract<TipoEvento, 'evaluacion' | 'extraescolar' | 'material' | 'cumpleanos' | 'nota'>

const TIPO_EVENTO: Record<TipoAgenda, { label: string; icon: typeof FileCheck2; color: string; soft: string }> = {
  evaluacion: { label: 'Evaluación', icon: FileCheck2, color: 'var(--color-danger)', soft: 'var(--color-danger-soft)' },
  extraescolar: { label: 'Extraescolar', icon: Users, color: 'var(--color-secondary)', soft: 'var(--color-secondary-soft)' },
  material: { label: 'Material', icon: Backpack, color: 'var(--color-mod-organizar)', soft: 'var(--color-mod-organizar-soft)' },
  cumpleanos: { label: 'Cumpleaños', icon: Cake, color: 'var(--color-mod-aprender)', soft: 'var(--color-mod-aprender-soft)' },
  nota: { label: 'Nota', icon: StickyNote, color: 'var(--color-primary)', soft: 'var(--color-primary-soft)' },
}

/** Un pastel propio por día (lunes a domingo), como en los planificadores de referencia. */
const DIA_COLOR = [
  { bg: 'var(--color-dia-lun)', strong: 'var(--color-dia-lun-strong)' },
  { bg: 'var(--color-dia-mar)', strong: 'var(--color-dia-mar-strong)' },
  { bg: 'var(--color-dia-mie)', strong: 'var(--color-dia-mie-strong)' },
  { bg: 'var(--color-dia-jue)', strong: 'var(--color-dia-jue-strong)' },
  { bg: 'var(--color-dia-vie)', strong: 'var(--color-dia-vie-strong)' },
  { bg: 'var(--color-dia-sab)', strong: 'var(--color-dia-sab-strong)' },
  { bg: 'var(--color-dia-dom)', strong: 'var(--color-dia-dom-strong)' },
]

function diaISO(d: Date) {
  return format(d, 'yyyy-MM-dd')
}

export default function AgendaPage() {
  const { data: eventos = [] } = useEventosAgenda()
  const crear = useCrearEvento()
  const actualizar = useActualizarEvento()
  const eliminar = useEliminarEvento()

  const [semanaBase, setSemanaBase] = useState(new Date())
  const [nuevoAbierto, setNuevoAbierto] = useState(false)
  const [fechaPrellenada, setFechaPrellenada] = useState<string | undefined>(undefined)

  const inicio = startOfWeek(semanaBase, { weekStartsOn: 1 })
  const dias = Array.from({ length: 7 }, (_, i) => addDays(inicio, i))
  const fin = dias[6]

  const pendientesSemana = eventos.filter((e) => !e.completado && dias.some((d) => isSameDay(d, fechaLocal(e.fecha)))).length

  function abrirNuevo(fecha?: Date) {
    setFechaPrellenada(fecha ? diaISO(fecha) : undefined)
    setNuevoAbierto(true)
  }

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Agenda"
        subtitle="Evaluaciones, actividades, materiales, cumpleaños y notas — todo en un solo lugar, semana por semana."
        actions={
          <Button onClick={() => abrirNuevo()}>
            <Plus className="h-4 w-4" /> Nuevo evento
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-surface px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="iconSm" onClick={() => setSemanaBase((s) => addWeeks(s, -1))} aria-label="Semana anterior">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[180px] text-center text-[13.5px] font-semibold">
            {format(inicio, "d 'de' MMM", { locale: es })} – {format(fin, "d 'de' MMM", { locale: es })}
          </span>
          <Button variant="outline" size="iconSm" onClick={() => setSemanaBase((s) => addWeeks(s, 1))} aria-label="Semana siguiente">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {pendientesSemana > 0 && (
            <span className="text-[12px] text-muted-foreground">
              {pendientesSemana} {pendientesSemana === 1 ? 'pendiente' : 'pendientes'} esta semana
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => setSemanaBase(new Date())}>
            Hoy
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {dias.map((dia, i) => {
          const eventosDia = eventos
            .filter((e) => isSameDay(fechaLocal(e.fecha), dia))
            .sort((a, b) => Number(a.completado) - Number(b.completado))
          const hoy = isToday(dia)
          const diaColor = DIA_COLOR[i]
          return (
            <div
              key={dia.toISOString()}
              className={cn('flex min-h-[160px] flex-col gap-2 rounded-xl border-2 p-3 shadow-sm', hoy && 'ring-2 ring-offset-2 ring-offset-background')}
              style={{
                background: diaColor.bg,
                borderColor: `color-mix(in srgb, ${diaColor.strong} 25%, transparent)`,
                ...(hoy ? ({ '--tw-ring-color': diaColor.strong } as React.CSSProperties) : {}),
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: diaColor.strong }}>
                    {format(dia, 'EEEE', { locale: es })}
                    {hoy && (
                      <span className="rounded-full px-1.5 py-0.5 text-[9px] text-white" style={{ background: diaColor.strong }}>
                        HOY
                      </span>
                    )}
                  </p>
                  <p className="text-[15px] font-bold">{format(dia, 'd MMM', { locale: es })}</p>
                </div>
                <button
                  onClick={() => abrirNuevo(dia)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/50 text-foreground/70 hover:bg-white hover:text-foreground"
                  aria-label="Agregar evento este día"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-1.5">
                {eventosDia.length === 0 ? (
                  <p className="mt-2 text-[11px] text-faint">Sin eventos</p>
                ) : (
                  eventosDia.map((e) => {
                    const tipo = TIPO_EVENTO[e.tipo as TipoAgenda]
                    const Icon = tipo.icon
                    return (
                      <div
                        key={e.id}
                        className="group flex items-start gap-1.5 rounded-lg border bg-surface/80 p-1.5 shadow-sm"
                        style={{ borderColor: `color-mix(in srgb, ${tipo.color} 35%, transparent)` }}
                      >
                        <button
                          onClick={() => actualizar.mutate({ id: e.id, completado: !e.completado })}
                          className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
                          style={{ borderColor: tipo.color, background: e.completado ? tipo.color : 'transparent' }}
                          aria-label={e.completado ? 'Marcar pendiente' : 'Marcar completado'}
                        >
                          {e.completado && <Check className="h-2.5 w-2.5 text-white" />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-1">
                            <Icon className="mt-0.5 h-3 w-3 shrink-0" style={{ color: tipo.color }} />
                            <p className={cn('break-words text-[11.5px] font-medium', e.completado && 'text-faint line-through')}>
                              {e.titulo}
                            </p>
                          </div>
                          {e.nota && <p className="break-words text-[10.5px] text-muted-foreground">{e.nota}</p>}
                        </div>
                        <button
                          onClick={() => eliminar.mutate(e.id)}
                          className="shrink-0 opacity-0 group-hover:opacity-100"
                          aria-label="Borrar evento"
                        >
                          <Trash2 className="h-3 w-3 text-danger" />
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      <DialogoNuevoEvento
        open={nuevoAbierto}
        fechaPrellenada={fechaPrellenada}
        onClose={() => setNuevoAbierto(false)}
        onCrear={async (data) => {
          await crear.mutateAsync(data)
          toast.success('Evento agregado')
          setNuevoAbierto(false)
        }}
      />
    </FadeIn>
  )
}

function DialogoNuevoEvento({
  open,
  fechaPrellenada,
  onClose,
  onCrear,
}: {
  open: boolean
  fechaPrellenada?: string
  onClose: () => void
  onCrear: (data: Pick<EventoAgenda, 'tipo' | 'titulo' | 'fecha' | 'nota'>) => Promise<void>
}) {
  const [tipo, setTipo] = useState<TipoAgenda>('evaluacion')
  const [titulo, setTitulo] = useState('')
  const [fecha, setFecha] = useState(fechaPrellenada ?? diaISO(new Date()))
  const [nota, setNota] = useState('')

  // Radix solo llama a onOpenChange ante una acción del usuario (Esc, overlay,
  // botón de cerrar) — no cuando el padre reabre el diálogo cambiando `open`
  // de forma programática (p. ej. el "+" de cada día). Por eso el reseteo va
  // en un efecto sobre `open`, no en el callback.
  useEffect(() => {
    if (!open) return
    setTipo('evaluacion')
    setTitulo('')
    setFecha(fechaPrellenada ?? diaISO(new Date()))
    setNota('')
  }, [open, fechaPrellenada])

  async function guardar() {
    if (!titulo.trim() || !fecha) return
    await onCrear({ tipo, titulo: titulo.trim(), fecha, nota: nota.trim() || undefined })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo evento</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Tipo</Label>
            <NativeSelect value={tipo} onChange={(e) => setTipo(e.target.value as TipoAgenda)}>
              {(Object.keys(TIPO_EVENTO) as TipoAgenda[]).map((t) => (
                <option key={t} value={t}>
                  {TIPO_EVENTO[t].label}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div>
            <Label>Título</Label>
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Prueba de Matemática" autoFocus />
          </div>
          <div>
            <Label>Fecha</Label>
            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div>
            <Label>Nota (opcional)</Label>
            <Textarea value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Algún detalle para no olvidar..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={!titulo.trim() || !fecha}>
              Crear evento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
