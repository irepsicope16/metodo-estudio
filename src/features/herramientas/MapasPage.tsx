import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Link2, Plus, Printer, Trash2, Workflow } from 'lucide-react'
import { useCrearMapa, useEliminarMapa, useGuardarMapa, useMapas } from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { IlustracionMapas } from '@/components/shared/IlustracionesHerramientas'
import { IntroHerramienta } from '@/components/shared/IntroHerramienta'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import type { MapaConceptual, NodoMapa } from '@/types'

const COLORES = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-secondary)', 'var(--color-mod-aprender)']

export default function MapasPage() {
  const { data: mapas = [] } = useMapas()
  const crear = useCrearMapa()
  const eliminar = useEliminarMapa()
  const [abiertoId, setAbiertoId] = useState<string | undefined>()

  const abierto = mapas.find((m) => m.id === abiertoId)

  if (abierto) {
    return <EditorMapa mapa={abierto} onVolver={() => setAbiertoId(undefined)} />
  }

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Mapas conceptuales"
        subtitle="Armá un lienzo con ideas conectadas — útil para organizar lo que leíste o repasar antes de una evaluación."
        actions={
          <Button
            onClick={async () => {
              const mapa = await crear.mutateAsync('Mapa sin título')
              setAbiertoId(mapa.id)
            }}
          >
            <Plus className="h-4 w-4" /> Nuevo mapa
          </Button>
        }
      />
      <IntroHerramienta
        clave="mapas"
        queEs="Un lienzo donde escribís ideas en burbujas y las conectás con líneas, para ver cómo se relacionan entre sí."
        comoSeHace={[
          'Tocá «Nuevo mapa» y ponele un título.',
          'Tocá «Nodo» para agregar una idea; arrastrala a donde quieras del lienzo.',
          'Tocá «Conectar nodos», elegí el primer nodo y después el segundo — quedan unidos con una línea.',
          'Repetí hasta armar todo el mapa. Podés imprimirlo desde el editor.',
        ]}
        ejemplo='Nodo central «Revolución de Mayo» conectado a «Causas», «Cabildo Abierto» y «Consecuencias».'
        ilustracion={<IlustracionMapas />}
      />
      {mapas.length === 0 ? (
        <EmptyState icon={Workflow} title="Todavía no creaste ningún mapa" description="Tocá «Nuevo mapa» para empezar." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mapas.map((m) => (
            <Card key={m.id} className="cursor-pointer transition-colors hover:bg-surface-2" onClick={() => setAbiertoId(m.id)}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="truncate text-[14px]">{m.titulo}</CardTitle>
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm(`¿Borrar "${m.titulo}"?`)) eliminar.mutate(m.id)
                    }}
                  >
                    <Trash2 className="text-danger" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-[12px] text-muted-foreground">
                {m.nodos.length} {m.nodos.length === 1 ? 'nodo' : 'nodos'} · {m.conexiones.length} {m.conexiones.length === 1 ? 'conexión' : 'conexiones'}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </FadeIn>
  )
}

