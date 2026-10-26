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

      <div className="mb-6 flex gap-1.5 border-b">
        <button
          type="button"
          onClick={() => setVista('rutas')}
          className={`border-b-2 px-3 py-2 text-[13px] font-medium transition-colors ${
            vista === 'rutas' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Por ruta
        </button>
        <button
          type="button"
          onClick={() => setVista('visuales')}
          className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-[13px] font-medium transition-colors ${
            vista === 'visuales' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" /> Técnicas visuales
        </button>
      </div>

      {vista === 'visuales' && (
        <div className="space-y-5">
          <p className="text-[12.5px] text-muted-foreground">
            Técnicas con un ejemplo gráfico además de la explicación — probalas y quedate con las que te sirvan.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TECNICAS_VISUALES.map((t, i) => {
              const c = COLOR_CICLO[i % COLOR_CICLO.length]
              return (
                <Card key={t.id} className="flex flex-col border-t-[3px]" style={{ borderTopColor: c.color, boxShadow: `0 10px 20px -14px ${c.color}` }}>
                  <CardHeader>
                    <CardTitle className="text-[14px]">{t.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                    <VistaPreviaTecnica id={t.id} />
                    <p className="text-[12.5px] leading-relaxed text-muted-foreground">{t.resumen}</p>
                    <ol className="space-y-1 text-[12px] leading-relaxed text-muted-foreground">
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
        <p className="mb-2.5 text-[12.5px] text-muted-foreground">
          El nivel es una complejidad orientativa, no una edad — depende de dónde estás vos ahora, no de cuántos años
          tenés. Si estás en el nivel Superior igual podés necesitar arrancar por Principiante.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(['todos', 1, 2, 3] as FiltroNivel[]).map((n) => (
            <Button
              key={n}
              size="sm"
              variant={filtro === n ? 'default' : 'outline'}
              onClick={() => setFiltro(n)}
            >
              {n === 'todos' ? 'Todos los niveles' : NIVEL_LABEL[n]}
            </Button>
          ))}
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
                <h2 className="text-[15px] font-semibold tracking-tight">{ruta.nombre}</h2>
                {destacada && <Badge variant="acento">Recomendada para vos</Badge>}
                <div className="flex flex-wrap gap-1">
                  {ruta.dimensiones.map((d) => (
                    <Badge key={d} variant="secundario" title={DIMENSIONES[d].nombre}>
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>

              {fichas.length > 0 && (
              <div className="grid gap-3 lg:grid-cols-2">
                {fichas.map((ficha) => {
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
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-[14px] font-semibold">{ficha.herramienta}</p>
                              <Badge variant={NIVEL_BADGE_VARIANT[ficha.nivel]}>{NIVEL_LABEL[ficha.nivel]}</Badge>
                            </div>
                            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{ficha.fraseSimple}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  }
                  return (
                    <Card key={ficha.herramienta} className="border-t-[3px]" style={moduleCardStyle(ruta.id)}>
                      <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <CardTitle className="text-[14px]">{ficha.herramienta}</CardTitle>
                          <Badge variant={NIVEL_BADGE_VARIANT[ficha.nivel]}>{NIVEL_LABEL[ficha.nivel]}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-0 text-[12.5px] leading-relaxed">
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
              )}

              {videos.length > 0 && (
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {videos.map((v) => (
                    <div key={v.id} className="flex flex-col gap-2 rounded-xl border bg-surface-2 p-3.5">
                      <div className="flex items-center gap-1.5 text-faint">
                        <Clapperboard className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-semibold uppercase tracking-wide">Video</span>
                      </div>
                      <p className="text-[13px] font-medium leading-snug">{v.titulo}</p>
                      <p className="text-[12px] text-muted-foreground">{v.descripcion}</p>
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
          <h2 className="text-[14px] font-semibold tracking-tight">Imprimibles</h2>
        </div>
        <p className="mb-3 text-[12.5px] text-muted-foreground">
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

      <p className="mt-8 text-[11.5px] text-faint">
        Estas fichas son una guía rápida — probá, quedate con lo que te sirve y descartá lo que no. No hay una
        combinación "correcta" de herramientas, cada quien arma la propia.
      </p>
      </>
      )}
    </FadeIn>
  )
}
