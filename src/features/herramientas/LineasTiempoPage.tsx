import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, History, Plus, Printer, Trash2 } from 'lucide-react'
import { useCrearLineaTiempo, useLineasTiempo, useActualizarLineaTiempo, useEliminarLineaTiempo } from '@/hooks/queries'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { IlustracionLineasTiempo } from '@/components/shared/IlustracionesHerramientas'
import { IntroHerramienta } from '@/components/shared/IntroHerramienta'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'
import type { LineaTiempoItem } from '@/types'

type Evento = { fecha: string; texto: string }

function lineaVacia(): { titulo: string; eventos: Evento[] } {
  return { titulo: '', eventos: [{ fecha: '', texto: '' }] }
}

function MiniLinea({ eventos }: { eventos: Evento[] }) {
  if (eventos.filter((e) => e.fecha.trim()).length < 2) return null
  return (
    <div className="relative mt-3 flex items-center justify-between">
      <div className="absolute left-0 right-0 h-0.5 rounded-full" style={{ background: 'var(--color-mod-regular)' }} />
      {eventos.map((e, i) => (
        <div key={i} className="relative z-10 flex flex-col items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full border-2" style={{ background: 'var(--surface)', borderColor: 'var(--color-mod-regular)' }} />
          <span className="max-w-[70px] truncate text-[10px] font-medium text-muted-foreground">{e.fecha || '—'}</span>
        </div>
      ))}
    </div>
  )
}

export default function LineasTiempoPage() {
  const { data: lineas = [] } = useLineasTiempo()
  const crear = useCrearLineaTiempo()
  const actualizar = useActualizarLineaTiempo()
  const eliminar = useEliminarLineaTiempo()

  const [editando, setEditando] = useState<string | 'nuevo' | null>(null)
  const [titulo, setTitulo] = useState('')
  const [eventos, setEventos] = useState<Evento[]>([])
  const [aEliminar, setAEliminar] = useState<LineaTiempoItem | null>(null)

  useEffect(() => {
    if (editando === 'nuevo') {
      const v = lineaVacia()
      setTitulo(v.titulo)
      setEventos(v.eventos)
    } else if (editando) {
      const l = lineas.find((x) => x.id === editando)
      if (l) {
        setTitulo(l.titulo)
        setEventos(l.eventos)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editando])

  function agregarEvento() {
    setEventos((e) => [...e, { fecha: '', texto: '' }])
  }
  function quitarEvento(i: number) {
    if (eventos.length <= 1) return
    setEventos((e) => e.filter((_, idx) => idx !== i))
  }
  function moverEvento(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= eventos.length) return
    setEventos((e) => {
      const copia = [...e]
      ;[copia[i], copia[j]] = [copia[j], copia[i]]
      return copia
    })
  }

  async function guardar() {
    const eventosValidos = eventos.filter((e) => e.fecha.trim() || e.texto.trim())
    if (!titulo.trim() || eventosValidos.length === 0) {
      toast.error('Completá el título y al menos un evento.')
      return
    }
    const data = { titulo: titulo.trim(), eventos: eventosValidos }
    if (editando === 'nuevo') {
      await crear.mutateAsync(data)
      toast.success('Línea de tiempo creada')
    } else if (editando) {
      await actualizar.mutateAsync({ id: editando, ...data })
      toast.success('Línea de tiempo guardada')
    }
    setEditando(null)
  }

  if (editando) {
    return (
      <FadeIn className="mx-auto max-w-xl space-y-5">
        <PageHeader title={editando === 'nuevo' ? 'Nueva línea de tiempo' : 'Editar línea de tiempo'} />
        <Input placeholder="Título (ej. Revolución de Mayo)" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

        <MiniLinea eventos={eventos} />

        <div className="space-y-2">
          {eventos.map((ev, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Input
                placeholder="Año o fecha"
                value={ev.fecha}
                onChange={(e) => setEventos((ar) => ar.map((x, idx) => (idx === i ? { ...x, fecha: e.target.value } : x)))}
                className="w-28 shrink-0"
              />
              <Input
                placeholder="Qué pasó"
                value={ev.texto}
                onChange={(e) => setEventos((ar) => ar.map((x, idx) => (idx === i ? { ...x, texto: e.target.value } : x)))}
                className="flex-1"
              />
              <button onClick={() => moverEvento(i, -1)} disabled={i === 0} aria-label="Subir" className="text-faint hover:text-foreground disabled:opacity-30">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => moverEvento(i, 1)} disabled={i === eventos.length - 1} aria-label="Bajar" className="text-faint hover:text-foreground disabled:opacity-30">
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              {eventos.length > 1 && (
                <button onClick={() => quitarEvento(i)} aria-label="Quitar evento" className="text-faint hover:text-danger">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={agregarEvento}>
          <Plus className="h-3.5 w-3.5" /> Agregar evento
        </Button>

        <div className="flex gap-2">
          <Button onClick={guardar}>Guardar</Button>
          <Button variant="ghost" onClick={() => setEditando(null)}>
            Cancelar
          </Button>
        </div>
      </FadeIn>
    )
  }

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Líneas de tiempo"
        subtitle="Ordená eventos en el tiempo para entender cuándo pasó cada cosa."
        actions={
          <Button onClick={() => setEditando('nuevo')}>
            <Plus className="h-4 w-4" /> Nueva línea de tiempo
          </Button>
        }
      />

      <IntroHerramienta
        clave="lineas-tiempo"
        queEs="Una línea donde ordenás eventos según cuándo pasaron, para visualizar la secuencia completa."
        comoSeHace={[
          'Tocá «Nueva línea de tiempo» y ponele un título.',
          'Por cada evento, escribí el año o fecha, y qué pasó.',
          'Usá las flechas para reordenarlos si hace falta.',
          'Guardá — la línea se arma sola arriba, en orden.',
        ]}
        ejemplo="«1810: Revolución de Mayo» → «1816: Declaración de la Independencia» → «1853: Constitución Nacional»."
        ilustracion={<IlustracionLineasTiempo />}
      />

      {lineas.length === 0 ? (
        <EmptyState icon={History} title="Todavía no hay líneas de tiempo" description="Creá la primera con «Nueva línea de tiempo»." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {lineas.map((l) => (
            <Card key={l.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-[14px]">{l.titulo}</CardTitle>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`#/print/linea-tiempo/${l.id}`} target="_blank" rel="noopener noreferrer">
                        <Printer className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setAEliminar(l)} aria-label="Eliminar">
                      <Trash2 className="h-3.5 w-3.5 text-danger" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="cursor-pointer pt-0" onClick={() => setEditando(l.id)}>
                <p className="text-[12px] text-muted-foreground">{l.eventos.length} eventos</p>
                <MiniLinea eventos={l.eventos.slice(0, 5)} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!aEliminar} onOpenChange={(open) => !open && setAEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar "{aEliminar?.titulo}"</DialogTitle>
            <DialogDescription>Esta acción no puede deshacerse.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAEliminar(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!aEliminar) return
                await eliminar.mutateAsync(aEliminar.id)
                setAEliminar(null)
                toast.success('Línea de tiempo eliminada')
              }}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </FadeIn>
  )
}
