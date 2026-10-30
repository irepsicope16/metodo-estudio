import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookOpen, Clapperboard, ExternalLink, Printer, Sparkles } from 'lucide-react'
import { FadeIn, PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RUTAS } from '@/data/rutas'
import { FICHAS_POR_RUTA, type NivelHerramienta } from '@/data/biblioteca'
import { DIMENSIONES } from '@/data/items'
import { VIDEOS } from '@/data/videos'
import { TECNICAS_VISUALES } from '@/data/tecnicasVisuales'
import { moduleCardStyle, RUTA_COLOR } from '@/lib/moduleColors'
import { VistaPreviaTecnica } from './VistaPreviaTecnica'

const COLOR_CICLO = [
  { color: 'var(--color-mod-organizar)', soft: 'var(--color-mod-organizar-soft)' },
  { color: 'var(--color-mod-atencion)', soft: 'var(--color-mod-atencion-soft)' },
  { color: 'var(--color-secondary)', soft: 'var(--color-secondary-soft)' },
  { color: 'var(--color-mod-escribir)', soft: 'var(--color-mod-escribir-soft)' },
  { color: 'var(--color-mod-aprender)', soft: 'var(--color-mod-aprender-soft)' },
  { color: 'var(--color-mod-regular)', soft: 'var(--color-mod-regular-soft)' },
] as const

const NIVEL_LABEL: Record<NivelHerramienta, string> = {
  1: 'Principiante',
  2: 'Medio',
  3: 'Superior',
}

const NIVEL_BADGE_VARIANT: Record<NivelHerramienta, 'celeste' | 'primario' | 'acento'> = {
  1: 'celeste',
  2: 'primario',
  3: 'acento',
}

const NIVEL_ORDEN: NivelHerramienta[] = [1, 2, 3]

/** Mismos colores que las fichas (celeste/azul/rojo) pero pensados para un botón clickeable.
 *  Siempre rellenos (no solo con borde) para que se distingan del fondo de la tarjeta sin
 *  depender de si están seleccionados o no. */
const NIVEL_FILTRO_COLOR: Record<NivelHerramienta, { fondo: string; texto: string; anillo: string }> = {
  1: { fondo: 'var(--color-surface-2)', texto: 'var(--color-primary)', anillo: 'var(--color-primary)' },
  2: { fondo: 'var(--color-primary)', texto: 'var(--color-primary-foreground)', anillo: 'var(--color-primary-strong)' },
  3: { fondo: 'var(--color-accent)', texto: 'var(--color-accent-foreground)', anillo: 'var(--color-accent-strong)' },
}

const VISTA_COLOR = {
  rutas: { fondo: 'var(--color-primary)', suave: 'var(--color-primary-soft)', texto: 'var(--color-primary)' },
  visuales: { fondo: 'var(--color-secondary)', suave: 'var(--color-secondary-soft)', texto: 'var(--color-secondary-strong)' },
} as const

type FiltroNivel = 'todos' | NivelHerramienta
type Vista = 'rutas' | 'visuales'

