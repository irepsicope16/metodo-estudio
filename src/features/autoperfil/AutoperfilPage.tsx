import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, RefreshCcw } from 'lucide-react'
import { useOpenAnswers, useResponses, useSaveOpenAnswer, useSaveResponse, useSaveSnapshot, useSnapshots } from '@/hooks/queries'
import { DIMENSIONES, ITEMS, VERSION_CUESTIONARIO, itemsDeDimension } from '@/data/items'
import { PREGUNTAS_ABIERTAS } from '@/data/preguntasAbiertas'
import { MENSAJES } from '@/data/mensajes'
import { RUTAS } from '@/data/rutas'
import { calcularNecesidadDimension, ETIQUETA_BANDA } from '@/features/engine/estudioEngine'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AvisoOrientativo, FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { DIMENSION_COLOR, RUTA_COLOR, dimensionCardStyle } from '@/lib/moduleColors'
import type { BandaNecesidad, DimensionId } from '@/types'

const DIMENSION_IDS = Object.keys(DIMENSIONES) as DimensionId[]
const ESCALA = [
  { valor: 0 as const, label: 'Nunca o casi nunca' },
  { valor: 1 as const, label: 'A veces' },
  { valor: 2 as const, label: 'Frecuentemente' },
  { valor: 3 as const, label: 'Casi siempre' },
]

const BADGE_POR_BANDA: Record<BandaNecesidad, 'default' | 'secundario' | 'amber' | 'acento'> = {
  baja: 'default',
  leve: 'secundario',
  moderada: 'amber',
  alta: 'acento',
}

