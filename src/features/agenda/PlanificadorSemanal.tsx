import { useEffect, useState } from 'react'
import { addDays, addWeeks, format, isSameDay, isToday, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { Check, ChevronLeft, ChevronRight, Plus, Trash2, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, Label, NativeSelect, Textarea } from '@/components/ui/input'
import { FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { cn, fechaLocal } from '@/lib/utils'
import type { EventoAgenda, TipoEvento } from '@/types'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'

export interface TipoEventoConfig {
  label: string
  icon: LucideIcon
  color: string
}

export interface ColorDia {
  bg: string
  strong: string
  /** true si el fondo es oscuro y el texto necesita ser claro para tener contraste. */
  oscuro?: boolean
}

/** Un pastel vivo y distinto por día — para el planificador Principiante. */
export const DIA_COLOR_VIVO: ColorDia[] = [
  { bg: 'var(--color-dia-lun)', strong: 'var(--color-dia-lun-strong)' },
  { bg: 'var(--color-dia-mar)', strong: 'var(--color-dia-mar-strong)' },
  { bg: 'var(--color-dia-mie)', strong: 'var(--color-dia-mie-strong)' },
  { bg: 'var(--color-dia-jue)', strong: 'var(--color-dia-jue-strong)' },
  { bg: 'var(--color-dia-vie)', strong: 'var(--color-dia-vie-strong)' },
  { bg: 'var(--color-dia-sab)', strong: 'var(--color-dia-sab-strong)' },
  { bg: 'var(--color-dia-dom)', strong: 'var(--color-dia-dom-strong)' },
]

/** Una gama tonal de un solo color (claro a más intenso) — para Secundaria y Superior. */
export function gamaTonal(colorVar: string): ColorDia[] {
  return Array.from({ length: 7 }, (_, i) => {
    const porcentaje = 18 + i * 10
    return {
      bg: `color-mix(in srgb, ${colorVar} ${porcentaje}%, white)`,
      strong: colorVar,
      oscuro: porcentaje >= 48,
    }
  })
}

function diaISO(d: Date) {
  return format(d, 'yyyy-MM-dd')
}

type Hooks = {
  useEventos: () => UseQueryResult<EventoAgenda[]>
  useCrear: () => UseMutationResult<EventoAgenda, Error, Omit<EventoAgenda, 'id' | 'completado' | 'createdAt' | 'updatedAt'>>
  useActualizar: () => UseMutationResult<EventoAgenda, Error, { id: string } & Partial<EventoAgenda>>
  useEliminar: () => UseMutationResult<void, Error, string>
}

export function PlanificadorSemanal({
  titulo,
  subtitulo,
  tipos,
  colorPorDia,
  hooks,
}: {
  titulo: string
  subtitulo: string
  tipos: Partial<Record<TipoEvento, TipoEventoConfig>>
  colorPorDia: ColorDia[]
  hooks: Hooks
}) {
  const tipoKeys = Object.keys(tipos) as TipoEvento[]
  const { data: eventos = [] } = hooks.useEventos()
  const crear = hooks.useCrear()
  const actualizar = hooks.useActualizar()
  const eliminar = hooks.useEliminar()

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
        title={titulo}
        subtitle={subtitulo}
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
          const diaColor = colorPorDia[i]
          const oscuro = diaColor.oscuro
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
                  <p
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide"
                    style={{ color: oscuro ? 'rgba(255,255,255,0.95)' : diaColor.strong }}
                  >
                    {format(dia, 'EEEE', { locale: es })}
                    {hoy && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] text-white"
                        style={{ background: oscuro ? 'rgba(255,255,255,0.3)' : diaColor.strong }}
                      >
                        HOY
                      </span>
                    )}
                  </p>
                  <p className={cn('text-[15px] font-bold', oscuro && 'text-white')}>{format(dia, 'd MMM', { locale: es })}</p>
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
                  <p className={cn('mt-2 text-[11px]', oscuro ? 'text-white/70' : 'text-faint')}>Sin eventos</p>
                ) : (
                  eventosDia.map((e) => {
                    const tipo = tipos[e.tipo]
                    if (!tipo) return null
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
                        <button onClick={() => eliminar.mutate(e.id)} className="shrink-0" aria-label="Borrar evento">
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
        tipos={tipos}
        tipoKeys={tipoKeys}
        onClose={() => setNuevoAbierto(false)}
        onCrear={async (data) => {
          await crear.mutateAsync(data)
        }}
        onListo={(cantidad) => {
          toast.success(cantidad > 1 ? `${cantidad} eventos creados (uno por semana)` : 'Evento agregado')
          setNuevoAbierto(false)
        }}
      />
    </FadeIn>
  )
}

function DialogoNuevoEvento({
  open,
  fechaPrellenada,
  tipos,
  tipoKeys,
  onClose,
  onCrear,
  onListo,
}: {
  open: boolean
  fechaPrellenada?: string
  tipos: Partial<Record<TipoEvento, TipoEventoConfig>>
  tipoKeys: TipoEvento[]
  onClose: () => void
  onCrear: (data: Pick<EventoAgenda, 'tipo' | 'titulo' | 'fecha' | 'nota'>) => Promise<void>
  onListo: (cantidadCreada: number) => void
}) {
  const [tipo, setTipo] = useState<TipoEvento>(tipoKeys[0])
  const [titulo, setTitulo] = useState('')
  const [fecha, setFecha] = useState(fechaPrellenada ?? diaISO(new Date()))
  const [nota, setNota] = useState('')
  const [repetir, setRepetir] = useState(false)
  const [repetirHasta, setRepetirHasta] = useState('')

  // Radix solo llama a onOpenChange ante una acción del usuario (Esc, overlay,
  // botón de cerrar) — no cuando el padre reabre el diálogo de forma
  // programática (p. ej. el "+" de cada día). Por eso el reseteo va en un
  // efecto sobre `open`, no en el callback.
  useEffect(() => {
    if (!open) return
    setTipo(tipoKeys[0])
    setTitulo('')
    setFecha(fechaPrellenada ?? diaISO(new Date()))
    setNota('')
    setRepetir(false)
    setRepetirHasta('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, fechaPrellenada])

  async function guardar() {
    if (!titulo.trim() || !fecha) return
    if (repetir && repetirHasta && repetirHasta > fecha) {
      const fechas: string[] = []
      let cursor = fechaLocal(fecha)
      const limite = fechaLocal(repetirHasta)
      while (cursor <= limite) {
        fechas.push(diaISO(cursor))
        cursor = addWeeks(cursor, 1)
      }
      for (const f of fechas) {
        await onCrear({ tipo, titulo: titulo.trim(), fecha: f, nota: nota.trim() || undefined })
      }
      onListo(fechas.length)
    } else {
      await onCrear({ tipo, titulo: titulo.trim(), fecha, nota: nota.trim() || undefined })
      onListo(1)
    }
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
            <NativeSelect value={tipo} onChange={(e) => setTipo(e.target.value as TipoEvento)}>
              {tipoKeys.map((t) => (
                <option key={t} value={t}>
                  {tipos[t]!.label}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div>
            <Label>Título</Label>
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Entrega del TP de Historia" autoFocus />
          </div>
          <div>
            <Label>Fecha</Label>
            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={repetir} onChange={(e) => setRepetir(e.target.checked)} className="h-4 w-4" />
              Repetir todas las semanas
            </label>
            {repetir && (
              <div className="mt-2">
                <Label>¿Hasta cuándo?</Label>
                <Input type="date" value={repetirHasta} min={fecha} onChange={(e) => setRepetirHasta(e.target.value)} />
              </div>
            )}
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
