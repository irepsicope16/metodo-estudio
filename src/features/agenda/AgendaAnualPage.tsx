import { useState } from 'react'
import {
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { Backpack, Cake, Check, FileCheck2, Plus, StickyNote, Trash2, Users, type LucideIcon } from 'lucide-react'
import { useActualizarEvento, useCrearEvento, useEliminarEvento, useEventosAgenda } from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Label, NativeSelect } from '@/components/ui/input'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { cn, fechaLocal } from '@/lib/utils'
import type { EventoAgenda, TipoEvento } from '@/types'

type TipoAgenda = Extract<TipoEvento, 'evaluacion' | 'extraescolar' | 'material' | 'cumpleanos' | 'nota'>

const TIPO_EVENTO: Record<TipoAgenda, { label: string; icon: LucideIcon; color: string }> = {
  evaluacion: { label: 'Evaluación', icon: FileCheck2, color: 'var(--color-danger)' },
  extraescolar: { label: 'Extraescolar', icon: Users, color: 'var(--color-secondary)' },
  material: { label: 'Material', icon: Backpack, color: 'var(--color-mod-organizar)' },
  cumpleanos: { label: 'Cumpleaños', icon: Cake, color: 'var(--color-mod-aprender)' },
  nota: { label: 'Nota', icon: StickyNote, color: 'var(--color-primary)' },
}

const MESES_ABBR = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function diasDelMes(mes: Date) {
  const inicioGrilla = startOfWeek(startOfMonth(mes), { weekStartsOn: 1 })
  const finGrilla = endOfWeek(endOfMonth(mes), { weekStartsOn: 1 })
  return eachDayOfInterval({ start: inicioGrilla, end: finGrilla })
}

function diaISO(d: Date) {
  return format(d, 'yyyy-MM-dd')
}

