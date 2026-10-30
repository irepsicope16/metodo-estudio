import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ClipboardCheck, Clock, History, Timer, Trophy, X } from 'lucide-react'
import { useCrearEvaluacion, useEvaluaciones, useFichas, useResponderFicha } from '@/hooks/queries'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { IlustracionEvaluacion } from '@/components/shared/IlustracionesHerramientas'
import { IntroHerramienta } from '@/components/shared/IntroHerramienta'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NativeSelect } from '@/components/ui/input'
import type { Ficha } from '@/types'

function mmss(segundos: number) {
  const m = String(Math.floor(segundos / 60)).padStart(2, '0')
  const s = String(segundos % 60).padStart(2, '0')
  return `${m}:${s}`
}

function mezclar<T>(arr: T[]): T[] {
  const copia = [...arr]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

type Vista = 'config' | 'quiz' | 'resultado'

export default function EvaluacionPage() {
  const { data: fichas = [] } = useFichas()
  const { data: evaluaciones = [] } = useEvaluaciones()
  const responder = useResponderFicha()
  const crearEvaluacion = useCrearEvaluacion()

  const [vista, setVista] = useState<Vista>('config')
  const [temaElegido, setTemaElegido] = useState('todos')
  const [cantidadElegida, setCantidadElegida] = useState(10)

  const [cola, setCola] = useState<Ficha[]>([])
  const [indice, setIndice] = useState(0)
  const [vuelta, setVuelta] = useState(false)
  const [correctas, setCorrectas] = useState(0)
  const [inicio, setInicio] = useState(0)
  const [resultado, setResultado] = useState<{ correctas: number; total: number; segundos: number } | null>(null)

  const temas = useMemo(() => Array.from(new Set(fichas.map((f) => f.tema))).sort(), [fichas])
  const disponibles = temaElegido === 'todos' ? fichas : fichas.filter((f) => f.tema === temaElegido)
  const opcionesCantidad = [5, 10, 20].filter((n) => n < disponibles.length)
  if (disponibles.length > 0) opcionesCantidad.push(disponibles.length)

  function empezar() {
    const elegidas = mezclar(disponibles).slice(0, Math.min(cantidadElegida, disponibles.length))
    setCola(elegidas)
    setIndice(0)
    setVuelta(false)
    setCorrectas(0)
    setInicio(Date.now())
    setVista('quiz')
  }

  function responderActual(laSupo: boolean) {
    const actual = cola[indice]
    responder.mutate({ id: actual.id, caja: actual.caja, vecesRepasada: actual.vecesRepasada, laSupo })
    const nuevasCorrectas = correctas + (laSupo ? 1 : 0)
    setCorrectas(nuevasCorrectas)

    if (indice + 1 < cola.length) {
      setIndice(indice + 1)
      setVuelta(false)
      return
    }

    const segundos = Math.max(1, Math.round((Date.now() - inicio) / 1000))
    crearEvaluacion.mutate({
      tema: temaElegido,
      totalPreguntas: cola.length,
      correctas: nuevasCorrectas,
      duracionSegundos: segundos,
      fecha: new Date().toISOString(),
    })
    setResultado({ correctas: nuevasCorrectas, total: cola.length, segundos })
    setVista('resultado')
  }

  if (fichas.length === 0) {
    return (
      <FadeIn>
        <PageHeader title="Autoevaluación" subtitle="Ponete a prueba con tus propias fichas, cronometrado y sin mirar la respuesta." />
        <EmptyState
          icon={ClipboardCheck}
          title="Todavía no tenés fichas"
          description="Creá algunas en Fichas de repaso para poder armar una evaluación."
          action={
            <Button asChild size="sm">
              <Link to="/herramientas/fichas">Ir a Fichas de repaso</Link>
            </Button>
          }
        />
      </FadeIn>
    )
  }

  if (vista === 'quiz') {
    const actual = cola[indice]
    return (
      <FadeIn className="mx-auto max-w-xl space-y-4">
        <div className="flex items-center justify-between text-[14px] text-muted-foreground">
          <span>
            Pregunta {indice + 1} de {cola.length}
          </span>
          <span className="flex items-center gap-1">
            <Timer className="h-3.5 w-3.5" /> {temaElegido === 'todos' ? 'Todos los temas' : temaElegido}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(indice / cola.length) * 100}%` }}
          />
        </div>
        <Card className="min-h-[220px]">
          <CardContent className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-4 pt-6 text-center" onClick={() => setVuelta(true)}>
            <span className="text-[12.5px] font-semibold uppercase tracking-wide text-faint">{vuelta ? 'Respuesta' : 'Pregunta'}</span>
            <p className="text-[17.5px] font-medium leading-relaxed">{vuelta ? actual.respuesta : actual.pregunta}</p>
            {!vuelta && <p className="text-[13px] text-faint">Tocá para ver la respuesta</p>}
          </CardContent>
        </Card>
        {vuelta ? (
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => responderActual(false)}>
              <X className="h-4 w-4 text-danger" /> No la sabía
            </Button>
            <Button className="flex-1" onClick={() => responderActual(true)}>
              <Check className="h-4 w-4" /> La sabía
            </Button>
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => setVuelta(true)}>
            Mostrar respuesta
          </Button>
        )}
        <Button variant="ghost" size="sm" className="w-full" onClick={() => setVista('config')}>
          Salir sin terminar
        </Button>
      </FadeIn>
    )
  }

  if (vista === 'resultado' && resultado) {
    const porcentaje = Math.round((resultado.correctas / resultado.total) * 100)
    return (
      <FadeIn className="mx-auto max-w-md space-y-5 text-center">
        <Trophy className="mx-auto h-10 w-10" style={{ color: 'var(--color-accent)' }} />
        <div>
          <p className="text-[37.5px] font-bold leading-none tracking-tight">{porcentaje}%</p>
          <p className="mt-1 text-[14.5px] text-muted-foreground">
            {resultado.correctas} de {resultado.total} correctas · {mmss(resultado.segundos)}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" onClick={empezar}>
            Repetir
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setVista('config')}>
            Nueva evaluación
          </Button>
        </div>
      </FadeIn>
    )
  }

  return (
    <FadeIn className="space-y-5">
      <PageHeader title="Autoevaluación" subtitle="Ponete a prueba con tus propias fichas, cronometrado y sin mirar la respuesta." />

      <IntroHerramienta
        clave="evaluacion"
        queEs="Un examen armado con tus propias fichas: te pregunta, cronometra cuánto tardás y al final te muestra el puntaje."
        comoSeHace={[
          'Elegí el tema y cuántas preguntas querés.',
          'Tocá «Empezar evaluación» y pensá la respuesta de cada pregunta.',
          'Tocá «Mostrar respuesta» y marcá si la sabías o no.',
          'Al terminar la última, ves tu porcentaje y el tiempo que tardaste, y queda en tu historial.',
        ]}
        ejemplo="10 preguntas del tema «Historia» → 8 de 10 correctas en 4:32."
        ilustracion={<IlustracionEvaluacion />}
      />

      <Card>
        <CardContent className="space-y-4 pt-5">
          <div>
            <p className="mb-1.5 text-[14px] font-medium">Tema</p>
            <NativeSelect value={temaElegido} onChange={(e) => setTemaElegido(e.target.value)}>
              <option value="todos">Todos los temas ({fichas.length} fichas)</option>
              {temas.map((t) => (
                <option key={t} value={t}>
                  {t} ({fichas.filter((f) => f.tema === t).length})
                </option>
              ))}
            </NativeSelect>
          </div>

          {disponibles.length > 0 && (
            <div>
              <p className="mb-1.5 text-[14px] font-medium">Cantidad de preguntas</p>
              <div className="flex flex-wrap gap-1.5">
                {opcionesCantidad.map((n) => (
                  <Button
                    key={n}
                    size="sm"
                    variant={cantidadElegida === n || (n === disponibles.length && cantidadElegida > disponibles.length) ? 'default' : 'outline'}
                    onClick={() => setCantidadElegida(n)}
                  >
                    {n === disponibles.length ? `Todas (${n})` : n}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button className="w-full" disabled={disponibles.length === 0} onClick={empezar}>
            <ClipboardCheck /> Empezar evaluación
          </Button>
        </CardContent>
      </Card>

      {evaluaciones.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[14.5px] font-semibold">
            <History className="h-4 w-4" /> Evaluaciones anteriores
          </div>
          <div className="space-y-1.5">
            {evaluaciones.slice(0, 8).map((e) => {
              const pct = Math.round((e.correctas / e.totalPreguntas) * 100)
              return (
                <div key={e.id} className="flex items-center gap-3 rounded-lg border bg-surface px-3 py-2 text-[14px]">
                  <span className="w-[76px] shrink-0 text-faint">
                    {new Date(e.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">{e.tema === 'todos' ? 'Todos los temas' : e.tema}</span>
                  <span className="flex items-center gap-1 text-faint">
                    <Clock className="h-3 w-3" /> {mmss(e.duracionSegundos)}
                  </span>
                  <span className="w-10 shrink-0 text-right font-semibold" style={{ color: pct >= 70 ? 'var(--color-mod-regular)' : pct >= 40 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                    {pct}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </FadeIn>
  )
}