export default function AutoperfilPage() {
  const { data: responses = [] } = useResponses()
  const saveResponse = useSaveResponse()
  const { data: openAnswers = [] } = useOpenAnswers()
  const saveOpenAnswer = useSaveOpenAnswer()
  const { data: snapshots = [] } = useSnapshots()
  const saveSnapshot = useSaveSnapshot()

  const [step, setStep] = useState(0) // 0..7 dimensiones, 8 = preguntas abiertas, 9 = resultados
  const totalSteps = DIMENSION_IDS.length + 1

  const respondidos = new Set(responses.map((r) => r.itemId)).size
  const progresoGlobal = Math.round((respondidos / ITEMS.length) * 100)
  const completo = respondidos >= ITEMS.length

  function valorDe(itemId: string) {
    return responses.find((r) => r.itemId === itemId)
  }

  async function responder(itemId: string, valor: 0 | 1 | 2 | 3 | null) {
    const existing = valorDe(itemId)
    await saveResponse.mutateAsync({ versionId: VERSION_CUESTIONARIO, itemId, valor, existingId: existing?.id })
  }

  async function calcularYGuardarResultados() {
    for (const dimension of DIMENSION_IDS) {
      const { promedio, completitud, banda } = calcularNecesidadDimension(dimension, responses)
      const existing = snapshots.find((s) => s.dimension === dimension)
      await saveSnapshot.mutateAsync({
        dimension,
        versionId: VERSION_CUESTIONARIO,
        promedioNecesidad: promedio,
        completitud,
        banda,
        generadoEl: new Date().toISOString(),
        existingId: existing?.id,
      })
    }
    setStep(DIMENSION_IDS.length + 1)
  }

  if (step >= DIMENSION_IDS.length + 1) {
    return <ResultadosAutoperfil onVolver={() => setStep(0)} />
  }

  if (step < DIMENSION_IDS.length) {
    const dimension = DIMENSION_IDS[step]
    const items = itemsDeDimension(dimension)
    const completosEnDimension = items.filter((i) => valorDe(i.codigo)).length
    const colorArea = DIMENSION_COLOR[dimension]

    return (
      <FadeIn className="space-y-4">
        <PageHeader title="Mi autoperfil" subtitle="56 preguntas cortas, organizadas en 8 áreas. Podés pausar y retomar cuando quieras." />
        <AvisoOrientativo>{MENSAJES.antesDelPerfil}</AvisoOrientativo>
        <Card
          className="border-t-[3px]"
          style={{ borderTopColor: colorArea?.color, boxShadow: colorArea ? `0 10px 20px -14px ${colorArea.color}` : undefined }}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {dimension} · {DIMENSIONES[dimension].nombre}
              </CardTitle>
              <span className="text-[12px] text-faint">{step + 1} / {totalSteps}</span>
            </div>
            <Progress value={(completosEnDimension / items.length) * 100} className="mt-2" />
            <CardDescription className="mt-1">
              Escala: 0 Nunca o casi nunca · 1 A veces · 2 Frecuentemente · 3 Casi siempre.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {items.map((item) => {
              const r = valorDe(item.codigo)
              return (
                <div
                  key={item.codigo}
                  className="rounded-lg border-l-[3px] bg-surface p-3"
                  style={{ borderLeftColor: colorArea?.color, backgroundColor: colorArea?.soft }}
                >
                  <p className="mb-2.5 text-[15.5px] font-semibold leading-snug" style={{ color: colorArea?.color }}>
                    {item.enunciado}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ESCALA.map((op) => (
                      <button
                        key={op.valor}
                        type="button"
                        onClick={() => responder(item.codigo, op.valor)}
                        className={cn(
                          'rounded-full border px-3 py-1 text-[12px] font-medium transition-colors',
                          r?.valor === op.valor ? 'border-primary bg-primary-soft text-primary-strong' : 'hover:bg-surface-2',
                        )}
                      >
                        {op.valor} · {op.label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
        <div className="flex justify-between">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Anterior
          </Button>
          <Button onClick={() => setStep((s) => s + 1)}>{step === DIMENSION_IDS.length - 1 ? 'Ir a preguntas abiertas' : 'Siguiente área'}</Button>
        </div>
        <p className="text-[12px] text-faint">Progreso global: {progresoGlobal}%. Se guarda automáticamente.</p>
      </FadeIn>
    )
  }

  return (
    <PreguntasAbiertasStep
      openAnswers={openAnswers}
      saveOpenAnswer={saveOpenAnswer}
      completo={completo}
      onBack={() => setStep((s) => s - 1)}
      onVerResultados={calcularYGuardarResultados}
    />
  )
}

function PreguntasAbiertasStep({
  openAnswers,
  saveOpenAnswer,
  completo,
  onBack,
  onVerResultados,
}: {
  openAnswers: ReturnType<typeof useOpenAnswers>['data']
  saveOpenAnswer: ReturnType<typeof useSaveOpenAnswer>
  completo: boolean
  onBack: () => void
  onVerResultados: () => Promise<void>
}) {
  const respuestasIniciales = useMemo(() => {
    const map: Record<string, string> = {}
    for (const a of openAnswers ?? []) map[a.preguntaId] = a.texto
    return map
  }, [openAnswers])
  const [textos, setTextos] = useState<Record<string, string>>(respuestasIniciales)
  const [calculando, setCalculando] = useState(false)

  useEffect(() => {
    setTextos((prev) => ({ ...respuestasIniciales, ...prev }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAnswers])

  async function guardar() {
    for (const p of PREGUNTAS_ABIERTAS) {
      const existing = openAnswers?.find((a) => a.preguntaId === p.id)
      const texto = textos[p.id] ?? ''
      if (!texto && !existing) continue
      await saveOpenAnswer.mutateAsync({ preguntaId: p.id, texto, existingId: existing?.id })
    }
    toast.success('Respuestas guardadas')
  }

  return (
    <FadeIn>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <CardTitle>Para terminar, en tus palabras</CardTitle>
          </div>
          <CardDescription>Últimas preguntas del autoperfil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {PREGUNTAS_ABIERTAS.map((p) => (
            <div key={p.id}>
              <label className="mb-1.5 block text-[13px] font-medium">{p.texto}</label>
              <Textarea
                value={textos[p.id] ?? ''}
                onChange={(e) => setTextos((prev) => ({ ...prev, [p.id]: e.target.value }))}
              />
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button variant="outline" onClick={onBack}>
              Volver a las áreas
            </Button>
            <div className="flex gap-2">
              <Button variant="soft" onClick={guardar} disabled={saveOpenAnswer.isPending}>
                {saveOpenAnswer.isPending ? 'Guardando…' : 'Guardar respuestas'}
              </Button>
              {completo && (
                <Button
                  onClick={async () => {
                    setCalculando(true)
                    await onVerResultados()
                    setCalculando(false)
                  }}
                  disabled={calculando}
                >
                  {calculando ? 'Calculando…' : 'Ver mis resultados'}
                </Button>
              )}
            </div>
          </div>
          {!completo && (
            <p className="text-[12px] text-faint">
              Todavía te faltan preguntas en alguna área para poder ver los resultados — volvé a las áreas y completalas.
            </p>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  )
}

function ResultadosAutoperfil({ onVolver }: { onVolver: () => void }) {
  const { data: snapshots = [] } = useSnapshots()

  const ordenados = [...snapshots].sort((a, b) => {
    const orden: Record<string, number> = { alta: 0, moderada: 1, leve: 2, baja: 3 }
    return (orden[a.banda ?? 'baja'] ?? 4) - (orden[b.banda ?? 'baja'] ?? 4)
  })

  return (
    <FadeIn className="space-y-5">
      <PageHeader title="Tus resultados" subtitle={MENSAJES.resultado} />
      <div className="grid gap-3 lg:grid-cols-2">
        {ordenados.map((snap) => {
          const rutasSugeridas = RUTAS.filter((r) => r.dimensiones.includes(snap.dimension))
          return (
            <Card key={snap.dimension} className="border-t-[3px]" style={dimensionCardStyle(snap.dimension)}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-[14px]">
                    {snap.dimension} · {DIMENSIONES[snap.dimension].nombre}
                  </CardTitle>
                  {snap.banda && <Badge variant={BADGE_POR_BANDA[snap.banda]}>{snap.banda}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                <p className="text-[12.5px] text-muted-foreground">
                  {snap.banda ? ETIQUETA_BANDA[snap.banda] : 'Te faltó completar suficientes preguntas de esta área.'}
                </p>
                {rutasSugeridas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {rutasSugeridas.map((r) => (
                      <Link
                        key={r.id}
                        to="/biblioteca"
                        className="rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-colors hover:bg-surface-2"
                        style={{ borderTopColor: RUTA_COLOR[r.id]?.color, borderTopWidth: 2 }}
                      >
                        {r.nombre}
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onVolver}>
          <RefreshCcw className="h-3.5 w-3.5" /> Volver a responder
        </Button>
        <Button asChild>
          <Link to="/actividades">Ver actividades sugeridas</Link>
        </Button>
      </div>
    </FadeIn>
  )
}
