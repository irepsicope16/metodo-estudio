import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookOpenCheck, Check, ClipboardCheck, Copy, Gamepad2, Plus, Printer, Sparkles, Trash2, X } from 'lucide-react'
import { useCrearFicha, useCrearFichasEnLote, useEliminarFicha, useFichas, useResponderFicha } from '@/hooks/queries'
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
  const crearEnLote = useCrearFichasEnLote()
  const responder = useResponderFicha()
  const eliminar = useEliminarFicha()

  const [nuevaAbierta, setNuevaAbierta] = useState(false)
  const [iaAbierta, setIaAbierta] = useState(false)
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
            <Button variant="outline" onClick={() => setIaAbierta(true)}>
              <Sparkles className="h-4 w-4" /> Generar con IA
            </Button>
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
                    <button onClick={() => eliminar.mutate(f.id)} aria-label="Borrar ficha">
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

      <DialogoGenerarConIA
        open={iaAbierta}
        onClose={() => setIaAbierta(false)}
        temasExistentes={temas}
        onCrear={async (data) => {
          await crearEnLote.mutateAsync(data)
          toast.success(`${data.pares.length} fichas creadas`)
          setIaAbierta(false)
        }}
      />
    </FadeIn>
  )
}

const PROMPT_IA = `Actuá como asistente de estudio. Te voy a pegar un texto (apuntes, resumen o capítulo). Generá entre 8 y 15 fichas de repaso (pregunta y respuesta) que cubran los conceptos más importantes, en español, pensadas para estudiar con repetición espaciada.

Usá SOLO este formato exacto, una ficha debajo de la otra, dejando una línea en blanco entre cada una, sin numerarlas ni agregar ningún texto antes o después:

P: [pregunta corta y clara]
R: [respuesta breve y precisa]

Acá está el texto:
[PEGÁ ACÁ EL TEXTO QUE QUERÉS CONVERTIR EN FICHAS]`

function parsearFichasIA(texto: string): { pregunta: string; respuesta: string }[] {
  const bloques = texto.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  const resultado: { pregunta: string; respuesta: string }[] = []
  for (const bloque of bloques) {
    const match = bloque.match(/P:\s*([\s\S]*?)\n?R:\s*([\s\S]*)/i)
    if (match) {
      const pregunta = match[1].trim()
      const respuesta = match[2].trim()
      if (pregunta && respuesta) resultado.push({ pregunta, respuesta })
    }
  }
  return resultado
}

function DialogoGenerarConIA({
  open,
  onClose,
  temasExistentes,
  onCrear,
}: {
  open: boolean
  onClose: () => void
  temasExistentes: string[]
  onCrear: (data: { tema: string; pares: { pregunta: string; respuesta: string }[] }) => Promise<void>
}) {
  const [tema, setTema] = useState('')
  const [temaNuevo, setTemaNuevo] = useState('')
  const [resultadoIA, setResultadoIA] = useState('')

  const temaFinal = tema === '__nuevo__' ? temaNuevo.trim() : tema
  const pares = useMemo(() => parsearFichasIA(resultadoIA), [resultadoIA])

  function copiarPrompt() {
    navigator.clipboard.writeText(PROMPT_IA).then(() => toast.success('Prompt copiado'))
  }

  async function guardar() {
    if (!temaFinal || pares.length === 0) return
    await onCrear({ tema: temaFinal, pares })
    setResultadoIA('')
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Generar fichas con IA</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2 rounded-lg border bg-surface-2 p-3">
            <p className="text-[12.5px] text-muted-foreground">
              1. Copiá este prompt y pegalo en una IA gratuita (ChatGPT, Gemini, etc.), seguido del texto que querés
              convertir en fichas — pegá el texto, no subas el PDF, así funciona en cualquiera.
            </p>
            <Textarea value={PROMPT_IA} readOnly rows={6} className="font-mono text-[11px]" />
            <Button variant="outline" size="sm" onClick={copiarPrompt}>
              <Copy className="h-3.5 w-3.5" /> Copiar prompt
            </Button>
          </div>

          <div className="space-y-2">
            <Label>2. Pegá acá el resultado que te dio la IA</Label>
            <Textarea
              value={resultadoIA}
              onChange={(e) => setResultadoIA(e.target.value)}
              rows={6}
              placeholder={'P: ¿Qué es...?\nR: Es...\n\nP: ¿Para qué sirve...?\nR: Sirve para...'}
            />
            <p className="text-[11.5px] text-faint">
              {pares.length === 0 ? 'Todavía no detecté ninguna ficha con ese formato.' : `Detecté ${pares.length} ficha${pares.length === 1 ? '' : 's'}.`}
            </p>
          </div>

          <div>
            <Label>Tema para estas fichas</Label>
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

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={!temaFinal || pares.length === 0}>
              Crear {pares.length > 0 ? `${pares.length} fichas` : 'fichas'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
