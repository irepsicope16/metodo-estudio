import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookOpenCheck, Check, ClipboardCheck, Gamepad2, Plus, Printer, Trash2, X } from 'lucide-react'
import { useCrearFicha, useEliminarFicha, useFichas, useResponderFicha } from '@/hooks/queries'
import { estaParaHoy, etiquetaCaja } from '@/lib/leitner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, Label, NativeSelect, Textarea } from '@/components/ui/input'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

export default function FichasPage() {
  const { data: fichas = [] } = useFichas()
  const crear = useCrearFicha()
  const responder = useResponderFicha()
  const eliminar = useEliminarFicha()

  const [nuevaAbierta, setNuevaAbierta] = useState(false)
  const [temaFiltro, setTemaFiltro] = useState('todos')
  const [soloHoy, setSoloHoy] = useState(true)
  const [vueltas, setVueltas] = useState<Record<string, boolean>>({})
  const [params, setParams] = useSearchParams()
  const prefillTema = params.get('tema') ?? undefined
  const prefillPregunta = params.get('pregunta') ?? undefined

  useEffect(() => {
    if (prefillPregunta) {
      setNuevaAbierta(true)
      setParams({}, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const temas = useMemo(() => Array.from(new Set(fichas.map((f) => f.tema))).sort(), [fichas])
  const paraHoy = fichas.filter(estaParaHoy)
  const base = soloHoy ? paraHoy : fichas
  const visibles = base.filter((f) => temaFiltro === 'todos' || f.tema === temaFiltro)

  function responderFicha(f: (typeof fichas)[number], laSupo: boolean) {
    responder.mutate({ id: f.id, caja: f.caja, vecesRepasada: f.vecesRepasada, laSupo })
    setVueltas((v) => ({ ...v, [f.id]: false }))
  }

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Fichas de repaso"
        subtitle="Escribí tus propias tarjetas pregunta/respuesta. El sistema las reprograma solo: las que te cuestan vuelven antes."
        actions={
          <div className="flex items-center gap-2">
            {fichas.length > 0 && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/herramientas/evaluacion">
                    <ClipboardCheck className="h-4 w-4" /> Modo evaluación
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/herramientas/memotest">
                    <Gamepad2 className="h-4 w-4" /> Memotest
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to={temaFiltro === 'todos' ? '/print/fichas' : `/print/fichas?tema=${encodeURIComponent(temaFiltro)}`}>
                    <Printer className="h-4 w-4" /> Imprimir
                  </Link>
                </Button>
              </>
            )}
            <Button onClick={() => setNuevaAbierta(true)}>
              <Plus className="h-4 w-4" /> Nueva ficha
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant={soloHoy ? 'default' : 'outline'} onClick={() => setSoloHoy(true)}>
            Para hoy {paraHoy.length > 0 && `(${paraHoy.length})`}
          </Button>
          <Button size="sm" variant={!soloHoy ? 'default' : 'outline'} onClick={() => setSoloHoy(false)}>
            Todas ({fichas.length})
          </Button>
        </div>
        {temas.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant={temaFiltro === 'todos' ? 'default' : 'outline'} onClick={() => setTemaFiltro('todos')}>
              Todos los temas
            </Button>
            {temas.map((t) => (
              <Button key={t} size="sm" variant={temaFiltro === t ? 'default' : 'outline'} onClick={() => setTemaFiltro(t)}>
                {t}
              </Button>
            ))}
          </div>
        )}
      </div>

      {visibles.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title={fichas.length === 0 ? 'Todavía no hay fichas' : soloHoy ? '¡Nada para repasar hoy!' : 'No hay fichas con ese filtro'}
          description={fichas.length === 0 ? 'Creá la primera con «Nueva ficha».' : soloHoy ? 'Volvé mañana o mirá «Todas».' : undefined}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((f) => {
            const vuelta = !!vueltas[f.id]
            return (
              <Card key={f.id} className="group relative min-h-[150px]">
                <CardHeader className="pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-faint">{f.tema}</span>
                      <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {etiquetaCaja(f.caja)}
                      </span>
                    </div>
                    <button onClick={() => eliminar.mutate(f.id)} className="opacity-0 group-hover:opacity-100" aria-label="Borrar ficha">
                      <Trash2 className="h-3.5 w-3.5 text-danger" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent
                  className="cursor-pointer select-none pt-0"
                  onClick={() => setVueltas((v) => ({ ...v, [f.id]: !v[f.id] }))}
                >
                  <p className={cn('text-[13.5px]', vuelta ? 'text-muted-foreground' : 'font-medium')}>
                    {vuelta ? f.respuesta : f.pregunta}
                  </p>
                  <p className="mt-3 text-[11px] text-faint">{vuelta ? 'Respuesta' : 'Pregunta'} · tocá para dar vuelta</p>
                </CardContent>
                {vuelta && (
                  <div className="flex gap-2 border-t px-5 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        responderFicha(f, false)
                      }}
                    >
                      <X className="h-3.5 w-3.5 text-danger" /> No la sabía
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        responderFicha(f, true)
                      }}
                    >
                      <Check className="h-3.5 w-3.5" /> La sabía
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <DialogoNuevaFicha
        open={nuevaAbierta}
        onClose={() => setNuevaAbierta(false)}
        temasExistentes={temas}
        initialTema={prefillTema}
        initialPregunta={prefillPregunta}
        onCrear={async (data) => {
          await crear.mutateAsync(data)
          toast.success('Ficha creada')
          setNuevaAbierta(false)
        }}
      />
    </FadeIn>
  )
}

function DialogoNuevaFicha({
  open,
  onClose,
  temasExistentes,
  initialTema,
  initialPregunta,
  onCrear,
}: {
  open: boolean
  onClose: () => void
  temasExistentes: string[]
  initialTema?: string
  initialPregunta?: string
  onCrear: (data: { tema: string; pregunta: string; respuesta: string }) => Promise<void>
}) {
  const [tema, setTema] = useState('')
  const [temaNuevo, setTemaNuevo] = useState('')
  const [pregunta, setPregunta] = useState('')
  const [respuesta, setRespuesta] = useState('')

  useEffect(() => {
    if (!open) return
    if (initialTema) {
      if (temasExistentes.includes(initialTema)) {
        setTema(initialTema)
      } else {
        setTema('__nuevo__')
        setTemaNuevo(initialTema)
      }
    }
    if (initialPregunta) setPregunta(initialPregunta)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const temaFinal = tema === '__nuevo__' ? temaNuevo.trim() : tema

  async function guardar() {
    if (!temaFinal || !pregunta.trim() || !respuesta.trim()) return
    await onCrear({ tema: temaFinal, pregunta: pregunta.trim(), respuesta: respuesta.trim() })
    setPregunta('')
    setRespuesta('')
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva ficha</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Tema</Label>
            <NativeSelect value={tema} onChange={(e) => setTema(e.target.value)}>
              <option value="">Elegí o creá un tema</option>
              {temasExistentes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="__nuevo__">+ Tema nuevo</option>
            </NativeSelect>
            {tema === '__nuevo__' && (
              <Input className="mt-2" placeholder="Nombre del tema" value={temaNuevo} onChange={(e) => setTemaNuevo(e.target.value)} />
            )}
          </div>
          <div>
            <Label>Pregunta</Label>
            <Textarea value={pregunta} onChange={(e) => setPregunta(e.target.value)} />
          </div>
          <div>
            <Label>Respuesta</Label>
            <Textarea value={respuesta} onChange={(e) => setRespuesta(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={!temaFinal || !pregunta.trim() || !respuesta.trim()}>
              Crear ficha
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
