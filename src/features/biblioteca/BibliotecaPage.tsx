import { useState } from 'react'
import { BookOpen, Clapperboard, ExternalLink, Printer } from 'lucide-react'
import { FadeIn, PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RUTAS } from '@/data/rutas'
import { FICHAS_POR_RUTA, type NivelHerramienta } from '@/data/biblioteca'
import { DIMENSIONES } from '@/data/items'
import { VIDEOS } from '@/data/videos'
import { moduleCardStyle, RUTA_COLOR } from '@/lib/moduleColors'

const NIVEL_LABEL: Record<NivelHerramienta, string> = {
  1: 'Principiante',
  2: 'Medio',
  3: 'Superior',
}

const NIVEL_BADGE_VARIANT: Record<NivelHerramienta, 'default' | 'primario' | 'acento'> = {
  1: 'default',
  2: 'primario',
  3: 'acento',
}

type FiltroNivel = 'todos' | NivelHerramienta

export default function BibliotecaPage() {
  const [filtro, setFiltro] = useState<FiltroNivel>('todos')

  return (
    <FadeIn>
      <PageHeader
        title="Biblioteca de herramientas"
        subtitle="Una ficha por cada herramienta de las 8 rutas: qué es, para qué sirve y cómo aplicarla."
      />

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
          return (
            <section key={ruta.id}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <BookOpen className="h-4 w-4" style={{ color: RUTA_COLOR[ruta.id]?.color }} />
                <h2 className="text-[15px] font-semibold tracking-tight">{ruta.nombre}</h2>
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
                              <Badge variant={NIVEL_BADGE_VARIANT[ficha.nivel]} className="text-muted-foreground">
                                {NIVEL_LABEL[ficha.nivel]}
                              </Badge>
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
    </FadeIn>
  )
}
