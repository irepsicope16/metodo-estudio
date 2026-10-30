import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Gamepad2, MousePointerClick, PartyPopper } from 'lucide-react'
import { useFichas } from '@/hooks/queries'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { IlustracionMemotest } from '@/components/shared/IlustracionesHerramientas'
import { IntroHerramienta } from '@/components/shared/IntroHerramienta'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NativeSelect } from '@/components/ui/input'
import { cn } from '@/lib/utils'
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

interface Carta {
  id: string
  fichaId: string
  texto: string
  tipo: 'pregunta' | 'respuesta'
}

type Vista = 'config' | 'juego' | 'victoria'

export default function MemotestPage() {
  const { data: fichas = [] } = useFichas()

  const [vista, setVista] = useState<Vista>('config')
  const [temaElegido, setTemaElegido] = useState('todos')
  const [paresElegidos, setParesElegidos] = useState(6)

  const [cartas, setCartas] = useState<Carta[]>([])
  const [volteadas, setVolteadas] = useState<string[]>([])
  const [resueltas, setResueltas] = useState<Set<string>>(new Set())
  const [intentos, setIntentos] = useState(0)
  const [inicio, setInicio] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)
  const [tiempoFinal, setTiempoFinal] = useState(0)

  const temas = useMemo(() => Array.from(new Set(fichas.map((f) => f.tema))).sort(), [fichas])
  const disponibles = temaElegido === 'todos' ? fichas : fichas.filter((f) => f.tema === temaElegido)
  const opcionesPares = [4, 6, 8].filter((n) => n <= disponibles.length)
  if (disponibles.length > 0 && !opcionesPares.includes(disponibles.length) && disponibles.length < 8) {
    opcionesPares.push(disponibles.length)
  }

  function empezar() {
    const elegidas: Ficha[] = mezclar(disponibles).slice(0, Math.min(paresElegidos, disponibles.length))
    const nuevasCartas: Carta[] = elegidas.flatMap((f) => [
      { id: `${f.id}-p`, fichaId: f.id, texto: f.pregunta, tipo: 'pregunta' as const },
      { id: `${f.id}-r`, fichaId: f.id, texto: f.respuesta, tipo: 'respuesta' as const },
    ])
    setCartas(mezclar(nuevasCartas))
    setVolteadas([])
    setResueltas(new Set())
    setIntentos(0)
    setInicio(Date.now())
    setBloqueado(false)
    setVista('juego')
  }

  function tocarCarta(carta: Carta) {
    if (bloqueado || resueltas.has(carta.fichaId) || volteadas.includes(carta.id)) return
    const nuevasVolteadas = [...volteadas, carta.id]
    setVolteadas(nuevasVolteadas)
    if (nuevasVolteadas.length < 2) return

    setBloqueado(true)
    setIntentos((n) => n + 1)
    const [idA, idB] = nuevasVolteadas
    const cartaA = cartas.find((c) => c.id === idA)!
    const cartaB = cartas.find((c) => c.id === idB)!

    if (cartaA.fichaId === cartaB.fichaId) {
      const nuevasResueltas = new Set(resueltas)
      nuevasResueltas.add(cartaA.fichaId)
      setTimeout(() => {
        setResueltas(nuevasResueltas)
        setVolteadas([])
        setBloqueado(false)
        if (nuevasResueltas.size === cartas.length / 2) {
          setTiempoFinal(Math.max(1, Math.round((Date.now() - inicio) / 1000)))
          setVista('victoria')
        }
      }, 500)
    } else {
      setTimeout(() => {
        setVolteadas([])
        setBloqueado(false)
      }, 900)
    }
  }

  if (fichas.length === 0) {
    return (
      <FadeIn>
        <PageHeader title="Memotest" subtitle="Emparejá cada pregunta con su respuesta, contra el reloj." />
        <EmptyState
          icon={Gamepad2}
          title="Todavía no tenés fichas"
          description="Creá algunas en Fichas de repaso para poder jugar."
          action={
            <Button asChild size="sm">
              <Link to="/herramientas/fichas">Ir a Fichas de repaso</Link>
            </Button>
          }
        />
      </FadeIn>
    )
  }

  if (vista === 'juego') {
    const totalPares = cartas.length / 2
    const cols = cartas.length <= 8 ? 4 : cartas.length <= 12 ? 4 : 6
    return (
      <FadeIn className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[14px] text-muted-foreground">
          <span>
            {resueltas.size} de {totalPares} pares
          </span>
          <span className="flex items-center gap-1">
            <MousePointerClick className="h-3.5 w-3.5" /> {intentos} intentos
          </span>
        </div>
        <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {cartas.map((c) => {
            const resuelta = resueltas.has(c.fichaId)
            const volteada = volteadas.includes(c.id) || resuelta
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => tocarCarta(c)}
                disabled={resuelta}
                className={cn(
                  'flex min-h-[92px] items-center justify-center rounded-xl border p-2 text-center text-[13px] leading-snug transition-all sm:min-h-[110px] sm:text-[14px]',
                  resuelta
                    ? 'border-mod-regular bg-mod-regular-soft text-foreground'
                    : volteada
                      ? 'bg-surface text-foreground shadow-sm'
                      : 'cursor-pointer bg-primary text-primary-foreground hover:opacity-90',
                )}
              >
                {volteada ? c.texto : ''}
              </button>
            )
          })}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setVista('config')}>
          Salir del juego
        </Button>
      </FadeIn>
    )
  }

  if (vista === 'victoria') {
    return (
      <FadeIn className="mx-auto max-w-md space-y-5 text-center">
        <PartyPopper className="mx-auto h-10 w-10" style={{ color: 'var(--color-accent)' }} />
        <div>
          <p className="text-[23.5px] font-semibold">¡Completado!</p>
          <p className="mt-1 text-[14.5px] text-muted-foreground">
            {intentos} intentos · {mmss(tiempoFinal)}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" onClick={empezar}>
            Jugar de nuevo
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setVista('config')}>
            Cambiar opciones
          </Button>
        </div>
      </FadeIn>
    )
  }

  return (
    <FadeIn className="space-y-5">
      <PageHeader title="Memotest" subtitle="Emparejá cada pregunta con su respuesta, contra el reloj." />
      <IntroHerramienta
        clave="memotest"
        queEs="El clásico juego de memoria, pero con tus fichas: hay que encontrar la pregunta que hace pareja con su respuesta."
        comoSeHace={[
          'Elegí el tema y cuántos pares querés jugar.',
          'Tocá «Jugar» y empezá a dar vuelta cartas, de a dos.',
          'Si la pregunta y la respuesta coinciden, quedan boca arriba; si no, se vuelven a tapar.',
          'Encontrá todos los pares — cuantos menos intentos y menos tiempo, mejor.',
        ]}
        ejemplo="Carta «¿Capital de Francia?» + carta «París» forman un par."
        ilustracion={<IlustracionMemotest />}
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
              <p className="mb-1.5 text-[14px] font-medium">Cantidad de pares</p>
              <div className="flex flex-wrap gap-1.5">
                {opcionesPares.map((n) => (
                  <Button key={n} size="sm" variant={paresElegidos === n ? 'default' : 'outline'} onClick={() => setParesElegidos(n)}>
                    {n}
                  </Button>
                ))}
              </div>
              {disponibles.length < 4 && (
                <p className="mt-1.5 text-[13px] text-faint">Con menos de 4 fichas el juego es muy corto — creá alguna más si querés.</p>
              )}
            </div>
          )}

          <Button className="w-full" disabled={disponibles.length === 0} onClick={empezar}>
            <Gamepad2 /> Jugar
          </Button>
        </CardContent>
      </Card>
    </FadeIn>
  )
}