export default function BibliotecaPage() {
  const [filtro, setFiltro] = useState<FiltroNivel>('todos')
  const [vista, setVista] = useState<Vista>('rutas')
  const [searchParams] = useSearchParams()
  const rutaDestacada = searchParams.get('ruta')
  const seccionesRef = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    if (!rutaDestacada) return
    setVista('rutas')
    const el = seccionesRef.current[rutaDestacada]
    if (el) {
      const id = window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
      return () => window.clearTimeout(id)
    }
  }, [rutaDestacada])

  return (
    <FadeIn>
      <PageHeader
        title="Biblioteca de herramientas"
        subtitle="Una ficha por cada herramienta de las 8 rutas: qué es, para qué sirve y cómo aplicarla."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setVista('rutas')}
          className="flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all"
          style={
            vista === 'rutas'
              ? { background: VISTA_COLOR.rutas.fondo, borderColor: VISTA_COLOR.rutas.fondo, color: 'var(--color-primary-foreground)' }
              : { background: VISTA_COLOR.rutas.suave, borderColor: VISTA_COLOR.rutas.suave, color: VISTA_COLOR.rutas.texto }
          }
        >
          <BookOpen className="h-7 w-7 shrink-0" />
          <div>
            <p className="text-[18.5px] font-bold leading-tight">Por ruta</p>
            <p className="text-[14px] opacity-85">Las fichas agrupadas en las 8 rutas de estudio</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setVista('visuales')}
          className="flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all"
          style={
            vista === 'visuales'
              ? { background: VISTA_COLOR.visuales.fondo, borderColor: VISTA_COLOR.visuales.fondo, color: 'var(--color-secondary-foreground)' }
              : { background: VISTA_COLOR.visuales.suave, borderColor: VISTA_COLOR.visuales.suave, color: VISTA_COLOR.visuales.texto }
          }
        >
          <Sparkles className="h-7 w-7 shrink-0" />
          <div>
            <p className="text-[18.5px] font-bold leading-tight">Técnicas visuales</p>
            <p className="text-[14px] opacity-85">Técnicas con un ejemplo gráfico para probar</p>
          </div>
        </button>
      </div>

      {vista === 'visuales' && (
        <div className="space-y-5">
          <p className="text-[14px] text-muted-foreground">
            Técnicas con un ejemplo gráfico además de la explicación — probalas y quedate con las que te sirvan.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TECNICAS_VISUALES.map((t, i) => {
              const c = COLOR_CICLO[i % COLOR_CICLO.length]
              return (
                <Card key={t.id} className="flex flex-col border-t-[3px]" style={{ borderTopColor: c.color, boxShadow: `0 10px 20px -14px ${c.color}` }}>
                  <CardHeader>
                    <CardTitle className="text-[17.5px]">{t.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                    <VistaPreviaTecnica id={t.id} />
                    <p className="text-[14px] leading-relaxed text-muted-foreground">{t.resumen}</p>
                    <ol className="space-y-1 text-[13.5px] leading-relaxed text-muted-foreground">
                      {t.pasos.map((p, j) => (
                        <li key={j} className="flex gap-1.5">
                          <span className="shrink-0 font-semibold" style={{ color: c.color }}>
                            {j + 1}.
                          </span>
                          {p}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {vista === 'rutas' && (
      <>
      <div className="mb-6 rounded-xl border bg-surface p-4">
        <p className="mb-2.5 text-[14px] text-muted-foreground">
          El nivel es una complejidad orientativa, no una edad — depende de dónde estás vos ahora, no de cuántos años
          tenés. Si estás en el nivel Superior igual podés necesitar arrancar por Principiante.
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant={filtro === 'todos' ? 'default' : 'outline'} onClick={() => setFiltro('todos')}>
            Todos los niveles
          </Button>
          {([1, 2, 3] as NivelHerramienta[]).map((n) => {
            const c = NIVEL_FILTRO_COLOR[n]
            const activo = filtro === n
            return (
              <button
                key={n}
                type="button"
                onClick={() => setFiltro(n)}
                className="h-8 rounded-lg px-3.5 text-[15px] font-semibold shadow-sm transition-all"
                style={{
                  background: c.fondo,
                  color: c.texto,
                  outline: activo ? `2.5px solid ${c.anillo}` : '2.5px solid transparent',
                  outlineOffset: '2px',
                  opacity: filtro !== 'todos' && !activo ? 0.6 : 1,
                }}
              >
                {NIVEL_LABEL[n]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-8">
        {RUTAS.map((ruta) => {
          const fichas = (FICHAS_POR_RUTA[ruta.id] ?? []).filter((f) => filtro === 'todos' || f.nivel === filtro)
          const videos = VIDEOS.filter((v) => v.rutaId === ruta.id)
          if (fichas.length === 0 && videos.length === 0) return null
          const destacada = rutaDestacada === ruta.id
          return (
            <section
              key={ruta.id}
              id={`ruta-${ruta.id}`}
              ref={(el) => {
                seccionesRef.current[ruta.id] = el
              }}
              className={destacada ? 'scroll-mt-4 rounded-xl ring-2 ring-accent ring-offset-4 ring-offset-background transition-shadow' : 'scroll-mt-4'}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <BookOpen className="h-4 w-4" style={{ color: RUTA_COLOR[ruta.id]?.color }} />
                <h2 className="text-[19.5px] font-bold tracking-tight">{ruta.nombre}</h2>
                {destacada && <Badge variant="acento">Recomendada para vos</Badge>}
                <div className="flex flex-wrap gap-1">
                  {ruta.dimensiones.map((d) => (
                    <Badge key={d} variant="secundario" title={DIMENSIONES[d].nombre}>
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>

              {fichas.length > 0 &&
                NIVEL_ORDEN.filter((nivel) => fichas.some((f) => f.nivel === nivel)).map((nivel) => {
                  const fichasDelNivel = fichas.filter((f) => f.nivel === nivel)
                  return (
                    <div key={nivel} className="mb-5">
                      <div className="mb-2.5 flex items-center gap-2">
                        <Badge variant={NIVEL_BADGE_VARIANT[nivel]}>{NIVEL_LABEL[nivel]}</Badge>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="grid gap-3 lg:grid-cols-2">
                        {fichasDelNivel.map((ficha) => {
                          if (ficha.nivel === 1 && ficha.fraseSimple) {
                            const Icon = ficha.icon
                            return (
                              <Card key={ficha.herramienta} className="border-t-[3px]" style={moduleCardStyle(ruta.id)}>
                                <CardContent className="flex items-start gap-3 pt-4">
                                  {Icon && (
                                    <span
                                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                                      style={{ background: RUTA_COLOR[ruta.id]?.color }}
                                    >
                                      <Icon className="h-4.5 w-4.5" />
                                    </span>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[17.5px] font-semibold">{ficha.herramienta}</p>
                                    <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{ficha.fraseSimple}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          }
                          return (
                            <Card key={ficha.herramienta} className="border-t-[3px]" style={moduleCardStyle(ruta.id)}>
                              <CardHeader>
                                <CardTitle className="text-[17.5px]">{ficha.herramienta}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2 pt-0 text-[14px] leading-relaxed">
                                <p>
                                  <span className="font-semibold text-foreground">Qué es: </span>
                                  <span className="text-muted-foreground">{ficha.queEs}</span>
                                </p>
                                <p>
                                  <span className="font-semibold text-foreground">Para qué sirve: </span>
                                  <span className="text-muted-foreground">{ficha.paraQue}</span>
                                </p>
                                <p>
                                  <span className="font-semibold text-foreground">Cómo aplicarla: </span>
                                  <span className="text-muted-foreground">{ficha.comoAplicarla}</span>
                                </p>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}

              {videos.length > 0 && (
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {videos.map((v) => (
                    <div key={v.id} className="flex flex-col gap-2 rounded-xl border bg-surface-2 p-3.5">
                      <div className="flex items-center gap-1.5 text-faint">
                        <Clapperboard className="h-3.5 w-3.5" />
                        <span className="text-[12.5px] font-semibold uppercase tracking-wide">Video</span>
                      </div>
                      <p className="text-[14.5px] font-medium leading-snug">{v.titulo}</p>
                      <p className="text-[13.5px] text-muted-foreground">{v.descripcion}</p>
                      <Button variant="outline" size="sm" className="mt-1 w-fit" asChild>
                        <a href={v.url} target="_blank" rel="noopener noreferrer">
                          Ver video <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      <div className="mt-8 rounded-xl border bg-surface p-4">
        <div className="mb-2.5 flex items-center gap-2">
          <Printer className="h-4 w-4 text-primary" />
          <h2 className="text-[15.5px] font-semibold tracking-tight">Imprimibles</h2>
        </div>
        <p className="mb-3 text-[14px] text-muted-foreground">
          Materiales en blanco para imprimir y usar donde estudiás.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="#/print/acentuacion" target="_blank" rel="noopener noreferrer">
              Guía de acentuación <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="#/print/pasos-estudio" target="_blank" rel="noopener noreferrer">
              Etapas del estudio <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      <p className="mt-8 text-[13px] text-faint">
        Estas fichas son una guía rápida — probá, quedate con lo que te sirve y descartá lo que no. No hay una
        combinación "correcta" de herramientas, cada quien arma la propia.
      </p>
      </>
      )}
    </FadeIn>
  )
}
