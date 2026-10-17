import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Printer, Workflow } from 'lucide-react'
import { useMapa } from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared'
import { Isotipo } from '@/branding/Logo'

const NODO_W = 120
const NODO_H = 56
const PAD = 24
const ANCHO_MAX = 640

export default function PrintMapaPage() {
  const { id } = useParams<{ id: string }>()
  const { data: mapa, isLoading } = useMapa(id)

  if (isLoading) return null

  if (!mapa) {
    return (
      <div className="mx-auto min-h-screen max-w-2xl bg-surface px-6 py-8">
        <EmptyState icon={Workflow} title="No se encontró el mapa" />
      </div>
    )
  }

  const { nodos, conexiones, titulo } = mapa

  const minX = nodos.length ? Math.min(...nodos.map((n) => n.x)) : 0
  const minY = nodos.length ? Math.min(...nodos.map((n) => n.y)) : 0
  const maxX = nodos.length ? Math.max(...nodos.map((n) => n.x + NODO_W)) : ANCHO_MAX
  const maxY = nodos.length ? Math.max(...nodos.map((n) => n.y + NODO_H)) : 300

  const anchoReal = maxX - minX + PAD * 2
  const altoReal = maxY - minY + PAD * 2
  const escala = Math.min(1, ANCHO_MAX / anchoReal)

  function px(v: number, origen: number) {
    return (v - origen + PAD) * escala
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-surface px-6 py-8">
      <div className="no-print mb-6 flex items-center justify-between">
        <Link to="/herramientas/mapas" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver
        </Link>
        <Button size="sm" onClick={() => window.print()} disabled={nodos.length === 0}>
          <Printer className="h-4 w-4" /> Imprimir
        </Button>
      </div>

      <div className="print-page rounded-xl border bg-surface p-8">
        <div className="mb-6 flex items-center gap-2">
          <Isotipo size={26} />
          <span className="font-display text-[14px] font-semibold tracking-tight">
            Método <span className="text-accent">Estudio</span>
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold tracking-tight">{titulo}</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Mapa conceptual</p>

        {nodos.length === 0 ? (
          <EmptyState icon={Workflow} title="Este mapa todavía no tiene nodos" className="mt-6" />
        ) : (
          <div
            className="relative mt-6 rounded-lg border bg-surface-2"
            style={{ width: anchoReal * escala, height: altoReal * escala }}
          >
            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              {conexiones.map((c) => {
                const a = nodos.find((n) => n.id === c.desdeId)
                const b = nodos.find((n) => n.id === c.hastaId)
                if (!a || !b) return null
                return (
                  <line
                    key={c.id}
                    x1={px(a.x, minX) + 60 * escala}
                    y1={px(a.y, minY) + 20 * escala}
                    x2={px(b.x, minX) + 60 * escala}
                    y2={px(b.y, minY) + 20 * escala}
                    stroke="var(--color-border-strong)"
                    strokeWidth={2}
                  />
                )
              })}
            </svg>
            {nodos.map((n) => (
              <div
                key={n.id}
                style={{
                  left: px(n.x, minX),
                  top: px(n.y, minY),
                  width: NODO_W * escala,
                  borderColor: n.color,
                  fontSize: Math.max(9, 12 * escala),
                  padding: Math.max(4, 8 * escala),
                }}
                className="absolute rounded-lg border-2 bg-surface font-medium shadow-sm"
              >
                {n.texto}
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 border-t border-dashed pt-3 text-[11px] text-faint">
          Método Estudio · {nodos.length} {nodos.length === 1 ? 'nodo' : 'nodos'} · {conexiones.length}{' '}
          {conexiones.length === 1 ? 'conexión' : 'conexiones'}
        </p>
      </div>
    </div>
  )
}