function EditorMapa({ mapa, onVolver }: { mapa: MapaConceptual; onVolver: () => void }) {
  const guardar = useGuardarMapa()
  const [titulo, setTitulo] = useState(mapa.titulo)
  const [nodos, setNodos] = useState<NodoMapa[]>(mapa.nodos)
  const [conexiones, setConexiones] = useState(mapa.conexiones)
  const [modoConectar, setModoConectar] = useState(false)
  const [conectando, setConectando] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const draggingId = useRef<string | null>(null)

  function persistir(patch: Partial<MapaConceptual>) {
    guardar.mutate({ id: mapa.id, patch: { titulo, nodos, conexiones, ...patch } })
  }

  function agregarNodo() {
    const nuevo: NodoMapa = {
      id: crypto.randomUUID(),
      texto: 'Nueva idea',
      x: 40 + Math.random() * 200,
      y: 40 + Math.random() * 150,
      color: COLORES[nodos.length % COLORES.length],
    }
    const siguiente = [...nodos, nuevo]
    setNodos(siguiente)
    persistir({ nodos: siguiente })
  }

  function actualizarTexto(id: string, texto: string) {
    const siguiente = nodos.map((n) => (n.id === id ? { ...n, texto } : n))
    setNodos(siguiente)
  }

  function eliminarNodo(id: string) {
    const siguientesNodos = nodos.filter((n) => n.id !== id)
    const siguientesConexiones = conexiones.filter((c) => c.desdeId !== id && c.hastaId !== id)
    setNodos(siguientesNodos)
    setConexiones(siguientesConexiones)
    persistir({ nodos: siguientesNodos, conexiones: siguientesConexiones })
  }

  function clickNodo(id: string) {
    if (!modoConectar) return
    if (!conectando) {
      setConectando(id)
      return
    }
    if (conectando === id) {
      setConectando(null)
      return
    }
    const yaExiste = conexiones.some(
      (c) => (c.desdeId === conectando && c.hastaId === id) || (c.desdeId === id && c.hastaId === conectando),
    )
    const siguiente = yaExiste ? conexiones : [...conexiones, { id: crypto.randomUUID(), desdeId: conectando, hastaId: id }]
    setConexiones(siguiente)
    persistir({ conexiones: siguiente })
    setConectando(null)
    setModoConectar(false)
  }

  function onPointerDownNodo(e: React.PointerEvent, id: string) {
    e.stopPropagation()
    draggingId.current = id
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMoveCanvas(e: React.PointerEvent) {
    const id = draggingId.current
    if (!id || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width - 140, e.clientX - rect.left - 60))
    const y = Math.max(0, Math.min(rect.height - 60, e.clientY - rect.top - 20))
    setNodos((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)))
  }

  function onPointerUpCanvas() {
    if (draggingId.current) {
      draggingId.current = null
      setNodos((actuales) => {
        persistir({ nodos: actuales })
        return actuales
      })
    }
  }

  function nodoPorId(id: string) {
    return nodos.find((n) => n.id === id)
  }

  return (
    <FadeIn className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={onVolver}>
          ← Mis mapas
        </Button>
        <Input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onBlur={() => persistir({ titulo })}
          className="max-w-xs font-medium"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={modoConectar ? 'accent' : 'outline'}
            onClick={() => {
              setModoConectar((m) => !m)
              setConectando(null)
            }}
            disabled={nodos.length < 2}
          >
            <Link2 className="h-3.5 w-3.5" />
            {modoConectar ? (conectando ? 'Elegí el segundo nodo' : 'Tocá el primer nodo') : 'Conectar nodos'}
          </Button>
          <Button size="sm" onClick={agregarNodo}>
            <Plus className="h-3.5 w-3.5" /> Nodo
          </Button>
          {nodos.length > 0 && (
            <Button size="sm" variant="outline" asChild>
              <Link to={`/print/mapa/${mapa.id}`} target="_blank" rel="noopener">
                <Printer className="h-3.5 w-3.5" /> Imprimir
              </Link>
            </Button>
          )}
        </div>
      </div>

      <p className="text-[12px] text-faint">
        Arrastrá los nodos para moverlos. Para conectar dos ideas: "Conectar nodos" → tocá el primero → tocá el segundo.
      </p>

      <div
        ref={canvasRef}
        onPointerMove={onPointerMoveCanvas}
        onPointerUp={onPointerUpCanvas}
        className="relative h-[520px] w-full overflow-hidden rounded-xl border bg-surface-2 touch-none"
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {conexiones.map((c) => {
            const a = nodoPorId(c.desdeId)
            const b = nodoPorId(c.hastaId)
            if (!a || !b) return null
            return (
              <line
                key={c.id}
                x1={a.x + 60}
                y1={a.y + 20}
                x2={b.x + 60}
                y2={b.y + 20}
                stroke="var(--color-border-strong)"
                strokeWidth={2}
              />
            )
          })}
        </svg>
        {nodos.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <EmptyState icon={Workflow} title="Lienzo vacío" description="Tocá «Nodo» para agregar la primera idea." />
          </div>
        )}
        {nodos.map((n) => (
          <div
            key={n.id}
            onPointerDown={(e) => onPointerDownNodo(e, n.id)}
            onClick={() => clickNodo(n.id)}
            style={{ left: n.x, top: n.y, borderColor: n.color }}
            className={cn(
              'group absolute flex w-[120px] cursor-grab items-start gap-1 rounded-lg border-2 bg-surface p-2 shadow-sm active:cursor-grabbing',
              conectando === n.id && 'ring-2 ring-accent',
            )}
          >
            <input
              value={n.texto}
              onChange={(e) => actualizarTexto(n.id, e.target.value)}
              onBlur={() => persistir({ nodos })}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-full bg-transparent text-[12px] font-medium outline-none"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                eliminarNodo(n.id)
              }}
              className="shrink-0"
              aria-label="Borrar nodo"
            >
              <Trash2 className="h-3 w-3 text-danger" />
            </button>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          persistir({})
          toast.success('Mapa guardado')
        }}
      >
        Guardar
      </Button>
    </FadeIn>
  )
}