export default function AgendaAnualPage() {
  const { data: eventos = [] } = useEventosAgenda()
  const crear = useCrearEvento()
  const actualizar = useActualizarEvento()
  const eliminar = useEliminarEvento()

  const [anioBase, setAnioBase] = useState(new Date())
  const [diaSeleccionado, setDiaSeleccionado] = useState<Date | null>(null)

  const meses = Array.from({ length: 12 }, (_, i) => new Date(anioBase.getFullYear(), i, 1))

  const eventosDelDia = diaSeleccionado ? eventos.filter((e) => isSameDay(fechaLocal(e.fecha), diaSeleccionado)) : []

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Agenda anual"
        subtitle="Los mismos eventos de tu Agenda semanal, vistos mes por mes — ideal para cumpleaños y fechas que ya sabés de antemano."
      />

      <div className="flex items-center justify-center gap-3 rounded-xl border bg-surface px-4 py-3">
        <Button variant="outline" size="sm" onClick={() => setAnioBase((a) => addYears(a, -1))}>
          ← {anioBase.getFullYear() - 1}
        </Button>
        <span className="text-[16px] font-bold">{anioBase.getFullYear()}</span>
        <Button variant="outline" size="sm" onClick={() => setAnioBase((a) => addYears(a, 1))}>
          {anioBase.getFullYear() + 1} →
        </Button>
        {anioBase.getFullYear() !== new Date().getFullYear() && (
          <Button variant="ghost" size="sm" onClick={() => setAnioBase(new Date())}>
            Volver a hoy
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {meses.map((mes) => (
          <MiniCalendario
            key={mes.toISOString()}
            mes={mes}
            eventos={eventos}
            diaSeleccionado={diaSeleccionado}
            onSeleccionar={setDiaSeleccionado}
          />
        ))}
      </div>

      {diaSeleccionado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-[15px]">
              <span>{format(diaSeleccionado, "EEEE d 'de' MMMM", { locale: es })}</span>
              <Button variant="ghost" size="sm" onClick={() => setDiaSeleccionado(null)}>
                Cerrar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {eventosDelDia.length === 0 ? (
              <EmptyState icon={StickyNote} title="Nada agendado este día" />
            ) : (
              <div className="space-y-2">
                {eventosDelDia.map((e) => {
                  const tipo = TIPO_EVENTO[e.tipo as TipoAgenda]
                  const Icon = tipo.icon
                  return (
                    <div key={e.id} className="group flex items-center gap-2 rounded-lg border bg-surface-2 px-3 py-2">
                      <button
                        onClick={() => actualizar.mutate({ id: e.id, completado: !e.completado })}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                        style={{ borderColor: tipo.color, background: e.completado ? tipo.color : 'transparent' }}
                        aria-label={e.completado ? 'Marcar pendiente' : 'Marcar completado'}
                      >
                        {e.completado && <Check className="h-3 w-3 text-white" />}
                      </button>
                      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: tipo.color }} />
                      <span className={cn('flex-1 text-[13px] font-medium', e.completado && 'text-faint line-through')}>{e.titulo}</span>
                      <button onClick={() => eliminar.mutate(e.id)} aria-label="Borrar evento">
                        <Trash2 className="h-3.5 w-3.5 text-danger" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <NuevoEventoInline fecha={diaSeleccionado} onCrear={(data) => crear.mutateAsync(data).then(() => toast.success('Evento agregado'))} />
          </CardContent>
        </Card>
      )}
    </FadeIn>
  )
}

function MiniCalendario({
  mes,
  eventos,
  diaSeleccionado,
  onSeleccionar,
}: {
  mes: Date
  eventos: EventoAgenda[]
  diaSeleccionado: Date | null
  onSeleccionar: (d: Date) => void
}) {
  const dias = diasDelMes(mes)
  return (
    <div className="rounded-xl border bg-surface p-3">
      <p className="mb-2 text-center text-[13px] font-bold capitalize">
        {MESES_ABBR[mes.getMonth()]} · {mes.getFullYear()}
      </p>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] font-semibold uppercase text-faint">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-0.5">
        {dias.map((dia) => {
          const enEsteMes = isSameMonth(dia, mes)
          const eventosDia = eventos.filter((e) => isSameDay(fechaLocal(e.fecha), dia))
          const hoy = isToday(dia)
          const seleccionado = diaSeleccionado && isSameDay(dia, diaSeleccionado)
          return (
            <button
              key={dia.toISOString()}
              onClick={() => onSeleccionar(dia)}
              disabled={!enEsteMes}
              className={cn(
                'relative flex h-7 flex-col items-center justify-center rounded-md text-[10.5px]',
                !enEsteMes && 'invisible',
                enEsteMes && !seleccionado && !hoy && 'hover:bg-surface-2',
                hoy && !seleccionado && 'bg-accent-soft font-bold text-accent-strong',
                seleccionado && 'bg-accent font-bold text-accent-foreground',
              )}
            >
              {dia.getDate()}
              {eventosDia.length > 0 && (
                <span className="absolute bottom-0.5 flex gap-0.5">
                  {eventosDia.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className="h-1 w-1 rounded-full"
                      style={{ background: seleccionado ? 'white' : TIPO_EVENTO[e.tipo as TipoAgenda].color, opacity: e.completado ? 0.4 : 1 }}
                    />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function NuevoEventoInline({
  fecha,
  onCrear,
}: {
  fecha: Date
  onCrear: (data: Pick<EventoAgenda, 'tipo' | 'titulo' | 'fecha' | 'nota'>) => Promise<unknown>
}) {
  const [tipo, setTipo] = useState<TipoAgenda>('evaluacion')
  const [titulo, setTitulo] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function guardar() {
    if (!titulo.trim()) return
    setGuardando(true)
    try {
      await onCrear({ tipo, titulo: titulo.trim(), fecha: diaISO(fecha) })
      setTitulo('')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-2 border-t pt-3">
      <div className="min-w-[140px]">
        <Label>Tipo</Label>
        <NativeSelect value={tipo} onChange={(e) => setTipo(e.target.value as TipoAgenda)}>
          {(Object.keys(TIPO_EVENTO) as TipoAgenda[]).map((t) => (
            <option key={t} value={t}>
              {TIPO_EVENTO[t].label}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div className="flex-1">
        <Label>Título</Label>
        <Input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Agregar algo este día..."
          onKeyDown={(e) => e.key === 'Enter' && guardar()}
        />
      </div>
      <Button onClick={guardar} disabled={!titulo.trim() || guardando}>
        <Plus className="h-4 w-4" /> Agregar
      </Button>
    </div>
  )
}
